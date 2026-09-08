import type Project from "../interfaces/project";

// Showcase data for the /projects page. Kept independent of the CV repo by design.
export const PROJECTS: Project[] = [
  {
    slug: "web-security-vulnerability-assessment",
    title: "Web Security Vulnerability Assessment",
    description:
      "Pentesting on live production vulnerabilities. Conducted security assessments and provided mitigation strategies.",
    techStack: ["Pentesting", "Burp Suite", "Nmap", "OWASP ASVS"],
    link: { label: "Pearler", href: "https://www.pearler.com" },
    status: "archived",
  },
  {
    slug: "aws-cloud-data-privacy-compliance",
    title: "Research on AWS Cloud Data Privacy Compliance",
    description:
      "Research project on data protection and compliance, showcased at SECEduCon5 Security Conference (runner-up).",
    techStack: ["AWS", "Security Compliance", "Data Privacy"],
    link: { label: "AWS", href: "https://aws.amazon.com/" },
    status: "archived",
  },
  {
    slug: "llm-powered-conversational-assistant",
    title: "LLM-Powered Conversational Assistant",
    description:
      "Design and development of a secure, scalable conversational AI interface. (Details protected under NDA)",
    techStack: ["JavaScript", "React.js", "Tailwind CSS", "RESTful API"],
    link: { label: "Lorgan", href: "https://www.lorganglobal.com" },
    status: "confidential",
  },
  {
    slug: "bigbrain-quiz-platform",
    title: "BigBrain — Real-Time Quiz Game Platform",
    description:
      "Real-time quiz platform featuring live gameplay and interactive UI using React.js.",
    techStack: ["React", "RESTful API", "WebSockets", "Node.js"],
    link: { label: "UNSW", href: "https://www.unsw.edu.au" },
    status: "active",
  },
];
