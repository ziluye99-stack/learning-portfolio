import Link from "next/link";
import { RotateCcw, Save, Trash2 } from "lucide-react";
import {
  createDailyLog,
  createMilestone,
  createProject,
  createTutorial,
  deleteItem,
  updateProfile
} from "@/app/admin/actions";
import type { SharedPortfolioData } from "@/lib/shared-data";

export function SharedAdmin({
  data,
  saved,
  deleted
}: {
  data: SharedPortfolioData;
  saved?: string;
  deleted?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Git Admin</p>
              <h1>学习记录后台</h1>
              <p>管理员密码登录，内容写入共享 JSON。配置 GitHub 后会自动提交到仓库。</p>
            </div>
            <div className="inline-actions">
              <Link className="button" href="/admin/logout">
                退出登录
              </Link>
            </div>
          </div>

          {saved ? <p className="notice">保存成功，前台页面已刷新。</p> : null}
          {deleted ? <p className="notice">删除成功，前台页面已刷新。</p> : null}

          <div className="admin-layout">
            <div className="admin-stack">
              <section className="admin-panel">
                <h2>个人资料</h2>
                <form action={updateProfile} className="form-grid">
                  <div className="field">
                    <label htmlFor="profile-name">姓名/昵称</label>
                    <input id="profile-name" name="name" defaultValue={data.profile.name} required />
                  </div>
                  <div className="field">
                    <label htmlFor="profile-title">页面标题</label>
                    <input id="profile-title" name="title" defaultValue={data.profile.title} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="profile-summary">简介</label>
                    <textarea id="profile-summary" name="summary" defaultValue={data.profile.summary} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="currentGoal">当前目标</label>
                    <input id="currentGoal" name="currentGoal" defaultValue={data.profile.currentGoal} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="focus">学习重点</label>
                    <input id="focus" name="focus" defaultValue={data.profile.focus.join(", ")} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="avatarUrl">头像/首屏图片 URL</label>
                    <input id="avatarUrl" name="avatarUrl" type="url" defaultValue={data.profile.avatarUrl} required />
                  </div>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存资料
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增每日记录</h2>
                <form action={createDailyLog} className="form-grid">
                  <div className="field">
                    <label htmlFor="date">日期</label>
                    <input id="date" name="date" type="date" defaultValue={today} required />
                  </div>
                  <div className="field">
                    <label htmlFor="status">状态</label>
                    <select id="status" name="status" required defaultValue="进行中">
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                      <option value="准备中">准备中</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label htmlFor="title">标题</label>
                    <input id="title" name="title" placeholder="例如：React 组件拆分练习" required />
                  </div>
                  <div className="field">
                    <label htmlFor="phase">阶段</label>
                    <input id="phase" name="phase" placeholder="例如：前端基础" required />
                  </div>
                  <div className="field">
                    <label htmlFor="progress">进度</label>
                    <input id="progress" name="progress" type="number" min="0" max="100" defaultValue="50" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="learned">学习路径</label>
                    <textarea id="learned" name="learned" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="practice">实战情况</label>
                    <textarea id="practice" name="practice" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="reflection">复盘</label>
                    <textarea id="reflection" name="reflection" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存记录
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增里程碑</h2>
                <form action={createMilestone} className="form-grid">
                  <div className="field full">
                    <label htmlFor="milestone-title">标题</label>
                    <input id="milestone-title" name="title" required />
                  </div>
                  <div className="field">
                    <label htmlFor="targetDate">目标日期</label>
                    <input id="targetDate" name="targetDate" type="date" required />
                  </div>
                  <div className="field">
                    <label htmlFor="milestone-status">状态</label>
                    <select id="milestone-status" name="status" required defaultValue="准备中">
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="milestone-progress">完成度</label>
                    <input id="milestone-progress" name="progress" type="number" min="0" max="100" defaultValue="0" />
                  </div>
                  <div className="field full">
                    <label htmlFor="description">说明</label>
                    <textarea id="description" name="description" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存里程碑
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增实战项目</h2>
                <form action={createProject} className="form-grid">
                  <div className="field full">
                    <label htmlFor="project-name">项目名称</label>
                    <input id="project-name" name="name" required />
                  </div>
                  <div className="field">
                    <label htmlFor="project-status">状态</label>
                    <input id="project-status" name="status" placeholder="例如：初版" required />
                  </div>
                  <div className="field">
                    <label htmlFor="sortOrder">排序</label>
                    <input id="sortOrder" name="sortOrder" type="number" defaultValue="100" />
                  </div>
                  <div className="field full">
                    <label htmlFor="project-description">简介</label>
                    <textarea id="project-description" name="description" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="stack">技术栈</label>
                    <input id="stack" name="stack" placeholder="Next.js, GitHub JSON, Vercel" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="coverUrl">封面图片 URL</label>
                    <input id="coverUrl" name="coverUrl" type="url" />
                  </div>
                  <div className="field">
                    <label htmlFor="repoUrl">仓库链接</label>
                    <input id="repoUrl" name="repoUrl" type="url" />
                  </div>
                  <div className="field">
                    <label htmlFor="demoUrl">演示链接</label>
                    <input id="demoUrl" name="demoUrl" />
                  </div>
                  <div className="field full">
                    <label htmlFor="summary">实战总结</label>
                    <textarea id="summary" name="summary" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存项目
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增教程链接</h2>
                <form action={createTutorial} className="form-grid">
                  <div className="field full">
                    <label htmlFor="tutorial-title">标题</label>
                    <input id="tutorial-title" name="title" placeholder="例如：React 官方文档" required />
                  </div>
                  <div className="field">
                    <label htmlFor="tutorial-category">分类</label>
                    <input id="tutorial-category" name="category" placeholder="例如：React" required />
                  </div>
                  <div className="field">
                    <label htmlFor="tutorial-url">链接</label>
                    <input id="tutorial-url" name="url" type="url" placeholder="https://..." required />
                  </div>
                  <div className="field full">
                    <label htmlFor="tutorial-description">说明</label>
                    <textarea id="tutorial-description" name="description" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存教程链接
                    </button>
                  </div>
                </form>
              </section>
            </div>

            <aside className="admin-panel">
              <h2>共享数据管理</h2>
              <p className="summary">
                当前共有：{data.dailyLogs.length} 条学习记录、{data.milestones.length} 个里程碑、
                {data.projects.length} 个项目、{data.tutorials.length} 个教程链接。
              </p>

              <AdminList title="学习记录" type="dailyLogs" items={data.dailyLogs.map((item) => ({
                id: item.id,
                title: item.title,
                meta: `${item.date} / ${item.phase} / ${item.progress}% / ${item.status}`
              }))} />
              <AdminList title="里程碑" type="milestones" items={data.milestones.map((item) => ({
                id: item.id,
                title: item.title,
                meta: `${item.targetDate} / ${item.progress}% / ${item.status}`
              }))} />
              <AdminList title="实战项目" type="projects" items={data.projects.map((item) => ({
                id: item.id,
                title: item.name,
                meta: `${item.status} / 排序 ${item.sortOrder}`
              }))} />
              <AdminList title="教程链接" type="tutorials" items={data.tutorials.map((item) => ({
                id: item.id,
                title: item.title,
                meta: item.category
              }))} />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function AdminList({
  title,
  type,
  items
}: {
  title: string;
  type: "dailyLogs" | "milestones" | "projects" | "tutorials";
  items: Array<{ id: string; title: string; meta: string }>;
}) {
  return (
    <div className="admin-list">
      <h3>{title}</h3>
      {items.map((item) => (
        <article className="admin-log" key={item.id}>
          <div>
            <strong>{item.title}</strong>
            <span className="summary">{item.meta}</span>
          </div>
          <form action={deleteItem}>
            <input name="type" type="hidden" value={type} />
            <input name="id" type="hidden" value={item.id} />
            <button className="danger" type="submit">
              <Trash2 size={16} aria-hidden="true" />
              删除
            </button>
          </form>
        </article>
      ))}
    </div>
  );
}
