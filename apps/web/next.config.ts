import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@a11y-lens/a11y-companion"],
  webpack: (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "styled-system": path.join(__dirname, "styled-system"),
    };
    return config;
  },
};

export default nextConfig;
