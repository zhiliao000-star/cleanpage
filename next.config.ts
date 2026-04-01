import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: ["jsdom"],
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
