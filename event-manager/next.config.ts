import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "@apollo/client",
      "react-hot-toast",
      "formik",
      "yup",
    ],
  },

  // Enable compression
  compress: true,

  // Enable static optimization
  trailingSlash: false,

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },

  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      // Dynamically import bundle analyzer only when needed
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const BundleAnalyzerPlugin = require("@next/bundle-analyzer");
      config.plugins?.push(
        new BundleAnalyzerPlugin({
          enabled: true,
        })
      );
      return config;
    },
  }),

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/graphql",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
