import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "./out",
    lib: {
      entry: "./src/index.ts",
      name: "extensy",
    },
  },
});
