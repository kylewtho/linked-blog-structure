import type { NextApiRequest, NextApiResponse } from 'next'
import { getAllPosts } from '../../lib/api'
import { BLOG_CONFIG } from '../../lib/config'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildRss(posts: { slug: string; title: string; date?: string; excerpt?: string }[]): string {
  const siteUrl = BLOG_CONFIG.siteUrl
  const items = posts
    .map((post) => {
      const link = `${siteUrl}/${post.slug}`
      const pubDate = post.date ? new Date(post.date).toUTCString() : ''
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ''}
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''}
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(BLOG_CONFIG.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(BLOG_CONFIG.description)}</description>
    <language>en-au</language>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const posts = (getAllPosts(['slug', 'title', 'date', 'excerpt']) as unknown as { slug: string; title: string; date?: string; excerpt?: string }[]).filter(
    (post) => !BLOG_CONFIG.blogExcludedSlugs.some((pattern) => {
      if (pattern.endsWith('/*')) return post.slug.startsWith(pattern.slice(0, -2) + '/')
      return post.slug === pattern
    })
  )

  const rss = buildRss(posts)
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  res.send(rss)
}
