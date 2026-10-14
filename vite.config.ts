import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    // Oxc se encarga del JSX y del Fast Refresh; `compiler` activa el
    // React Compiler (requiere oxc-transform-react).
    react({ compiler: true }),
    tailwindcss(),
  ],
  build: {
    target: "es2023",
    chunkSizeWarningLimit: 900,
  },
});
