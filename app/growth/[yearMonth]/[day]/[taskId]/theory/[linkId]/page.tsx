import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";
import { findGrowthDay, findGrowthMonth, findGrowthTask, findTheoryLink, monthLabel } from "@/lib/growth-data";

export default async function TheoryLinkPage({
  params
}: {
  params: Promise<{ yearMonth: string; day: string; taskId: string; linkId: string }>;
}) {
  const { yearMonth, day, taskId, linkId } = await params;
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
  if (!month || !month.isPublic) notFound();

  const dayItem = findGrowthDay(month, day);
  if (!dayItem || !dayItem.isPublic) notFound();

  const task = findGrowthTask(dayItem, taskId);
  if (!task || !task.isPublic) notFound();

  const link = findTheoryLink(task, linkId);
  if (!link || !link.isPublic) notFound();

  const notes = link.notes.filter((note) => note.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{monthLabel(month.yearMonth)} / 理论学习链接</p>
              <h1>{link.title}</h1>
              <p>{link.description}</p>
            </div>
            <div className="inline-actions">
              {link.url ? (
                <a className="button" href={link.url} target="_blank" rel="noreferrer">
                  打开链接
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ) : null}
              <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}/theory`}>
                返回理论学习
              </Link>
            </div>
          </div>

          <article className="admin-panel">
            <div className="meta-row">
              <span>{link.status}</span>
              <strong>{link.progress}%</strong>
            </div>
            <ProgressBar value={link.progress} />
          </article>

          <div className="month-grid">
            {notes.map((note) => (
              <article className="day-card" key={note.id}>
                <div className="card-head">
                  <div>
                    <p className="eyebrow">{note.status}</p>
                    <h3>{note.title}</h3>
                  </div>
                  <strong>{note.progress}%</strong>
                </div>
                <p>{note.summary}</p>
                <ProgressBar value={note.progress} />
                <Link className="button primary" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}/theory/${link.id}/${note.id}`}>
                  查看笔记
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
