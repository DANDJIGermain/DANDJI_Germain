
const basePath = process.env.BASE_PATH || "";

const nextConfig = {
  basePath,
  ...(basePath && { assetPrefix: basePath }),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
