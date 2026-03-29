import type { Assessment, Candidate } from "@/shared/types/candidate";

export type { Assessment, Candidate } from "@/shared/types/candidate";

export const mockCandidates: Candidate[] = [
  {
    id: "cand-001",
    fullName: "Amina Rahman",
    location: "Dhaka, Bangladesh",
    appliedAt: "2026-02-11T09:30:00Z",
    status: "considering",
    essay:
      "I grew up in a flood-prone area where school closures were common. In grade 9, I organized a student committee to map safe routes and created a simple SMS tree so families could share updates quickly. " +
      "When we lacked internet, we still met in person and documented every issue. " +
      "Later, I taught younger students basic Python and helped them build a rainfall logbook app. " +
      "I believe leadership is not title; it is responsibility when systems fail. " +
      "At inVision U, I want to scale practical climate tools for vulnerable communities.",
    aiAssessment: {
      totalScore: 88,
      metrics: {
        leadership: 91,
        resilience: 89,
        techBase: 84,
        socialImpact: 90,
        growthDelta: 86,
      },
      aiProbability: 14,
      keyMilestones: [
        "Coordinated local student emergency-response map (age 15)",
        "Led peer tutoring circle for 40+ students during school shutdowns",
        "Built first community rainfall logging prototype",
        "Mentored junior volunteers and documented field improvements",
      ],
      explainability: {
        reasoning:
          "Assessment indicates consistently high initiative under adversity. Candidate demonstrates applied leadership, practical technical execution, and clear community outcomes over multiple years.",
        flags: [
          "Strong early leadership evidence",
          "High context specificity and concrete outcomes",
          "Sustained resilience pattern across disruptions",
        ],
      },
    },
  },
  {
    id: "cand-002",
    fullName: "Mateo Alvarez",
    location: "Medellín, Colombia",
    appliedAt: "2026-02-14T13:10:00Z",
    status: "pending",
    essay:
      "My first robotics project failed in front of my class because the drivetrain wiring was reversed. I rebuilt the bot with a teammate after school for two weeks and we presented version 2 with clear diagnostics. " +
      "Since then, I have participated in local hackathons and started a low-cost sensor project for indoor air quality in public schools. " +
      "I want to study human-centered computing and create tools that students can maintain themselves.",
    aiAssessment: {
      totalScore: 79,
      metrics: {
        leadership: 73,
        resilience: 85,
        techBase: 82,
        socialImpact: 76,
        growthDelta: 80,
      },
      aiProbability: 22,
      keyMilestones: [
        "Recovered failed classroom robotics demo and shipped revised prototype",
        "Participated in 6 local hackathons with iterative project improvements",
        "Deployed low-cost air-quality sensors in 2 schools",
      ],
      explainability: {
        reasoning:
          "Candidate exhibits robust learning loops and technical problem-solving. Leadership indicators are emerging, with stronger evidence in collaborative recovery and persistence.",
        flags: [
          "Clear failure-to-improvement narrative",
          "Good technical baseline with applied projects",
          "Moderate leadership signal; likely to grow with mentorship",
        ],
      },
    },
  },
  {
    id: "cand-003",
    fullName: "Ifeoma Okeke",
    location: "Lagos, Nigeria",
    appliedAt: "2026-02-10T17:45:00Z",
    status: "approved",
    essay:
      "I built a neighborhood reading club from four students to sixty by partnering with local teachers and small businesses for donated books. " +
      "During exam season, we added short mental-health check-ins and attendance improved by 31 percent. " +
      "I started learning data analytics to measure outcomes and identify who needed extra support. " +
      "My goal is to combine policy and technology to expand access for underserved learners.",
    aiAssessment: {
      totalScore: 92,
      metrics: {
        leadership: 94,
        resilience: 90,
        techBase: 81,
        socialImpact: 96,
        growthDelta: 88,
      },
      aiProbability: 11,
      keyMilestones: [
        "Expanded reading club from 4 to 60 participants",
        "Introduced wellbeing check-in model tied to attendance gains",
        "Implemented basic analytics dashboard for intervention planning",
        "Co-led district youth education forum",
      ],
      explainability: {
        reasoning:
          "Exceptionally strong social impact and leadership profile, backed by measurable outcomes and systems-thinking approach. Technical foundation is solid and likely to accelerate in university context.",
        flags: [
          "High social impact with quantifiable improvement",
          "Consistent leadership across program scaling stages",
          "Compelling growth trajectory and mission alignment",
        ],
      },
    },
  },
  {
    id: "cand-004",
    fullName: "Ravi Prakash (Hidden Gem)",
    location: "Patna, India",
    appliedAt: "2026-02-16T08:05:00Z",
    status: "considering",
    essay:
      "my english not best. i from small town and no big lab. i make computer class in shop after close time with old pcs. first only 3 kids come. now near 27 kids come weekly. " +
      "we learn basics and i ask older students teach younger. i also make simple attendance sheet and parent message in local language. " +
      "i did not have medals but i keep building things for my area and people trust me.",
    aiAssessment: {
      totalScore: 84,
      metrics: {
        leadership: 90,
        resilience: 93,
        techBase: 68,
        socialImpact: 87,
        growthDelta: 95,
      },
      aiProbability: 9,
      keyMilestones: [
        "Repurposed family shop space into evening computer-learning hub",
        "Scaled from 3 to 27 regular student participants",
        "Introduced peer-teaching model to multiply instruction capacity",
        "Built low-tech parent communication process in local language",
      ],
      explainability: {
        reasoning:
          "Despite informal writing quality, evidence shows extraordinary ownership, adaptive leadership, and steep growth. Candidate translates limited resources into sustained educational impact.",
        flags: [
          "Hidden Gem: high leadership with non-elite presentation style",
          "Very strong growth delta signal",
          "Authentic local-context execution; low AI pattern probability",
        ],
      },
    },
  },
  {
    id: "cand-005",
    fullName: "Olivia Chen",
    location: "Vancouver, Canada",
    appliedAt: "2026-02-12T11:20:00Z",
    status: "denied",
    essay:
      "In an era defined by exponential technological transformation, I am uniquely poised to synthesize interdisciplinary paradigms into scalable frameworks of societal advancement. " +
      "My leadership ethos is rooted in maximizing synergies, operational excellence, and innovation-driven impact vectors across stakeholder ecosystems. " +
      "Through a deeply reflective commitment to lifelong learning, I intend to architect globally resonant solutions that transcend traditional barriers and optimize collective human potential.",
    aiAssessment: {
      totalScore: 67,
      metrics: {
        leadership: 58,
        resilience: 54,
        techBase: 71,
        socialImpact: 60,
        growthDelta: 52,
      },
      aiProbability: 95,
      keyMilestones: [
        "Limited verifiable milestones; primarily aspirational statements",
        "No concrete implementation timeline in essay evidence",
        "High polish with low specificity in outcomes",
      ],
      explainability: {
        reasoning:
          "Essay structure appears highly optimized for fluency but lacks concrete personal evidence and measurable impact. High linguistic uniformity and generic phrasing strongly correlate with AI-generated patterns.",
        flags: [
          "AI Risk 95%: generic LLM phrasing detected",
          "Low specificity / weak first-person evidence",
          "Outcome claims not grounded in verifiable milestones",
        ],
      },
    },
  },
];

export const getCandidates = (): Candidate[] => mockCandidates;

export const getCandidateById = (id: string): Candidate | undefined =>
  mockCandidates.find((candidate) => candidate.id === id);

export const getCandidatesByStatus = (
  status: Candidate["status"] | "all",
): Candidate[] => {
  if (status === "all") return mockCandidates;
  return mockCandidates.filter((candidate) => candidate.status === status);
};

export const searchCandidatesByName = (query: string): Candidate[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return mockCandidates;
  return mockCandidates.filter((candidate) =>
    candidate.fullName.toLowerCase().includes(normalizedQuery),
  );
};
