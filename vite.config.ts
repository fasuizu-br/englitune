import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { beasties } from "vite-plugin-beasties";
import tailwindcss from "@tailwindcss/vite";
import { env, html, pwa } from "./vite-plugins";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    env(),
    html(),
    react(),
    tailwindcss(),
    beasties({ options: { pruneSource: false } }),
    pwa()
  ],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } }
});
