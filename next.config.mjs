import { AlphaTabWebPackPlugin } from '@coderline/alphatab/webpack'

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.plugins.push(
      new AlphaTabWebPackPlugin({
        assetOutputDir: 'public/alphatab'
      }),
    )
    return config;
  },
  images: {
    domains: ["crimson-active-horse-520.mypinata.cloud"],
  }
};

export default nextConfig;