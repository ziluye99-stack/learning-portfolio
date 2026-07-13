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

async function main() {
  await mkdir(artifactDir, { recursive: true });
  const originalData = await readFile(dataPath, "utf8");

  const browser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-gpu"]
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

    const publicRoutes = [
      ["/", "学习进度概览"],
      ["/learning", "每日学习路径"],
      ["/milestones", "阶段里程碑"],
      ["/projects", "实战项目"],
      ["/tutorials", "教程链接"],
      ["/admin/login", "后台登录"]
    ];

    for (const [route, text] of publicRoutes) {
      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await expectText(page, text);
    }

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: join(artifactDir, "home-desktop.png"), fullPage: true });

    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto(`${baseUrl}/admin/logout`, { waitUntil: "networkidle" });
    await page.getByLabel("管理员密码").fill(process.env.SMOKE_ADMIN_PASSWORD || "Yezilu2026");
    await page.getByRole("button", { name: "登录后台" }).click();
    await page.waitForURL("**/admin", { timeout: 8000 });
    await expectText(page, "学习记录后台");

    await page.getByPlaceholder("例如：React 组件拆分练习").fill("自动化验证记录");
    await page.getByPlaceholder("例如：前端基础").fill("功能验证");
    await page.locator("#learned").fill("验证本地后台可以录入学习路径。");
    await page.locator("#practice").fill("使用 Playwright Core 提交本地表单。");
    await page.locator("#reflection").fill("主要交互路径可用。");
    await page.getByRole("button", { name: "保存记录" }).click();
    await expectText(page, "自动化验证记录");

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: join(artifactDir, "admin-mobile.png"), fullPage: false });

    await page.goto(`${baseUrl}/learning`, { waitUntil: "networkidle" });
    await expectText(page, "自动化验证记录");
  } finally {
    await writeFile(dataPath, originalData, "utf8");
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
