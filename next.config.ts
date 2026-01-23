import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    unoptimized: true, // Disable image optimization
  },
};

export default withNextVideo(nextConfig, { folder: 'src/assets' });
