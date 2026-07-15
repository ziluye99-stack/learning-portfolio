import Link from "next/link";
import { ArrowRight, CheckCircle2, Play, Target, Workflow } from "lucide-react";
import { getPublicData } from "@/lib/public-data";

const solutionCards = [
  {
    title: "每天学了什么难复盘",
    copy: "成长路径按年月、日期、任务和详情四层记录，后面回看时能直接找到理论学习、实操和生活安排。"
  },
  {
    title: "实战和产品进展脱节",
    copy: "每个任务可以关联产品和里程碑，完成并通过后只累计一次进度，避免手动重复计算。"
  },
  {
    title: "对外展示没有重点",
    copy: "首页用宣传动效、问题说明和产品入口，把个人学习记录变成能解释价值的作品展示页。"
  }
];

const promoSteps = ["月目标", "每日任务", "实战验证", "产品进度"];

export default async function HomePage() {
  const data = await getPublicData();
  const product = data.products.find((item) => item.isPublic) || data.products[0];
  const milestone = data.milestones.find((item) => item.isPublic) || data.milestones[0];

  return (
    <main>
      <section className="section intro-hero">
        <div className="container intro-grid">
          <div className="hero-copy">
            <p className="eyebrow">首页 / 介绍页</p>
            <h1>{data.profile.title}</h1>
            <p className="lead">{data.profile.summary}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/growth">
                <Play size={18} aria-hidden="true" />
                查看成长路径
              </Link>
              <Link className="button" href="/product-progress">
                产品进展
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="promo-stage" aria-label="产品宣传动画">
            <div className="promo-screen">
              <div className="promo-screen-top">
                <span className="promo-dot" />
                <span>{product?.name || "创业产品"}</span>
              </div>
              <div className="promo-canvas">
                <div className="promo-ring" />
                <div className="promo-core">
                  <Workflow size={26} aria-hidden="true" />
                  <strong>成长工作台</strong>
                  <span>学习驱动产品</span>
                </div>
                <div className="promo-card promo-card-top">
                  <strong>{product?.tagline || "把成长站做成真正可用的产品"}</strong>
                  <span>{product?.status || "演示中"}</span>
                </div>
                <div className="promo-card promo-card-left">
                  <p>学习输入</p>
                  <strong>年月 / 日期 / 任务 / 详情</strong>
                </div>
                <div className="promo-card promo-card-right">
                  <p>产品输出</p>
                  <strong>{product?.progress ?? 0}%</strong>
                </div>
                <div className="promo-card promo-card-bottom">
                  <p>里程碑</p>
                  <strong>{milestone?.progress ?? 0}%</strong>
                </div>
                <div className="promo-flow" aria-hidden="true">
                  {promoSteps.map((step) => (
                    <span key={step}>{step}</span>
                  ))}
                </div>
                <div className="promo-timeline">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">解决的问题</p>
              <h2>把学习、实战和创业产品放到同一条线上</h2>
            </div>
            <p>首页负责讲清价值，成长路径负责拆任务，里程碑负责阶段目标，产品进展负责最终交付。</p>
          </div>
          <div className="value-grid">
            {solutionCards.map((card, index) => (
              <article className="value-card" key={card.title}>
                <div className="value-icon">
                  {index === 0 ? <Target size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
                </div>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container content-grid">
          <article className="admin-panel">
            <p className="eyebrow">当前产品</p>
            <h2>{product?.name || "创业产品"}</h2>
            <p>{product?.problem || "等待补充产品问题描述。"}</p>
            <p className="summary">{product?.solution || "等待补充产品解决方案。"}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/product-progress">
                查看产品进展
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link className="button" href="/milestones">
                查看里程碑
              </Link>
            </div>
          </article>

          <aside className="side-panel">
            <div className="focus-panel">
              <p className="eyebrow">最近里程碑</p>
              <h3>{milestone?.title || "尚未设置里程碑"}</h3>
              <p>{milestone?.description || "在里程碑页设置你的阶段目标。"}</p>
            </div>
            <div className="admin-panel">
              <p className="eyebrow">快速入口</p>
              <h3>继续向下看</h3>
              <div className="tag-row">
                <Link className="button" href="/growth">
                  成长路径
                </Link>
                <Link className="button" href="/milestones">
                  里程碑
                </Link>
                <Link className="button" href="/product-progress">
                  产品进展
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
