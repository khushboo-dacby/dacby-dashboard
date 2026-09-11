# Technology Stack

Verified against the repository on 2026-09-09. Versions below come from `package.json` and npm's `package-lock.json` (lockfile version 3), not from assumptions about the framework.

## Framework and Language

| Technology | Declared / locked version | Actual role |
| --- | --- | --- |
| Next.js | 16.2.9 / 16.2.9 | App Router under `src/app`; thin page wrappers, one root layout, one local POST route |
| React / React DOM | 19.2.4 / 19.2.4 | Function components, hooks, and `createPortal` dialogs |
| React Compiler plugin | 1.0.0 / 1.0.0 | `reactCompiler: true` in `next.config.mjs` |

Application source is JavaScript: `.jsx` components and `.js` pages, hooks, helpers, and route handler. There is no application TypeScript configuration or typed domain model. `jsconfig.json` maps `@/*` to `./src/*`. Configuration modules use `.mjs` and ES module exports.

The root layout is a server component; interactive feature roots use `"use client"`. Shared components imported beneath those roots may use hooks without their own directive. `product-detail/[id]/page.js` awaits `params`; `add-items/page.js` awaits `searchParams` and normalizes repeated query values to the first value. There is no Pages Router directory.

Follow `AGENTS.md`: read relevant installed Next.js guides in `node_modules/next/dist/docs/` before writing application code. For routing, start with `01-app/03-api-reference/03-file-conventions/page.md`; for client boundaries, use `01-app/03-api-reference/01-directives/use-client.md`.

## Styling

- Tailwind CSS: declared `^4`, locked **4.3.1**. `@tailwindcss/postcss`: declared `^4`, locked **4.3.1**, configured in `postcss.config.mjs`.
- `src/app/globals.css` contains only `@import "tailwindcss";`. No project Tailwind config, CSS modules, custom global token palette, or theme provider exists.
- Most styling uses Tailwind utility strings directly in JSX, including arbitrary dimensions, descendant selectors, gradients, and conditional classes.
- `InventoryForm` adds a global styled-JSX rule for light select/option backgrounds and many descendant utility overrides. Inline styles appear in color-swatch components and the unused mock analytics component's dynamic grid.
- `layout.js` loads Geist and Geist Mono through `next/font/google` and attaches their CSS-variable classes. It does **not** map those variables to Tailwind `font-sans`/`font-mono` or set `font-family`; do not assume the rendered text uses Geist.

## UI Libraries and Icons

| Dependency | Declared / locked version | Actual use |
| --- | --- | --- |
| `lucide-react` | ^1.24.0 / 1.24.0 | Search, navigation, edit/delete, loading, confirmation, and analytics icons |
| `react-photo-view` | ^1.2.7 / 1.2.7 | `PhotoProvider`/`PhotoView` in `components/inventory/ImagePreview.jsx`; global library stylesheet imported by root layout |
| `sonner` | ^2.0.7 / 2.0.7 | Success/error toasts; root `<Toaster richColors position="top-right" />` |

Forms, tables, buttons, tabs/mode switches, and most modals are custom native HTML/React components. There is no component-kit dependency. `ProductFields` also draws its own inline SVG select chevron. `next/image` renders product thumbnails, previews, and question icons; `next/link` and `next/navigation` handle navigation.

## State Management

React `useState` holds page data, form drafts, modal visibility, selection, and request state. `useEffect` performs fetching and cleanup; `useRef` tracks request IDs and the general form's latest state; `useMemo` derives rows/filters; `useCallback` stabilizes inventory and analytics fetch functions. Four custom hooks manage description, questions, box contents, and option descriptions.

Inventory pagination caches fetched pages in a component-local array. Search uses 350 ms timeouts and request-ID guards. There is no Redux, Zustand, React Context store, React Query, SWR, local/session-storage persistence, or shared server-state cache in source. URL state supplies product IDs and CD/preorder category/code only; category filters and pagination are not synchronized to the URL.

## Forms and Validation

Controlled native inputs with callbacks are dominant. Numeric values are converted with `Number`, frequently with zero fallbacks; there is no form or schema-validation library. Native `required`, URL/number/date input types, JSON parsing, and hand-written guards provide uneven validation. Some labels contain `*` without an actual `required` attribute. The general form's Preview button is `type="button"` and calls its handler directly, bypassing native submit validation.

`DescriptionSection` supports form and JSON modes with a 600 ms import debounce. CD/preorder descriptions use a JSON textarea and clipboard-generated prompts, not an integrated AI API.

## API and Media

- `axios`: declared `^1.18.1`, locked **1.18.1**. Named helpers in `src/app/apis/api.js` call the hard-coded DACBY Cloud Functions base URL. Helpers return `response.data` and usually translate backend failures into `Error` messages. No Axios instance/interceptors, configured auth headers, retries, or timeout policy exists.
- Native browser `fetch` is used separately by `OrdersLedgerDashboard` for orders analytics.
- `src/app/api/inventory/route.js` is an echo/debug POST handler; product forms do not call it.
- Images are existing URLs, with Firebase Storage URL-to-CDN rewriting. There is no Firebase SDK, storage upload client, file picker, or image-upload API implementation.
- Optimized remote image hosts/paths are restricted by `next.config.mjs` to the DACBY CDN and the named Firebase Storage bucket path. Image previews impose their own host checks.
- No `.env*` file was present at the root during inspection, and no `process.env` access appears in `src`. Deployment credentials/configuration: **Not clearly determined from the current codebase.**

## Development Tools

| Command | Exact package script |
| --- | --- |
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm run start` | `next start` |
| `npm run lint` | `eslint` |

ESLint is declared `^9`, locked **9.39.4**; `eslint-config-next` is **16.2.9**. `eslint.config.mjs` uses flat configuration with Next core web vitals and ignores `.next`, `out`, `build`, and `next-env.d.ts`. There is no test script, test suite, formatter configuration, or CI workflow in the inspected project. `.vscode/settings.json` only selects the editor color theme.

The root README remains a create-next-app template and incorrectly points at `app/page.js` rather than `src/app/page.js`. Generated `.next`, installed `node_modules`, Git internals, and `.tmp/build.log` are not application architecture sources.
