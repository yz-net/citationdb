# Dependency Upgrade — Handoff

Branch: `deps/full-upgrade` (15 commits, branched from `main`)

Each commit was verified with a clean `next build` before moving on.

## What was done

### Major upgrades

| Package                         | From | To   |
| ------------------------------- | ---- | ---- |
| react / react-dom               | 18.3 | 19.2 |
| @types/react / @types/react-dom | 18.x | 19.x |
| next                            | 15.5 | 16.2 |
| eslint-config-next              | 15.x | 16.x |
| tailwindcss                     | 3.4  | 4.2  |
| zod                             | 3.x  | 4.x  |
| zustand                         | 4.5  | 5.0  |
| typescript                      | 5.9  | 6.0  |
| @t3-oss/env-nextjs              | 0.11 | 0.13 |
| tailwind-merge                  | 2.x  | 3.x  |
| eslint-config-prettier          | 9.x  | 10.x |
| dotenv                          | 16.x | 17.x |
| prettier-plugin-tailwindcss     | 0.6  | 0.8  |
| @types/node                     | 22   | 25   |

### Minor/patch

`npm update` was run for everything in-range (next 15.5.x, eslint 9.x, prettier 3.8, sass, fs-extra, geist, react-icons, etc.).

### Removed

- `framer-motion` — was in `package.json` but not imported anywhere.
- `semiotic` — only consumers (`Viz/BarChart`, `Viz/DonutChart`) were dead code carried over from a previous project; deleted along with `Viz/Cluster`, `Viz/TreeMap`, and `src/utils/preprocess.js` (also unused). `Viz/Histogram` and `Viz/D3Component` are kept (used via `PublicationHistogram`).
- With semiotic gone, installs no longer need `--legacy-peer-deps`.

### Migrations / config changes

- **Next 16 removed `next lint`.** `package.json` scripts now use `eslint .` directly.
- **Next 16 removed the `eslint` config option.** Removed `eslint.ignoreDuringBuilds` from `next.config.js`.
- **ESLint flat config.** Converted `.eslintrc.cjs` → `eslint.config.mjs`, using `eslint-config-next/core-web-vitals` (which now ships native flat config) and `typescript-eslint` configs.
  - Added dev deps: `@eslint/eslintrc`, `typescript-eslint`.
  - ESLint itself stays on 9.x — the Next 16 plugin ecosystem (`eslint-plugin-react`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`) caps at ESLint 9. Revisit when those plugins ship ESLint 10 support.
- **TypeScript 6.** Removed deprecated `baseUrl` from `tsconfig.json` (paths now resolve relative to the tsconfig).
- **Tailwind 4.**
  - Replaced PostCSS plugin `tailwindcss` with `@tailwindcss/postcss`.
  - Deleted `tailwind.config.ts`. Theme extensions (`fontFamily`, `boxShadow.yale`) migrated to `@theme` block in CSS. Content is auto-detected.
  - Tailwind 4 doesn't support Sass. Converted `src/styles/globals.scss` + `_fonts.scss` + `_layout.scss` + `_viz.scss` → plain CSS. Sass nesting in `_layout` was rewritten using native CSS nesting.
  - Updated `src/app/layout.tsx` to import `globals.css`.

### Lint cleanup

`eslint-plugin-react-hooks` v7 (bundled by `eslint-config-next@16`) flagged real pre-existing code smells. Cleared in a dedicated refactor pass:

- Effect-driven state replaced with derived values in `HomePage`, `Pins`, `SaveButton`, and `BreadCrumb`'s pinned counter.
- `BreadCrumb`'s `HomeButton` hoisted to module scope (was created during render).
- `ResultList`: `loadMore` wrapped in `useCallback` and declared before the scroll effect; reset-on-prop-change rewritten with the React-recommended "compare-prevProp during render" pattern; `useMemo(buildSortYearMap, [])` rewritten as inline arrow.
- Mechanical: named default export in `configs/words.ts`, `_`-prefixed unused params in `Viz/Histogram` and `Viz/D3Component`, `alt=""` on the decorative search icon in `TextInput`.

`npm run lint` now passes with **0 errors / 0 warnings**.

## Things to check for regression

### High priority — manual UI review needed

Tailwind 4 has breaking visual defaults. **Walk through every page** and check:

1. **Borders.** Default border color is now `currentColor` instead of `gray-200`. Anything using bare `border` / `border-x` / `divide-x` without an explicit color may look different.
2. **Ring widths.** Default `ring` is now 1px (was 3px in v3). Focus rings, button outlines, etc.
3. **Default font stack.** Verified in `@theme`, but double-check Geist Sans is rendering and `font-yalenewroman` / `font-proximanova` still work where used.
4. **`bg-[#f5f5f5]` and other arbitrary values** — should still work but worth a glance.
5. **Module CSS** (`SiteBanner/styles.module.scss`) is still processed by sass and unchanged. Should be fine.
6. **Font loading.** `_fonts.css` `@font-face` paths are unchanged (`../../public/fonts/...`). Confirm fonts still load (network tab → no 404s on woff2/ttf).
7. **`module-area` grid layout** in `_layout.css` — rewritten with native CSS nesting. Test at all three breakpoints (≤599, 600-899, 900-1200, ≥1201).

### Medium priority — runtime behavior

8. **Static export.** `output: "export"` build still produces 1283 pages successfully, but verify a sample (`out/index.html`, `out/authors/leisawitz-daniel/index.html`, `out/publications/<id>/index.html`, `out/resources/<id>/index.html`) renders correctly when served.
9. **Zustand store persistence.** `useLocalDataStore` uses the `persist` middleware with key `citationdb` in localStorage. Test pinning an author/publication/resource, refresh the page, confirm it's still pinned.
10. **Zod validation.** `src/env.js` only uses `z.enum` — Zod 4 keeps this API. If env vars start being added, watch for v4 breaking changes (`.errors` → `.issues` shape, `.parse` error format).
11. **React 19 changes worth eyeballing:**
    - `useEffect` cleanup timing changes around Strict Mode double-invocation.
    - `forwardRef` is no longer required; existing usage still works.
    - Hydration warnings are stricter — watch the console on first load.
12. **Next 16 PPR / caching.** Project uses static export, so most Next 16 dynamic features are inert. But verify:
    - `next.config.js` still parses cleanly (no warnings on `next build`).
    - Image handling: `images.unoptimized: true` is set, so `<Image>` components should still work with raw URLs.

### Low priority — dev tooling

13. **`npm run dev`.** Hot-reload behavior on Tailwind 4 + Next 16 turbopack vs webpack — try editing a class and confirm it rebuilds.
14. **Prettier formatting.** `prettier-plugin-tailwindcss` 0.8 sorts classes slightly differently than 0.6 — `prettier --write .` was applied across the codebase as part of this branch.

## Suggested merge plan

1. Manually smoke-test the dev server on this branch.
2. Eyeball each page type once on staging (the `/ci:trigger-staging` script should still work — it doesn't touch any of the upgraded packages).
