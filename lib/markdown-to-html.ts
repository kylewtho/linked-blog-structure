import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import rehypeImgSize from "rehype-img-size";
import rehypeRewrite from "rehype-rewrite";
import rehypeStringify from "rehype-stringify";
import {
  getLinksMapping,
  getPostBySlug,
  getSlugFromHref,
  updateMarkdownLinks,
} from "./api";
import { renderToStaticMarkup } from "react-dom/server";
import NotePreview from "../components/misc/note-preview";
import { fromHtml } from "hast-util-from-html";
import type { Element, Root } from "hast";

export async function markdownToHtml(markdown: string, currSlug: string) {
  const updatedMarkdown = updateMarkdownLinks(markdown, currSlug);

  // get mapping of current links
  const links = (getLinksMapping()[currSlug] || []) as string[];
  const linkNodeMapping = new Map<string, Element>();
  for (const l of links) {
    const post = getPostBySlug(l, ["title", "excerpt"]);
    const node = createNoteNode(post.title, post.excerpt);
    linkNodeMapping.set(l, node);
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype)
    // biome-ignore lint/suspicious/noExplicitAny: shiki version mismatch
    .use(rehypeShiki as any, {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    })
    .use(rehypeSlug)
    // biome-ignore lint/suspicious/noExplicitAny: plugin type mismatch
    .use(rehypeImgSize as any, { dir: "public" })
    .use(rehypeRewrite, {
      selector: "a",
      rewrite: async (node) =>
        rewriteLinkNodes(node as Element, linkNodeMapping, currSlug),
    })
    .use(rehypeStringify)
    .process(updatedMarkdown);
  const htmlStr = file.toString();
  return htmlStr;
}

export function createNoteNode(title: string, excerpt: string) {
  const htmlStr = renderToStaticMarkup(
    NotePreview({ title, content: excerpt })
  );
  const noteNode = fromHtml(htmlStr, { fragment: true }) as Root;
  return noteNode.children[0] as Element;
}

export type TocItem = { id: string; text: string; level: 2 | 3 };

export function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (!m) continue;
    const level = m[1].length as 2 | 3;
    const text = m[2].replace(/\*\*|__|`/g, "").trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    items.push({ id, text, level });
  }
  return items;
}

function rewriteLinkNodes(
  node: Element,
  linkNodeMapping: Map<string, Element>,
  currSlug: string
) {
  if (node.type === "element" && node.tagName === "a") {
    const href = node.properties?.href as string;
    const slug = getSlugFromHref(currSlug, href);
    const noteCardNode = linkNodeMapping.get(slug);
    if (noteCardNode) {
      const anchorNode = { ...node };
      anchorNode.properties = {
        ...node.properties,
        className: "internal-link",
      };
      node.tagName = "span";
      node.properties = { className: "internal-link-container" };
      node.children = [anchorNode, noteCardNode];
    }
  }
}
