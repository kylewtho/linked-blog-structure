import React, { useState, useMemo } from 'react'
import PostPreview from './post-preview'
import PopularPosts from './popular-posts'
import type PostType from '../../interfaces/post'

const POSTS_PER_PAGE = 10

type Props = {
  posts: PostType[]
}

function PostList({ posts }: Props) {
  const [page, setPage] = useState(1)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Collect all unique tags across all posts
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [posts])

  const filtered = useMemo(
    () => activeTag ? posts.filter((p) => p.tags?.includes(activeTag)) : posts,
    [posts, activeTag]
  )

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE)

  const paginated = useMemo(
    () => filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
    [filtered, page]
  )

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? null : tag))
    setPage(1)
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">

          <div className="max-w-3xl pb-12 md:pb-20 text-center md:text-left">
            <h1 className="h1 mb-4">Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Notes on tech, cybersecurity, and things I&apos;m learning.</p>
          </div>

          {/* Tag filter chips */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`text-sm px-3 py-1 rounded-full border transition ${
                    activeTag === tag
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-900 dark:hover:border-gray-300'
                  }`}
                >
                  #{tag}
                </button>
              ))}
              {activeTag && (
                <button
                  onClick={() => { setActiveTag(null); setPage(1) }}
                  className="text-sm px-3 py-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  ✕ clear
                </button>
              )}
            </div>
          )}

          <div className="lg:flex lg:justify-between">

            {/* Articles */}
            <div className="md:grow -mt-4">
              {paginated.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 py-8">No posts with tag &ldquo;{activeTag}&rdquo;.</p>
              )}
              {paginated.map((post) => (
                <PostPreview
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  author={post.author}
                  slug={post.slug}
                  tags={post.tags}
                  onTagClick={handleTagClick}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo(0, 0) }}
                      className={`px-3 py-1 rounded ${p === page ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Posts Sidebar */}
            <aside className="relative mt-12 lg:mt-0 lg:w-72 lg:ml-20 shrink-0">
              <PopularPosts />
            </aside>

          </div>
        </div>
      </div>
    </section>
  )
}

export default PostList
