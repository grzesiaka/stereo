import { defineConfig } from "vite";
import Inspect from "vite-plugin-inspect";
import WriteToDisk from "../src";

import $ from "~nodejs";

export default defineConfig({
  root: "src",
  // appType: "custom",
  build: {
    // minify: true,
    // manifest: true,
    modulePreload: false,
    outDir: "../out",
    // emptyOutDir: true,
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
          // return `${a.name}.${a.facadeModuleId?.split(".").pop() || "unknown"}`;
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
  plugins: [WriteToDisk(), Inspect()],
  experimental: {
    bundledDev: true,
    renderBuiltUrl: (a, b) => {
      $.console.log(a, b);
      return a;
    },
  },
});
