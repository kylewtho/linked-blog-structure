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

## Design Reference

A `DESIGN.md` file lives at the repo root. It encodes a Vercel-inspired design system (Geist font, achromatic palette, shadow-as-border, negative letter-spacing at display sizes). **Agents must read `DESIGN.md` before writing or modifying any UI component.** Apply its typography, colour, shadow, and spacing rules — skip the Vercel-specific workflow accent colours (Ship Red/Preview Pink/Develop Blue) as those are irrelevant to a blog.

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
│   └── markdown-to-html.ts ← Markdown → HTML pipeline
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

## Completed Work (reference only)

All phases 1–5 are done except where noted below. Key implementation facts for future reference:

| Task | Key files | Notes |
|------|-----------|-------|
| 1.1 Config | `lib/config.ts` | `footerLinks`, `featuredPosts`, handles → `kylewtho` |
| 1.2 Footer | `components/misc/footer.tsx` | Reads `BLOG_CONFIG.footerLinks` dynamically |
| 1.3 Post meta | `components/blog/post-meta.tsx` | Author link → `BLOG_CONFIG.author.github` |
| 1.4 home.md | `common_md/home.md` | Kyle's landing page content |
| 2.1 Index page | `pages/index.tsx` | Renders `home.md` via `PostSingle` |
| 2.2 No redirect | `next.config.js` | Redirect removed; `/home` still works via catch-all |
| 2.3 Blog feed | `pages/blog.tsx`, `components/blog/post-list.tsx` | Paginated, tag-filtered, with sidebar |
| 2.4 Canonical URLs | `pages/[...slug].tsx` | `BLOG_CONFIG.siteUrl + '/' + slug` |
| 3.1 RSS | `pages/api/rss.ts` | RSS 2.0 at `/api/rss`; respects `blogExcludedSlugs` |
| 3.3 Dark mode | `tailwind.config.js`, `header.tsx`, `_document.tsx` | `darkMode: 'class'`; FOUC-prevention script in `<head>` |
| 3.4 Reading time | `lib/readingTime.ts`, `post-meta.tsx` | Wired `[...slug].tsx` → `PostSingle` → `PostMeta` |
| 3.5 Tags | `pages/tags/[tag].tsx`, `post-preview.tsx` | Obsidian block-list format; filter on `/blog`; static `/tags/[tag]` |
| 4.1 Shiki | `lib/markdownToHtml.ts` | `@shikijs/rehype`; `github-light`/`github-dark` dual themes |
| 4.2 React 19 | `package.json` | Upgraded |
| 4.3 OG image | `public/og-default.png` | Asset added by Kyle; verify wiring in `[...slug].tsx` + `next-seo.config.ts` if sharing looks wrong |
| 4.4 Image CLS | `post-body.tsx` | Next.js `<Image>` used for avatars; rehype handles inline images |
| 5.1 Mobile nav dark | `header.tsx` | `dark:bg-zinc-900` on nav overlay |
| 5.2 Copy button | `post-body.tsx` | `useEffect` injects copy button on `<pre>` elements; Clipboard API |
| 5.3 TOC | `components/blog/toc.tsx`, `[...slug].tsx` | `rehype-slug` + `extractToc`; wired into `PostSingle` sidebar |
| 5.5 Scroll progress | `components/misc/scroll-progress.tsx` | Fixed bar in `layout.tsx` |
| 5.6 Search debounce | `components/misc/search.tsx` | 200ms debounce on keystroke |
| 5.7 Geist font | `lib/fonts.ts`, `_app.tsx` | CSS variable → Tailwind `fontFamily.sans` |

---

## Pending Tasks

> Tasks are split into two tracks. **UI tasks** are safe to do first — they touch only styles, layouts, and static pages with no data-pipeline risk. **Functional tasks** modify the markdown pipeline or `getStaticProps` data flow and should be done after UI work is stable.

---

## UI Tasks *(do first)*

### 6.1 Badges & Certifications Display
**Status:** `[ ]` *(decisions pending — Kyle to decide before implementation)*  
**Files:** TBD — likely `pages/about.tsx` section or homepage, `components/misc/badges.tsx` *(new)*

Display professional badges and rankings from Credly, TryHackMe, LetsDefend, etc.

**Open decisions:**
- [ ] Where — dedicated `/about` section, homepage, or both?
- [ ] Render — platform embed widgets vs native render from API?
- [ ] Layout — horizontal strip, grid, or per-platform cards?
- [ ] Platforms to include first

**Notes for implementation:** Credly and TryHackMe have embeddable badge widgets (static embeds preferred). If using `/about` as a concrete page, add `about` to `RESERVED_SLUGS`.

---

### 6.5 Custom 404 Page
**Status:** `[ ]`  
**Files:** `pages/404.tsx` *(new)*

Next.js renders a default 404 for unknown routes. Replace it with a branded page.

**Steps:**
1. Create `pages/404.tsx` — use `Layout`, keep it minimal: large "404" heading (Geist, negative letter-spacing per DESIGN.md), short message, link back to `/` and `/blog`.
2. No need to add to `RESERVED_SLUGS` — Next.js reserves `404` at the framework level.

**Acceptance:** Navigating to `/nonexistent` shows the custom page with site header/footer.

---

### 6.6 Typography Polish (DESIGN.md)
**Status:** `[ ]`  
**Files:** `styles/globals.css` or `tailwind.config.js`, affected components

Apply the DESIGN.md letter-spacing and weight rules to post headings and UI elements.

**Steps:**
1. Add Tailwind utilities or CSS rules for negative letter-spacing: `-2.4px` at `h1` (48px equiv), `-1.28px` at `h2` (32px), `-0.96px` at `h3` (24px).
2. Verify body text runs at weight 400, navigation/labels at 500, headings at 600 — adjust where off.
3. Apply shadow-as-border (`box-shadow: 0px 0px 0px 1px rgba(0,0,0,0.08)`) to `post-preview` cards in place of any CSS `border` properties.
4. Verify dark mode equivalents — shadow opacity may need slight increase on dark surfaces.

**Acceptance:** Post headings visibly tighter at large sizes. Post preview cards use shadow-border. No regressions on mobile or dark mode.

---

## Functional Tasks *(do after UI is stable)*

### 5.4 Related Posts
**Status:** `[ ]`  
**Files:** `pages/[...slug].tsx`, `components/blog/related-posts.tsx` *(new)*

Show up to 3 posts sharing at least one tag at the bottom of each post. Sort by tag overlap count desc, then by date.

**Steps:**
1. In `getStaticProps` (`[...slug].tsx`), fetch all posts with `['slug', 'title', 'date', 'tags']`
2. Filter: exclude current post; sort by overlap; take top 3
3. Create `components/blog/related-posts.tsx` — simple card list
4. Render below `<PostBody>` in `PostSingle`

**Acceptance:** Posts with shared tags show a "Related Posts" section. Posts with no tag overlap show nothing.

---

### 6.2 Callout / Admonition Blocks
**Status:** `[ ]`  
**Files:** `lib/markdown-to-html.ts`, `styles/` (or Tailwind in `post-body.tsx`)

Obsidian exports callout syntax (`> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!DANGER]`, `> [!IMPORTANT]`) as standard blockquotes with the type tag as the first line. Currently these render as unstyled blockquotes.

**Steps:**
1. In `markdown-to-html.ts`, add a rehype plugin (or custom unified transform) that detects blockquotes whose first `<p>` child matches `[!TYPE]` and rewrites them to `<div class="callout callout-{type}">`.
2. Add Tailwind styles for each type — colour-coded left border + tinted background, consistent with the DESIGN.md palette (use grays for NOTE/TIP, use restrained accent only for WARNING/DANGER).
3. Strip the `[!TYPE]` text node from the rendered output (or replace it with a label).

**Acceptance:** `> [!NOTE] body text` renders as a styled callout card. Plain `>` blockquotes are unaffected.

---

### 6.3 Mermaid Diagram Support
**Status:** `[ ]`  
**Files:** `lib/markdown-to-html.ts`, `components/blog/post-body.tsx`

Obsidian supports Mermaid fenced code blocks (\`\`\`mermaid). Currently these render as unstyled `<pre><code>` blocks.

**Steps:**
1. In `markdown-to-html.ts`, detect fenced code blocks with lang `mermaid` and emit a `<div class="mermaid">` wrapper with the raw diagram source as text content instead of a `<pre>`.
2. In `post-body.tsx`, lazily load and initialise `mermaid` (npm package) client-side via `useEffect` — call `mermaid.initialize` + `mermaid.run` after mount.
3. Style the wrapper to be centred, with the DESIGN.md shadow-border card treatment and 8px radius.

**Acceptance:** Mermaid blocks render as diagrams on post pages. Non-mermaid code blocks are unaffected. No flash of raw source text (initialise before first paint if possible).

---

### 3.2 Giscus Comments
**Status:** postponed — do not action

---

## Known Fix List *(Kyle adds issues found during testing)*

- [x] **Page width inconsistency** — `PostSingle` uses `lg:max-w-none` on its inner wrapper, which is correct when a sidebar is present (the `lg:flex` row constrains it). But pages with no backlinks/sidebar (e.g. `/` and `/resources`) have no sidebar, so the content stretches to the full `max-w-6xl` outer container and looks far too wide. **Fix:** In `components/blog/post-single.tsx`, conditionally apply `max-w-3xl mx-auto` to the main content column when `hasBacklinks` is false (or when the sidebar slot is empty). The header already has `max-w-3xl mx-auto` — the body content and the flex row wrapper need the same constraint on the no-sidebar path.

- [x] home.md width inconsistency — sidebar logic preserved
- [x] Wikilink/image fallback — `[[wikilinks]]` and `![[images]]` conversion fixed in `updateMarkdownLinks`
- [x] Excluded slugs — `descriptions/*`, `placeholders/*`, `tutorials/*` etc. excluded from blog feed only, still accessible at their paths
- [x] `/home` 404 — redirect removed, `/` renders `index.tsx`
- [x] Tags frontmatter — all `common_md` posts use Obsidian block-list format (`tags:\n  - a`)

---

## Current Status

| Area | Status |
|------|--------|
| Phases 1–4 | `[x]` complete |
| Phase 5 (all except 5.4) | `[x]` complete |
| **UI: 6.5 Custom 404 page** | `[x]` done |
| **UI: 6.6 Typography polish** | `[x]` done |
| UI: 6.1 Badges display | `[ ]` pending Kyle's decisions |
| Functional: 5.4 Related posts | `[ ]` after UI |
| Functional: 6.2 Callout blocks | `[ ]` after UI |
| Functional: 6.3 Mermaid diagrams | `[ ]` after UI |
| 3.2 Giscus comments | postponed |

### Architecture Rules
- `DESIGN.md` at repo root — read before writing any UI; Vercel-inspired design tokens (typography, shadows, spacing)
- `RESERVED_SLUGS` in `[...slug].tsx` — update when adding new concrete pages
- `blogExcludedSlugs` in `lib/config.ts` — blog feed exclusion only; does NOT block path generation
- `featuredPosts` in `lib/config.ts` — drives Popular Posts sidebar on pages without backlinks
- All list/tag/post pages: `lg:flex lg:justify-between` + `lg:w-72 lg:ml-20 shrink-0` sidebar
- YAML frontmatter titles with `:` must be quoted: `title: "Foo: Bar"`
- Always `rm -rf .next` before restarting dev after structural changes
- Tags frontmatter: Obsidian block-list format only (`tags:\n  - tag`)

---

## Change Log

### 2026-04-29
- Added `DESIGN.md` (Vercel-inspired system) and wired it into Important Notes, Architecture Rules
- Added tasks 6.2 (callout blocks), 6.3 (Mermaid diagrams), 6.5 (custom 404), 6.6 (typography polish)

### 2026-04-18
- Simplified AGENTS.md: collapsed completed phases 1–5 into reference table; kept full detail for pending tasks only
- Tags convention: converted all `common_md` posts from `tags: [a, b]` to Obsidian block-list format

### 2026-04-17
- Biome formatter/linter integrated; codebase hardened (node: protocol, button types, Next.js Image)
- Layout: all list/post/tag pages standardised to `lg:flex` sidebar pattern
- Sidebar: Popular Posts fallback when no backlinks; `featuredPosts` in config drives content
- Bug fixes: wikilink/image conversion, `/home` redirect, excluded slugs, YAML parse hardening
- Phase 5 UX: TOC, scroll progress, Geist font, search debounce, copy button — all complete
- Phase 6 stub: `/about`, `/projects`, `/resources` pages live; badges plan added

### 2026-04-16
- Tags system, Shiki highlighting, RSS feed, dark mode, reading time — all complete
- Biome, routing architecture, CLAUDE.md → AGENTS.md consolidation

### 2026-04-14
- Phases 1–2 complete: config, footer, post-meta, index page, blog feed, canonical URLs
- Initial AGENTS.md roadmap written
