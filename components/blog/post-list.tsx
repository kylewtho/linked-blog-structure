import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import PostPreview from './post-preview'
import type PostType from '../../interfaces/post'
import { BLOG_CONFIG } from '../../lib/config'

const POSTS_PER_PAGE = 10

type Props = {
  posts: PostType[]
}

function PostList({ posts }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  const paginated = useMemo(
    () => posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    [posts, page]
  )

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          <div className="max-w-3xl pb-12 md:pb-20 text-center md:text-left">
            <h1 className="h1 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">Notes on tech, cybersecurity, and things I&apos;m learning.</p>
          </div>

          <div className="md:flex md:justify-between">

            {/* Articles */}
            <div className="md:grow -mt-4">
              {paginated.map((post) => (
                <PostPreview
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  author={post.author}
                  slug={post.slug}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo(0, 0) }}
                      className={`px-3 py-1 rounded ${p === page ? 'bg-gray-900 text-white' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Posts Sidebar — only shown when featuredPosts is populated in lib/config.ts */}
            {BLOG_CONFIG.featuredPosts.length > 0 && (
              <aside className="relative mt-12 md:mt-0 md:w-64 md:ml-12 lg:ml-20 md:shrink-0">
                <h4 className="text-lg font-bold leading-snug tracking-tight mb-4">Featured Posts</h4>
                <ul className="-my-2">
                  {BLOG_CONFIG.featuredPosts.map((post) => (
                    <li className="flex py-2 border-b border-gray-200" key={post.slug}>
                      <article>
                        <h3 className="font-medium mb-1">
                          <Link href={`/${post.slug}`} className="hover:underline">
                            {post.title}
                          </Link>
                        </h3>
                      </article>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

          </div>
        </div>
      </div>
    </section>
  )
}

export default PostList
