export type LearningStatus = "准备中" | "进行中" | "已完成";

export type Profile = {
  name: string;
  title: string;
  summary: string;
  currentGoal: string;
  focus: string[];
  avatarUrl: string;
};

export type GrowthTask = {
  id: string;
  title: string;
  status: LearningStatus;
  learningContent: string;
  practiceContent: string;
  theoryContent?: string;
  operationContent?: string;
  lifeContent?: string;
  progressDelta: number;
  linkedMilestoneId?: string | null;
  linkedProductId?: string | null;
  progressApplied?: boolean;
  isPublic: boolean;
};

export type GrowthDay = {
  id: string;
  date: string;
  day: string;
  title: string;
  summary: string;
  status: LearningStatus;
  progress: number;
  tasks: GrowthTask[];
  isPublic: boolean;
};

export type GrowthMonth = {
  id: string;
  yearMonth: string;
  title: string;
  summary: string;
  goal: string;
  status: LearningStatus;
  progress: number;
  days: GrowthDay[];
  isPublic: boolean;
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

export type ProductProgress = {
  id: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  progress: number;
  status: LearningStatus;
  roadmap: string[];
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
