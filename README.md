# Trumbull Health Access Map

An interactive map of healthcare access across **Trumbull County, Ohio** —
hospitals, federally qualified health centers, clinics, pharmacies, dental and
behavioral health providers, and more — layered over poverty-rate and
life-expectancy data to make gaps in access visible.

The project is a civic-data effort: it takes public provider records, geocodes
and categorizes them, and presents them on a map that anyone can use to find
care or understand how access is distributed across the county.

🗺️ **Live map:** **[mikecostarella.github.io/TrumbullHealthAccessMap](https://mikecostarella.github.io/TrumbullHealthAccessMap/)**

---

## Repository layout

| Folder | What it is |
| --- | --- |
| [`react-app/`](./react-app) | **The live app.** A Vite + React + TypeScript app using Leaflet for mapping. This is the deployed map and where active development happens. |
| [`Latest/`](./Latest) | **The previous version** — a single-file HTML/JS app, superseded by `react-app/`. Kept for historical reference. |
| [`Data/`](./Data) | **Source data.** Provider spreadsheets (Trumbull County and statewide Ohio), the cleaned dataset, and Supabase schema used in processing. |

## The app (`react-app/`)

A React + TypeScript single-page app built with Vite and
[Leaflet](https://leafletjs.com/) (via `react-leaflet`). It loads a normalized
dataset of care facilities and renders them as categorized, filterable map
markers, with demographic overlays for context.

**Status:** live and in active development. The React app is the deployed map, with the data layer, type system, and build/deploy pipeline all in place. Recent work includes a two-source provider merge (~1,316 in-county providers), jurisdiction-based filtering, poverty-rate and life-expectancy overlays, and a geolocation "You are here" feature. See `react-app/README.md` for developer details.

### Run it locally

```bash
cd react-app
npm install
npm run dev
```

### Tech

- **React 18 + TypeScript** — typed domain model (facility types, services) so
  data shape is enforced at compile time
- **Vite** — build tooling and dev server
- **Leaflet / react-leaflet** — mapping
- **GitHub Pages + GitHub Actions** — automated build and deploy

## Data

The dataset covers Trumbull County care facilities, derived from public Ohio
provider records and organized by facility type and the services each location
offers. Facilities are geocoded for mapping. Source files live in
[`Data/`](./Data).

> Provider data reflects public records and may contain inaccuracies or become
> outdated. It is provided for informational purposes and is not a substitute
> for contacting a facility directly to confirm services and availability.

## About

Built by [Mike Costarella](https://github.com/MikeCostarella) /
Costarella Innovations, LLC, as part of ongoing civic-data and government
transparency work for Ohio communities.
