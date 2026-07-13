import type { DailyLog, Milestone, Profile, Project, TutorialLink } from "@/lib/types";

export const seedProfile: Profile = {
  name: "叶子路",
  title: "个人学习进度与实战作品集",
  summary: "持续记录每天的学习路径、阶段进度和项目实战，用可复盘的数据追踪成长。",
  currentGoal: "完成前端工程化与全栈项目实战路线",
  focus: ["前端基础", "React / Next.js", "数据库与认证", "项目实战"],
  avatarUrl:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
};

export const seedDailyLogs: DailyLog[] = [
  {
    id: "log-2026-07-13",
    date: "2026-07-13",
    title: "作品展示站升级为 Next.js",
    phase: "作品集搭建",
    progress: 28,
    status: "进行中",
    learned: "把静态原型迁移为 App Router 项目，并预留 Supabase 认证和数据库结构。",
    practice: "完成首页、学习路径、里程碑、项目和后台页面的组件化改造。",
    reflection: "先保证页面可运行，再把真实云端数据接入到后台表单。",
    isPublic: true
  },
  {
    id: "log-2026-07-12",
    date: "2026-07-12",
    title: "JavaScript DOM 与事件复习",
    phase: "前端基础",
    progress: 64,
    status: "已完成",
    learned: "复习选择器、事件冒泡、表单状态和本地存储。",
    practice: "做了一个学习记录表单原型。",
    reflection: "表单交互要先保证状态清晰，再考虑视觉细节。",
    isPublic: true
  },
  {
    id: "log-2026-07-11",
    date: "2026-07-11",
    title: "CSS Grid 布局练习",
    phase: "页面布局",
    progress: 52,
    status: "已完成",
    learned: "练习响应式网格、卡片密度、移动端断点。",
    practice: "实现项目列表和进度面板布局。",
    reflection: "作品页需要信息密度高，但不能像后台系统一样压迫。",
    isPublic: true
  }
];

export const seedMilestones: Milestone[] = [
  {
    id: "ms-foundation",
    title: "前端基础阶段",
    description: "HTML、CSS、JavaScript、响应式布局和基础交互。",
    progress: 70,
    status: "进行中",
    targetDate: "2026-07-25",
    isPublic: true
  },
  {
    id: "ms-react",
    title: "React 项目阶段",
    description: "组件拆分、状态管理、路由、表单和异步数据。",
    progress: 35,
    status: "准备中",
    targetDate: "2026-08-15",
    isPublic: true
  },
  {
    id: "ms-fullstack",
    title: "全栈上线阶段",
    description: "认证、数据库、图片上传、部署和线上维护。",
    progress: 12,
    status: "准备中",
    targetDate: "2026-09-05",
    isPublic: true
  }
];

export const seedProjects: Project[] = [
  {
    id: "project-portfolio",
    name: "学习作品展示站",
    description: "展示每日学习路径、阶段里程碑、实战项目和后台维护流程的个人网站。",
    stack: ["Next.js", "TypeScript", "Supabase", "Vercel"],
    coverUrl:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    status: "升级中",
    repoUrl: "#",
    demoUrl: "/",
    summary: "从静态原型升级为可接入认证、数据库和图片上传的全栈作品站。",
    sortOrder: 1,
    isPublic: true
  },
  {
    id: "project-admin",
    name: "学习记录后台表单",
    description: "用于录入每日学习内容、进度、实战情况和复盘备注的管理界面。",
    stack: ["Server Actions", "Auth", "Postgres", "Storage"],
    coverUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    status: "初版",
    repoUrl: "#",
    demoUrl: "/admin",
    summary: "没有 Supabase 时显示演示数据，配置环境变量后切换为真实云端后台。",
    sortOrder: 2,
    isPublic: true
  }
];

export const seedTutorials: TutorialLink[] = [
  {
    id: "tutorial-next",
    title: "Next.js 官方文档",
    description: "学习 App Router、页面路由、Server Actions 和部署基础。",
    url: "https://nextjs.org/docs",
    category: "Next.js",
    isPublic: true
  },
  {
    id: "tutorial-mdn",
    title: "MDN Web Docs",
    description: "查询 HTML、CSS、JavaScript 基础知识和浏览器 API。",
    url: "https://developer.mozilla.org/",
    category: "前端基础",
    isPublic: true
  }
];
