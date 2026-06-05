# Access to Care — React + TypeScript

Vite + React 18 + TypeScript rewrite of the Trumbull County Access to Care map.
This is the **first migration slice**: project scaffold, domain types, the
data-loading seam, and a verification screen. The map UI comes next.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # type-check + production build to dist/
```

## What's here so far

- `src/types/resource.ts` — `Resource`, `FacilityType` union, `RawResource`.
- `src/data/facilityTypes.ts` — typed `TYPE_META` (colors, icons, order) as a
  `Record<FacilityType, FacilityMeta>` so every type is guaranteed metadata.
- `src/data/filters.ts` — service filters keyed to `ResourceServices` fields.
- `src/data/loadResources.ts` — **the swappable data seam.** Fetches static
  JSON now; repoint at an API later without touching components.
- `src/hooks/useResources.ts` — load + loading/error state, abortable.
- `src/components/App.tsx` — temporary verification screen.
- `public/data/trumbull.json` — 1174 normalized records (s_* "Yes"/"No"
  collapsed into a boolean `services` object).
- `src/styles/tokens.css` — design tokens carried over verbatim.

## Deploying to GitHub Pages

1. Set `base` in `vite.config.ts` to your repo name (currently
   `/access-to-care/`).
2. `npm run deploy` (uses the `gh-pages` package).

## Reuse across counties

`loadResources("<jurisdiction>")` loads `public/data/<jurisdiction>.json`.
Drop in another county's JSON (same shape) and point the app at it.

## Notes

- Original "access" filters (Medicaid, Medicare, telehealth, transit, sliding
  scale) were dropped: the dataset has no matching fields, so they matched
  nothing. See the comment in `src/data/filters.ts` for how to reintroduce
  them type-safely if the data gains those fields.
- `react-leaflet` is pinned to v4 (React 18). v5 requires React 19.
