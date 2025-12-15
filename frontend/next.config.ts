import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Set turbopack root to current directory (frontend) to avoid confusion with backend lockfile
  // This silences the warning about multiple lockfiles detected
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
