import { getAllPosts } from '../../lib/api'
import Layout from '../../components/misc/layout'
import PostPreview from '../../components/blog/post-preview'
import { NextSeo } from 'next-seo'
import { BLOG_CONFIG } from '../../lib/config'
import Link from 'next/link'
import type PostType from '../../interfaces/post'

type Props = {
  tag: string
  posts: PostType[]
}

export default function TagPage({ tag, posts }: Props) {
  return (
    <Layout>
      <NextSeo
        title={`#${tag}`}
        description={`All posts tagged #${tag} — by ${BLOG_CONFIG.author.name}.`}
        canonical={`${BLOG_CONFIG.siteUrl}/tags/${tag}`}
      />
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="max-w-3xl pb-12 md:pb-20">
              <Link href="/blog" className="text-sm text-gray-500 dark:text-gray-400 hover:underline mb-4 block">← All posts</Link>
              <h1 className="h1 mb-2">#{tag}</h1>
              <p className="text-gray-500 dark:text-gray-400">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="max-w-3xl">
              {posts.map((post) => (
                <PostPreview
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  author={post.author}
                  slug={post.slug}
                  tags={post.tags}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

function isExcluded(slug: string): boolean {
  return BLOG_CONFIG.blogExcludedSlugs.some((pattern) => {
    if (pattern.endsWith('/*')) return slug.startsWith(pattern.slice(0, -2) + '/')
    return slug === pattern
  })
}

export async function getStaticProps({ params }: { params: { tag: string } }) {
  const tag = params.tag
  const posts = (await getAllPosts(['slug', 'title', 'date', 'excerpt', 'author', 'tags']))
    .filter((post) => !isExcluded(post.slug))
    .filter((post) => (post.tags as unknown as string[] | undefined)?.includes(tag))
  return {
    props: { tag, posts },
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts(['slug', 'tags'])
  const tags = new Set<string>()
  posts.forEach((post) => {
    const t = post.tags as unknown as string[] | undefined
    t?.forEach((tag) => tags.add(tag))
  })
  return {
    paths: Array.from(tags).map((tag) => ({ params: { tag } })),
    fallback: false,
  }
}
