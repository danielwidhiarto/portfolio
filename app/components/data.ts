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
    year: 2025,
    type: "conf",
    title:
      "Comparative Analysis of Technical Indicators’ Effect on Forecasting Models for LQ45 Stock Prices",
    authorsHtml: "D. K. J. F. Wahyudi, <strong>E. D. Widhiarto</strong>, F. N. Lingga, and A. Chowanda",
    venue: "2025 International Conference on Applied Artificial Intelligence, Data Engineering and Sciences (ICAIDES), Jakarta, Indonesia, pp. 1-6",
    links: [
      { label: "DOI ↗", href: "https://ieeexplore.ieee.org/document/11404059" },
    ],
  },
];

export const PROJECTS: Project[] = [
  {
    num: "01 — Featured",
    name: "Sekpel 13",
    desc: "Sistem Informasi Manajemen Jemaat with real-time charts, face recognition attendance, and automated reports. Built for sector-level church administration.",
    tags: [
      { label: "Next.js 15", accent: true },
      { label: "TypeScript" },
      { label: "Firebase" },
      { label: "Face-api.js" },
    ],
    featured: true,
    visual: "⛪",
  },
  {
    num: "02",
    name: "KPK - Dues Management",
    desc: "Full-stack dues collection system for GPIB Menara Kasih across 14 sectors. Digitizing church financial recaps and member dependent tracking.",
    tags: [
      { label: "Laravel", accent: true },
      { label: "MySQL" },
      { label: "Bootstrap" },
      { label: "mPDF" },
    ],
    visual: "💰",
  },
  {
    num: "03",
    name: "MJ Training Camp",
    desc: "Thesis project for optimizing camp management. Features distinct portals for Admins, Members, and Trainers with automated class scheduling.",
    tags: [
      { label: "Vue.js", accent: true },
      { label: "Spring Boot" },
      { label: "Supabase" },
    ],
    visual: "🏋️",
  },
  {
    num: "04",
    name: "Lingu",
    desc: "Bangkit Academy Capstone. Mobile app for Hanzi writing practice featuring a custom TFLite model with 90% recognition accuracy.",
    tags: [
      { label: "Kotlin", accent: true },
      { label: "TensorFlow Lite" },
      { label: "Firebase" },
    ],
    visual: "✍️",
  },
  {
    num: "05",
    name: "Diary.ly",
    desc: "Personal journaling and mood tracking Android application with community sharing features and emotional trend analysis.",
    tags: [
      { label: "Kotlin", accent: true },
      { label: "Android Studio" },
    ],
    visual: "📔",
  },
];

export const STACK_ITEMS: StackItem[] = [
  { icon: "nextjs", name: "Next.js / React", type: "Frontend", proficiency: 0.95 },
  { icon: "laravel", name: "Laravel / PHP", type: "Backend", proficiency: 0.9 },
  { icon: "springboot", name: "Spring Boot / Java", type: "Backend", proficiency: 0.85 },
  { icon: "kotlin", name: "Kotlin / Android", type: "Mobile", proficiency: 0.88 },
  { icon: "typescript", name: "TypeScript / JS", type: "Language", proficiency: 0.92 },
  { icon: "tensorflow", name: "TensorFlow / ML", type: "Machine Learning", proficiency: 0.82 },
  { icon: "firebase", name: "Firebase", type: "Cloud Services", proficiency: 0.9 },
  { icon: "tailwind", name: "Tailwind / CSS", type: "Styling", proficiency: 0.92 },
];

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    role: "AI Engineer Instructor",
    place: "Coding Camp 2026 (powered by DBS Foundation)",
    desc: "Delivering Instructor Led Training (ILT) on Python, Machine Learning, Deep Learning, NLP, and Generative AI. Mentoring university students on practical AI applications and workforce readiness.",
    period: "Jan 2026 — Now",
  },
  {
    role: "Lecturer Specialist S1",
    place: "Bina Nusantara University",
    desc: "Teaching and mentoring students in the School of Computer Science.",
    period: "Sep 2025 — Now",
  },
  {
    role: "Junior Laboratory Assistant",
    place: "Bina Nusantara University",
    desc: "Mentored 200+ students in C, Java, Python, and Web Development. Achieved 95% satisfaction rate and developed video learning resources.",
    period: "Mar 2023 — Aug 2025",
  },
  {
    role: "Machine Learning Cohort",
    place: "Bangkit Academy (Google, GoTo, Traveloka)",
    desc: "Developed 'Lingu', a Hanzi writing recognition app using Kotlin and TFLite with 90% accuracy. Applied CNN/ANN for predictive modeling.",
    period: "Feb 2024 — Jul 2024",
  },
  {
    role: "Laboratory Assistant (Part-time)",
    place: "Bina Nusantara University",
    desc: "Provided instructional support in Algorithms (C) and Programming (Java). Guided students in web development and database management.",
    period: "Feb 2022 — Feb 2023",
  },
];

export const RESEARCH_AREAS = [
  "Artificial Intelligence",
  "Natural Language Processing",
  "Software Engineering",
  "Deep Learning",
  "Mobile Development",
];

export const EDUCATION_ITEMS: EducationItem[] = [
  {
    degree: "Master of Computer Science",
    major: "Computer Science",
    institution: "Bina Nusantara University",
    location: "Jakarta, Indonesia",
    year: "Sep 2025 — Sep 2026",
    desc: "Currently pursuing a Master's degree in Computer Science.",
  },
  {
    degree: "Bachelor of Business Information Technology",
    major: "Information System",
    institution: "Bina Nusantara University",
    location: "Jakarta, Indonesia",
    year: "Sep 2021 — Feb 2025",
    desc: "Graduated with GPA 3.71. Notable experiences include serving as a Full-Time Software Laboratory Assistant and Scholarship Mentor.",
  },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/danielwidhiarto/" },
  { label: "GitHub", href: "https://github.com/danielwidhiarto" },
  { label: "Google Scholar", href: "https://scholar.google.com/citations?user=cYXRFecAAAAJ&hl=en" },
  { label: "ResearchGate", href: "https://edanielwidhiarto.vercel.app/#contact" },
  { label: "ORCID", href: "https://edanielwidhiarto.vercel.app/#contact" },
];
