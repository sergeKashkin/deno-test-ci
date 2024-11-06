import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'host.docker.internal',
        port: '3001',
        pathname: '**'
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3001',
        pathname: '**',
      }
    ],
  }
};

export default nextConfig;
