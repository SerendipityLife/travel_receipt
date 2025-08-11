import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 환경에서는 정적 내보내기 비활성화
  // output: "export",
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
