import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
  preview: { port: 8001 },
});
