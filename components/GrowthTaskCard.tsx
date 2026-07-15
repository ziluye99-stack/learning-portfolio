import Link from "next/link";
import type { GrowthDay, GrowthTask } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";

export function GrowthTaskCard({
  month,
  day,
  task,
  yearMonth
}: {
  month: string;
  day: GrowthDay;
  task: GrowthTask;
  yearMonth: string;
}) {
  return (
    <article className="log-card">
      <div className="card-head">
        <div>
          <p className="eyebrow">{month} / {day.day}日</p>
          <h3>{task.title}</h3>
        </div>
        <span className="status">{task.status}</span>
      </div>
      <p className="summary">
        理论 / 实操 / 生活 · 进度增量 {task.progressDelta}%
      </p>
      <ProgressBar value={task.status === "已完成" ? 100 : task.status === "进行中" ? 55 : 20} />
      <div className="action-row">
        <Link className="button" href={`/growth/${yearMonth}/${day.day}/${task.id}`}>
          查看详情
        </Link>
      </div>
    </article>
  );
}
