/// <reference types="vite/client" />
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import requireTransform from "vite-plugin-require-transform";
import {
  default as tsconfigPaths,
  default as viteTsconfigPaths,
} from "vite-tsconfig-paths";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    tsconfigPaths(),
    nodePolyfills(),
    requireTransform({}),
  ],
  server: {
    // open: true,
    port: 5175,
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "primary-color": "#a855f7",
          "secondary-color": "#16aced",
        },
        javascriptEnabled: true,
        additionalData: "@root-entry-name: default;",
      },
    },
  },
});
