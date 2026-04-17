---
title: Markdown Features Demo
excerpt: A comprehensive guide to the Markdown features supported by this blog, including code blocks, formatting, and quotes.
date: "2026-04-16"
tags: [guide, markdown]
---

# Markdown Features Demo

This post serves as a style guide and technical preview for all the common Markdown elements.

## Text Formatting

You can use **bold**, *italic*, or ~~strikethrough~~ text. You can even combine them like ***bold and italic***.

> "This is a blockquote. It's perfect for highlighting important information or quoting other sources."
> — Famous Programmer

## Code Blocks

### Inline Code
You can use `inline code` for variable names or short snippets like `const x = 10;`.

### Code Box (Syntax Highlighting)
The blog uses Shiki for beautiful syntax highlighting:

```typescript
interface BlogPost {
  title: string;
  date: string;
  content: string;
  tags?: string[];
}

const welcome = (name: string): string => {
  return `Welcome to the blog, ${name}!`;
};

console.log(welcome("Developer"));
```

## Lists

### Unordered
- Item 1
- Item 2
  - Sub-item A
  - Sub-item B
- Item 3

### Ordered
1. First step
2. Second step
3. Third step

## External Links
Check out the [Next.js Documentation](https://nextjs.org) or visit [GitHub](https://github.com).

---
Return to [Home](home.md).
