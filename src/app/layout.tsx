import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import PwaRegistrar from "@/components/pwa-registrar";
import PwaInstallPrompt from "@/components/pwa-install-prompt";

export const metadata: Metadata = {
  title: "Celys Care — Wellness Companion & Mindfulness Sanctuary",
  description:
    "Your safe space. Your support. Your journey. Celys Care is a compassionate mindfulness and mental wellness companion featuring guided meditation, emotional check-ins, AI support, breathwork, and ambient soundscapes.",
  keywords: [
    "wellness",
    "mindfulness",
    "mental health",
    "meditation",
    "journaling",
    "breathwork",
    "ambient sounds",
    "coping skills",
    "self-care",
  ],
  authors: [{ name: "Celys Care Team" }],
  creator: "Celys Care",
  publisher: "Celys Care",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://celyscare.com",
    title: "Celys Care — Wellness Companion",
    description:
      "A compassionate safe space for mindfulness, emotional regulation, and gentle self-care.",
    siteName: "Celys Care",
  },
  twitter: {
    card: "summary_large_image",
    title: "Celys Care — Wellness Companion",
    description:
      "Your safe space. Your support. Your journey. ♡",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0a1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('celys_a11y_high_contrast')==='true'){document.documentElement.classList.add('high-contrast');}if(localStorage.getItem('celys_a11y_large_text')==='true'){document.documentElement.classList.add('large-text');}if(localStorage.getItem('celys_a11y_reduced_motion')==='true'){document.documentElement.classList.add('reduce-motion');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0d0a1e] text-[#f0e8ff] antialiased selection:bg-[#c96ccc]/30 selection:text-white">
        <PwaRegistrar />
        <Providers>
          {children}
          <PwaInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
