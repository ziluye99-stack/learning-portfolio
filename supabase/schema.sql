create extension if not exists pgcrypto;

create table if not exists public.profile (
  id boolean primary key default true check (id),
  name text not null,
  title text not null,
  summary text not null,
  current_goal text not null,
  focus text[] not null default '{}',
  avatar_url text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null,
  phase text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null check (status in ('准备中', '进行中', '已完成')),
  learned text not null,
  practice text not null,
  reflection text not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null check (status in ('准备中', '进行中', '已完成')),
  target_date date not null,
  completed_date date,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  stack text[] not null default '{}',
  cover_url text not null,
  status text not null,
  repo_url text,
  demo_url text,
  summary text not null,
  sort_order integer not null default 100,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.daily_logs enable row level security;
alter table public.milestones enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Public can read profile" on public.profile;
create policy "Public can read profile"
on public.profile for select
using (true);

drop policy if exists "Public can read public daily logs" on public.daily_logs;
create policy "Public can read public daily logs"
on public.daily_logs for select
using (is_public = true);

drop policy if exists "Public can read public milestones" on public.milestones;
create policy "Public can read public milestones"
on public.milestones for select
using (is_public = true);

drop policy if exists "Public can read public projects" on public.projects;
create policy "Public can read public projects"
on public.projects for select
using (is_public = true);

insert into public.profile (id, name, title, summary, current_goal, focus, avatar_url)
values (
  true,
  '叶子路',
  '个人学习进度与实战作品集',
  '持续记录每天的学习路径、阶段进度和项目实战，用可复盘的数据追踪成长。',
  '完成前端工程化与全栈项目实战路线',
  array['前端基础', 'React / Next.js', '数据库与认证', '项目实战'],
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80'
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read portfolio assets" on storage.objects;
create policy "Public can read portfolio assets"
on storage.objects for select
using (bucket_id = 'portfolio-assets');

insert into public.daily_logs (
  date,
  title,
  phase,
  progress,
  status,
  learned,
  practice,
  reflection,
  is_public
)
select
  '2026-07-13',
  '作品展示站升级为 Next.js',
  '作品集搭建',
  28,
  '进行中',
  '把静态原型迁移为 App Router 项目，并预留 Supabase 认证和数据库结构。',
  '完成首页、学习路径、里程碑、项目和后台页面的组件化改造。',
  '先保证页面可运行，再把真实云端数据接入到后台表单。',
  true
where not exists (select 1 from public.daily_logs);

insert into public.milestones (
  title,
  description,
  progress,
  status,
  target_date,
  is_public
)
select
  '前端基础阶段',
  'HTML、CSS、JavaScript、响应式布局和基础交互。',
  70,
  '进行中',
  '2026-07-25',
  true
where not exists (select 1 from public.milestones);

insert into public.projects (
  name,
  description,
  stack,
  cover_url,
  status,
  repo_url,
  demo_url,
  summary,
  sort_order,
  is_public
)
select
  '学习作品展示站',
  '展示每日学习路径、阶段里程碑、实战项目和后台维护流程的个人网站。',
  array['Next.js', 'TypeScript', 'Supabase', 'Vercel'],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  '升级中',
  null,
  '/',
  '从静态原型升级为可接入认证、数据库和图片上传的全栈作品站。',
  1,
  true
where not exists (select 1 from public.projects);
