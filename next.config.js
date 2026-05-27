const repo = "toolifyx.github.io";

const nextConfig = {
  output: "export",
  trailingSlash: true,

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;