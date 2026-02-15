import type { ReactNode } from 'react';
import type { Achievement, Experience, Project, SkillCategory } from './content';

// Core UI Components

export interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export interface FooterProps {
  onNavigate: (section: string) => void;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (section: string) => void;
}

export interface StatsCardProps {
  value: string | number;
  label: string;
  icon?: ReactNode;
}

export interface SkillMatrixProps {
  skills: SkillCategory[];
  proofMode: boolean;
  onProofClick: (skillId: string, proofLink: string) => void;
}

export interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
}

export interface ExperienceCardProps {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export interface ProgressIndicatorProps {
  currentSection?: string;
}

// 3D Scene Components

export interface HeroSceneProps {
  isReducedMotion: boolean;
  isLowPower: boolean;
  onHotspotClick: (hotspotId: string) => void;
}

export interface SceneFallbackProps {
  fallbackImage: string;
  alt: string;
}

export interface InteractiveObjectProps {
  position: [number, number, number];
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  isHighlighted: boolean;
  isReducedMotion?: boolean;
}

// Animation Wrappers

export interface FadeSlideProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  stagger?: number;
}

export interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number;
  scale?: number;
}

export interface ScrollProgressProps {
  onProgressChange: (progress: number) => void;
}
