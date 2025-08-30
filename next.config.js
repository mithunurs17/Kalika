/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Removed to allow dynamic API routes
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Memory optimization settings
  experimental: {
    memoryBasedWorkers: true,
  },
  // Increase memory limit for large data processing
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
