---
title: Markdown Mastery: Advanced Techniques
excerpt: Level up your digital garden with advanced Markdown features, tables, and custom links.
date: "2026-04-17"
tags:
  - tutorial
  - markdown
  - guide
---

# Markdown Mastery

Welcome to the advanced guide for gardening in Markdown. If you've already read the [Getting Started Tutorial](sample-tutorial.md), you're ready for these techniques.

## 1. Advanced Tables

Tables are great for comparisons. We've optimized our styles to ensure that link previews work even inside table cells.

| Technique | Description | Example |
| --- | --- | --- |
| **Wikilinks** | Link using double brackets. | `[[home]]` |
| **Standard Links** | Traditional markdown links. | `[Home](../home.md)` |
| **Task Lists** | Track your progress. | `- [x] Done` |

## 2. Code Block Annotations

When sharing code, use the correct language tag for the best syntax highlighting. Our engine uses **Shiki**, which supports hundreds of languages.

```rust
// A little bit of Rust for variety
fn main() {
    println!("Welcome to the garden!");
    let garden_is_growing = true;
    
    if garden_is_growing {
        println!("Keep planting!");
    }
}
```

## 3. Image Layouts

You can embed images from the `attachments/` folder. Use the Obsidian syntax for local files:

`![[kyle-hello.png]]`

For a full showcase of image capabilities, visit the [[image-showcase]].

## 4. The Power of Backlinks

One of the most powerful features of this blog is the automatic generation of **backlinks**. At the bottom of this page (in the live site), you'll see a list of every other page that links here. 

This happens automatically when you use a link like this: [[long-post]]. Because I just linked to the long post, it will now show "Markdown Mastery" in its backlinks section!

## Summary Checklist

- [x] Use YAML frontmatter for every post.
- [x] Use [[wikilinks]] for internal connections.
- [x] Organize files into subdirectories for clarity.
- [x] Check the [[faq]] if you get stuck.

---
Happy Gardening! 🌿
