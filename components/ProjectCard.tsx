import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project-card">
      <div className="project-cover">
        <div className="card-head">
          <div>
            <p className="eyebrow">{project.status}</p>
            <h3>{project.name}</h3>
          </div>
        </div>
        <div className="tag-row">
          {project.stack.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="project-body">
        <p>{project.description}</p>
        <div className="tag-row">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <p className="summary">{project.summary}</p>
        <div className="action-row">
          {project.demoUrl ? (
            <Link className="button" href={project.demoUrl}>
              <ExternalLink size={16} aria-hidden="true" />
              查看演示
            </Link>
          ) : null}
          {project.repoUrl ? (
            <Link className="button" href={project.repoUrl}>
              <GitBranch size={16} aria-hidden="true" />
              项目仓库
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
