---
title: Sample Project Description
excerpt: An example of how to describe a project using the blog's Markdown features.
date: "2026-04-17"
tags:
  - project
  - showcase
  - demo
---

# Sample Project: Digital Garden Engine

This is a sample project description to demonstrate how projects can be showcased on this blog.

## Project Overview

The **Digital Garden Engine** is a high-performance, static site generator built with Next.js and Tailwind CSS. It focuses on interconnected ideas and seamless navigation.

### Key Features

- **Bi-directional Linking**: Automatically tracks [[backlinks]] between posts.
- **Fast Search**: Instant full-text search across all markdown files.
- **Syntax Highlighting**: Beautiful code blocks using Shiki.

## Technical Details

The project uses a custom Markdown parser that supports:
1. Wikilinks (`[[Link]]`)
2. GitHub Flavored Markdown
3. Frontmatter extraction

```typescript
// Sample configuration
const config = {
  contentDir: './common_md',
  outputDir: './public/blog',
  features: ['backlinks', 'search', 'tags']
};
```

Learn more about this project's capabilities in the [Markdown Features Demo](../markdown-features.md).

---
Return to [Projects](../projects.md) or [Home](../home.md).
