import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Allow YouTube iframes to load and autoplay
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://www.googletagmanager.com",
              "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
              "img-src 'self' data: blob: https://img.youtube.com https://i.ytimg.com https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://unpkg.com",
              "media-src 'self' blob:",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://www.googleapis.com https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
