"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createId, getSharedData, writeSharedData } from "@/lib/shared-data";
import type { GrowthDay, GrowthMonth, GrowthTask, LearningStatus, Milestone, ProductProgress, TutorialLink } from "@/lib/types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function numberValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key) || fallback);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : fallback;
}

function publicFlag(formData: FormData) {
  return formData.get("isPublic") === "on";
}

function splitLines(value: string) {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function padDay(day: string) {
  return day.padStart(2, "0");
}

function buildDate(yearMonth: string, day: string) {
  return `${yearMonth}-${padDay(day)}`;
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value));
}

function monthDraft(formData: FormData): GrowthMonth {
  return {
    id: text(formData, "monthId") || createId("month"),
    yearMonth: text(formData, "yearMonth"),
    title: text(formData, "title"),
    summary: text(formData, "summary"),
    goal: text(formData, "goal"),
    status: text(formData, "status") as LearningStatus,
    progress: numberValue(formData, "progress", 0),
    days: [],
    isPublic: publicFlag(formData)
  };
}

function dayDraft(formData: FormData): GrowthDay {
  const yearMonth = text(formData, "yearMonth");
  const day = padDay(text(formData, "day"));
  return {
    id: text(formData, "dayId") || createId("day"),
    date: text(formData, "date") || buildDate(yearMonth, day),
    day,
    title: text(formData, "title"),
    summary: text(formData, "summary"),
    status: text(formData, "status") as LearningStatus,
    progress: numberValue(formData, "progress", 0),
    tasks: [],
    isPublic: publicFlag(formData)
  };
}

function taskDraft(formData: FormData): GrowthTask {
  const theoryContent = text(formData, "theoryContent") || text(formData, "learningContent");
  const operationContent = text(formData, "operationContent") || text(formData, "practiceContent");
  const lifeContent = text(formData, "lifeContent");

  return {
    id: text(formData, "taskId") || createId("task"),
    title: text(formData, "title"),
    status: text(formData, "status") as LearningStatus,
    learningContent: theoryContent,
    practiceContent: operationContent,
    theoryContent,
    operationContent,
    lifeContent,
    progressDelta: numberValue(formData, "progressDelta", 1) || 1,
    linkedMilestoneId: text(formData, "linkedMilestoneId") || null,
    linkedProductId: text(formData, "linkedProductId") || null,
    progressApplied: formData.get("progressApplied") === "on",
    isPublic: publicFlag(formData)
  };
}

function revalidateSite(yearMonth?: string, day?: string, taskId?: string) {
  ["/", "/growth", "/milestones", "/product-progress", "/tutorials", "/admin"].forEach((path) => revalidatePath(path));
  if (yearMonth) {
    revalidatePath(`/growth/${yearMonth}`);
  }
  if (yearMonth && day) {
    revalidatePath(`/growth/${yearMonth}/${day}`);
  }
  if (yearMonth && day && taskId) {
    revalidatePath(`/growth/${yearMonth}/${day}/${taskId}`);
  }
}

function syncProgress(data: Awaited<ReturnType<typeof getSharedData>>, task: GrowthTask) {
  if (!task.progressApplied && task.status !== "已完成") {
    return data;
  }

  const shouldApply = task.status === "已完成" && !task.progressApplied;
  if (!shouldApply) {
    return data;
  }

  const delta = clampProgress(task.progressDelta || 0);
  let products = data.products.map((item) =>
    item.id === task.linkedProductId ? { ...item, progress: clampProgress(item.progress + delta) } : item
  );
  let milestones = data.milestones.map((item) =>
    item.id === task.linkedMilestoneId ? { ...item, progress: clampProgress(item.progress + delta) } : item
  );

  return {
    ...data,
    products,
    milestones
  };
}

function upsertMonth(data: Awaited<ReturnType<typeof getSharedData>>, month: GrowthMonth) {
  const months = data.growthMonths.slice();
  const index = months.findIndex((item) => item.yearMonth === month.yearMonth);
  if (index >= 0) {
    months[index] = { ...months[index], ...month, days: months[index].days };
  } else {
    months.push({ ...month, days: month.days || [] });
  }
  return { ...data, growthMonths: months.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth)) };
}

function upsertDay(data: Awaited<ReturnType<typeof getSharedData>>, day: GrowthDay, yearMonth: string) {
  let matchedMonth = false;
  const months = data.growthMonths.map((month) => {
    if (month.yearMonth !== yearMonth) return month;
    matchedMonth = true;
    const days = month.days.slice();
    const index = days.findIndex((item) => item.day === day.day || item.date === day.date || item.id === day.id);
    if (index >= 0) {
      days[index] = { ...days[index], ...day, tasks: days[index].tasks };
    } else {
      days.push({ ...day, tasks: day.tasks || [] });
    }
    return { ...month, days: days.sort((a, b) => a.date.localeCompare(b.date)) };
  });

  if (!matchedMonth) {
    months.push({
      id: createId("month"),
      yearMonth,
      title: `${yearMonth} 月份`,
      summary: "由后台自动创建。",
      goal: "待补充",
      status: "准备中",
      progress: 0,
      days: [day],
      isPublic: true
    });
  }

  return { ...data, growthMonths: months.sort((a, b) => b.yearMonth.localeCompare(a.yearMonth)) };
}

function upsertTask(data: Awaited<ReturnType<typeof getSharedData>>, yearMonth: string, dayKey: string, task: GrowthTask) {
  let matchedMonth = false;
  const months = data.growthMonths.map((month) => {
    if (month.yearMonth !== yearMonth) return month;
    matchedMonth = true;

    let matchedDay = false;
    const days = month.days.map((day) => {
      if (day.day !== padDay(dayKey) && day.date !== buildDate(yearMonth, dayKey) && day.id !== dayKey) {
        return day;
      }
      matchedDay = true;

      const tasks = day.tasks.slice();
      const index = tasks.findIndex((item) => item.id === task.id);
      if (index >= 0) {
        tasks[index] = { ...tasks[index], ...task, progressApplied: tasks[index].progressApplied || task.progressApplied };
      } else {
        tasks.push(task);
      }

      return { ...day, tasks };
    });

    if (!matchedDay) {
      days.push({
        id: createId("day"),
        date: buildDate(yearMonth, dayKey),
        day: padDay(dayKey),
        title: `${padDay(dayKey)} 日任务`,
        summary: "由后台自动创建。",
        status: task.status,
        progress: 0,
        tasks: [task],
        isPublic: task.isPublic
      });
    }

    return { ...month, days: days.sort((a, b) => a.date.localeCompare(b.date)) };
  });

  if (!matchedMonth) {
    months.push({
      id: createId("month"),
      yearMonth,
      title: `${yearMonth} 月份`,
      summary: "由后台自动创建。",
      goal: "待补充",
      status: "准备中",
      progress: 0,
      days: [
        {
          id: createId("day"),
          date: buildDate(yearMonth, dayKey),
          day: padDay(dayKey),
          title: `${padDay(dayKey)} 日任务`,
          summary: "由后台自动创建。",
          status: task.status,
          progress: 0,
          tasks: [task],
          isPublic: task.isPublic
        }
      ],
      isPublic: true
    });
  }

  return { ...data, growthMonths: months };
}

function deleteTask(data: Awaited<ReturnType<typeof getSharedData>>, yearMonth: string, dayKey: string, taskId: string) {
  return {
    ...data,
    growthMonths: data.growthMonths.map((month) => {
      if (month.yearMonth !== yearMonth) return month;
      return {
        ...month,
        days: month.days.map((day) =>
          day.day !== padDay(dayKey) && day.date !== buildDate(yearMonth, dayKey) ? day : { ...day, tasks: day.tasks.filter((task) => task.id !== taskId) }
        )
      };
    })
  };
}

function deleteDay(data: Awaited<ReturnType<typeof getSharedData>>, yearMonth: string, dayKey: string) {
  return {
    ...data,
    growthMonths: data.growthMonths.map((month) =>
      month.yearMonth !== yearMonth
        ? month
        : { ...month, days: month.days.filter((day) => day.day !== padDay(dayKey) && day.date !== buildDate(yearMonth, dayKey)) }
    )
  };
}

function deleteMonth(data: Awaited<ReturnType<typeof getSharedData>>, yearMonth: string) {
  return {
    ...data,
    growthMonths: data.growthMonths.filter((month) => month.yearMonth !== yearMonth)
  };
}

function upsertProduct(data: Awaited<ReturnType<typeof getSharedData>>, product: ProductProgress) {
  const products = data.products.slice();
  const index = products.findIndex((item) => item.id === product.id);
  if (index >= 0) {
    products[index] = { ...products[index], ...product };
  } else {
    products.push(product);
  }
  return { ...data, products };
}

function upsertMilestone(data: Awaited<ReturnType<typeof getSharedData>>, milestone: Milestone) {
  const milestones = data.milestones.slice();
  const index = milestones.findIndex((item) => item.id === milestone.id);
  if (index >= 0) {
    milestones[index] = { ...milestones[index], ...milestone };
  } else {
    milestones.push(milestone);
  }
  return { ...data, milestones };
}

function upsertTutorial(data: Awaited<ReturnType<typeof getSharedData>>, tutorial: TutorialLink) {
  const tutorials = data.tutorials.slice();
  const index = tutorials.findIndex((item) => item.id === tutorial.id);
  if (index >= 0) {
    tutorials[index] = { ...tutorials[index], ...tutorial };
  } else {
    tutorials.push(tutorial);
  }
  return { ...data, tutorials };
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
        focus: splitLines(text(formData, "focus")),
        avatarUrl: text(formData, "avatarUrl")
      }
    },
    "Update profile"
  );
  revalidateSite();
  redirect("/");
}

export async function upsertGrowthMonthAction(formData: FormData) {
  const data = await getSharedData();
  const month = monthDraft(formData);
  await writeSharedData(upsertMonth(data, month), `Upsert month: ${month.yearMonth}`);
  revalidateSite(month.yearMonth);
  redirect(`/growth/${month.yearMonth}`);
}

export async function upsertGrowthDayAction(formData: FormData) {
  const data = await getSharedData();
  const yearMonth = text(formData, "yearMonth");
  const day = dayDraft(formData);
  await writeSharedData(upsertDay(data, day, yearMonth), `Upsert day: ${day.date}`);
  revalidateSite(yearMonth, day.day);
  redirect(`/growth/${yearMonth}/${day.day}`);
}

export async function upsertGrowthTaskAction(formData: FormData) {
  const data = await getSharedData();
  const yearMonth = text(formData, "yearMonth");
  const dayKey = text(formData, "day");
  const task = taskDraft(formData);
  const existingTask = data.growthMonths
    .find((month) => month.yearMonth === yearMonth)
    ?.days.find((day) => day.day === padDay(dayKey) || day.date === buildDate(yearMonth, dayKey) || day.id === dayKey)
    ?.tasks.find((item) => item.id === task.id);
  const alreadyApplied = existingTask?.progressApplied || false;
  const shouldApply = task.status === "已完成" && !alreadyApplied;
  const appliedTask = { ...task, progressApplied: alreadyApplied || task.status === "已完成" };
  const withTask = upsertTask(data, yearMonth, dayKey, appliedTask);
  const synced = shouldApply ? syncProgress(withTask, task) : withTask;
  await writeSharedData(synced, `Upsert task: ${task.title}`);
  revalidateSite(yearMonth, padDay(dayKey), task.id);
  redirect(`/growth/${yearMonth}/${padDay(dayKey)}/${task.id}`);
}

export async function upsertMilestoneAction(formData: FormData) {
  const data = await getSharedData();
  const milestone: Milestone = {
    id: text(formData, "milestoneId") || createId("milestone"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    progress: numberValue(formData, "progress"),
    status: text(formData, "status") as LearningStatus,
    targetDate: text(formData, "targetDate"),
    completedDate: text(formData, "completedDate") || null,
    isPublic: publicFlag(formData)
  };

  await writeSharedData(upsertMilestone(data, milestone), `Upsert milestone: ${milestone.title}`);
  revalidateSite();
  redirect("/milestones");
}

export async function upsertProductAction(formData: FormData) {
  const data = await getSharedData();
  const product: ProductProgress = {
    id: text(formData, "productId") || createId("product"),
    name: text(formData, "name"),
    tagline: text(formData, "tagline"),
    problem: text(formData, "problem"),
    solution: text(formData, "solution"),
    progress: numberValue(formData, "progress"),
    status: text(formData, "status") as LearningStatus,
    roadmap: splitLines(text(formData, "roadmap")),
    isPublic: publicFlag(formData)
  };

  await writeSharedData(upsertProduct(data, product), `Upsert product: ${product.name}`);
  revalidateSite();
  redirect("/product-progress");
}

export async function upsertTutorialAction(formData: FormData) {
  const data = await getSharedData();
  const tutorial: TutorialLink = {
    id: text(formData, "tutorialId") || createId("tutorial"),
    title: text(formData, "title"),
    description: text(formData, "description"),
    url: text(formData, "url"),
    category: text(formData, "category"),
    isPublic: publicFlag(formData)
  };

  await writeSharedData(upsertTutorial(data, tutorial), `Upsert tutorial: ${tutorial.title}`);
  revalidateSite();
  redirect("/tutorials");
}

export async function deleteItem(formData: FormData) {
  const data = await getSharedData();
  const type = text(formData, "type");
  const id = text(formData, "id");
  const yearMonth = text(formData, "yearMonth");
  const day = text(formData, "day");
  let nextData = data;
  let redirectTarget = "/admin?deleted=1";

  switch (type) {
    case "growthMonths":
      nextData = deleteMonth(data, id || yearMonth);
      revalidateSite(id || yearMonth);
      redirectTarget = "/growth";
      break;
    case "growthDays":
      nextData = deleteDay(data, yearMonth, day || id);
      revalidateSite(yearMonth, day || id);
      redirectTarget = `/growth/${yearMonth}`;
      break;
    case "growthTasks":
      nextData = deleteTask(data, yearMonth, day || "", id);
      revalidateSite(yearMonth, day || "", id);
      redirectTarget = `/growth/${yearMonth}/${padDay(day || id)}`;
      break;
    case "milestones":
      nextData = { ...data, milestones: data.milestones.filter((item) => item.id !== id) };
      revalidateSite();
      redirectTarget = "/milestones";
      break;
    case "products":
      nextData = { ...data, products: data.products.filter((item) => item.id !== id) };
      revalidateSite();
      redirectTarget = "/product-progress";
      break;
    case "tutorials":
      nextData = { ...data, tutorials: data.tutorials.filter((item) => item.id !== id) };
      revalidateSite();
      redirectTarget = "/tutorials";
      break;
    default:
      throw new Error("Invalid delete type");
  }

  await writeSharedData(nextData, `Delete ${type}: ${id}`);
  redirect(redirectTarget);
}
