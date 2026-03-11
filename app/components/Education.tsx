"use client";

import { useEffect, useRef } from "react";
import { EDUCATION_ITEMS } from "./data";

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".edu-item") ?? [];
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
    <section className="education" id="education" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Academic Background</div>
          <h2 className="section-title">Education</h2>
        </div>
        <span className="section-meta">{EDUCATION_ITEMS.length} Degrees</span>
      </div>

      <div className="edu-timeline">
        {EDUCATION_ITEMS.map((item, i) => (
          <div key={i} className="edu-item">
            <div className="edu-year">{item.year}</div>
            <div className="edu-content">
              <div className="edu-degree">{item.degree}</div>
              <div className="edu-major">{item.major}</div>
              <div className="edu-meta">
                <span className="edu-institution">{item.institution}</span>
                <span className="edu-sep">·</span>
                <span className="edu-location">{item.location}</span>
              </div>
              {item.desc && <p className="edu-desc">{item.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
