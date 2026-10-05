import { CourseGrade, Faculty, Program, ProgramChance, StudentProfile } from '../types';
import { WATERLOO_PROGRAMS } from '../data/programsData';

// Helper to normalize course code (e.g. "ENG4U1" -> "ENG4U", "MCV4U-A" -> "MCV4U")
export function normalizeCourseCode(code: string): string {
  const cleaned = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (cleaned.length >= 5) {
    return cleaned.substring(0, 5);
  }
  return cleaned;
}

// Compute Faculty-specific Top 6
export function calculateFacultyTop6(
  courses: CourseGrade[],
  faculty: Faculty,
  programId?: string
): { top6Average: number; usedCourses: CourseGrade[]; missingCourses: string[] } {
  // Map normalized code -> CourseGrade
  const courseMap = new Map<string, CourseGrade>();
  courses.forEach(c => {
    const norm = normalizeCourseCode(c.code);
    const existing = courseMap.get(norm);
    if (!existing || c.grade > existing.grade) {
      courseMap.set(norm, c);
    }
  });

  let requiredCodes: string[] = ['ENG4U'];
  let missingCodes: string[] = [];

  if (faculty === 'Engineering') {
    if (programId === 'school-of-architecture') {
      requiredCodes = ['ENG4U', 'SPH4U'];
      // math either MCV4U or MHF4U
      const hasMath = courseMap.has('MCV4U') || courseMap.has('MHF4U');
      if (!hasMath) missingCodes.push('MCV4U or MHF4U');
    } else {
      requiredCodes = ['ENG4U', 'MHF4U', 'MCV4U', 'SCH4U', 'SPH4U'];
    }
  } else if (faculty === 'Mathematics & CS') {
    requiredCodes = ['ENG4U', 'MHF4U', 'MCV4U'];
  } else if (faculty === 'Science') {
    requiredCodes = ['ENG4U'];
    const hasMath = courseMap.has('MHF4U') || courseMap.has('MCV4U');
    if (!hasMath) missingCodes.push('MHF4U or MCV4U');
  } else if (faculty === 'Arts & SAF') {
    requiredCodes = ['ENG4U'];
    if (programId === 'accounting-and-financial-management' || programId === 'biotechnology-cpa') {
      const hasMath = courseMap.has('MHF4U') || courseMap.has('MCV4U') || courseMap.has('MDM4U');
      if (!hasMath) missingCodes.push('4U Math (MHF4U/MCV4U/MDM4U)');
    }
  } else if (faculty === 'Health') {
    requiredCodes = ['ENG4U'];
    const hasMath = courseMap.has('MHF4U') || courseMap.has('MCV4U');
    if (!hasMath) missingCodes.push('MHF4U or MCV4U');
    if (!courseMap.has('SBI4U')) missingCodes.push('SBI4U');
  } else if (faculty === 'Environment') {
    requiredCodes = ['ENG4U'];
    if (programId === 'geomatics') {
      const hasMath = courseMap.has('MHF4U') || courseMap.has('MCV4U');
      if (!hasMath) missingCodes.push('MHF4U or MCV4U');
    }
  }

  // Find exact required matches
  const usedCourses: CourseGrade[] = [];
  const usedCodes = new Set<string>();

  for (const req of requiredCodes) {
    const course = courseMap.get(req);
    if (course) {
      usedCourses.push(course);
      usedCodes.add(req);
    } else {
      missingCodes.push(req);
    }
  }

  // Fill remainder from best remaining 4U/4M courses to reach 6 total
  const remaining = courses
    .filter(c => !usedCodes.has(normalizeCourseCode(c.code)))
    .sort((a, b) => b.grade - a.grade);

  for (const c of remaining) {
    if (usedCourses.length >= 6) break;
    usedCourses.push(c);
    usedCodes.add(normalizeCourseCode(c.code));
  }

  if (usedCourses.length === 0) {
    return { top6Average: 0, usedCourses: [], missingCourses: missingCodes };
  }

  const sum = usedCourses.reduce((acc, c) => acc + c.grade, 0);
  const avg = Math.round((sum / usedCourses.length) * 10) / 10;

  return {
    top6Average: avg,
    usedCourses,
    missingCourses: missingCodes
  };
}

// Calculate holistic AIF Score (0.0 to 5.0)
export function estimateAifScore(profile: StudentProfile): {
  score: number;
  tier: string;
  extracurricularStrength: string;
  leadershipScore: string;
  contestBoost: string;
  feedback: string[];
} {
  let score = 2.5; // baseline average
  const text = (
    (profile.resumeText || '') +
    ' ' +
    (profile.extracurriculars || '') +
    ' ' +
    (profile.workExperience || '')
  ).toLowerCase();

  const feedback: string[] = [];

  // Keywords search
  const nationalKeywords = ['national', 'international', 'olympiad', 'deca icdc', 'shad', 'first robotics', 'patents', 'founder', 'revenue'];
  const leadershipKeywords = ['president', 'captain', 'founder', 'led', 'executive', 'lead organizer', 'head tutor', 'vp'];
  const stemKeywords = ['hackathon', 'github', 'python', 'java', 'robotics', 'cad', 'circuit', 'research', 'lab', 'biology', 'machine learning'];
  const workKeywords = ['employed', 'work', 'part-time', 'cashier', 'server', 'tutor', 'intern', 'co-op', 'retail'];

  const hasNational = nationalKeywords.some(kw => text.includes(kw));
  const hasLeadership = leadershipKeywords.some(kw => text.includes(kw));
  const hasStem = stemKeywords.some(kw => text.includes(kw));
  const hasWork = workKeywords.some(kw => text.includes(kw));

  if (hasNational) {
    score += 1.3;
    feedback.push('National / high-impact achievements detected (+1.3 points)');
  } else if (hasLeadership) {
    score += 0.8;
    feedback.push('Demonstrated executive leadership & club initiative (+0.8 points)');
  }

  if (hasStem) {
    score += 0.5;
    feedback.push('Technical projects, coding, or hands-on STEM skills evident (+0.5 points)');
  }

  if (hasWork) {
    score += 0.4;
    feedback.push('Consistent employment or work experience shows time management (+0.4 points)');
  }

  // Contest Boost
  let contestBoost = 'No contest scores recorded';
  if (profile.contestScores.euclidScore && profile.contestScores.euclidScore >= 70) {
    score += 0.8;
    contestBoost = `Outstanding Euclid score (${profile.contestScores.euclidScore}/100) — major Math/CS boost (+0.8)`;
    feedback.push(contestBoost);
  } else if (profile.contestScores.euclidScore && profile.contestScores.euclidScore >= 55) {
    score += 0.4;
    contestBoost = `Solid Euclid score (${profile.contestScores.euclidScore}/100) — above Waterloo threshold (+0.4)`;
    feedback.push(contestBoost);
  }

  if (profile.contestScores.cccScore && profile.contestScores.cccScore >= 45) {
    score += 0.6;
    feedback.push(`Strong Canadian Computing Competition (${profile.contestScores.cccScore}/75) — CS edge (+0.6)`);
  }

  // Local KW advantage in extracurriculars
  if (profile.isKwLocal) {
    score += 0.2;
    feedback.push('Kitchener-Waterloo regional high school context & local community involvement (+0.2)');
  }

  // Bound score between 1.0 and 5.0
  score = Math.min(5.0, Math.max(1.0, Math.round(score * 10) / 10));

  let tier = 'Tier 3 (Average Candidate)';
  if (score >= 4.4) tier = 'Tier 1 (Exceptional / Top 5% AIF)';
  else if (score >= 3.6) tier = 'Tier 2 (Strong / Top 25% AIF)';
  else if (score < 2.5) tier = 'Tier 4 (Developing / Needs More Extracurricular Evidence)';

  return {
    score,
    tier,
    extracurricularStrength: hasNational ? 'Very High (National/Competitive)' : hasLeadership ? 'Strong (Leadership roles)' : 'Moderate',
    leadershipScore: hasLeadership ? 'High (Organized teams or events)' : 'Standard (Participation)',
    contestBoost,
    feedback
  };
}

// Compute program chances
export function evaluateProgramChances(
  program: Program,
  profile: StudentProfile,
  aifScore: number
): ProgramChance {
  const { top6Average, missingCourses } = calculateFacultyTop6(
    profile.courses,
    program.faculty,
    program.id
  );

  const cut = program.minCutoffAvg;
  const diff = top6Average - cut;

  // Base odds calculated from mark difference
  let odds = 50; // neutral base

  if (program.competitivenessTier === 'Ultra Competitive (96%+)') {
    // Highly selective: CS, SE, Mechatronics, SYDE, CFM
    if (top6Average >= 98.5) odds = 75;
    else if (top6Average >= 97.0) odds = 55;
    else if (top6Average >= 95.5) odds = 35;
    else if (top6Average >= 94.0) odds = 18;
    else odds = 8;
  } else if (program.competitivenessTier === 'Highly Competitive (92-95%)') {
    // Math, Management Eng, Mechanical Eng, AFM, Nanotech
    if (top6Average >= 95.5) odds = 88;
    else if (top6Average >= 93.5) odds = 70;
    else if (top6Average >= 91.5) odds = 50;
    else if (top6Average >= 89.0) odds = 28;
    else odds = 12;
  } else if (program.competitivenessTier === 'Competitive (87-91%)') {
    // Civil, Chemical, Biomedical Sciences, Health Sciences, Geomatics
    if (top6Average >= 92.0) odds = 92;
    else if (top6Average >= 89.0) odds = 78;
    else if (top6Average >= 86.0) odds = 55;
    else if (top6Average >= 83.0) odds = 30;
    else odds = 15;
  } else {
    // Moderate: Arts and Business, Honours Science, Planning, Environment & Business
    if (top6Average >= 87.0) odds = 95;
    else if (top6Average >= 84.0) odds = 82;
    else if (top6Average >= 81.0) odds = 65;
    else if (top6Average >= 78.0) odds = 40;
    else odds = 20;
  }

  // AIF effect
  const aifDelta = (aifScore - 3.0) * 8; // strong AIF adds up to +16%, weak subtracts up to -16%
  odds += aifDelta;

  // Contest score bonus for Math & CS
  if (program.faculty === 'Mathematics & CS') {
    if (profile.contestScores.euclidScore && profile.contestScores.euclidScore >= 75) {
      odds += 12;
    } else if (profile.contestScores.euclidScore && profile.contestScores.euclidScore >= 60) {
      odds += 6;
    }

    if (profile.contestScores.cccScore && profile.contestScores.cccScore >= 45) {
      odds += 8;
    }
  }

  // Missing prerequisites penalty
  if (missingCourses.length > 0) {
    odds -= missingCourses.length * 15;
  }

  // Bound odds between 5% and 98%
  odds = Math.min(98, Math.max(5, Math.round(odds)));

  let tier: ProgramChance['tier'] = 'Target / Solid Match';
  if (odds >= 75) tier = 'High Chance / Safe Match';
  else if (odds >= 45) tier = 'Target / Solid Match';
  else if (odds >= 20) tier = 'Reach / Competitive';
  else tier = 'High Reach / Lottery';

  const pros: string[] = [];
  const concerns: string[] = [];

  if (top6Average >= cut + 2) {
    pros.push(`Top 6 average (${top6Average}%) is comfortably above the ${cut}% historical cutoff`);
  } else if (top6Average >= cut) {
    pros.push(`Top 6 average (${top6Average}%) is within the competitive range (${cut}%+)`);
  } else {
    concerns.push(`Top 6 average (${top6Average}%) is currently below the competitive mark of ${cut}%`);
  }

  if (aifScore >= 3.8) {
    pros.push(`Strong AIF estimate (${aifScore}/5.0) significantly strengthens this application`);
  } else if (aifScore < 2.8) {
    concerns.push(`AIF is currently on the lower side (${aifScore}/5.0) — add more quantified leadership to boost chances`);
  }

  if (missingCourses.length > 0) {
    concerns.push(`Missing or unverified required prerequisite(s): ${missingCourses.join(', ')}`);
  } else {
    pros.push('All key faculty prerequisite course codes are accounted for');
  }

  if (profile.isKwLocal) {
    pros.push('Kitchener-Waterloo local school advantage & zero residence overhead if commuting');
  }

  let recommendation = '';
  if (tier === 'High Chance / Safe Match') {
    recommendation = `Excellent odds! Maintain current academic consistency and finalize your AIF on Quest early.`;
  } else if (tier === 'Target / Solid Match') {
    recommendation = `Strong candidate. Aiming for +1-2% in remaining midterms or an outstanding Kira video interview will secure an offer.`;
  } else if (tier === 'Reach / Competitive') {
    recommendation = `Competitive reach. Focus heavily on Euclid/CCC contest performance and highlighting unique engineering/computing personal projects in your AIF.`;
  } else {
    recommendation = `High reach program. We strongly recommend including related Waterloo alternate programs (e.g. ${program.popularAlternatives.slice(0, 2).join(', ')}) on your OUAC application.`;
  }

  return {
    programId: program.id,
    programName: program.name,
    faculty: program.faculty,
    oddsScore: odds,
    tier,
    calculatedAverage: top6Average,
    cutoffAverage: cut,
    prerequisitesMet: missingCourses.length === 0,
    missingPrerequisites: missingCourses,
    pros,
    concerns,
    recommendation
  };
}

// Full Profile Evaluation
export function runFullEvaluation(profile: StudentProfile): {
  top6Average: number;
  aifScoreEstimate: ReturnType<typeof estimateAifScore>;
  chances: ProgramChance[];
  recommendedPrograms: {
    safeMatch: ProgramChance[];
    targetMatch: ProgramChance[];
    reachMatch: ProgramChance[];
  };
} {
  const { top6Average } = calculateFacultyTop6(profile.courses, 'Engineering');
  const aifScoreEstimate = estimateAifScore(profile);

  const chances = WATERLOO_PROGRAMS.map(program =>
    evaluateProgramChances(program, profile, aifScoreEstimate.score)
  ).sort((a, b) => b.oddsScore - a.oddsScore);

  const safeMatch = chances.filter(c => c.tier === 'High Chance / Safe Match');
  const targetMatch = chances.filter(c => c.tier === 'Target / Solid Match');
  const reachMatch = chances.filter(c => c.tier === 'Reach / Competitive' || c.tier === 'High Reach / Lottery');

  return {
    top6Average,
    aifScoreEstimate,
    chances,
    recommendedPrograms: {
      safeMatch,
      targetMatch,
      reachMatch
    }
  };
}
