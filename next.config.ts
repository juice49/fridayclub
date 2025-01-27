import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    // useLightningcss: true,
    dynamicIO: true,
  },
}

export default nextConfig
