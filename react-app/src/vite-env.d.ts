/// <reference types="vite/client" />

// Injected at compile time by Vite's `define` (see vite.config.ts).
// ISO 8601 string captured when the bundle was built.
declare const __BUILD_TIME__: string;

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
