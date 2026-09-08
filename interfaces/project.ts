type Project = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  link?: {
    label: string;
    href: string;
  };
  status?: "active" | "archived" | "confidential";
  featured?: boolean;
};

export default Project;
