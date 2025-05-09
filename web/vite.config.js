import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  base: "./",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 10090,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:10088",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../server/statics",
    emptyOutDir: true,
  },
});
