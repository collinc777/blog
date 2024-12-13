import Footer from "@/app/_components/footer";
import { BLOG_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import cn from "classnames";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: BLOG_NAME,
  description: "Thoughts on software engineering, AI, and building great products.",
  applicationName: BLOG_NAME,
  authors: [{ name: "Collin Caram", url: "https://github.com/collinc777" }],
  generator: "Next.js",
  keywords: ["Software Engineering", "AI", "Product Development", "Engineering Blog", "Tech Blog"],
  creator: "Collin Caram",
  publisher: "Collin Caram",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://collincaram.com',
    title: BLOG_NAME,
    description: "Thoughts on software engineering, AI, and building great products.",
    siteName: BLOG_NAME,
    images: [{
      url: HOME_OG_IMAGE_URL,
      width: 1200,
      height: 630,
      alt: "Collin Caram's Blog",
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_NAME,
    description: "Thoughts on software engineering, AI, and building great products.",
    creator: '@collincaram',
    images: [HOME_OG_IMAGE_URL],
  },
  alternates: {
    canonical: 'https://collincaram.com',
    types: {
      'application/rss+xml': 'https://collincaram.com/feed.xml',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
        className={cn(inter.className, "bg-slate-900 text-slate-400")}
      >
        <div className="min-h-screen">{children}</div>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
