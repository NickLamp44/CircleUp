import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("Loaded Environment Variables:", env); // Debugging log

  return {
    plugins: [react()],
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        "/dev/api": {
          target: "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev\/api/, "/dev/api"),
        },
      },
    },

    build: {
      outDir: "dist",
    },
  };
});
