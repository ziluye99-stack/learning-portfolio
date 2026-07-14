import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type {
  DailyLog,
  GrowthDay,
  GrowthMonth,
  Milestone,
  PortfolioStats,
  ProductProgress,
  Profile,
  Project,
  TutorialLink
} from "@/lib/types";

export type SharedPortfolioData = {
  profile: Profile;
  growthMonths: GrowthMonth[];
  milestones: Milestone[];
  products: ProductProgress[];
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

function legacyDailyLogsToGrowthMonths(dailyLogs: DailyLog[] = []): GrowthMonth[] {
  const grouped = new Map<string, DailyLog[]>();
  for (const log of dailyLogs) {
    const key = log.date.slice(0, 7);
    const items = grouped.get(key) || [];
    items.push(log);
    grouped.set(key, items);
  }

  return [...grouped.entries()].map(([yearMonth, logs]) => {
    const days: GrowthDay[] = logs
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((log) => ({
        id: `legacy-day-${log.id}`,
        date: log.date,
        day: log.date.slice(8, 10),
        title: log.title,
        summary: log.reflection,
        status: log.status,
        progress: log.progress,
        tasks: [
          {
            id: `legacy-task-${log.id}`,
            title: log.title,
            status: log.status,
            learningContent: log.learned,
            practiceContent: log.practice,
            progressDelta: 1,
            linkedMilestoneId: null,
            linkedProductId: null,
            progressApplied: log.status === "已完成",
            isPublic: log.isPublic
          }
        ],
        isPublic: log.isPublic
      }));

    return {
      id: `legacy-month-${yearMonth}`,
      yearMonth,
      title: `${yearMonth} 月份记录`,
      summary: "由旧版学习记录自动迁移。",
      goal: "继续拆分为月目标、日任务和任务详情。",
      status: "进行中",
      progress: days.length ? Math.round(days.reduce((sum, item) => sum + item.progress, 0) / days.length) : 0,
      days,
      isPublic: true
    };
  });
}

function legacyProjectsToProducts(projects: Project[] = []): ProductProgress[] {
  return projects.map((project, index) => ({
    id: `legacy-product-${project.id || index}`,
    name: project.name,
    tagline: project.status,
    problem: project.description,
    solution: project.summary,
    progress: Math.max(0, Math.min(100, project.sortOrder || 0)),
    status: "进行中",
    roadmap: project.stack || [],
    isPublic: project.isPublic
  }));
}

export function normalizeSharedData(data: Partial<SharedPortfolioData> & { dailyLogs?: DailyLog[]; projects?: Project[] }): SharedPortfolioData {
  const growthMonths = (data.growthMonths?.length ? data.growthMonths : legacyDailyLogsToGrowthMonths(data.dailyLogs)).map(
    (month) => ({
      ...month,
      days: [...(month.days || [])].sort((a, b) => a.date.localeCompare(b.date))
    })
  );
  const products = data.products?.length ? data.products : legacyProjectsToProducts(data.projects);

  return {
    profile: data.profile as Profile,
    growthMonths: [...growthMonths].sort((a, b) => b.yearMonth.localeCompare(a.yearMonth)),
    milestones: data.milestones || [],
    products: [...products],
    tutorials: data.tutorials || []
  };
}

async function readLocalData() {
  const raw = await readFile(localDataPath, "utf8");
  return normalizeSharedData(JSON.parse(raw) as Partial<SharedPortfolioData> & { dailyLogs?: DailyLog[]; projects?: Project[] });
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
  return normalizeSharedData(JSON.parse(json) as Partial<SharedPortfolioData> & { dailyLogs?: DailyLog[]; projects?: Project[] });
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
  const normalized = normalizeSharedData(data);
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
  const publicMonths = data.growthMonths.filter((item) => item.isPublic);
  const publicDays = publicMonths.flatMap((month) => month.days.filter((day) => day.isPublic));
  const publicTasks = publicDays.flatMap((day) => day.tasks.filter((task) => task.isPublic));
  const publicMilestones = data.milestones.filter((item) => item.isPublic);
  const publicProducts = data.products.filter((item) => item.isPublic);
  const averageProgress = publicDays.length
    ? Math.round(publicDays.reduce((sum, item) => sum + Number(item.progress || 0), 0) / publicDays.length)
    : 0;

  return {
    totalDays: publicDays.length,
    averageProgress,
    finishedLogs: publicTasks.filter((item) => item.status === "已完成").length,
    activeMilestones: publicMilestones.filter((item) => item.status !== "已完成").length,
    projectCount: publicProducts.length
  };
}
