import type Author from "./author";

type PostType = {
  slug: string;
  excerpt: string;
  title: string;
  content: string;
  date?: string;
  author?: Author;
  tags?: string[];
  ogImage?: {
    url: string;
  };
};

export default PostType;
