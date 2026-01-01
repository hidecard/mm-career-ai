
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

export interface Resume {
  id: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: {
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    graduationYear: string;
    gpa?: string;
  }[];
  skills: string[];
  certifications: string[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Mentor {
  id: string;
  name: string;
  jobTitle: string;
  company: string;
  industry: string;
  experience: string;
  location: string;
  expertise: string[];
  availability: 'Available' | 'Limited' | 'Unavailable';
  bio: string;
  linkedin?: string;
  email: string;
  matchScore: number;
  matchedInterests: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  applicationDeadline?: string;
  source: string;
  url?: string;
  matchScore: number;
  contactEmail?: string;
  contactPhone?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'Course' | 'Tutorial' | 'Book' | 'Video' | 'Certification' | 'Workshop';
  platform: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: string;
  url: string;
  skills: string[];
  rating: number;
  matchScore: number;
}
