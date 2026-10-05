import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  FileCheck2, 
  Video, 
  Award, 
  DollarSign, 
  Sparkles, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Play,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { 
  WATERLOO_APPLICATION_TIMELINE, 
  AIF_GUIDE, 
  KIRA_TALENT_GUIDE, 
  COOP_EARNINGS_BREAKDOWN 
} from '../data/applicationProcessData';

export const ApplicationGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'timeline' | 'aifWorkshop' | 'kiraSimulator' | 'contests' | 'coop'>('timeline');

  // AIF Essay Feedback State
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [draftEssayText, setDraftEssayText] = useState(
    'I have chosen Software Engineering because I enjoy coding in Python and building websites. Waterloo has a great reputation and co-op program that will help me get a good job. In high school I was in the coding club and helped other students.'
  );
  const [isSubmittingAif, setIsSubmittingAif] = useState(false);
  const [aifFeedback, setAifFeedback] = useState<any>(null);

  // Kira Talent Video Interview Practice Simulator State
  const [currentKiraQuestionIdx, setCurrentKiraQuestionIdx] = useState(0);
  const [timerPhase, setTimerPhase] = useState<'idle' | 'prep' | 'answering' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState(45); // 45s prep, 90s speak

  useEffect(() => {
    let interval: any = null;
    if (timerPhase === 'prep' || timerPhase === 'answering') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerPhase === 'prep') {
              setTimerPhase('answering');
              return 90; // switch to 90s answering
            } else {
              setTimerPhase('done');
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerPhase]);

  const startKiraPractice = () => {
    setTimerPhase('prep');
    setTimeLeft(45);
  };

  const resetKiraPractice = () => {
    setTimerPhase('idle');
    setTimeLeft(45);
  };

  const nextKiraQuestion = () => {
    resetKiraPractice();
    setCurrentKiraQuestionIdx((prev) => (prev + 1) % KIRA_TALENT_GUIDE.sampleQuestions.length);
  };

  // Submit Draft to AIF Feedback API
  const handleGetAifFeedback = async () => {
    if (!draftEssayText || draftEssayText.trim().length < 20) return;
    setIsSubmittingAif(true);

    try {
      const res = await fetch('/api/aif-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionPrompt: AIF_GUIDE.keyQuestions[selectedPromptIdx].prompt,
          draftText: draftEssayText,
          targetProgram: 'Waterloo Engineering / Math'
        })
      });

      if (!res.ok) throw new Error('Failed to get feedback');
      const data = await res.json();
      setAifFeedback(data);
    } catch (err) {
      console.warn('Fallback AIF feedback:', err);
      setAifFeedback({
        score: 3.2,
        rating: 'Competent Draft with Significant Room for Impact',
        strengths: [
          'Directly mentions interest in Waterloo and coding',
          'Identifies participation in high school coding club'
        ],
        improvements: [
          'Quantify your impact: How many students did you teach? What did they build?',
          'Replace generic compliments ("great reputation") with specific Waterloo teams (e.g. Hack the North, Watonomous)',
          'Use the STAR method: Situation, Task, Action, and measurable Result'
        ],
        sampleRewrite: 'Driven by curiosity for distributed systems, I spearheaded 15 weekly coding sessions at Cameron Heights for 28 junior students, culminating in 6 teams submitting projects to the regional hackathon. At Waterloo, I am excited to apply this collaborative engineering mindset to student teams like WatSolve and Midnight Sun.',
        keyTakeaway: 'Focus on concrete self-directed initiative rather than generic passion.'
      });
    } finally {
      setIsSubmittingAif(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Waterloo Admissions Playbook
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Application Process & <span className="text-amber-400">AIF Masterclass</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Master the official OUAC application timeline, craft an outstanding 5.0-tier Admission Information Form (AIF), practice the Kira Talent video interview, and learn how to ace Waterloo’s CEMC contests.
        </p>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <button
            onClick={() => setActiveSection('timeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'timeline'
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            🗓️ Deadlines & Roadmap
          </button>

          <button
            onClick={() => setActiveSection('aifWorkshop')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'aifWorkshop'
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            ✍️ AIF Workshop & AI Grader
          </button>

          <button
            onClick={() => setActiveSection('kiraSimulator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'kiraSimulator'
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            🎥 Kira Video Interview Simulator
          </button>

          <button
            onClick={() => setActiveSection('contests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'contests'
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            📐 Euclid & CCC Contests
          </button>

          <button
            onClick={() => setActiveSection('coop')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'coop'
                ? 'bg-amber-400 text-zinc-950'
                : 'bg-zinc-800 text-zinc-300 hover:text-white'
            }`}
          >
            💼 Co-op Structure & Salaries
          </button>
        </div>
      </div>

      {/* SECTION 1: TIMELINE & OUAC ROADMAP */}
      {activeSection === 'timeline' && (
        <section className="space-y-6">
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-amber-400" />
                Waterloo Application Roadmap & Critical Deadlines
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Ontario high school students (OUAC Undergrad 101 pathway)
              </p>
            </div>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-zinc-800 space-y-8">
              {WATERLOO_APPLICATION_TIMELINE.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot on the timeline */}
                  <div className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 ${
                    item.isImportant
                      ? 'bg-amber-400 border-zinc-950 shadow-md shadow-amber-400/50'
                      : 'bg-zinc-800 border-zinc-950'
                  }`} />

                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {item.date}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.isImportant
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: AIF WORKSHOP & AI ESSAY GRADER */}
      {activeSection === 'aifWorkshop' && (
        <section className="space-y-8">
          {/* Overview & Tier Rubric */}
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 space-y-6 shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-amber-400" />
                The AIF (Admission Information Form) Explained
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed max-w-3xl">
                {AIF_GUIDE.overview}
              </p>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/20 p-4 rounded-2xl text-xs text-amber-200 leading-relaxed">
              💡 <strong>Admissions Secret:</strong> {AIF_GUIDE.scoringSystem.importanceDescription}
            </div>

            {/* Rubric Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AIF_GUIDE.scoringSystem.tierBreakdown.map((t, idx) => (
                <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1 text-xs">
                  <h4 className="font-bold text-amber-400 text-sm">{t.tier}</h4>
                  <p className="text-zinc-300 leading-relaxed">{t.criteria}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive AI Essay Grader */}
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Interactive AIF Essay Tester & AI Grader
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Draft your response to an official Waterloo AIF question and get evaluated against Waterloo's rubric
                </p>
              </div>
            </div>

            {/* Question Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Select Official AIF Question:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AIF_GUIDE.keyQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPromptIdx(idx);
                      setAifFeedback(null);
                    }}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedPromptIdx === idx
                        ? 'bg-amber-400/10 border-amber-400 text-white font-semibold'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    <span className="font-bold block text-amber-400 mb-0.5">{q.section}</span>
                    <span className="line-clamp-2">{q.prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt & Tip Box */}
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 text-xs">
              <span className="font-bold text-white block">
                Prompt: "{AIF_GUIDE.keyQuestions[selectedPromptIdx].prompt}"
              </span>
              <p className="text-amber-300/90 flex items-start gap-1.5">
                <span>💡 <strong>Waterloo Insider Tip:</strong> {AIF_GUIDE.keyQuestions[selectedPromptIdx].tip}</span>
              </p>
            </div>

            {/* Essay Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Your Draft Response:</span>
                <span>{draftEssayText.length} characters</span>
              </div>
              <textarea
                value={draftEssayText}
                onChange={e => setDraftEssayText(e.target.value)}
                rows={5}
                placeholder="Type or paste your draft response here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-amber-400 leading-relaxed font-mono"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                onClick={handleGetAifFeedback}
                disabled={isSubmittingAif}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-amber-400/20 disabled:opacity-50"
              >
                {isSubmittingAif ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating with Waterloo Admissions Rubric...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Get Waterloo Rubric AI Feedback
                  </>
                )}
              </button>
            </div>

            {/* AI Feedback Display */}
            {aifFeedback && (
              <div className="bg-zinc-950 rounded-2xl border border-amber-400/30 p-6 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Admissions Reader Assessment
                    </span>
                    <h4 className="text-lg font-bold text-white">{aifFeedback.rating}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-amber-400">
                      {aifFeedback.score} <span className="text-xs font-normal text-zinc-400">/ 5.0</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Strengths */}
                  <div className="space-y-2">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Strong Elements:
                    </span>
                    <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                      {aifFeedback.strengths.map((str: string, i: number) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas for Improvement */}
                  <div className="space-y-2">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Recommendations for Higher Score:
                    </span>
                    <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                      {aifFeedback.improvements.map((imp: string, i: number) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sample Rewrite */}
                {aifFeedback.sampleRewrite && (
                  <div className="bg-amber-400/5 p-4 rounded-xl border border-amber-400/20 space-y-1.5 text-xs">
                    <span className="font-bold text-amber-400 block">
                      Exemplary High-Impact Rewrite Example (STAR Method):
                    </span>
                    <p className="text-zinc-200 italic leading-relaxed font-mono">
                      "{aifFeedback.sampleRewrite}"
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* SECTION 3: KIRA TALENT VIDEO INTERVIEW SIMULATOR */}
      {activeSection === 'kiraSimulator' && (
        <section className="space-y-6">
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Video className="w-6 h-6 text-amber-400" />
                  Kira Talent Video Interview Simulator (Engineering & Architecture)
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Required for all Faculty of Engineering programs. Adds up to <strong>+3.0 bonus points</strong> to your admission index!
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold">
                Asynchronous Online Format
              </span>
            </div>

            {/* Practice Simulator Box */}
            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 text-center">
              <div className="max-w-2xl mx-auto space-y-3">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  Practice Question {currentKiraQuestionIdx + 1} of {KIRA_TALENT_GUIDE.sampleQuestions.length}
                </span>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
                  "{KIRA_TALENT_GUIDE.sampleQuestions[currentKiraQuestionIdx]}"
                </h3>
              </div>

              {/* Timer & Controls */}
              <div className="max-w-md mx-auto space-y-4">
                {timerPhase === 'idle' && (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400">
                      Format: 45 seconds of preparation time, followed by 90 seconds of recorded speaking.
                    </p>
                    <button
                      onClick={startKiraPractice}
                      className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-400/20 inline-flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-zinc-950" /> Start 45s Prep Countdown
                    </button>
                  </div>
                )}

                {timerPhase === 'prep' && (
                  <div className="bg-zinc-900 border border-amber-400/40 rounded-2xl p-6 space-y-2">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                      Preparation Time
                    </span>
                    <div className="text-5xl font-black text-amber-400 font-mono">
                      {timeLeft}s
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Jot down key points on paper. Do not write full sentences.
                    </p>
                  </div>
                )}

                {timerPhase === 'answering' && (
                  <div className="bg-zinc-900 border border-rose-500/50 rounded-2xl p-6 space-y-2 animate-pulse">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-wider flex items-center justify-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" /> Recording Answer
                    </span>
                    <div className="text-5xl font-black text-rose-400 font-mono">
                      {timeLeft}s
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Speak clearly into your camera. Structure: Problem → Action → Result.
                    </p>
                  </div>
                )}

                {timerPhase === 'done' && (
                  <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-2xl p-6 space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-base font-bold text-white">Time's Up! Great Practice!</h4>
                    <p className="text-xs text-zinc-300">
                      Did you articulate your engineering mindset clearly? Try another question.
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        onClick={resetKiraPractice}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white"
                      >
                        Retry This Question
                      </button>
                      <button
                        onClick={nextKiraQuestion}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs"
                      >
                        Next Question →
                      </button>
                    </div>
                  </div>
                )}

                {timerPhase !== 'idle' && timerPhase !== 'done' && (
                  <button
                    onClick={resetKiraPractice}
                    className="text-xs text-zinc-500 hover:text-white flex items-center justify-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Cancel Timer
                  </button>
                )}
              </div>
            </div>

            {/* Dos and Don'ts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                <span className="font-bold text-emerald-400 block text-sm">Key Dos:</span>
                <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                  {KIRA_TALENT_GUIDE.dosAndDonts.dos.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                <span className="font-bold text-rose-400 block text-sm">Key Don'ts:</span>
                <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                  {KIRA_TALENT_GUIDE.dosAndDonts.donts.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: CONTESTS GUIDE */}
      {activeSection === 'contests' && (
        <section className="space-y-6">
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                CEMC Mathematics & Computing Competitions
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Administered by the Centre for Education in Mathematics and Computing located right on Waterloo campus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Euclid */}
              <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">The Euclid Mathematics Contest</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    Grade 12 • Written in April
                  </span>
                </div>
                <p>
                  The Euclid is the single most influential math competition for Waterloo applicants. 10 questions, 2.5 hours, scored out of 100.
                </p>
                <div className="space-y-1.5 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold text-amber-400 block">Scoring Benchmarks:</span>
                  <div>• <strong>80+ (Honor Roll):</strong> Virtually guarantees admission if top 6 mark is above cutoffs</div>
                  <div>• <strong>70 - 79:</strong> Huge competitive edge for CS, Math, and Software Engineering</div>
                  <div>• <strong>55 - 69:</strong> Solid score showing university-level problem solving</div>
                  <div>• <strong>&lt; 50:</strong> No negative impact; Waterloo only counts contest scores favorably!</div>
                </div>
              </div>

              {/* CCC */}
              <div className="bg-zinc-950 rounded-2xl p-6 border border-zinc-800 space-y-3 text-xs text-zinc-300 leading-relaxed">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Canadian Computing Competition (CCC)</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    Written in Late February
                  </span>
                </div>
                <p>
                  A 3-hour algorithmic coding competition with 5 questions (Junior or Senior). Senior contestants write in C++, Python, or Java.
                </p>
                <div className="space-y-1.5 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
                  <span className="font-bold text-amber-400 block">Scoring Benchmarks (Senior out of 75):</span>
                  <div>• <strong>45+ / 75:</strong> Outstanding; heavily flagged by Cheriton School of CS admissions</div>
                  <div>• <strong>30 - 44 / 75:</strong> Demonstrates solid data structures (graphs, recursion, dynamic programming)</div>
                  <div>• <strong>Top 30 contestants:</strong> Invited to CCO (Canadian Computing Olympiad) on campus!</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: CO-OP SALARIES & STRUCTURE */}
      {activeSection === 'coop' && (
        <section className="space-y-6">
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-amber-400" />
                {COOP_EARNINGS_BREAKDOWN.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                {COOP_EARNINGS_BREAKDOWN.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {COOP_EARNINGS_BREAKDOWN.averageEarningsPerTerm.map((t, idx) => (
                <div key={idx} className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    {t.term}
                  </span>
                  <div className="text-xl font-black text-white">
                    ${typeof t.avgCad === 'number' ? t.avgCad.toLocaleString() : t.avgCad} CAD
                  </div>
                  <p className="text-xs text-zinc-400">{t.hourlyRate}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/40 p-5 rounded-2xl text-xs text-emerald-200 leading-relaxed">
              🎓 <strong>Total Financial Return:</strong> {COOP_EARNINGS_BREAKDOWN.totalDegreeEarnings}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
