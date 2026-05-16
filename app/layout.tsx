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
  title: {
    default: "R3ACTR | Driving Software Innovation & Advanced Research",
    template: "%s | R3ACTR",
  },
  description: "R3ACTR specializes in building innovative software solutions, cutting-edge AI & Web3 applications, SaaS platforms, and research-driven projects with a global remote reach.",
  keywords: ["R3ACTR", "Software Innovation", "Open Source Quest", "AI Research", "Web3 Applications", "SaaS Development", "Remote Software Agency", "Medical Imaging AI", "XAI"],
  authors: [{ name: "R3ACTR Innovations", url: "https://r3actr.work" }],
  creator: "R3ACTR Innovations",
  publisher: "R3ACTR Innovations",
  metadataBase: new URL("https://r3actr.work"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://r3actr.work",
    title: "R3ACTR | Driving Software Innovation & Advanced Research",
    description: "R3ACTR specializes in building innovative software solutions, cutting-edge AI & Web3 applications, SaaS platforms, and research-driven projects with a global remote reach.",
    siteName: "R3ACTR",
    images: [
      {
        url: "/Images/r3actr.png",
        width: 1200,
        height: 630,
        alt: "R3ACTR Innovations Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "R3ACTR | Driving Software Innovation & Advanced Research",
    description: "R3ACTR specializes in building innovative software solutions, cutting-edge AI & Web3 applications, SaaS platforms, and research-driven projects with a global remote reach.",
    images: ["/Images/r3actr.png"],
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
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
