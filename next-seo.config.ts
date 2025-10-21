import { DefaultSeoProps } from "next-seo";

const description = "Exploring tech, cybersecurity and digital life from the core."
// See https://www.npmjs.com/package/next-seo for more options
const config: DefaultSeoProps = {
  titleTemplate: "%s | Kyle",
  defaultTitle: "Tech, Cyber and Code by Kyle",
  description,

  openGraph: {
    type: 'website',
    locale: 'en_AU',
    title: 'Kyle',
    description,
  },
  additionalMetaTags: [
    {
      name: 'apple-mobile-web-app-title',
      content: 'Kyle'
    }
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon/favicon-96x96.png',
      sizes: '96x96'
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon/favicon.svg',
      sizes: '96x96'
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon/apple-touch-icon.png"
    },
    {
      rel: "shortcut icon",
      type: "image/png",
      href: "/favicon/favicon.ico"
    },
    {
      rel: "manifest",
      href: "/favicon/site.webmanifest"
    }
  ]
};

export default config;
