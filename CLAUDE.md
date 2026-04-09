# CLAUDE.md — linked-blog-structure

This is the **Next.js application** that renders the linked-blog markdown content. It reads markdown files from the linked-blog repo and generates the public-facing website.

## Git Workflow
Always `git pull` before starting work. Commit and `git push` when done.

## Structure

```
pages/
├── _app.tsx              # App wrapper
├── _document.tsx         # HTML document
├── [...slug].tsx         # Dynamic route — renders all markdown pages
└── api/                  # API routes

components/
├── blog/                 # Blog-specific components
├── misc/                 # Miscellaneous UI components
└── utils/                # Utility components

styles/                   # Global CSS
lib/                      # Helper functions
```

## Tech Stack
- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Reads markdown files from the linked-blog repo

## Important Notes
- **Do not change the structure of this repo** — the rendering pipeline is stable and intentional
- Content changes belong in the linked-blog repo, not here
- Layout and component changes require care — they affect every page on the site
- Run `npm install` before starting the dev server on a new machine
- Dev server: `npm run dev`
