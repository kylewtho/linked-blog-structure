import { useMemo, useState } from "react";
import Layout from "../components/misc/layout";
import ProjectGrid from "../components/projects/project-grid";
import CategoryFilter from "../components/projects/category-filter";
import { NextSeo } from "next-seo";
import { BLOG_CONFIG } from "../lib/config";
import { PROJECTS } from "../lib/projects-data";
import type { ProjectCategory } from "../interfaces/project";

const DESCRIPTION = "Things I've built, broken and occasionally finished.";

export default function Projects() {
  const [active, setActive] = useState<ProjectCategory | "All">("All");

  const categories = useMemo(() => {
    const seen = new Set<ProjectCategory>();
    for (const project of PROJECTS) seen.add(project.category);
    return Array.from(seen);
  }, []);

  const visibleProjects = useMemo(
    () =>
      active === "All"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === active),
    [active]
  );

  return (
    <Layout>
      <NextSeo
        title="Projects"
        description={DESCRIPTION}
        canonical={`${BLOG_CONFIG.siteUrl}/projects`}
        openGraph={{
          title: "Projects",
          description: DESCRIPTION,
          type: "website",
        }}
      />
      <section>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <header className="mx-auto mb-10 max-w-3xl text-center">
              <h1 className="h1 mb-4">Projects</h1>
              <p className="text-lg text-vercel-gray dark:text-gray-400">
                {DESCRIPTION}
              </p>
            </header>

            <CategoryFilter
              categories={categories}
              active={active}
              onChange={setActive}
            />

            <ProjectGrid projects={visibleProjects} />
          </div>
        </div>
      </section>
    </Layout>
  );
}
