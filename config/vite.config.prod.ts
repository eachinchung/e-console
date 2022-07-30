import { mergeConfig } from "vite"

import configCompressPlugin from "./plugin/compress"
import configImageminPlugin from "./plugin/imagemin"
import configVisualizerPlugin from "./plugin/visualizer"
import baseConfig from "./vite.config.base"

export default mergeConfig(
  {
    mode: "production",
    plugins: [
      configCompressPlugin("gzip"),
      configCompressPlugin("brotli"),
      configVisualizerPlugin(),
      configImageminPlugin(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            axios: ["axios", "query-string"],
            arco: ["@arco-design/web-vue"],
            vue: ["vue", "vue-router", "@vueuse/core", "pinia"],
            jose: ["jose"],
          },
        },
      },
      chunkSizeWarningLimit: 2000,
    },
  },
  baseConfig,
)
