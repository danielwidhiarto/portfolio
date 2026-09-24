"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ProjectMap from "./ProjectMap";
import {
  EDUCATION_ITEMS,
  EXPERIENCE_ITEMS,
  PROJECTS,
  PUBLICATIONS,
  RESEARCH_AREAS,
  SOCIAL_LINKS,
  STACK_ITEMS,
  type Project,
} from "./data";

const NAV_ITEMS = [
  { id: "home", label: "Index" },
  { id: "work", label: "Selected work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "stack", label: "Tools" },
  { id: "contact", label: "Contact" },
];

function SectionHeading({
  index,
  eyebrow,
  title,
  summary,
}: {
  index: string;
  eyebrow: string;
  title: string;
  summary?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="section-index">{index}</span>
        <p className="section-eyebrow">{eyebrow}</p>
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        {summary && <p className="section-summary">{summary}</p>}
      </div>
    </div>
  );
}

function ProjectArtwork({
  project,
  index,
  className = "",
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  if (project.featured) {
    return (
      <div className={`project-artwork ${className}`}>
        <Image
          src="/ProjectImage.jpg"
          alt="Preview of the Sekpel 13 management dashboard"
          fill
          sizes="(max-width: 560px) 90vw, (max-width: 780px) 80vw, 40vw"
        />
      </div>
    );
  }

  return (
    <div
      className={`project-artwork project-illustration illustration-${(index % 5) + 1} ${className}`}
      aria-hidden="true"
    >
      <span className="artwork-index">{project.num.slice(0, 2)}</span>
      <span className="artwork-symbol">{project.visual}</span>
      <span className="artwork-label">{project.name}</span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (project: Project) => void;
}) {
  return (
    <button
      type="button"
      className={`project-card${project.featured ? " featured" : ""}`}
      aria-label={`Open ${project.name} project details`}
      onClick={() => onSelect(project)}
    >
      <div className="project-card-content">
        <div className="project-card-topline">
          <span className="project-number">{project.num}</span>
          <span className="project-card-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-description">{project.desc}</p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span
              key={tag.label}
              className={`project-tag${tag.accent ? " accent" : ""}`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>
      <ProjectArtwork project={project} index={index} />
    </button>
  );
}

export default function PortfolioExperience() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    const updateActiveSection = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const marker = window.innerHeight * 0.4;
        let current = "home";
        NAV_ITEMS.forEach(({ id }) => {
          const section = document.getElementById(id);
          if (section && section.getBoundingClientRect().top <= marker) {
            current = id;
          }
        });
        setActiveSection(current);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen && !selectedProject) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    if (selectedProject) dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [menuOpen, selectedProject]);

  const handleNavigation = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a
          className="header-brand"
          href="#home"
          aria-label="Back to the index"
          onClick={handleNavigation}
        >
          <span className="header-monogram">
            ED<span>+</span>W
          </span>
          <span className="header-name">Emmanuel Daniel Widhiarto</span>
        </a>
        <nav className="desktop-navigation" aria-label="Portfolio sections">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={
                activeSection === item.id ? "desktop-nav-link active" : "desktop-nav-link"
              }
              aria-current={
                activeSection === item.id ? "location" : undefined
              }
              onClick={handleNavigation}
            >
              <span className="desktop-nav-number">
                {String(index).padStart(2, "0")}
              </span>
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </header>

      <div
        className={`mobile-navigation${menuOpen ? " open" : ""}`}
        id="mobile-navigation"
        aria-hidden={!menuOpen}
      >
        <p className="mobile-menu-kicker">Navigate the portfolio</p>
        <nav aria-label="Mobile sections">
          {NAV_ITEMS.map((item, index) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavigation}
            >
              <span>{String(index).padStart(2, "0")}</span>
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <main className="portfolio-main">
        <section className="home-section" id="home">
          <div className="page-kicker">
            <span>Portfolio · 2026</span>
            <span>Jakarta, Indonesia</span>
          </div>

          <div className="home-intro">
            <div>
              <p className="eyebrow">
                Lecturer · Researcher · Software Engineer
              </p>
              <h1 className="hero-title">
                Emmanuel Daniel
                <br />
                <span>Widhiarto</span>
              </h1>
            </div>
            <div className="hero-summary">
              <p>
                I research, teach, and build at the intersection of academic
                rigor and real-world software engineering.
              </p>
              <a className="text-link" href="#about">
                A little about me <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="map-heading">
            <div className="map-heading-left">
              <p className="map-section-kicker">Selected work</p>
              <span className="map-project-count">
                {String(PROJECTS.length).padStart(2, "0")} projects
              </span>
            </div>
            <p className="map-help" id="project-map-instructions">
              <span className="map-help-mobile">
                Tap a project · Drag to rotate
              </span>
            </p>
          </div>

          <ProjectMap projects={PROJECTS} onSelect={setSelectedProject} />

          <div className="home-footnote">
            <span>Scroll to explore</span>
            <a href="#work">View the project index ↓</a>
          </div>
        </section>

        <section className="page-section" id="work">
          <SectionHeading
            index="01"
            eyebrow="Selected work"
            title="Projects"
            summary="A selection of systems, research prototypes, and software built for real communities."
          />
          <div className="projects-intro">
            <p>
              Select a project to see its focus and the tools behind it. The
              first project includes a product preview.
            </p>
            <span className="section-meta">
              {String(PROJECTS.length).padStart(2, "0")} entries
            </span>
          </div>
          <div className="project-grid">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.num}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </section>

        <section className="page-section" id="about">
          <SectionHeading
            index="02"
            eyebrow="Profile"
            title="Researching, teaching, building."
          />
          <div className="about-grid">
            <div className="about-copy">
              <p>
                I&apos;m <strong>Emmanuel Daniel Widhiarto</strong>, a Lecturer
                Specialist at <strong>Bina Nusantara University</strong> and a
                researcher focused on artificial intelligence, natural
                language processing, and software engineering. My work bridges
                theoretical research with practical software implementation.
              </p>
              <blockquote className="about-quote">
                &ldquo;Teaching is how I learn twice. Building is how I verify
                what I teach.&rdquo;
              </blockquote>
              <p>
                Before becoming a lecturer, I mentored more than 200 students
                across programming, web and mobile development, and deep
                learning. I&apos;m open to research collaborations,
                co-authorship, and thoughtful engineering challenges.
              </p>
              <div className="research-interests">
                <div className="research-interests-title">
                  Research interests
                </div>
                <div className="interest-list">
                  {RESEARCH_AREAS.map((area) => (
                    <span className="interest-chip" key={area}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="about-aside">
              <div className="about-aside-row">
                <span className="about-aside-label">Practice</span>
                <span className="about-aside-value">
                  Academic research and applied software engineering
                </span>
              </div>
              <div className="about-aside-row">
                <span className="about-aside-label">Focus</span>
                <span className="about-aside-value">
                  AI · NLP · Software Engineering · Education
                </span>
              </div>
              <div className="about-aside-row">
                <span className="about-aside-label">Based in</span>
                <span className="about-aside-value">Jakarta, Indonesia</span>
              </div>
              <div className="about-aside-row">
                <span className="about-aside-label">Currently</span>
                <span className="about-aside-value">
                  Teaching, mentoring, and pursuing a Master&apos;s in Computer
                  Science
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section" id="experience">
          <SectionHeading
            index="03"
            eyebrow="Selected experience"
            title="Work & teaching"
          />
          <div className="experience-list">
            {EXPERIENCE_ITEMS.map((item) => (
              <article
                className="experience-item"
                key={`${item.role}-${item.place}`}
              >
                <span className="experience-period">{item.period}</span>
                <div>
                  <h3 className="experience-role">{item.role}</h3>
                  <div className="experience-place">{item.place}</div>
                  <p className="experience-description">{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section" id="research">
          <SectionHeading
            index="04"
            eyebrow="Scholarly work"
            title="Research"
            summary="Selected publications and the ideas behind them."
          />
          <div className="publication-list">
            {PUBLICATIONS.map((publication) => (
              <article
                className="publication-item"
                key={`${publication.year}-${publication.title}`}
              >
                <div className="publication-year">
                  {publication.year}
                  <span className="publication-type">
                    {publication.type === "journal"
                      ? "Journal"
                      : "Conference"}
                  </span>
                </div>
                <div>
                  <h3 className="publication-title">{publication.title}</h3>
                  <p className="publication-authors">
                    {publication.authorsHtml.replace(/<\/?strong>/g, "")}
                  </p>
                  <p className="publication-venue">{publication.venue}</p>
                  <div className="publication-links">
                    {publication.links.map((link) => (
                      <a
                        className="publication-link"
                        href={link.href}
                        key={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section" id="education">
          <SectionHeading
            index="05"
            eyebrow="Academic background"
            title="Education"
          />
          <div className="education-list">
            {EDUCATION_ITEMS.map((item) => (
              <article
                className="education-item"
                key={`${item.degree}-${item.institution}`}
              >
                <span className="education-year">{item.year}</span>
                <div>
                  <h3 className="education-degree">{item.degree}</h3>
                  <div className="education-institution">
                    {item.institution}
                  </div>
                  <div className="education-meta">
                    {item.major} · {item.location}
                  </div>
                  {item.desc && (
                    <p className="education-description">{item.desc}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section" id="stack">
          <SectionHeading
            index="06"
            eyebrow="Tools & technology"
            title="My toolkit"
            summary="A practical set of tools for research, product development, and teaching."
          />
          <div className="stack-layout">
            <span className="stack-label">Across the stack</span>
            <div className="stack-list">
              {STACK_ITEMS.map((item) => (
                <span className="stack-chip" key={item.name}>
                  <span className="stack-chip-icon" aria-hidden="true">
                    {item.name.slice(0, 1)}
                  </span>
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section" id="contact">
          <SectionHeading
            index="07"
            eyebrow="Get in touch"
            title="Good work starts with a conversation."
          />
          <div className="contact-layout">
            <div>
              <h3 className="contact-title">Let&apos;s make something useful.</h3>
              <p className="contact-description">
                Open to research collaborations, speaking invitations,
                consulting, and interesting engineering problems.
              </p>
            </div>
            <div className="contact-details">
              <span className="contact-label">Email</span>
              <a
                className="contact-email"
                href="mailto:emmanuel.widhiarto@binus.ac.id"
              >
                emmanuel.widhiarto@binus.ac.id
              </a>
              <a
                className="contact-email"
                href="mailto:danielwidhiarto@gmail.com"
              >
                danielwidhiarto@gmail.com
              </a>
              <div className="social-list">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    className="social-link"
                    href={link.href}
                    key={link.label}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http") ? "noreferrer" : undefined
                    }
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <span>© 2026 Emmanuel Daniel Widhiarto</span>
          <span>
            Built with <span>Next.js + Three.js</span>
          </span>
        </footer>
      </main>

      {selectedProject && (
        <div
          className="modal-layer"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <section
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <div className="modal-header">
              <div>
                <p className="section-eyebrow">
                  Project ·{" "}
                  {String(
                    PROJECTS.findIndex(
                      (project) => project.num === selectedProject.num,
                    ) + 1,
                  ).padStart(2, "0")}
                </p>
                <h2 className="modal-heading" id="project-modal-title">
                  {selectedProject.name}
                </h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close project details"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
            </div>
            <ProjectArtwork
              project={selectedProject}
              index={PROJECTS.indexOf(selectedProject)}
              className="modal-artwork"
            />
            <p className="modal-description">{selectedProject.desc}</p>
            <div className="project-tags modal-tags">
              {selectedProject.tags.map((tag) => (
                <span
                  key={tag.label}
                  className={`project-tag${tag.accent ? " accent" : ""}`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
            <div className="modal-footer">
              <span className="modal-footer-note">
                More context available on request.
              </span>
              <a
                className="text-link"
                href="#contact"
                onClick={() => setSelectedProject(null)}
              >
                Discuss a project <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
