import Link from "next/link";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";
import { findGrowthDay, findGrowthMonth, findGrowthTask, findTheoryLink, findTheoryNote, monthLabel } from "@/lib/growth-data";

export default async function TheoryNotePage({
  params
}: {
  params: Promise<{ yearMonth: string; day: string; taskId: string; linkId: string; noteId: string }>;
}) {
  const { yearMonth, day, taskId, linkId, noteId } = await params;
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
  if (!month || !month.isPublic) notFound();

  const dayItem = findGrowthDay(month, day);
  if (!dayItem || !dayItem.isPublic) notFound();

  const task = findGrowthTask(dayItem, taskId);
  if (!task || !task.isPublic) notFound();

  const link = findTheoryLink(task, linkId);
  if (!link || !link.isPublic) notFound();

  const note = findTheoryNote(link, noteId);
  if (!note || !note.isPublic) notFound();

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{monthLabel(month.yearMonth)} / {link.title}</p>
              <h1>{note.title}</h1>
              <p>{note.summary}</p>
            </div>
            <Link className="button" href={`/growth/${month.yearMonth}/${dayItem.day}/${task.id}/theory/${link.id}`}>
              返回心得库
            </Link>
          </div>

          <article className="admin-panel note-page">
            <div className="meta-row">
              <span>{note.status}</span>
              <strong>{note.progress}%</strong>
            </div>
            <ProgressBar value={note.progress} />
            <div className="note-content">
              {note.content.split("\n").map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
