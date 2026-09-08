import type { ProjectCategory } from "../../interfaces/project";

type Props = {
  categories: ProjectCategory[];
  active: ProjectCategory | "All";
  onChange: (category: ProjectCategory | "All") => void;
};

function pillClass(isActive: boolean) {
  return isActive
    ? "rounded-full bg-vercel-black px-3 py-1 text-sm font-medium text-white dark:bg-white dark:text-vercel-black"
    : "rounded-full px-3 py-1 text-sm font-medium text-vercel-gray shadow-border transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-zinc-800";
}

function CategoryFilter({ categories, active, onChange }: Props) {
  return (
    <fieldset className="mb-10 flex flex-wrap justify-center gap-2 border-0 p-0">
      <legend className="sr-only">Filter projects by category</legend>
      <button
        type="button"
        className={pillClass(active === "All")}
        onClick={() => onChange("All")}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          type="button"
          key={category}
          className={pillClass(active === category)}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </fieldset>
  );
}

export default CategoryFilter;
