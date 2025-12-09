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
  title: "AI Image to Audio Accessibility Tool",
  description:
    "Convert images into clear spoken audio descriptions using AI. Built for blind and low-vision users with real-time text-to-speech and full screen reader support.",
  keywords: [
    "AI accessibility",
    "image to audio",
    "text to speech",
    "blind users",
    "vision to speech",
    "Next.js AI app",
    "OpenAI vision",
    "web accessibility"
  ],
  authors: [{ name: "Marco Fernstaedt" }],
  openGraph: {
    title: "AI Image to Audio Accessibility Tool",
    description:
      "Upload an image and instantly receive an AI-generated spoken description designed for blind and low-vision users.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image to Audio Accessibility Tool",
    description:
      "Real-time AI vision to speech for blind and low-vision users.",
  },
};


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
        {children}
      </body>
    </html>
  );
}
