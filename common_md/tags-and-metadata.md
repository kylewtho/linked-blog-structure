---
title: Tags & Metadata
excerpt: A guide to the frontmatter metadata system, including the new tags functionality.
date: "2026-04-14"
author:
  name: "Kyle"
  url: "https://avatars.githubusercontent.com/u/55761838?v=4"
tags: [metadata, tutorial, setup]
---

# Tags & Metadata

This blog uses YAML frontmatter (the block at the top of the file between `---` lines) to store metadata about your posts.

## Available Fields

| Field | Description |
| :--- | :--- |
| `title` | The main title of the post (H1). |
| `excerpt` | A short summary shown in post lists and used for SEO. |
| `date` | The publication date (YYYY-MM-DD). |
| `author` | An object containing `name` and `url`. |
| `tags` | A list of categories/tags for the post. |
| `ogImage` | URL for the social media preview image. |

## The New Tags Functionality

The `tags` field allows you to categorize your posts. Each tag automatically gets its own page at `/tags/[tag]`.

For example, this post is tagged with `metadata`, `tutorial`, and `setup`. If you click those tags in the UI, you'll see all other posts sharing those labels.

### Example Frontmatter
```yaml
---
title: My Great Post
excerpt: Just a summary.
date: "2026-04-16"
tags: [tech, react]
---
```

---
Return to [Home](home.md) or see [Markdown Features](markdown-features.md).
