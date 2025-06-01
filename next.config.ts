import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: ".next",
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true, // This allows the build to succeed despite TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // This allows the build to succeed despite lint errors
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  // Set your base path here. For example: '/moatbuild' or '/my-app'
  // Leave it as undefined or remove it to use the root path
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default nextConfig;
