import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const minify = process.env.NODE_ENV === 'production';
const commonConfig = {
  minify,
  emptyOutDir: true,
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      ...commonConfig,
      outDir: '.vite/main',
      lib:  {
        entry: './app/main/main.ts'
      }
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      ...commonConfig,
      outDir: '.vite/preload',
      lib:  {
        entry: './app/preload/preload.ts'
      }
    },
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './app/src')
      }
    },
    appType: 'spa',
    root: 'app/src',
    build: {
      minify,
      emptyOutDir: true,
      outDir: '.vite/renderer',
      rollupOptions: {
        input: 'app/src/index.html'
      }
    },
  }
})
