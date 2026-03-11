"use client";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINKS = [
  { href: "#publications", label: "Publications" },
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <div className={`mobile-menu${isOpen ? " open" : ""}`} id="mobileMenu">
      {NAV_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="mob-link"
          onClick={onClose}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}
