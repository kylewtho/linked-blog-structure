import type Project from "../interfaces/project";

// Showcase data for the /projects pages. Kept independent of the CV and
// linked-blog repos by design — edit this file only.
export const PROJECTS: Project[] = [
  {
    slug: "web-security-vulnerability-assessment",
    title: "Web Security Vulnerability Assessment",
    description:
      "Pentesting on live production vulnerabilities. Conducted security assessments and provided mitigation strategies.",
    techStack: ["Pentesting", "Burp Suite", "Nmap", "OWASP ASVS"],
    category: "Security",
    link: { label: "Pearler", href: "https://www.pearler.com" },
    status: "archived",
  },
  {
    slug: "aws-cloud-data-privacy-compliance",
    title: "Research on AWS Cloud Data Privacy Compliance",
    description:
      "Research project on data protection and compliance, showcased at SECEduCon5 Security Conference (runner-up).",
    techStack: ["AWS", "Security Compliance", "Data Privacy"],
    category: "Research",
    link: { label: "AWS", href: "https://aws.amazon.com/" },
    status: "archived",
  },
  {
    slug: "llm-powered-conversational-assistant",
    title: "LLM-Powered Conversational Assistant",
    description:
      "Design and development of a secure, scalable conversational AI interface. (Details protected under NDA)",
    techStack: ["JavaScript", "React.js", "Tailwind CSS", "RESTful API"],
    category: "Software",
    link: { label: "Lorgan", href: "https://www.lorganglobal.com" },
    status: "confidential",
  },
  {
    slug: "bigbrain-quiz-platform",
    title: "BigBrain — Real-Time Quiz Game Platform",
    description:
      "Real-time quiz platform featuring live gameplay and interactive UI using React.js.",
    techStack: ["React", "RESTful API", "WebSockets", "Node.js"],
    category: "Software",
    link: { label: "UNSW", href: "https://www.unsw.edu.au" },
    status: "archived",
  },
  {
    slug: "pocketledger",
    title: "PocketLedger",
    description:
      "A minimalist multi-currency finance tracker with a Supabase-backed dashboard for accounts and transactions.",
    narrative: [
      "PocketLedger centres on a single dashboard: total balance across every account, with entries typed as income, expense, or adjustment. Currency totals can be viewed grouped by currency or converted into one base currency.",
      "Built on Next.js 15's App Router with TypeScript, Tailwind CSS, and Zod-validated forms, with Supabase (PostgreSQL) as the backing store. The MVP uses shared PIN-protected access rather than full auth, and ships with dark/light mode and a responsive layout.",
    ],
    techStack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase", "Zod"],
    category: "Software",
    link: { label: "GitHub", href: "https://github.com/kylewtho/PocketLedger" },
    status: "in-progress",
  },
  {
    slug: "first-responder-tools",
    title: "First Responder Tools",
    description:
      "A quick-reference, iOS-styled app for first-aid and emergency-response protocols, built alongside volunteering as a St John Ambulance NSW first responder.",
    narrative: [
      "Seven quick-access protocol cards — DRSABCDE, MARCH, Vital Signs, IMIST, Glasgow Coma Scale, Triage Sieve, and METHANE — laid out as a searchable, iOS-style list.",
      "The home screen also surfaces the user's current location on load: reverse-geocoded suburb, town, or city via OpenStreetMap Nominatim, alongside a what3words address that can be copied with one tap or opened directly in Google Maps — useful for relaying a precise location during an incident.",
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    category: "Software",
    link: {
      label: "GitHub",
      href: "https://github.com/kylewtho/responder-cheatsheet",
    },
    status: "active",
  },
  {
    slug: "koe",
    title: "Koe",
    description:
      "A bilingual dialogue-interpreting practice app built for NAATI CPI exam preparation, with turn-by-turn interpreting drills and vocab flashcards.",
    narrative: [
      "Koe drives turn-by-turn interpreting drills, vocabulary flashcards, and exam tips entirely from hand-authored Markdown content, with a roadmap toward supporting further NAATI credentials beyond the CPI (Certified Provisional Interpreter) exam.",
      "Built with Astro and React islands, styled with Tailwind CSS, and deployed to Cloudflare Pages. There's no backend or login — progress is tracked locally per device via localStorage.",
    ],
    techStack: ["Astro", "React", "Tailwind CSS", "Cloudflare Pages"],
    category: "Software",
    link: { label: "GitHub", href: "https://github.com/kylewtho/interp-dojo" },
    status: "in-progress",
  },
];
