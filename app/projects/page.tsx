import { ProjectCard } from "@/components/ProjectCard";
import { getSharedData } from "@/lib/shared-data";

export default async function ProjectsPage() {
  const data = await getSharedData();
  const projects = data.projects.filter((item) => item.isPublic);

  return (
    <main>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">Projects</p>
              <h1>实战项目</h1>
              <p>把学习内容转化为可展示、可复盘、可继续迭代的项目成果。</p>
            </div>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard project={project} key={project.id} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
