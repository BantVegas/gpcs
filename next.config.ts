// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: '.', // vynúť koreň na aktuálny projekt
  },
}

export default nextConfig
