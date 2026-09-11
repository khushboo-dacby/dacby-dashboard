# Design

This describes existing JSX/CSS as inspected on 2026-09-09; it is not a proposed redesign or a browser-verified visual audit. Source paths below are relative to the repository root.

## Visual Style

The active UI is a light administrative dashboard: pale page backgrounds, white bordered cards, dense forms/tables, rounded controls, and colored status indicators. `ProductInventory` and `ProductDetail` use slate/blue; `InventoryForm` overlays cyan accents; add-variant, CD/preorder, special-edition, and analytics screens use indigo banners and green submit actions. There is no shared dashboard shell or sidebar.

Cards commonly use `rounded-xl`/`rounded-2xl`, `border-slate-200`, `p-4`/`p-6`, and `shadow-sm`. Confirmation and warranty dialogs use `rounded-3xl` and `shadow-2xl`. The general creation container uses `shadow-xl shadow-cyan-100/60`. These are recurring utilities, not centralized component tokens.

## Colors

Preserve the actual Tailwind class names; no custom semantic palette is defined.

| Role | Verified recurring classes / values | Examples |
| --- | --- | --- |
| Primary action | `bg-blue-600`, `hover:bg-blue-700`, `text-blue-600` | Inventory add button, detail edit/save, warranty |
| Form accent | `bg-cyan-50`, `text-cyan-700`, `focus:ring-cyan-100`, cyan-to-blue gradient | General product creation |
| Section/banner | `bg-indigo-900`, `from-indigo-950 to-indigo-700` | Add-variant and CD/preorder |
| Special edition | `from-indigo-950 to-amber-800`, `text-amber-200` | Search banner |
| Positive | `bg-emerald-50 text-emerald-700`, `bg-green-600` | Stock badges, submit actions |
| Warning | `bg-amber-50`, `text-amber-800`, `bg-amber-400/500` | Missing-combinations guidance, confirmation |
| Error/destructive | `bg-rose-50 text-rose-700`, `bg-rose-600`, `text-red-600` | Out-of-stock/delete and JSON/API errors |
| Surfaces | `bg-slate-50`, `bg-gray-50`, `bg-white` | Pages/cards |
| Text | `text-slate-950/900`, `text-slate-700`, `text-slate-500/400` | Headings, labels, secondary text |
| Border | `border-slate-200/300`, `border-gray-200` | Cards and controls |

Explicit literals include `#ffffff` and `#0f172a` in the general form's select override, `#e2e8f0` in the inventory table header shadow, and `#000000` as the default editable product color. Color swatches represent product data, not UI branding.

## Typography

Geist font variables are attached in `src/app/layout.js`, but no CSS connects them to the rendered font family. Default/system Tailwind font families are used unless a future change adds that mapping. `font-mono` marks SKUs, spec IDs, JSON inputs, and previews.

Inventory/CD/preorder page titles use `text-3xl`; detail titles and section headings are smaller (`text-xl` and `text-lg`). General creation uses a `text-2xl` heading. Body/form copy is commonly `text-sm` or default size; labels use medium/semibold; helpers use `text-xs` or `text-sm` with muted colors. Analytics adds uppercase `text-[11px]` metric labels, bold/extrabold values, and `tabular-nums`.

## Layout

- Inventory: `h-screen overflow-hidden`, `px-4 py-8 sm:px-10 lg:px-20`; search/filter header above a flexing, internally scrollable table and pagination footer.
- Detail: `min-h-screen`, the same responsive side padding, stacked `space-y-6` cards. Pricing uses `sm:grid-cols-2 lg:grid-cols-4`; vendor/metadata use `sm:grid-cols-3`.
- General creation: `max-w-6xl`, a large white container, section spacing `space-y-6`; product fields become two columns at `md`.
- CD/preorder and special edition: `max-w-7xl`, separate white page header, indigo/gradient feature banner, responsive two/three-column fields.
- Add-variant: fixed `px-20 pt-20` on the outer container; some inner grids use `md:grid-cols-2`, but the outer padding does not adapt for narrow screens.
- Active analytics: `max-w-6xl`, wrapping metrics and a one-column/two-column buy/sell grid at `md`.

Navigation comes from `AddNewProduct`'s three-step choice modal, inventory detail links, and local back/close buttons. `/analytics` exists but no navigation link to it is rendered in the inspected inventory flow.

## Forms

Native inputs/selects/textareas have labels above them, rounded borders, `px-3 py-2` or `px-4 py-3`, and blue/indigo/cyan focus states. `ProductFields` has mapped-or-custom Brand/Type controls for Consoles and Cameras. Category selection sets the category code and certain spec IDs. Condition uses a select; item sell status uses a checkbox, while specialized forms use Yes/No buttons.

Dynamic editors add/remove section fields, attribute chips, colors, vendors, and questions. Enter adds values; specification value inputs also remove their final chip on Backspace when empty. Description has a real Form Mode/JSON Mode switch, with success/error messages after automatic JSON import. The general form's descendant rules override some nested background/text/focus classes, including its nominally dark JSON editor styling.

Required indicators are inconsistent: CD/preorder forwards `required` to inputs, while add-variant and special-edition field helpers only display the asterisk. Warranty uses a required numeric price (`min=0`, `step=1`, change-handler ceiling 100000). No global form-validation or field-error component exists.

## Tables

`ProductInventory` uses a sticky pale header and scrollable native table: image, title/variant count/code, category, pricing, stock status, view/delete actions. Thumbnails are 96 px squares with `object-contain`; discounted MRP is struck through. Stock badges depend on `in_stock && !outofstock`. Search results instead use cards with their own `outOfStock` handling.

Category filtering applies only to the current fetched page. Previous/Next use a locally cached cursor flow. Refresh reloads page one. There are no sortable column controls.

Detail variants use a horizontally scrollable `min-w-max` table with 48 px images, monospaced SKU, dynamic attribute columns, stock/price/sell-price/MRP, and Edit. Stock counts always get an emerald badge, including zero. `CombinationVariantsTable` shows generated draft rows with blue Add Variant or amber Edit Variant buttons; it does not display the detail page's pricing columns.

## Buttons

Primary inventory/detail actions are blue; creation preview/final-submit uses cyan-to-blue gradients; specialized submit and combination-update actions use green. Secondary actions have white/pale surfaces and borders. Remove/Delete uses rose/red, confirmations use amber. Icon buttons commonly pair a border with hover tint and an `aria-label`, but labeling is not uniform.

Disabled states use reduced opacity, gray/green-muted fills, and `cursor-not-allowed`. Busy labels include Working, Saving, Deleting, Updating Combinations, and Adding Product. They do not always imply a network call; see architecture's persistence map.

## Modals

| Component | Structure and sizing | Actual close/save behavior |
| --- | --- | --- |
| `AddNewProduct` (`src/app/home`) | `z-50`, black/50 backdrop, full-width white box, responsive choice grids | X and Back/step controls; opening resets selections; no Escape/backdrop dismissal handler |
| Creation `VariantModal` (`CombinationVariantsTable`) | Body portal, `max-w-5xl`, `max-h-[92vh]`, scrollable body, bordered header/footer | Cancel/X; saves draft to parent; optional color-wide image confirmation |
| Detail `EditVariantModal` (`ProductDetail`) | `max-w-4xl`, 92vh, scrollable body | Cancel/X; warning confirmation; only images persist |
| `WarningPopup` | Body portal, `z-[60]`, `max-w-md`, amber alert icon, paired buttons | Configurable labels/callbacks; confirmation/cancel buttons disable while saving; X remains enabled |
| `DeletePop` | Body portal, `z-50`, `max-w-md`, rose alert icon | Cancel/X/Confirm disable while deleting |
| `AddWarrantyModal` | `max-w-xl`, rounded-3xl, radio-like plan cards, price field, footer | Escape, backdrop, Cancel, X; API success closes it; no request-busy state |
| `DescriptionPreviewModal` | Body portal, `max-w-5xl`, 92vh, scrollable details and summary cards | X button; description arrays become bullet lists, summary splits on blank lines |

Some dialogs include `role="dialog"` or `alertdialog` and ARIA labels; there is no shared focus trap, focus restoration, or universal Escape/backdrop behavior.

## Tabs

Description Form Mode/JSON Mode actually switches views. Combination groups are accordions with local open state. The detail page's Variants / Specifications / Assessment / Warranty strip is four static `<span>` labels, with no click handlers, anchors, or active-tab state. Analytics' Channels underline is also decorative, not a tab control.

## Product UI

The detail header shows title, category, category-code/condition pills, Back, and Add Warranty. Separate cards show product price/MRP/max sell price/extra coins and the first vendor's name/rating/sales. The variants table follows. Specifications are represented by a 20-row Description JSON editor; there is no rendered specification-section table or assessment panel on this page. Existing warranties are not listed. Product video appears only when the stored iframe source passes the page's YouTube-host check. Metadata shows product ID, spec ID, and a formatted creation timestamp.

Images are URL inputs and thumbnails; `ImagePreview` adds an 80 px thumbnail strip and photo-view overlay with navigation. Special-edition image inputs do not reuse that preview. No upload/dropzone UI exists.

## Feedback

Sonner provides top-right rich-color toasts. Inventory has an overlay spinner, refresh animation, inline errors with retry, and empty messages. Search shows separate searching/error/no-results states. Detail replaces the page with loading or retry/error states. Analytics uses an initial pulsing two-card skeleton and keeps existing data visible on later fetches. Description has inline JSON errors; clipboard prompt copying in CD/preorder uses browser `alert` rather than toast.

## Responsive Design

Use the breakpoints and scrolling behavior above as the verified behavior. Tables remain tables and scroll rather than converting to mobile cards. Dialog bodies have height limits where explicitly configured. The chooser and warranty modal lack the same 92vh scroll structure. Fixed padding/widths remain in add-variant and some question/attribute controls; a uniformly mobile-optimized experience is not established by source.

## Reusable Design Patterns

Prefer the existing `ItemDetailsFields`, `ImagePreview`, `CombinationVariantsTable`, `DescriptionSection`, `WarningPopup`, `DeletePop`, and `ResponsePreview` for their established tasks. Inspect the parent before copying classes: the general creation page applies substantial style overrides, and modal components rendered through portals escape those ancestor selectors. Page-local `FormField`, `TextField`, and analytics cards are not a shared component library.
