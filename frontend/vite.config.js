import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  console.log("Loaded Environment Variables:", env); // Debugging log

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode), // Ensure NODE_ENV is set correctly
    },

    plugins: [react()],

    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        "/api": {
          target: "https://s8f26mlb4a.execute-api.us-east-1.amazonaws.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/dev/api"),
        },
      },
    },

    build: {
      outDir: "dist",
      rollupOptions: {
        external: ["bootstrap/dist/css/bootstrap.min.css"],
      },
    },
  };
});
