import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@clinicmind/ui', '@clinicmind/types', '@clinicmind/config'],
}

export default nextConfig
