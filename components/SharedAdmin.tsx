import Link from "next/link";
import { Save, Trash2 } from "lucide-react";
import {
  deleteItem,
  upsertGrowthDayAction,
  upsertGrowthMonthAction,
  upsertGrowthTaskAction,
  upsertMilestoneAction,
  upsertProductAction,
  upsertTutorialAction,
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
  const defaultMonth = data.growthMonths[0];
  const defaultDay = defaultMonth?.days[0];
  const defaultTask = defaultDay?.tasks[0];
  const product = data.products[0];
  const milestone = data.milestones[0];

  const growthDays = data.growthMonths.reduce((sum, month) => sum + month.days.length, 0);
  const growthTasks = data.growthMonths.reduce((sum, month) => sum + month.days.reduce((daySum, day) => daySum + day.tasks.length, 0), 0);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Admin</p>
              <h1>内容编辑后台</h1>
              <p>登录后可新增月目标、日期、任务、里程碑和产品进展。</p>
            </div>
            <div className="inline-actions">
              <Link className="button" href="/">
                返回首页
              </Link>
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
                <h2>首页信息</h2>
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
                    <label htmlFor="avatarUrl">首屏文案图片 URL</label>
                    <input id="avatarUrl" name="avatarUrl" type="url" defaultValue={data.profile.avatarUrl} required />
                  </div>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存首页
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增月目标</h2>
                <form action={upsertGrowthMonthAction} className="form-grid">
                  <div className="field">
                    <label htmlFor="yearMonth">年月</label>
                    <input id="yearMonth" name="yearMonth" type="month" defaultValue={defaultMonth?.yearMonth || today.slice(0, 7)} required />
                  </div>
                  <div className="field">
                    <label htmlFor="month-status">状态</label>
                    <select id="month-status" name="status" defaultValue="准备中" required>
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label htmlFor="month-title">标题</label>
                    <input id="month-title" name="title" placeholder="例如：成长路径重构" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="month-goal">大目标</label>
                    <input id="month-goal" name="goal" placeholder="例如：完成成长路径与产品进展重构" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="month-summary">说明</label>
                    <textarea id="month-summary" name="summary" required />
                  </div>
                  <div className="field">
                    <label htmlFor="month-progress">进度</label>
                    <input id="month-progress" name="progress" type="number" min="0" max="100" defaultValue="0" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存月目标
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增日期</h2>
                <form action={upsertGrowthDayAction} className="form-grid">
                  <div className="field">
                    <label htmlFor="day-yearMonth">年月</label>
                    <input id="day-yearMonth" name="yearMonth" type="month" defaultValue={defaultMonth?.yearMonth || today.slice(0, 7)} required />
                  </div>
                  <div className="field">
                    <label htmlFor="day-day">日</label>
                    <input id="day-day" name="day" type="number" min="1" max="31" defaultValue={Number(today.slice(8, 10))} required />
                  </div>
                  <div className="field">
                    <label htmlFor="day-status">状态</label>
                    <select id="day-status" name="status" defaultValue="准备中" required>
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field full">
                    <label htmlFor="day-title">标题</label>
                    <input id="day-title" name="title" placeholder="例如：首页宣传动效" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="day-summary">说明</label>
                    <textarea id="day-summary" name="summary" required />
                  </div>
                  <div className="field">
                    <label htmlFor="day-progress">进度</label>
                    <input id="day-progress" name="progress" type="number" min="0" max="100" defaultValue="0" required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存日期
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增任务</h2>
                <form action={upsertGrowthTaskAction} className="form-grid">
                  <div className="field">
                    <label htmlFor="task-yearMonth">年月</label>
                    <input id="task-yearMonth" name="yearMonth" type="month" defaultValue={defaultMonth?.yearMonth || today.slice(0, 7)} required />
                  </div>
                  <div className="field">
                    <label htmlFor="task-day">日</label>
                    <input id="task-day" name="day" type="number" min="1" max="31" defaultValue={Number(defaultDay?.day || today.slice(8, 10))} required />
                  </div>
                  <div className="field">
                    <label htmlFor="task-status">状态</label>
                    <select id="task-status" name="status" defaultValue="进行中" required>
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="task-progressDelta">进度增量</label>
                    <input id="task-progressDelta" name="progressDelta" type="number" min="1" max="100" defaultValue="1" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="task-title">标题</label>
                    <input id="task-title" name="title" placeholder="例如：重做产品宣传动画" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="learningContent">学习内容</label>
                    <textarea id="learningContent" name="learningContent" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="practiceContent">实战内容</label>
                    <textarea id="practiceContent" name="practiceContent" required />
                  </div>
                  <div className="field">
                    <label htmlFor="linkedMilestoneId">关联里程碑</label>
                    <input id="linkedMilestoneId" name="linkedMilestoneId" defaultValue={milestone?.id || ""} />
                  </div>
                  <div className="field">
                    <label htmlFor="linkedProductId">关联产品</label>
                    <input id="linkedProductId" name="linkedProductId" defaultValue={product?.id || ""} />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存任务
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>产品进展</h2>
                <form action={upsertProductAction} className="form-grid">
                  <input name="productId" type="hidden" defaultValue={product?.id || ""} />
                  <div className="field full">
                    <label htmlFor="product-name">名称</label>
                    <input id="product-name" name="name" defaultValue={product?.name || ""} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="product-tagline">一句话</label>
                    <input id="product-tagline" name="tagline" defaultValue={product?.tagline || ""} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="product-problem">要解决的问题</label>
                    <textarea id="product-problem" name="problem" defaultValue={product?.problem || ""} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="product-solution">当前方案</label>
                    <textarea id="product-solution" name="solution" defaultValue={product?.solution || ""} required />
                  </div>
                  <div className="field">
                    <label htmlFor="product-status">状态</label>
                    <select id="product-status" name="status" defaultValue={product?.status || "准备中"} required>
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="product-progress">进度</label>
                    <input id="product-progress" name="progress" type="number" min="0" max="100" defaultValue={product?.progress || 0} required />
                  </div>
                  <div className="field full">
                    <label htmlFor="product-roadmap">路线图</label>
                    <textarea id="product-roadmap" name="roadmap" defaultValue={product?.roadmap.join(", ") || ""} required />
                  </div>
                  <label className="field full">
                    <span>公开展示</span>
                    <input name="isPublic" type="checkbox" defaultChecked={product?.isPublic ?? true} />
                  </label>
                  <div className="field full">
                    <button className="primary" type="submit">
                      <Save size={17} aria-hidden="true" />
                      保存产品
                    </button>
                  </div>
                </form>
              </section>

              <section className="admin-panel">
                <h2>新增里程碑</h2>
                <form action={upsertMilestoneAction} className="form-grid">
                  <div className="field full">
                    <label htmlFor="milestone-title">标题</label>
                    <input id="milestone-title" name="title" required />
                  </div>
                  <div className="field">
                    <label htmlFor="milestone-targetDate">目标日期</label>
                    <input id="milestone-targetDate" name="targetDate" type="date" defaultValue={today} required />
                  </div>
                  <div className="field">
                    <label htmlFor="milestone-status">状态</label>
                    <select id="milestone-status" name="status" defaultValue="准备中" required>
                      <option value="准备中">准备中</option>
                      <option value="进行中">进行中</option>
                      <option value="已完成">已完成</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="milestone-progress">进度</label>
                    <input id="milestone-progress" name="progress" type="number" min="0" max="100" defaultValue="0" required />
                  </div>
                  <div className="field full">
                    <label htmlFor="milestone-description">说明</label>
                    <textarea id="milestone-description" name="description" required />
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
                <h2>新增教程链接</h2>
                <form action={upsertTutorialAction} className="form-grid">
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
              <h2>数据概览</h2>
              <p className="summary">
                当前共有 {data.growthMonths.length} 个月、{growthDays} 天、{growthTasks} 个任务、{data.milestones.length} 个里程碑、{data.products.length} 个产品、{data.tutorials.length} 个教程。
              </p>

              <Tree title="成长路径" months={data.growthMonths} />
              <SimpleList
                title="里程碑"
                type="milestones"
                items={data.milestones.map((item) => ({
                  id: item.id,
                  title: item.title,
                  meta: `${item.targetDate} / ${item.progress}% / ${item.status}`
                }))}
              />
              <SimpleList
                title="产品进展"
                type="products"
                items={data.products.map((item) => ({
                  id: item.id,
                  title: item.name,
                  meta: `${item.progress}% / ${item.status}`
                }))}
              />
              <SimpleList
                title="教程链接"
                type="tutorials"
                items={data.tutorials.map((item) => ({
                  id: item.id,
                  title: item.title,
                  meta: item.category
                }))}
              />
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function Tree({
  title,
  months
}: {
  title: string;
  months: SharedPortfolioData["growthMonths"];
}) {
  return (
    <div className="admin-list">
      <h3>{title}</h3>
      {months.map((month) => (
        <details className="admin-tree" key={month.id} open>
          <summary>
            <strong>{month.yearMonth}</strong>
            <span className="summary">{month.title}</span>
          </summary>
          <article className="admin-log">
            <div>
              <strong>{month.goal}</strong>
              <span className="summary">{month.summary}</span>
            </div>
            <form action={deleteItem}>
              <input name="type" type="hidden" value="growthMonths" />
              <input name="id" type="hidden" value={month.yearMonth} />
              <button className="danger" type="submit">
                <Trash2 size={16} aria-hidden="true" />
                删除月
              </button>
            </form>
          </article>
          <div className="admin-sublist">
            {month.days.map((day) => (
              <details key={day.id}>
                <summary>
                  <strong>{day.date}</strong>
                  <span className="summary">{day.title}</span>
                </summary>
                <article className="admin-log">
                  <div>
                    <strong>{day.summary}</strong>
                    <span className="summary">{day.progress}% / {day.status}</span>
                  </div>
                  <form action={deleteItem}>
                    <input name="type" type="hidden" value="growthDays" />
                    <input name="yearMonth" type="hidden" value={month.yearMonth} />
                    <input name="day" type="hidden" value={day.day} />
                    <input name="id" type="hidden" value={day.id} />
                    <button className="danger" type="submit">
                      <Trash2 size={16} aria-hidden="true" />
                      删除日
                    </button>
                  </form>
                </article>
                <div className="admin-sublist">
                  {day.tasks.map((task) => (
                    <article className="admin-log" key={task.id}>
                      <div>
                        <strong>{task.title}</strong>
                        <span className="summary">{task.status} / {task.progressDelta}%</span>
                      </div>
                      <form action={deleteItem}>
                        <input name="type" type="hidden" value="growthTasks" />
                        <input name="yearMonth" type="hidden" value={month.yearMonth} />
                        <input name="day" type="hidden" value={day.day} />
                        <input name="id" type="hidden" value={task.id} />
                        <button className="danger" type="submit">
                          <Trash2 size={16} aria-hidden="true" />
                          删除任务
                        </button>
                      </form>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

function SimpleList({
  title,
  type,
  items
}: {
  title: string;
  type: "milestones" | "products" | "tutorials";
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
