import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://on-snip.org"),
  title: "on-snip | Real-time Collaborative Messaging Rooms",
  description:
    "Create and join instant messaging rooms for real-time collaboration. Share ideas, discuss projects, and communicate effortlessly with on-snip's live data streaming platform.",
  keywords: [
    "real-time messaging",
    "collaborative rooms",
    "live chat",
    "instant communication",
    "team collaboration",
    "socket.io",
    "Next.js",
    "Redis",
  ],
  authors: [{ name: "Sanyam" }],
  creator: "Sanyam",
  publisher: "Sanyam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "on-snip | Real-time Collaborative Messaging Rooms",
    description:
      "Create and join instant messaging rooms for real-time collaboration. Share ideas, discuss projects, and communicate effortlessly with on-snip's live data streaming platform.",
    url: "https://on-snip.org",
    siteName: "on-snip",
    images: [
      {
        url: "https://on-snip.org/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "on-snip collaborative messaging platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "on-snip | Real-time Collaborative Messaging Rooms",
    description:
      "Create and join instant messaging rooms for real-time collaboration. Share ideas, discuss projects, and communicate effortlessly.",
    images: ["https://on-snip.org/twitter-image.jpg"],
    creator: "@prodmxle",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  applicationName: "on-snip",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-900`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
