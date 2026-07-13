import { ArrowRight } from "lucide-react";
import { getSharedData } from "@/lib/shared-data";

export default async function TutorialsPage() {
  const data = await getSharedData();
  const tutorials = data.tutorials.filter((item) => item.isPublic);
  const categories = Array.from(new Set(tutorials.map((item) => item.category)));

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Tutorials</p>
              <h1>教程链接</h1>
              <p>把常用教程、文档和学习资料集中保存，点击后直接跳转。</p>
            </div>
          </div>
          <div className="project-grid">
            {tutorials.map((item) => (
              <article className="admin-panel" key={item.id}>
                <p className="eyebrow">{item.category}</p>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <a className="button" href={item.url} rel="noreferrer" target="_blank">
                  打开链接
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </article>
            ))}
          </div>
          {categories.length ? (
            <div className="tag-row">
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
