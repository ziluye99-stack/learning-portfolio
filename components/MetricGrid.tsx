import type { PortfolioStats } from "@/lib/types";

export function MetricGrid({ stats }: { stats: PortfolioStats }) {
  const items = [
    ["记录天数", stats.totalDays],
    ["平均进度", `${stats.averageProgress}%`],
    ["完成记录", stats.finishedLogs],
    ["实战项目", stats.projectCount]
  ];

  return (
    <div className="metrics-grid">
      {items.map(([label, value]) => (
        <article className="metric" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </article>
      ))}
    </div>
  );
}
