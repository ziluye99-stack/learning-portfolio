import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicData } from "@/lib/public-data";
import { monthLabel, monthOverview, sortGrowthMonths } from "@/lib/growth-data";
import { ProgressBar } from "@/components/ProgressBar";

export default async function GrowthPage() {
  const data = await getPublicData();
  const months = sortGrowthMonths(data.growthMonths.filter((item) => item.isPublic));

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Growth Path</p>
              <h1>成长路径</h1>
              <p>按年月 &rarr; 每天 &rarr; 任务 &rarr; 任务详情的方式，记录学习、实战和进度同步。</p>
            </div>
            <Link className="button" href="/admin">
              后台编辑
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="timeline">
            {months.map((month) => {
              const overview = monthOverview(month);
              return (
                <article className="milestone" key={month.id}>
                  <div className="timeline-dot" />
                  <div className="milestone-body">
                    <div className="card-head">
                      <div>
                        <p className="eyebrow">{monthLabel(month.yearMonth)}</p>
                        <h3>{month.title}</h3>
                      </div>
                      <span className="status">{month.status}</span>
                    </div>
                    <p>{month.goal}</p>
                    <p className="summary">{month.summary}</p>
                    <div className="meta-row">
                      <span>{overview.dayCount} 天 · {overview.taskCount} 个任务</span>
                      <strong>{month.progress}%</strong>
                    </div>
                    <ProgressBar value={month.progress} />
                    <Link className="button" href={`/growth/${month.yearMonth}`}>
                      进入 {month.yearMonth}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
