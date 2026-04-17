export const BLOG_CONFIG = {
  title: "Kyle",
  description: "Kyle's personal blog and digital garden.",
  author: {
    name: "Kyle",
    picture: "https://avatars.githubusercontent.com/u/55761838?v=4",
    bio: "Software Engineer & Digital Gardener",
    github: "kylewtho",
  },
  navLinks: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
    { name: "Resources", href: "/resources" },
    { name: "Resume", href: "https://cv.kyleho.net" },
  ],
  footerLinks: [
    { name: "GitHub", href: "https://github.com/kylewtho" },
    { name: "Mastodon", href: "https://infosec.exchange/@kriegerkh" },
    { name: "LinkedIn", href: "https://linkedin.com/in/kylewtho" },
  ],
  featuredPosts: [
    { slug: 'articles/self-trust', title: 'Self-Trust' },
  ] as { slug: string; title: string }[],
  // Slugs excluded from the /blog feed.
  // - Exact slug:    'home'            → excludes home.md only
  // - Folder prefix: 'descriptions/*'  → excludes all files inside descriptions/
  blogExcludedSlugs: [
    'home',
    'faq',
    'privacy-policy',
    'projects',
    'resources',
    'terms-and-conditions',
    'descriptions/*',
    'placeholders/*',
    'tutorials/*',
    'archive/*',
    'CLAUDE*',
    'AGENTS*',
  ],
  siteUrl: "https://kyleho.net",
}
