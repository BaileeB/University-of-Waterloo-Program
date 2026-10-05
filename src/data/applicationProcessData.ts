export interface ApplicationMilestone {
  date: string;
  title: string;
  description: string;
  category: 'OUAC' | 'AIF' | 'Interview' | 'Contest' | 'Decision';
  isImportant: boolean;
}

export const WATERLOO_APPLICATION_TIMELINE: ApplicationMilestone[] = [
  {
    date: 'Late September - October',
    title: 'OUAC Applications Open',
    description: 'Ontario high school students receive their OUAC access codes from their guidance counselor. Create your OUAC Undergrad application account and select your University of Waterloo program choices.',
    category: 'OUAC',
    isImportant: false
  },
  {
    date: 'November',
    title: 'Canadian Senior Mathematics Contest (CSMC)',
    description: 'Written at your high school. Excellent early indicator for Waterloo Math & CS admissions committees; strong scores provide early positive signals.',
    category: 'Contest',
    isImportant: false
  },
  {
    date: 'Mid-January (Usually ~Jan 15)',
    title: 'OUAC Application Deadline',
    description: 'Deadline to submit your initial application and pay application fees via OUAC for Ontario high school students.',
    category: 'OUAC',
    isImportant: true
  },
  {
    date: 'Late January',
    title: 'Activate Waterloo Quest Account',
    description: 'Waterloo emails you a Quest Student ID and login instructions 2-3 weeks after your OUAC submission. Quest is where you view required documents, upload unofficial transcripts, and access the AIF portal.',
    category: 'OUAC',
    isImportant: true
  },
  {
    date: 'Mid-February (~Feb 1 - Feb 15)',
    title: 'Engineering & Architecture AIF Deadline',
    description: 'Strict deadline to complete and submit your AIF and complete the Kira Talent online video interview for all Faculty of Engineering programs.',
    category: 'AIF',
    isImportant: true
  },
  {
    date: 'Late February',
    title: 'Canadian Computing Competition (CCC)',
    description: 'Written at your high school. The CCC Senior contest is heavily monitored by David R. Cheriton School of CS admissions. High scores often make or break borderline CS offers.',
    category: 'Contest',
    isImportant: true
  },
  {
    date: 'Late February / Early March',
    title: 'Mathematics, Science & Arts AIF Deadline',
    description: 'Final deadline to submit the AIF for Faculty of Mathematics, Science, Arts, Health, and Environment applicants.',
    category: 'AIF',
    isImportant: true
  },
  {
    date: 'Late March',
    title: 'Early Admission Round (March Round)',
    description: 'Waterloo sends early admission offers to top-tier applicants based on Grade 11 marks + completed Grade 12 Semester 1 final marks. Primarily for competitive programs with exceptional AIFs.',
    category: 'Decision',
    isImportant: false
  },
  {
    date: 'Early April',
    title: 'The Euclid Mathematics Contest',
    description: 'The flagship Grade 12 math competition created by CEMC. Mandatory for Waterloo Math faculty scholarships; scores of 70+ give a colossal boost to applicants waiting for the May CS/Math offer round.',
    category: 'Contest',
    isImportant: true
  },
  {
    date: 'May (Usually ~May 10 - May 18)',
    title: 'Main Admission Offer Round (May Round)',
    description: 'The vast majority (~75%+) of all Waterloo offers (including Software Engineering, CS, Mechatronics, Biomedical Eng) are released during this round after receiving Semester 2 midterm marks from OUAC.',
    category: 'Decision',
    isImportant: true
  },
  {
    date: 'June 1',
    title: 'Ontario Acceptance Deadline',
    description: 'Official deadline to accept your Waterloo offer of admission on OUAC and pay your residence deposit (if living on campus).',
    category: 'OUAC',
    isImportant: true
  }
];

export const AIF_GUIDE = {
  overview: 'The Admission Information Form (AIF) is an online form hosted on Waterloo Quest. It provides admissions committees with context beyond your raw numerical grades: your extracurricular leadership, employment history, programming/design projects, math contest participation, and reasons for choosing Waterloo.',
  scoringSystem: {
    maxPoints: 5.0,
    importanceDescription: 'In the Faculty of Mathematics, the AIF is scored from 0 to 5 points and added directly to your competitive admission average. A student with a 95% average and a 4.5 AIF score has an adjusted average of 99.5%, outranking a student with a 98% average and a 1.0 AIF! In Engineering, it forms an equal leg of the holistic admission matrix alongside your grades and Kira Talent interview.',
    tierBreakdown: [
      {
        tier: 'Tier 1 (Outstanding - Score 4.5 - 5.0)',
        criteria: 'National or international achievements (e.g. IOI, IMO, DECA ICDC finalist, Shad fellow, national science fair medalist, founded a registered business/startup with revenue, high CCC honor roll, varsity provincial champion).'
      },
      {
        tier: 'Tier 2 (Strong - Score 3.5 - 4.4)',
        criteria: 'Significant regional or school leadership (Student council president, robotics team captain, hackathon winner, tutor business founder, captain of high school sports team, 200+ community hours, consistent employment for 1+ years).'
      },
      {
        tier: 'Tier 3 (Average - Score 2.5 - 3.4)',
        criteria: 'Active club member (Math club, coding club, band, DECA member), some volunteering, summer jobs, participation in school events without major executive leadership.'
      },
      {
        tier: 'Tier 4 (Minimal - Score 0 - 2.4)',
        criteria: 'Few or no documented extracurricular activities, short generic essay responses, or no contest participation.'
      }
    ]
  },
  keyQuestions: [
    {
      section: 'Part A: General Information & Reasons for Choosing Waterloo',
      prompt: 'Why have you chosen your particular field of study? What aspects of Waterloo’s academic program or co-op model influenced your decision?',
      tip: 'Avoid generic compliments like "Waterloo has a great ranking". Mention specific 3rd/4th year courses, Waterloo design teams (like Midnight Sun, Formula SAE, WatSolve), co-op stream preference, or professors whose research excites you.'
    },
    {
      section: 'Part B: Extracurricular Activities & Leadership',
      prompt: 'List and describe your activities outside of the classroom: dates, weekly time commitment, and your specific roles/responsibilities.',
      tip: 'Quantify your impact! Use the STAR method: Situation, Task, Action, Result. Instead of "helped teach coding", write "Led 12 weekly Python workshops for 35 grade 9-10 students at Cameron Heights, resulting in 8 students entering their first hackathon."'
    },
    {
      section: 'Part C: Employment & Special Circumstances',
      prompt: 'Detail paid jobs, family responsibilities, and any medical/personal hardships that impacted your academic journey.',
      tip: 'Admissions committees respect working students! If you worked 15 hours a week at a grocery store or cared for siblings, explain how this taught you time management and perseverance under pressure.'
    },
    {
      section: 'Part D: Engineering / Math Specific Questions',
      prompt: 'Engineering applicants must explain specific hands-on technical projects, programming background, and team dynamics. Math applicants must list contest scores.',
      tip: 'Do not worry if you have not built a rocket — focus on curiosity, self-directed learning (e.g., building a personal web app, fixing an Arduino robot, taking online CS courses), and your passion for Waterloo\'s problem-solving culture.'
    }
  ]
};

export const KIRA_TALENT_GUIDE = {
  platform: 'Kira Talent Online Video Interview',
  requiredFor: 'Faculty of Engineering (BASc) and Architecture (BAS)',
  format: 'Completed asynchronously online via webcam. You receive 2 questions: one personal/behavioral question and one problem-solving/creative thinking question.',
  prepTime: '30 to 60 seconds to think; 60 to 90 seconds to record your spoken video response.',
  weight: 'Worth up to +3 bonus points on your engineering admission index. It can easily push a borderline 93% candidate ahead of an applicant who skipped the interview!',
  sampleQuestions: [
    'Tell us about a time you encountered an unexpected technical or personal obstacle. How did you diagnose the problem and what was the outcome?',
    'Why did you choose your specific engineering discipline (e.g., Mechatronics vs Software) over others, and what engineering problem do you hope to solve?',
    'Describe a situation where a team member was not contributing equally. How did you handle the conversation while keeping the project on schedule?',
    'If you had unlimited resources for 6 months, what physical or digital prototype would you engineer and why?'
  ],
  dosAndDonts: {
    dos: [
      'Speak clearly and look at the camera lens rather than looking down at your keyboard',
      'Structure your response: Conclusion first -> Supporting example -> Reflection on what you learned',
      'Highlight real hands-on enthusiasm for engineering problem solving',
      'Test your microphone, camera, and lighting in advance'
    ],
    donts: [
      'Do not read from a pre-written script or switch tabs (the platform tracks screen focus)',
      'Do not panic if you stumble; pause, take a breath, say "to clarify...", and continue confidently',
      'Do not exceed the time limit before delivering your concluding takeaway'
    ]
  }
};

export const COOP_EARNINGS_BREAKDOWN = {
  title: 'Waterloo Co-op Earnings & Work Term Structure',
  summary: 'Waterloo operates the largest co-op program in the world, with over 25,000 students employed in 7,500+ companies across 60+ countries.',
  averageEarningsPerTerm: [
    { term: 'Work Term 1 (Junior)', avgCad: 9200, hourlyRate: '$21.50 - $26.00/hr' },
    { term: 'Work Term 2 (Intermediate)', avgCad: 11800, hourlyRate: '$25.00 - $31.00/hr' },
    { term: 'Work Term 3 (Senior)', avgCad: 14500, hourlyRate: '$29.00 - $38.00/hr' },
    { term: 'Work Term 4-6 (Advanced / US Tech)', avgCad: '18,000 - 32,000+', hourlyRate: '$38.00 - $65.00+/hr (or $50-$70/hr USD)' }
  ],
  totalDegreeEarnings: '$65,000 to $120,000+ CAD earned across 5-6 work terms, allowing many students to graduate completely debt-free!'
};

export const KW_LOCAL_STUDENT_ADVANTAGE = {
  livingAtHomeVsResidence: {
    onCampusResidenceCost: '$14,500 - $18,000 / school year (Dorm + Meal Plan)',
    localCommuterCost: '$0 (Living with family) + $0 transit pass (GRT & ION LRT is free/included for all Waterloo students via WatCard!)',
    fourYearSavings: '$58,000 - $72,000+ CAD saved over the course of an undergraduate degree!'
  },
  localTransitAccessibility: 'The University of Waterloo has its own dedicated station on the ION Light Rail Line (Line 301). Trains arrive every 10-15 minutes, connecting Waterloo campus directly to Uptown Waterloo, Grand River Hospital, Kitchener City Hall, Downtown Kitchener, and Fairview Park in under 25 minutes.',
  techEcosystemConnections: 'Kitchener-Waterloo is celebrated as Canada’s Silicon Valley North. Local students benefit from attending meetups at Communitech (The Tannery in Kitchener), visiting Google’s massive engineering headquarters at Breithaupt St, attending Hack the North (Canada’s largest hackathon hosted at Waterloo), and tapping into the Waterloo-based Velocity Incubator.'
};
