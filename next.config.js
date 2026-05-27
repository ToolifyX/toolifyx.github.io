const isProd = process.env.NODE_ENV === "production";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ⚠️ CRITICAL: static export mode
  trailingSlash: true,
  images: {
    unoptimized: true, // required for GitHub Pages
  },
  basePath: isProd ? "/toolifyx.github.io" : "",
  assetPrefix: isProd ? "/toolifyx.github.io/" : "",
};

module.exports = nextConfig;