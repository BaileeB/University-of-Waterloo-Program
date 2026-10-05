/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AdmissionsAnalyzer } from './components/AdmissionsAnalyzer';
import { ProgramsDirectory } from './components/ProgramsDirectory';
import { KwRegionGuide } from './components/KwRegionGuide';
import { ApplicationGuide } from './components/ApplicationGuide';
import { ApplicationTracker } from './components/ApplicationTracker';
import { TrackerItem, Faculty } from './types';
import { GraduationCap, Heart, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

const INITIAL_TRACKED_PROGRAMS: TrackerItem[] = [
  {
    id: 't-1',
    programId: 'computer-science',
    programName: 'Computer Science (CS)',
    faculty: 'Mathematics & CS',
    addedAt: 'October 2026',
    targetAverage: 97.0,
    currentCalculatedOdds: 55,
    notes: 'Primary choice. Focus on Euclid contest in April.',
    status: 'Applied OUAC',
    deadlineDate: 'Feb 15, 2027 (AIF)'
  },
  {
    id: 't-2',
    programId: 'software-engineering',
    programName: 'Software Engineering (SE)',
    faculty: 'Engineering',
    addedAt: 'October 2026',
    targetAverage: 97.5,
    currentCalculatedOdds: 48,
    notes: 'Kira video interview required. Target 98%+ in MCV4U.',
    status: 'Researching',
    deadlineDate: 'Feb 1, 2027 (AIF & Kira)'
  },
  {
    id: 't-3',
    programId: 'systems-design-engineering',
    programName: 'Systems Design Engineering (SYDE)',
    faculty: 'Engineering',
    addedAt: 'October 2026',
    targetAverage: 94.0,
    currentCalculatedOdds: 72,
    notes: 'High-value target match. Excellent product & software co-op placements.',
    status: 'Researching',
    deadlineDate: 'Feb 1, 2027 (AIF)'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'programs' | 'kw-guide' | 'application-guide' | 'tracker'>('analyzer');

  // Local storage for tracked programs
  const [trackedPrograms, setTrackedPrograms] = useState<TrackerItem[]>(() => {
    try {
      const saved = localStorage.getItem('waterlooquest_tracked_programs');
      return saved ? JSON.parse(saved) : INITIAL_TRACKED_PROGRAMS;
    } catch {
      return INITIAL_TRACKED_PROGRAMS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('waterlooquest_tracked_programs', JSON.stringify(trackedPrograms));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [trackedPrograms]);

  const handleAddToTracker = (
    programId: string,
    programName: string,
    faculty: Faculty,
    targetAvg: number,
    odds: number
  ) => {
    if (trackedPrograms.some(item => item.programId === programId)) {
      return;
    }
    const newItem: TrackerItem = {
      id: `t-${Date.now()}`,
      programId,
      programName,
      faculty,
      addedAt: 'October 2026',
      targetAverage: targetAvg,
      currentCalculatedOdds: odds,
      notes: 'Added from WaterlooQuest.',
      status: 'Researching',
      deadlineDate: 'Mid-February (AIF)'
    };
    setTrackedPrograms([newItem, ...trackedPrograms]);
  };

  const handleRemoveTrackedProgram = (id: string) => {
    setTrackedPrograms(trackedPrograms.filter(item => item.id !== id));
  };

  const handleUpdateStatus = (id: string, status: TrackerItem['status']) => {
    setTrackedPrograms(
      trackedPrograms.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-zinc-950">
      {/* Top Notice Banner */}
      <div className="bg-amber-400 text-zinc-950 text-xs font-semibold px-4 py-1.5 text-center flex items-center justify-center gap-2">
        <MapPin className="w-3.5 h-3.5" />
        <span>
          <strong>KW Student Portal:</strong> Tailored for Kitchener-Waterloo Region high school students applying to the University of Waterloo.
        </span>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedProgramsCount={trackedPrograms.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'analyzer' && (
          <AdmissionsAnalyzer
            onAddToTracker={handleAddToTracker}
            savedProgramIds={trackedPrograms.map(p => p.programId)}
            onNavigateToPrograms={() => setActiveTab('programs')}
          />
        )}

        {activeTab === 'programs' && (
          <ProgramsDirectory
            onAddToTracker={handleAddToTracker}
            savedProgramIds={trackedPrograms.map(p => p.programId)}
          />
        )}

        {activeTab === 'kw-guide' && <KwRegionGuide />}

        {activeTab === 'application-guide' && <ApplicationGuide />}

        {activeTab === 'tracker' && (
          <ApplicationTracker
            trackerItems={trackedPrograms}
            onRemoveItem={handleRemoveTrackedProgram}
            onUpdateStatus={handleUpdateStatus}
            onNavigateToPrograms={() => setActiveTab('programs')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-500 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-zinc-950 font-bold flex items-center justify-center text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-zinc-300 font-bold text-sm">WaterlooQuest</p>
              <p className="text-zinc-500 text-[11px]">
                Admissions Guide & Chance Analyzer for Kitchener-Waterloo High Schools
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-zinc-400 text-xs">
            <button onClick={() => setActiveTab('analyzer')} className="hover:text-amber-400 transition-colors">
              Chance Analyzer
            </button>
            <button onClick={() => setActiveTab('programs')} className="hover:text-amber-400 transition-colors">
              Programs Directory
            </button>
            <button onClick={() => setActiveTab('kw-guide')} className="hover:text-amber-400 transition-colors">
              KW Student Edge
            </button>
            <button onClick={() => setActiveTab('application-guide')} className="hover:text-amber-400 transition-colors">
              AIF Masterclass
            </button>
            <button onClick={() => setActiveTab('tracker')} className="hover:text-amber-400 transition-colors">
              My Tracker
            </button>
          </div>

          <div className="text-[11px] text-zinc-600 text-center sm:text-right">
            Independent admissions advisory tool. Not officially affiliated with University of Waterloo or OUAC.
          </div>
        </div>
      </footer>
    </div>
  );
}
