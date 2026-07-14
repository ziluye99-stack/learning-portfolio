import { ProgressBar } from "@/components/ProgressBar";
import { getPublicData } from "@/lib/public-data";

export default async function MilestonesPage() {
  const data = await getPublicData();
  const milestones = data.milestones.filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Milestones</p>
              <h1>阶段里程碑</h1>
              <p>把长期学习拆成阶段目标，跟踪每个阶段的完成度和下一步。</p>
            </div>
          </div>
          <div className="timeline">
            {milestones.map((item) => (
              <article className="milestone" key={item.id}>
                <div className="timeline-dot" />
                <div className="milestone-body">
                  <div className="card-head">
                    <div>
                      <p className="eyebrow">目标日期 {item.targetDate}</p>
                      <h3>{item.title}</h3>
                    </div>
                    <span className="status">{item.status}</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="meta-row">
                    <span>完成度</span>
                    <strong>{item.progress}%</strong>
                  </div>
                  <ProgressBar value={item.progress} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
