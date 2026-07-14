import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isAdminSession } from "@/lib/admin-session";
import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";
import { findGrowthMonth, monthLabel, monthOverview, sortGrowthDays } from "@/lib/growth-data";
import { upsertGrowthDayAction, upsertGrowthMonthAction } from "@/app/admin/actions";

export default async function GrowthMonthPage({
  params
}: {
  params: Promise<{ yearMonth: string }>;
}) {
  const { yearMonth } = await params;
  const data = await getPublicData();
  const month = findGrowthMonth(data, yearMonth);
  const admin = await isAdminSession();

  if (!month || !month.isPublic) notFound();

  const days = sortGrowthDays(month.days.filter((item) => item.isPublic));
  const overview = monthOverview(month);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{monthLabel(month.yearMonth)}</p>
              <h1>{month.title}</h1>
              <p>{month.goal}</p>
            </div>
            <Link className="button" href="/growth">
              返回总览
            </Link>
          </div>

          <article className="admin-panel">
            <p className="summary">{month.summary}</p>
            <div className="meta-row">
              <span>{overview.dayCount} 天 · {overview.taskCount} 个任务</span>
              <strong>{month.progress}%</strong>
            </div>
            <ProgressBar value={month.progress} />
          </article>

          {admin ? (
            <div className="admin-panel">
              <h2>编辑月目标</h2>
              <form action={upsertGrowthMonthAction} className="form-grid">
                <input name="monthId" type="hidden" defaultValue={month.id} />
                <input name="yearMonth" type="hidden" defaultValue={month.yearMonth} />
                <div className="field full">
                  <label htmlFor="month-title">标题</label>
                  <input id="month-title" name="title" defaultValue={month.title} required />
                </div>
                <div className="field full">
                  <label htmlFor="month-goal">大目标</label>
                  <input id="month-goal" name="goal" defaultValue={month.goal} required />
                </div>
                <div className="field full">
                  <label htmlFor="month-summary">说明</label>
                  <textarea id="month-summary" name="summary" defaultValue={month.summary} required />
                </div>
                <div className="field">
                  <label htmlFor="month-status">状态</label>
                  <select id="month-status" name="status" defaultValue={month.status} required>
                    <option value="准备中">准备中</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="month-progress">进度</label>
                  <input id="month-progress" name="progress" type="number" min="0" max="100" defaultValue={month.progress} required />
                </div>
                <label className="field full">
                  <span>公开展示</span>
                  <input name="isPublic" type="checkbox" defaultChecked={month.isPublic} />
                </label>
                <div className="field full">
                  <button className="primary" type="submit">
                    保存月目标
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          {admin ? (
            <div className="admin-panel">
              <h2>新增当天</h2>
              <form action={upsertGrowthDayAction} className="form-grid">
                <input name="yearMonth" type="hidden" defaultValue={month.yearMonth} />
                <div className="field">
                  <label htmlFor="day-day">日期</label>
                  <input id="day-day" name="day" placeholder="01" required />
                </div>
                <div className="field">
                  <label htmlFor="day-status">状态</label>
                  <select id="day-status" name="status" defaultValue="准备中" required>
                    <option value="准备中">准备中</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div className="field full">
                  <label htmlFor="day-title">标题</label>
                  <input id="day-title" name="title" required />
                </div>
                <div className="field full">
                  <label htmlFor="day-summary">说明</label>
                  <textarea id="day-summary" name="summary" required />
                </div>
                <div className="field">
                  <label htmlFor="day-progress">进度</label>
                  <input id="day-progress" name="progress" type="number" min="0" max="100" defaultValue="0" required />
                </div>
                <label className="field full">
                  <span>公开展示</span>
                  <input name="isPublic" type="checkbox" defaultChecked />
                </label>
                <div className="field full">
                  <button className="primary" type="submit">
                    保存当天
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <div className="month-grid">
            {days.map((day) => (
              <article className="day-card" key={day.id}>
                <div className="card-head">
                  <div>
                    <p className="eyebrow">{day.date}</p>
                    <h3>{day.title}</h3>
                  </div>
                  <span className="status">{day.status}</span>
                </div>
                <p>{day.summary}</p>
                <div className="meta-row">
                  <span>{day.tasks.filter((item) => item.isPublic).length} 个任务</span>
                  <strong>{day.progress}%</strong>
                </div>
                <Link className="button" href={`/growth/${month.yearMonth}/${day.day}`}>
                  进入当天
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
