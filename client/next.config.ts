import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
