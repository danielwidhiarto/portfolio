"use client";

import { useEffect, useRef } from "react";
import { PUBLICATIONS, type Publication } from "./data";

function PubItem({ pub }: { pub: Publication }) {
  const itemRef = useRef<HTMLDivElement>(null);

  return (
    <div className="pub-item" ref={itemRef}>
      <div className="pub-year">
        {pub.year}{" "}
        <span className={`pub-badge ${pub.type}`}>
          {pub.type === "journal" ? "Journal" : "Conference"}
        </span>
      </div>
      <div className="pub-title">{pub.title}</div>
      <div
        className="pub-authors"
        dangerouslySetInnerHTML={{ __html: pub.authorsHtml }}
      />
      <div className="pub-venue">{pub.venue}</div>
      <div className="pub-links">
        {pub.links.map((link) => (
          <a key={link.label} className="pub-link" href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Publications() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".pub-item") ?? [];
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

  return (
    <section className="publications" id="publications" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Scholarly Work</div>
          <h2 className="section-title">Publications</h2>
        </div>
        <div className="section-meta">Newest → oldest</div>
      </div>
      <div className="timeline">
        {PUBLICATIONS.map((pub, i) => (
          <PubItem key={i} pub={pub} />
        ))}
      </div>
    </section>
  );
}
