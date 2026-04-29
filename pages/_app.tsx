import type { AppProps } from "next/app";
import "../styles/index.css";
import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import { geist, geistMono } from "../lib/fonts";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${geist.variable} ${geistMono.variable} font-sans`}>
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </div>
  );
}
