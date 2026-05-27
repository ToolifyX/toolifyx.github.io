/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If you are deploying to username.github.io, you can keep basePath as ''
  // If you are deploying to username.github.io/repo-name, set basePath to '/repo-name'
  basePath: isProd ? '' : '',
  assetPrefix: isProd ? '' : '',
};

module.exports = nextConfig;
