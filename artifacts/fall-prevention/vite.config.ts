import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// PORT is only used by the dev/preview server, not by the production build, so
// default it rather than throwing — that keeps `vite build` robust on Replit
// regardless of when env vars are injected. Replit sets PORT for the dev service.
const port = Number(process.env.PORT) || 5173;

// Public base path. Defaults to "/"; Replit sets BASE_PATH explicitly for the
// web artifact. Defaulting (instead of throwing) keeps the build from failing.
const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // NOTE: Replit's cartographer + devBanner + runtime-error-overlay plugins
    // were causing the Builder iframe to flood the parent frame with
    // postMessage traffic, which spiked CPU and locked up the workspace.
    // They're development-only conveniences and the app works fine without
    // them; leaving them off keeps the prototype responsive.
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
