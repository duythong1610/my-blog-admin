/// <reference types="vite/client" />
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import { esbuildCommonjs } from "@originjs/vite-plugin-commonjs";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin(), tsconfigPaths()],
  server: {
    // open: true,
    port: 5175,
  },
  // mode: "development",
  // build: {
  //   minify: false,
  // },
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

  // optimizeDeps: {
  //   esbuildOptions: {
  //     plugins: [esbuildCommonjs(["react-calendar", "react-date-picker"])],
  //   },
  // },
});
