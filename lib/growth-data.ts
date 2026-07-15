import type { GrowthDay, GrowthMonth, GrowthTask } from "@/lib/types";
import type { SharedPortfolioData } from "@/lib/shared-data";

export function sortGrowthMonths(months: GrowthMonth[]) {
  return [...months].sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

export function sortGrowthDays(days: GrowthDay[]) {
  return [...days].sort((a, b) => a.date.localeCompare(b.date));
}

export function sortGrowthTasks(tasks: GrowthTask[]) {
  const order: Record<GrowthTask["status"], number> = {
    准备中: 0,
    进行中: 1,
    已完成: 2
  };

  return [...tasks].sort((a, b) => order[a.status] - order[b.status] || a.title.localeCompare(b.title));
}

export function findGrowthMonth(data: SharedPortfolioData, yearMonth: string) {
  return data.growthMonths.find((item) => item.yearMonth === yearMonth) || null;
}

export function findGrowthDay(month: GrowthMonth, day: string) {
  return month.days.find((item) => item.day === day) || month.days.find((item) => item.date.endsWith(`-${day.padStart(2, "0")}`)) || null;
}

export function findGrowthTask(day: GrowthDay, taskId: string) {
  return day.tasks.find((item) => item.id === taskId) || null;
}

export function monthLabel(yearMonth: string) {
  const [year, month] = yearMonth.split("-");
  return `${year}年${Number(month)}月`;
}

export function dayLabel(day: string) {
  return `${Number(day)}日`;
}

export function growthStatusOrder(status: GrowthTask["status"]) {
  const order: Record<GrowthTask["status"], number> = {
    准备中: 0,
    进行中: 1,
    已完成: 2
  };

  return order[status];
}

export function getVisibleTasks(day: GrowthDay, filter: string) {
  const tasks = sortGrowthTasks(day.tasks.filter((task) => task.isPublic));
  if (filter === "全部") return tasks;
  return tasks.filter((task) => task.status === filter);
}

export function monthOverview(month: GrowthMonth) {
  const days = sortGrowthDays(month.days.filter((day) => day.isPublic));
  const tasks = days.flatMap((day) => day.tasks.filter((task) => task.isPublic));
  const finishedTasks = tasks.filter((task) => task.status === "已完成");

  return {
    dayCount: days.length,
    taskCount: tasks.length,
    finishedTasks: finishedTasks.length,
    publicDays: days
  };
}

export function taskTheoryContent(task: GrowthTask) {
  return task.theoryContent || task.learningContent || "待编辑理论学习内容。";
}

export function taskOperationContent(task: GrowthTask) {
  return task.operationContent || task.practiceContent || "待编辑实操内容。";
}

export function taskLifeContent(task: GrowthTask) {
  return task.lifeContent || "待编辑生活安排。";
}
