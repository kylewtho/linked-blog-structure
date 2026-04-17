---
title: Linking & Backlinks
excerpt: Understanding how internal links and bi-directional backlinks work in this blog structure.
date: "2026-04-15"
tags: [features, obsidian]
---

# Linking & Backlinks

One of the most powerful features of this blog is the support for **bi-directional linking**.

## Internal Links

You can link to other posts using standard Markdown links or [[wikilinks]].

For example:
- Go to the [Markdown Features Demo](markdown-features.md).
- Learn about [Tags & Metadata](tags-and-metadata.md).

## Backlinks

At the bottom of every post, you will see a "Backlinks" section. This automatically lists every other post that links to the current one. This is great for creating a "digital garden" where ideas are interconnected.

### How it works
1. You write a link in `Post A` pointing to `Post B`.
2. The blog engine detects this connection.
3. When viewing `Post B`, `Post A` will appear in the backlinks section with a small preview.

## Try it out!
If you go back to the [Home](home.md) page, you'll see that this page is listed as a backlink there (or vice-versa depending on the links).

---
*Note: Backlinks are generated at build-time for maximum performance.*
