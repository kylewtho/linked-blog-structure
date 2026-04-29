import Link from "next/link";
import Image from "next/image";
import Layout from "../components/misc/layout";
import { NextSeo } from "next-seo";

export default function NotFound() {
  return (
    <Layout>
      <NextSeo title="404 — Page Not Found" noindex={true} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-8xl font-semibold tracking-display text-gray-900 dark:text-gray-100 mb-4">
              404
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
              This page doesn't exist.
            </p>
            <div className="flex justify-center mb-10">
              <Image
                src="/md_assets/attachments/kyle-noclue.png"
                alt="Kyle has no clue"
                width={220}
                height={220}
                className="rounded-2xl"
              />
            </div>
            <div className="flex justify-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-400 transition"
              >
                Home
              </Link>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-900 dark:text-gray-100 underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-400 transition"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
