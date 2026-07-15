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
  taskOperationContent,
  taskOperationProgress
} from "@/lib/growth-data";

export default async function PracticePage({
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

  const projects = (task.practiceProjects || []).filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">
                {monthLabel(month.yearMonth)} / {dayLabel(dayItem.day)} / {task.title}
              </p>
              <h1>实操部分</h1>
              <p>{taskOperationContent(task)}</p>
            </div>
            <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}`}>
              返回任务
            </Link>
          </div>

          <article className="admin-panel">
            <div className="meta-row">
              <span>{projects.length} 个项目实战</span>
              <strong>{taskOperationProgress(task)}%</strong>
            </div>
            <ProgressBar value={taskOperationProgress(task)} />
          </article>

          <div className="month-grid">
            {projects.map((project) => (
              <article className="day-card" key={project.id}>
                <div className="card-head">
                  <div>
                    <p className="eyebrow">{project.status}</p>
                    <h3>{project.title}</h3>
                  </div>
                  <strong>{project.progress}%</strong>
                </div>
                <p>{project.description}</p>
                <ProgressBar value={project.progress} />
                <p className="summary">{project.reflection}</p>
                {project.url ? (
                  <a className="button" href={project.url} target="_blank" rel="noreferrer">
                    打开项目
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
