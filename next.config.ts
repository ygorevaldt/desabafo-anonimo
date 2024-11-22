import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  publicRuntimeConfig: {
    baseUrl: process.env.BASE_URL,
  },
};

export default nextConfig;
