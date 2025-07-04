import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */ eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },{
          protocol:'https',
          hostname:'assets.aceternity.com'
        },{
          protocol:'https',
          hostname:'i.ytimg.com'
        }
      ],
    },
  
};

export default nextConfig;
