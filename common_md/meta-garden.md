---
title: The Meta-Garden: Building the Engine
excerpt: A deep dive into the technology and philosophy behind this interconnected blog structure.
date: "2026-04-17"
tags:
  - meta
  - nextjs
  - shiki
  - development
---

# Building the Meta-Garden

This blog isn't just a collection of files; it's an engine designed for **interconnectedness**. In this post, I'll explain the technical stack and how it supports a "Second Brain" workflow.

## The Philosophy

Unlike traditional blogs that are chronological, a **Digital Garden** is topographical. It grows in clusters. This is made possible through [[linking-and-backlinks]]. When you link one idea to another, you're not just creating a path for the reader; you're creating a map of your knowledge.

## The Tech Stack

To achieve high performance and a great developer experience, I chose the following tools:

### 1. Next.js 15 & React 19
The foundation of the site. It provides the routing and server-side rendering (SSR) needed for SEO, while keeping the client-side interaction snappy.

### 2. Unified, Remark, and Rehype
The Markdown processing pipeline. This allows for custom features like:
- **Wikilinks**: Converting `[[file]]` into working links.
- **Code Highlighting**: Powered by **Shiki**.

```typescript
// Example of how we process links in the pipeline
function rewriteLinkNodes(node, linkNodeMapping) {
  if (node.type === 'element' && node.tagName === 'a') {
    const slug = getSlugFromHref(node.properties.href);
    if (linkNodeMapping[slug]) {
      node.properties.className = 'internal-link';
    }
  }
}
```

### 3. Tailwind CSS
For styling. It allows for a consistent design system without writing massive CSS files. Check out the [[markdown-features]] page to see how these styles are applied to different elements.

## Latest Improvements

We recently improved how tables handle link previews. Previously, tooltips were clipped by the table's `overflow: auto`. Now, they pop out cleanly! 

| Feature | Status | Description |
| --- | --- | --- |
| Wikilinks | ✅ Active | Support for `[[link]]` syntax. |
| Backlinks | ✅ Active | Automatic tracking of incoming links. |
| Tooltips | ✅ Fixed | Previews now appear correctly over tables. |

## What's Next?

I'm currently looking into integrating **Biome** for faster linting and formatting. It should make the development process even smoother than the current VS Code built-in tools.

---
Learn more about [Linking & Backlinks](linking-and-backlinks.md) or see my [Projects Showcase](projects.md).
