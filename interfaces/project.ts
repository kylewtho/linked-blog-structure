type ProjectCategory = "Security" | "Research" | "Software";

type ProjectStatus = "active" | "in-progress" | "archived" | "confidential";

type Project = {
  slug: string;
  title: string;
  description: string;
  narrative?: string[];
  techStack: string[];
  category: ProjectCategory;
  status?: ProjectStatus;
};

export default Project;
export type { ProjectCategory, ProjectStatus };
