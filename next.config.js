const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // 🔥 bắt buộc static export
  trailingSlash: true,

  images: {
    unoptimized: true, // GitHub Pages không support Image Optimization
  },

  basePath: isProd ? "/toolifyx.github.io" : "",
  assetPrefix: isProd ? "/toolifyx.github.io/" : "",
};

module.exports = nextConfig;