"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LogCard } from "@/components/LogCard";
import { MetricGrid } from "@/components/MetricGrid";
import { ProgressBar } from "@/components/ProgressBar";
import { ProjectCard } from "@/components/ProjectCard";
import {
  defaultPortfolioData,
  getStats,
  readLocalData,
  sortDailyLogs,
  type LocalPortfolioData
} from "@/lib/local-data";

function usePortfolioData() {
  const [data, setData] = useState<LocalPortfolioData>(defaultPortfolioData);

  useEffect(() => {
    const load = () => setData(readLocalData());
    load();
    window.addEventListener("storage", load);
    window.addEventListener("portfolio-data-change", load);
    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("portfolio-data-change", load);
    };
  }, []);

  return data;
}

export function LocalHomePage() {
  const data = usePortfolioData();
  const profile = data.profile;
  const logs = sortDailyLogs(data.dailyLogs).filter((item) => item.isPublic);
  const projects = [...data.projects]
    .filter((item) => item.isPublic)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const stats = getStats(data);

  return (
    <main>
      <section className="container hero">
        <div className="hero-copy">
          <p className="eyebrow">Daily Learning Portfolio</p>
          <h1>{profile.name}</h1>
          <p className="lead">{profile.summary}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/learning">
              <ClipboardList size={18} aria-hidden="true" />
              查看学习路径
            </Link>
            <Link className="button" href="/projects">
              查看实战项目
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="hero-media">
          {/* eslint-disable-next-line @next/next/no-img-element -- Admin can use arbitrary image URLs without configuring domains. */}
          <img src={profile.avatarUrl} alt="学习工作台" />
          <div className="floating-panel">
            <p className="eyebrow">当前目标</p>
            <strong>{profile.currentGoal}</strong>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Progress</p>
              <h2>学习进度概览</h2>
            </div>
            <p>用记录天数、平均进度和实战项目数量看清自己的推进节奏。</p>
          </div>
          <MetricGrid stats={stats} />
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <div>
            <div className="section-head">
              <div>
                <p className="eyebrow">Recent Logs</p>
                <h2>最近学习记录</h2>
              </div>
              <Link className="button" href="/learning">
                全部记录
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="log-list">
              {logs.slice(0, 3).map((log) => (
                <LogCard log={log} key={log.id} />
              ))}
            </div>
          </div>
          <aside className="side-panel">
            <div className="focus-panel">
              <p className="eyebrow">Focus</p>
              <h3>当前学习重点</h3>
              <div className="tag-row">
                {profile.focus.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="admin-panel">
              <p className="eyebrow">Local Admin</p>
              <h3>本地后台</h3>
              <p>数据保存在当前浏览器，不需要登录，不依赖云服务。</p>
              <Link className="button" href="/admin">
                打开后台
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Practice</p>
              <h2>实战项目</h2>
            </div>
            <Link className="button" href="/projects">
              项目列表
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="project-grid">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function LocalLearningPage() {
  const data = usePortfolioData();
  const [activeFilter, setActiveFilter] = useState("全部");
  const filters = ["全部", "已完成", "进行中", "前端基础", "作品集搭建"];
  const logs = sortDailyLogs(data.dailyLogs).filter((item) => item.isPublic);
  const visibleLogs =
    activeFilter === "全部"
      ? logs
      : logs.filter((item) => item.status === activeFilter || item.phase === activeFilter);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Learning Path</p>
              <h1>每日学习路径</h1>
              <p>按日期记录学习内容、完成进度、实战情况和复盘备注。</p>
            </div>
          </div>
          <div className="filter-row" aria-label="记录筛选">
            {filters.map((filter) => (
              <button
                className={`button ${activeFilter === filter ? "is-active" : ""}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
                type="button"
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="log-list">
            {visibleLogs.map((log) => (
              <LogCard log={log} key={log.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function LocalMilestonesPage() {
  const data = usePortfolioData();
  const milestones = data.milestones.filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Milestones</p>
              <h1>阶段里程碑</h1>
              <p>把长期学习拆成阶段目标，跟踪每个阶段的完成度和下一步。</p>
            </div>
          </div>
          <div className="timeline">
            {milestones.map((item) => (
              <article className="milestone" key={item.id}>
                <div className="timeline-dot" />
                <div className="milestone-body">
                  <div className="card-head">
                    <div>
                      <p className="eyebrow">目标日期 {item.targetDate}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="status">{item.status}</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="meta-row">
                    <span>完成度</span>
                    <strong>{item.progress}%</strong>
                  </div>
                  <ProgressBar value={item.progress} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function LocalProjectsPage() {
  const data = usePortfolioData();
  const projects = useMemo(
    () => data.projects.filter((item) => item.isPublic).sort((a, b) => a.sortOrder - b.sortOrder),
    [data.projects]
  );

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Projects</p>
              <h1>实战项目</h1>
              <p>把学习内容转化为可展示、可复盘、可继续迭代的项目成果。</p>
            </div>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export function LocalTutorialsPage() {
  const data = usePortfolioData();
  const tutorials = data.tutorials.filter((item) => item.isPublic);
  const categories = Array.from(new Set(tutorials.map((item) => item.category)));

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Tutorials</p>
              <h1>教程链接</h1>
              <p>把常用教程、文档和学习资料集中保存，点击后直接跳转。</p>
            </div>
          </div>
          <div className="project-grid">
            {tutorials.map((item) => (
              <article className="admin-panel" key={item.id}>
                <p className="eyebrow">{item.category}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a className="button" href={item.url} rel="noreferrer" target="_blank">
                  打开链接
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          {categories.length ? (
            <div className="tag-row">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
