# Update Inventory History

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

