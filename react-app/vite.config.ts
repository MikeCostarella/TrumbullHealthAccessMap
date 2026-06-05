import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages project sites:
// `base` must match the repo name so asset URLs resolve under
// https://mikecostarella.github.io/TrumbullHealthAccessMap/.
// (Driven by the repo name, not where react-app sits in the tree.)
export default defineConfig({
  plugins: [react()],
  base: "/TrumbullHealthAccessMap/",
});
