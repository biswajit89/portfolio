import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  isProfile,
  isEducation,
  isExperience,
  isProject,
  isSkillCategory,
  isAchievement,
  isPortfolioContent,
} from '@/utils/content';

/**
 * Property 13: Content Schema Validation
 *
 * For any portfolio content object, it SHALL conform to the defined TypeScript interfaces:
 * Profile must have name, title, email, resumeURL;
 * Experience must have company, role, dates;
 * Project must have title, description, problem, solution;
 * Skill must have name and proficiency 1-5.
 *
 * **Validates: Requirements 18.1, 18.2, 18.3, 18.4, 18.5, 18.6**
 */

// --- Arbitraries ---

const nonEmptyStringArb = fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0);

const statItemArb = fc.record({
  value: nonEmptyStringArb,
  label: nonEmptyStringArb,
  icon: nonEmptyStringArb,
});

const socialsArb = fc.record({
  linkedin: fc.option(nonEmptyStringArb, { nil: undefined }),
  github: fc.option(nonEmptyStringArb, { nil: undefined }),
  twitter: fc.option(nonEmptyStringArb, { nil: undefined }),
});

const availabilityArb = fc.constantFrom('available' as const, 'open' as const, 'not-looking' as const);

const profileArb = fc.record({
  name: nonEmptyStringArb,
  title: nonEmptyStringArb,
  summary: fc.string(),
  location: nonEmptyStringArb,
  email: nonEmptyStringArb,
  socials: socialsArb,
  resumeURL: nonEmptyStringArb,
  availability: availabilityArb,
  stats: fc.array(statItemArb, { minLength: 0, maxLength: 5 }),
});

const educationArb = fc.record({
  id: nonEmptyStringArb,
  institution: nonEmptyStringArb,
  degree: nonEmptyStringArb,
  field: nonEmptyStringArb,
  startDate: nonEmptyStringArb,
  endDate: nonEmptyStringArb,
  highlights: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
});

const artifactTypeArb = fc.constantFrom('link' as const, 'image' as const, 'video' as const);

const artifactArb = fc.record({
  type: artifactTypeArb,
  url: nonEmptyStringArb,
  title: nonEmptyStringArb,
});

const experienceArb = fc.record({
  id: nonEmptyStringArb,
  company: nonEmptyStringArb,
  role: nonEmptyStringArb,
  startDate: nonEmptyStringArb,
  endDate: fc.oneof(nonEmptyStringArb, fc.constant(null)),
  location: nonEmptyStringArb,
  isRemote: fc.boolean(),
  summary: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  achievements: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  techStack: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
  artifacts: fc.array(artifactArb, { minLength: 0, maxLength: 3 }),
});

const projectCategoryArb = fc.constantFrom(
  'frontend' as const,
  'fullstack' as const,
  '3d' as const,
  'oss' as const,
  'ai' as const,
  'security' as const,
);

const projectArb = fc.record({
  id: nonEmptyStringArb,
  title: nonEmptyStringArb,
  description: nonEmptyStringArb,
  role: nonEmptyStringArb,
  duration: nonEmptyStringArb,
  problem: nonEmptyStringArb,
  solution: nonEmptyStringArb,
  architecture: nonEmptyStringArb,
  impactMetrics: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  techStack: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
  screenshots: fc.array(fc.string(), { minLength: 0, maxLength: 3 }),
  videoUrl: fc.option(fc.string(), { nil: undefined }),
  liveUrl: fc.option(fc.string(), { nil: undefined }),
  repoUrl: fc.option(fc.string(), { nil: undefined }),
  highlights: fc.array(fc.string(), { minLength: 0, maxLength: 5 }),
  categories: fc.array(projectCategoryArb, { minLength: 1, maxLength: 3 }),
});

const proofLinkTypeArb = fc.constantFrom('project' as const, 'experience' as const);

const proofLinkArb = fc.record({
  type: proofLinkTypeArb,
  id: nonEmptyStringArb,
  description: nonEmptyStringArb,
});

const proficiencyArb = fc.constantFrom(1 as const, 2 as const, 3 as const, 4 as const, 5 as const);

const skillArb = fc.record({
  id: nonEmptyStringArb,
  name: nonEmptyStringArb,
  proficiency: proficiencyArb,
  proofLinks: fc.array(proofLinkArb, { minLength: 0, maxLength: 3 }),
});

const skillCategoryArb = fc.record({
  name: nonEmptyStringArb,
  skills: fc.array(skillArb, { minLength: 1, maxLength: 5 }),
});

const achievementConditionTypeArb = fc.constantFrom(
  'projectViews' as const,
  'experienceExpands' as const,
  'proofClicks' as const,
  'contactSubmit' as const,
);

const achievementConditionArb = fc.record({
  type: achievementConditionTypeArb,
  threshold: fc.integer({ min: 1, max: 100 }),
});

const achievementArb = fc.record({
  id: nonEmptyStringArb,
  name: nonEmptyStringArb,
  description: nonEmptyStringArb,
  icon: nonEmptyStringArb,
  unlockCondition: achievementConditionArb,
});

const portfolioContentArb = fc.record({
  profile: profileArb,
  education: fc.array(educationArb, { minLength: 0, maxLength: 5 }),
  experience: fc.array(experienceArb, { minLength: 0, maxLength: 5 }),
  projects: fc.array(projectArb, { minLength: 0, maxLength: 6 }),
  skills: fc.array(skillCategoryArb, { minLength: 0, maxLength: 5 }),
  achievements: fc.array(achievementArb, { minLength: 0, maxLength: 5 }),
});

// --- Property Tests ---

const NUM_RUNS = 100;

describe('Property 13: Content Schema Validation', () => {
  it('generated Profile objects pass runtime validation', () => {
    fc.assert(
      fc.property(profileArb, (profile) => {
        expect(isProfile(profile)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated Education objects pass runtime validation', () => {
    fc.assert(
      fc.property(educationArb, (education) => {
        expect(isEducation(education)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated Experience objects pass runtime validation', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        expect(isExperience(experience)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated Project objects pass runtime validation', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        expect(isProject(project)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated SkillCategory objects pass runtime validation', () => {
    fc.assert(
      fc.property(skillCategoryArb, (skillCategory) => {
        expect(isSkillCategory(skillCategory)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated Achievement objects pass runtime validation', () => {
    fc.assert(
      fc.property(achievementArb, (achievement) => {
        expect(isAchievement(achievement)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('generated PortfolioContent objects pass runtime validation', () => {
    fc.assert(
      fc.property(portfolioContentArb, (content) => {
        expect(isPortfolioContent(content)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('Profile requires non-empty name, title, email, and resumeURL', () => {
    fc.assert(
      fc.property(profileArb, (profile) => {
        expect(profile.name.length).toBeGreaterThan(0);
        expect(profile.title.length).toBeGreaterThan(0);
        expect(profile.email.length).toBeGreaterThan(0);
        expect(profile.resumeURL.length).toBeGreaterThan(0);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('Experience requires non-empty company, role, and startDate', () => {
    fc.assert(
      fc.property(experienceArb, (experience) => {
        expect(experience.company.length).toBeGreaterThan(0);
        expect(experience.role.length).toBeGreaterThan(0);
        expect(experience.startDate.length).toBeGreaterThan(0);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('Project requires non-empty title, description, problem, and solution', () => {
    fc.assert(
      fc.property(projectArb, (project) => {
        expect(project.title.length).toBeGreaterThan(0);
        expect(project.description.length).toBeGreaterThan(0);
        expect(project.problem.length).toBeGreaterThan(0);
        expect(project.solution.length).toBeGreaterThan(0);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('Skill proficiency is always between 1 and 5', () => {
    fc.assert(
      fc.property(skillArb, (skill) => {
        expect(skill.name.length).toBeGreaterThan(0);
        expect(skill.proficiency).toBeGreaterThanOrEqual(1);
        expect(skill.proficiency).toBeLessThanOrEqual(5);
        expect([1, 2, 3, 4, 5]).toContain(skill.proficiency);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('rejects objects missing required fields', () => {
    expect(isProfile({})).toBe(false);
    expect(isProfile(null)).toBe(false);
    expect(isProfile({ name: 'test' })).toBe(false);
    expect(isEducation({})).toBe(false);
    expect(isExperience({})).toBe(false);
    expect(isProject({})).toBe(false);
    expect(isSkillCategory({})).toBe(false);
    expect(isAchievement({})).toBe(false);
    expect(isPortfolioContent({})).toBe(false);
  });
});
