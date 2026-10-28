import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// `import.meta.dirname` keeps the config loadable by Vite's native config
// loader, which warns on `__dirname` and will reject it in a future major.
const rootDir = path.resolve(import.meta.dirname);

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': rootDir,
        '~': path.resolve(rootDir, 'src'),
      },
    },
    build: {
      // The single 1 MB bundle was mostly charting and icons. Splitting the
      // heavy, rarely-changing vendors out means a code change no longer
      // invalidates them in the browser cache.
      rolldownOptions: {
        output: {
          advancedChunks: {
            groups: [
              {name: 'charts', test: /node_modules\/(recharts|d3-|victory|decimal)/},
              {name: 'icons', test: /node_modules\/lucide-react/},
              {name: 'react', test: /node_modules\/(react|react-dom|react-is|scheduler)\//},
            ],
          },
        },
      },
      chunkSizeWarningLimit: 700,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
