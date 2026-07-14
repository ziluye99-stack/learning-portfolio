import { readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeSharedData, type SharedPortfolioData } from "@/lib/shared-data";
import { seedGrowthMonths, seedMilestones, seedProducts, seedProfile, seedTutorials } from "@/lib/seed";

const localDataPath = path.join(process.cwd(), "data", "portfolio.json");

const fallbackData: SharedPortfolioData = {
  profile: seedProfile,
  growthMonths: seedGrowthMonths,
  milestones: seedMilestones,
  products: seedProducts,
  tutorials: seedTutorials
};

export async function getPublicData() {
  try {
    const raw = await readFile(localDataPath, "utf8");
    return normalizeSharedData(JSON.parse(raw) as Partial<SharedPortfolioData>);
  } catch {
    return normalizeSharedData(fallbackData);
  }
}
