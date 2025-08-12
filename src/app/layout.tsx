import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { QueryProvider } from '@/components/providers/query-provider';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakEasy - Master English with Confidence",
  description: "Your comprehensive English learning companion with structured vocabulary, grammar lessons, and interactive practice sessions.",
  keywords: "English learning, vocabulary, grammar, language practice, ESL, EFL",
  authors: [{ name: "SpeakEasy Team" }],
  creator: "SpeakEasy",
  publisher: "SpeakEasy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "SpeakEasy - Master English with Confidence",
    description: "Your comprehensive English learning companion with structured vocabulary, grammar lessons, and interactive practice sessions.",
    url: "/",
    siteName: "SpeakEasy",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SpeakEasy - English Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeakEasy - Master English with Confidence",
    description: "Your comprehensive English learning companion with structured vocabulary, grammar lessons, and interactive practice sessions.",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="SpeakEasy" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SpeakEasy" />
        <meta name="description" content="Master English with AI-powered learning" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-167x167.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Splash Screen */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SpeakEasy" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-touch-icon" content="/icons/icon-152x152.png" />
        <meta name="apple-touch-icon-precomposed" content="/icons/icon-152x152.png" />
        <meta name="apple-touch-icon-precomposed" sizes="152x152" content="/icons/icon-152x152.png" />
        <meta name="apple-touch-icon-precomposed" sizes="167x167" content="/icons/icon-167x167.png" />
        <meta name="apple-touch-icon-precomposed" sizes="180x180" content="/icons/icon-180x180.png" />
        <meta name="apple-touch-icon-precomposed" sizes="1024x1024" content="/icons/icon-1024x1024.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <QueryProvider>
            <ThemeProvider>
              <LanguageProvider>
                {children}
                <Toaster />
              </LanguageProvider>
            </ThemeProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
