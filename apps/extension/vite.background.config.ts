import path from 'path';

import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/background.ts'),
      name: 'background',
      formats: ['es'],
      fileName: () => 'background',
    },
    rollupOptions: {
      output: {
        entryFileNames: 'background.js',
      },
    },
  },
});
