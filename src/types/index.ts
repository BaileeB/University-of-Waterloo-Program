export type Faculty = 
  | 'Engineering' 
  | 'Mathematics & CS' 
  | 'Science' 
  | 'Arts & SAF' 
  | 'Health' 
  | 'Environment';

export type CompetitivenessTier = 
  | 'Ultra Competitive (96%+)' 
  | 'Highly Competitive (92-95%)' 
  | 'Competitive (87-91%)' 
  | 'Moderate (80-86%)';

export interface Program {
  id: string;
  name: string;
  faculty: Faculty;
  degree: string;
  ouacCode: string;
  coopAvailable: boolean;
  mandatoryCoop: boolean;
  competitivenessTier: CompetitivenessTier;
  minCutoffAvg: number;
  competitiveAvgRange: string;
  requiredCourses: string[]; // e.g. ['ENG4U', 'MHF4U', 'MCV4U', 'SCH4U', 'SPH4U']
  minimumCourseGrade: number; // e.g. 70
  recommendedCourses: string[];
  aifRequirement: 'Mandatory & Heavily Weighted' | 'Mandatory' | 'Strongly Recommended';
  interviewRequirement: 'Kira Talent Video Interview' | 'SAFAA Video & Written' | 'Portfolio & Interview' | 'None';
  contestsRecommended: string[];
  firstYearSeats: number;
  description: string;
  keyFeatures: string[];
  careerPaths: string[];
  kwAdvantage: string;
  popularAlternatives: string[];
}

export interface CourseGrade {
  code: string;
  name: string;
  grade: number;
  status: 'completed' | 'midterm' | 'planned';
  isPrerequisite?: boolean;
}

export interface HighSchoolInfo {
  id: string;
  name: string;
  city: 'Waterloo' | 'Kitchener' | 'Cambridge' | 'Other Ontario';
  board: 'WRDSB' | 'WCDSB' | 'Independent' | 'Other';
  specialPrograms: string[];
  transitToUW: string;
  historicalAdjustmentFactorNote: string;
}

export interface StudentProfile {
  name: string;
  highSchoolId: string;
  highSchoolName: string;
  isKwLocal: boolean;
  courses: CourseGrade[];
  resumeText: string;
  resumeFileName?: string;
  myBlueprintText: string;
  myBlueprintFileName?: string;
  extracurriculars: string;
  workExperience: string;
  contestScores: {
    euclidScore?: number;
    cccScore?: number;
    csmcScore?: number;
    sinScore?: number;
  };
  intendedFaculties: Faculty[];
  targetPrograms: string[];
}

export interface ProgramChance {
  programId: string;
  programName: string;
  faculty: Faculty;
  oddsScore: number; // 0 - 100
  tier: 'High Chance / Safe Match' | 'Target / Solid Match' | 'Reach / Competitive' | 'High Reach / Lottery';
  calculatedAverage: number;
  cutoffAverage: number;
  prerequisitesMet: boolean;
  missingPrerequisites: string[];
  pros: string[];
  concerns: string[];
  recommendation: string;
}

export interface AnalysisResult {
  studentName: string;
  highSchoolSummary: string;
  calculatedTop6: number;
  coursesAudited: {
    code: string;
    grade: number;
    status: string;
    usedInTop6: boolean;
  }[];
  missingRequiredCourses: string[];
  aifScoreEstimate: {
    score: number; // e.g. 3.8 out of 5
    tier: string;
    extracurricularStrength: string;
    leadershipScore: string;
    contestBoost: string;
    feedback: string[];
  };
  kwLocalAdvantage: {
    isLocal: boolean;
    commuteFeasibility: string;
    estimatedAnnualSavings: string;
    localTechEcosystemFit: string;
    adjustmentFactorContext: string;
  };
  chances: ProgramChance[];
  topRecommendations: {
    bestMatchProgram: string;
    bestValueAlternative: string;
    hiddenGemProgram: string;
    reasoning: string;
  };
  actionItems: string[];
  aifDraftSuggestions: string[];
}

export interface TrackerItem {
  id: string;
  programId: string;
  programName: string;
  faculty: Faculty;
  addedAt: string;
  targetAverage: number;
  currentCalculatedOdds: number;
  notes: string;
  status: 'Researching' | 'Applied OUAC' | 'AIF Submitted' | 'Interview Done' | 'Admitted' | 'Conditional';
  deadlineDate: string;
}
