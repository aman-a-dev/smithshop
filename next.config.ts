import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    globalNotFound: true
  },
  serverExternalPackages: ['grammy', 'fazercards']
}

export default nextConfig
