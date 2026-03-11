"use client";

import { useEffect, useRef } from "react";
import { STACK_ITEMS } from "./data";

export default function Stack() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const items =
      sectionRef.current?.querySelectorAll(".reveal, .stack-item") ?? [];
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

  const delayClass = (i: number) => {
    const mod = i % 4;
    if (mod === 1) return " reveal-d1";
    if (mod === 2) return " reveal-d2";
    if (mod === 3) return " reveal-d3";
    return "";
  };

  return (
    <section className="stack" id="stack" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Tools &amp; Tech</div>
          <h2 className="section-title">My Stack</h2>
        </div>
      </div>
      <div className="stack-grid">
        {STACK_ITEMS.map((item, i) => (
          <div key={item.name} className={`stack-item reveal${delayClass(i)}`}>
            <span className="stack-icon">{item.icon}</span>
            <div className="stack-name">{item.name}</div>
            <div className="stack-type">{item.type}</div>
            <div className="stack-bar">
              <div
                className="stack-bar-fill"
                style={{ width: `${item.proficiency * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
