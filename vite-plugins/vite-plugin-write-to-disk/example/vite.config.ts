import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import WriteToDisk from "../src";

import $ from "~nodejs";

export default defineConfig({
  root: import.meta.dirname + "/src",
  build: {
    minify: true,
    modulePreload: true,
    // Seems there is a bug when using relative path. It is relative to repo's root in case of `serve` and absolute in case of `build`.
    outDir: import.meta.dirname + "/out",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        popup: "./popup/index.html",
        sw: "./sw.ts",
      },
      output: {
        cleanDir: true,
        entryFileNames: (a) => {
          $.console.log("ENTRY", a);
          return `[name].js`;
        },
        chunkFileNames: (a) => {
          $.console.log("CHUNK", a);
          return `[name].js`;
        },
        assetFileNames: (a) => {
          $.console.log("ASSET", a);
          return `assets/[name][extname]`;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": import.meta.dirname + "/src",
    },
  },
  plugins: [WriteToDisk({}), Inspect()],
});
