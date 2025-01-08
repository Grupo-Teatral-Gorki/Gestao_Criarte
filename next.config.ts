import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['styxx-public.s3.sa-east-1.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,  // Ignora os warnings do ESLint durante o build
  }
};

export default nextConfig;
