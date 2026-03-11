"use client";

import { useEffect, useRef } from "react";
import { EXPERIENCE_ITEMS, RESEARCH_AREAS } from "./data";

export default function About() {
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

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Who I Am</div>
          <h2 className="section-title">About</h2>
        </div>
      </div>
      <div className="about-inner">
        <div className="about-text reveal">
          <p>
            I&apos;m <strong>YourName</strong>, a Specialist Lecturer at{" "}
            <strong>Universitas XYZ</strong> and an active researcher in{" "}
            <span className="hl">[your field]</span>. My work sits at the
            intersection of academic rigor and real-world engineering — I
            believe good science should ship.
          </p>
          <blockquote>
            &quot;Teaching is how I learn twice. Building is how I verify what I
            teach.&quot;
          </blockquote>
          <p>
            Before academia, I spent years in industry as a full-stack
            developer. That experience shapes how I teach — always grounded,
            always practical, always asking{" "}
            <em>&quot;but does it actually work?&quot;</em>
          </p>
          <p>
            Currently open to{" "}
            <span className="hl">research collaborations</span>, co-authorship,
            and interesting engineering challenges.
          </p>
          <div className="research-areas">
            <div className="research-label">Research Interests</div>
            <div className="area-tags">
              {RESEARCH_AREAS.map((area) => (
                <span key={area} className="area-tag">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="reveal reveal-d1">
          <div className="section-label-tag" style={{ marginBottom: "1rem" }}>
            Experience
          </div>
          <div className="exp-list">
            {EXPERIENCE_ITEMS.map((item) => (
              <div key={item.role} className="exp-item">
                <div>
                  <div className="exp-role">{item.role}</div>
                  <div className="exp-place">{item.place}</div>
                  <p className="exp-desc">{item.desc}</p>
                </div>
                <div className="exp-period">{item.period}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
