import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const externals = ['globby', 'queue']
const minify = process.env.NODE_ENV === 'production';
const commonConfig = {
  minify,
  emptyOutDir: true,
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: externals })],
    build: {
      ...commonConfig,
      outDir: '.vite/main',
      lib: {
        entry: './app/main/main.ts',
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: externals })],
    build: {
      ...commonConfig,
      outDir: '.vite/preload',
      lib: {
        entry: './app/preload/preload.ts',
      },
    },
  },
  renderer: {
    plugins: [react()],
    resolve: {
      // This config must be the same as in tsconfig.web.json
      alias: {
        '@': path.resolve(__dirname, './app/renderer'),
      },
    },
    appType: 'spa',
    root: path.resolve(__dirname, './app/renderer'),
    build: {
      minify,
      emptyOutDir: true,
      outDir: '.vite/renderer',
      rollupOptions: {
        input: 'app/renderer/index.html',
      },
    },
  },
});
