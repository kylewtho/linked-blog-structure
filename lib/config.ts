export const BLOG_CONFIG = {
  title: "Kyle",
  description: "Kyle's personal blog and digital garden.",
  author: {
    name: "Kyle",
    picture: "https://avatars.githubusercontent.com/u/55761838?v=4",
    bio: "Software Engineer & Digital Gardener",
    twitter: "@kylewtho",
    github: "kylewtho",
  },
  navLinks: [
    { name: "About", href: "https://kyleho.net" },
    { name: "Blog", href: "/blog" }, // Updated to our new blog feed path
    { name: "Projects", href: "https://kyleho.net/projects" },
    { name: "Resources", href: "https://kyleho.net/resources" },
    { name: "Resume", href: "https://cv.kyleho.net" },
  ],
  footerLinks: [
    { name: "X", href: "https://x.com/kylewtho" },
    { name: "GitHub", href: "https://github.com/kylewtho" },
    { name: "LinkedIn", href: "https://linkedin.com/in/kylewtho" },
  ],
  featuredPosts: [] as { slug: string; title: string }[],
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
    'tutorials/*'
  ],
  siteUrl: "https://kyleho.net",
}
