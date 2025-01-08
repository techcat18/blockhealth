import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-input-mask": "react-input-mask/dist/react-input-mask.min.js",
    },
  },
});
