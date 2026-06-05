import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT for GitHub Pages project sites:
// `base` must match the repo name so asset URLs resolve under
// https://<user>.github.io/<repo>/. Change "access-to-care" to your
// actual repository name. For a user/org root site (<user>.github.io),
// set base to "/".
export default defineConfig({
  plugins: [react()],
  base: "/access-to-care/",
});
