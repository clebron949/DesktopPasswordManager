import { join } from "path";
import vuePlugin from "@vitejs/plugin-vue";

import { defineConfig } from "vite";

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: join(__dirname, "src", "renderer"),
  publicDir: "public",
  server: {
    port: 8080,
  },
  open: false,
  build: {
    outDir: join(__dirname, "build", "renderer"),
    emptyOutDir: true,
  },
  plugins: [vuePlugin()],
});

export default config;
