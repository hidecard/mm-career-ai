
export interface RoadmapStep {
  title: string;
  description: string;
  skillsToAcquire: string[];
  toolsToMaster: string[];
  estimatedTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prerequisites: string[];
  projectIdea: string;
  successMetrics: string;
  resources: { title: string; url: string }[];
}

export interface RelatedJob {
  title: string;
  summary: string;
}

export interface CareerGuide {
  id: string;
  jobTitle: string;
  matchScore: number;
  summary: string;
  requiredSkills: string[];
  salaryRange: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  requiredExperience: string;
  softSkills: string[];
  interviewTips: string[];
  potentialCompanies: string[];
  recommendedCertifications: string[];
  mentorshipAdvice: string;
  longTermGoal: string;
  roadmap: RoadmapStep[];
  relatedJobs: RelatedJob[]; // New field for alternative career suggestions
  generatedAt: string;
}

export interface JobTrend {
  category: string;
  demand: number;
  growth: string;
}
