import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./", // 设置相对路径的根路径
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  build: {
    sourcemap: true,
    target: "chrome92", // 必须是 Chrome 的某个版本，以便 Electron 可以使用
  },
  server: {
    port: 3000, // 您的应用程序将在此端口上运行
  },
});
