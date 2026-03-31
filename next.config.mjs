import { fileURLToPath } from "node:url";

/** Patch server webpack runtime: numeric chunk ids live in ./chunks/, named chunks (e.g. vendor-chunks/next) stay in ./ */
function patchServerRuntimePlugin() {
  return {
    name: 'patch-server-runtime-chunk-path',
    apply: (compiler) => {
      compiler.hooks.emit.tap('patch-server-runtime-chunk-path', (compilation) => {
        for (const name of Object.keys(compilation.assets)) {
          const asset = compilation.assets[name];
          let source = asset.source().toString();
          if (!source.includes('require("./" + __webpack_require__.u(chunkId))')) continue;
          // Only add "chunks/" for numeric chunk ids (e.g. 5611); named ids like "vendor-chunks/next" stay as ./
          source = source.replace(
            /require\("\.\/" \+ __webpack_require__\.u\(chunkId\)\)/g,
            'require((/^\\d+$/.test(chunkId) ? "./chunks/" : "./") + __webpack_require__.u(chunkId))'
          );
          compilation.assets[name] = { source: () => source, size: () => source.length };
          break;
        }
      });
    },
  };
}

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@mui/material',
      '@mui/icons-material',
      'recharts',
      'date-fns',
      'lodash',
    ],
    optimizeCss: true,
    scrollRestoration: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  output: 'export',
  /** GitHub Pages serves `/about/` as `about/index.html`. Without this, only `/about` / `about.html` work and `/about/?…` 404s (common for AI/chat links). */
  trailingSlash: true,

  images: {
    unoptimized: true,
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    domains: ['images.unsplash.com', 'lpklmquhxgbpavjngbby.supabase.co'],
  },

  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,

  transpilePackages: [],

  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      // Deterministic moduleIds for better long-term caching (unchanged modules keep hash).
      // Avoid overriding Next's dev strategy — can break Fast Refresh / chunk graphs.
      config.optimization.moduleIds = 'deterministic'
    }
    // Fix server chunk resolution: runtime does require("./chunkId.js") but chunks live in ./chunks/
    if (isServer) {
      config.plugins = config.plugins || []
      config.plugins.push(patchServerRuntimePlugin())
    }
    return config
  },
}

export default nextConfig
