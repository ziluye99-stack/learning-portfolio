import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";
import type {
  DailyLog,
  GrowthDay,
  GrowthMonth,
  GrowthTask,
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
const growthStartMonth = "2026-07";
const growthEndMonth = "2028-07";

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

function daysInMonth(yearMonth: string) {
  const [year, month] = yearMonth.split("-").map(Number);
  return new Date(year, month, 0).getDate();
}

function monthRange(start: string, end: string) {
  const [startYear, startMonth] = start.split("-").map(Number);
  const [endYear, endMonth] = end.split("-").map(Number);
  const months: string[] = [];
  let year = startYear;
  let month = startMonth;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  return months;
}

function defaultTask(date: string): GrowthTask {
  const day = date.slice(8, 10);
  return {
    id: `task-${date}-plan`,
    title: `${Number(day)}日任务编辑规划`,
    status: "准备中",
    learningContent: "待编辑理论学习内容。",
    practiceContent: "待编辑实操内容。",
    theoryContent: "待编辑理论学习内容。",
    operationContent: "待编辑实操内容。",
    lifeContent: "待编辑生活安排。",
    progressDelta: 1,
    linkedMilestoneId: null,
    linkedProductId: null,
    progressApplied: false,
    isPublic: true
  };
}

function normalizeTask(task: GrowthTask): GrowthTask {
  return {
    ...task,
    learningContent: task.learningContent || task.theoryContent || "待编辑理论学习内容。",
    practiceContent: task.practiceContent || task.operationContent || "待编辑实操内容。",
    theoryContent: task.theoryContent || task.learningContent || "待编辑理论学习内容。",
    operationContent: task.operationContent || task.practiceContent || "待编辑实操内容。",
    lifeContent: task.lifeContent || "待编辑生活安排。",
    progressDelta: task.progressDelta || 1,
    linkedMilestoneId: task.linkedMilestoneId || null,
    linkedProductId: task.linkedProductId || null,
    progressApplied: Boolean(task.progressApplied)
  };
}

function defaultDay(yearMonth: string, day: number): GrowthDay {
  const dayText = String(day).padStart(2, "0");
  const date = `${yearMonth}-${dayText}`;
  return {
    id: `day-${date}`,
    date,
    day: dayText,
    title: `${day}日任务编辑规划`,
    summary: "按理论学习、实操、生活三部分规划当天内容。",
    status: "准备中",
    progress: 0,
    tasks: [defaultTask(date)],
    isPublic: true
  };
}

function normalizeDay(day: GrowthDay, yearMonth: string, dayNumber: number): GrowthDay {
  const fallback = defaultDay(yearMonth, dayNumber);
  const tasks = (day.tasks?.length ? day.tasks : fallback.tasks).map(normalizeTask);

  return {
    ...fallback,
    ...day,
    date: day.date || fallback.date,
    day: String(day.day || fallback.day).padStart(2, "0"),
    title: day.title || fallback.title,
    summary: day.summary || fallback.summary,
    tasks,
    isPublic: day.isPublic ?? true
  };
}

function defaultMonth(yearMonth: string): GrowthMonth {
  const [year, month] = yearMonth.split("-");
  return {
    id: `month-${yearMonth}`,
    yearMonth,
    title: `${year}年${Number(month)}月学习路径`,
    summary: "按真实日历生成每天的任务编辑规划。",
    goal: "编辑本月大任务或月目标。",
    status: "准备中",
    progress: 0,
    days: [],
    isPublic: true
  };
}

function normalizeMonth(month: GrowthMonth): GrowthMonth {
  const fallback = defaultMonth(month.yearMonth);
  const existingDays = new Map((month.days || []).map((day) => [String(day.day || day.date.slice(8, 10)).padStart(2, "0"), day]));
  const days = Array.from({ length: daysInMonth(month.yearMonth) }, (_, index) => {
    const dayNumber = index + 1;
    const key = String(dayNumber).padStart(2, "0");
    return normalizeDay(existingDays.get(key) || defaultDay(month.yearMonth, dayNumber), month.yearMonth, dayNumber);
  });

  return {
    ...fallback,
    ...month,
    title: month.title || fallback.title,
    summary: month.summary || fallback.summary,
    goal: month.goal || fallback.goal,
    days,
    isPublic: month.isPublic ?? true
  };
}

function completeGrowthCalendar(months: GrowthMonth[]) {
  const existingMonths = new Map(months.map((month) => [month.yearMonth, month]));
  return monthRange(growthStartMonth, growthEndMonth).map((yearMonth) => normalizeMonth(existingMonths.get(yearMonth) || defaultMonth(yearMonth)));
}

export function normalizeSharedData(data: Partial<SharedPortfolioData> & { dailyLogs?: DailyLog[]; projects?: Project[] }): SharedPortfolioData {
  const growthMonths = completeGrowthCalendar(data.growthMonths?.length ? data.growthMonths : legacyDailyLogsToGrowthMonths(data.dailyLogs));
  const products = data.products?.length ? data.products : legacyProjectsToProducts(data.projects);

  return {
    profile: data.profile as Profile,
    growthMonths: [...growthMonths].sort((a, b) => a.yearMonth.localeCompare(b.yearMonth)),
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
