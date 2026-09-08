import Link from "next/link";
import { NextSeo } from "next-seo";
import Layout from "../../components/misc/layout";
import { BLOG_CONFIG } from "../../lib/config";
import { PROJECTS } from "../../lib/projects-data";
import type Project from "../../interfaces/project";

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  active: "Active",
  "in-progress": "In Progress",
  archived: "Archived",
  confidential: "Confidential",
};

type Props = {
  project: Project;
};

export default function ProjectDetail({ project }: Props) {
  const description = project.description.slice(0, 155);

  return (
    <Layout>
      <NextSeo
        title={project.title}
        description={description}
        canonical={`${BLOG_CONFIG.siteUrl}/projects/${project.slug}`}
        openGraph={{
          title: project.title,
          description,
          type: "website",
        }}
      />
      <section>
        <div className="mx-auto max-w-3xl px-4 pt-32 pb-20 sm:px-6 md:pt-40">
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-[#0072f5] hover:underline"
          >
            <svg
              className="h-3.5 w-3.5 rotate-180 fill-current"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
            </svg>
            All projects
          </Link>

          <div className="mb-3 flex items-center gap-3">
            <span className="font-mono text-xs font-medium uppercase tracking-normal text-gray-400 dark:text-gray-500">
              {project.category}
            </span>
            {project.status && (
              <>
                <span className="text-gray-300 dark:text-gray-700">·</span>
                <span className="font-mono text-xs font-medium uppercase tracking-normal text-gray-400 dark:text-gray-500">
                  {STATUS_LABEL[project.status]}
                </span>
              </>
            )}
          </div>

          <h1 className="h1 mb-6">{project.title}</h1>

          <p className="mb-6 text-xl leading-relaxed text-vercel-gray dark:text-gray-400">
            {project.description}
          </p>

          {project.narrative?.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {paragraph}
            </p>
          ))}

          {project.techStack.length > 0 && (
            <ul
              className="my-6 flex list-none flex-wrap gap-1.5 p-0"
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

          {project.link && (
            <a
              href={project.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center rounded-md bg-vercel-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-vercel-black"
            >
              View {project.link.label}
            </a>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) {
    return { notFound: true };
  }
  return { props: { project } };
}

export async function getStaticPaths() {
  return {
    paths: PROJECTS.map((project) => ({ params: { slug: project.slug } })),
    fallback: false,
  };
}
