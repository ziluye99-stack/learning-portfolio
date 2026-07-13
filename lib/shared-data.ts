import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type { DailyLog, Milestone, PortfolioStats, Profile, Project, TutorialLink } from "@/lib/types";

export type SharedPortfolioData = {
  profile: Profile;
  dailyLogs: DailyLog[];
  milestones: Milestone[];
  projects: Project[];
  tutorials: TutorialLink[];
};

const localDataPath = path.join(process.cwd(), "data", "portfolio.json");

function githubConfigured() {
  return Boolean(
    process.env.GITHUB_TOKEN &&
      process.env.GITHUB_OWNER &&
      process.env.GITHUB_REPO &&
      process.env.GITHUB_DATA_PATH
  );
}

function githubApiUrl() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const filePath = process.env.GITHUB_DATA_PATH || "data/portfolio.json";
  return `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
}

function githubHeaders() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28"
  };
}

async function timeoutFetch(input: string, init?: RequestInit, timeoutMs = 6000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function normalize(data: SharedPortfolioData): SharedPortfolioData {
  return {
    profile: data.profile,
    dailyLogs: [...(data.dailyLogs || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    milestones: data.milestones || [],
    projects: [...(data.projects || [])].sort((a, b) => a.sortOrder - b.sortOrder),
    tutorials: data.tutorials || []
  };
}

async function readLocalData() {
  const raw = await readFile(localDataPath, "utf8");
  return normalize(JSON.parse(raw) as SharedPortfolioData);
}

async function readGithubData() {
  const response = await timeoutFetch(`${githubApiUrl()}?ref=${process.env.GITHUB_BRANCH || "main"}`, {
    headers: githubHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`GitHub read failed: ${response.status}`);
  }

  const payload = (await response.json()) as { content: string; encoding: string };
  const json = Buffer.from(payload.content, payload.encoding as BufferEncoding).toString("utf8");
  return normalize(JSON.parse(json) as SharedPortfolioData);
}

export async function getSharedData() {
  noStore();
  if (githubConfigured()) {
    try {
      return await readGithubData();
    } catch {
      return readLocalData();
    }
  }

  return readLocalData();
}

export async function writeSharedData(data: SharedPortfolioData, message: string) {
  const normalized = normalize(data);
  const body = `${JSON.stringify(normalized, null, 2)}\n`;

  if (!githubConfigured()) {
    await writeFile(localDataPath, body, "utf8");
    return;
  }

  const fileUrl = `${githubApiUrl()}?ref=${process.env.GITHUB_BRANCH || "main"}`;
  const current = await timeoutFetch(fileUrl, {
    headers: githubHeaders(),
    cache: "no-store"
  });

  if (!current.ok) {
    throw new Error(`GitHub read failed before write: ${current.status}`);
  }

  const currentPayload = (await current.json()) as { sha: string };
  const response = await timeoutFetch(githubApiUrl(), {
    method: "PUT",
    headers: {
      ...githubHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(body, "utf8").toString("base64"),
      sha: currentPayload.sha,
      branch: process.env.GITHUB_BRANCH || "main"
    })
  });

  if (!response.ok) {
    throw new Error(`GitHub write failed: ${response.status}`);
  }
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getSharedStats(data: SharedPortfolioData): PortfolioStats {
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
