import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getFilesRecursively } from './modules/find-files-recusively.mjs'
import removeMd from 'remove-markdown'
import { BLOG_CONFIG } from './config'

const COMMON_MD_DIR = process.env.COMMON_MD_DIR || './common_md'
const MD_ASSET_DIR = process.env.MD_ASSET_DIR || './public/md_assets'

// Known agent/AI tool file base names — explicit safeguard regardless of casing.
// Add new tools here as needed.
const AGENT_FILE_NAMES = new Set([
  'CLAUDE',   // Anthropic Claude Code (CLAUDE.md, CLAUDE.local.md)
  'AGENTS',   // OpenAI Codex, Google Gemini (AGENTS.md)
  'GEMINI',   // Google Gemini
  'COPILOT',  // GitHub Copilot
  'CURSOR',   // Cursor (.cursorrules — won't appear as .md but included for safety)
  'CODERABBIT', // CodeRabbit
])

// Returns true if a slug should be hidden from the blog feed, RSS, and static paths.
// Two layers of defence:
//   1. All-caps first segment → catches any agent file by convention (CLAUDE.local → 'CLAUDE')
//   2. Explicit AGENT_FILE_NAMES set → catches known tools even if naming changes
//   3. BLOG_CONFIG.blogExcludedSlugs patterns:
//        exact match: 'home'
//        folder wildcard: 'descriptions/*'
//        prefix wildcard: 'CLAUDE*'
export function isExcludedSlug(slug: string): boolean {
  const firstSegment = slug.split(/[./]/)[0]
  if (/^[A-Z]{2,}$/.test(firstSegment)) return true
  if (AGENT_FILE_NAMES.has(firstSegment.toUpperCase())) return true
  return BLOG_CONFIG.blogExcludedSlugs.some((pattern) => {
    if (pattern.endsWith('/*')) return slug.startsWith(pattern.slice(0, -2) + '/')
    if (pattern.endsWith('*')) return slug.startsWith(pattern.slice(0, -1))
    return slug === pattern
  })
}

const mdDir = path.join(process.cwd(), COMMON_MD_DIR)

export function getMDExcerpt(markdown: string, length: number = 500) {
  const text = removeMd(markdown, {
    stripListLeaders: false, 
    gfm: true,
  }) as string
  return text.slice(0, length).trim();
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md(?:#[^\)]*)?$/, '')
  const fullPath = path.join(mdDir, `${realSlug}.md`)
  const data = parseFileToObj(fullPath);

  type Items = {
    [key: string]: string
  }

  const items: Items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })
  return items
}

function parseFileToObj(pathToObj: string) {
  const fileContents = fs.readFileSync(pathToObj, 'utf8')
  let data: Record<string, any> = {}
  let content = fileContents
  try {
    const parsed = matter(fileContents)
    data = parsed.data
    content = parsed.content
  } catch (e) {
    console.warn(`[api] YAML parse error in ${pathToObj}:`, (e as Error).message)
  }

  data['content'] = content

  // modify obj
  if (typeof data['excerpt'] === 'undefined') {
    data['excerpt'] = getMDExcerpt(content, 500);
  }
  if (typeof data['title'] === 'undefined') {
    data['title'] = decodeURI(path.basename(pathToObj, '.md'))
  }
  if (typeof data['date'] === 'object') {
    data['date'] = data['date']?.toISOString()
  } else if (typeof data['date'] !== 'undefined') {
    data['date'] = data['date'].toString()
  }
  return data
}

export function getAllPosts(fields: string[] = []) {
  let files = getFilesRecursively(mdDir, /\.md(?:#[^\)]*)?/);
  let posts = files
    .map((slug) => getPostBySlug(slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getLinksMapping() {
  const linksMapping = new Map<string, string[]>();
  const postsMapping = new Map((getAllPosts(['slug', 'content'])).map(i => [i.slug, i.content]));
  const allSlugs = new Set(postsMapping.keys());
  postsMapping.forEach((content, slug) => {
    const mdLink = /\[[^\[\]]+\]\(([^\(\)]+)\)/g
    const matches = Array.from(content.matchAll(mdLink))
    const linkSlugs = []
    for (var m of matches) {
      const linkSlug = getSlugFromHref(slug, m[1])
      if (allSlugs.has(linkSlug)) {
        linkSlugs.push(linkSlug);
      }
    }
    linksMapping[slug] = linkSlugs
  });
  return linksMapping;
}

export function getSlugFromHref (currSlug: string, href: string) {
  return decodeURI(path.join(...currSlug.split(path.sep).slice(0, -1), href)).replace(/\.md(?:#[^\)]*)?$/, '')
}

export function updateMarkdownLinks(markdown: string, currSlug: string) {
  // convert Obsidian ![[image.ext]] → standard markdown image
  markdown = markdown.replaceAll(/!\[\[([^\[\]]+?)\]\]/g, (_, inner) => {
    const [src, alt = src] = inner.split('|').map((s: string) => s.trim())
    return `![${alt}](${src})`
  })

  // convert Obsidian [[page|Label]] and [[page]] → standard markdown link
  markdown = markdown.replaceAll(/\[\[([^\[\]]+?)\]\]/g, (_, inner) => {
    const [ref, label] = inner.split('|').map((s: string) => s.trim())
    const href = ref.replace(/ /g, '-').toLowerCase() + '.md'
    return `[${label ?? ref}](${href})`
  })

  // remove `.md` from links
  markdown = markdown.replaceAll(/(\[[^\[\]]+\]\([^\(\)]+)(\.md(?:#[^\)]*)?)(\))/g, "$1$3");

  // update image links
  markdown = markdown.replaceAll(/(\[[^\[\]]*\]\()([^\(\)]+)(\))/g, (m, m1, m2: string, m3) => {
    const slugDir = path.join(...currSlug.split(path.sep).slice(0, -1))
    let relLink = m2;
    if (!m2.startsWith(slugDir)) {
      relLink = path.join(slugDir, m2)
    }
    const relAssetDir = path.relative('./public', MD_ASSET_DIR)
    const fileSlugRel = decodeURI(path.join(mdDir, relLink))
    const fileSlugAbs = decodeURI(path.join(mdDir, m2))
    if (fs.existsSync(fileSlugRel)) {
      const imgPath = path.join(relAssetDir, relLink);
      return `${m1}/${imgPath}${m3}`
    } else if (fs.existsSync(fileSlugAbs)) {
      const imgPath = path.join(relAssetDir, m2);
      return `${m1}/${imgPath}${m3}`
    }
    return m;
  });
  return markdown
}
