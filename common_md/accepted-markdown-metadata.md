---
title: Accepted Metadata for Markdown Files
---

Here are all the metadata fields accepted by the linked-blog-starter-md template. All fields are optional.

````
title: "Title of Note"
excerpt: "Excerpt shown in note preview + SEO"
date: "2021-11-11"
author:
	name: "Matthew Wong"
	url: "URL to a pic for the author"
ogImage:
	url: "URL to an image to set the og Image for SEO"
tags: [cyber, notes, tools]
````

## Tags

The `tags` field accepts a list of lowercase strings. Tags appear as clickable chips on post previews and enable filtering on the `/blog` feed. Each tag also generates a dedicated page at `/tags/[tag]`.

Use the YAML array format (either inline `[tag1, tag2]` or block list):

````
tags: [cyber, notes, tools]
````

or

````
tags:
  - cyber
  - notes
  - tools
````

> Note: Obsidian inline tags (`#cyber`) are **not** supported — only the frontmatter `tags:` field is read by the blog.
