import Link from "next/link";
import type Author from "../../interfaces/author";
import PostMeta from "./post-meta";

type Props = {
  title: string;
  date?: string;
  excerpt: string;
  author?: Author;
  slug: string;
  tags?: string[];
  onTagClick?: (tag: string) => void;
};

const PostPreview = ({
  title,
  date,
  excerpt,
  author,
  slug,
  tags,
  onTagClick,
}: Props) => {
  return (
    <article className="flex items-center py-4 border-b border-gray-200 dark:border-gray-700 justify-between w-full">
      <div>
        <header>
          <h2 className="h4 mb-2">
            <Link as={`/${slug}`} href="/[...slug]" className="hover:underline">
              {title}
            </Link>
          </h2>
        </header>
        <div className="text-lg text-gray-600 dark:text-gray-400 mb-4 text-ellipsis">
          {excerpt.slice(0, 500)}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
        <footer className="text-sm">
          <PostMeta date={date} author={author} />
        </footer>
      </div>
      <Link as={`/${slug}`} href="/[...slug]" className="block shrink-0 ml-6">
        <span className="sr-only">Read more</span>
        <svg
          className="w-4 h-4 fill-current text-blue-600"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.3 14.7l-1.4-1.4L12.2 9H0V7h12.2L7.9 2.7l1.4-1.4L16 8z" />
        </svg>
      </Link>
    </article>
  );
};

export default PostPreview;
