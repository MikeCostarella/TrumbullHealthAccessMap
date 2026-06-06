import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages project sites:
// `base` must match the repo name so asset URLs resolve under
// https://mikecostarella.github.io/TrumbullHealthAccessMap/.
// (Driven by the repo name, not where react-app sits in the tree.)
export default defineConfig({
  plugins: [react()],
  base: "/TrumbullHealthAccessMap/",
  define: {
    // Build timestamp, baked in at compile time. This config is evaluated
    // fresh on every `vite build` (the deploy path) and on dev-server start,
    // so the header's "Updated" line reflects when the bundle was produced.
    // Stored as an ISO string; the UI formats it for display.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
