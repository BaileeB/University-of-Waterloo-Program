import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Compass, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Award, 
  Scale, 
  X, 
  Layers, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Program, Faculty, CompetitivenessTier } from '../types';
import { WATERLOO_PROGRAMS } from '../data/programsData';

interface ProgramsDirectoryProps {
  onAddToTracker: (programId: string, programName: string, faculty: Faculty, targetAvg: number, odds: number) => void;
  savedProgramIds: string[];
  onSelectProgramForAnalysis?: (programId: string) => void;
}

export const ProgramsDirectory: React.FC<ProgramsDirectoryProps> = ({
  onAddToTracker,
  savedProgramIds,
  onSelectProgramForAnalysis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [coopOnly, setCoopOnly] = useState(false);
  const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);

  // Program comparison state (up to 2 programs)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filter programs
  const filteredPrograms = WATERLOO_PROGRAMS.filter(prog => {
    // Search query matches title, description, degree, or careers
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      prog.name.toLowerCase().includes(query) ||
      prog.description.toLowerCase().includes(query) ||
      prog.degree.toLowerCase().includes(query) ||
      prog.careerPaths.some(c => c.toLowerCase().includes(query)) ||
      prog.requiredCourses.some(r => r.toLowerCase().includes(query));

    const matchesFaculty = selectedFaculty === 'All' || prog.faculty === selectedFaculty;
    const matchesTier = selectedTier === 'All' || prog.competitivenessTier.includes(selectedTier);
    const matchesCoop = !coopOnly || prog.coopAvailable;

    return matchesSearch && matchesFaculty && matchesTier && matchesCoop;
  });

  const toggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter(i => i !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const comparedPrograms = WATERLOO_PROGRAMS.filter(p => compareIds.includes(p.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          Comprehensive Waterloo Undergraduate Directory
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore All <span className="text-amber-400">University of Waterloo</span> Programs
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Detailed admission requirements, competitive grade cutoffs, AIF weights, required 12U/M prerequisites, and local Kitchener-Waterloo advantages across all 6 faculties.
        </p>

        {/* Search & Filters Row */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search programs, careers, or course codes (e.g. CS, Robotics, SPH4U)..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Faculty Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedFaculty}
              onChange={e => setSelectedFaculty(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Faculties (6 Faculties)</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics & CS">Mathematics & CS</option>
              <option value="Science">Science</option>
              <option value="Arts & SAF">Arts & SAF (School of Accounting & Finance)</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
            </select>
          </div>

          {/* Competitiveness Tier Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
            >
              <option value="All">All Tiers</option>
              <option value="Ultra">Ultra (96%+)</option>
              <option value="Highly">Highly (92-95%)</option>
              <option value="Competitive">Competitive (87-91%)</option>
              <option value="Moderate">Moderate (80-86%)</option>
            </select>
          </div>

          {/* Co-op Only Toggle */}
          <div className="md:col-span-2 flex items-center">
            <label className="flex items-center gap-2 cursor-pointer bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 w-full text-xs font-semibold text-zinc-300 hover:text-white">
              <input
                type="checkbox"
                checked={coopOnly}
                onChange={e => setCoopOnly(e.target.checked)}
                className="rounded border-zinc-700 text-amber-500 focus:ring-amber-400 h-4 w-4 bg-zinc-900"
              />
              <span>Co-op Available</span>
            </label>
          </div>
        </div>

        {/* Results Counter & Compare Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-zinc-400">
          <div>
            Showing <strong className="text-white">{filteredPrograms.length}</strong> of {WATERLOO_PROGRAMS.length} programs
          </div>

          {compareIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold">
                {compareIds.length} program(s) selected for comparison
              </span>
              <button
                onClick={() => setShowCompareModal(true)}
                className="px-3 py-1 rounded-lg bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-colors flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" /> Compare Side-by-Side
              </button>
              <button
                onClick={() => setCompareIds([])}
                className="text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrograms.map(program => {
          const isSaved = savedProgramIds.includes(program.id);
          const isCompared = compareIds.includes(program.id);
          const isExpanded = expandedProgramId === program.id;

          return (
            <div
              key={program.id}
              className="bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700 p-6 flex flex-col justify-between transition-all space-y-4 shadow-sm"
            >
              <div>
                {/* Header: Faculty Badge & OUAC Code */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                    {program.faculty}
                  </span>
                  <span className="text-xs font-mono font-semibold text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    OUAC: {program.ouacCode}
                  </span>
                </div>

                {/* Program Name & Degree */}
                <h3 className="text-lg font-bold text-white leading-snug">
                  {program.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {program.degree}
                </p>

                {/* Competitive Range & Tier */}
                <div className="mt-3 flex items-center justify-between text-xs bg-zinc-950/70 p-2.5 rounded-xl border border-zinc-800/80">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Competitive Range</span>
                    <span className="font-extrabold text-amber-400 text-sm">{program.competitiveAvgRange}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Historical Cutoff</span>
                    <span className="font-bold text-zinc-300">{program.minCutoffAvg}% min</span>
                  </div>
                </div>

                {/* Required Ontario 4U Courses */}
                <div className="mt-3.5 space-y-1.5">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                    Required Ontario 12U/M Courses:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {program.requiredCourses.map((req, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-200 border border-zinc-700/60"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AIF & Interview Requirements Badges */}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                    AIF: <strong>{program.aifRequirement}</strong>
                  </span>
                  {program.interviewRequirement !== 'None' && (
                    <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-semibold">
                      {program.interviewRequirement}
                    </span>
                  )}
                  {program.coopAvailable && (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-semibold">
                      {program.mandatoryCoop ? 'Mandatory Co-op' : 'Co-op Available'}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="mt-3 text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {program.description}
                </p>

                {/* Expandable Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-zinc-800 space-y-3 text-xs">
                    {/* Key Features */}
                    <div>
                      <span className="font-bold text-white block mb-1">Key Highlights:</span>
                      <ul className="list-disc list-inside space-y-1 text-zinc-300 pl-1">
                        {program.keyFeatures.map((feat, fIdx) => (
                          <li key={fIdx}>{feat}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Career Paths */}
                    <div>
                      <span className="font-bold text-white block mb-1">Common Career Paths:</span>
                      <div className="flex flex-wrap gap-1">
                        {program.careerPaths.map((career, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 rounded-full bg-zinc-950 text-zinc-300 border border-zinc-800 text-[11px]">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* KW Advantage */}
                    <div className="bg-amber-400/5 p-3 rounded-xl border border-amber-400/20 space-y-1">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> Kitchener-Waterloo Advantage:
                      </span>
                      <p className="text-zinc-300 text-[11px] leading-relaxed">
                        {program.kwAdvantage}
                      </p>
                    </div>

                    {/* Popular Alternatives */}
                    <div>
                      <span className="font-bold text-zinc-400 block mb-1">Smart Waterloo Alternatives:</span>
                      <p className="text-zinc-400 text-[11px]">
                        {program.popularAlternatives.map(altId => {
                          const alt = WATERLOO_PROGRAMS.find(p => p.id === altId);
                          return alt ? alt.name : altId;
                        }).join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedProgramId(isExpanded ? null : program.id)}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? (
                    <>
                      <span>Show Less</span> <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Details & Careers</span> <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  {/* Compare Toggle */}
                  <button
                    onClick={() => toggleCompare(program.id)}
                    className={`p-2 rounded-xl text-xs transition-colors border ${
                      isCompared
                        ? 'bg-amber-400/20 text-amber-400 border-amber-400/30'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white border-zinc-700'
                    }`}
                    title="Compare Side-by-Side"
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  {/* Add to Tracker */}
                  <button
                    onClick={() => {
                      onAddToTracker(
                        program.id,
                        program.name,
                        program.faculty,
                        program.minCutoffAvg,
                        50 // default baseline
                      );
                    }}
                    disabled={isSaved}
                    className={`flex items-center gap-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all ${
                      isSaved
                        ? 'bg-zinc-800 text-zinc-500 cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" /> Tracked
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" /> Track
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal */}
      {showCompareModal && comparedPrograms.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-bold text-white">Side-by-Side Program Comparison</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {comparedPrograms.map(p => (
                <div key={p.id} className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      {p.faculty}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-1">{p.name}</h4>
                    <p className="text-xs text-zinc-400">{p.degree} • OUAC: {p.ouacCode}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Competitive Avg:</span>
                      <span className="font-extrabold text-amber-400">{p.competitiveAvgRange}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Prerequisites:</span>
                      <span className="font-mono text-zinc-200">{p.requiredCourses.join(', ')}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">AIF Requirement:</span>
                      <span className="font-medium text-zinc-300">{p.aifRequirement}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Interview:</span>
                      <span className="font-medium text-zinc-300">{p.interviewRequirement}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">Co-op Format:</span>
                      <span className="font-medium text-emerald-400">
                        {p.mandatoryCoop ? 'Mandatory (6 work terms)' : 'Co-op Available (4-5 terms)'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-zinc-800">
                      <span className="text-zinc-500">1st Year Class Size:</span>
                      <span className="font-medium text-zinc-300">~{p.firstYearSeats} seats</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-zinc-400 block mb-1">Career Paths:</span>
                    <div className="flex flex-wrap gap-1">
                      {p.careerPaths.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-400/5 p-3 rounded-xl border border-amber-400/20 text-xs text-zinc-300">
                    <strong className="text-amber-400 block mb-0.5">KW Region Edge:</strong>
                    {p.kwAdvantage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
