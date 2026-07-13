import type { DailyLog } from "@/lib/types";
import { ProgressBar } from "@/components/ProgressBar";

export function LogCard({ log }: { log: DailyLog }) {
  return (
    <article className="log-card">
      <div className="card-head">
        <div>
          <time>{log.date}</time>
          <h3>{log.title}</h3>
        </div>
        <span className="status">{log.status}</span>
      </div>
      <div className="meta-row">
        <span>{log.phase}</span>
        <span>{log.progress}%</span>
      </div>
      <ProgressBar value={log.progress} />
      <dl className="log-detail">
        <div>
          <dt>学习路径</dt>
          <dd>{log.learned}</dd>
        </div>
        <div>
          <dt>实战情况</dt>
          <dd>{log.practice}</dd>
        </div>
        <div>
          <dt>复盘</dt>
          <dd>{log.reflection}</dd>
        </div>
      </dl>
    </article>
  );
}
