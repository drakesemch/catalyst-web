/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

import { withHighlightConfig } from '@highlight-run/next/config';

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ["canvas", ...config.externals];
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };

    return config;
  },
  images: {
    remotePatterns: [
      {
        // lh3.googleusercontent.com
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "*.instructure.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        port: "",
        pathname: "/npm/**",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: "",
        pathname: "/images/icons/emoji/**",
      },
    ],
  },
};

export default (await import("@next/mdx")).default()(
  (await import("@vercel/toolbar/plugins/next")).default()(withHighlightConfig(config)),
);
