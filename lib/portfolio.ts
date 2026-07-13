import { seedDailyLogs, seedMilestones, seedProfile, seedProjects } from "@/lib/seed";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DailyLog, Milestone, PortfolioStats, Profile, Project } from "@/lib/types";

type DbDailyLog = {
  id: string;
  date: string;
  title: string;
  phase: string;
  progress: number;
  status: DailyLog["status"];
  learned: string;
  practice: string;
  reflection: string;
  is_public: boolean;
};

type DbMilestone = {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: Milestone["status"];
  target_date: string;
  completed_date: string | null;
  is_public: boolean;
};

type DbProject = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  cover_url: string;
  status: string;
  repo_url: string | null;
  demo_url: string | null;
  summary: string;
  sort_order: number;
  is_public: boolean;
};

type DbProfile = {
  name: string;
  title: string;
  summary: string;
  current_goal: string;
  focus: string[];
  avatar_url: string;
};

const publicFilter = { is_public: true };

function shouldUseLocalPublicData() {
  return process.env.PUBLIC_DATA_SOURCE !== "cloud";
}

export async function getProfile(): Promise<Profile> {
  if (shouldUseLocalPublicData()) return seedProfile;

  const supabase = createSupabaseAdminClient();
  if (!isSupabaseConfigured() || !supabase) return seedProfile;

  const { data, error } = await supabase.from("profile").select("*").limit(1).maybeSingle<DbProfile>();
  if (error || !data) return seedProfile;

  return {
    name: data.name,
    title: data.title,
    summary: data.summary,
    currentGoal: data.current_goal,
    focus: data.focus || [],
    avatarUrl: data.avatar_url
  };
}

export async function getDailyLogs(options: { includePrivate?: boolean } = {}): Promise<DailyLog[]> {
  if (!options.includePrivate && shouldUseLocalPublicData()) return seedDailyLogs;

  const supabase = createSupabaseAdminClient();
  if (!isSupabaseConfigured() || !supabase) return seedDailyLogs;

  let query = supabase.from("daily_logs").select("*").order("date", { ascending: false });
  if (!options.includePrivate) query = query.match(publicFilter);
  const { data, error } = await query.returns<DbDailyLog[]>();

  if (error || !data) return seedDailyLogs;
  return data.map((item) => ({
    id: item.id,
    date: item.date,
    title: item.title,
    phase: item.phase,
    progress: item.progress,
    status: item.status,
    learned: item.learned,
    practice: item.practice,
    reflection: item.reflection,
    isPublic: item.is_public
  }));
}

export async function getMilestones(options: { includePrivate?: boolean } = {}): Promise<Milestone[]> {
  if (!options.includePrivate && shouldUseLocalPublicData()) return seedMilestones;

  const supabase = createSupabaseAdminClient();
  if (!isSupabaseConfigured() || !supabase) return seedMilestones;

  let query = supabase.from("milestones").select("*").order("target_date", { ascending: true });
  if (!options.includePrivate) query = query.match(publicFilter);
  const { data, error } = await query.returns<DbMilestone[]>();

  if (error || !data) return seedMilestones;
  return data.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    progress: item.progress,
    status: item.status,
    targetDate: item.target_date,
    completedDate: item.completed_date,
    isPublic: item.is_public
  }));
}

export async function getProjects(options: { includePrivate?: boolean } = {}): Promise<Project[]> {
  if (!options.includePrivate && shouldUseLocalPublicData()) return seedProjects;

  const supabase = createSupabaseAdminClient();
  if (!isSupabaseConfigured() || !supabase) return seedProjects;

  let query = supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (!options.includePrivate) query = query.match(publicFilter);
  const { data, error } = await query.returns<DbProject[]>();

  if (error || !data) return seedProjects;
  return data.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    stack: item.stack || [],
    coverUrl: item.cover_url,
    status: item.status,
    repoUrl: item.repo_url,
    demoUrl: item.demo_url,
    summary: item.summary,
    sortOrder: item.sort_order,
    isPublic: item.is_public
  }));
}

export async function getStats(): Promise<PortfolioStats> {
  const [logs, milestones, projects] = await Promise.all([getDailyLogs(), getMilestones(), getProjects()]);
  const averageProgress = logs.length
    ? Math.round(logs.reduce((sum, item) => sum + Number(item.progress || 0), 0) / logs.length)
    : 0;

  return {
    totalDays: logs.length,
    averageProgress,
    finishedLogs: logs.filter((item) => item.status === "已完成").length,
    activeMilestones: milestones.filter((item) => item.status !== "已完成").length,
    projectCount: projects.length
  };
}
