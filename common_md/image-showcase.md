---
title: Image Showcase
excerpt: Demonstrating how images are handled, optimized, and displayed in your blog posts.
date: "2026-04-13"
tags: [images, design]
---

# Image Showcase

Images are a crucial part of any blog. This project handles them efficiently to ensure fast loading and high scores in Core Web Vitals (like CLS).

## Standard Images

You can include images using the standard Markdown syntax:

![Example Image](attachments/clone-or-download-github.png)

## Optimized Images

When the blog is built, images are processed. If they are stored locally in the `attachments` folder, the blog will:
1. Copy them to the public directory.
2. Calculate their dimensions to prevent Layout Shift.
3. Serve them with proper caching.

## Animated GIFs

Animated GIFs are also supported:

![Demo GIF](attachments/fn-website-demo.gif)

## Captions
You can add captions by placing text directly below an image, or just using the alt text which some themes display as a caption.

---
Back to [Home](home.md).
