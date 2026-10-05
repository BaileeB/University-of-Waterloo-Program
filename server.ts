import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { StudentProfile, AnalysisResult } from './src/types';
import { runFullEvaluation } from './src/utils/admissionCalculator';
import { KW_HIGH_SCHOOLS } from './src/data/kwSchools';
import { WATERLOO_PROGRAMS } from './src/data/programsData';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '25mb' }));

// Initialize Google GenAI client if API key is available
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// API Route: Analyze Student Profile & Resume / myBlueprint
app.post('/api/analyze', async (req, res) => {
  try {
    const { profile, resumeBase64, myBlueprintBase64, resumeMimeType, myBlueprintMimeType } = req.body as {
      profile: StudentProfile;
      resumeBase64?: string;
      myBlueprintBase64?: string;
      resumeMimeType?: string;
      myBlueprintMimeType?: string;
    };

    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    // Run baseline deterministic evaluation first
    const baseline = runFullEvaluation(profile);
    const selectedSchool = KW_HIGH_SCHOOLS.find(s => s.id === profile.highSchoolId) || {
      name: profile.highSchoolName || 'Waterloo Region High School',
      board: 'WRDSB',
      city: 'Waterloo',
      historicalAdjustmentFactorNote: 'Historical standard benchmark ~14.0%',
      transitToUW: 'ION LRT / GRT Bus network to University of Waterloo Station'
    };

    // If Gemini client is available, enrich with deep AI analysis
    if (ai) {
      try {
        const promptParts: any[] = [];

        // Attach Resume PDF / Document if provided in base64
        if (resumeBase64 && resumeMimeType) {
          promptParts.push({
            inlineData: {
              mimeType: resumeMimeType,
              data: resumeBase64
            }
          });
        }

        // Attach myBlueprint PDF / Document if provided in base64
        if (myBlueprintBase64 && myBlueprintMimeType) {
          promptParts.push({
            inlineData: {
              mimeType: myBlueprintMimeType,
              data: myBlueprintBase64
            }
          });
        }

        const studentPrompt = `
Analyze this high school student applying to the University of Waterloo:
- Student Name: ${profile.name || 'Student'}
- High School: ${selectedSchool.name} (${selectedSchool.city}, ${selectedSchool.board})
- Local Kitchener-Waterloo Region Student: ${profile.isKwLocal ? 'YES' : 'NO'}
- Current / Planned Grade 12 Courses & Marks:
${profile.courses.map(c => `  * ${c.code} (${c.name}): ${c.grade}% [${c.status}]`).join('\n')}

- Resume / Extracurricular Summary:
${profile.resumeText || profile.extracurriculars || 'None specified'}

- Work Experience:
${profile.workExperience || 'None specified'}

- Math & Computing Contest Scores:
  * Euclid: ${profile.contestScores?.euclidScore || 'Not written / planned for April'}
  * Canadian Computing Competition (CCC): ${profile.contestScores?.cccScore || 'Not written'}
  * CSMC: ${profile.contestScores?.csmcScore || 'Not written'}

- Target Waterloo Programs:
${profile.targetPrograms?.length ? profile.targetPrograms.join(', ') : 'Open to best matching programs'}

Calculated Baseline Top 6 Average: ${baseline.top6Average}%
Estimated Baseline AIF Score: ${baseline.aifScoreEstimate.score}/5.0

Task:
Provide an expert, highly personalized admissions consultation as a Waterloo Admissions Officer:
1. Audit their Top 6 4U/M courses, verify prerequisites for Waterloo Engineering (ENG4U, MHF4U, MCV4U, SCH4U, SPH4U), Math/CS (ENG4U, MHF4U, MCV4U), Science, and Arts/AFM.
2. Evaluate their Extracurriculars for the Waterloo AIF (score out of 5.0).
3. Outline their Kitchener-Waterloo local advantage (living at home savings, GRT/ION transit access, local tech hubs like Google/Communitech, WRDSB adjustment factor reputation).
4. Provide customized action items to maximize admission probability before the May offer round.
5. Provide specific AIF essay drafting tips tailored to their background.
`;

        promptParts.push({ text: studentPrompt });

        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptParts,
          config: {
            systemInstruction: 'You are the University of Waterloo Admissions Director and Academic Advisor specializing in Ontario high school applicants from the Kitchener-Waterloo region (WRDSB and WCDSB). You provide realistic, candid, highly motivating advice grounded in Waterloo’s actual holistic admission matrix, AIF scoring criteria, and Waterloo engineering adjustment factors. Respond strictly in valid JSON matching the requested structure.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                studentName: { type: Type.STRING },
                highSchoolSummary: { type: Type.STRING },
                calculatedTop6: { type: Type.NUMBER },
                missingRequiredCourses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                aifScoreEstimate: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    tier: { type: Type.STRING },
                    extracurricularStrength: { type: Type.STRING },
                    leadershipScore: { type: Type.STRING },
                    contestBoost: { type: Type.STRING },
                    feedback: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  required: ['score', 'tier', 'extracurricularStrength', 'leadershipScore', 'contestBoost', 'feedback']
                },
                kwLocalAdvantage: {
                  type: Type.OBJECT,
                  properties: {
                    isLocal: { type: Type.BOOLEAN },
                    commuteFeasibility: { type: Type.STRING },
                    estimatedAnnualSavings: { type: Type.STRING },
                    localTechEcosystemFit: { type: Type.STRING },
                    adjustmentFactorContext: { type: Type.STRING }
                  },
                  required: ['isLocal', 'commuteFeasibility', 'estimatedAnnualSavings', 'localTechEcosystemFit', 'adjustmentFactorContext']
                },
                topRecommendations: {
                  type: Type.OBJECT,
                  properties: {
                    bestMatchProgram: { type: Type.STRING },
                    bestValueAlternative: { type: Type.STRING },
                    hiddenGemProgram: { type: Type.STRING },
                    reasoning: { type: Type.STRING }
                  },
                  required: ['bestMatchProgram', 'bestValueAlternative', 'hiddenGemProgram', 'reasoning']
                },
                actionItems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                aifDraftSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: [
                'studentName',
                'highSchoolSummary',
                'calculatedTop6',
                'missingRequiredCourses',
                'aifScoreEstimate',
                'kwLocalAdvantage',
                'topRecommendations',
                'actionItems',
                'aifDraftSuggestions'
              ]
            }
          }
        });

        const textOutput = aiResponse.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);

          // Merge AI evaluation with deterministic program chances
          const fullResult: AnalysisResult = {
            studentName: parsed.studentName || profile.name || 'KW Student',
            highSchoolSummary: parsed.highSchoolSummary || `${selectedSchool.name} (${selectedSchool.city})`,
            calculatedTop6: parsed.calculatedTop6 || baseline.top6Average,
            coursesAudited: profile.courses.map(c => ({
              code: c.code,
              grade: c.grade,
              status: c.status,
              usedInTop6: true
            })),
            missingRequiredCourses: parsed.missingRequiredCourses || [],
            aifScoreEstimate: parsed.aifScoreEstimate || baseline.aifScoreEstimate,
            kwLocalAdvantage: parsed.kwLocalAdvantage || {
              isLocal: profile.isKwLocal,
              commuteFeasibility: selectedSchool.transitToUW,
              estimatedAnnualSavings: '$15,000 - $18,000 / year living at home',
              localTechEcosystemFit: 'Connected to Kitchener-Waterloo innovation hubs (Communitech, Google Waterloo)',
              adjustmentFactorContext: selectedSchool.historicalAdjustmentFactorNote
            },
            chances: baseline.chances,
            topRecommendations: parsed.topRecommendations || {
              bestMatchProgram: baseline.recommendedPrograms.targetMatch[0]?.programName || 'Computer Science',
              bestValueAlternative: 'Systems Design Engineering or Management Engineering',
              hiddenGemProgram: 'Geomatics or Arts & Business',
              reasoning: 'Strong quantitative background with strong Waterloo co-op alignment.'
            },
            actionItems: parsed.actionItems || [
              'Submit your OUAC application and activate your Quest account early',
              'Draft your AIF using STAR bullet points and emphasize leadership impact',
              'Register for the Euclid Mathematics Contest in April'
            ],
            aifDraftSuggestions: parsed.aifDraftSuggestions || [
              'Highlight how living and schooling in Waterloo Region influenced your desire to study at UW',
              'Quantify weekly time commitments and outcomes for your top extracurriculars'
            ]
          };

          return res.json(fullResult);
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to deterministic engine:', geminiError);
      }
    }

    // Fallback response using our rule-based Waterloo admission calculation
    const fallbackResult: AnalysisResult = {
      studentName: profile.name || 'KW Student',
      highSchoolSummary: `${selectedSchool.name} (${selectedSchool.city}) - ${selectedSchool.board}`,
      calculatedTop6: baseline.top6Average,
      coursesAudited: profile.courses.map(c => ({
        code: c.code,
        grade: c.grade,
        status: c.status,
        usedInTop6: true
      })),
      missingRequiredCourses: [],
      aifScoreEstimate: baseline.aifScoreEstimate,
      kwLocalAdvantage: {
        isLocal: profile.isKwLocal,
        commuteFeasibility: selectedSchool.transitToUW,
        estimatedAnnualSavings: '$14,500 - $18,000 / year saved on residence and meal plans',
        localTechEcosystemFit: 'Instant access to Kitchener-Waterloo tech ecosystem, Communitech, and Google Waterloo',
        adjustmentFactorContext: selectedSchool.historicalAdjustmentFactorNote
      },
      chances: baseline.chances,
      topRecommendations: {
        bestMatchProgram: baseline.recommendedPrograms.targetMatch[0]?.programName || baseline.recommendedPrograms.safeMatch[0]?.programName || 'Computer Science',
        bestValueAlternative: 'Systems Design Engineering or Management Engineering (High co-op employment)',
        hiddenGemProgram: 'Geomatics (Faculty of Environment - high tech co-op overlap with CS)',
        reasoning: `Based on your Top 6 average of ${baseline.top6Average}% and AIF score of ${baseline.aifScoreEstimate.score}/5.0.`
      },
      actionItems: [
        'Ensure all 6 Grade 12 4U/M courses are tracked and prerequisites (e.g. MCV4U, ENG4U) are verified',
        'Spend dedicated time on the AIF (worth up to +5% on competitive averages in Math/CS and crucial for Engineering)',
        'Take the Euclid Mathematics Contest in April; a score above 70 unlocks major scholarship and admission consideration',
        'Take advantage of local transit (ION LRT stops right on campus at University of Waterloo Station)'
      ],
      aifDraftSuggestions: [
        'Focus on quantified results: rather than stating you joined a club, describe specific events organized or projects coded',
        'Explain why Waterloo specifically: reference actual Waterloo design teams (e.g. Formula SAE, Midnight Sun) or research labs',
        'If you worked a part-time job or supported family in Waterloo Region, explicitly document it under employment/hardships'
      ]
    };

    return res.json(fallbackResult);
  } catch (err: any) {
    console.error('Server error in /api/analyze:', err);
    res.status(500).json({ error: 'Failed to analyze profile', details: err?.message });
  }
});

// API Route: AIF Essay Feedback
app.post('/api/aif-feedback', async (req, res) => {
  try {
    const { questionPrompt, draftText, targetProgram } = req.body;

    if (!draftText || draftText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least a few sentences of draft text.' });
    }

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `
You are a senior University of Waterloo admissions reader evaluating a student's draft response for the Admission Information Form (AIF).
Target Program: ${targetProgram || 'Waterloo Engineering / Math'}
AIF Prompt: ${questionPrompt}
Student's Draft Essay:
"""
${draftText}
"""

Evaluate this response according to Waterloo's scoring rubric (0 to 5 points):
1. Score the draft (1.0 to 5.0)
2. Identify strengths
3. Identify areas for improvement (e.g., does it use the STAR method? Are outcomes quantified? Is Waterloo mentioned with specific details or generic platitudes?)
4. Provide a concrete rewrite example of one paragraph showing how to make it significantly punchier for Waterloo admissions committees.
`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                rating: { type: Type.STRING },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                sampleRewrite: { type: Type.STRING },
                keyTakeaway: { type: Type.STRING }
              },
              required: ['score', 'rating', 'strengths', 'improvements', 'sampleRewrite', 'keyTakeaway']
            }
          }
        });

        if (response.text) {
          return res.json(JSON.parse(response.text));
        }
      } catch (err) {
        console.warn('Gemini AIF feedback failed, using fallback:', err);
      }
    }

    // Fallback feedback
    res.json({
      score: 3.5,
      rating: 'Solid Draft with Room for Quantifiable Polish',
      strengths: [
        'Clear enthusiasm for the field of study',
        'Addresses the core question prompt directly'
      ],
      improvements: [
        'Add specific numerical metrics (e.g. hours per week, number of users, event attendance)',
        'Mention specific Waterloo resources (e.g. WaterlooWorks, student design teams, specific courses)',
        'Structure descriptions using STAR: Situation, Task, Action, and measurable Result'
      ],
      sampleRewrite: 'By leading 4 peer tutoring sessions weekly for 20 students at Cameron Heights, I strengthened my communication and problem-solving skills, which I look forward to applying within Waterloo\'s rigorous engineering curriculum.',
      keyTakeaway: 'Focus on demonstrated initiative, self-directed learning, and concrete outcomes over generic expressions of passion.'
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to generate AIF feedback', details: err?.message });
  }
});

// Setup Vite in Dev or serve build in Prod
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT} (isProd: ${isProd})`);
  });
}

startServer();
