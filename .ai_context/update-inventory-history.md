# Update Inventory History

## 2026-10-03

### Description Editor AI Integration

- Integrated Gemini (`gemini-2.5-flash`) via the `✨ Generate with AI` button inside `DescriptionEditor.jsx`.
- Successfully implemented structured JSON generation using Gemini with Google Search grounding, enabling automatic form population.
- Abstracted and centralized prompt logic into a new utility file `src/utils/description-prompts.js` for better modularity (separating the strict CD description prompt from the generic fallback prompt).
- Improved the `✨ Generate with AI` button UI by adding a cycling loading state indicator (`🔍 Researching product...`, `✍️ Writing description...`, `✓ Preparing product details...`).

### Ollama Migration & Current Bugs

- Migrated the `/api/generate-product/route.js` API route from Gemini to local Ollama (`qwen2.5:7b`) utilizing `ollama.webSearch` and `ollama.chat`.
- **Bugs/Issues to handle:**
  - Ollama struggles to consistently output valid JSON, resulting in parsing errors and frontend crashes.
  - The model often returns improper or hallucinated data that does not reliably match the requested JSON schema from `description-prompts.js`.
  - Generation time is excessively slow compared to the previous Gemini implementation.
  - Result parsing and error handling in `route.js` is not robust enough to recover from Ollama's failure modes.

## 2026-09-15

### Product data sharing and caching

- Added shared `ProductContext` at the app root.
- Product Detail now checks context before calling `getProductDetail(id)`.
- Update Inventory reads the cached product first and uses `getProductFullJson(id)` only as a refresh/direct-navigation fallback.
- Added SWR caching for the Product Inventory first-page response.
- Disabled automatic SWR refetching on focus, reconnect, and stale mount.
- Preserved existing search and cursor-based pagination behavior.
- Updated cached inventory data after product deletion and explicit refresh.

### Product Detail and variant viewing

- Replaced the Product Detail description JSON editor and Apply action with the shared read-only description preview.
- Added a separate read-only View Variant modal while keeping the existing Edit Variant modal unchanged.
- View Variant shows attributes, SKU, weight, stock, pricing, sell status, images, and item YouTube video preview.
- Reused existing image lightbox and React iframe preview behavior.
- Added specification minimum price beside Max Sell Price.
- Added circular color-code swatches below the Product Video section.

### Description editor

- Unified `DescriptionSection` with the shared `DescriptionEditor` implementation.
- Added recursive rendering for nested description values in the preview modal.
- Fixed Description Sections runtime errors by rendering sections only when values are valid field arrays.
- Fixed Additional Fields to use stable local rows with empty editable Key and Value inputs.
- Incomplete Additional Field rows are excluded from final JSON.
- Additional Fields remain top-level values, separate from nested Description Sections.
- Add Product preorder/CD descriptions now start empty for manual user entry.
- Renamed the action to `Copy Prompt for Description` while keeping Form Mode, JSON Mode, and Preview.

### Questions and item controls

- Aligned Update Inventory Questions with Add Product for radio, checkbox, and dropdown types.
- Preserved JSON formats: radio/dropdown options are strings; checkbox options contain label, deduction, and icon.
- Added separate question creation buttons for all three supported types.
- Made question Type read-only.
- Renumbered questions sequentially after deletion, such as `q1`, `q2`, `q3` becoming `q1`, `q2`.
- Added fixed-size question and option delete controls.
- Replaced item sell checkbox with compact Add Items-style Available for Sell Yes/No buttons.

### Combination handling

- Manual combinations can now be created empty and edited with attributes and values afterward.
- Empty combinations remain visible in the combination editor for manual completion.
- Empty combinations do not generate inventory variant rows.
- Empty combinations are filtered out of the final specification payload.

### Verification

- `npm run build` passed after the completed implementation changes.

## Current inventory flow

Update Inventory page → Inventory tab → Vendor → Combination → Existing Item → Edit Item drawer → update existing item draft → recalculate global in_stock and sell → update parent inventory draft → Main Save → prepare final inventory_json → console.log final payload.

## Current inventory implementation

### Existing item editor

The current Edit Item drawer supports editing only the requested existing item fields:

- sku
- images
- mrp
- sell_price
- weight
- price
- stocks
- sell
- yt_iframe

The drawer keeps all other item fields intact and merges the update into the original item object instead of replacing it. This preserves nested item data such as:

- rating
- rating_count
- price_analysis
- accessories
- color
- storage
- unknown/custom fields

### Image handling

- Existing image URLs are editable, removable, and addable.
- Firebase Storage URLs are converted to CDN URLs through the existing `convertFirebaseImageToCdn` helper before the final payload is prepared.
- Existing CDN URLs are left unchanged.
- Empty image values are removed.
- Image order is preserved.
- The existing image preview UI is reused.

### YouTube iframe handling

- Existing `yt_iframe` values are displayed and editable.
- New `yt_iframe` values can be added to an existing item.
- A preview is rendered when iframe content is present.
- This is item-level only; no new items, vendors, combinations, or SKUs are created.

### Derived inventory flags

The inventory draft recalculates these values from all vendors, combinations, and items in the live inventory document:

- `inventory_json.in_stock = true` if any item has `stocks > 0`; otherwise `false`
- `inventory_json.sell = true` if any item has `sell === true`; otherwise `false`

These values are synchronized after item updates and before the final payload is logged.

### Temporary save status

The real `updateInventoryDoc` API function exists in the app, but the current Update Inventory UI does not call it yet.

Current behavior:

- inventory draft
- prepare final inventory_json payload
- recalculate global `in_stock` and `sell`
- console.log("Update Inventory Payload:", finalInventoryPayload)

Future integration point:

- inventory draft
- updateInventoryDoc(productId, finalInventoryPayload)

### Important current constraints

- No new items are created in this flow.
- No new SKUs are created in this flow.
- Vendors, combinations, and items are not created or deleted here.
- Existing SKU values can be changed.
- Untouched item fields stay intact.
- Specification editing is not part of this inventory-only flow.

## Overall note

The Update Inventory feature is currently in an inventory-draft + payload-preparation stage. It keeps the real API helper available, but intentionally logs the final payload instead of firing the backend request until that step is explicitly enabled.

## 2026-09-16

### Variant Image Propagation

- Added `ImagePropagationModal` (`src/components/confirmation-modal/ImagePropagationModal.jsx`) triggered when a variant's images are added, replaced, reordered, or removed during item edit in `EditItemDrawer`.
- Modal prompts: "Do you want to apply this image change to all variants with the same color?" with options:
  1. `Yes, update all same-color variants` → applies `applyItem` to current variant and `applyImagesToColor` to update image URLs across all matching same-color variants.
  2. `No, only this variant` → applies `applyItem` only to the current variant.
  3. `Cancel` → discards the image change and cancels save.
- Preserved all other variant fields (`price`, `mrp`, `sell_price`, `stocks`, `weight`, `sku`, `sell`, `yt_iframe`, ratings, etc.) across same-color variants.

### Specification API Integration & Clean Payload

- Integrated `updateSpecDoc(specId, specJson)` API call in `saveSpec()` inside `UpdateInventory.jsx`.
- Automatically strips `created_at` and `updated_at` properties from specification drafts during initialization and payload preparation.
- Ensures all entries in `color_codes` default to `#000000` if no color hex is filled in.
- Logs `Update Specification Payload` to console, updates baseline, toasts success, and refreshes `ProductContext`.

### CD, preorder, and inventory description ownership

- For inventory codes `D001Y` (PS5 CDs), `D002Y` (PS4 CDs), and `D003Y` (Pre Orders), the existing Description Editor now loads and updates `inventory_json.description`.
- These categories retain the same Form/JSON modes, Summary, Description Sections, Additional Fields, and Global Attributes behavior as other listings.
- Other categories continue to load and update `spec_json.description`.
- Inventory saves carry the edited CD/preorder description in the full inventory-document payload; the specification editor does not use it as its description source.
- For these three codes, the Description Editor is shown only in the Overview tab and is omitted from the Specification tab. Other categories retain its Specification-tab placement.
- Overview now allows category and condition edits. Changing category sets its matching code from `constants/inventory.js`; code is no longer manually displayed or editable.

### Variant and special-edition YouTube fields

- Add Variant now blocks all item-selection and item-form actions while `combinationsHaveChanges` is true. The existing Update Combinations flow clears that state after a successful update and re-enables item actions.
- Add Variant stores separate global and item YouTube iframe values in its outer payload and nested item payload respectively. Both use the shared safe preview helper and accept only HTTPS YouTube embed iframe sources.
- Special Edition now provides separate Global YouTube and Item YouTube iframe fields. The global value is stored on `product.yt_iframe`; the item value is stored on `product.vendors.VENDOR_001.combination_offered.combination_1.item_1.yt_iframe`.
- New Add Variant and Special Edition payloads use `rating: 4.5` and `rating_count: 115` for global products and nested items.

## 2026-09-19

### Specification & Inventory UI Adjustments
- Moved all internal additions (`+ Add Field`, `+ Add item`, `+ Add option`, `+ Add Dropdown`, etc.) to right-aligned placements at the bottom of their respective arrays/lists to ensure consistency and cleaner UI layouts.
- Fixed a bug causing dynamic `Condition` and `Type` attributes to erroneously display in the inventory table headers by explicitly filtering them out of the generated `combinationKeys`.
- Added a `Fast Pickup Deduction` field located next to `Minimum Price` under a unified "Pricing Rules" section. It dynamically renders a `+ Add` initialization button when the value is not present, rather than auto-rendering empty inputs.

### Payload Cleanup & Type Validation
- Introduced a `cleanInventoryPayload()` step in `UpdateInventory.jsx` that runs immediately before hitting the backend save endpoints.
- Strictly parses and enforces `Number` typings for critical fields at both the root product and deep variant levels (`mrp`, `price`, `sell_price`, `stocks`, `rating`, `rating_count`), preventing numeric strings (e.g., `"2"`) from being stored in the database. 
- Gracefully handles empty string `""` evaluations by defaulting them to `null` to avoid type errors in backend ingestion.
- Safely strips localized `created_at` and `updated_at` payload keys to avoid accidental overwrite on update.
- Parses user-facing weight formatting (removing appended `"kg"` strings) back into raw decimals for backend storage.

### Product Inventory Filter Features
- Replaced local client-side category filtering with a backend-driven API approach. When changing categories in `ProductInventory.jsx`, the UI passes `{ code: categoryCode }` to `fetchInventory` to load focused category results.
- Built a smart caching mechanism for the "All Category" default state; switching back instantly pulls from memory to completely avoid a redundant API call.
- Replaced the text-based "Search" and "Clear" buttons with clean, square icon buttons using Lucide's `Search` and `RefreshCw` icons.

### Additional Fixes & Features
- Fixed an issue preventing users from jumping to the Specification tab.
- Added a `Weight` field directly to the Inventory table (positioned before MRP) for seamless viewing and inline editing.

## 2026-09-21

### Price Analysis Integration
- Designed and added a new price analysis function to track product pricing metrics.
- This function helps monitor profit margins and dynamically alerts on underpriced items.
- Structured the pricing data to automatically compare current sell prices against the moving average.

### Accessories Integration
- Began integrating accessories functionality for core products (like consoles).
- Prepared the UI to allow attaching related accessories seamlessly from the inventory page.
- Adjusted underlying schemas to support relational accessory links without breaking core inventory logic.

### Complete Ledger Details Overhaul
- **Backend Integration**: 
  - Integrated the `getLedgerBySku` API endpoint within `api.js`.
  - Configured SWR caching for seamless and dynamic variant ledger data fetching.
- **Ledger Entries Page Redesign**: 
  - Built a completely new, visually striking layout from scratch.
  - Re-engineered the top-level Summary Cards to use soft, distinct pastel backgrounds (`bg-sky-50`, `bg-amber-50`).
  - Added dynamic Lucide icons for instant visual recognition of metrics.
- **Advanced Table UI Implementation**: 
  - Constrained the main data table within a scrollable `max-h-[70vh]` view.
  - Implemented sticky headers (`sticky top-0`) to maintain context during deep scrolling.
  - Revamped typography with bold dark headers and gray customer names against dark Order IDs.
  - Added dynamic profit calculations (`sell_price - buy_price`) directly inside the table, highlighting positive margins in green and negative in red.
  - Transformed basic status text into colored pill badges (e.g., Amber for Under Evaluation).
- **Comprehensive Details Modal**: 
  - Rebuilt the Ledger Entry modal using a clean, grid-based card layout.
  - Added `Mail` and `Phone` icons wrapped in interactive `mailto:` and `tel:` links with hover states.
  - Styled custom badges for specific metadata like Payment Method and Shipment Charge.

## 2026-09-22

### Description Editor Flattening
- Completely redesigned the internal state management of `DescriptionEditor` and `SpecificationTab` to produce a fully flat product description JSON.
- Eradicated all uses of the artificial `"TOP"` section and section headers from the codebase.
- Added deep flattening logic to extract the deepest key-value pairs from nested JSON objects (e.g. `Global_Attributes` or `Gameplay`), ensuring a clean and direct property list.
- Configured "Add Field" to inject new keys directly into the root description object rather than nesting them.

### Price Analysis Integration Fixes
- Updated `PriceAnalysisModal` rendering conditions to safely support and display values even when `buy_price` or `sell_price` are exactly `0`.
- Fixed data propagation in `UpdateInventory.jsx` so that `sku`, `buy_price`, and `sell_price` route correctly from variant items into the analysis modal.

### Search and Pricing Rules UI
- Lifted category-selection constraints on the global search bar, allowing users to query freely without pre-selecting a category.
- Refactored the `fast_pickup_deduction` logic in `PricingRules.jsx` to render an intuitive `+ Add Fast Pickup Deduction` button, replacing it with an input block and a clear "Remove" action when toggled.

### Ledger UI Polish
- Updated the "View Details" button styling within the `LedgerEntries` table to use a modern `violet` color theme (`bg-violet-50`, `text-violet-600`), replacing previous `orange` styling for better visual harmony.

## 2026-09-26

### Ledger & Inventory Analytics Dashboard Refresh
- Completely revamped the `Analytics.jsx` UI to a clean, modern light theme using Tailwind CSS (following the Stitch design system).
- Transformed static dummy statistics into a robust, data-driven React state structure capable of dynamic rendering.
- Implemented visual horizontal progress bars for "Inventory by Category" and "Inventory Aging Analysis" that compute widths natively based on percentage data.
- Built a localized category filter (`agingCategory` state) specific to the Aging Analysis block, allowing users to cross-reference global vs. category aging without modifying the global top-bar filter.
- Systematically migrated all legacy Google Material Symbols (`material-symbols-outlined`) across the entire page to modern `lucide-react` SVGs while perfectly retaining layout sizes and brand colors.
- Enhanced data visibility in the Aging Analysis layout by surfacing absolute unit counts (e.g. `4,240 Units`) and monetary values (e.g. `₹77.3 Lakh`) immediately adjacent to the percentage metrics.

## 2026-09-28

### Ledger Movement Simplification & Refactor
- Completely rewrote the "Ledger Movement (Intake vs Outflow)" section in `Analytics.jsx` to exclusively track and display core inflow/outflow metrics (item count and ₹ value).
- Removed extraneous metrics (e.g., Net Units, Net Capital Impact, Audit Status, Reconciled badges) in favor of a strictly focused intake/outflow paradigm.
- Replaced the prior SVG area chart with a clean, dynamic grouped bar chart natively generated via SVG.

### Advanced Data View Controls
- Introduced a central `Daily` vs `Monthly` interval toggle.
- **Daily View:** Added localized `Start Date` and `End Date` selectors, rendering the exact day-by-day item/value movement across the selected timeframe.
- **Monthly View:** Designed a dual-dropdown layout (`Start Month` and `End Month`) traversing historical data from Jan 2025 onwards, allowing aggregation across multi-month spans instead of being locked to a single month.

### Scalable UI Handlers for Large Datasets
- Rebuilt the SVG chart container to handle infinitely scaling timeframes by decoupling it from the screen width. It now uses calculated dynamic widths and a `custom-scrollbar` wrapper for horizontal overflow, while natively flexing to 100% of available space when dates are sparse.
- Constrained the data summary table to a reasonable `max-h-[300px]` with vertical scrolling and a `sticky top-0` header, ensuring large multi-month data pulls do not vertically distort the dashboard layout.
- Strictly standardized the table format to output `[Date] | [Ledger In: +Units · ₹Value] | [Ledger Out: -Units · ₹Value]`.

### Next.js Build Resolution
- Diagnosed and repaired a severe JSX syntax compilation error (`Expected '</', got 'jsx text'`) at the end of `Analytics.jsx` caused by broken trailing `</div>` closures following heavy block refactoring, restoring successful `npm run build` execution.

## 2026-09-29

### Ledger Dashboard Streamlining
- Removed the massive "Detailed Inventory Explorer" section and its associated table from `Analytics.jsx` entirely, aggressively streamlining the UI to focus purely on the core Ledger Movement and Aging data blocks. 
- Executed `npm run build` after heavy block removal to verify structural integrity.

### Strict Configuration Icons JSON Conversion
- Modified the data layer in `InventoryForm.jsx` (Add Product) and `SpecificationTab.jsx` (Update Inventory) to enforce a strict key-value JSON object structure (`{ "Key": "URL" }`) for `configuration_icons`, migrating away from state arrays.
- Ensured that if a user submits no icons, the payload gracefully defaults to an empty JSON object `{}` rather than an empty array `[]` inherited from the UI array-state.
- Enforced real-time CDN conversion (`toCDN` / `convertImageToCdn`) on icon URL assignment to guarantee all generated links are fully CDN-wrapped.

### Numeric Variants & Float Casting Bug Fixes
- Fixed a widespread floating-point block in `ItemDetailsFields.jsx` where strict `Number()` evaluation wrapped inside `onChange` handlers forced decimals (like `0.`) to instantly collapse into integers, preventing users from typing valid floats like `0.5`. 
- Removed hardcoded `" kg"` strings that were previously appended inside the payload state mapping of `CombinationVariantsTable.jsx`. These strings had silently forced the global payload compiler's `Number()` parser to fail with `NaN`, causing valid user inputs to be destructively overwritten by `0`.
