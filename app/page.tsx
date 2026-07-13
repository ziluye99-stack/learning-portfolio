import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import { LogCard } from "@/components/LogCard";
import { MetricGrid } from "@/components/MetricGrid";
import { ProjectCard } from "@/components/ProjectCard";
import { getSharedData, getSharedStats } from "@/lib/shared-data";

export default async function HomePage() {
  const data = await getSharedData();
  const profile = data.profile;
  const logs = data.dailyLogs.filter((item) => item.isPublic);
  const projects = data.projects.filter((item) => item.isPublic);
  const stats = getSharedStats(data);

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
              <p className="eyebrow">Git Data</p>
              <h3>共享数据</h3>
              <p>后台保存后会更新共享 JSON，其他人访问也能看到同一份内容。</p>
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
