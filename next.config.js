/** @type {import('next').NextConfig} */
const isMobileExport = process.env.NEXT_PUBLIC_IS_CAPACITOR_BUILD === "true";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(isMobileExport ? { output: "export" } : {}),
  images: {
    unoptimized: isMobileExport,
    domains: ["images.unsplash.com", "api-cdn.figma.com"],
  },
  ...(!isMobileExport
    ? {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: [
                {
                  key: "X-Content-Type-Options",
                  value: "nosniff",
                },
                {
                  key: "X-Frame-Options",
                  value: "DENY",
                },
                {
                  key: "X-XSS-Protection",
                  value: "1; mode=block",
                },
              ],
            },
            {
              source: "/sw.js",
              headers: [
                {
                  key: "Content-Type",
                  value: "application/javascript; charset=utf-8",
                },
                {
                  key: "Cache-Control",
                  value: "no-cache, no-store, must-revalidate",
                },
              ],
            },
          ];
        },
      }
    : {}),
};

module.exports = nextConfig;
