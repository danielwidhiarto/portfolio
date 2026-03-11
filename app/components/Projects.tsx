"use client";

import { useEffect, useRef } from "react";
import { PROJECTS, type Project } from "./data";

function ProjectCard({ project, delay }: { project: Project; delay?: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - rect.left + "px");
      card.style.setProperty("--my", e.clientY - rect.top + "px");
    };
    card.addEventListener("mousemove", handleMouseMove);
    return () => card.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const revealClass = `project-card reveal${project.featured ? " featured" : ""}${delay === 1 ? " reveal-d1" : delay === 2 ? " reveal-d2" : delay === 3 ? " reveal-d3" : ""}`;

  return (
    <div className={revealClass} ref={cardRef}>
      {project.featured ? (
        <>
          <div>
            <div className="proj-top">
              <span className="proj-num">{project.num}</span>
              <span className="proj-arrow">↗</span>
            </div>
            <div className="proj-name">{project.name}</div>
            <p className="proj-desc">{project.desc}</p>
            <div className="proj-tags">
              {project.tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`proj-tag${tag.accent ? " accent" : ""}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </div>
          <div className="featured-visual">{project.visual}</div>
        </>
      ) : (
        <>
          <div className="proj-top">
            <span className="proj-num">{project.num}</span>
            <span className="proj-arrow">↗</span>
          </div>
          <div className="proj-name">{project.name}</div>
          <p className="proj-desc">{project.desc}</p>
          <div className="proj-tags">
            {project.tags.map((tag) => (
              <span
                key={tag.label}
                className={`proj-tag${tag.accent ? " accent" : ""}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".reveal") ?? [];
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const [featured, ...rest] = PROJECTS;

  return (
    <section className="projects" id="projects" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Dev Work</div>
          <h2 className="section-title">Projects</h2>
        </div>
        <div className="section-meta">04 Selected</div>
      </div>
      <div className="projects-grid">
        <ProjectCard project={featured} />
        {rest.map((project, i) => (
          <ProjectCard key={project.num} project={project} delay={i + 1} />
        ))}
      </div>
    </section>
  );
}
