"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import MobileMenu from "./MobileMenu";

const NAV_LINKS = [
  { href: "#about", section: "about", label: "About" },
  { href: "#education", section: "education", label: "Education" },
  { href: "#publications", section: "publications", label: "Publications" },
  { href: "#projects", section: "projects", label: "Projects" },
  { href: "#stack", section: "stack", label: "Stack" },
  { href: "#contact", section: "contact", label: "Contact" },
];

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id]");

    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        {/* <div className="nav-logo">PhD</div> */}
        <div className="nav-logo">ED</div>
        <div className="nav-right">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  data-section={link.section}
                  className={activeSection === link.section ? "active" : ""}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            className="theme-toggle"
            id="themeToggle"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <span className="toggle-icons">
              <span>🌙</span>
              <span>☀️</span>
            </span>
          </button>
          <div
            className={`hamburger${menuOpen ? " open" : ""}`}
            id="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
      </nav>
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
