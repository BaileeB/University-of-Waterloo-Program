import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Compass, 
  MapPin, 
  FileCheck2, 
  BookmarkCheck,
  CheckCircle2
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyzer' | 'programs' | 'kw-guide' | 'application-guide' | 'tracker';
  setActiveTab: (tab: 'analyzer' | 'programs' | 'kw-guide' | 'application-guide' | 'tracker') => void;
  savedProgramsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedProgramsCount }) => {
  return (
    <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Waterloo<span className="text-amber-400">Quest</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <MapPin className="w-3 h-3" /> KW Region
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Admissions & Chance Tracker for Kitchener-Waterloo High Schools
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Chance Analyzer</span>
            </button>

            <button
              onClick={() => setActiveTab('programs')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'programs'
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden md:inline">Programs Directory</span>
              <span className="md:hidden">Programs</span>
            </button>

            <button
              onClick={() => setActiveTab('kw-guide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'kw-guide'
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden md:inline">KW Student Edge</span>
              <span className="md:hidden">KW Guide</span>
            </button>

            <button
              onClick={() => setActiveTab('application-guide')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'application-guide'
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span className="hidden lg:inline">AIF & Deadlines</span>
              <span className="lg:hidden">AIF</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'tracker'
                  ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden md:inline">My Tracker</span>
              <span className="md:hidden">Tracker</span>
              {savedProgramsCount > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeTab === 'tracker' ? 'bg-zinc-950 text-amber-400' : 'bg-amber-400 text-zinc-950'
                }`}>
                  {savedProgramsCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
