import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Script from "next/script";
import AnalyticsTracker from "@/components/analytics";

const tomoBossa = localFont({
  src: "./fonts/TOMO Bossa Black Rough.woff2",
  variable: "--font-tomo-bossa",
  display: "swap",
});

const neueMontreal = localFont({
  src: [
    { path: "./fonts/NeueMontreal-Light.otf", weight: "300", style: "normal" },
    {
      path: "./fonts/NeueMontreal-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-Regular.otf",
      weight: "400",
      style: "normal",
    },
    { path: "./fonts/NeueMontreal-Italic.otf", weight: "400", style: "italic" },
    { path: "./fonts/NeueMontreal-Medium.otf", weight: "500", style: "normal" },
    {
      path: "./fonts/NeueMontreal-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    { path: "./fonts/NeueMontreal-Bold.otf", weight: "700", style: "normal" },
    {
      path: "./fonts/NeueMontreal-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-neue-montreal",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Two Cents Club",
  description: "A social platform for sharing and discovering new ideas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WXFS6QMZ0Z"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // Disable automatic page_view to avoid double counts in SPA
            gtag('config', 'G-WXFS6QMZ0Z', { send_page_view: false });
          `}
        </Script>
      </head>
      <body
        className={`${tomoBossa.variable} ${neueMontreal.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
