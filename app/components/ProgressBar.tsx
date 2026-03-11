"use client";

import { useEffect, useRef } from "react";

export default function ProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      barRef.current.style.transform = `scaleX(${scrolled})`;
      barRef.current.style.width = "100%";
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <div id="progress-bar" ref={barRef} />;
}
