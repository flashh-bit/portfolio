import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://flashh-portfolio.netlify.app"),
  title: {
    default: "Krishna | Web Designer & AI Expert",
    template: "%s | Krishna",
  },
  description: "Senior Frontend Engineer specialized in high-performance, responsive web design and AI integration.",
  keywords: ["Web Designer", "Frontend Engineer", "Next.js", "React", "AI Expert", "Portfolio", "Krishna"],
  authors: [{ name: "Krishna", url: "https://flashh-portfolio.netlify.app" }],
  creator: "Krishna",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flashh-portfolio.netlify.app",
    title: "Krishna | Web Designer & AI Expert",
    description: "Senior Frontend Engineer specialized in high-performance, responsive web design.",
    siteName: "Krishna Portfolio",
    images: [
      {
        url: "/avatar_v2.jpg", // Uses your profile pic as the social share image
        width: 1200,
        height: 630,
        alt: "Krishna - Web Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishna | Web Designer & AI Expert",
    description: "Senior Frontend Engineer specialized in high-performance, responsive web design.",
    images: ["/avatar_v2.jpg"],
    creator: "@uchihaaitachi03",
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
};

import { GoogleAnalytics } from "@next/third-parties/google";
import { BrowserGuard } from "@/components/BrowserGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BrowserGuard />
        {children}
        <GoogleAnalytics gaId="G-19MY0F9T66" />
      </body>
    </html>
  );
}
