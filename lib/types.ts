export type LearningStatus = "准备中" | "进行中" | "已完成";

export type Profile = {
  name: string;
  title: string;
  summary: string;
  currentGoal: string;
  focus: string[];
  avatarUrl: string;
};

export type DailyLog = {
  id: string;
  date: string;
  title: string;
  phase: string;
  progress: number;
  status: LearningStatus;
  learned: string;
  practice: string;
  reflection: string;
  isPublic: boolean;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: LearningStatus;
  targetDate: string;
  completedDate?: string | null;
  isPublic: boolean;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  coverUrl: string;
  status: string;
  repoUrl?: string | null;
  demoUrl?: string | null;
  summary: string;
  sortOrder: number;
  isPublic: boolean;
};

export type TutorialLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  isPublic: boolean;
};

export type PortfolioStats = {
  totalDays: number;
  averageProgress: number;
  finishedLogs: number;
  activeMilestones: number;
  projectCount: number;
};
