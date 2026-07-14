import { mkdir } from "node:fs/promises";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:3000";
const executablePath = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const artifactDir = join(rootDir, "test-artifacts");
const dataPath = join(rootDir, "data", "portfolio.json");

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 8000 });
}

function pickTask(data) {
  for (const month of data.growthMonths || []) {
    for (const day of month.days || []) {
      const task = (day.tasks || []).find((item) => item.isPublic && item.status !== "已完成");
      if (task) {
        return { month, day, task };
      }
    }
  }

  const month = data.growthMonths[0];
  const day = month?.days[0];
  const task = day?.tasks[0];
  if (!month || !day || !task) {
    throw new Error("No task found for smoke test");
  }

  return { month, day, task };
}

async function main() {
  await mkdir(artifactDir, { recursive: true });
  const originalData = await readFile(dataPath, "utf8");
  const data = JSON.parse(originalData);
  const { month, day, task } = pickTask(data);
  const product = data.products.find((item) => item.id === task.linkedProductId) || data.products[0];
  const baseProductProgress = product.progress;
  const expectedProgress = Math.min(100, baseProductProgress + Number(task.progressDelta || 0));
  const monthPath = `/growth/${month.yearMonth}`;
  const dayPath = `${monthPath}/${day.day}`;
  const taskPath = `${dayPath}/${task.id}`;

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    const publicRoutes = [
      ["/", "成长路径"],
      ["/growth", "成长路径"],
      [monthPath, month.title],
      [dayPath, day.title],
      [taskPath, task.title],
      ["/milestones", "里程碑"],
      ["/product-progress", "产品进展"],
      ["/tutorials", "教程链接"]
    ];

    for (const [route, text] of publicRoutes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await expectText(page, text);
    }

    await page.goto(`${baseUrl}/learning`, { waitUntil: "networkidle" });
    await page.waitForURL("**/growth", { timeout: 8000 });

    await page.goto(`${baseUrl}/projects`, { waitUntil: "networkidle" });
    await page.waitForURL("**/product-progress", { timeout: 8000 });

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: join(artifactDir, "home-desktop.png"), fullPage: true });

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`${baseUrl}/admin/logout`, { waitUntil: "networkidle" });
    await page.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle" });
    await page.getByLabel("管理员密码").fill(process.env.SMOKE_ADMIN_PASSWORD || "Yezilu2026");
    await page.getByRole("button", { name: "登录后台" }).click();
    await page.waitForURL("**/admin", { timeout: 8000 });
    await expectText(page, "内容编辑后台");

    await page.goto(`${baseUrl}${taskPath}`, { waitUntil: "networkidle" });
    await expectText(page, task.title);
    await page.getByLabel("状态").selectOption("已完成");
    await page.getByLabel("进度增量").fill(String(task.progressDelta || 1));
    await page.getByLabel("学习内容").fill(task.learningContent || "完成任务学习内容。");
    await page.getByLabel("实战内容").fill(task.practiceContent || "完成任务实战内容。");
    await page.getByRole("button", { name: "保存任务" }).click();
    await page.waitForURL(`**${taskPath}`, { timeout: 8000 });
    await expectText(page, "已同步到关联目标");

    await page.goto(`${baseUrl}/product-progress`, { waitUntil: "networkidle" });
    await expectText(page, String(expectedProgress));
    const firstProgress = await page.locator(".product-card .status").first().innerText();
    if (!firstProgress.includes(String(expectedProgress))) {
      throw new Error(`Expected product progress ${expectedProgress}, got ${firstProgress}`);
    }

    await page.goto(`${baseUrl}${taskPath}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "保存任务" }).click();
    await page.waitForURL(`**${taskPath}`, { timeout: 8000 });

    await page.goto(`${baseUrl}/product-progress`, { waitUntil: "networkidle" });
    const secondProgress = await page.locator(".product-card .status").first().innerText();
    if (!secondProgress.includes(String(expectedProgress))) {
      throw new Error(`Expected product progress to stay at ${expectedProgress}, got ${secondProgress}`);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(artifactDir, "admin-mobile.png"), fullPage: false });
  } finally {
    await writeFile(dataPath, originalData, "utf8");
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
