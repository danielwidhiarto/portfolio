"use client";

import { useEffect, useRef } from "react";

export default function Loader() {
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const LOAD_DURATION = 3000;
    const loadStart = performance.now();

    function stallEase(t: number): number {
      if (t < 0.3) return t * 0.9;
      if (t < 0.5) return 0.27 + (t - 0.3) * 0.4;
      if (t < 0.75) return 0.35 + (t - 0.5) * 1.4;
      return 0.7 + (t - 0.75) * 1.2;
    }

    function tick(now: number) {
      const raw = Math.min((now - loadStart) / LOAD_DURATION, 1);
      const eased = Math.min(stallEase(raw), 1);
      const pctNum = Math.floor(eased * 100);

      if (pctRef.current) pctRef.current.textContent = pctNum + "%";

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        if (pctRef.current) pctRef.current.textContent = "100%";
        setTimeout(() => loaderRef.current?.classList.add("hidden"), 450);
      }
    }

    requestAnimationFrame(tick);
  }, []);

  return (
    <div id="loader" ref={loaderRef}>
      <div className="loader-eyebrow">Portfolio · 2026</div>
      {/* <div className="loader-name">
        Emmanuel Daniel Widhiarto<span>S.Kom</span>
      </div> */}
      <div className="loader-role">
        Lecturer · Researcher · Full-Stack Developer
      </div>
      <div className="loader-bar-wrap">
        <div className="loader-bar-fill" ref={fillRef} />
      </div>
      <div className="loader-pct" ref={pctRef}>
        0%
      </div>
    </div>
  );
}
