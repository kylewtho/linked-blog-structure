# AGENTS.md — linked-blog-structure

> **For AI agents (Claude, Gemini, Codex, etc.):** This is the canonical task file for Kyle's personal blog. Read this file in full before making changes. Each task lists the exact files to touch and what the result should look like. Mark tasks complete by changing `[ ]` to `[x]`. Do not modify files outside the scope of the task you are executing.

---

## Project Overview

Kyle's personal blog and digital garden. Built on Next.js 15 + Tailwind CSS, sourcing content from Obsidian markdown files (`common_md/`). Content is published by pushing markdown to this repo; Next.js statically generates HTML from it.

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

`common_md/` is auto-generated — **do not edit it manually**.

---

## Formatter

No formatter is configured (no Prettier or Biome). Use VS Code's built-in formatter if needed.

---

## Important Notes

- **Do not change the structure of this repo** — the rendering pipeline is stable and intentional
- Content changes belong in the `linked-blog` repo, not here
- Layout and component changes require care — they affect every page on the site
- Run `npm install` before starting the dev server on a new machine
- Dev server: `npm run dev`

---

## Repository Map (key files only)

```
linked-blog-structure/
├── common_md/            ← Obsidian content (markdown source of truth)
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

## Central Config (`lib/config.ts`)

All site-wide values live here. Agents must read this file before hardcoding any URLs, names, or links. Components should import from here rather than using inline strings.

---

## Phase 1: Identity & Cleanup

### 1.1 Fix `lib/config.ts` — Wrong Handles
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]` *(Kyle does this manually in Obsidian)*  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
**Files:** `lib/config.ts`

**Check:** The `navLinks` array already has `{ name: "Blog", href: "/blog" }`. Verify this is present and the href is `/blog` (not `/home` or a full URL).

**Acceptance:** Header "Blog" link navigates to `/blog`.

---

## Phase 3: Feature Enhancement

### 3.1 RSS/Atom Feed
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
**Files:** `pages/blog.tsx`, `pages/tags/[tag].tsx` *(new)*, `components/blog/post-preview.tsx`, `lib/api.ts`

**Goal:** Posts can declare `tags: [cyber, notes, tools]` in their frontmatter. The blog feed supports filtering by tag.

**Steps:**
1. `lib/api.ts` — `getAllPosts` already reads arbitrary frontmatter fields; ensure `tags` is passed through when requested
2. `components/blog/post-preview.tsx` — render tag chips below the excerpt
3. `pages/blog.tsx` — add a tag filter UI (clickable chips above the post list; filters client-side with `useState`)
4. `pages/tags/[tag].tsx` — dedicated tag page at `/tags/cyber` listing all posts with that tag (for SEO + linkability)

**Acceptance:** Tags appear on post previews. Clicking a tag on `/blog` filters the list. `/tags/[tag]` pages exist and are statically generated.

---

## Phase 4: Technical Polish

### 4.1 Shiki Syntax Highlighting
**Status:** `[ ]`  
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
**Status:** `[ ]`  
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
**Status:** `[ ]`  
**Files:** `components/blog/post-body.tsx`, `lib/markdownToHtml.ts`

**Goal:** Reduce Cumulative Layout Shift from inline markdown images by using Next.js `<Image>` or adding explicit `width`/`height` attributes via a rehype plugin.

**Acceptance:** Lighthouse CLS score < 0.1 on a post with images.

---

## Execution Order

For a single agent working sequentially, follow this order:

```
1.1 → 1.2 → 1.3 → 1.4 (Kyle)
2.1 → 2.2 → 2.3 → 2.4 → 2.5
3.1 → 3.2 (needs Giscus setup by Kyle) → 3.3 → 3.4 → 3.5
4.1 → 4.2 → 4.3 (needs OG asset from Kyle) → 4.4
```

**Never do 2.2 before 2.1.** Removing the redirect before the index page exists will cause a 404 at `/`.

---

## Known fix list (manual update by Kyle through testing, please add this to the plan)
2.6 Fix: Blog posts in \blog should be shown in chronological order (newest at the top)

## Current Status

| Phase | Task | Status |
|-------|------|--------|
| 1     | 1.1 Fix config.ts handles | `[x]` |
| 1     | 1.2 Fix footer.tsx | `[x]` |
| 1 | 1.3 Fix post-meta.tsx author link | `[x]` |
| 1 | 1.4 Rewrite home.md content | `[ ]` Kyle only |
| 2 | 2.1 Create pages/index.tsx | `[x]` |
| 2 | 2.2 Remove / redirect | `[x]` |
| 2 | 2.3 Create pages/blog.tsx + post-list | `[x]` |
| 2 | 2.4 Add canonical to [...slug].tsx | `[x]` |
| 2 | 2.5 Verify Blog nav link | `[x]` |
| 2 | 2.6 Fix: chronological order | `[x]` |
| 3 | 3.1 RSS feed | `[x]` |
| 3 | 3.2 Giscus comments | `[ ]` postponed — pick up later |
| 3 | 3.3 Dark mode | `[x]` |
| 3 | 3.4 Reading time | `[x]` |
| 3 | 3.5 Tags system | `[x]` |
| 4 | 4.1 Shiki highlighting | `[x]` |
| 4 | 4.2 React 19 upgrade | `[x]` |
| 4 | 4.3 OG image defaults | `[ ]` needs Kyle asset — public/og-default.png (1200×630) |
| 4 | 4.4 Image CLS fix | `[x]` |

---

## Change Log

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
