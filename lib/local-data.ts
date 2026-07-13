"use client";

import { seedDailyLogs, seedMilestones, seedProfile, seedProjects, seedTutorials } from "@/lib/seed";
import type { DailyLog, Milestone, PortfolioStats, Profile, Project, TutorialLink } from "@/lib/types";

export type LocalPortfolioData = {
  profile: Profile;
  dailyLogs: DailyLog[];
  milestones: Milestone[];
  projects: Project[];
  tutorials: TutorialLink[];
};

const storageKey = "learning-portfolio.local.v1";

export const defaultPortfolioData: LocalPortfolioData = {
  profile: seedProfile,
  dailyLogs: seedDailyLogs,
  milestones: seedMilestones,
  projects: seedProjects,
  tutorials: seedTutorials
};

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getStats(data: LocalPortfolioData): PortfolioStats {
  const publicLogs = data.dailyLogs.filter((item) => item.isPublic);
  const publicMilestones = data.milestones.filter((item) => item.isPublic);
  const publicProjects = data.projects.filter((item) => item.isPublic);
  const averageProgress = publicLogs.length
    ? Math.round(publicLogs.reduce((sum, item) => sum + Number(item.progress || 0), 0) / publicLogs.length)
    : 0;

  return {
    totalDays: publicLogs.length,
    averageProgress,
    finishedLogs: publicLogs.filter((item) => item.status === "已完成").length,
    activeMilestones: publicMilestones.filter((item) => item.status !== "已完成").length,
    projectCount: publicProjects.length
  };
}

export function readLocalData(): LocalPortfolioData {
  if (typeof window === "undefined") return defaultPortfolioData;

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return defaultPortfolioData;
    const parsed = JSON.parse(raw) as Partial<LocalPortfolioData>;

    return {
      profile: { ...defaultPortfolioData.profile, ...parsed.profile },
      dailyLogs: parsed.dailyLogs?.length ? parsed.dailyLogs : defaultPortfolioData.dailyLogs,
      milestones: parsed.milestones?.length ? parsed.milestones : defaultPortfolioData.milestones,
      projects: parsed.projects?.length ? parsed.projects : defaultPortfolioData.projects,
      tutorials: parsed.tutorials?.length ? parsed.tutorials : defaultPortfolioData.tutorials
    };
  } catch {
    return defaultPortfolioData;
  }
}

export function writeLocalData(data: LocalPortfolioData) {
  window.localStorage.setItem(storageKey, JSON.stringify(data));
  window.dispatchEvent(new Event("portfolio-data-change"));
}

export function resetLocalData() {
  window.localStorage.removeItem(storageKey);
  window.dispatchEvent(new Event("portfolio-data-change"));
}

export function sortDailyLogs(logs: DailyLog[]) {
  return [...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
