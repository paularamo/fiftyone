import * as path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteExternalsPlugin } from "vite-plugin-externals";

const isPluginBuild = process.env.STANDALONE !== "true";

// https://vitejs.dev/config/
export default defineConfig({
  mode: "development",
  plugins: [
    react(),
    isPluginBuild
      ? viteExternalsPlugin({
          react: "React",
          "react-dom": "ReactDOM",
          recoil: "recoil",
          "@fiftyone/state": "__fos__",
        })
      : undefined,
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/PointCloudPlugin.tsx"),
      name: "PointCloudPlugin",
      fileName: (format) => `index.${format}.js`,
      formats: ["umd"],
    },
    minify: false,
  },
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  optimizeDeps: {
    exclude: ["react", "react-dom"],
  },
  publicDir: isPluginBuild ? null : "example_data",
});
