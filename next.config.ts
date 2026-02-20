/**
 * @author Zakaria Tejjani
 * @date 2025-12-10
 */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "amanaexpress.s3.us-east-1.amazonaws.com",
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.youcan.shop",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
