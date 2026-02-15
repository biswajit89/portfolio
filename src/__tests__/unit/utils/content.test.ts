import { describe, it, expect } from 'vitest';
import {
  loadPortfolioContent,
  getProfile,
  getEducation,
  getExperiences,
  getProjects,
  getSkills,
  getAchievements,
  isPortfolioContent,
  isProfile,
  isEducation,
  isExperience,
  isProject,
  isSkillCategory,
  isAchievement,
  sortExperiencesChronologically,
} from '@/utils/content';
import type { Experience } from '@/types/content';

describe('loadPortfolioContent', () => {
  it('returns a valid PortfolioContent object', () => {
    const content = loadPortfolioContent();
    expect(isPortfolioContent(content)).toBe(true);
  });

  it('contains all required top-level keys', () => {
    const content = loadPortfolioContent();
    expect(content).toHaveProperty('profile');
    expect(content).toHaveProperty('education');
    expect(content).toHaveProperty('experience');
    expect(content).toHaveProperty('projects');
    expect(content).toHaveProperty('skills');
    expect(content).toHaveProperty('achievements');
  });
});

describe('getProfile', () => {
  it('returns a valid Profile', () => {
    const profile = getProfile();
    expect(isProfile(profile)).toBe(true);
  });

  it('has required fields', () => {
    const profile = getProfile();
    expect(profile.name).toBeTruthy();
    expect(profile.title).toBeTruthy();
    expect(profile.email).toBeTruthy();
    expect(profile.resumeURL).toBeTruthy();
  });
});

describe('getEducation', () => {
  it('returns an array of valid Education entries', () => {
    const education = getEducation();
    expect(Array.isArray(education)).toBe(true);
    education.forEach((entry) => {
      expect(isEducation(entry)).toBe(true);
    });
  });
});

describe('getExperiences', () => {
  it('returns an array of valid Experience entries', () => {
    const experiences = getExperiences();
    expect(Array.isArray(experiences)).toBe(true);
    expect(experiences.length).toBeGreaterThan(0);
    experiences.forEach((entry) => {
      expect(isExperience(entry)).toBe(true);
    });
  });
});

describe('getProjects', () => {
  it('returns an array of valid Project entries', () => {
    const projects = getProjects();
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((entry) => {
      expect(isProject(entry)).toBe(true);
    });
  });
});

describe('getSkills', () => {
  it('returns an array of valid SkillCategory entries', () => {
    const skills = getSkills();
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((entry) => {
      expect(isSkillCategory(entry)).toBe(true);
    });
  });
});

describe('getAchievements', () => {
  it('returns an array of valid Achievement entries', () => {
    const achievements = getAchievements();
    expect(Array.isArray(achievements)).toBe(true);
    expect(achievements.length).toBeGreaterThan(0);
    achievements.forEach((entry) => {
      expect(isAchievement(entry)).toBe(true);
    });
  });
});


describe('sortExperiencesChronologically', () => {
  const makeExp = (id: string, startDate: string, endDate: string | null): Experience => ({
    id,
    company: id,
    role: 'Engineer',
    startDate,
    endDate,
    location: 'Remote',
    isRemote: true,
    summary: ['Summary'],
    achievements: ['Achievement'],
    techStack: ['TypeScript'],
    artifacts: [],
  });

  it('sorts most recent first by endDate', () => {
    const exps = [
      makeExp('old', '2017-01', '2019-06'),
      makeExp('mid', '2019-07', '2022-01'),
      makeExp('new', '2022-02', '2024-01'),
    ];
    const sorted = sortExperiencesChronologically(exps);
    expect(sorted.map((e) => e.id)).toEqual(['new', 'mid', 'old']);
  });

  it('treats null endDate (current job) as most recent', () => {
    const exps = [
      makeExp('past', '2019-01', '2022-06'),
      makeExp('current', '2022-07', null),
    ];
    const sorted = sortExperiencesChronologically(exps);
    expect(sorted[0].id).toBe('current');
  });

  it('uses startDate as tiebreaker when endDates match', () => {
    const exps = [
      makeExp('earlier', '2020-01', '2022-06'),
      makeExp('later', '2021-03', '2022-06'),
    ];
    const sorted = sortExperiencesChronologically(exps);
    expect(sorted[0].id).toBe('later');
  });

  it('preserves all items (no items lost or duplicated)', () => {
    const exps = [
      makeExp('a', '2017-01', '2018-01'),
      makeExp('b', '2019-01', '2020-01'),
      makeExp('c', '2021-01', null),
    ];
    const sorted = sortExperiencesChronologically(exps);
    expect(sorted).toHaveLength(3);
    expect(sorted.map((e) => e.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('does not mutate the original array', () => {
    const exps = [
      makeExp('b', '2019-01', '2020-01'),
      makeExp('a', '2017-01', '2018-01'),
    ];
    const original = [...exps];
    sortExperiencesChronologically(exps);
    expect(exps).toEqual(original);
  });

  it('handles empty array', () => {
    expect(sortExperiencesChronologically([])).toEqual([]);
  });

  it('handles single item', () => {
    const exps = [makeExp('only', '2022-01', null)];
    const sorted = sortExperiencesChronologically(exps);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].id).toBe('only');
  });
});

import {
  filterProjects,
  ALL_PROJECT_CATEGORIES,
  PROJECT_CATEGORY_LABELS,
} from '@/utils/content';
import type { Project, ProjectCategory } from '@/types/content';

const makeProject = (
  id: string,
  categories: ProjectCategory[],
): Project => ({
  id,
  title: `Project ${id}`,
  description: 'desc',
  role: 'Lead',
  duration: '6 months',
  problem: 'problem',
  solution: 'solution',
  architecture: 'architecture',
  impactMetrics: ['metric'],
  techStack: ['TypeScript'],
  screenshots: [],
  highlights: ['highlight'],
  categories,
});

describe('filterProjects', () => {
  const projects: Project[] = [
    makeProject('p1', ['frontend']),
    makeProject('p2', ['fullstack', 'ai']),
    makeProject('p3', ['3d', 'frontend']),
    makeProject('p4', ['oss']),
    makeProject('p5', ['security', 'fullstack']),
  ];

  it('returns all projects when category is null', () => {
    const result = filterProjects(projects, null);
    expect(result).toEqual(projects);
    expect(result).toHaveLength(5);
  });

  it('filters projects by a single category', () => {
    const result = filterProjects(projects, 'frontend');
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['p1', 'p3']);
  });

  it('returns projects matching a category that appears with others', () => {
    const result = filterProjects(projects, 'fullstack');
    expect(result).toHaveLength(2);
    expect(result.map((p) => p.id)).toEqual(['p2', 'p5']);
  });

  it('returns empty array when no projects match the category', () => {
    const noMatch = [makeProject('x', ['frontend'])];
    const result = filterProjects(noMatch, 'security');
    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it('returns empty array when given an empty project list', () => {
    const result = filterProjects([], 'ai');
    expect(result).toEqual([]);
  });

  it('all returned projects contain the selected category', () => {
    for (const category of ALL_PROJECT_CATEGORIES) {
      const result = filterProjects(projects, category);
      result.forEach((project) => {
        expect(project.categories).toContain(category);
      });
    }
  });

  it('does not mutate the original array', () => {
    const original = [...projects];
    filterProjects(projects, 'frontend');
    expect(projects).toEqual(original);
  });
});

describe('ALL_PROJECT_CATEGORIES', () => {
  it('contains all six categories', () => {
    expect(ALL_PROJECT_CATEGORIES).toHaveLength(6);
    expect(ALL_PROJECT_CATEGORIES).toContain('frontend');
    expect(ALL_PROJECT_CATEGORIES).toContain('fullstack');
    expect(ALL_PROJECT_CATEGORIES).toContain('3d');
    expect(ALL_PROJECT_CATEGORIES).toContain('oss');
    expect(ALL_PROJECT_CATEGORIES).toContain('ai');
    expect(ALL_PROJECT_CATEGORIES).toContain('security');
  });
});

describe('PROJECT_CATEGORY_LABELS', () => {
  it('has a human-readable label for every category', () => {
    for (const cat of ALL_PROJECT_CATEGORIES) {
      expect(PROJECT_CATEGORY_LABELS[cat]).toBeTruthy();
    }
  });

  it('maps to expected display names', () => {
    expect(PROJECT_CATEGORY_LABELS.frontend).toBe('Frontend');
    expect(PROJECT_CATEGORY_LABELS.fullstack).toBe('Full Stack');
    expect(PROJECT_CATEGORY_LABELS['3d']).toBe('3D');
    expect(PROJECT_CATEGORY_LABELS.oss).toBe('OSS');
    expect(PROJECT_CATEGORY_LABELS.ai).toBe('AI');
    expect(PROJECT_CATEGORY_LABELS.security).toBe('Security');
  });
});

