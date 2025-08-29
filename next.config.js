const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'out',
  reactStrictMode: true,
  swcMinify: true,
  // async redirects() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: 'https://indiehub.best',
  //       permanent: true,
  //     },
  //   ];
  // },
  images: {
    // https://vercel.com/docs/image-optimization/managing-image-optimization-costs#minimizing-image-optimization-costs
    // vercel has limits on image optimization, 1000 images per month
    unoptimized: true,
    // https://medium.com/@niniroula/nextjs-upgrade-next-image-and-dangerouslyallowsvg-c934060d79f8
    // The requested resource "https://cdn.sanity.io/images/58a2mkbj/preview/xxx.svg?fit=max&auto=format" has type "image/svg+xml" 
    // but dangerouslyAllowSVG is disabled
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com", // https://www.sanity.io/learn/course/day-one-with-sanity-studio/bringing-content-to-a-next-js-front-end
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
   // 👇 新增的部分
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withContentlayer(nextConfig);


