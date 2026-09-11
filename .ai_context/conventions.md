# Conventions

Observed on 2026-09-09. These describe current source, including exceptions; they do not mandate an architectural cleanup.

## File Naming and Folder Organization

Pages, layout, API route, hooks, and utilities use `.js`; feature/shared components generally use PascalCase `.jsx`; config uses `.mjs`. App routes use kebab-case directories, with `[id]` for product detail. Hooks are `use...State.js`; helper modules are lower-case names (`formatters.js`, `payload.js`, `sku.js`).

Feature screens and their private subcomponents live in `src/app/<feature>`. Reusable creation UI is in `src/components/inventory`, dialogs in `confirmation-modal` and `description-preview`, and shared state helpers in `src/hooks`. `src/app/apis/api.js` is a client-importable helper module, distinct from the actual server route `src/app/api/inventory/route.js`.

## Component and Function Naming

Most components are default-exported named functions (`ProductInventory`, `ItemDetailsFields`). Thin route wrappers sometimes use a lower-case `page` arrow function and an unnecessary React import. Small presentation helpers are often declared in the same file as the screen (`InfoCard`, `TextField`, analytics metric cards).

Event handlers mix `handleSubmit`/`handleSelectProduct` with `submit`, `retry`, `setField`, and `updateItem`. API functions use descriptive verbs (`fetchInventory`, `getProductDetail`, `updateCombination`). Helpers use `format...`, `normalize...`, `make...`, `get...`, or `generate...`; there is no enforced single prefix scheme.

## Variables

UI state is usually camelCase (`productDetails`, `selectedAttributeValues`, `previewPayload`), with `[value, setValue]`. Backend fields retain their exact names, predominantly snake_case (`spec_id`, `combination_offered`, `sell_max_price`, `in_stock`). Do not normalize response names globally: `docId`, `productDocId`, `combinationKey`, `outOfStock`, and `oneDayDelivery` also occur.

Domain maps use `VENDOR_001`, `combination_1`, `item_1`, and `q1` keys. Draft state often uses arrays and index callbacks instead. Fields such as `_variantKey`, `skuManuallyEdited`, `selectedValues`, and attribute input buffers are local bookkeeping, not automatically API fields.

## Imports

Use ES modules. Both `@/` aliases and relative paths are widespread: creation components usually use aliases, while inventory/detail files often traverse relative paths. There is no barrel-export structure. The detail page currently imports `convertFirebaseImageToCdn` from the large add-variant screen, an important cross-feature dependency. Library CSS imports occur in the root layout.

## Components

Interactive screen roots declare `"use client"`; shared children may inherit the boundary. Pages mostly render one screen and leave data fetching to that client component. Keep `await params` and `await searchParams` in the existing async page wrappers; read installed Next.js docs per `AGENTS.md` before altering framework code.

Props are destructured; callbacks flow down from state owners. Shared field components call parent callbacks rather than issuing HTTP requests. Conditional JSX controls dialogs, accordions, empty states, and fields. Native HTML elements and Tailwind class strings are preferred by current source. React DOM portals mount several dialogs under `document.body`.

## State

UseState and immutable object spreads / `map` / `filter` dominate nested updates. Product creation decomposes state into `fields`, `vendors`, `specification`, and four custom hooks. The latest values are mirrored into refs for `buildPreviewPayload`. Some state setters invoke other setters inside their updater; this is an existing pattern to understand, not a requirement to copy.

Search waits 350 ms and compares request IDs to suppress stale results. Inventory/detail initial effects use an `ignore` cleanup flag. Analytics has neither stale-request guards nor cancellation. Unsaved form/JSON changes are local and disappear on navigation/reload; no durable draft storage exists.

## API Calls

Product operations generally use named helpers from `src/app/apis/api.js`. Helpers return the raw Axios `data` and throw an `Error` with a backend or fallback message. Callers use `try/catch/finally` or effect promise chains, update local state on success, and show toast/inline feedback. Do not infer a response schema from the helper: list/detail/search consumers normalize it differently.

The analytics page is an exception: it uses native `fetch` and a locally hard-coded endpoint. Product requests bypass `/api/inventory`, which only echoes submitted JSON. Mutation helper imports do not prove an action persists: general creation and add-item submission in AddVariant currently have commented-out HTTP calls.

## Forms

Controlled values and parent callbacks are dominant. Number conversion often happens during payload construction (`Number(value) || 0`); `ItemDetailsFields` converts many values on change. Empty strings, zero, undefined, and missing keys can therefore have different meanings. `keepPayloadKeys` recursively replaces undefined with `""` rather than dropping those keys.

Native `required` is selective. The general Preview action calls its handler directly and bypasses browser form-submit validation; add-variant/special-edition asterisks are only labels. Description supports dynamic key/value rows and JSON import; inspect both its serializer and `InventoryForm.buildPreviewPayload` before changing conversion logic.

There are exceptions to controlled inputs: DescriptionSection reads `document.getElementById("newSectionName")`; unused color/attribute editors use direct DOM queries and mutate input values after Enter.

## Error Handling

Most helper errors prefer `response.data.message`, then `response.data.error`, then `error.message`. `addProductToInventory` is narrower: it checks `success === false`, but does not independently reject `data.error`. Search/detail return raw arrays before envelope checks. Analytics requires truthy `json.success` and checks HTTP status.

UI errors appear in state/toasts; failures are often logged. Some parsing failures are silently ignored (bulk color input). Description input parsing has explicit feedback, but detail/CD/preorder “object” checks omit a `typeof === "object"` test and can accept truthy primitives. There is no shared error boundary, schema validator, retry policy, or logging service in application source.

## Constants and Utilities

`src/constants/inventory.js` exports the category codes, camera/console brand/type maps, `emptyItem`, condition explanations, configuration icon URLs, and an Android question template. `androidQuestions` is imported by `InventoryForm` but never applied as a default. The four-option navigation chooser keeps a separate local category list.

`formatters.js` handles attribute/description-key normalization and `toCDN`. Attribute keys become lower snake_case; description keys use title-style underscore formatting while preserving uppercase segments. `payload.js` contains number conversion and undefined-key preservation. `sku.js` contains category-aware SKU construction plus a fallback algorithm. `helper.js` is empty.

## Comments

Most files use short explanatory `//` or JSX section comments. `AddNewProduct` has unusually verbose tutorial-style comments. Analytics uses divider comments; unused `OrdersDashboard` contains hypothetical Firebase-read examples. Some comments describe prior requests or abandoned implementations. Treat executable code as authoritative: e.g. the general final-submit success toast runs even though its network call is commented out.

## Inconsistencies and Confusing Areas

| Area | Dominant/current behavior | Important exception or limitation |
| --- | --- | --- |
| Persistence | Shared API helpers for product actions | General Final Submit only clears preview/toasts; AddVariant item Submit only logs; detail save persists images only |
| Description ownership | `specifications.description` for general products | CD/preorder payloads use `inventory_doc.description`; detail editor only reads specifications |
| Description conversion | Form rows serialize to named sections | Preview parser handles booleans/null/nested JSON, payload parser only numeric conversion; displayed preview can differ from generated payload |
| Description validation | JSON editor checks top-level object | Detail and CD/preorder checks permit truthy primitives; no backend schema validation here |
| Availability | Inventory rows use `in_stock && !outofstock` | Search uses `outOfStock`; sell is separate; detail stock badge stays green at zero |
| IDs and responses | Inventory uses `id`; detail `{details,specifications}` | Search uses `{docId,product}`; only ProductDetail unwraps a returned detail array |
| Vendor IDs | General/special-edition use `VENDOR_001` | CD/preorder uses map key `VENDOR_001` but literal vendor_id `yyyyyyyyyyyyyyyyyyyyyyyyyyyy` |
| Category | Chooser/constants use `Pre Orders` | General form's preorder payload emits `Pre Order`; CD/preorder uses supplied query category |
| SKU | Shared utility for general creation | AddVariant has a separate generator; smartphone custom attributes enter the shared version but not AddVariant's; CD SKU formulas also differ by screen |
| Media | Four URL controls and CDN rewrite | Several duplicated converters and differing validation/YouTube host allowlists; editing image URLs can truncate an existing array beyond four |
| Validation | Native inputs plus manual checks | Required markers, number handling, and URL validation differ across screens |
| Feedback | Sonner and local busy flags | Clipboard uses alerts; warranty lacks pending-state protection and does not refresh parent data |
| Components | Shared inventory components | `CombinationAttributesFields`, `DedicatedColorSelector`, and `VariantAttributeDefinitionsFields` have no active imports; VendorsSection ignores many older props still passed by InventoryForm |
| Routing | `page.js` selects active screen | `AddProduct.jsx` is an unused placeholder; `OrdersDashboard.jsx` is an unused mock; `home` has no `page.js` |
| Styling | Tailwind in JSX | Cyan descendant overrides in general creation; slate/gray and accent families vary; loaded Geist variables are not assigned as font families |

Combination IDs also need care: AddVariant generates `combination_${combinations.length + 1}`, which can collide after deleting a middle entry; `CombinationEditor` instead uses the highest numeric suffix plus one. Removing a definition does not establish how the remote backend reconciles existing inventory items. Keep these limitations visible when extending related functionality.
