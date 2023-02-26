const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  experimental: {
    // appDir: true,
  },
  headers: async () => [
    {
      // list more extensions here if needed; these are all the resources in the `public` folder including the subfolders
      source: '/assets/:all',
      locale: false,
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=86400, stale-while-revalidate',
        },
      ],
    },
  ],
});

module.exports = nextConfig;
