import path from "node:path";
import {defineConfig} from 'vite';

export default defineConfig(args => {
  const outDir = path.resolve(import.meta.dirname, '..', 'sender', 'public');

  return {
    build: {
      outDir,
      emptyOutDir: true,
      minify: args.mode === 'production',
      sourcemap: true,
      rollupOptions: {
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]'
        }
      }
    }
  }
});