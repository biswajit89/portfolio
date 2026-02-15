import type {
  Profile,
  StatItem,
  Education,
  Experience,
  Artifact,
  Project,
  ProjectCategory,
  SkillCategory,
  Skill,
  ProofLink,
  Achievement,
  AchievementCondition,
  PortfolioContent,
} from '@/types/content';

const PROJECT_CATEGORIES: ProjectCategory[] = ['frontend', 'fullstack', '3d', 'oss', 'ai', 'security'];
const AVAILABILITY_VALUES = ['available', 'open', 'not-looking'] as const;
const ARTIFACT_TYPES = ['link', 'image', 'video'] as const;
const PROOF_LINK_TYPES = ['project', 'experience'] as const;
const ACHIEVEMENT_CONDITION_TYPES = ['projectViews', 'experienceExpands', 'proofClicks', 'contactSubmit'] as const;
const VALID_PROFICIENCIES = [1, 2, 3, 4, 5] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

export function isStatItem(value: unknown): value is StatItem {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return isNonEmptyString(obj.value) && isNonEmptyString(obj.label) && isNonEmptyString(obj.icon);
}

export function isProfile(value: unknown): value is Profile {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.name) &&
    isNonEmptyString(obj.title) &&
    typeof obj.summary === 'string' &&
    isNonEmptyString(obj.location) &&
    isNonEmptyString(obj.email) &&
    typeof obj.socials === 'object' &&
    obj.socials !== null &&
    isNonEmptyString(obj.resumeURL) &&
    typeof obj.availability === 'string' &&
    (AVAILABILITY_VALUES as readonly string[]).includes(obj.availability) &&
    Array.isArray(obj.stats) &&
    obj.stats.every(isStatItem)
  );
}

export function isEducation(value: unknown): value is Education {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.institution) &&
    isNonEmptyString(obj.degree) &&
    isNonEmptyString(obj.field) &&
    isNonEmptyString(obj.startDate) &&
    isNonEmptyString(obj.endDate) &&
    isStringArray(obj.highlights)
  );
}

export function isArtifact(value: unknown): value is Artifact {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    (ARTIFACT_TYPES as readonly string[]).includes(obj.type) &&
    isNonEmptyString(obj.url) &&
    isNonEmptyString(obj.title)
  );
}

export function isExperience(value: unknown): value is Experience {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.company) &&
    isNonEmptyString(obj.role) &&
    isNonEmptyString(obj.startDate) &&
    (obj.endDate === null || isNonEmptyString(obj.endDate)) &&
    isNonEmptyString(obj.location) &&
    typeof obj.isRemote === 'boolean' &&
    isStringArray(obj.summary) &&
    isStringArray(obj.achievements) &&
    isStringArray(obj.techStack) &&
    Array.isArray(obj.artifacts) &&
    obj.artifacts.every(isArtifact)
  );
}

export function isProjectCategory(value: unknown): value is ProjectCategory {
  return typeof value === 'string' && (PROJECT_CATEGORIES as string[]).includes(value);
}

export function isProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.title) &&
    isNonEmptyString(obj.description) &&
    isNonEmptyString(obj.role) &&
    isNonEmptyString(obj.duration) &&
    isNonEmptyString(obj.problem) &&
    isNonEmptyString(obj.solution) &&
    isNonEmptyString(obj.architecture) &&
    isStringArray(obj.impactMetrics) &&
    isStringArray(obj.techStack) &&
    isStringArray(obj.screenshots) &&
    (obj.videoUrl === undefined || typeof obj.videoUrl === 'string') &&
    (obj.liveUrl === undefined || typeof obj.liveUrl === 'string') &&
    (obj.repoUrl === undefined || typeof obj.repoUrl === 'string') &&
    isStringArray(obj.highlights) &&
    Array.isArray(obj.categories) &&
    obj.categories.every(isProjectCategory)
  );
}

export function isProofLink(value: unknown): value is ProofLink {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    (PROOF_LINK_TYPES as readonly string[]).includes(obj.type) &&
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.description)
  );
}

export function isSkill(value: unknown): value is Skill {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.name) &&
    typeof obj.proficiency === 'number' &&
    (VALID_PROFICIENCIES as readonly number[]).includes(obj.proficiency) &&
    Array.isArray(obj.proofLinks) &&
    obj.proofLinks.every(isProofLink)
  );
}

export function isSkillCategory(value: unknown): value is SkillCategory {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.name) &&
    Array.isArray(obj.skills) &&
    obj.skills.every(isSkill)
  );
}

export function isAchievementCondition(value: unknown): value is AchievementCondition {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.type === 'string' &&
    (ACHIEVEMENT_CONDITION_TYPES as readonly string[]).includes(obj.type) &&
    typeof obj.threshold === 'number' &&
    Number.isInteger(obj.threshold) &&
    obj.threshold > 0
  );
}

export function isAchievement(value: unknown): value is Achievement {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isNonEmptyString(obj.id) &&
    isNonEmptyString(obj.name) &&
    isNonEmptyString(obj.description) &&
    isNonEmptyString(obj.icon) &&
    isAchievementCondition(obj.unlockCondition)
  );
}

export function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    isProfile(obj.profile) &&
    Array.isArray(obj.education) &&
    obj.education.every(isEducation) &&
    Array.isArray(obj.experience) &&
    obj.experience.every(isExperience) &&
    Array.isArray(obj.projects) &&
    obj.projects.every(isProject) &&
    Array.isArray(obj.skills) &&
    obj.skills.every(isSkillCategory) &&
    Array.isArray(obj.achievements) &&
    obj.achievements.every(isAchievement)
  );
}


// --- Content Loading Utilities ---

import portfolioData from '@/content/portfolio.json';

/**
 * Loads and validates the full portfolio content from the JSON file.
 * Throws if the content fails runtime validation.
 */
export function loadPortfolioContent(): PortfolioContent {
  if (!isPortfolioContent(portfolioData)) {
    throw new Error('Portfolio content failed runtime validation');
  }
  return portfolioData;
}

/** Returns the validated profile section. */
export function getProfile(): Profile {
  return loadPortfolioContent().profile;
}

/** Returns the validated education entries. */
export function getEducation(): Education[] {
  return loadPortfolioContent().education;
}

/** Returns the validated experience entries. */
export function getExperiences(): Experience[] {
  return loadPortfolioContent().experience;
}

/** Returns the validated project entries. */
export function getProjects(): Project[] {
  return loadPortfolioContent().projects;
}

/** Returns the validated skill categories. */
export function getSkills(): SkillCategory[] {
  return loadPortfolioContent().skills;
}

/** Returns the validated achievement definitions. */
export function getAchievements(): Achievement[] {
  return loadPortfolioContent().achievements;
}
/**
 * Sorts experiences chronologically with most recent first.
 * Experiences with null endDate (current job) are treated as most recent.
 * Primary sort: endDate descending, secondary sort: startDate descending.
 */
export function sortExperiencesChronologically(experiences: Experience[]): Experience[] {
  return [...experiences].sort((a, b) => {
    const endA = a.endDate ?? '\uffff';
    const endB = b.endDate ?? '\uffff';
    if (endA !== endB) return endB.localeCompare(endA);
    return b.startDate.localeCompare(a.startDate);
  });
}

/**
 * Sorts education entries chronologically with most recent first.
 * Primary sort: endDate descending, secondary sort: startDate descending.
 */
export function sortEducationChronologically(education: Education[]): Education[] {
  return [...education].sort((a, b) => {
    if (a.endDate !== b.endDate) return b.endDate.localeCompare(a.endDate);
    return b.startDate.localeCompare(a.startDate);
  });
}


/**
 * Filters projects by category. Returns all projects when category is null.
 */
export function filterProjects(
  projects: Project[],
  category: ProjectCategory | null,
): Project[] {
  if (category === null) return projects;
  return projects.filter((project) => project.categories.includes(category));
}

/** All valid project categories for building filter UI. */
export const ALL_PROJECT_CATEGORIES: ProjectCategory[] = [
  'frontend',
  'fullstack',
  '3d',
  'oss',
  'ai',
  'security',
];

/** Human-readable labels for project categories. */
export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  frontend: 'Frontend',
  fullstack: 'Full Stack',
  '3d': '3D',
  oss: 'OSS',
  ai: 'AI',
  security: 'Security',
};

