import type { NextConfig } from "next";

// Set to "/<repo>" when hosting under a GitHub Pages project subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emits a fully static site to `out/` — no server, no data leaving the browser.
  output: "export",
  // Directory-style URLs so any static host resolves them without rewrites.
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};
export default nextConfig;
