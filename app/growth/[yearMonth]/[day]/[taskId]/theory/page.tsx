import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";
import {
  dayLabel,
  findGrowthDay,
  findGrowthMonth,
  findGrowthTask,
  monthLabel,
  taskTheoryContent,
  taskTheoryProgress
} from "@/lib/growth-data";

export default async function TheoryPage({
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

  const links = (task.theoryLinks || []).filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {monthLabel(month.yearMonth)} / {dayLabel(dayItem.day)} / {task.title}
              </p>
              <h1>理论学习部分</h1>
              <p>{taskTheoryContent(task)}</p>
            </div>
            <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}`}>
              返回任务
            </Link>
          </div>

          <article className="admin-panel">
            <div className="meta-row">
              <span>{links.length} 个学习链接</span>
              <strong>{taskTheoryProgress(task)}%</strong>
            </div>
            <ProgressBar value={taskTheoryProgress(task)} />
          </article>

          <div className="month-grid">
            {links.map((link) => (
              <article className="day-card" key={link.id}>
                <div className="card-head">
                  <div>
                    <p className="eyebrow">{link.status}</p>
                    <h3>{link.title}</h3>
                  </div>
                  <strong>{link.progress}%</strong>
                </div>
                <p>{link.description}</p>
                <ProgressBar value={link.progress} />
                <div className="meta-row">
                  <span>{link.notes.filter((note) => note.isPublic).length} 篇心得笔记</span>
                  {link.url ? (
                    <a className="button" href={link.url} target="_blank" rel="noreferrer">
                      打开链接
                      <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                <Link className="button primary" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}/theory/${link.id}`}>
                  查看心得库
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
