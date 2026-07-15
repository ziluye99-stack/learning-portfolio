import Link from "next/link";
import { notFound } from "next/navigation";
import { Dumbbell } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";
import { dayLabel, findGrowthDay, findGrowthMonth, findGrowthTask, monthLabel, taskLifeContent, taskLifeProgress } from "@/lib/growth-data";

export default async function LifePage({
  params
}: {
  params: Promise<{ yearMonth: string; day: string; taskId: string }>;
}) {
  const { yearMonth, day, taskId } = await params;
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
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
                {monthLabel(month.yearMonth)} / {dayLabel(dayItem.day)} / {task.title}
              </p>
              <h1>生活部分</h1>
              <p>{taskLifeContent(task)}</p>
            </div>
            <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}`}>
              返回任务
            </Link>
          </div>

          <div className="product-grid">
            <article className="value-card">
              <h3>每日总结</h3>
              <p>{task.lifeSummary || taskLifeContent(task)}</p>
              <div className="meta-row">
                <span>生活进度</span>
                <strong>{taskLifeProgress(task)}%</strong>
              </div>
              <ProgressBar value={taskLifeProgress(task)} />
            </article>
            <article className="value-card">
              <div className="value-icon">
                <Dumbbell size={18} aria-hidden="true" />
              </div>
              <h3>运动训练健身</h3>
              <p>{task.fitnessPlan || "待编辑运动训练和健身安排。"}</p>
              <div className="meta-row">
                <span>运动进度</span>
                <strong>{task.fitnessProgress ?? 0}%</strong>
              </div>
              <ProgressBar value={task.fitnessProgress ?? 0} />
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
