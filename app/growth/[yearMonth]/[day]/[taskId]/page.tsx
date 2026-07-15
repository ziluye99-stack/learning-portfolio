import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isAdminSession } from "@/lib/admin-session";
import { getPublicData } from "@/lib/public-data";
import {
  dayLabel,
  findGrowthDay,
  findGrowthMonth,
  findGrowthTask,
  monthLabel,
  taskLifeContent,
  taskLifeProgress,
  taskOperationContent,
  taskOperationProgress,
  taskSectionPath,
  taskTheoryContent,
  taskTheoryProgress
} from "@/lib/growth-data";
import { ProgressBar } from "@/components/ProgressBar";
import { upsertGrowthTaskAction } from "@/app/admin/actions";

export default async function GrowthTaskPage({
  params
}: {
  params: Promise<{ yearMonth: string; day: string; taskId: string }>;
}) {
  const { yearMonth, day, taskId } = await params;
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
  const admin = await isAdminSession();

  if (!month || !month.isPublic) notFound();

  const dayItem = findGrowthDay(month, day);
  if (!dayItem || !dayItem.isPublic) notFound();

  const task = findGrowthTask(dayItem, taskId);
  if (!task || !task.isPublic) notFound();

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {monthLabel(month.yearMonth)} / {dayLabel(dayItem.day)}
              </p>
              <h1>{task.title}</h1>
              <p>{dayItem.title}</p>
            </div>
            <div className="inline-actions">
              <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}`}>
                返回当天
              </Link>
              <Link className="button" href={`/growth/${month.yearMonth}`}>
                返回月份
              </Link>
            </div>
          </div>

          <article className="admin-panel">
            <div className="meta-row">
              <span>{task.status}</span>
              <strong>进度增量 {task.progressDelta}%</strong>
            </div>
            <ProgressBar value={task.status === "已完成" ? 100 : task.status === "进行中" ? 60 : 25} />
            <div className="task-grid">
              <Link className="task-block section-link" href={taskSectionPath(month.yearMonth, dayItem.day, task.id, "theory")}>
                <p className="eyebrow">理论学习部分</p>
                <p>{taskTheoryContent(task)}</p>
                <div className="meta-row">
                  <span>{task.theoryLinks?.filter((item) => item.isPublic).length || 0} 个学习链接</span>
                  <strong>{taskTheoryProgress(task)}%</strong>
                </div>
                <ProgressBar value={taskTheoryProgress(task)} />
              </Link>
              <Link className="task-block section-link" href={taskSectionPath(month.yearMonth, dayItem.day, task.id, "practice")}>
                <p className="eyebrow">实操部分</p>
                <p>{taskOperationContent(task)}</p>
                <div className="meta-row">
                  <span>{task.practiceProjects?.filter((item) => item.isPublic).length || 0} 个项目实战</span>
                  <strong>{taskOperationProgress(task)}%</strong>
                </div>
                <ProgressBar value={taskOperationProgress(task)} />
              </Link>
              <Link className="task-block section-link" href={taskSectionPath(month.yearMonth, dayItem.day, task.id, "life")}>
                <p className="eyebrow">生活部分</p>
                <p>{taskLifeContent(task)}</p>
                <div className="meta-row">
                  <span>总结 / 运动训练</span>
                  <strong>{taskLifeProgress(task)}%</strong>
                </div>
                <ProgressBar value={taskLifeProgress(task)} />
              </Link>
            </div>
          </article>

          <div className="product-grid">
            <article className="value-card">
              <h3>关联里程碑</h3>
              <p>{task.linkedMilestoneId || "未关联里程碑"}</p>
            </article>
            <article className="value-card">
              <h3>关联产品</h3>
              <p>{task.linkedProductId || "未关联产品"}</p>
            </article>
            <article className="value-card">
              <h3>进度状态</h3>
              <p>{task.progressApplied ? "已同步到关联目标" : "等待完成后同步"}</p>
            </article>
          </div>

          {admin ? (
            <div className="admin-panel">
              <h2>编辑任务</h2>
              <form action={upsertGrowthTaskAction} className="form-grid">
                <input name="yearMonth" type="hidden" defaultValue={month.yearMonth} />
                <input name="day" type="hidden" defaultValue={dayItem.day} />
                <input name="taskId" type="hidden" defaultValue={task.id} />
                <label className="field full">
                  <span>公开展示</span>
                  <input name="isPublic" type="checkbox" defaultChecked={task.isPublic} />
                </label>
                <div className="field full">
                  <label htmlFor="task-edit-title">标题</label>
                  <input id="task-edit-title" name="title" defaultValue={task.title} required />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-status">状态</label>
                  <select id="task-edit-status" name="status" defaultValue={task.status} required>
                    <option value="准备中">准备中</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="task-edit-progressDelta">进度增量</label>
                  <input id="task-edit-progressDelta" name="progressDelta" type="number" min="1" max="100" defaultValue={task.progressDelta} required />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-theoryProgress">理论进度</label>
                  <input id="task-edit-theoryProgress" name="theoryProgress" type="number" min="0" max="100" defaultValue={taskTheoryProgress(task)} required />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-operationProgress">实操进度</label>
                  <input id="task-edit-operationProgress" name="operationProgress" type="number" min="0" max="100" defaultValue={taskOperationProgress(task)} required />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-lifeProgress">生活进度</label>
                  <input id="task-edit-lifeProgress" name="lifeProgress" type="number" min="0" max="100" defaultValue={taskLifeProgress(task)} required />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-fitnessProgress">运动进度</label>
                  <input id="task-edit-fitnessProgress" name="fitnessProgress" type="number" min="0" max="100" defaultValue={task.fitnessProgress ?? 0} required />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-theoryContent">理论学习部分</label>
                  <textarea id="task-edit-theoryContent" name="theoryContent" defaultValue={taskTheoryContent(task)} required />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-operationContent">实操部分</label>
                  <textarea id="task-edit-operationContent" name="operationContent" defaultValue={taskOperationContent(task)} required />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-lifeContent">生活部分</label>
                  <textarea id="task-edit-lifeContent" name="lifeContent" defaultValue={taskLifeContent(task)} required />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-theoryLinksText">学习链接和心得笔记</label>
                  <textarea
                    id="task-edit-theoryLinksText"
                    name="theoryLinksText"
                    defaultValue={(task.theoryLinks || [])
                      .map((link) => {
                        const note = link.notes?.[0];
                        return [link.title, link.url || "", link.progress, note?.title || "心得笔记", note?.content || ""].join(" | ");
                      })
                      .join("\n")}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-practiceProjectsText">项目实战</label>
                  <textarea
                    id="task-edit-practiceProjectsText"
                    name="practiceProjectsText"
                    defaultValue={(task.practiceProjects || [])
                      .map((project) => [project.title, project.url || "", project.progress, project.description, project.reflection].join(" | "))
                      .join("\n")}
                  />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-lifeSummary">每日总结</label>
                  <textarea id="task-edit-lifeSummary" name="lifeSummary" defaultValue={task.lifeSummary || taskLifeContent(task)} />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-fitnessPlan">运动训练健身</label>
                  <textarea id="task-edit-fitnessPlan" name="fitnessPlan" defaultValue={task.fitnessPlan || ""} />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-linkedMilestoneId">关联里程碑</label>
                  <input id="task-edit-linkedMilestoneId" name="linkedMilestoneId" defaultValue={task.linkedMilestoneId || ""} />
                </div>
                <div className="field">
                  <label htmlFor="task-edit-linkedProductId">关联产品</label>
                  <input id="task-edit-linkedProductId" name="linkedProductId" defaultValue={task.linkedProductId || ""} />
                </div>
                <div className="field full">
                  <button className="primary" type="submit">
                    保存任务
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="hero-actions">
            <Link className="button primary" href="/product-progress">
              看产品进展
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link className="button" href="/milestones">
              看里程碑
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
