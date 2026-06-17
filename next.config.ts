import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Prisma client uses native binaries — prevent Next.js from bundling them
  serverExternalPackages: ['@prisma/client', 'prisma'],
}

export default nextConfig
