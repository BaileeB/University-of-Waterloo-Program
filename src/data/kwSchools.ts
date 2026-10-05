import { HighSchoolInfo } from '../types';

export const KW_HIGH_SCHOOLS: HighSchoolInfo[] = [
  // WRDSB (Waterloo Region District School Board)
  {
    id: 'wci',
    name: 'Waterloo Collegiate Institute (WCI)',
    city: 'Waterloo',
    board: 'WRDSB',
    specialPrograms: ['Strings Program', 'Extended French', 'Advanced Math & Computing Clubs', 'Geotechnology'],
    transitToUW: 'Adjacent to UW (10 min walk or 3 min on GRT Bus 19 / 201 iXpress)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~13.5% (favorable / near provincial benchmark). Students historically perform very well in 1st year Waterloo Math & Engineering.'
  },
  {
    id: 'laurel-heights',
    name: 'Laurel Heights Secondary School (LHSS / formerly SJAM)',
    city: 'Waterloo',
    board: 'WRDSB',
    specialPrograms: ['AP (Advanced Placement)', 'SHSM Information & Communications Tech', 'Robotics Team 2702 (Rebels)'],
    transitToUW: 'Direct connection via GRT Bus 13 or 9 (approx. 12-15 min to campus)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~13.8% (favorable / standard). Strong reputation in CEMC math competitions.'
  },
  {
    id: 'cameron-heights',
    name: 'Cameron Heights Collegiate Institute (CHCI)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['International Baccalaureate (IB) Diploma Program', 'SHSM Arts & Culture', 'Model UN'],
    transitToUW: 'ION Light Rail from Borden / Kitchener Market station directly to University of Waterloo Station (~20 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.0% (IB cohort grades are recognized for exceptional rigor; strong history of admissions to Waterloo SE and CS).'
  },
  {
    id: 'bluevale',
    name: 'Bluevale Collegiate Institute (BCI)',
    city: 'Waterloo',
    board: 'WRDSB',
    specialPrograms: ['Advanced Placement (AP)', 'SHSM Sports & Health', 'Arts & Culture'],
    transitToUW: 'GRT Bus 8 or 12 directly down University Ave (~12-18 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.1% (Standard baseline). Consistently sends students to AFM and Waterloo Math.'
  },
  {
    id: 'kci',
    name: 'Kitchener-Waterloo Collegiate and Vocational School (KCI)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['Fast Forward', 'French Immersion', 'SHSM Information Tech', 'Heritage Tech Lab'],
    transitToUW: 'Short walk to Grand River Hospital ION Station -> 7 minutes on ION to University of Waterloo station!',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.2% (Benchmark). Exceptional transit proximity to campus.'
  },
  {
    id: 'grand-river',
    name: 'Grand River Collegiate Institute (GRCI)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['SHSM Construction & Transportation', 'High Skills Major', 'Engineering Design Club'],
    transitToUW: 'GRT Bus 205 / 201 iXpress to UW Station (~25-30 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.3% (Benchmark standard).'
  },
  {
    id: 'huron-heights',
    name: 'Huron Heights Secondary School (HHSS)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['SHSM Arts, Environment, Health & Wellness', 'DECA Business Club', 'Robotics'],
    transitToUW: 'GRT Route 201 iXpress directly connects Fischer-Hallman to University of Waterloo (~30 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.4% (Provincial benchmark).'
  },
  {
    id: 'eastwood',
    name: 'Eastwood Collegiate Institute (ECI)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['Integrated Arts Program (IAP)', 'SHSM Arts', 'Graphic Design & Media'],
    transitToUW: 'ION LRT from Ottawa / Mill station straight to UW Station (~22 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.5% (Great feeder for Waterloo School of Architecture and GBDA Stratford).'
  },
  {
    id: 'forest-heights',
    name: 'Forest Heights Collegiate Institute (FHCI)',
    city: 'Kitchener',
    board: 'WRDSB',
    specialPrograms: ['SHSM Business & Hospitality', 'ESL Program', 'STEM clubs'],
    transitToUW: 'GRT Bus 201 / 202 iXpress (~25 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.2%.'
  },
  {
    id: 'galt-collegiate',
    name: 'Galt Collegiate Institute (GCI)',
    city: 'Cambridge',
    board: 'WRDSB',
    specialPrograms: ['Heritage Cambridge', 'French Immersion', 'SHSM Health'],
    transitToUW: 'GRT Route 206 / 302 to Fairway Station, then ION to UW (~50 min, or 30 min drive)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.3% (Close proximity to Waterloo School of Architecture in Cambridge!).'
  },
  {
    id: 'jacob-hespeler',
    name: 'Jacob Hespeler Secondary School (JHSS)',
    city: 'Cambridge',
    board: 'WRDSB',
    specialPrograms: ['SHSM Manufacturing & Robotics', 'Fast Forward', 'High Skills Trades'],
    transitToUW: 'Direct commuter drive or bus transfer to Fairway ION (~40 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.1%.'
  },

  // WCDSB (Waterloo Catholic District School Board)
  {
    id: 'st-david',
    name: 'St. David Catholic Secondary School',
    city: 'Waterloo',
    board: 'WCDSB',
    specialPrograms: ['SHSM Information & Communications Tech', 'Engineering Robotics', 'French Immersion'],
    transitToUW: 'Located right next to campus on University Ave! 12 minute walk or 3 minutes on bus',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~13.7% (Favorable / very strong 1st year retention rate at UW).'
  },
  {
    id: 'resurrection',
    name: 'Resurrection Catholic Secondary School',
    city: 'Kitchener',
    board: 'WCDSB',
    specialPrograms: ['SHSM Health & Wellness', 'Co-op Education', 'Pre-Engineering'],
    transitToUW: 'GRT Bus 202 iXpress along University Ave directly into UW South Campus (~20 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.0% (Standard).'
  },
  {
    id: 'st-marys',
    name: "St. Mary's High School",
    city: 'Kitchener',
    board: 'WCDSB',
    specialPrograms: ['SHSM Business', 'Computer Science Club', 'Leadership'],
    transitToUW: 'GRT Bus 201 iXpress straight to Waterloo campus (~30 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.4% (Standard).'
  },
  {
    id: 'st-benedict',
    name: 'St. Benedict Catholic Secondary School',
    city: 'Cambridge',
    board: 'WCDSB',
    specialPrograms: ['SHSM Arts & Culture', 'Robotics Club', 'Co-op Education'],
    transitToUW: 'Bus to Fairway ION or drive (~35 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~14.2%.'
  },

  // Other / Independent
  {
    id: 'rockway',
    name: 'Rockway Mennonite Collegiate',
    city: 'Kitchener',
    board: 'Independent',
    specialPrograms: ['Choral & Music Program', 'Community Leadership', 'AP Courses'],
    transitToUW: 'ION LRT from Mill or Borden station directly to UW (~22 min)',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~13.9%.'
  },
  {
    id: 'sjk',
    name: "St. John's-Kilmarnock School (SJK)",
    city: 'Waterloo',
    board: 'Independent',
    specialPrograms: ['International Baccalaureate (IB) Continuum School', 'Round Square Global Network'],
    transitToUW: '20 min drive from Breslau/Waterloo campus',
    historicalAdjustmentFactorNote: 'Historical Waterloo Engineering adjustment factor: ~13.6% (Consistent high performance in engineering).'
  },
  {
    id: 'other-ontario',
    name: 'Other Ontario High School (Outside KW)',
    city: 'Other Ontario',
    board: 'Other',
    specialPrograms: ['Standard OSSD Curriculum'],
    transitToUW: 'GO Transit (Bus 25/30) / VIA Rail / ION network',
    historicalAdjustmentFactorNote: 'Waterloo uses Ontario provincial benchmark average (14.4%).'
  }
];
