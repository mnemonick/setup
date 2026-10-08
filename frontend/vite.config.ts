import deno from "@deno/vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "@std/path";

// The build goes straight to sender/public, which the web server serves.
const outDir = resolve(import.meta.dirname!, "..", "sender", "public");

export default defineConfig((args) => {
  return {
    envDir: resolve(import.meta.dirname!, ".."),
    resolve: {
      dedupe: ["react", "react-dom"]
    },
    logLevel: args.mode === "development" ? "warn" : "info",
    plugins: [deno()],
    build: {
      outDir,
      sourcemap: args.mode === "production",
      emptyOutDir: true,
      minify: args.mode === "production",
      rollupOptions: {
        output: {
          assetFileNames: "assets/[name].[hash][extname]",
          entryFileNames: "assets/[name].[hash].js"
        }
      }
    }
  };
});
