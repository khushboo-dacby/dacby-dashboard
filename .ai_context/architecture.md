# Architecture

Verified from application source on 2026-09-09. Paths are repository-relative. Endpoint descriptions below reflect requests and response fields consumed by this frontend; no remote backend source or live API contract was available for inspection. JSON fixtures are examples, not runtime data sources.

## Project Overview

DACBY's dashboard lists/searches inventory, opens product details, builds product/variant payloads, adds CD/preorder and special-edition listings, updates combination definitions and SKU images, deletes listings, adds warranties, and displays buy/sell order analytics. Supported categories include game discs, consoles/controllers, accessories, PC components, cameras/lenses, laptops, smartphones, smart devices, and audio devices.

The implementation has deliberate-looking but unexplained gaps in persistence. Do not equate a visible save button or success toast with a backend write:

| Action | Current executable behavior |
| --- | --- |
| General product `/add-product` Preview | Builds payload and displays it locally |
| General product Final Submit | API call is commented out; clears preview flag and shows success |
| CD/preorder `/add-items` Final Submit | Calls `addProductToInventory`, then resets form on success |
| `/add-variant` Update Combinations | Calls `updateCombination`; updates local specification/saved baseline |
| `/add-variant` Submit Product | Builds/logs item payload; `addCombinationItem` call is commented out |
| Special-edition Submit Product | Calls `addSpecialEdition`; toast, without resetting/navigating |
| Detail Edit Variant → Save | Calls `updateSkuImages`; only image changes persist |
| Detail Apply Description | Updates local `productData.specifications.description`; no HTTP call |
| Add Warranty | Calls `addWarranty`, closes modal; does not refresh parent details |
| Inventory Delete | Calls `deleteProduct`; removes result from current page/search state |

Why these calls are disabled and whether full editing is planned: **Not clearly determined from the current codebase.**

## Repository Structure

```text
src/
  app/
    layout.js, globals.css, page.js, favicon.ico
    home/                  Inventory screen and creation-choice modal (not /home)
    add-product/           General InventoryForm; unused AddProduct placeholder
    add-items/             CD/preorder form
    add-variant/           Search, combination editing, new-item draft
    add-special-edition/   Existing-spec special-edition creation
    product-detail/
      [id]/                Dynamic page and ProductDetail
      AddWarrantyModal.jsx
    analytics/             Active OrdersLedgerDashboard; unused OrdersDashboard mock
    apis/api.js            Product HTTP helpers (not a route)
    api/inventory/route.js  Local echo/debug POST route
  components/
    inventory/             Fields, descriptions/questions/specification, variants, previews
    confirmation-modal/    DeletePop and WarningPopup
    description-preview/   DescriptionPreviewModal
    product.json           Example creation payload; not imported
  hooks/                   Four local form-state hooks
  constants/inventory.js   Categories, defaults, descriptions, icons/questions
  utils/                   formatters.js, payload.js, sku.js; empty helper.js
  data/                    inventory.json and inventoryDetail.json examples; not imported
public/                    file/globe/next/vercel/window SVG starter assets
.ai_context/               Project context documents
```

Root configuration: `package.json`, `package-lock.json`, `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs`, `jsconfig.json`, `.gitignore`. `AGENTS.md` requires installed Next.js guide review; `CLAUDE.md` points to it. Root README is starter documentation. `.vscode/settings.json` only sets an editor theme. Generated `.next`, installed packages, `.tmp/build.log`, and Git internals are not application source. No root `app`, Pages Router, separate backend project, database schema/migrations, test directory, or authentication implementation was found.

## Routing

All UI routes are selected by files under `src/app`:

| Path | Main source / purpose | Dependencies and inputs |
| --- | --- | --- |
| `/` | `page.js` → `home/HomePage.jsx` → `home/ProductInventory.jsx` | Inventory/search/delete helpers, category constants, AddNewProduct, DeletePop |
| `/product-detail/[id]` | `product-detail/[id]/page.js` → `ProductDetail.jsx` | Page awaits `params`, passes `id`; detail/image helpers, ItemDetailsFields, WarningPopup, AddWarrantyModal |
| `/add-product` | `add-product/page.js` → `InventoryForm.jsx` | Inventory components, four hooks, formatter/payload/SKU utilities |
| `/add-items` | `add-items/page.js` → `AddPreorderCd.jsx` | Awaits `searchParams`; first `category_name` and `code` values or empty strings; creation helper, ImagePreview |
| `/add-variant` | `add-variant/page.js` → `AddVariant.jsx` | Searches/selects product; detail and combination helpers; own SKU/payload logic |
| `/add-special-edition` | `add-special-edition/page.js` → `SpecialEdition.jsx` | Search/detail/special-edition helpers; brand/type maps |
| `/analytics` | `analytics/page.js` → `OrdersLedgerDashboard.jsx` | Direct native-fetch analytics endpoint |
| `/api/inventory` (POST) | `api/inventory/route.js` | Parses/logs/echoes body using NextResponse |

`home` and `apis` are organizational directories, not extra UI routes. `AddProduct.jsx` and `OrdersDashboard.jsx` do not determine their route's rendered content.

`AddNewProduct` opens a three-step modal. PS5 CDs, PS4 CDs, and Pre Orders navigate directly to `/add-items` with encoded category/code query parameters. Others leads to Add Variant or Add New Product; the latter leads to Fresh Product or Special Edition. There is no global navigation shell or inventory link to analytics in current JSX.

## Application Architecture

Server page wrappers supply routing inputs and render client feature roots. Business data fetching, response normalization, derived rows, forms, and mutation state live in those client components. Shared field components receive values and callbacks. Most product HTTP operations use `src/app/apis/api.js`, which sends requests directly to an external Cloud Functions service. There is no local backend-for-frontend layer in those flows.

The root layout imports Tailwind globals, photo-view CSS, font-variable classes, and a top-right Sonner toaster. It supplies no domain state or authentication provider. No server actions, global store, or shared data cache appear in source.

## Product Architecture

“Product” is primarily an inventory listing, identified by inventory `id` / search `docId`. `spec_id` links it to a specifications document. Special-edition creation explicitly reuses another listing's `spec_id`; product ID and spec ID are therefore not interchangeable. Several CD listings use category-wide spec IDs (`ps5-cds`, `ps4-cds`, `pre-order`). Backend collection names, uniqueness rules, and transaction semantics are **Not clearly determined from the current codebase.**

```text
Product detail response
  details (= inventory listing; id, spec_id, product_title, pricing, condition ...)
    vendors[vendorKey]
      combination_offered[combinationKey][itemKey]
        sku + selected attributes + stocks + prices + images + sell ...
  specifications (= shared specification data addressed by spec_id)
    combination[combinationKey][attributeKey] = allowed values[]
    description, questions, color_codes, option_descriptions,
    configuration_icons, whats_in_the_box, minimum_price
  warranty.warranties[]   (present in detail fixture; not displayed)
  reviews                (present in detail fixture; not displayed)
```

| Level | Verified data / responsibility |
| --- | --- |
| Inventory/product listing | `id`, `spec_id`, `product_title`, `code`, `category_name`, `condition`, optional brand/type, `price`, `mrp`, `sell_max_price`, `sell`, `in_stock`, `yt_iframe`, vendors; response may also contain ratings, timestamps, extra coins, outofstock |
| Shared specification | Allowed combination values, color map, description sections, assessment-question definitions, option descriptions, configuration icons, box contents, minimum_price |
| Vendor | Name, note, vendor_id, ratings/total_sales when supplied, and combination_offered map; no standalone vendor lookup or management API |
| Combination definition | A named map of allowed attribute arrays, not an inventory unit |
| Variant/item | One SKU record nested under vendor and combination, with scalar selected attributes, `stocks`, `mrp`, `price`, `sell_price`, `sell`, weight, images, ratings, optional yt_iframe |
| Warranty | Addition is addressed by spec_id; fixture represents `{warranty:{warranties:[{title,price}]}}` |

Color, storage, RAM, physical_condition, battery_health, and shutter_count are dynamic attribute keys, not separate first-class entity types. Product `condition` (e.g. Pre Owned) is distinct from variant `physical_condition` (cosmetic option). Images belong to item records in generated payloads; a search response's `product.image` is a separate summary field. Accessories are represented by specification-level box contents and question options, not a verified variant-accessories object.

## Product Detail Architecture

`ProductDetail({id})` fetches `getProductDetail(id)` in an effect keyed by `id` and `retryCount`. It stores an object response directly, or the first element if an array is returned, in `productData`. It initializes editable `descriptionJson` from `specifications.description ?? {}`. An ignore flag suppresses updates after cleanup; retry explicitly resets loading/error and increments a counter.

`details` is `productData.details ?? {}`. `getVariants` flattens every vendor's combination/item maps into records carrying `vendorId`, `vendor`, `combinationId`, `itemId`, and `item`. Dynamic table attribute keys are the union of specification-combination and item keys excluding the local `ITEM_FIELDS` set. This is exclusion-based detection: an unfamiliar metadata field can become an attribute column.

The screen renders title/category/code/condition, product pricing (`price`, `mrp`, `sell_max_price`, `extra_coins`), first-vendor information, the variant table, raw Description JSON, optional product video, and IDs/creation date. All vendors contribute variants, but only the first vendor supplies the vendor card. Dates accept `_seconds` or `seconds`; pricing uses INR via Intl.NumberFormat.

The four section labels are static spans. There is no assessment display/editor, existing-warranty list, review panel, full product image gallery, or rendered specification-description section table on this route. `AddWarrantyModal` is opened from the header with `details.spec_id`.

`EditVariantModal` copies the selected item into draft state and exposes attributes plus `ItemDetailsFields`. On confirmation, `saveVariant` extracts only images, rewrites Firebase URLs, filters blanks, and calls `updateSkuImages(encodeURIComponent(id), encodeURIComponent(originalSku), images)`. Success updates just that item's images in nested local state and closes the modal. Changing price, SKU, attributes, stock, sell status, or video in the modal does not persist or update their displayed values. Failure toasts and rethrows.

`applyDescription` parses JSON, rejects null/falsy values and arrays, but fails to enforce `typeof object`. It updates local specification state and toasts validation success. No API saves this description. It does not read `details.description`, so the CD/preorder description placement is not supported by this editor.

Video display extracts `src` from stored `details.yt_iframe` and accepts youtube.com, www.youtube.com, or youtu.be. Creation preview helpers have different allowlists/protocol checks. Item-level iframe values are not shown as individual videos here.

## Product Creation Architecture

### General creation: InventoryForm

`src/app/add-product/InventoryForm.jsx` owns product fields, an array of vendors with item arrays, specification color/attribute/combination drafts, response/preview state, and image-sharing preferences. Four hooks own description, questions, box contents, and option descriptions. Refs mirror all payload-driving states after render; `buildPreviewPayload` reads those refs.

Rendered order: ProductFields → QuestionsSection → DescriptionSection → WhatsInTheBoxSection → SpecificationSection → VendorsSection → FormActions → ResponsePreview. VendorsSection shows guidance until combinations exist, then renders a CombinationVariantsTable per vendor.

Specification attribute definitions are `{key, icon, values, input}`. Generate from Attributes chooses color as the common attribute when it has at least two values; otherwise it chooses the attribute with most values. It takes the Cartesian product of the remaining attributes, assigning `combination_1...N`, and retains all common-attribute values within each group. CombinationVariantsTable expands each group's arrays into selectable SKU rows. Saving a row only updates local vendor items, identified by `_variantKey` or combination name plus attributes.

`buildPreviewPayload` transforms arrays into document maps:

- Vendor index → `VENDOR_001`, etc.; items grouped by `combination_name` or `combination_1`; index inside each group → `item_1`, etc.
- Selected `item.attributes` are flattened onto item records, excluding collisions with existing item fields. Local `_variantKey` and skuManuallyEdited are omitted.
- General output is `{spec_id, specifications_doc, inventory_doc}`. Fields are detailed in the inventory/specification sections below.
- CD and preorder branches instead produce `{spec_id, inventory_doc}` with description inside inventory_doc, one combination group, and category-specific SKUs. The preorder branch emits category_name `Pre Order` and fixed condition `Pre Order`; UI/constants say `Pre Orders`.
- Undefined values become empty strings recursively through `keepPayloadKeys`. Most numeric blanks become zero. General images are filtered for HTTP(S) URLs and converted to CDN URLs.

ProductFields uses category constants and auto-selects category spec IDs for discs/preorders. Brand/Type controls appear for Consoles/Cameras, including custom text options. Product condition has native required validation, but FormActions Preview directly invokes the handler and bypasses native submission validation. No comprehensive required-field, nonnegative-stock, price-order, or SKU-uniqueness validation is performed.

Preview populates both `previewPayload` and `resp`; Final Submit currently does not send it. Reset restores empty states and defaults. `addProductToInventory` and `androidQuestions` are imported but not executed/applied in this component. `fields.imagesText` is split into a local variable during payload building but the resulting product image array is unused.

### CD/preorder creation: AddPreorderCd

`/add-items` selects behavior by code D001Y, D002Y, or D003Y. Spec IDs are `ps5-cds`, `ps4-cds`, and `pre-order`; condition is Pre Owned for CDs and Pre Order otherwise. Preorders default sell to false; CDs default true. Title changes generate `<title-slug>-<category-spec-id>` and manual SKU edits are possible.

Controlled fields cover title, MRP, Buy Price, Sell Price, Max Sell Price, stocks, weight, sell flag, vendor name/note, iframe, four image URLs, and description JSON; preorders require a date formatted to an ordinal day/month/year string. “Buy Price” writes backend `price` at both listing and item levels. Required native inputs gate normal form submission. The description JSON guard has the same truthy-primitive gap as ProductDetail.

Payload has one vendor `VENDOR_001`, one `combination_1.item_1`, shared product/item MRP/price/sell, item sell_price/stock/media, product sell_max_price, and `in_stock: stocks > 0`. Its vendor_id is the literal `yyyyyyyyyyyyyyyyyyyyyyyyyyyy`, not its map key. It emits no specifications_doc. Category name is the supplied query value; there is no robust query-code/name validation.

Preview captures a payload. Final Submit calls `addProductToInventory(previewPayload)`, toasts and resets on success; errors preserve the draft. Changing fields after Preview does not rebuild that captured payload until Preview is run again.

Description templates and copy-to-clipboard prompt builders are hard-coded locally. “Copy JSON” copies a generation prompt for external use; no AI request runs. Template sample copy includes mismatched game metadata, so it is not product truth.

### Special-edition creation

SpecialEdition searches products, loads the selected docId's details with request-ID guards, and reuses its spec_id. Category comes from selected details, condition from the search result, and brand/type are prefilled (visible controls only for cameras/consoles). Title edits generate SKU by combining spec-id words with title words absent from the spec ID.

Submit builds `{product}` containing listing fields, in_stock from stocks, and one nested vendor/combination/item with converted image URLs. It sends no new specifications document or explicit source product ID. `addSpecialEdition` is active. Successful submission toasts but retains the form. Asterisks on fields are not enforced by `TextField`.

## Inventory Architecture

### Fetching, filtering, search, and deletion

`ProductInventory` calls `fetchInventory()` on mount. `getProductsFromResponse` accepts a raw array, `response.inventory`, `response.data.inventory`, or `response.data` if it is an array; other shapes throw. State is `pages: [{products,hasNext}]` plus zero-based currentPage. hasNext uses `response.hasNext`, then hasMore, then whether any products exist.

Next requests `{startAfter: lastProduct.id}` when not already cached. An empty later page disables the prior page's next flag. Previous reads cached pages. Refresh resets from the first page. No fixed page size or global total is defined by frontend code. Category filtering runs over only the current page; its “products found” count is not a whole-database count.

Search is separate: a 350 ms debounced GET produces a raw result array of `{docId, product}` records. `product` supplies title, image, category, code, price, MRP, condition, variant count, and sometimes outOfStock; the wrapper can also contain outOfStock. Result state and errors are independent of inventory pagination. Request IDs prevent older search responses replacing newer ones.

Inventory thumbnails use the first available nested variant image; search uses product.image. Detail links use inventory id or search docId respectively. Deletion encodes the ID, calls the helper, filters the current cached page and search results, and returns a boolean so DeletePop can close. Other cached pages are not invalidated/refetched.

### Field ownership and calculations

| Field | Current implementation |
| --- | --- |
| `stocks` | Item-level number; there is no aggregate product quantity field in builders |
| `in_stock` | Product-level boolean computed from any positive item stock in general creation, or stocks > 0 in single-item forms |
| `outofstock` / `outOfStock` | Read-only response conventions used differently by inventory/search; not generated by these forms |
| `price`, `mrp` | Exist at product and item level; independently editable in general drafts; synchronized from one input in CD/special-edition payloads |
| `sell_price` | Item-level number |
| `sell_max_price` | Product-level number; displayed as Max Sell Price; not automatically computed from items |
| `minimum_price` | General specification-level number; add-variant displays it but performs no comparison validation |
| `sell` | Product and item boolean, distinct from stock; general product sell is fields.sell OR any item.sell |
| `condition` | Listing condition; variant physical_condition is a separate selected attribute |
| `weight`, `rating`, `rating_count`, `yt_iframe`, `images` | Item fields; ratings/video may also exist at product level |

`emptyItem()` defaults include sell_price 1000, weight 0.5, rating 4.5, rating_count 115, sell false, empty SKU/prices/stocks/images/attributes. AddVariant's item builder instead hard-codes rating 4.5 and rating_count 150; single-item CD/preorder/special-edition builders use zero ratings.

No implemented general inventory-update HTTP flow exists. The only active detail item mutation updates images. Backend aggregation of product prices/availability after combination or image writes is **Not clearly determined from the current codebase.**

## Variant Architecture

The persisted variant shape is `details.vendors[vendorKey].combination_offered[combinationKey][itemKey]`. SKU is a separate field and addresses the image endpoint. Creation drafts nest dynamic attributes under `attributes`; outgoing items and loaded detail items flatten attributes to scalar fields such as color, storage, ram, physical_condition, and battery_health.

In AddVariant, selecting a search result loads specifications.combination into `{id,...attributeArrays}` draft entries and records a saved baseline. Only definitions with at least one attribute and nonempty arrays are considered valid. Attribute/value additions can apply to the current group or all groups. Update Combinations posts the valid map with spec_id; success replaces local specifications.combination and the saved baseline. Incomplete previously saved definitions disable that update button.

Possible attribute selections are the Cartesian product of each group. Existing items from all vendors are compared case-insensitively by every selected attribute; existing combinations/selections are hidden or disabled. This is frontend duplicate detection, not a verified backend uniqueness rule.

`createCombinationItemPayload(productDocId, combination, selectedAttributes, formData)` emits `{productDocId, combinationKey: combination.id, item}`. Item contains flattened selected attributes, SKU, four converted/nonblank image URLs, numeric mrp/price/sell_price/weight/stocks, fixed ratings, and sell from availableForSell. No vendor ID is sent. Backend vendor selection is **Not clearly determined from the current codebase.** The helper exists, but AddVariant's submit only logs this payload.

### SKU rules

`src/utils/sku.js` is used by InventoryForm/CombinationVariantsTable. `AddVariant.jsx` exports a separate `makeVariantSku` and shares no SKU implementation with that utility. Both branch on category code/name: console storage/color; laptop storage/RAM/physical condition/color/battery level; camera color/shutter level; smartphone storage/battery/physical condition/color; certain other codes color only or storage/color. Battery ranges map to high/low; laptop light-mark labels and shutter-count labels get special mappings.

The shared utility also includes additional smartphone attributes; AddVariant does not. The utility has a separate fallback algorithm when category metadata is absent. General-form CD SKUs are title-only slugs, whereas AddPreorderCd appends the category spec ID. Special-edition SKU has another title-word algorithm. Manual edits can be overwritten by later title/spec/category or attribute changes; skuManuallyEdited is not universally honored. Do not replace any SKU routine without tracing its callers.

## Specification Architecture

Specifications are shared data associated through spec_id; they do not live inside each SKU. Creation state differs from the API shape. The following abbreviated JSON shape illustrates fields verified in builders and fixtures (values are illustrative, not a complete backend schema):

```json
{
  "spec_id": "example-spec",
  "color_codes": { "Black": "#000000" },
  "combination": {
    "combination_1": { "color": ["Black"], "storage": ["128GB"] }
  },
  "description": {
    "summary": "Example summary",
    "Global_Attributes": { "Brand": "Example", "Release_Year": 2026 },
    "Performance": { "Storage": ["128GB", "256GB"] }
  },
  "whats_in_the_box": [{ "image_url": "", "label": "Charger" }],
  "option_descriptions": { "Light Marks": "Example condition explanation" },
  "configuration_icons": { "Storage": "" },
  "minimum_price": 0,
  "questions": {}
}
```

`SpecificationSection` edits color rows, bulk color-map JSON, attribute definitions/icons/values/descriptions, and delegates group editing to CombinationEditor. General builder converts color rows to a name→hex map and groups to attribute arrays. An include_colors branch can emit `{name,hex}` objects as color values, but the active CombinationEditor creates include_colors false and exposes no toggle. Active AddVariant assumes value arrays suitable for string selection.

`DescriptionSection` and `useDescriptionState` use `{summary, [section]: [{key,value,valueType}]}` locally. Default sections are Global_Attributes, Performance, Connectivity, and Design; users can add/remove/rename them. Form/JSON mode converts between row arrays and section objects. JSON import auto-applies after 600 ms only when parsing succeeds and the top level is an object. Primitive arrays become newline-separated multiple fields; nested objects become JSON strings in single fields; top-level scalars/arrays become a field named value.

Its visual preview uses a serializer that can reconstruct booleans, null, arrays, and nested JSON. InventoryForm's final payload serializer instead uses `parseNumberIfPossible` and description-key formatting. Nested JSON/boolean/null handling and key spelling can therefore differ between preview and payload. Do not assume lossless import/export.

Option descriptions are keyed by formatted option text across attributes, not attribute+option pairs. Only nonblank descriptions matching current definition values are serialized; if none exist, smartphone/laptop category defaults apply. Icons use formatted display names; when empty, cameras use camera defaults and all other categories use configurationIcons. Box content drops rows with neither label nor image URL.

Display/edit persistence differs by route: creation has structured editing and a DescriptionPreviewModal; detail has raw specification.description JSON applied locally; AddVariant persists only the combination map through POST `/api/specifications/update-combination`. There is no active full-specification/description update API call.

## Image Architecture

All media entry is by URL; there is no upload, File/FormData handling, storage SDK, or file-deletion API. Item images are arrays of strings in the nested inventory map. Search's product.image is a summary field; product-level image ownership/derivation on the backend is **Not clearly determined from the current codebase.**

ItemDetailsFields shows four URL inputs and previews only the first four images. Editing any URL reconstructs a four-entry array, so existing arrays longer than four can lose trailing entries when saved. Clearing a URL and saving removes it from the resulting array; this updates URL references only, not the stored media file. No standalone Delete Image button/endpoint exists.

General creation can share a saved item's images with all matching-color variants across vendors and with later drafts. Matching is trimmed/lowercase color; confirmation is remembered in confirmedImageColors and the URLs in variantImagesByColor for that form session. This is local draft behavior, not a backend propagation call.

Converters replace the named Firebase Storage prefix with `https://dacby-database.web.app/cdn/`, preserving encoded object paths and query strings. `toCDN` in formatters and converters in add-variant, CD/preorder, and special-edition differ slightly in trimming/prefix checks. Detail imports the AddVariant converter.

ImagePreview accepts only HTTPS URLs on the DACBY CDN or firebasestorage.googleapis.com. Thumbnails use next/image; the lightbox uses `/_next/image?url=<encoded>&w=2048&q=75`. The Next image config further restricts paths to `/cdn/**` and `/v0/b/dacby-database.appspot.com/o/**`. General payload URL validation accepts any HTTP(S) host, so accepted input is not necessarily previewable. Question option icons use next/image with unoptimized.

The active image update flow is PATCH `/api/inventory/{productId}/skus/{sku}/images` with `{images}`. It targets the original SKU, and success changes only the selected item's nested local image array. CD/preorder/special-edition creation include images in their creation request; general/new-variant submissions currently stop before HTTP.

## Warranty Architecture

`src/app/product-detail/AddWarrantyModal.jsx` receives specId and onClose (onSave is declared but unused). Choices are 1 Year Total Warranty, 7 Months Total Warranty, and 6 Months Total Warranty. Options contain local IDs/months, but the request sends only `{spec_id, warranties:[{title,price:Number(price)}]}` through addWarranty.

Price is required, numeric, minimum zero, whole-number step, and the change handler ignores values above 100000. Selection is required to enable Save. Success uses response.message if present, toasts, and closes; failure logs/toasts. There is no isSaving flag, duplicate-submit lock, parent update callback, or refetch. Escape and clicking the backdrop also close it.

The detail fixture contains `warranty.warranties` with title/price entries. The detail UI does not read/render that field. Backend merge versus replacement, plan IDs, coverage rules, and warranty deletion/editing are **Not clearly determined from the current codebase.**

## Assessment Architecture

The concrete assessment-related implementation is question-definition authoring in QuestionsSection/useQuestionsState and specifications_doc.questions. There is no separate assessment model, completed assessment/answer storage, scoring engine, or assessment-update endpoint in source. ProductDetail's Assessment text has no associated panel.

Draft questions have transient IDs, question/description/type/isRequired, and options. Builder keys them q1, q2, etc., dropping transient IDs. Radio/dropdown definitions have question-level numeric deduction and string options. Checkbox definitions have option objects `{label,deduction,icon}` and no question-level deduction emitted. New radio questions default to required, Yes/No options, and deduction zero; checkbox starts with one empty option; dropdown with New Option. The hook prevents removal of the final existing option.

Accessories Missing is present in the Android question template and fixtures, with per-option deductions/icon references. The Android template is not automatically inserted by InventoryForm. Box contents `{image_url,label}` are separate specification-level data. Runtime assessment execution and variant-specific accessory ownership are **Not clearly determined from the current codebase.**

## API Architecture

Product helpers all live in `src/app/apis/api.js`. Base URL is `https://us-central1-dacby-database.cloudfunctions.net/dacbyportalapi`. Paths in the table are appended to this base, except the explicitly local route.

| Helper / method / path | Caller and payload/query | Response consumption, loading, and errors |
| --- | --- | --- |
| `fetchInventory` POST `/fetchInventory` | ProductInventory; `{}` or `{startAfter:lastProduct.id}` | List normalization described above; hasNext/hasMore optional; page overlay/isLoading; inline error+retry |
| `searchProducts` GET `/searchProducts` | ProductInventory, AddVariant, SpecialEdition; query param `query` | Callers use raw arrays of `{docId,product}`; non-array becomes empty results; independent searching/error state and request-ID guards |
| `getProductDetail` GET `/getproductdetails` | ProductDetail with route id; AddVariant/SpecialEdition with search docId; query param `id` | Expected `{details,specifications,...}`; ProductDetail alone unwraps array; loading and inline detail errors |
| `addProductToInventory` POST `/addproducttoinventorynew` | Active AddPreorderCd Final Submit: `{spec_id,inventory_doc}`; general form's disabled call would include specifications_doc for general products | Returns raw body; caller uses optional message and resets on success; isSubmitting/toast errors; helper checks success false but not body.error independently |
| `updateCombination` POST `/api/specifications/update-combination` | AddVariant: `{spec_id,combination:{[id]:{[attribute]:values[]}}}` | Raw response message; local map/saved baseline update; updatingCombinations disables button; error toast |
| `addCombinationItem` POST `/api/inventory/add-combination-item` | Helper defined; AddVariant call commented out; constructed `{productDocId,combinationKey,item}` | No active response/state update in UI; submittingProduct surrounds logging only |
| `addSpecialEdition` POST `/api/inventory/add-special-edition` | SpecialEdition: `{product}` as described above | Raw response/message; submitting flag/button; success/error toast; no reset/refetch |
| `updateSkuImages` PATCH `/api/inventory/{productId}/skus/{sku}/images` | ProductDetail, URL-encoded original IDs, body `{images}` | Response message; local image update and close; modal isSaving/confirmation; toast and rethrow on failure |
| `deleteProduct` DELETE `/api/inventory/{productId}` | ProductInventory passes encoded id; no body | Response message; current page/search filtering; row or search-delete pending state, error toast |
| `addWarranty` POST `/api/warranties` | AddWarrantyModal: `{spec_id,warranties:[{title,price}]}` | Optional response.message; close/toast; no pending flag or local warranty refresh |
| Native fetch GET `/api/analytics/orders-analysis` | OrdersLedgerDashboard defines full endpoint locally; `start_date`, `end_date` as DD-MM-YYYY | Checks response.ok and truthy json.success, stores json.data; loading/error/retry; no Axios helper |
| Local POST `/api/inventory` | `src/app/api/inventory/route.js`; no frontend caller | Returns `{ok:true,received:body}` and logs body; catches to `{ok:false,error:String(err)}` HTTP 500; no persistence |

Axios helpers return raw data, not typed/validated DTOs. Except the narrower add-product helper, they generally reject `success === false` and truthy `error`, then derive error messages from response.data.message/error, error.message, or a fixed fallback. Search/detail return arrays before those checks. No frontend auth token, timeout, interceptor, global retry, or cancellation configuration is added. Remote API authorization, validation, exact successful mutation response schemas, and backend error codes are **Not clearly determined from the current codebase.**

### Analytics

OrdersLedgerDashboard initializes a date range from seven days ago to today. Changing either nonempty date triggers native fetch automatically; the ordinary Apply button is commented out, but Retry calls the same fetch function. It stores json.data and reads date, buy_orders, and sell_orders.

Each side uses total_count/value, cancelled_orders/value, and channel-specific `<channel>_count/value`. Buy channels: website, app, b2b, b2c; sell also includes olx. Net position is sell total minus buy total; cancelled totals are added across both sides. Values display as rounded numeric strings rather than INR-formatted prices. Initial loading shows skeletons; old data remains visible during subsequent requests/errors. No stale-response guard means fast date changes can race.

OrdersDashboard is an unused mock with hard-coded daily data and trend percentages. Its commented Firebase examples do not establish a Firebase SDK integration or actual weekly analytics endpoint.

## Data Flow

```text
Inventory route
  → ProductInventory effect / Next / Refresh
  → fetchInventory({startAfter?}) → Axios POST → external backend
  → accepted response list → pages[currentPage].products
  → current-page category filter → ProductRow → detail Link

Detail route params.id (awaited)
  → ProductDetail(id) → getProductDetail(id) → Axios GET
  → productData → flatten vendors/combination_offered → variants table
  → EditVariantModal draft → WarningPopup confirmation
  → images-only PATCH → local nested item.images → updated thumbnail

General creation
  → fields/hooks + specification definitions → generated groups/variant rows
  → local item modal saves → buildPreviewPayload → JSON Preview
  → Final Submit → local success toast (no HTTP)

CD/preorder creation
  → query category/code + native form → captured previewPayload
  → Final Submit → addProductToInventory → external backend
  → response message → toast + reset

Existing-product combinations
  → searchProducts → selected docId → getProductDetail
  → editable combination map → updateCombination(spec_id, map)
  → local specifications + saved baseline
  → item selection/draft → logged add-item payload (no HTTP)
```

## State Management

State is scoped to the screen that owns the workflow. Inventory pages/search are separate local states; detail owns fetched product data and modal selection; general creation owns draft documents and delegates field operations to hooks; AddVariant tracks draft versus saved combination maps and availability selections; warranty has only selection/price state; analytics owns date inputs and response state. Derived arrays use useMemo where implemented. No shared cache invalidation connects these routes; successful writes generally rely on local mutation/reset or a later fetch after navigation.

## Reusable Components

| Component / source | Main props and behavior | Active reuse |
| --- | --- | --- |
| `ItemDetailsFields`, `src/components/inventory/ItemDetailsFields.jsx` | item, vendorIndex, itemIndex, specId, updateItem(vendorIndex,itemIndex,field,value); SKU, numeric inventory/pricing, sell, iframe, four image URLs | General variant modal and detail edit modal; persistence belongs to parent |
| `ImagePreview`, same inventory directory | imageUrls; allowlisted URL thumbnails/lightbox | ItemDetailsFields, AddVariant, AddPreorderCd |
| `CombinationVariantsTable`, same directory | vendorIndex/items/specification/fields, sharedImagesByColor, confirmedImageColors, onSaveVariant | VendorsSection; expands attribute rows, matches drafts, portal modal |
| `VendorsSection` / `VendorDetailsFields`, same directory | vendors/specification and add/update/remove callbacks; field editor takes vendor+index | InventoryForm; name/note, variant table or setup guidance |
| `ProductFields`, same directory | fields, setField | InventoryForm; category-driven fields and video preview |
| `SpecificationSection` / `CombinationEditor`, same directory | specification+callbacks; editor combinations, onChange(updater), onGenerateFromAttributes | InventoryForm; colors, attributes, group editing |
| `DescriptionSection`, same directory | description plus hook callbacks/resetDescription | InventoryForm; form/JSON import and preview |
| `QuestionsSection` / `WhatsInTheBoxSection`, same directory | arrays plus add/update/remove callbacks | InventoryForm; question/option definitions and box contents |
| `FormActions` / `ResponsePreview`, same directory | sending/onPreview/onReset; resp/isPreview/sending/onFinalSubmit | InventoryForm; preview/final-submit UI without own HTTP |
| `WarningPopup`, `src/components/confirmation-modal/WarningPopup.jsx` | title/message, labels, isConfirming, onClose/onCancel/onConfirm | Creation image-sharing confirmation; detail image-save confirmation; body portal |
| `DeletePop`, same confirmation directory | productName, isDeleting, onCancel/onConfirm | Inventory rows/search deletion; body portal |
| `DescriptionPreviewModal`, `src/components/description-preview/DescriptionPreviewModal.jsx` | description object, onClose | DescriptionSection; flattens section fields, bullet-list values, paragraph summary |

`AddWarrantyModal` is currently feature-specific. `CombinationAttributesFields`, `DedicatedColorSelector`, and `VariantAttributeDefinitionsFields` exist but have no active imports; do not describe them as the current creation path. InventoryForm still passes obsolete item/attribute callbacks that VendorsSection no longer receives/uses.

## Utilities and Constants

- `src/utils/formatters.js`: lower-snake attribute-key normalization (input/final variants), title-style description keys, attribute value/display formatting, Firebase-to-CDN replacement.
- `src/utils/payload.js`: `parseNumberIfPossible` keeps blank strings and nonnumeric text; `keepPayloadKeys` recursively converts undefined object/array entries to empty strings.
- `src/utils/sku.js`: shared creation SKU algorithms; check the separate exported AddVariant generator before changing SKU behavior.
- `src/constants/inventory.js`: category code list, console/camera brand/type maps, empty-item defaults, phone/laptop cosmetic descriptions, default icon URL maps, Android questions (not auto-applied).
- `src/hooks/useDescriptionState.js`, `useQuestionsState.js`, `useWhatsInTheBoxState.js`, `useOptionDescriptionsState.js`: local immutable draft-state operations.
- `src/utils/helper.js` is empty. JSON examples in src/data and src/components/product.json are not imported. They show possible fields such as oneDayDelivery, warranties, timestamps, and reviews without proving active UI support or complete server contracts.

## Error Handling

HTTP helpers throw readable Errors; screens catch into inline errors or Sonner. Inventory/detail have explicit retries; search errors are independent from page errors. No error.js boundary is supplied. Some helpers/UI conversion functions silently fall back to empty/zero values. Bulk color JSON failures are ignored; description JSON failures surface. No universal validation or logging abstraction exists. Analytics does not clear previous data on error, so error and earlier content may coexist.

## Loading States

Inventory uses initial/page-refresh overlays plus disabled pagination; search has its own spinner/text; ProductDetail uses a full-screen loader; AddVariant/SpecialEdition have search/detail text and mutation busy labels; CD/preorder locks final submission. DeletePop disables actions while deleting. General sending and AddVariant submittingProduct currently wrap local work for disabled mutations. Warranty has no request-loading state. WarningPopup disables its bottom actions while saving but still permits X. Analytics uses an initial skeleton only when there is no data.

## Architectural Constraints

1. Distinguish active writes from local preview/logging before modifying a save flow. Never infer that a helper import or toast means persistence.
2. Preserve product ID versus spec_id and the vendor→combination→item map. SKU-addressed image updates use the original SKU; category-level spec IDs are not unique product IDs.
3. Keep frontend draft arrays/attributes separate from flattened persisted maps. Do not serialize transient editor keys or assume every generated row is saved inventory.
4. Specification updates currently affect only combination definitions; description and assessment authoring have no active generic update call. Remote effects on shared listings are unknown.
5. Preserve distinct product/item price fields, sell flags, and stock semantics. No frontend rule derives sell_max_price from sell_price or equates sell with in_stock.
6. Media is URL-based; preview allowlists, Next remotePatterns, and payload validation are different layers. No storage upload/delete semantics can be inferred.
7. Description preview and payload conversion are different implementations. Inspect both when changing field types, nested JSON, or key casing.
8. Duplicate SKU/category/media/YouTube helpers and unused components are real constraints; avoid treating them as a unified abstraction.
9. There is no in-repository backend/auth schema to confirm database ownership, live deployment permissions, warranties' merge rules, pricing economics, or assessment scoring. **Not clearly determined from the current codebase.**
10. Check current source and the installed Next.js docs before framework changes. Context files are a navigation aid, never stronger evidence than executable implementation.
