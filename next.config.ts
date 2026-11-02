import type { NextConfig } from "next";
import { getApiBaseUrl } from "./src/lib/env";

getApiBaseUrl();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  poweredByHeader: false,
  // The local auth origin uses 127.0.0.1; next dev otherwise starts as localhost.
  allowedDevOrigins: ["127.0.0.1"],
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
