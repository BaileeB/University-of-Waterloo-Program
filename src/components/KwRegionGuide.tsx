import React, { useState } from 'react';
import { 
  MapPin, 
  Building2, 
  Train, 
  DollarSign, 
  Award, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Calculator,
  Compass
} from 'lucide-react';
import { KW_HIGH_SCHOOLS } from '../data/kwSchools';
import { KW_LOCAL_STUDENT_ADVANTAGE } from '../data/applicationProcessData';

export const KwRegionGuide: React.FC = () => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<'All' | 'Waterloo' | 'Kitchener' | 'Cambridge'>('All');
  
  // Commute vs Residence Calculator State
  const [yearsAtHome, setYearsAtHome] = useState(4);
  const [estimatedRentPerMonth, setEstimatedRentPerMonth] = useState(1100);
  const [estimatedMealPlanPerTerm, setEstimatedMealPlanPerTerm] = useState(3200);

  const residenceAnnualCost = (estimatedRentPerMonth * 8) + (estimatedMealPlanPerTerm * 2);
  const totalDegreeSavings = residenceAnnualCost * yearsAtHome;

  const filteredSchools = KW_HIGH_SCHOOLS.filter(s => {
    if (s.city === 'Other Ontario') return false;
    if (selectedCityFilter === 'All') return true;
    return s.city === selectedCityFilter;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          The Kitchener-Waterloo Advantage
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          The <span className="text-amber-400">KW High School Student</span> Edge
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          High school students in the Waterloo Region (Kitchener, Waterloo, Cambridge) enjoy extraordinary geographic, financial, and academic advantages when applying to and attending the University of Waterloo.
        </p>

        {/* 3 Pillars Quick Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> $60,000+ Savings
            </span>
            <h4 className="text-sm font-bold text-white">Live At Home & Commute</h4>
            <p className="text-xs text-zinc-400">
              Skip $15k/yr dorm and meal plan costs. Free ION Light Rail directly to campus with your WatCard.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Proven Rigor
            </span>
            <h4 className="text-sm font-bold text-white">Favorable Adjustment Factors</h4>
            <p className="text-xs text-zinc-400">
              WRDSB & WCDSB schools historically perform reliably at or above provincial standards in 1st year Waterloo STEM.
            </p>
          </div>

          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 space-y-1">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Silicon Valley North
            </span>
            <h4 className="text-sm font-bold text-white">Local Tech Ecosystem</h4>
            <p className="text-xs text-zinc-400">
              Direct access to Communitech, Google Waterloo, Velocity Incubator, and local Waterloo co-op employers.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE COMMUTE VS RESIDENCE CALCULATOR */}
      <section className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                KW Living-At-Home vs Campus Residence Financial Calculator
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Calculate your cumulative tuition and living savings by commuting to Waterloo from Kitchener, Waterloo, or Cambridge
            </p>
          </div>

          <div className="bg-emerald-950/60 border border-emerald-800/60 px-4 py-2 rounded-2xl text-right">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">Total Estimated Savings</span>
            <span className="text-2xl font-black text-emerald-300">
              ${totalDegreeSavings.toLocaleString()} CAD
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Sliders */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Years Commuting from Home (in KW):</span>
                <span className="text-amber-400 font-bold">{yearsAtHome} academic years</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={yearsAtHome}
                onChange={e => setYearsAtHome(Number(e.target.value))}
                className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                <span>1 Year (First year)</span>
                <span>4 Years (Full Degree)</span>
                <span>5 Years (Co-op)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Estimated Student Rent / Dorm per Month:</span>
                <span className="text-amber-400 font-bold">${estimatedRentPerMonth} / month</span>
              </div>
              <input
                type="range"
                min={800}
                max={1600}
                step={50}
                value={estimatedRentPerMonth}
                onChange={e => setEstimatedRentPerMonth(Number(e.target.value))}
                className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2"
              />
              <span className="text-[10px] text-zinc-500 block mt-1">
                Typical Waterloo student residence or shared student housing off University Ave / Columbia St
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-2">
                <span>Meal Plan / Groceries per Term (4 months):</span>
                <span className="text-amber-400 font-bold">${estimatedMealPlanPerTerm} / term</span>
              </div>
              <input
                type="range"
                min={2000}
                max={4500}
                step={100}
                value={estimatedMealPlanPerTerm}
                onChange={e => setEstimatedMealPlanPerTerm(Number(e.target.value))}
                className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2"
              />
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="lg:col-span-5 bg-zinc-950 rounded-2xl p-6 border border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Annual Financial Breakdown (2 Academic Terms)
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Residence / Rent (8 months):</span>
                <span className="font-bold text-white">${(estimatedRentPerMonth * 8).toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Campus Meal Plan (2 terms):</span>
                <span className="font-bold text-white">${(estimatedMealPlanPerTerm * 2).toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-zinc-800">
                <span className="text-zinc-400">Local Transit Pass:</span>
                <span className="font-bold text-emerald-400">$0 (Included in tuition via WatCard)</span>
              </div>

              <div className="flex justify-between py-2 pt-3 text-sm font-bold text-amber-400">
                <span>Annual Savings:</span>
                <span>${residenceAnnualCost.toLocaleString()} CAD / yr</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800">
              💡 <strong>Pro-Tip:</strong> KW students who commute graduate with an average of $60,000 less debt, allowing co-op earnings to be directly invested or saved for post-grad!
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: WATERLOO ENGINEERING ADJUSTMENT FACTOR EXPLAINED */}
      <section className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admissions Transparency
          </div>
          <h2 className="text-2xl font-bold text-white">
            Waterloo Engineering High School Adjustment Factor Explained
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
            Every year, the University of Waterloo Faculty of Engineering tracks the performance of incoming students by comparing their final Grade 12 admission average with their first-year university engineering average.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3 text-xs leading-relaxed text-zinc-300">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-1.5">
              <Award className="w-4 h-4" /> How the Benchmark Works
            </h4>
            <p>
              On average across all Ontario high schools, a student with a <strong>95% high school average</strong> achieves approximately an <strong>80.6% average</strong> in their first year of Waterloo Engineering. This standard drop of <strong>~14.4%</strong> is known as the <em>Ontario Provincial Benchmark</em>.
            </p>
            <p>
              If high schools systematically inflate marks, their students experience larger drops (e.g. 20-25%), which results in an unfavorable adjustment factor.
            </p>
          </div>

          <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3 text-xs leading-relaxed text-zinc-300">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Why KW Region Schools Are in Great Standing
            </h4>
            <p>
              High schools across the <strong>Waterloo Region District School Board (WRDSB)</strong> and <strong>Waterloo Catholic District School Board (WCDSB)</strong> consistently match or beat the benchmark (~13.5% to 14.2% historical drop).
            </p>
            <p>
              Because KW teachers and math departments closely align with Waterloo’s CEMC curriculum, Waterloo admissions officers know that a 95% at schools like <strong>WCI, Laurel Heights, Cameron Heights IB, or Bluevale</strong> represents authentic, rigorous academic preparation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: WATERLOO REGION HIGH SCHOOLS DIRECTORY */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Waterloo Region High Schools Directory
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Explore your school’s specialized programs, transit route to UW, and historical academic strengths
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2">
            {(['All', 'Waterloo', 'Kitchener', 'Cambridge'] as const).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCityFilter(city)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCityFilter === city
                    ? 'bg-amber-400 text-zinc-950'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map(school => (
            <div
              key={school.id}
              className="bg-zinc-900/90 rounded-2xl border border-zinc-800 hover:border-zinc-700 p-6 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                    {school.city} • {school.board}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white">
                  {school.name}
                </h3>

                {/* Special Programs */}
                <div className="mt-3 space-y-1">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Specialized Programs:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {school.specialPrograms.map((prog, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-950 text-zinc-300 border border-zinc-800"
                      >
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Transit to UW */}
                <div className="mt-4 bg-zinc-950/70 p-3 rounded-xl border border-zinc-800/80 space-y-1 text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1 text-[11px]">
                    <Train className="w-3.5 h-3.5" /> Commute to Campus:
                  </span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">
                    {school.transitToUW}
                  </p>
                </div>
              </div>

              {/* Adjustment Factor / Insight */}
              <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
                <strong className="text-zinc-300 block mb-0.5">Admissions Note:</strong>
                {school.historicalAdjustmentFactorNote}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: LOCAL TECH ECOSYSTEM */}
      <section className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Silicon Valley North
          </div>
          <h2 className="text-2xl font-bold text-white">
            Connect With Waterloo Region’s World-Class Innovation Cluster
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Kitchener-Waterloo has the 2nd highest density of tech startups in North America outside of Silicon Valley.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-white">Google Waterloo</h4>
            <p className="text-xs text-zinc-400">
              Located at Breithaupt St in Downtown Kitchener (12 min on ION). Massive engineering hub hiring hundreds of Waterloo CS/Eng co-ops every term.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-white">Communitech Hub</h4>
            <p className="text-xs text-zinc-400">
              The legendary 80,000 sq ft tech hub in Kitchener’s historic Tannery building. Hosts hackathons, venture pitch competitions, and startup hiring events.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-white">Velocity Incubator</h4>
            <p className="text-xs text-zinc-400">
              University of Waterloo’s flagship startup incubator. Velocity companies have raised over $4.3B in funding and created thousands of regional tech jobs.
            </p>
          </div>

          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800 space-y-2">
            <h4 className="text-sm font-bold text-white">Hack the North</h4>
            <p className="text-xs text-zinc-400">
              Canada’s largest collegiate hackathon hosted annually on Waterloo campus. 1,000+ top hackers, sponsored by Meta, Google, and Jane Street.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
