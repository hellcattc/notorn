import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  envDir: "./",
  plugins: [react(), eslint()],
  server: {
    host: "0.0.0.0",
    hmr: {
      port: 5173,
    },
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
});
