"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createId, getSharedData, writeSharedData } from "@/lib/shared-data";
import type { DailyLog, LearningStatus, Milestone, Project, TutorialLink } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key) || fallback);
  return Math.max(0, Math.min(100, value));
}

function publicFlag(formData: FormData) {
  return formData.get("isPublic") === "on";
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function revalidateAll() {
  ["/", "/learning", "/milestones", "/projects", "/tutorials", "/admin"].forEach((path) => revalidatePath(path));
}

export async function updateProfile(formData: FormData) {
  const data = await getSharedData();
  await writeSharedData(
    {
      ...data,
      profile: {
        name: text(formData, "name"),
        title: text(formData, "title"),
        summary: text(formData, "summary"),
        currentGoal: text(formData, "currentGoal"),
        focus: splitTags(text(formData, "focus")),
        avatarUrl: text(formData, "avatarUrl")
      }
    },
    "Update profile"
  );
  revalidateAll();
  redirect("/admin?saved=profile");
}

export async function createDailyLog(formData: FormData) {
  const data = await getSharedData();
  const item: DailyLog = {
    id: createId("log"),
    date: text(formData, "date"),
    title: text(formData, "title"),
    phase: text(formData, "phase"),
    progress: numberValue(formData, "progress", 50),
    status: text(formData, "status") as LearningStatus,
    learned: text(formData, "learned"),
    practice: text(formData, "practice"),
    reflection: text(formData, "reflection"),
    isPublic: publicFlag(formData)
  };

  await writeSharedData({ ...data, dailyLogs: [item, ...data.dailyLogs] }, `Add daily log: ${item.title}`);
  revalidateAll();
  redirect("/admin?saved=daily-log");
}

export async function createMilestone(formData: FormData) {
  const data = await getSharedData();
  const item: Milestone = {
    id: createId("milestone"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    progress: numberValue(formData, "progress"),
    status: text(formData, "status") as LearningStatus,
    targetDate: text(formData, "targetDate"),
    completedDate: text(formData, "completedDate") || null,
    isPublic: publicFlag(formData)
  };

  await writeSharedData({ ...data, milestones: [...data.milestones, item] }, `Add milestone: ${item.title}`);
  revalidateAll();
  redirect("/admin?saved=milestone");
}

export async function createProject(formData: FormData) {
  const data = await getSharedData();
  const item: Project = {
    id: createId("project"),
    name: text(formData, "name"),
    description: text(formData, "description"),
    stack: splitTags(text(formData, "stack")),
    coverUrl:
      text(formData, "coverUrl") ||
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    status: text(formData, "status"),
    repoUrl: text(formData, "repoUrl") || null,
    demoUrl: text(formData, "demoUrl") || null,
    summary: text(formData, "summary"),
    sortOrder: Number(formData.get("sortOrder") || 100),
    isPublic: publicFlag(formData)
  };

  await writeSharedData({ ...data, projects: [...data.projects, item] }, `Add project: ${item.name}`);
  revalidateAll();
  redirect("/admin?saved=project");
}

export async function createTutorial(formData: FormData) {
  const data = await getSharedData();
  const item: TutorialLink = {
    id: createId("tutorial"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    url: text(formData, "url"),
    category: text(formData, "category"),
    isPublic: publicFlag(formData)
  };

  await writeSharedData({ ...data, tutorials: [...data.tutorials, item] }, `Add tutorial: ${item.title}`);
  revalidateAll();
  redirect("/admin?saved=tutorial");
}

export async function deleteItem(formData: FormData) {
  const data = await getSharedData();
  const type = text(formData, "type") as "dailyLogs" | "milestones" | "projects" | "tutorials";
  const id = text(formData, "id");

  if (!["dailyLogs", "milestones", "projects", "tutorials"].includes(type)) {
    throw new Error("Invalid delete type");
  }

  await writeSharedData({ ...data, [type]: data[type].filter((item) => item.id !== id) }, `Delete ${type}: ${id}`);
  revalidateAll();
  redirect("/admin?deleted=1");
}
