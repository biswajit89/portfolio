export interface Profile {
  name: string;
  title: string;
  summary: string;
  photo?: string;
  location: string;
  email: string;
  socials: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  resumeURL: string;
  availability: 'available' | 'open' | 'not-looking';
  stats: StatItem[];
}

export interface StatItem {
  value: string;
  label: string;
  icon: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  isRemote: boolean;
  summary: string[];
  achievements: string[];
  techStack: string[];
  artifacts: Artifact[];
}

export interface Artifact {
  type: 'link' | 'image' | 'video';
  url: string;
  title: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  duration: string;
  problem: string;
  solution: string;
  architecture: string;
  impactMetrics: string[];
  techStack: string[];
  screenshots: string[];
  videoUrl?: string;
  liveUrl?: string;
  repoUrl?: string;
  highlights: string[];
  categories: ProjectCategory[];
}

export type ProjectCategory = 'frontend' | 'fullstack' | '3d' | 'oss' | 'ai' | 'security';

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  proficiency: 1 | 2 | 3 | 4 | 5;
  proofLinks: ProofLink[];
}

export interface ProofLink {
  type: 'project' | 'experience';
  id: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockCondition: AchievementCondition;
}

export interface AchievementCondition {
  type: 'projectViews' | 'experienceExpands' | 'proofClicks' | 'contactSubmit';
  threshold: number;
}

export interface PortfolioContent {
  profile: Profile;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  achievements: Achievement[];
}
