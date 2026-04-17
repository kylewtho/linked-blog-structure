import { getPostBySlug, getLinksMapping } from "../lib/api";
import { markdownToHtml } from "../lib/markdown-to-html";
import Layout from "../components/misc/layout";
import PostSingle from "../components/blog/post-single";
import { NextSeo } from "next-seo";
import { BLOG_CONFIG } from "../lib/config";
import type PostType from "../interfaces/post";

type Items = {
  title: string;
  excerpt: string;
};

type Props = {
  post: PostType;
  backlinks: { [k: string]: Items };
};

export default function Resources({ post, backlinks }: Props) {
  const description = post.excerpt.slice(0, 155);
  return (
    <Layout>
      <NextSeo
        title="Resources"
        description={description}
        canonical={`${BLOG_CONFIG.siteUrl}/resources`}
        openGraph={{
          title: "Resources",
          description,
          type: "website",
        }}
      />
      <PostSingle
        title={post.title}
        content={post.content}
        date={post.date}
        author={post.author}
        backlinks={backlinks}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const post = await getPostBySlug("resources", [
    "title",
    "excerpt",
    "date",
    "slug",
    "author",
    "content",
  ]);
  const content = await markdownToHtml(post.content || "", "resources");
  const linkMapping = await getLinksMapping();
  const backlinks = Object.keys(linkMapping).filter(
    (k) => linkMapping[k].includes("resources") && k !== "resources"
  );
  const backlinkNodes = Object.fromEntries(
    await Promise.all(
      backlinks.map(async (slug) => {
        const p = await getPostBySlug(slug, ["title", "excerpt"]);
        return [slug, p];
      })
    )
  );

  return {
    props: {
      post: { ...post, content },
      backlinks: backlinkNodes,
    },
  };
}
