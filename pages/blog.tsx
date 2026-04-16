import { getAllPosts } from '../lib/api'
import Layout from '../components/misc/layout'
import PostList from '../components/blog/post-list'
import { NextSeo } from 'next-seo'
import { BLOG_CONFIG } from '../lib/config'
import type PostType from '../interfaces/post'

type Props = {
  posts: PostType[]
}

export default function Blog({ posts }: Props) {
  return (
    <Layout>
      <NextSeo
        title="Blog"
        description={`Notes on tech, cybersecurity and things I'm learning — by ${BLOG_CONFIG.author.name}.`}
        canonical={`${BLOG_CONFIG.siteUrl}/blog`}
      />
      <PostList posts={posts} />
    </Layout>
  )
}

function isExcluded(slug: string): boolean {
  return BLOG_CONFIG.blogExcludedSlugs.some((pattern) => {
    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -2) // strip trailing /*
      return slug.startsWith(prefix + '/')
    }
    return slug === pattern
  })
}

export async function getStaticProps() {
  const posts = (await getAllPosts(['slug', 'title', 'date', 'excerpt', 'author', 'tags']))
    .filter((post) => !isExcluded(post.slug))
  return {
    props: { posts },
  }
}
