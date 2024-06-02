import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, PluginOption } from "vite";

export default defineConfig({
  plugins: [react()] as PluginOption[],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["js-big-decimal"],
  },
});
