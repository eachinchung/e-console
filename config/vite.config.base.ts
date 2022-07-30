import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import { ArcoResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"

import vue from "@vitejs/plugin-vue"

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      dts: true,
      imports: [
        "vue",
        "vue-router",
        {
          "@vueuse/core": [
            "useStorage", // import { useStorage } from '@vueuse/core',Í
          ],
          "axios": [["default", "axios"]],
        },
      ],
      resolvers: [ArcoResolver()],
    }),
    Components({
      dts: true,
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "../src"),
      },
      {
        find: "assets",
        replacement: resolve(__dirname, "../src/assets"),
      },
    ],
    extensions: [".ts", ".js"],
  },
  define: {
    "process.env": {},
  },
})
