import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "@apollo/client",
      "react-hot-toast",
      "formik",
      "yup",
    ],
  },

  // Enable standalone output for Docker
  output: "standalone",

  compress: true,
  trailingSlash: false,

  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },

  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
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

  poweredByHeader: false,
  reactStrictMode: true,

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
