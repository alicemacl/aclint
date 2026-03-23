import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // React and other deps reference process.env.NODE_ENV; extension pages have no Node globals.
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'styled-system': path.resolve(__dirname, 'styled-system'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: path.resolve(__dirname, 'src/content.tsx'),
      name: 'A11yLensContent',
      formats: ['iife'],
      fileName: () => 'content',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'content.js',
        // Some deps still reference the `process` identifier; extension pages have no Node globals.
        banner: 'var process={env:{NODE_ENV:"production"}};',
      },
    },
  },
});
