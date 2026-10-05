import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  Sliders, 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Plus, 
  Compass, 
  Download, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { TrackerItem, Faculty } from '../types';
import { WATERLOO_PROGRAMS } from '../data/programsData';

interface ApplicationTrackerProps {
  trackerItems: TrackerItem[];
  onRemoveItem: (id: string) => void;
  onUpdateStatus: (id: string, status: TrackerItem['status']) => void;
  onNavigateToPrograms: () => void;
  defaultTop6?: number;
  defaultAif?: number;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  trackerItems,
  onRemoveItem,
  onUpdateStatus,
  onNavigateToPrograms,
  defaultTop6 = 94,
  defaultAif = 3.5
}) => {
  // "What-if" simulation state
  const [simulatedTop6, setSimulatedTop6] = useState(defaultTop6);
  const [simulatedAif, setSimulatedAif] = useState(defaultAif);
  const [simulatedEuclid, setSimulatedEuclid] = useState<number>(75);

  // Application Checklist state
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Submit OUAC Undergrad Application (by Jan 15)', done: true },
    { id: 'c2', label: 'Activate Waterloo Quest Portal Account (via email)', done: true },
    { id: 'c3', label: 'Submit AIF Part A: Reasons for Choosing Waterloo', done: false },
    { id: 'c4', label: 'Submit AIF Part B: Extracurriculars & Leadership', done: false },
    { id: 'c5', label: 'Submit AIF Part C: Work Experience & Circumstances', done: false },
    { id: 'c6', label: 'Complete Kira Talent Video Interview (Engineering)', done: false },
    { id: 'c7', label: 'Register for Euclid Math Contest at High School (April)', done: false }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  // Re-calculate simulated odds dynamically for each tracked program
  const calculateSimulatedOdds = (item: TrackerItem) => {
    const prog = WATERLOO_PROGRAMS.find(p => p.id === item.programId);
    if (!prog) return item.currentCalculatedOdds;

    const diff = simulatedTop6 - prog.minCutoffAvg;
    let base = 50;

    if (prog.competitivenessTier.includes('Ultra')) {
      if (simulatedTop6 >= 98.5) base = 75;
      else if (simulatedTop6 >= 97.0) base = 55;
      else if (simulatedTop6 >= 95.5) base = 35;
      else if (simulatedTop6 >= 94.0) base = 18;
      else base = 8;
    } else if (prog.competitivenessTier.includes('Highly')) {
      if (simulatedTop6 >= 95.5) base = 88;
      else if (simulatedTop6 >= 93.5) base = 70;
      else if (simulatedTop6 >= 91.5) base = 50;
      else if (simulatedTop6 >= 89.0) base = 28;
      else base = 12;
    } else {
      if (simulatedTop6 >= 92.0) base = 92;
      else if (simulatedTop6 >= 89.0) base = 78;
      else if (simulatedTop6 >= 86.0) base = 55;
      else base = 25;
    }

    // AIF effect
    base += (simulatedAif - 3.0) * 8;

    // Euclid bonus for Math/CS
    if (prog.faculty === 'Mathematics & CS' && simulatedEuclid >= 70) {
      base += 12;
    }

    return Math.min(98, Math.max(5, Math.round(base)));
  };

  const handleExportPlan = () => {
    const lines = [
      '--- WaterlooQuest Application Tracker Plan ---',
      `Simulated Top 6 Average: ${simulatedTop6}%`,
      `Simulated AIF Score: ${simulatedAif} / 5.0`,
      `Simulated Euclid Contest: ${simulatedEuclid} / 100`,
      '',
      'Tracked Programs:',
      ...trackerItems.map(
        i => `* ${i.programName} (${i.faculty}) - Status: ${i.status}, Projected Odds: ${calculateSimulatedOdds(i)}%`
      ),
      '',
      'Milestones Checklist:',
      ...checklist.map(c => `[${c.done ? 'X' : ' '}] ${c.label}`)
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Waterloo_Application_Tracker.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-2">
              <BookmarkCheck className="w-3.5 h-3.5" />
              Personalized Admission Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              My Waterloo <span className="text-amber-400">Application Tracker</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed mt-1">
              Simulate "what-if" grade and AIF improvements, monitor your application checklist, and track real-time admission chances.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPlan}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export Plan
            </button>
            <button
              onClick={onNavigateToPrograms}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-bold text-zinc-950 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add More Programs
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE "WHAT-IF" SIMULATION ENGINE */}
      <section className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800">
          <Sliders className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Interactive "What-If" Admission Odds Simulator
            </h2>
            <p className="text-xs text-zinc-400">
              Drag the sliders below to see how boosting your marks or polishing your AIF transforms your odds!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
          {/* Slider 1: Top 6 Average */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Top 6 High School Average:</span>
              <span className="text-amber-400 font-bold text-sm">{simulatedTop6}%</span>
            </div>
            <input
              type="range"
              min={80}
              max={99}
              step={0.5}
              value={simulatedTop6}
              onChange={e => setSimulatedTop6(Number(e.target.value))}
              className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>80%</span>
              <span>90%</span>
              <span>99%</span>
            </div>
          </div>

          {/* Slider 2: AIF Rating */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Estimated AIF Score:</span>
              <span className="text-emerald-400 font-bold text-sm">{simulatedAif} / 5.0</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.1}
              value={simulatedAif}
              onChange={e => setSimulatedAif(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-zinc-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>1.0 (Basic)</span>
              <span>3.0 (Average)</span>
              <span>5.0 (Top 5%)</span>
            </div>
          </div>

          {/* Slider 3: Euclid Contest */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-zinc-300">
              <span>Projected Euclid Score:</span>
              <span className="text-sky-400 font-bold text-sm">{simulatedEuclid} / 100</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={1}
              value={simulatedEuclid}
              onChange={e => setSimulatedEuclid(Number(e.target.value))}
              className="w-full accent-sky-400 bg-zinc-800 rounded-lg h-2"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>20</span>
              <span>70 (Cutoff boost)</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TRACKED PROGRAMS LIST */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            Tracked Programs ({trackerItems.length})
          </h2>
          <span className="text-xs text-zinc-400">
            OUAC allows up to 3 program choices per university
          </span>
        </div>

        {trackerItems.length === 0 ? (
          <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800/80 p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No Programs Tracked Yet</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Browse the Programs Directory or run the Chance Analyzer to save Waterloo programs to your tracker.
            </p>
            <button
              onClick={onNavigateToPrograms}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-bold text-zinc-950 transition-colors"
            >
              Browse Waterloo Programs Directory
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {trackerItems.map(item => {
              const liveOdds = calculateSimulatedOdds(item);
              const isSafe = liveOdds >= 75;
              const isTarget = liveOdds >= 45 && liveOdds < 75;
              const isReach = liveOdds < 45;

              return (
                <div
                  key={item.id}
                  className="bg-zinc-900/90 rounded-2xl border border-zinc-800 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                >
                  {/* Left: Program info & Status */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                        {item.faculty}
                      </span>
                      <span className="text-xs text-zinc-500">
                        Added: {item.addedAt}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {item.programName}
                    </h3>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-zinc-400">Application Status:</span>
                      <select
                        value={item.status}
                        onChange={e => onUpdateStatus(item.id, e.target.value as any)}
                        className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-amber-400"
                      >
                        <option value="Researching">Researching</option>
                        <option value="Applied OUAC">Applied on OUAC</option>
                        <option value="AIF Submitted">AIF Submitted</option>
                        <option value="Interview Done">Kira Interview Done</option>
                        <option value="Admitted">🎉 Admitted / Offer Received</option>
                        <option value="Conditional">Conditional Accepted</option>
                      </select>
                    </div>
                  </div>

                  {/* Middle: Live Odds Progress Bar */}
                  <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-zinc-400">Simulated Odds:</span>
                      <span className={`text-base font-black ${
                        isSafe ? 'text-emerald-400' : isTarget ? 'text-blue-400' : 'text-amber-400'
                      }`}>
                        {liveOdds}%
                      </span>
                    </div>

                    <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSafe ? 'bg-emerald-400' : isTarget ? 'bg-blue-400' : 'bg-amber-400'
                        }`}
                        style={{ width: `${liveOdds}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-zinc-500 block text-right">
                      {isSafe ? 'Safe Match' : isTarget ? 'Solid Target' : 'Competitive Reach'}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-zinc-500 hover:text-red-400 p-2 rounded-xl transition-colors hover:bg-zinc-800"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: APPLICATION MILESTONES CHECKLIST */}
      <section className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Waterloo Admissions Milestones Checklist
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Check off your progress to ensure no strict deadlines are missed
            </p>
          </div>

          <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
            {checklist.filter(c => c.done).length} of {checklist.length} Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                item.done
                  ? 'bg-zinc-950/40 border-zinc-800/60 text-zinc-400 line-through'
                  : 'bg-zinc-950 border-zinc-800 text-white hover:border-amber-400/50'
              }`}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => {}} // handled by parent div
                className="w-4 h-4 rounded text-amber-400 border-zinc-700 bg-zinc-900 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm font-medium flex-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
