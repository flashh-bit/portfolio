import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vercel/analytics"],
  experimental: {},
};

export default nextConfig;
