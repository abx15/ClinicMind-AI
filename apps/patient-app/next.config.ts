import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@clinicmind/ui', '@clinicmind/types', '@clinicmind/config'],
  experimental: {
    optimizePackageImports: ['@clinicmind/ui']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  poweredByHeader: false,
  compress: true,
}

export default nextConfig
