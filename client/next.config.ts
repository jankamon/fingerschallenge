import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      root: "..",
      resolveAlias: {
        "@shared": "../shared/*",
      },
    },
  },
};

export default nextConfig;
