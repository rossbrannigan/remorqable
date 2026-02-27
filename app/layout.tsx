import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://remorqable.com"),

  title: {
    default: "The Remorqable Channel — Travel Stories from Southeast Asia",
    template: "%s | The Remorqable Channel",
  },
  description:
    "Cinematic travel storytelling across Cambodia, Thailand, Vietnam and beyond. Raw, honest adventures from Southeast Asia — subscribe on YouTube.",
  keywords: [
    "Cambodia travel", "Southeast Asia travel vlog", "Remorqable",
    "travel YouTube channel", "Cambodia YouTube", "Thailand travel",
    "Phnom Penh vlog", "Angkor Wat", "remorque Cambodia",
    "travel stories", "backpacking Southeast Asia",
  ],
  authors: [{ name: "The Remorqable Channel", url: "https://remorqable.com" }],
  creator: "The Remorqable Channel",
  publisher: "The Remorqable Channel",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://remorqable.com",
    siteName: "The Remorqable Channel",
    title: "The Remorqable Channel — Travel Stories from Southeast Asia",
    description:
      "Cinematic travel storytelling across Cambodia, Thailand, Vietnam and beyond. Raw, honest adventures from Southeast Asia.",
    images: [
      {
        url: "/logo.png",
        width: 500,
        height: 500,
        alt: "The Remorqable Channel",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "The Remorqable Channel — Travel Stories from Southeast Asia",
    description:
      "Cinematic travel storytelling across Cambodia, Thailand and beyond.",
    images: ["/logo.png"],
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
    icon: [{ url: "/favicon.ico" }],
    apple: "/apple-touch-icon.png",
  },

  alternates: {
    canonical: "https://remorqable.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD structured data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "The Remorqable Channel",
              url: "https://remorqable.com",
              description: "Cinematic travel storytelling across Southeast Asia and beyond.",
              publisher: {
                "@type": "Organization",
                name: "The Remorqable Channel",
                logo: {
                  "@type": "ImageObject",
                  url: "https://remorqable.com/logo.png",
                },
              },
              sameAs: ["https://www.youtube.com/@remorqable"],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-H0VRCNW4TD"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-H0VRCNW4TD');
      `}</Script>
    </html>
  );
}
