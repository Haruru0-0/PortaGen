import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ['youtubei.js', 'quickjs-emscripten'],
  outputFileTracingIncludes: {
    '/api/music/youtube/**': ['./node_modules/@jitl/quickjs-wasmfile-release-sync/**/*.wasm'],
    '/api/desktop/music': ['./node_modules/@jitl/quickjs-wasmfile-release-sync/**/*.wasm'],
  },
  images: {
    unoptimized: true, // Disable image optimization
  },
};

export default withNextVideo(nextConfig, { folder: 'src/assets' });
