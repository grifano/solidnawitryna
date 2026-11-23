import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Storybook збирається в public/storybook. Next не віддає index.html для теки,
  // тому /storybook перенаправляємо на файл. Саме redirect, а не rewrite:
  // Storybook підключає файли відносними шляхами, їм потрібна адреса з /index.html.
  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: false,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
