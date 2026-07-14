import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isAdminSession } from "@/lib/admin-session";
import { getPublicData } from "@/lib/public-data";
import { dayLabel, findGrowthDay, findGrowthMonth, findGrowthTask, monthLabel } from "@/lib/growth-data";
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
              <section className="task-block">
                <p className="eyebrow">学习内容</p>
                <p>{task.learningContent}</p>
              </section>
              <section className="task-block">
                <p className="eyebrow">实战内容</p>
                <p>{task.practiceContent}</p>
              </section>
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
                <div className="field full">
                  <label htmlFor="task-edit-learningContent">学习内容</label>
                  <textarea id="task-edit-learningContent" name="learningContent" defaultValue={task.learningContent} required />
                </div>
                <div className="field full">
                  <label htmlFor="task-edit-practiceContent">实战内容</label>
                  <textarea id="task-edit-practiceContent" name="practiceContent" defaultValue={task.practiceContent} required />
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
