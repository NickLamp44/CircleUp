import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 5173,
  },
  root: "./", // Adjust this if your index.html is in a different folder
});
