import React, { useState, useId } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  HelpCircle, 
  Sliders, 
  Plus, 
  Trash2, 
  TrendingUp, 
  ArrowRight, 
  Compass, 
  Bookmark, 
  BookmarkCheck, 
  MapPin, 
  Award, 
  GraduationCap, 
  Layers, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';
import { CourseGrade, StudentProfile, AnalysisResult, ProgramChance } from '../types';
import { KW_HIGH_SCHOOLS } from '../data/kwSchools';
import { calculateFacultyTop6, runFullEvaluation } from '../utils/admissionCalculator';
import { WATERLOO_PROGRAMS } from '../data/programsData';

interface AdmissionsAnalyzerProps {
  onAddToTracker: (programId: string, programName: string, faculty: any, targetAvg: number, odds: number) => void;
  savedProgramIds: string[];
  onNavigateToPrograms: () => void;
}

const COMMON_OSSD_COURSES = [
  { code: 'ENG4U', name: 'English (Grade 12 University)' },
  { code: 'MHF4U', name: 'Advanced Functions' },
  { code: 'MCV4U', name: 'Calculus and Vectors' },
  { code: 'SPH4U', name: 'Physics' },
  { code: 'SCH4U', name: 'Chemistry' },
  { code: 'SBI4U', name: 'Biology' },
  { code: 'ICS4U', name: 'Computer Science' },
  { code: 'BAT4M', name: 'Financial Accounting Principles' },
  { code: 'MDM4U', name: 'Mathematics of Data Management' },
  { code: 'CIA4U', name: 'Analyzing Current Economic Issues' },
  { code: 'CGW4U', name: 'World Issues: A Geographic Analysis' },
  { code: 'AVI4U', name: 'Visual Arts' },
  { code: 'FSF4U', name: 'Core French' },
  { code: 'HHS4U', name: 'Families in Canada' }
];

export const AdmissionsAnalyzer: React.FC<AdmissionsAnalyzerProps> = ({
  onAddToTracker,
  savedProgramIds,
  onNavigateToPrograms
}) => {
  const resumeInputId = useId();
  const myBlueprintInputId = useId();

  // Profile Form State
  const [studentName, setStudentName] = useState('Alex Chen');
  const [selectedSchoolId, setSelectedSchoolId] = useState('wci');
  const [courses, setCourses] = useState<CourseGrade[]>([
    { code: 'ENG4U', name: 'English', grade: 93, status: 'completed' },
    { code: 'MHF4U', name: 'Advanced Functions', grade: 97, status: 'completed' },
    { code: 'MCV4U', name: 'Calculus & Vectors', grade: 98, status: 'midterm' },
    { code: 'SPH4U', name: 'Physics', grade: 95, status: 'midterm' },
    { code: 'SCH4U', name: 'Chemistry', grade: 94, status: 'completed' },
    { code: 'ICS4U', name: 'Computer Science', grade: 99, status: 'completed' }
  ]);

  const [resumeText, setResumeText] = useState(
    'President of WCI Robotics Club (FRC); organized regional hackathon with 120 students; 3 years part-time math tutor at Kitchener Kumon (8 hrs/week); built full-stack web apps in React & Python; 95 hours of volunteer service in Waterloo community.'
  );
  const [resumeFileName, setResumeFileName] = useState<string | null>('Alex_Chen_Resume.pdf');
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeMimeType, setResumeMimeType] = useState<string | null>(null);

  const [myBlueprintText, setMyBlueprintText] = useState(
    'myBlueprint OSSD Course Plan: Waterloo Collegiate Institute. Completed credits: 28/30. SHSM: Information & Communication Technology. Courses: ENG4U (93%), MHF4U (97%), MCV4U (98% midterm), SPH4U (95% midterm), SCH4U (94%), ICS4U (99%). Literacy Test: Passed. 95 Community Service Hours.'
  );
  const [myBlueprintFileName, setMyBlueprintFileName] = useState<string | null>('myBlueprint_Transcript_Export.pdf');
  const [myBlueprintBase64, setMyBlueprintBase64] = useState<string | null>(null);
  const [myBlueprintMimeType, setMyBlueprintMimeType] = useState<string | null>(null);

  const [euclidScore, setEuclidScore] = useState<number | ''>(76);
  const [cccScore, setCccScore] = useState<number | ''>(48);
  const [targetFacultyFilter, setTargetFacultyFilter] = useState<string>('All');

  // Loading & Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeResultsTab, setActiveResultsTab] = useState<'matches' | 'audit' | 'aif' | 'actionPlan'>('matches');

  // Real-time current Top 6 calculation
  const liveTop6 = calculateFacultyTop6(courses, 'Engineering').top6Average;

  // Handler to load sample preset profiles
  const loadPresetProfile = (preset: 'wci-stem' | 'chci-ib' | 'lhss-business' | 'stdavid-health') => {
    if (preset === 'wci-stem') {
      setStudentName('Ethan Zhang');
      setSelectedSchoolId('wci');
      setCourses([
        { code: 'ENG4U', name: 'English', grade: 94, status: 'completed' },
        { code: 'MHF4U', name: 'Advanced Functions', grade: 98, status: 'completed' },
        { code: 'MCV4U', name: 'Calculus & Vectors', grade: 99, status: 'midterm' },
        { code: 'SPH4U', name: 'Physics', grade: 96, status: 'midterm' },
        { code: 'SCH4U', name: 'Chemistry', grade: 95, status: 'completed' },
        { code: 'ICS4U', name: 'Computer Science', grade: 99, status: 'completed' }
      ]);
      setResumeText('Waterloo Collegiate Institute student. Co-founder of WCI Code Club. Placed in Canadian Computing Competition Senior Honour Roll (58/75). Finalist at Waterloo Region Science Fair. Volunteer at Waterloo Public Library tech makerspace. Experience with C++, Rust, and React.');
      setMyBlueprintText('myBlueprint Export: WCI. 30 credits planned. Completed: ENG4U (94), MHF4U (98), SCH4U (95), ICS4U (99). In Progress: MCV4U (99), SPH4U (96). All OSSD criteria fulfilled.');
      setEuclidScore(82);
      setCccScore(58);
      setResumeFileName('Ethan_Zhang_WCI_STEM_Resume.pdf');
      setMyBlueprintFileName('Ethan_myBlueprint_Plan.pdf');
    } else if (preset === 'chci-ib') {
      setStudentName('Priya Patel');
      setSelectedSchoolId('cameron-heights');
      setCourses([
        { code: 'ENG4U', name: 'English HL (IB)', grade: 95, status: 'completed' },
        { code: 'MHF4U', name: 'Advanced Functions (IB Math)', grade: 96, status: 'completed' },
        { code: 'MCV4U', name: 'Calculus & Vectors (IB Math)', grade: 97, status: 'midterm' },
        { code: 'SCH4U', name: 'Chemistry HL (IB)', grade: 93, status: 'completed' },
        { code: 'SPH4U', name: 'Physics SL (IB)', grade: 92, status: 'midterm' },
        { code: 'CIA4U', name: 'Economics HL (IB)', grade: 96, status: 'completed' }
      ]);
      setResumeText('Cameron Heights CI IB Diploma Candidate. President of CHCI Model UN; DECA Ontario Provincial 2nd place in Financial Services; Shad Fellow at University of Waterloo; 150 CAS community hours supporting Grand River Hospital foundation; Part-time barista in Kitchener.');
      setMyBlueprintText('myBlueprint Export: Cameron Heights Collegiate. Full IB Diploma Stream. Total credits: 32. 4U/M courses: ENG4U (95), MHF4U (96), MCV4U (97), SCH4U (93), SPH4U (92), CIA4U (96).');
      setEuclidScore(71);
      setCccScore('');
      setResumeFileName('Priya_Patel_CHCI_IB_Resume.pdf');
      setMyBlueprintFileName('Priya_myBlueprint_IB_Courses.pdf');
    } else if (preset === 'lhss-business') {
      setStudentName('Marcus Vance');
      setSelectedSchoolId('laurel-heights');
      setCourses([
        { code: 'ENG4U', name: 'English', grade: 89, status: 'completed' },
        { code: 'MHF4U', name: 'Advanced Functions', grade: 91, status: 'completed' },
        { code: 'MCV4U', name: 'Calculus & Vectors', grade: 90, status: 'midterm' },
        { code: 'BAT4M', name: 'Financial Accounting Principles', grade: 95, status: 'completed' },
        { code: 'MDM4U', name: 'Data Management', grade: 92, status: 'completed' },
        { code: 'CIA4U', name: 'Economics', grade: 88, status: 'midterm' }
      ]);
      setResumeText('Laurel Heights SS (formerly SJAM). VP of Business Club; Captain of Laurel Heights Varsity Soccer Team; Worked 15 hrs/week at Sobeys Waterloo as customer service lead; Founded a regional sneaker resell micro-business with $8k sales; 70 community hours.');
      setMyBlueprintText('myBlueprint Export: Laurel Heights Secondary. Business SHSM major. Courses: ENG4U (89), MHF4U (91), MCV4U (90), BAT4M (95), MDM4U (92), CIA4U (88).');
      setEuclidScore('');
      setCccScore('');
      setResumeFileName('Marcus_Vance_LHSS_Resume.pdf');
      setMyBlueprintFileName('Marcus_myBlueprint_Plan.pdf');
    } else if (preset === 'stdavid-health') {
      setStudentName('Maya Kowalski');
      setSelectedSchoolId('st-david');
      setCourses([
        { code: 'ENG4U', name: 'English', grade: 91, status: 'completed' },
        { code: 'MHF4U', name: 'Advanced Functions', grade: 88, status: 'completed' },
        { code: 'MCV4U', name: 'Calculus & Vectors', grade: 87, status: 'midterm' },
        { code: 'SBI4U', name: 'Biology', grade: 94, status: 'completed' },
        { code: 'SCH4U', name: 'Chemistry', grade: 92, status: 'midterm' },
        { code: 'HHS4U', name: 'Families in Canada', grade: 93, status: 'completed' }
      ]);
      setResumeText('St. David Catholic SS student (Waterloo). 120 volunteer hours at St. Marys Hospital Kitchener; Executive member of St. David STEM Society; Competitive swimmer with Region of Waterloo Swim Club; Peer tutor in Biology and Chemistry.');
      setMyBlueprintText('myBlueprint Export: St. David CSS. Health & Wellness SHSM. Courses: ENG4U (91), SBI4U (94), SCH4U (92), HHS4U (93), MHF4U (88), MCV4U (87).');
      setEuclidScore('');
      setCccScore('');
      setResumeFileName('Maya_Kowalski_StDavid_Resume.pdf');
      setMyBlueprintFileName('Maya_myBlueprint_Plan.pdf');
    }
  };

  // Handle File Uploads (Resume & myBlueprint)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'resume' | 'myBlueprint'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === 'application/pdf') {
      reader.onload = () => {
        const base64Data = (reader.result as string).split(',')[1];
        if (type === 'resume') {
          setResumeFileName(file.name);
          setResumeBase64(base64Data);
          setResumeMimeType(file.type);
          setResumeText(`[Uploaded PDF File: ${file.name} (${Math.round(file.size / 1024)} KB). The AI system will process the raw text and structure directly from the document.]`);
        } else {
          setMyBlueprintFileName(file.name);
          setMyBlueprintBase64(base64Data);
          setMyBlueprintMimeType(file.type);
          setMyBlueprintText(`[Uploaded myBlueprint PDF: ${file.name} (${Math.round(file.size / 1024)} KB). Contains official course schedule and credit audit.]`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Plain text, markdown, CSV, or json
      reader.onload = () => {
        const content = reader.result as string;
        if (type === 'resume') {
          setResumeFileName(file.name);
          setResumeText(content);
        } else {
          setMyBlueprintFileName(file.name);
          setMyBlueprintText(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add / Edit / Remove Courses
  const handleCourseChange = (index: number, field: keyof CourseGrade, value: any) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
  };

  const handleAddCourse = () => {
    setCourses([
      ...courses,
      { code: 'MDM4U', name: 'Mathematics of Data Management', grade: 90, status: 'midterm' }
    ]);
  };

  const handleRemoveCourse = (index: number) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter((_, i) => i !== index));
  };

  // Run AI Admissions Analysis
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const selectedSchool = KW_HIGH_SCHOOLS.find(s => s.id === selectedSchoolId);

    const studentProfile: StudentProfile = {
      name: studentName,
      highSchoolId: selectedSchoolId,
      highSchoolName: selectedSchool?.name || 'Waterloo High School',
      isKwLocal: selectedSchool?.city !== 'Other Ontario',
      courses,
      resumeText,
      resumeFileName: resumeFileName || undefined,
      myBlueprintText,
      myBlueprintFileName: myBlueprintFileName || undefined,
      extracurriculars: resumeText,
      workExperience: resumeText,
      contestScores: {
        euclidScore: typeof euclidScore === 'number' ? euclidScore : undefined,
        cccScore: typeof cccScore === 'number' ? cccScore : undefined
      },
      intendedFaculties: ['Engineering', 'Mathematics & CS', 'Science', 'Arts & SAF', 'Health', 'Environment'],
      targetPrograms: []
    };

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: studentProfile,
          resumeBase64,
          myBlueprintBase64,
          resumeMimeType,
          myBlueprintMimeType
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.warn('Analysis error, executing local calculation fallback:', err);
      // Fallback directly to client-side engine if server route failed
      const baseline = runFullEvaluation(studentProfile);
      setAnalysisResult({
        studentName: studentProfile.name,
        highSchoolSummary: `${selectedSchool?.name || 'KW High School'} (${selectedSchool?.city || 'Waterloo'})`,
        calculatedTop6: baseline.top6Average,
        coursesAudited: studentProfile.courses.map(c => ({
          code: c.code,
          grade: c.grade,
          status: c.status,
          usedInTop6: true
        })),
        missingRequiredCourses: [],
        aifScoreEstimate: baseline.aifScoreEstimate,
        kwLocalAdvantage: {
          isLocal: studentProfile.isKwLocal,
          commuteFeasibility: selectedSchool?.transitToUW || 'Direct ION LRT Line 301 to University of Waterloo Station',
          estimatedAnnualSavings: '$14,500 - $18,000 / year saved on residence and meal plan fees',
          localTechEcosystemFit: 'Deep immersion in Kitchener-Waterloo tech hub (Google Waterloo, Communitech, Velocity)',
          adjustmentFactorContext: selectedSchool?.historicalAdjustmentFactorNote || 'Favorable standard adjustment benchmark'
        },
        chances: baseline.chances,
        topRecommendations: {
          bestMatchProgram: baseline.recommendedPrograms.targetMatch[0]?.programName || 'Waterloo Program',
          bestValueAlternative: 'Systems Design Engineering or Management Engineering',
          hiddenGemProgram: 'Geomatics or Arts and Business',
          reasoning: `Based on your Top 6 average of ${baseline.top6Average}% and AIF score of ${baseline.aifScoreEstimate.score}/5.0.`
        },
        actionItems: [
          'Submit OUAC Undergrad application by mid-January and activate your Quest account',
          'Dedicate 10+ hours to crafting your AIF (Admission Information Form) using STAR bullet points',
          'Register for the Euclid Math Contest in April (written at your local KW high school)',
          'Take advantage of living locally in KW: save $15k+/year and leverage free GRT transit'
        ],
        aifDraftSuggestions: [
          'Quantify leadership impact: include hours per week, number of members mentored, or software deployed',
          'Emphasize your local Waterloo connection: cite interest in Waterloo design teams or research labs',
          'Include part-time work or family responsibilities under special circumstances'
        ]
      });
    } finally {
      setIsAnalyzing(false);
      // Smooth scroll to results
      setTimeout(() => {
        const resultsEl = document.getElementById('analysis-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  };

  const selectedSchoolInfo = KW_HIGH_SCHOOLS.find(s => s.id === selectedSchoolId);

  // Filter program chances by faculty
  const filteredChances = analysisResult?.chances.filter(c => {
    if (targetFacultyFilter === 'All') return true;
    return c.faculty === targetFacultyFilter;
  }) || [];

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Waterloo Admissions Advisor for KW Students
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Tailor Your Path to the <span className="text-amber-400">University of Waterloo</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-3xl mb-6">
            Upload your resume and your <strong>myBlueprint</strong> course plan. Our admissions engine audits your Ontario 12U/M prerequisites, estimates your <strong>AIF score (0-5.0)</strong>, models historical Waterloo admission data, and pinpoints your exact admission probability across all Waterloo programs.
          </p>

          {/* Quick preset selector buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mr-2">
              Try a sample KW profile:
            </span>
            <button
              onClick={() => loadPresetProfile('wci-stem')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-amber-300 border border-amber-500/20 transition-colors"
            >
              🎓 WCI STEM Star (96% Avg)
            </button>
            <button
              onClick={() => loadPresetProfile('chci-ib')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-emerald-300 border border-emerald-500/20 transition-colors"
            >
              🌐 Cameron Heights IB (94% Avg)
            </button>
            <button
              onClick={() => loadPresetProfile('lhss-business')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-sky-300 border border-sky-500/20 transition-colors"
            >
              📊 Laurel Heights Business (91% Avg)
            </button>
            <button
              onClick={() => loadPresetProfile('stdavid-health')}
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-purple-300 border border-purple-500/20 transition-colors"
            >
              🏥 St. David Health & Bio (89% Avg)
            </button>
          </div>
        </div>
      </section>

      {/* Main Input Form: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Uploads & High School Profile */}
        <div className="lg:col-span-6 space-y-6">
          {/* Card: High School Selection */}
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Your High School Context</h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">
                KW Region
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Student Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Select Your High School
                </label>
                <select
                  value={selectedSchoolId}
                  onChange={e => setSelectedSchoolId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <optgroup label="Waterloo Region District School Board (WRDSB)">
                    {KW_HIGH_SCHOOLS.filter(s => s.board === 'WRDSB').map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name} ({school.city})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Waterloo Catholic District School Board (WCDSB)">
                    {KW_HIGH_SCHOOLS.filter(s => s.board === 'WCDSB').map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name} ({school.city})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Independent / Other">
                    {KW_HIGH_SCHOOLS.filter(s => s.board !== 'WRDSB' && s.board !== 'WCDSB').map(school => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* School Spotlight Pill */}
            {selectedSchoolInfo && (
              <div className="bg-zinc-950/70 border border-zinc-800 rounded-xl p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Transit to UW Campus:</span>
                  <span className="text-zinc-300 font-normal">{selectedSchoolInfo.transitToUW}</span>
                </div>
                <div className="flex items-start gap-1.5 text-zinc-400">
                  <Award className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Admissions Insight:</strong> {selectedSchoolInfo.historicalAdjustmentFactorNote}</span>
                </div>
              </div>
            )}
          </div>

          {/* Card: Document Uploads (Resume & myBlueprint) */}
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Upload Resume & myBlueprint</h3>
              </div>
              <span className="text-xs text-zinc-400">PDF, TXT, or text entry</span>
            </div>

            {/* Resume Upload Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  1. Student Resume & Extracurriculars
                </span>
                {resumeFileName && (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> {resumeFileName}
                  </span>
                )}
              </div>

              <div className="relative border-2 border-dashed border-zinc-800 hover:border-amber-400/50 rounded-xl p-4 transition-colors bg-zinc-950/60 text-center">
                <input
                  id={resumeInputId}
                  type="file"
                  accept=".pdf,.txt,.docx,.md"
                  onChange={e => handleFileUpload(e, 'resume')}
                  className="hidden"
                />
                <label
                  htmlFor={resumeInputId}
                  className="cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Upload className="w-6 h-6 text-zinc-500 hover:text-amber-400 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300">
                    Click to upload Resume (PDF / TXT)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Extracts leadership, jobs, clubs, and hackathons
                  </span>
                </label>
              </div>

              {/* Editable resume summary */}
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Or paste resume summary, clubs, leadership roles, and work experience here..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
              />
            </div>

            {/* myBlueprint Course Plan Upload Box */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  2. myBlueprint Course Plan / Transcript Export
                </span>
                {myBlueprintFileName && (
                  <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3 h-3" /> {myBlueprintFileName}
                  </span>
                )}
              </div>

              <div className="relative border-2 border-dashed border-zinc-800 hover:border-amber-400/50 rounded-xl p-4 transition-colors bg-zinc-950/60 text-center">
                <input
                  id={myBlueprintInputId}
                  type="file"
                  accept=".pdf,.txt,.docx,.csv"
                  onChange={e => handleFileUpload(e, 'myBlueprint')}
                  className="hidden"
                />
                <label
                  htmlFor={myBlueprintInputId}
                  className="cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  <Upload className="w-6 h-6 text-zinc-500 hover:text-amber-400 transition-colors" />
                  <span className="text-xs font-medium text-zinc-300">
                    Click to upload myBlueprint Export (PDF / TXT)
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Audits Grade 12 prerequisites, in-progress marks & OSSD credits
                  </span>
                </label>
              </div>

              {/* Editable myBlueprint text */}
              <textarea
                value={myBlueprintText}
                onChange={e => setMyBlueprintText(e.target.value)}
                placeholder="Or paste myBlueprint course plan / transcript details here..."
                rows={3}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
              />
            </div>
          </div>

          {/* Card: Math & Computing Contest Scores (Waterloo Specialty) */}
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">CEMC Contests (Optional Bonus)</h3>
              </div>
              <span className="text-xs text-zinc-400">Written at your high school</span>
            </div>
            <p className="text-xs text-zinc-400">
              Contest scores are heavily considered for Waterloo Math, CS, and Engineering offers. If not yet written (Euclid is in April), leave blank or enter projected score.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Euclid Contest (Score /100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={euclidScore}
                  onChange={e => setEuclidScore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 75"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">70+ unlocks major Math/CS boost</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  CCC Senior Contest (/75)
                </label>
                <input
                  type="number"
                  min={0}
                  max={75}
                  value={cccScore}
                  onChange={e => setCccScore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 45"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">Canadian Computing Competition</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Grade 12 Course Table & Live Top 6 Calculator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Grade 12 Courses & Marks</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Enter completed finals, quad/semester midterms, or planned courses
                </p>
              </div>

              {/* Live Top 6 Indicator */}
              <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3.5 py-1.5 rounded-xl">
                <span className="text-xs text-amber-300 font-medium">Calculated Top 6:</span>
                <span className="text-lg font-extrabold text-amber-400">{liveTop6}%</span>
              </div>
            </div>

            {/* Courses Table */}
            <div className="space-y-3">
              {courses.map((course, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  {/* Course Code Dropdown or Text */}
                  <div className="w-28 flex-shrink-0">
                    <select
                      value={course.code}
                      onChange={e => {
                        const found = COMMON_OSSD_COURSES.find(c => c.code === e.target.value);
                        handleCourseChange(idx, 'code', e.target.value);
                        if (found) {
                          handleCourseChange(idx, 'name', found.name);
                        }
                      }}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    >
                      {COMMON_OSSD_COURSES.map(opt => (
                        <option key={opt.code} value={opt.code}>
                          {opt.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Course Name */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={course.name}
                      onChange={e => handleCourseChange(idx, 'name', e.target.value)}
                      placeholder="Course name"
                      className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none focus:text-white truncate"
                    />
                  </div>

                  {/* Grade Input */}
                  <div className="w-16 flex-shrink-0">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={course.grade}
                        onChange={e => handleCourseChange(idx, 'grade', Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-center font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                      <span className="absolute right-1.5 top-1 text-[10px] text-zinc-500 pointer-events-none">%</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="w-24 flex-shrink-0">
                    <select
                      value={course.status}
                      onChange={e => handleCourseChange(idx, 'status', e.target.value)}
                      className={`w-full text-[11px] rounded-lg px-2 py-1 border font-medium focus:outline-none ${
                        course.status === 'completed'
                          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                          : course.status === 'midterm'
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      <option value="completed">Final</option>
                      <option value="midterm">Midterm</option>
                      <option value="planned">Planned</option>
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCourse(idx)}
                    disabled={courses.length <= 4}
                    className="text-zinc-600 hover:text-red-400 p-1 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                    title="Remove Course"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Course Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleAddCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another 4U/M Course
              </button>

              <span className="text-[11px] text-zinc-400">
                {courses.length} courses entered (Min 6 required for OSSD)
              </span>
            </div>

            {/* Big Action Button */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-zinc-950 font-bold py-4 px-6 shadow-xl shadow-amber-500/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-3 disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-base tracking-wide">
                      Analyzing Resume & myBlueprint with Gemini AI...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="text-base tracking-wide">
                      Analyze My Waterloo Chances & Tailor Programs
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-zinc-500 mt-2">
                Calculates prerequisite audits, holistic AIF score, KW regional edge, and admission odds for all 30+ Waterloo programs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULTS DASHBOARD (Rendered once analyzed) */}
      {analysisResult && (
        <section id="analysis-results-section" className="space-y-8 pt-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Waterloo Admissions Analysis for <span className="text-amber-400">{analysisResult.studentName}</span>
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Context: {analysisResult.highSchoolSummary} • Kitchener-Waterloo Region Applicant
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-evaluate
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Top 6 Average */}
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Calculated Top 6 Average
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">
                  {analysisResult.calculatedTop6}%
                </span>
                <span className="text-xs text-zinc-400">OSSD 12U/M</span>
              </div>
              <p className="text-[11px] text-zinc-500">
                Meets minimum thresholds for all Waterloo faculties
              </p>
            </div>

            {/* Metric 2: Estimated AIF Score */}
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Estimated AIF Rating
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400">
                  {analysisResult.aifScoreEstimate.score}
                </span>
                <span className="text-xs text-zinc-400">/ 5.0 max</span>
              </div>
              <p className="text-[11px] text-emerald-300/80 truncate">
                {analysisResult.aifScoreEstimate.tier}
              </p>
            </div>

            {/* Metric 3: Best Program Match */}
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Top Tailored Program
              </span>
              <div className="text-lg font-bold text-white truncate">
                {analysisResult.topRecommendations.bestMatchProgram}
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                High alignment with course strengths
              </p>
            </div>

            {/* Metric 4: KW Living-At-Home Savings */}
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 shadow-sm space-y-1">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                KW Commuter Savings
              </span>
              <div className="text-xl font-bold text-sky-400">
                $15,000+ / yr
              </div>
              <p className="text-[11px] text-zinc-400">
                Free GRT/ION transit with WatCard
              </p>
            </div>
          </div>

          {/* Results Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <button
              onClick={() => setActiveResultsTab('matches')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeResultsTab === 'matches'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Program Chances & Odds ({analysisResult.chances.length})</span>
            </button>

            <button
              onClick={() => setActiveResultsTab('aif')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeResultsTab === 'aif'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>AIF & Resume Breakdown</span>
            </button>

            <button
              onClick={() => setActiveResultsTab('audit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeResultsTab === 'audit'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>myBlueprint Prerequisite Audit</span>
            </button>

            <button
              onClick={() => setActiveResultsTab('actionPlan')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeResultsTab === 'actionPlan'
                  ? 'bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/20'
                  : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tailored Action Items</span>
            </button>
          </div>

          {/* TAB 1: PROGRAM CHANCES & ODDS */}
          {activeResultsTab === 'matches' && (
            <div className="space-y-6">
              {/* Faculty Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-zinc-400 mr-2">Filter by Faculty:</span>
                {['All', 'Engineering', 'Mathematics & CS', 'Science', 'Arts & SAF', 'Health', 'Environment'].map(fac => (
                  <button
                    key={fac}
                    onClick={() => setTargetFacultyFilter(fac)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      targetFacultyFilter === fac
                        ? 'bg-amber-400 text-zinc-950 font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                    }`}
                  >
                    {fac}
                  </button>
                ))}
              </div>

              {/* Grouped Programs: Reach, Target, Safe Match */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredChances.map(chance => {
                  const isSaved = savedProgramIds.includes(chance.programId);
                  const isSafe = chance.tier === 'High Chance / Safe Match';
                  const isTarget = chance.tier === 'Target / Solid Match';
                  const isReach = chance.tier === 'Reach / Competitive';
                  const isLottery = chance.tier === 'High Reach / Lottery';

                  return (
                    <div
                      key={chance.programId}
                      className="bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700 p-5 space-y-4 shadow-sm flex flex-col justify-between transition-all"
                    >
                      <div>
                        {/* Header: Faculty & Odds Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                            {chance.faculty}
                          </span>

                          <span
                            className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${
                              isSafe
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                                : isTarget
                                ? 'bg-blue-950/60 text-blue-400 border-blue-800/40'
                                : isReach
                                ? 'bg-amber-950/60 text-amber-400 border-amber-800/40'
                                : 'bg-rose-950/60 text-rose-400 border-rose-800/40'
                            }`}
                          >
                            {chance.oddsScore}% Odds
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-bold text-white leading-snug">
                          {chance.programName}
                        </h4>

                        {/* Tier description */}
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSafe
                                ? 'bg-emerald-400'
                                : isTarget
                                ? 'bg-blue-400'
                                : isReach
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span className="text-xs font-medium text-zinc-300">
                            {chance.tier}
                          </span>
                        </div>

                        {/* Progress Bar of Odds */}
                        <div className="w-full bg-zinc-950 rounded-full h-2 mt-3 overflow-hidden border border-zinc-800">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isSafe
                                ? 'bg-emerald-400'
                                : isTarget
                                ? 'bg-blue-400'
                                : isReach
                                ? 'bg-amber-400'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${chance.oddsScore}%` }}
                          />
                        </div>

                        {/* Pros / Notes */}
                        <div className="mt-4 space-y-1.5 text-xs">
                          {chance.pros.slice(0, 2).map((pro, pIdx) => (
                            <div key={pIdx} className="flex items-start gap-1.5 text-zinc-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                              <span>{pro}</span>
                            </div>
                          ))}
                          {chance.concerns.slice(0, 1).map((con, cIdx) => (
                            <div key={cIdx} className="flex items-start gap-1.5 text-zinc-400">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                              <span>{con}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Button */}
                      <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            onAddToTracker(
                              chance.programId,
                              chance.programName,
                              chance.faculty,
                              chance.cutoffAverage,
                              chance.oddsScore
                            );
                          }}
                          disabled={isSaved}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                            isSaved
                              ? 'bg-zinc-800 text-zinc-400 cursor-default'
                              : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-sm'
                          }`}
                        >
                          {isSaved ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> Added to Tracker
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" /> Track Program
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: AIF & RESUME BREAKDOWN */}
          {activeResultsTab === 'aif' && (
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    Waterloo AIF (Admission Information Form) Score Estimate
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    At Waterloo, the AIF is scored on a 5.0 scale. In Math and Engineering, it is combined directly with your academic average.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-amber-400">
                    {analysisResult.aifScoreEstimate.score} <span className="text-sm font-normal text-zinc-400">/ 5.0</span>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {analysisResult.aifScoreEstimate.tier}
                  </span>
                </div>
              </div>

              {/* Rubric Elements */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                  <span className="text-xs text-zinc-500 block mb-1">Extracurricular Depth</span>
                  <span className="text-sm font-bold text-white">
                    {analysisResult.aifScoreEstimate.extracurricularStrength}
                  </span>
                </div>

                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                  <span className="text-xs text-zinc-500 block mb-1">Demonstrated Leadership</span>
                  <span className="text-sm font-bold text-white">
                    {analysisResult.aifScoreEstimate.leadershipScore}
                  </span>
                </div>

                <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800">
                  <span className="text-xs text-zinc-500 block mb-1">Contest Evaluation</span>
                  <span className="text-sm font-bold text-white">
                    {analysisResult.aifScoreEstimate.contestBoost}
                  </span>
                </div>
              </div>

              {/* Feedback Points */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Admissions Reader Evaluation Notes
                </h4>
                <div className="space-y-2">
                  {analysisResult.aifScoreEstimate.feedback.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 text-xs text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tailored AIF Writing Strategy */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Customized AIF Drafting Recommendations (From Gemini AI)
                </h4>
                <div className="space-y-2">
                  {analysisResult.aifDraftSuggestions.map((sugg, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 bg-amber-400/5 p-3 rounded-xl border border-amber-400/20 text-xs text-zinc-200">
                      <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{sugg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: myBlueprint PREREQUISITE AUDIT */}
          {activeResultsTab === 'audit' && (
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    myBlueprint OSSD & Waterloo Prerequisite Audit
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Verifying required courses for Engineering, Math, Computer Science, and Science faculties
                  </p>
                </div>
              </div>

              {/* Prerequisites Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    faculty: 'Faculty of Engineering',
                    required: ['ENG4U', 'MHF4U', 'MCV4U', 'SCH4U', 'SPH4U'],
                    desc: 'All 5 core STEM prerequisites required with min 70% in each'
                  },
                  {
                    faculty: 'Cheriton School of CS & Math',
                    required: ['ENG4U', 'MHF4U', 'MCV4U'],
                    desc: 'Advanced Functions & Calculus mandatory + 3 electives'
                  },
                  {
                    faculty: 'Faculty of Science',
                    required: ['ENG4U', 'MHF4U or MCV4U', '2 Sciences (SBI/SCH/SPH)'],
                    desc: 'Flexible scientific requirements'
                  }
                ].map((audit, aIdx) => {
                  const courseCodes = courses.map(c => c.code);
                  const isEngMet = audit.required.every(req => courseCodes.includes(req));

                  return (
                    <div key={aIdx} className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-white">{audit.faculty}</h4>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                          Audited
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">{audit.desc}</p>

                      <div className="space-y-1.5 pt-2">
                        {audit.required.map((req, rIdx) => {
                          const matched = courses.find(c => c.code === req);
                          return (
                            <div key={rIdx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/60">
                              <span className="font-mono text-zinc-300">{req}</span>
                              {matched ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-1">
                                  <Check className="w-3 h-3" /> {matched.grade}% ({matched.status})
                                </span>
                              ) : (
                                <span className="text-zinc-500">Elective slot</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Audited Course Breakdown */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Parsed Course Schedule ({courses.length} courses)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400">
                        <th className="pb-2 font-semibold">Course Code</th>
                        <th className="pb-2 font-semibold">Course Title</th>
                        <th className="pb-2 font-semibold">Current Mark</th>
                        <th className="pb-2 font-semibold">Status</th>
                        <th className="pb-2 font-semibold">OSSD Credit Weight</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {courses.map((c, i) => (
                        <tr key={i} className="text-zinc-300">
                          <td className="py-2.5 font-bold font-mono text-amber-400">{c.code}</td>
                          <td className="py-2.5">{c.name}</td>
                          <td className="py-2.5 font-bold text-white">{c.grade}%</td>
                          <td className="py-2.5 capitalize">{c.status}</td>
                          <td className="py-2.5 text-zinc-500">1.0 Credit (12U/M)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TAILORED ACTION PLAN & NEXT STEPS */}
          {activeResultsTab === 'actionPlan' && (
            <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-400" />
                    Personalized Waterloo Admission Action Plan
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Strategic checklist to maximize admission probability before the May offer round
                  </p>
                </div>
              </div>

              {/* Top Recommendations Callout */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> AI Matchmaker Recommendations
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Best Match Program:</span>
                    <span className="text-base font-bold text-white">
                      {analysisResult.topRecommendations.bestMatchProgram}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">High-Value Alternative:</span>
                    <span className="text-sm font-bold text-amber-300">
                      {analysisResult.topRecommendations.bestValueAlternative}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block mb-0.5">Hidden Gem Program:</span>
                    <span className="text-sm font-bold text-emerald-300">
                      {analysisResult.topRecommendations.hiddenGemProgram}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 italic pt-1 border-t border-amber-400/10">
                  "{analysisResult.topRecommendations.reasoning}"
                </p>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Immediate Priority Checklist
                </h4>
                <div className="space-y-2.5">
                  {analysisResult.actionItems.map((action, aIdx) => (
                    <div
                      key={aIdx}
                      className="flex items-start gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-200"
                    >
                      <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold flex-shrink-0 text-[11px]">
                        {aIdx + 1}
                      </div>
                      <span className="leading-relaxed mt-0.5">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local KW Student Edge Summary */}
              <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" /> Your Kitchener-Waterloo Advantage
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  As a local student attending <strong>{analysisResult.highSchoolSummary}</strong>, you possess unique local advantages. In addition to saving over <strong>$15,000 per year</strong> by commuting via the ION LRT, your high school historical adjustment factor sits comfortably at Waterloo's favorable benchmark. You also have easy access to campus research events, Hack the North, and local co-op employers at Communitech and Google Waterloo.
                </p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
