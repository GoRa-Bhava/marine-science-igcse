import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // "./" keeps asset paths relative, so the same build works on Netlify,
  // Vercel, GitHub Pages or a plain folder on a server.
  base: "./",
  plugins: [react()],
});
