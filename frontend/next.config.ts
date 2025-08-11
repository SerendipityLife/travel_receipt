import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  // 로딩 애니메이션 비활성화
  experimental: {
    optimizePackageImports: ['remixicon'],
  },
};

export default nextConfig;
