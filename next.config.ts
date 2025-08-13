import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react'],
    
    // Enable server actions
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Configure webpack for better bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size in production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Configure images optimization
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Configure PWA
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw.js',
      },
      {
        source: '/manifest.json',
        destination: '/manifest.json',
      },
    ];
  },
};

export default nextConfig;
