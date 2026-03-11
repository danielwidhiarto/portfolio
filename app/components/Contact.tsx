"use client";

import { useEffect, useRef } from "react";
import { SOCIAL_LINKS } from "./data";

export default function Contact() {
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
    <section className="contact" id="contact" ref={sectionRef}>
      <div className="section-header reveal">
        <div>
          <div className="section-label-tag">Let&apos;s Connect</div>
          <h2 className="section-title">Get in Touch</h2>
        </div>
      </div>
      <div className="contact-inner reveal">
        <p className="contact-sub">
          Open to research collaborations, speaking invitations, consulting, and
          interesting conversations. If you&apos;re working on something worth
          doing — reach out.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
          <a className="contact-email" href="mailto:emmanuel.widhiarto@binus.ac.id">
            emmanuel.widhiarto@binus.ac.id
          </a>
          <a className="contact-email" href="mailto:danielwidhiarto@gmail.com" style={{ opacity: 0.8, fontSize: "0.9em" }}>
            danielwidhiarto@gmail.com
          </a>
        </div>
        <div className="social-links">
          {SOCIAL_LINKS.map((link) => (
            <a key={link.label} className="social-link" href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
