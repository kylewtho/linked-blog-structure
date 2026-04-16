import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkRehype from 'remark-rehype'
import rehypeShiki from '@shikijs/rehype'
import rehypeRewrite from 'rehype-rewrite';
import rehypeStringify from 'rehype-stringify'
import { getLinksMapping, getPostBySlug, getSlugFromHref, updateMarkdownLinks } from './api'
import { renderToStaticMarkup } from "react-dom/server"
import NotePreview from '../components/misc/note-preview'
import { fromHtml } from 'hast-util-from-html'
import { Element, Root } from 'hast'

export async function markdownToHtml(markdown: string, currSlug: string) {
  markdown = updateMarkdownLinks(markdown, currSlug);

  // get mapping of current links
  const links = (getLinksMapping())[currSlug] as string[]
  const linkNodeMapping = new Map<string, Element>();
  for (const l of links) {
    const post = getPostBySlug(l, ['title', 'excerpt']);
    const node = createNoteNode(post.title, post.excerpt)
    linkNodeMapping[l] = node
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(rehypeShiki as any, {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    })
    .use(rehypeRewrite, {
      selector: 'a',
      rewrite: async (node) => rewriteLinkNodes(node, linkNodeMapping, currSlug)
    })
    .use(rehypeStringify)
    .process(markdown)
  let htmlStr = file.toString()
  return htmlStr;
}

export function createNoteNode(title: string, excerpt: string) {
  const htmlStr = renderToStaticMarkup(NotePreview({ title, content: excerpt }))
  const noteNode = fromHtml(htmlStr, { fragment: true }) as Root;
  return noteNode.children[0] as Element;
}

function rewriteLinkNodes (node, linkNodeMapping: Map<string, any>, currSlug) {
  if (node.type === 'element' && node.tagName === 'a') {
    const slug = getSlugFromHref(currSlug, node.properties.href)
    const noteCardNode = linkNodeMapping[slug]
    if (noteCardNode) {
      const anchorNode = {...node}
      anchorNode.properties.className = 'internal-link'
      node.tagName = 'span'
      node.properties = { className: 'internal-link-container' }
      node.children = [
        anchorNode,
        noteCardNode
      ]
    }
  }
}
