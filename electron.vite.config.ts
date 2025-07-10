import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

const externals = ['globby', 'queue'];
const minify = process.env.NODE_ENV === 'production';
const commonConfig = {
  minify,
  emptyOutDir: true,
};

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: externals })],
    resolve: {
      alias: {
        '@interfaces': path.resolve(__dirname, './app/shared/interfaces'),
        '@shared': path.resolve(__dirname, './app/shared'),
        '@main': path.resolve(__dirname, './app/main'),
        '@main-utils': path.resolve(__dirname, './app/main/utils'),
        '@modules': path.resolve(__dirname, './app/main/modules'),
        '@databases': path.resolve(__dirname, './app/main/databases'),
      },
    },
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
    resolve: {
      alias: {
        '@interfaces': path.resolve(__dirname, './app/shared/interfaces'),
        '@shared': path.resolve(__dirname, './app/shared'),
      },
    },
    build: {
      ...commonConfig,
      outDir: '.vite/preload',
      lib: {
        entry: './app/preload/preload.ts',
      },
    },
  },
  renderer: {
    plugins: [react(), tailwindcss()],
    resolve: {
      // This config must be the same as in tsconfig.web.json
      alias: {
        '@shared': path.resolve(__dirname, './app/shared'),
        '@renderer': path.resolve(__dirname, './app/renderer'),
        '@assets': path.resolve(__dirname, './app/renderer/assets'),
        '@components': path.resolve(__dirname, './app/renderer/components'),
        '@features': path.resolve(__dirname, './app/renderer/features'),
        '@hooks': path.resolve(__dirname, './app/renderer/hooks'),
        '@stores': path.resolve(__dirname, './app/renderer/stores'),
        '@render-utils': path.resolve(__dirname, './app/renderer/utils'),
        '@views': path.resolve(__dirname, './app/renderer/views'),
      },
    },
    appType: 'spa',
    root: path.resolve(__dirname, './app/renderer'),
    build: {
      minify,
      emptyOutDir: true,
      outDir: '.vite/renderer',
      rollupOptions: {
        input: './app/renderer/index.html',
      },
    },
  },
});
