import type {
  DailyLog,
  GrowthDay,
  GrowthMonth,
  GrowthTask,
  Milestone,
  ProductProgress,
  Profile,
  Project,
  TutorialLink
} from "@/lib/types";

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

export const seedProducts: ProductProgress[] = [
  {
    id: "product-startup",
    name: "创业产品原型",
    tagline: "把学习路径和产品迭代放到一个工作台里",
    problem: "学习内容、阶段目标和产品进展容易分散，难以持续复盘和讲清楚价值。",
    solution: "用一个统一的成长站把月目标、每日任务、里程碑和产品进展串起来。",
    progress: 22,
    status: "进行中",
    roadmap: ["完成信息架构", "补全任务编辑", "接入反馈收集", "准备对外试用"],
    isPublic: true
  }
];

const july13Tasks: GrowthTask[] = [
  {
    id: "task-2026-07-13-structure",
    title: "拆分首页和成长路径信息架构",
    status: "已完成",
    learningContent: "梳理首页、成长路径、里程碑和产品进展四个入口，明确每一页的职责边界。",
    practiceContent: "完成导航收口和首页介绍页的初版结构，确认深层路由的进入方式。",
    progressDelta: 2,
    linkedMilestoneId: "ms-structure",
    linkedProductId: "product-startup",
    progressApplied: true,
    isPublic: true
  },
  {
    id: "task-2026-07-13-goal",
    title: "定义月目标与任务拆解规则",
    status: "进行中",
    learningContent: "把月目标拆成每天任务，再把任务拆成学习内容和实战内容两个维度。",
    practiceContent: "准备在后台增加年月、日期、任务的嵌套编辑入口。",
    progressDelta: 1,
    linkedMilestoneId: "ms-growth",
    linkedProductId: "product-startup",
    isPublic: true
  }
];

const july14Tasks: GrowthTask[] = [
  {
    id: "task-2026-07-14-home",
    title: "制作首页宣传动效",
    status: "进行中",
    learningContent: "用纯代码动画模拟产品演示的节奏，替代对外部视频和图片的依赖。",
    practiceContent: "搭建首页英雄区、问题展示和产品进展入口。",
    progressDelta: 1,
    linkedMilestoneId: "ms-structure",
    linkedProductId: "product-startup",
    isPublic: true
  },
  {
    id: "task-2026-07-14-growth",
    title: "搭建成长路径多级页面",
    status: "准备中",
    learningContent: "准备年月 -> 日期 -> 任务 -> 详情的四层浏览路径。",
    practiceContent: "下一步补齐列表筛选、详情页和编辑入口。",
    progressDelta: 1,
    linkedMilestoneId: "ms-growth",
    linkedProductId: "product-startup",
    isPublic: true
  }
];

export const seedGrowthMonths: GrowthMonth[] = [
  {
    id: "month-2026-07",
    yearMonth: "2026-07",
    title: "作品站结构重构",
    summary: "完成首页介绍页与成长路径层级，建立月目标和每日任务的展示方式。",
    goal: "把作品站改造成可讲清产品价值的成长型门户。",
    status: "进行中",
    progress: 38,
    days: [
      {
        id: "day-2026-07-13",
        date: "2026-07-13",
        day: "13",
        title: "架构拆分",
        summary: "确认首页、成长路径和产品进展的职责边界。",
        status: "已完成",
        progress: 60,
        tasks: july13Tasks,
        isPublic: true
      },
      {
        id: "day-2026-07-14",
        date: "2026-07-14",
        day: "14",
        title: "首页宣传动效",
        summary: "用代码动画做产品介绍，减少对外链素材的依赖。",
        status: "进行中",
        progress: 35,
        tasks: july14Tasks,
        isPublic: true
      }
    ],
    isPublic: true
  },
  {
    id: "month-2026-08",
    yearMonth: "2026-08",
    title: "成长路径与产品验证",
    summary: "继续补全任务详情编辑、进度同步和产品试用反馈。",
    goal: "让学习和产品迭代真正形成闭环。",
    status: "准备中",
    progress: 10,
    days: [
      {
        id: "day-2026-08-01",
        date: "2026-08-01",
        day: "01",
        title: "任务编辑规划",
        summary: "预留月目标、日任务和详情页的编辑入口。",
        status: "准备中",
        progress: 0,
        tasks: [],
        isPublic: true
      }
    ],
    isPublic: true
  }
];
