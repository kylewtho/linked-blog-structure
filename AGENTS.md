# AGENTS.md — linked-blog-structure

> **For AI agents (Claude, Gemini, Codex, etc.):** This is the canonical task file for Kyle's personal blog. Read this file in full before making changes. Each task lists the exact files to touch and what the result should look like. Mark tasks complete by changing `[ ]` to `[x]`. Do not modify files outside the scope of the task you are executing.

---

## Project Overview

**Repository Architecture:**
- **`linked-blog-structure`** (this repo): The Next.js website engine. Contains the code, components, and layout logic.
- **`linked-blog`**: The content repository. Contains the raw Obsidian markdown files in `publish/`. Pushing to this repo triggers a GitHub workflow that exports and syncs content to `linked-blog-structure`.

**Development Environment & Content:**
- **`linked-blog-structure/common_md/`**: This is a **template content folder** for the development environment. It contains demo files for various features (dates, images, code blocks, hashtags, etc.). Use this folder to verify the visual outcome of new features. When implementing a new adjustable feature, add a corresponding demo file here.
- **`linked-blog/publish/`**: This is the **actual blog storage**. Do not modify files here unless explicitly requested. Content is synced from here to `common_md/` during the build process, but for local development, `common_md/` serves as the primary sandbox.

Kyle's personal blog and digital garden. Built on Next.js 15 + Tailwind CSS.

**Live URL:** `https://kyleho.net`  
**Owner:** Kyle (GitHub: `kylewtho`, X: `@kylewtho`)  
**Stack:** Next.js 15.5.9 · React 18 · Tailwind CSS 3 · TypeScript · `next-seo`

---

## Git Workflow

Always `git pull` before starting work. Commit and `git push` when done.

---

## Build Pipeline

Content flows in via GitHub Actions on every push to `linked-blog`:
1. `obsidian-export` converts `publish/` from Obsidian markdown to standard markdown
2. Output is copied into `common_md/` in this repo
3. Vercel deploys the result

`common_md/` is auto-generated in production — **do not edit it manually in the production branch**.

---

## Formatter & Linter

This project uses **Biome** for fast formatting and linting.

**Agent Requirement:** Always run the formatter and linter before completing a task that modifies code:
- `npm run format` — Formats code using Biome
- `npm run lint` — Runs Biome linter and applies safe fixes

Biome is configured in `biome.json` and is integrated with the VCS (git) to respect ignore files.

---

## Important Notes

- **Do not change the structure of this repo** — the rendering pipeline is stable and intentional
- Layout and component changes require care — they affect every page on the site
- Run `npm install` before starting the dev server on a new machine
- Dev server: `npm run dev`

---

## SEO Policy

**This blog is intentionally not indexed by search engines until further notice.**

- Do not add a `sitemap.xml` route
- Do not add `robots.txt` with `Allow` rules
- Do not add JSON-LD structured data
- Do not add canonical hints aimed at crawlers beyond what already exists

When Kyle decides to go public, the tasks to enable SEO are: sitemap, robots.txt, JSON-LD `Article` schema on `[...slug].tsx`, and verifying `next-seo.config.ts` OG defaults. Until then, skip all SEO work.

---

## Repository Map (key files only)

```
linked-blog-structure/
├── common_md/            ← Template/Demo content for dev environment
│   └── home.md           ← Landing page content (edited by Kyle in Obsidian)
├── components/
│   ├── blog/
│   │   ├── post-single.tsx     ← Individual post view
│   │   ├── post-preview.tsx    ← Post card used in feed/lists
│   │   ├── post-meta.tsx       ← Author + date display
│   │   └── post-body.tsx       ← Renders HTML content
│   └── misc/
│       ├── header.tsx          ← Site header (uses BLOG_CONFIG)
│       ├── footer.tsx          ← Site footer (⚠ still hardcoded)
│       ├── layout.tsx          ← Page wrapper (header + footer)
│       ├── backlinks.tsx       ← Obsidian backlinks sidebar
│       └── search.tsx          ← Full-text search modal
├── lib/
│   ├── config.ts         ← Central config (BLOG_CONFIG) — single source of truth for site metadata
│   ├── api.ts            ← getAllPosts(), getPostBySlug(), getLinksMapping()
│   └── markdownToHtml.ts ← Markdown → HTML pipeline
├── pages/
│   ├── _app.tsx          ← App wrapper, DefaultSeo
│   ├── [...slug].tsx     ← All post/note pages
│   └── api/              ← API routes
├── next-seo.config.ts    ← SEO defaults
└── next.config.js        ← ⚠ Has permanent redirect / → /home (to be removed)
```

---

## Developer Notes for Agents

### Routing Precedence — Safe to Add Concrete Pages

Next.js resolves routes in this order: **concrete routes first, catch-all last.**

```
GET /          → pages/index.tsx        (concrete, wins)
GET /blog      → pages/blog.tsx         (concrete, wins)
GET /home      → pages/[...slug].tsx    (no concrete match, catch-all handles it)
GET /some-note → pages/[...slug].tsx    (no concrete match, catch-all handles it)
```

Adding `pages/index.tsx` or `pages/blog.tsx` does **not** conflict with `[...slug].tsx`. The catch-all simply never sees `/` or `/blog`. The claim that static asset requests (`/_next/static/**`) can fall into the catch-all is false — Next.js serves them at the framework layer before any page routing.

### Reserved Slugs — Keep `RESERVED_SLUGS` in Sync

`pages/[...slug].tsx` has a `RESERVED_SLUGS` set near the bottom of the file. Any slug listed there is excluded from `getStaticPaths` so it doesn't conflict with a concrete page file.

**Current reserved slugs:** `blog`

**Rule:** When adding a new concrete page (e.g. `pages/tags.tsx` → `/tags`), add the corresponding slug to `RESERVED_SLUGS` if a markdown file with that name exists in the content repo. Failing to do this causes a "Conflicting paths returned from getStaticPaths" build error.

The content repo (`linked-blog`) has `publish/blog.md` — this is superseded by `pages/blog.tsx` and is intentionally excluded.

---

### Clear `.next` After Structural Changes

**Always run `rm -rf .next` before restarting the dev server after:**
- Adding or removing a page file
- Modifying `next.config.js`
- Changing the routing structure in any way

Changing `next.config.js` while `next dev` is running corrupts the manifests (`pages-manifest.json`, `routes-manifest.json`) and produces stale chunk errors (`Cannot find module './341.js'`). These are cache artifacts, not code bugs. The fix is always:

```bash
rm -rf .next && npm run dev
```

Do not attempt to diagnose routing errors until the cache has been cleared.

---

### Security Audit (2026-04-17)

- **XSS Risk**: Low. The project uses `dangerouslySetInnerHTML` in `components/blog/post-body.tsx`. Since all markdown content is authored by the owner (Kyle), the risk of malicious injection is negligible. Any future sanitization should ensure it doesn't break the rendering of custom UI components like `NotePreview` (internal link cards).
- **Path Traversal**: Low-risk / Ignored. Core `getPostBySlug` in `lib/api.ts` resolves slugs against the `common_md` directory. In a static build environment (Vercel), there is no runtime exposure to traversal attacks.

---

## Central Config (`lib/config.ts`)

All site-wide values live here. Agents must read this file before hardcoding any URLs, names, or links. Components should import from here rather than using inline strings.

---

## Phase 1: Identity & Cleanup

### 1.1 Fix `lib/config.ts` — Wrong Handles
**Status:** `[x]`  
**Files:** `lib/config.ts`

**Issues:**
- `author.twitter` is `"@kylewtho"` ✓ (correct)
- `author.github` is `"kylewtho"` ✓ (correct)
- `footerLinks[0].href` is `"https://twitter.com/kyleho"` ← **wrong**, should be `https://x.com/kylewtho`
- `footerLinks[1].href` is `"https://github.com/kyleho"` ← **wrong**, should be `https://github.com/kylewtho`

**Fix:** Update `footerLinks` in `BLOG_CONFIG`:
```ts
footerLinks: [
  { name: "X", href: "https://x.com/kylewtho" },
  { name: "GitHub", href: "https://github.com/kylewtho" },
  { name: "LinkedIn", href: "https://linkedin.com/in/kylewtho" },
],
```

Also add a `featuredPosts` array (used by the blog sidebar in Phase 2):
```ts
featuredPosts: [] as { slug: string; title: string }[],
// Kyle fills this in manually with post slugs after content is published
```

**Acceptance:** `lib/config.ts` compiles, all handles are `kylewtho`, `featuredPosts` field exists.

---

### 1.2 Fix `components/misc/footer.tsx` — Hardcoded & Broken Links
**Status:** `[x]`  
**Files:** `components/misc/footer.tsx`  
**Depends on:** 1.1

**Issues:**
1. Not using `BLOG_CONFIG` — all links are hardcoded
2. `aria-label="Cruip"` on the logo link (Cruip is the original template maker)
3. `aria-label="LinkedIn"` is on the Facebook link (wrong label)
4. Terms / Privacy Policy / FAQ links use `href="[...slug]"` pattern pointing to non-existent markdown files — these are 404s
5. The footer currently shows social icons for: Website, GitHub, Facebook, X. Facebook should be replaced with LinkedIn (or removed) to match `BLOG_CONFIG.footerLinks`

**Fix:**
- Import `BLOG_CONFIG` from `../../lib/config`
- Replace the hardcoded social links block with a map over `BLOG_CONFIG.footerLinks`
- Change `aria-label="Cruip"` to `aria-label={BLOG_CONFIG.title}`
- Remove the Terms / Privacy Policy / FAQ links entirely (replace with just copyright)
- Keep the existing SVG icons but map them by link name (GitHub → GitHub SVG, X → X SVG, LinkedIn → LinkedIn SVG)

**Acceptance:** Footer renders `BLOG_CONFIG.footerLinks` dynamically, no hardcoded social URLs remain, no "Cruip" references, no 404 links.

---

### 1.3 Fix `components/blog/post-meta.tsx` — Dead Author Links
**Status:** `[x]`  
**Files:** `components/blog/post-meta.tsx`  
**Depends on:** 1.1

**Issue:** Author `<a>` tag uses `href="#0"` on both lines 19 and 29 — these are dead placeholder links from the original template.

**Fix:** Import `BLOG_CONFIG` and use `BLOG_CONFIG.author.github` for the author link:
```tsx
// Replace href="#0" with:
href={`https://github.com/${BLOG_CONFIG.author.github}`}
```
Set `target="_blank" rel="noopener noreferrer"` on the link.

**Acceptance:** Clicking the author avatar/name opens Kyle's GitHub profile. No `href="#0"` remains.

---

### 1.4 Update `common_md/home.md` — Replace Template Content
**Status:** `[x]` *(Kyle does this manually in Obsidian)*  
**Files:** `common_md/home.md`

**Issue:** `home.md` currently contains the original linked-blog-starter template documentation. This file is Kyle's personal landing page.

**Action (for Kyle):** Replace the content with a personal self-introduction. Suggested structure:
- Short bio (who you are, what you study/work on)
- What this blog is about (cyber, tech, code notes)
- A few featured links or recent interests
- Contact / social links

The frontmatter should be:
```yaml
---
title: Kyle Ho
excerpt: Software engineer, UNSW Master of IT (Cyber Security). Writing about tech, security, and things I'm learning.
---
```

**Acceptance:** Visiting `/` shows Kyle's personal introduction, not linked-blog-starter docs.

---

## Phase 2: Architecture

### 2.1 Create `pages/index.tsx` — Custom Landing Page
**Status:** `[x]`  
**Files:** `pages/index.tsx` *(new file)*  
**Depends on:** 1.4 (content), but can be built with placeholder content

**Goal:** Replace the `/` → `/home` redirect with a real page that renders `home.md` through a custom layout — more "about me" styled, not a standard blog post.

**Implementation:**

```tsx
// pages/index.tsx
import { getPostBySlug } from '../lib/api'
import { markdownToHtml } from '../lib/markdownToHtml'
import Layout from '../components/misc/layout'
import PostBody from '../components/blog/post-body'
import { NextSeo } from 'next-seo'
import { BLOG_CONFIG } from '../lib/config'

type Props = {
  content: string
  title: string
  excerpt: string
}

export default function Home({ content, title, excerpt }: Props) {
  return (
    <Layout>
      <NextSeo
        title={title}
        description={excerpt}
        canonical={BLOG_CONFIG.siteUrl + '/'}
      />
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="max-w-3xl mx-auto">
              <PostBody content={content} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const post = await getPostBySlug('home', ['title', 'excerpt', 'content'])
  const content = await markdownToHtml(post.content || '', 'home')
  return {
    props: {
      content,
      title: post.title,
      excerpt: post.excerpt,
    },
  }
}
```

**Acceptance:** `GET /` returns a 200 with Kyle's home.md content. No redirect occurs. The page has correct `<title>` and canonical URL.

---

### 2.2 Remove `/` → `/home` Redirect
**Status:** `[x]`  
**Files:** `next.config.js`  
**Depends on:** 2.1 (must exist first — do not do this before index.tsx is in place)

**Fix:** Remove the `redirects()` block entirely from `next.config.js`.

The result should be:
```js
module.exports = {}
```

Or if other config is needed in future, keep the export but without redirects.

**Note:** The `/home` route will still work via `[...slug].tsx` — it just won't be the forced destination of `/` anymore. Old links to `/home` remain valid.

**Acceptance:** `GET /` renders the landing page. `GET /home` still works. No redirect in network tab.

---

### 2.3 Create `pages/blog.tsx` — Blog Feed
**Status:** `[x]`  
**Files:** `pages/blog.tsx` *(new file)*, `components/blog/post-list.tsx` *(new file)*  
**Depends on:** 1.1 (for `BLOG_CONFIG.featuredPosts`)

**Goal:** A dedicated `/blog` page listing all posts in reverse-chronological order with a sidebar showing featured posts.

**`components/blog/post-list.tsx`:**
- Props: `posts: Post[]`
- Renders a list of `<PostPreview>` components
- Sidebar: "Featured Posts" list from `BLOG_CONFIG.featuredPosts`
- Pagination: show 10 posts per page, use URL query param `?page=N` (handled via `getStaticProps` is not possible for query params — use client-side `useState` with `useMemo` to slice the posts array)

**`pages/blog.tsx`:**
```tsx
// Fetches all posts at build time, passes to PostList
export async function getStaticProps() {
  const posts = await getAllPosts(['slug', 'title', 'date', 'excerpt', 'author'])
  return { props: { posts } }
}
```

SEO: `<NextSeo title="Blog" description="All posts and notes by Kyle." canonical={BLOG_CONFIG.siteUrl + '/blog'} />`

**Acceptance:** `GET /blog` renders a paginated list of all posts. Featured sidebar renders from `BLOG_CONFIG.featuredPosts`. Pagination works client-side.

---

### 2.4 Add Canonical URLs to `[...slug].tsx`
**Status:** `[x]`  
**Files:** `pages/[...slug].tsx`

**Issue:** `NextSeo` on line 34 has no `canonical` prop, which can cause duplicate-content issues for posts accessible at multiple paths.

**Fix:** Add canonical to the `NextSeo` config:
```tsx
canonical={`${BLOG_CONFIG.siteUrl}/${post.slug}`}
```
Import `BLOG_CONFIG` from `../lib/config`.

**Acceptance:** Each post page has a `<link rel="canonical">` tag in `<head>` pointing to its absolute URL.

---

### 2.5 Update `lib/config.ts` Nav Link for Blog
**Status:** `[x]`  
**Files:** `lib/config.ts`

**Check:** The `navLinks` array already has `{ name: "Blog", href: "/blog" }`. Verify this is present and the href is `/blog` (not `/home` or a full URL).

**Acceptance:** Header "Blog" link navigates to `/blog`.

---

## Phase 3: Feature Enhancement

### 3.1 RSS/Atom Feed
**Status:** `[x]`  
**Files:** `pages/api/rss.ts` *(new file)*

**Goal:** Expose a machine-readable RSS 2.0 feed at `/api/rss` (and optionally `/feed.xml` via a redirect).

**Implementation sketch:**
```ts
// pages/api/rss.ts
import { getAllPosts } from '../../lib/api'
import { BLOG_CONFIG } from '../../lib/config'

export default async function handler(req, res) {
  const posts = await getAllPosts(['slug', 'title', 'date', 'excerpt'])
  const rss = buildRss(posts) // generate RSS XML string
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.send(rss)
}
```

Add a `<link>` tag in `next-seo.config.ts` `additionalLinkTags`:
```ts
{ rel: 'alternate', type: 'application/rss+xml', href: '/api/rss', title: 'Kyle RSS Feed' }
```

**Acceptance:** `GET /api/rss` returns valid RSS XML with all posts. Feed validators pass.

---

### 3.2 Giscus Comments
**Status:** `[ ]`  
**Files:** `components/blog/comments.tsx` *(new file)*, `components/blog/post-single.tsx`

**Goal:** Add GitHub Discussions-backed comments below each post.

**Steps:**
1. Install: `npm install @giscus/react`
2. Set up Giscus on `github.com/kylewtho/<markdown-repo>` at giscus.app — get `repo`, `repoId`, `category`, `categoryId`
3. Create `components/blog/comments.tsx` (see `fleeting-notes-website/components/blog/comments.tsx` for reference — update repo/IDs to Kyle's)
4. Add `<Comments />` at the bottom of `components/blog/post-single.tsx`, after `<PostBody>` and before the backlinks sidebar

**Config values to get from giscus.app (Kyle fills in):**
```ts
repo="kylewtho/???"     // the GitHub repo where Discussions are enabled
repoId="???"
categoryId="???"
```

**Acceptance:** Each post shows a Giscus comment widget. Comments are stored in the correct GitHub repo's Discussions.

---

### 3.3 Dark Mode
**Status:** `[x]`  
**Files:** `tailwind.config.js`, `components/misc/header.tsx`, `styles/index.css`

**Goal:** Add a dark mode toggle. Use Tailwind's `darkMode: 'class'` strategy with a `localStorage`-persisted preference.

**Steps:**
1. `tailwind.config.js`: set `darkMode: 'class'`
2. `components/misc/header.tsx`: add a toggle button (sun/moon icon) that:
   - Reads initial preference from `localStorage` or `prefers-color-scheme`
   - Toggles `dark` class on `<html>` element
   - Persists to `localStorage`
3. Update core background/text styles in `styles/index.css` with `dark:` variants
4. Audit `components/blog/post-body.tsx` — `markdown-styles.module.css` will need `dark:` variants for prose

**Acceptance:** Toggle in header switches between light/dark. Preference persists on reload. No flash of unstyled content (FOUC) — put the init script in `pages/_document.tsx` `<head>` before React hydrates.

---

### 3.4 Reading Time Estimate
**Status:** `[x]`  
**Files:** `lib/readingTime.ts` *(new utility)*, `components/blog/post-meta.tsx`, `pages/[...slug].tsx`

**Goal:** Show estimated reading time (e.g. "5 min read") next to the post date.

**Implementation:**
```ts
// lib/readingTime.ts
export function getReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}
```

Pass `readingTime` as a prop from `[...slug].tsx` → `PostSingle` → `PostMeta`.

**Acceptance:** Post pages show "N min read" adjacent to the date.

---

### 3.5 Tags / Hashtags
**Status:** `[x]`  
**Files:** `pages/blog.tsx`, `pages/tags/[tag].tsx` *(new)*, `components/blog/post-preview.tsx`, `lib/api.ts`

**Goal:** Posts declare tags using Obsidian block-list convention in their frontmatter:
```yaml
tags:
  - cyber
  - notes
  - tools
```
The blog feed supports filtering by tag. `gray-matter` parses both inline `[a, b]` and block-list formats; all sample posts now use block-list.

**Steps:**
1. `lib/api.ts` — `getAllPosts` already reads arbitrary frontmatter fields; ensure `tags` is passed through when requested
2. `components/blog/post-preview.tsx` — render tag chips below the excerpt
3. `pages/blog.tsx` — add a tag filter UI (clickable chips above the post list; filters client-side with `useState`)
4. `pages/tags/[tag].tsx` — dedicated tag page at `/tags/cyber` listing all posts with that tag (for SEO + linkability)

**Acceptance:** Tags appear on post previews. Clicking a tag on `/blog` filters the list. `/tags/[tag]` pages exist and are statically generated.

---

## Phase 4: Technical Polish

### 4.1 Shiki Syntax Highlighting
**Status:** `[x]`  
**Files:** `lib/markdownToHtml.ts`, `package.json`

**Goal:** Replace basic CSS code highlighting with Shiki for accurate, theme-aware syntax highlighting. Important for a tech/cyber blog.

**Steps:**
1. `npm install shiki`
2. In `lib/markdownToHtml.ts`, integrate Shiki as a rehype plugin (use `rehype-shiki` or `@shikijs/rehype`)
3. Choose a theme: `github-dark` for dark mode, `github-light` for light (or use Shiki's dual-theme support)
4. Remove any existing `prism` or basic CSS highlighting from `markdown-styles.module.css`

**Acceptance:** Code blocks in posts render with full syntax highlighting. Works in both light and dark mode.

---

### 4.2 React 19 Migration
**Status:** `[x]`  
**Files:** `package.json`, potentially `components/**`

**Note:** Next.js 15.5.9 is already installed. React 18.2 is in use. React 19 is supported by Next.js 15.

**Steps:**
1. `npm install react@19 react-dom@19`
2. Update `@types/react` and `@types/react-dom`
3. Address any React 19 breaking changes (ref handling, `useEffect` cleanup, etc.)
4. Run `npm run typecheck` to catch type errors

**Acceptance:** App runs on React 19. `npm run typecheck` passes. No console errors.

---

### 4.3 OpenGraph Image Defaults
**Status:** `[ ]`  
**Files:** `next-seo.config.ts`, `pages/[...slug].tsx`

**Issue:** `[...slug].tsx` falls back to `https://kyleho.net/src/koala-icon.png` for OG images — this is a small icon, not a proper OG image (1200×630 recommended).

**Fix:**
- Add a proper `public/og-default.png` (1200×630 banner image) — Kyle provides this asset
- Update the fallback in `[...slug].tsx` to use `/og-default.png`
- Add to `next-seo.config.ts` `openGraph.images` default

**Acceptance:** Posts without a custom `ogImage` show the blog's branded banner when shared on social media.

---

### 4.4 Image Optimisation (CLS)
**Status:** `[x]`  
**Files:** `components/blog/post-body.tsx`, `lib/markdownToHtml.ts`

**Goal:** Reduce Cumulative Layout Shift from inline markdown images by using Next.js `<Image>` or adding explicit `width`/`height` attributes via a rehype plugin.

**Acceptance:** Lighthouse CLS score < 0.1 on a post with images.

---

## Phase 5: UX & Polish

### 5.1 Mobile Nav Dark Mode
**Status:** `[x]`
**Files:** `components/misc/header.tsx`

The mobile nav overlay (`<Transition>` component) has hardcoded `bg-white` with no dark variant. Add `dark:bg-zinc-900` and `dark:text-gray-100` to the nav container and its link items.

---

### 5.2 Copy Button on Code Blocks
**Status:** `[x]`
**Files:** `components/blog/post-body.tsx` *(or new `components/blog/copy-code-button.tsx`)*

Add a "Copy" button that appears on hover over each code block. Since Shiki renders to static HTML, this needs a client-side `useEffect` that finds all `<pre>` elements in the post body and injects a copy button. Use the Clipboard API.

---

### 5.3 Table of Contents
**Status:** `[ ]`
**Files:** `lib/markdownToHtml.ts`, `pages/[...slug].tsx`, `components/blog/post-single.tsx`, `components/blog/toc.tsx` *(new)*

Auto-generate a ToC from `h2`/`h3` headings via `rehype-slug` (adds `id` anchors) + a custom extractor that returns `{ id, text, level }[]`. Pass as prop to `PostSingle` and render in the sidebar above Backlinks on desktop, collapsed on mobile.

**Steps:**
1. `npm install rehype-slug`
2. Add `.use(rehypeSlug)` to the unified pipeline in `markdownToHtml.ts`
3. Extract headings from the raw markdown (regex on `## ` / `### `) to build the ToC structure
4. Create `components/blog/toc.tsx` — sticky sidebar list of anchor links
5. Wire into `PostSingle` sidebar

---

### 5.4 Related Posts
**Status:** `[ ]`
**Files:** `pages/[...slug].tsx`, `components/blog/related-posts.tsx` *(new)*

At the bottom of each post, show up to 3 posts that share at least one tag. Sort by number of matching tags descending, then by date.

**Steps:**
1. In `getStaticProps` for `[...slug].tsx`, fetch all posts with `['slug', 'title', 'date', 'tags']`
2. Filter: exclude current post, sort by tag overlap, take top 3
3. Create `components/blog/related-posts.tsx` — simple card list
4. Render below `<PostBody>` in `PostSingle`

---

### 5.5 Scroll Progress Bar
**Status:** `[ ]`
**Files:** `components/misc/scroll-progress.tsx` *(new)*, `components/misc/layout.tsx`

A thin fixed bar at the very top of the viewport (above the header) that fills as the user scrolls. Pure CSS + `useEffect` scroll listener.

```tsx
// components/misc/scroll-progress.tsx
'use client'
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const handler = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      setProgress(scrollTop / (scrollHeight - clientHeight) * 100)
    }
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return <div style={{ width: `${progress}%` }} className="fixed top-0 left-0 h-0.5 bg-gray-900 dark:bg-gray-100 z-50 transition-none" />
}
```

Add `<ScrollProgress />` at the top of the Layout wrapper.

---

### 5.6 Search Debounce + Client-Side Index
**Status:** `[ ]`
**Files:** `components/misc/search.tsx`, `pages/api/search.ts` *(check existing)*

Current search fires a fetch on every keystroke. Fix:
1. Add a 200ms debounce to `handleChangeInput`
2. Consider moving to a static Fuse.js index built at page load (`/api/search-index` that returns all post slugs/titles/excerpts) to avoid per-keystroke API calls

---

### 5.7 Font
**Status:** `[ ]`
**Files:** `pages/_app.tsx`, `tailwind.config.js`

Current font is the system stack. Suggested: **Geist** (Vercel's font, clean and modern) or **Inter**. Use `next/font` for zero-layout-shift loading.

```tsx
// pages/_app.tsx
import { Geist } from 'next/font/google'
const geist = Geist({ subsets: ['latin'] })
// wrap: <main className={geist.className}>
```

Update `tailwind.config.js` `fontFamily.sans` to reference the CSS variable.

---

## Execution Order

For a single agent working sequentially, follow this order:

```
Always start from ## Know fix list, which is a manual list of issues Kyle has found through testing. These are high priority and should be done first.
When there is existing know fix items, add new work to the most earliest possible phase in the plan. Remark in the known fix list as you recognised. Then continue fixing.
1.1 → 1.2 → 1.3 → 1.4 (Kyle)
2.1 → 2.2 → 2.3 → 2.4 → 2.5
3.1 → 3.2 (postponed) → 3.3 → 3.4 → 3.5
4.1 → 4.2 → 4.3 (needs OG asset from Kyle) → 4.4
5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6 → 5.7
```

**Never do 2.2 before 2.1.** Removing the redirect before the index page exists will cause a 404 at `/`.
**SEO tasks** (sitemap, robots.txt, JSON-LD) are frozen — see SEO Policy section.

---

## Known fix list (manual update by Kyle through testing, please add this to the plan)
- [x] home.md has a different width than other pages. (sidebar logic must be preserved).
- [x] Wikilink & Image fallback: Some `[[wikilinks]]` and `![[images]]` are not being converted by the export process.
- [x] markdown files in 'home', 'faq', 'privacy-policy', 'projects', 'resources', 'terms-and-conditions', 'descriptions/*', 'placeholders/*', 'tutorials/*' should ONLY be excluded from the blog feed, but still be accessible at their respective paths. Verify this is the case and fix any issues.
- [x] home.md triggers GET /home 404. Fix
- [x] Tags frontmatter convention: all `common_md` posts converted from `tags: [a, b]` to Obsidian block-list format (`tags:\n  - a\n  - b`). No code change needed — `gray-matter` handles both; convention standardised for Obsidian compatibility.

## Current Status

Phases 1–4 complete. Phase 5 UX polish is next.

| Phase | Task | Status |
|-------|------|--------|
| 1–4 | All identity, architecture, features, polish | `[x]` |
| 5 | 5.3 Table of contents | `[ ]` |
| 5 | 5.4 Related posts | `[ ]` |
| 5 | 5.5 Scroll progress bar | `[ ]` |
| 5 | 5.6 Search debounce + static index | `[ ]` |
| 5 | 5.7 Font (Geist / Inter) | `[ ]` |
| 6 | 6.4 Resume nav link (deferred) | `[ ]` |
| — | 4.3 OG image — `public/og-default.png` added by Kyle | `[x]` |
| — | 3.2 Giscus comments | postponed — do not action |

### Known Architecture Rules
- `RESERVED_SLUGS` in `[...slug].tsx` — update when adding new concrete pages
- `blogExcludedSlugs` in `lib/config.ts` — blog feed exclusion only; does NOT block path generation
- `featuredPosts` in `lib/config.ts` — populates Popular Posts sidebar on all pages without backlinks
- All list/tag/post pages use `lg:flex lg:justify-between` + `lg:w-72 lg:ml-20 shrink-0` sidebar
- YAML frontmatter titles containing `:` must be quoted e.g. `title: "Foo: Bar"`
- Always `rm -rf .next` before restarting dev after structural changes

---

## Change Log

### 2026-04-17 (cont.)
- Formatter & Linter: Fully implemented **Biome**; configured `biome.json` with tailored rules (ignoring `:global`, enforcing kebab-case filenames); sanitized codebase with `npm run lint`
- Codebase Hardening: Converted all builtin imports to `node:` protocol; standardized `<button>` elements with explicit types; optimized performance by replacing native `<img>` with Next.js `<Image />` in core components
- Bug fixes: Resolved Next.js Image component error by adding `avatars.githubusercontent.com` to `next.config.js` remote patterns; fixed recursive effect dependencies in Header and Search components
- Content: Updated `how-i-built-this-blog.md` in `linked-blog` with current tech stack (Biome, Shiki, Next.js 15)

### 2026-04-17
- Layout consistency: all list/post/tag pages standardised to `lg:flex lg:justify-between` + `lg:w-72 lg:ml-20 shrink-0` sidebar; `PostList` and `TagPage` were on `md:` breakpoints
- Sidebar: `PostSingle` shows Popular Posts when no backlinks (falls back gracefully); `/blog` and `/tags/[tag]` always show Popular Posts sidebar; `featuredPosts` in config drives content
- Bug fixes: Obsidian `[[wikilink]]`/`![[image]]` conversion in `updateMarkdownLinks`; `/home` → `/` redirect; `isExcludedSlug` removed from `getStaticPaths` (blog-feed-only concern); `parseFileToObj` hardened with try/catch for malformed YAML
- Phase 6 + security: `/about`, `/projects`, `/resources` pages live; mobile nav dark mode; author avatar `url` field; security fixes on search/post-preview APIs

### 2026-04-16 (session cont.)
- 3.5: Tags system — `tags` field on Post interface; tag chips on PostPreview with click-to-filter; client-side tag filter bar on /blog; `pages/tags/[tag].tsx` statically generated; `tags` added to RESERVED_SLUGS
- 4.1: Shiki syntax highlighting — `@shikijs/rehype` replaces `rehypeSanitize`; dual themes (github-light/github-dark); dark mode switching via CSS variables in markdown-styles.module.css

### 2026-04-16 (session start)
- Merged CLAUDE.md into AGENTS.md (git workflow, build pipeline, formatter, important notes); CLAUDE.md now just `@AGENTS.md`
- 2.6: Confirmed `getAllPosts` already sorts by date descending — no code change needed
- 3.1: RSS 2.0 feed at `GET /api/rss` (`pages/api/rss.ts`); respects `blogExcludedSlugs`; RSS `<link>` tag added to `next-seo.config.ts`
- 3.4: Reading time (`lib/readingTime.ts`) — wired through `[...slug].tsx` → `PostSingle` → `PostMeta`; displays "N min read" next to date
- 3.3: Dark mode — `darkMode: 'class'` in Tailwind; FOUC-prevention script in `_document.tsx`; sun/moon toggle in header; dark variants on header, nav, markdown body, code blocks, tables

### 2026-04-14 (session end)
- Phase 1 complete: config.ts handles fixed, footer.tsx dynamic, post-meta.tsx author links fixed
- Phase 2 complete: pages/index.tsx (renders home.md via PostSingle), pages/blog.tsx + post-list.tsx (paginated feed), canonical URLs in [...slug].tsx, redirect removed
- Added RESERVED_SLUGS to [...slug].tsx to prevent build conflicts with concrete page routes
- Added blogExcludedSlugs to BLOG_CONFIG (supports exact slugs and folder/* patterns)
- Added Developer Notes section to AGENTS.md covering routing precedence and .next cache rules

### 2026-04-14 (session start)
- Full audit of Phase 1 actual state — identified outstanding bugs in footer.tsx, post-meta.tsx, config.ts
- Clarified architecture: home.md remains as landing page content, rendered via new pages/index.tsx (not a redirect)
- Separated blog feed (/blog) from landing page (/)
- Added RSS, dark mode, reading time, tags, Shiki, OG image tasks
- Noted Next.js 15 is already installed (Phase 4 migration partially done)
- Rewrote AGENTS.md with file-level task specs for multi-agent execution
- Previous entry: Initialized AGENTS.md and project roadmap (Gemini, 2026-04-14)
