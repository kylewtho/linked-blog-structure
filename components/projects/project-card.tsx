import Link from "next/link";
import type Project from "../../interfaces/project";

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  active: "Active",
  "in-progress": "In Progress",
  archived: "Archived",
  confidential: "Confidential",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-lg bg-white p-6 shadow-card transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_4px_8px_rgba(0,0,0,0.06),0px_0px_0px_1px_#fafafa] dark:bg-zinc-900 dark:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.1),0px_2px_2px_rgba(255,255,255,0.04)] dark:hover:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.14),0px_4px_8px_rgba(255,255,255,0.05)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs font-medium uppercase tracking-normal text-gray-400 dark:text-gray-500">
          {project.category}
        </span>
        {project.status && (
          <span className="font-mono text-xs font-medium uppercase tracking-normal text-gray-400 dark:text-gray-500">
            {STATUS_LABEL[project.status]}
          </span>
        )}
      </div>

      <h3 className="h4 mb-2">
        <Link href={`/projects/${project.slug}`} className="hover:underline">
          {project.title}
        </Link>
      </h3>

      <p className="mb-4 grow text-base leading-relaxed text-vercel-gray dark:text-gray-400">
        {project.description}
      </p>

      {project.techStack.length > 0 && (
        <ul
          className="mb-4 flex list-none flex-wrap gap-1.5 p-0"
          aria-label="Technologies used"
        >
          {project.techStack.map((tech) => (
            <li key={tech}>
              <span className="inline-block rounded-full bg-[#ebf5ff] px-2.5 py-0.5 text-xs font-medium text-[#0068d6] dark:bg-blue-950 dark:text-blue-300">
                {tech}
              </span>
            </li>
          ))}
        </ul>
      )}

      <Link
        href={`/projects/${project.slug}`}
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[#0072f5] hover:underline"
      >
        View project
        <svg
          className="h-3.5 w-3.5 fill-current transition-transform group-hover:translate-x-0.5"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
        </svg>
      </Link>
    </article>
  );
}

export default ProjectCard;
