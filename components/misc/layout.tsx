import React from 'react'
import Footer from './footer'
import Header from './header'
import ScrollProgress from './scroll-progress'
import { geist, geistMono } from '../../lib/fonts'

type Props = {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <div className={`${geist.className} ${geistMono.variable} flex flex-col min-h-screen overflow-hidden bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100`}>
      <ScrollProgress />
      <Header />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
