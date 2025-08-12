import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/contexts/language-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { QueryProvider } from '@/components/providers/query-provider';
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
