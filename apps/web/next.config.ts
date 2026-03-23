import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  transpilePackages: ['@a11y-lens/a11y-companion'],
  webpack: (config) => {
    config.resolve ??= {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'styled-system': path.join(__dirname, 'styled-system'),
    }
    return config
  },
  turbopack: {
    resolveAlias: {
      'styled-system': path.join(__dirname, 'styled-system'),
    },
  },
}

export default nextConfig
