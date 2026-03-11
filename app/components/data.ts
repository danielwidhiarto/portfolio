export interface PublicationLink {
  label: string;
  href: string;
}

export interface Publication {
  year: number;
  type: "journal" | "conf";
  title: string;
  authorsHtml: string; // raw HTML string with <strong> for primary author
  venue: string;
  links: PublicationLink[];
}

export interface ProjectTag {
  label: string;
  accent?: boolean;
}

export interface Project {
  num: string;
  name: string;
  desc: string;
  tags: ProjectTag[];
  featured?: boolean;
  visual?: string;
}

export interface StackItem {
  icon: string;
  name: string;
  type: string;
  proficiency: number; // 0–1
}

export interface ExperienceItem {
  role: string;
  place: string;
  desc: string;
  period: string;
}

export interface EducationItem {
  degree: string;
  major: string;
  institution: string;
  location: string;
  year: string;
  desc?: string;
}

export const PUBLICATIONS: Publication[] = [
  {
    year: 2024,
    type: "journal",
    title:
      "Your Most Recent Paper Title: A Deep Study on Something Fascinating",
    authorsHtml: "<strong>YourName</strong>, Co-Author A, Co-Author B",
    venue: "Journal of Something Important, Vol. 12, No. 4, pp. 123–145",
    links: [
      { label: "DOI ↗", href: "#" },
      { label: "PDF ↗", href: "#" },
      { label: "Abstract ↗", href: "#" },
    ],
  },
  {
    year: 2023,
    type: "conf",
    title:
      "Second Paper: Exploring the Relationship Between X and Y in Context Z",
    authorsHtml: "Co-Author A, <strong>YourName</strong>, Co-Author C",
    venue: "Proceedings of ICABC 2023, Bali, Indonesia",
    links: [
      { label: "DOI ↗", href: "#" },
      { label: "Slides ↗", href: "#" },
    ],
  },
  {
    year: 2023,
    type: "journal",
    title: "Third Publication: A Comparative Analysis of Methods for Problem P",
    authorsHtml: "<strong>YourName</strong>, Co-Author D",
    venue: "Indonesian Journal of Computer Science, Vol. 10, No. 2",
    links: [
      { label: "DOI ↗", href: "#" },
      { label: "PDF ↗", href: "#" },
    ],
  },
  {
    year: 2022,
    type: "conf",
    title:
      "Earlier Work: Towards a Framework for Understanding Q in the Context of R",
    authorsHtml: "<strong>YourName</strong>, Co-Author E, Co-Author F",
    venue: "IEEE International Symposium on XYZ (ISXYZ 2022)",
    links: [
      { label: "IEEE Xplore ↗", href: "#" },
      { label: "PDF ↗", href: "#" },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    num: "01 — Featured",
    name: "Orbital Dashboard",
    desc: "Real-time analytics platform with 3D data visualization. Handles 10k+ concurrent users with sub-100ms latency. Built for scale from day one.",
    tags: [
      { label: "Next.js", accent: true },
      { label: "Three.js" },
      { label: "PostgreSQL" },
      { label: "WebSockets" },
    ],
    featured: true,
    visual: "🌐",
  },
  {
    num: "02",
    name: "Flux CMS",
    desc: "Headless CMS with drag-and-drop editor. Markdown-first, live preview, multi-language support out of the box.",
    tags: [
      { label: "React", accent: true },
      { label: "Node.js" },
      { label: "MongoDB" },
    ],
  },
  {
    num: "03",
    name: "Pulse API",
    desc: "High-performance REST & GraphQL layer. Rate limiting, caching, and auto-generated OpenAPI docs baked in.",
    tags: [
      { label: "Go", accent: true },
      { label: "GraphQL" },
      { label: "Redis" },
    ],
  },
  {
    num: "04",
    name: "Waveform",
    desc: "Audio visualizer built with Web Audio API + WebGL. Real-time FFT rendering at 60fps on any device.",
    tags: [
      { label: "WebGL", accent: true },
      { label: "Web Audio API" },
      { label: "Canvas" },
    ],
  },
];

export const STACK_ITEMS: StackItem[] = [
  { icon: "⚛️", name: "React / Next.js", type: "Frontend", proficiency: 0.95 },
  { icon: "🎨", name: "Three.js / R3F", type: "3D / WebGL", proficiency: 0.88 },
  { icon: "🔷", name: "TypeScript", type: "Language", proficiency: 0.9 },
  { icon: "🐍", name: "Python", type: "Research / ML", proficiency: 0.85 },
  { icon: "🟢", name: "Node.js", type: "Backend", proficiency: 0.88 },
  {
    icon: "🧠",
    name: "PyTorch / sklearn",
    type: "Machine Learning",
    proficiency: 0.75,
  },
  { icon: "🌬️", name: "Tailwind CSS", type: "Styling", proficiency: 0.92 },
  { icon: "▲", name: "Vercel", type: "Deployment", proficiency: 0.8 },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    role: "Lecturer Specialist S1",
    place: "Universitas XYZ",
    desc: "Teaching [courses]. Supervising undergraduate theses. Active research in [area].",
    period: "2024 — Now",
  },
  {
    role: "Research Assistant",
    place: "Lab / Institution",
    desc: "Contributed to [projects]. Co-authored multiple publications in [field].",
    period: "2022 — 2024",
  },
  {
    role: "Full-Stack Developer",
    place: "Industry",
    desc: "Built production systems before transitioning to academia. Keeps teaching grounded in real practice.",
    period: "2020 — 2022",
  },
];

export const RESEARCH_AREAS = [
  "Machine Learning",
  "Data Engineering",
  "HCI",
  "Web Technologies",
  "Your Area",
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: "Doctor of Philosophy (Ph.D.)",
    major: "Computer Science",
    institution: "Universitas XYZ",
    location: "Jakarta, Indonesia",
    year: "2020 — 2024",
    desc: "Dissertation focused on [your topic]. Research in [field]. Supervised by Prof. [Name].",
  },
  {
    degree: "Master of Science (M.Sc.)",
    major: "Informatics Engineering",
    institution: "Institut Teknologi ABC",
    location: "Bandung, Indonesia",
    year: "2017 — 2019",
    desc: "Thesis on [topic]. GPA 3.9/4.0. Teaching assistant for Algorithm & Data Structures.",
  },
  {
    degree: "Bachelor of Science (B.Sc.)",
    major: "Computer Science",
    institution: "Universitas DEF",
    location: "Surabaya, Indonesia",
    year: "2013 — 2017",
    desc: "Graduated with honors. Final project on [topic]. Active in student research club.",
  },
];

export const SOCIAL_LINKS = [
  { label: "Google Scholar", href: "#" },
  { label: "ResearchGate", href: "#" },
  { label: "ORCID", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
];
