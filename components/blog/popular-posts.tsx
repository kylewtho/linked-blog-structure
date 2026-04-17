import Link from "next/link";
import { BLOG_CONFIG } from "../../lib/config";

export default function PopularPosts() {
  const posts = BLOG_CONFIG.featuredPosts;
  if (!posts || posts.length === 0) return null;

  return (
    <div>
      <h4 className="text-lg font-bold leading-snug tracking-tight mb-4">
        Popular Posts
      </h4>
      <ul className="-my-2">
        {posts.map((post) => (
          <li
            className="flex py-2 border-b border-gray-200 dark:border-gray-700"
            key={post.slug}
          >
            <svg
              className="w-4 h-4 shrink-0 fill-current text-gray-400 mt-1 mr-3"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15.686 5.695L10.291.3c-.4-.4-.999-.4-1.399 0s-.4.999 0 1.399l.6.599-6.794 3.697-1-1c-.4-.399-.999-.399-1.398 0-.4.4-.4 1 0 1.4l1.498 1.498 2.398 2.398L.6 13.988 2 15.387l3.696-3.697 3.997 3.996c.5.5 1.199.2 1.398 0 .4-.4.4-.999 0-1.398l-.999-1 3.697-6.694.6.6c.599.6 1.199.2 1.398 0 .3-.4.3-1.1-.1-1.499zM8.493 11.79L4.196 7.494l6.695-3.697 1.298 1.299-3.696 6.694z" />
            </svg>
            <h3 className="font-medium">
              <Link
                href={`/${post.slug}`}
                className="hover:underline text-gray-800 dark:text-gray-200"
              >
                {post.title}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </div>
  );
}
