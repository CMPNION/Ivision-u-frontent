export interface Candidate {
  id: string;
  fullName: string;
  location: string;
  appliedAt: string;
  status: "pending" | "considering" | "approved" | "denied";
  essay: string;
  aiAssessment: Assessment;
}

export interface Assessment {
  totalScore: number; // 0-100
  metrics: {
    leadership: number;
    resilience: number;
    techBase: number;
    socialImpact: number;
    growthDelta: number;
  };
  aiProbability: number; // 0-100%
  keyMilestones: string[]; // For trajectory
  explainability: {
    reasoning: string;
    flags: string[]; // e.g., "Generic LLM phrasing detected", "Strong early leadership evidence"
  };
}
