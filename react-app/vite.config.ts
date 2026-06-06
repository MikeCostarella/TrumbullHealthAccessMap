import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// IMPORTANT for GitHub Pages project sites:
// `base` must match the repo name so asset URLs resolve under
// https://mikecostarella.github.io/TrumbullHealthAccessMap/.
// (Driven by the repo name, not where react-app sits in the tree.)
const BASE = "/TrumbullHealthAccessMap/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    // Makes the app installable ("Add to Home Screen" / "Install app") and
    // adds offline caching. registerType "autoUpdate" registers the service
    // worker automatically and swaps in new builds without a manual prompt.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon-32x32.png", "apple-touch-icon.png"],
      manifest: {
        name: "Trumbull County Access to Care",
        short_name: "Access to Care",
        description:
          "Interactive map of healthcare access across Trumbull County, Ohio.",
        theme_color: "#1F3A5F",
        background_color: "#F8F4EC",
        display: "standalone",
        orientation: "any",
        // scope/start_url must include the Pages base path so the installed
        // app launches at the project subpath, not the domain root.
        scope: BASE,
        start_url: BASE,
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,json}"],
        // The county GIS and TIGERweb tiles/data are cross-origin and large;
        // don't try to precache them — let them load live as today.
        navigateFallbackDenylist: [/^\/[^/]+\/api\//],
      },
    }),
  ],
  define: {
    // Build timestamp, baked in at compile time. This config is evaluated
    // fresh on every `vite build` (the deploy path) and on dev-server start,
    // so the header's "Updated" line reflects when the bundle was produced.
    // Stored as an ISO string; the UI formats it for display.
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
