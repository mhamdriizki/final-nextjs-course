import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prisma client uses native binaries — prevent Next.js from bundling them
  serverExternalPackages: ['@prisma/client', 'prisma'],
  images: {
    remotePatterns: [
      { hostname: '*.ufs.sh' },
      { hostname: 'utfs.io' },
    ],
  },
}

export default nextConfig
