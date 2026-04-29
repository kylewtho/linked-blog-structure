import Image from "next/image";
import type Author from "../../interfaces/author";
import DateFormatter from "../misc/date-formatter";
import { BLOG_CONFIG } from "../../lib/config";

type Props = {
  author?: Author;
  date?: string;
  readingTime?: string;
};

const PostMeta = ({ author, date, readingTime }: Props) => {
  if (!(author || date)) return null;
  return (
    <div className="flex items-center">
      {author && (
        <div className="flex shrink-0 mr-3">
          <a
            className="relative"
            href={`https://github.com/${BLOG_CONFIG.author.github}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="absolute inset-0 -m-px" aria-hidden="true">
              <span className="absolute inset-0 -m-px bg-white rounded-full" />
            </span>
            <Image
              className="relative rounded-full"
              src={author.picture || author.url || BLOG_CONFIG.author.picture}
              width={32}
              height={32}
              alt="Author"
            />
          </a>
        </div>
      )}
      <div>
        {author && (
          <>
            <span className="text-gray-600">By </span>
            <a
              className="font-medium hover:underline"
              href={`https://github.com/${BLOG_CONFIG.author.github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {author.name}
            </a>
          </>
        )}
        {author && date && <span className="text-gray-600"> · </span>}
        {date && (
          <span className="text-gray-600">
            <DateFormatter dateString={date} />
          </span>
        )}
        {readingTime && <span className="text-gray-600"> · {readingTime}</span>}
      </div>
    </div>
  );
};

export default PostMeta;
