"use client";

import { useEffect, useRef } from "react";

export default function ScrollHint() {
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      hintRef.current?.classList.toggle("hidden", window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="scroll-hint" ref={hintRef}>
        Scroll
      </div>
      <div className="status-pill">
        <span className="status-dot" />
        Open to collaboration · Indonesia
      </div>
    </>
  );
}
