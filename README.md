# Kyle's Blog

A personal blog built with Next.js and Obsidian, designed for a high-performance and seamless reading experience.

## Features
- **Obsidian Integration:** Supports core Obsidian syntax, including links and link previews.
- **Folder-based Routing:** URLs are automatically generated based on the vault's folder structure.
- **Full-text Search:** Quickly find content across the entire blog.
- **Static Generation:** Built with Next.js for superior performance and SEO.

![Blog Demo](/common_md/attachments/fn-website-demo.gif)

## Development

### Prerequisites
- Node.js (v18+)
- npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Tooling
This project uses **Biome** for formatting and linting.

- **Format code:** `npm run format`
- **Lint code:** `npm run lint`
- **Type check:** `npm run typecheck`

## Content Management
Content is managed in a separate Obsidian vault and synced to this repository. See `AGENTS.md` for more details on the repository architecture and build pipeline.
