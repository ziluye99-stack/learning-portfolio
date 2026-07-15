import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { GrowthTaskCard } from "@/components/GrowthTaskCard";
import { ProgressBar } from "@/components/ProgressBar";
import { isAdminSession } from "@/lib/admin-session";
import { getPublicData } from "@/lib/public-data";
import {
  dayLabel,
  findGrowthDay,
  findGrowthMonth,
  getVisibleTasks,
  monthLabel,
  sortGrowthTasks,
  taskLifeContent,
  taskLifeProgress,
  taskOperationContent,
  taskOperationProgress,
  taskSectionPath,
  taskTheoryContent,
  taskTheoryProgress
} from "@/lib/growth-data";
import { upsertGrowthDayAction, upsertGrowthTaskAction } from "@/app/admin/actions";

const filters = ["全部", "已完成", "进行中"] as const;

export default async function GrowthDayPage({
  params,
  searchParams
}: {
  params: Promise<{ yearMonth: string; day: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { yearMonth, day } = await params;
  const { filter } = await searchParams;
  const activeFilter = filter || "全部";
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
  const admin = await isAdminSession();

  if (!month || !month.isPublic) notFound();

  const dayItem = findGrowthDay(month, day);
  if (!dayItem || !dayItem.isPublic) notFound();

  const visibleTasks = getVisibleTasks(dayItem, activeFilter);
  const totalTasks = sortGrowthTasks(dayItem.tasks.filter((item) => item.isPublic));
  const primaryTask = totalTasks[0];

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {monthLabel(month.yearMonth)} / {dayLabel(dayItem.day)}
              </p>
              <h1>{dayItem.title}</h1>
              <p>{dayItem.summary}</p>
            </div>
            <Link className="button" href={`/growth/${month.yearMonth}`}>
              返回本月
            </Link>
          </div>

          <article className="admin-panel">
            <div className="meta-row">
              <span>{totalTasks.length} 个任务</span>
              <strong>{dayItem.progress}%</strong>
            </div>
            <ProgressBar value={dayItem.progress} />
            <div className="task-grid">
              <Link
                className="task-block section-link"
                href={primaryTask ? taskSectionPath(month.yearMonth, dayItem.day, primaryTask.id, "theory") : `/growth/${month.yearMonth}/${dayItem.day}`}
              >
                <p className="eyebrow">理论学习部分</p>
                <p>{primaryTask ? taskTheoryContent(primaryTask) : "待编辑理论学习内容。"}</p>
                <div className="meta-row">
                  <span>{primaryTask?.theoryLinks?.filter((item) => item.isPublic).length || 0} 个学习链接</span>
                  <strong>{primaryTask ? taskTheoryProgress(primaryTask) : 0}%</strong>
                </div>
                <ProgressBar value={primaryTask ? taskTheoryProgress(primaryTask) : 0} />
              </Link>
              <Link
                className="task-block section-link"
                href={primaryTask ? taskSectionPath(month.yearMonth, dayItem.day, primaryTask.id, "practice") : `/growth/${month.yearMonth}/${dayItem.day}`}
              >
                <p className="eyebrow">实操部分</p>
                <p>{primaryTask ? taskOperationContent(primaryTask) : "待编辑实操内容。"}</p>
                <div className="meta-row">
                  <span>{primaryTask?.practiceProjects?.filter((item) => item.isPublic).length || 0} 个项目实战</span>
                  <strong>{primaryTask ? taskOperationProgress(primaryTask) : 0}%</strong>
                </div>
                <ProgressBar value={primaryTask ? taskOperationProgress(primaryTask) : 0} />
              </Link>
              <Link
                className="task-block section-link"
                href={primaryTask ? taskSectionPath(month.yearMonth, dayItem.day, primaryTask.id, "life") : `/growth/${month.yearMonth}/${dayItem.day}`}
              >
                <p className="eyebrow">生活部分</p>
                <p>{primaryTask ? taskLifeContent(primaryTask) : "待编辑生活安排。"}</p>
                <div className="meta-row">
                  <span>总结 / 运动训练</span>
                  <strong>{primaryTask ? taskLifeProgress(primaryTask) : 0}%</strong>
                </div>
                <ProgressBar value={primaryTask ? taskLifeProgress(primaryTask) : 0} />
              </Link>
            </div>
          </article>

          {admin ? (
            <div className="admin-panel">
              <h2>编辑当天</h2>
              <form action={upsertGrowthDayAction} className="form-grid">
                <input name="yearMonth" type="hidden" defaultValue={month.yearMonth} />
                <input name="dayId" type="hidden" defaultValue={dayItem.id} />
                <div className="field">
                  <label htmlFor="edit-day-day">日期</label>
                  <input id="edit-day-day" name="day" defaultValue={dayItem.day} required />
                </div>
                <div className="field">
                  <label htmlFor="edit-day-status">状态</label>
                  <select id="edit-day-status" name="status" defaultValue={dayItem.status} required>
                    <option value="准备中">准备中</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="edit-day-title">标题</label>
                  <input id="edit-day-title" name="title" defaultValue={dayItem.title} required />
                </div>
                <div className="field full">
                  <label htmlFor="edit-day-summary">说明</label>
                  <textarea id="edit-day-summary" name="summary" defaultValue={dayItem.summary} required />
                </div>
                <div className="field">
                  <label htmlFor="edit-day-progress">进度</label>
                  <input id="edit-day-progress" name="progress" type="number" min="0" max="100" defaultValue={dayItem.progress} required />
                </div>
                <label className="field full">
                  <span>公开展示</span>
                  <input name="isPublic" type="checkbox" defaultChecked={dayItem.isPublic} />
                </label>
                <div className="field full">
                  <button className="primary" type="submit">
                    保存当天
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {admin ? (
            <div className="admin-panel">
              <h2>新增任务</h2>
              <form action={upsertGrowthTaskAction} className="form-grid">
                <input name="yearMonth" type="hidden" defaultValue={month.yearMonth} />
                <input name="day" type="hidden" defaultValue={dayItem.day} />
                <div className="field full">
                  <label htmlFor="task-title">标题</label>
                  <input id="task-title" name="title" required />
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
                <div className="field">
                  <label htmlFor="task-theoryProgress">理论进度</label>
                  <input id="task-theoryProgress" name="theoryProgress" type="number" min="0" max="100" defaultValue="0" required />
                </div>
                <div className="field">
                  <label htmlFor="task-operationProgress">实操进度</label>
                  <input id="task-operationProgress" name="operationProgress" type="number" min="0" max="100" defaultValue="0" required />
                </div>
                <div className="field">
                  <label htmlFor="task-lifeProgress">生活进度</label>
                  <input id="task-lifeProgress" name="lifeProgress" type="number" min="0" max="100" defaultValue="0" required />
                </div>
                <div className="field">
                  <label htmlFor="task-fitnessProgress">运动进度</label>
                  <input id="task-fitnessProgress" name="fitnessProgress" type="number" min="0" max="100" defaultValue="0" required />
                </div>
                <div className="field full">
                  <label htmlFor="theoryContent">理论学习部分</label>
                  <textarea id="theoryContent" name="theoryContent" required />
                </div>
                <div className="field full">
                  <label htmlFor="operationContent">实操部分</label>
                  <textarea id="operationContent" name="operationContent" required />
                </div>
                <div className="field full">
                  <label htmlFor="lifeContent">生活部分</label>
                  <textarea id="lifeContent" name="lifeContent" required />
                </div>
                <div className="field full">
                  <label htmlFor="theoryLinksText">学习链接和心得笔记</label>
                  <textarea id="theoryLinksText" name="theoryLinksText" placeholder="链接标题 | URL | 进度 | 心得标题 | 心得内容" />
                </div>
                <div className="field full">
                  <label htmlFor="practiceProjectsText">项目实战</label>
                  <textarea id="practiceProjectsText" name="practiceProjectsText" placeholder="项目标题 | URL | 进度 | 项目说明 | 实操复盘" />
                </div>
                <div className="field full">
                  <label htmlFor="lifeSummary">每日总结</label>
                  <textarea id="lifeSummary" name="lifeSummary" />
                </div>
                <div className="field full">
                  <label htmlFor="fitnessPlan">运动训练健身</label>
                  <textarea id="fitnessPlan" name="fitnessPlan" />
                </div>
                <div className="field">
                  <label htmlFor="linkedMilestoneId">关联里程碑</label>
                  <input id="linkedMilestoneId" name="linkedMilestoneId" placeholder="ms-..." />
                </div>
                <div className="field">
                  <label htmlFor="linkedProductId">关联产品</label>
                  <input id="linkedProductId" name="linkedProductId" placeholder="product-..." />
                </div>
                <label className="field full">
                  <span>公开展示</span>
                  <input name="isPublic" type="checkbox" defaultChecked />
                </label>
                <div className="field full">
                  <button className="primary" type="submit">
                    保存任务
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="filter-row" aria-label="任务筛选">
            {filters.map((item) => (
              <Link
                className={`button ${activeFilter === item ? "is-active" : ""}`}
                href={item === "全部" ? `/growth/${month.yearMonth}/${dayItem.day}` : `/growth/${month.yearMonth}/${dayItem.day}?filter=${encodeURIComponent(item)}`}
                key={item}
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="log-list">
            {visibleTasks.map((task) => (
              <GrowthTaskCard day={dayItem} month={monthLabel(month.yearMonth)} task={task} yearMonth={month.yearMonth} key={task.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
