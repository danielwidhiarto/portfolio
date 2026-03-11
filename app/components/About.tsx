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
            I&apos;m <strong>Emmanuel Daniel Widhiarto</strong>, a Lecturer Specialist at{" "}
            <strong>Bina Nusantara University</strong> and a researcher focused on{" "}
            <span className="hl">Artificial Intelligence</span>,{" "}
            <span className="hl">NLP</span>, and{" "}
            <span className="hl">Software Engineering</span>. My work bridges the gap
            between theoretical research and practical software implementation.
          </p>
          <blockquote>
            &quot;Teaching is how I learn twice. Building is how I verify what I
            teach.&quot;
          </blockquote>
          <p>
            Before becoming a lecturer, I spent years as a Laboratory Assistant
            and mentor, teaching over 200 students in various programming 
            disciplines — from Web and Mobile development to Deep Learning 
            at Bangkit Academy.
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
