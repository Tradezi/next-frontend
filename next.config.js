/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['utfs.io']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend.tradezi.co.in/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
