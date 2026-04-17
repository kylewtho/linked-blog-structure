import Layout from '../components/misc/layout'
import { NextSeo } from 'next-seo'
import { BLOG_CONFIG } from '../lib/config'

export default function About() {
  return (
    <Layout>
      <NextSeo
        title="About"
        description={`About ${BLOG_CONFIG.author.name}.`}
        canonical={`${BLOG_CONFIG.siteUrl}/about`}
      />
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="h1 mb-4">About</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">Coming soon.</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
