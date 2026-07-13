import Link from "next/link";
import { LogCard } from "@/components/LogCard";
import { getSharedData } from "@/lib/shared-data";

const filters = ["全部", "已完成", "进行中", "前端基础", "作品集搭建"];

export default async function LearningPage({
  searchParams
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const activeFilter = params.filter || "全部";
  const data = await getSharedData();
  const logs = data.dailyLogs.filter((item) => item.isPublic);
  const visibleLogs =
    activeFilter === "全部"
      ? logs
      : logs.filter((item) => item.status === activeFilter || item.phase === activeFilter);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Learning Path</p>
              <h1>每日学习路径</h1>
              <p>按日期记录学习内容、完成进度、实战情况和复盘备注。</p>
            </div>
          </div>
          <div className="filter-row" aria-label="记录筛选">
            {filters.map((filter) => (
              <Link
                className={`button ${activeFilter === filter ? "is-active" : ""}`}
                href={filter === "全部" ? "/learning" : `/learning?filter=${encodeURIComponent(filter)}`}
                key={filter}
              >
                {filter}
              </Link>
            ))}
          </div>
          <div className="log-list">
            {visibleLogs.map((log) => (
              <LogCard log={log} key={log.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
