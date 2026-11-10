# Update Inventory History

## 2026-11-02

### Blogs & Articles Management Studio (`/blogs`, `/blogs/[id]`, `/blogs/add`)
- **Modular Feature Architecture**:
  - Built isolated Next.js feature folder `src/app/blogs/` with CSS Modules (`blogs.module.css`, `blogDetail.module.css`, `addBlog.module.css`), strictly adhering to `AGENTS.md`.
  - Added mock dataset and localStorage storage engine (`mockBlogs.js`) with CDN image assets, date formatting helpers, and dynamic append helpers.
- **Blog Listing Page (`/blogs`)**:
  - Styled dark navy/indigo gradient header banner matching the DACBY inventory/product banner aesthetic.
  - Implemented high-contrast white CTA button with deep indigo typography (`#1e1b4b`), subtle border, and **`Post Blog`** action text linking to `/blogs/add`.
  - Responsive cards grid (`BlogCard.jsx`) featuring cover banners, category hashtag badges, excerpt, publish date, and `Read Article ↗` link.
- **Blog Detail & Article Viewer (`/blogs/[id]`)**:
  - Complete article view with breadcrumb navigation (`Home` → `Blogs & Articles` → `Article`), author attribution, read time, and publish dates.
  - Multi-section body renderer with subheadings, body paragraphs, and fallback section images.
  - **Inline Backlinks Engine (`InlineBacklinksText.jsx`)**: Intelligent keyword parser that detects defined anchor keywords inside body text and transforms them into interactive blue internal Next.js `<Link>` elements.
- **Enterprise Blog Creation & Section Append Studio (`/blogs/add`)**:
  - **Dual Mode Switcher**:
    - `Create New Blog` mode for fresh articles (Title, Slug, Read Time, Category, Cover Image URL, Meta description, Keywords).
    - `Add to Existing Blog` mode for appending sections to existing articles.
  - **Existing Blog Target Preview Card**: Enterprise preview card surfacing blog cover thumbnail, publish date, current section count, and a direct `View Blog ↗` link.
  - **1-Based Sequential Section Numbering**: Automatically offsets section index by existing content length (e.g., if a blog already has 5 sections, the first added section displays as `Section 6`).
  - **Live Section Image Preview**: Real-time thumbnail preview rendered immediately upon entering/pasting valid image URLs.
  - **Backlinks Manager**: Interactive keyword and target URL pairing builder for article backlink automation.
  - **Always-Visible Red Delete Buttons**: Styled section deletion buttons in prominent red (`#e11d48`, background `#fff1f2`, border `#fecdd3`) for high visibility without requiring hover.
  - **Refined Typography & Inputs**: High-contrast placeholder text (`#64748b`), 1px input borders, subtle elevation shadows, and borderless pill mode switcher tabs.

### Add Product — Smartphone Form Auto-Fill (`InventoryForm.jsx`)
- **Smartphones Category Pre-population**:
  - Added dynamic `useEffect` listener on category switch to automatically populate required fields when "Smartphones" is selected:
    - **Attribute Definitions**: Pre-populates `color` (empty), `storage` (empty), and `physical_condition` (pre-filled with `"Very Light Marks"` and `"Light Marks"`).
    - **Configuration Icons**: Automatically configures CDN URLs for `Storage`, `Ram`, `Physical Condition`, and `Battery health`.
    - **Q&A Tab Questions**: Configures boot status radio (q1), hardware/display/camera defect check (q2), and Accessories Missing checkbox with USB-C cable deduction (q3).
    - **What's in the Box**: Auto-fills icons and labels for Smartphone and Charging Cable.
    - **Minimum Price**: Defaults minimum price to ₹1,000.

### Combination Variants Table — Same-Storage Auto-Fill (`CombinationVariantsTable.jsx`)
- **Bulk Variant Pricing Synchronization**:
  - Added same-storage auto-fill logic: updating pricing fields (`mrp`, `sell_price`, `price`, `stocks`, `weight`, etc.) for any combination item automatically patches sibling variants that share the same storage specification, streamlining batch inventory pricing.

### Description Editor — JSON Mode & Synchronization (`DescriptionEditor.jsx`)
- **Interactive JSON Panel**:
  - Added a toggleable `JSON` button alongside `Preview` featuring an expandable mono code editor.
  - Implemented bidirectional synchronization: loads formatted JSON from the active form state and applies user JSON modifications back to the structured form state with error validation and success feedback.

## 2026-10-21

### Buy Orders & Sell Orders Module (`/buy-orders`, `/sell-orders`)
- **Consolidated Structure**: Cleaned up duplicate directories into `src/app/buy-orders/` with `forward/` (`{ return: false }`), `returns/` (`{ return: true }`), and centralized `apis/api.js`.
- **Sell Orders Pipeline**: Added outbound customer fulfillment tracking at `/sell-orders`.

### Unified Global Operations Sidebar (`GlobalSidebar.jsx` & `GlobalAppShell.jsx`)
- **Persistent App Shell**: Integrated into `RootLayout` with expand (`w-[264px]`) and collapse (`w-[76px]`) modes, royal blue active pills (`#2A67EC`), and collapsible menu groups.
- **Contracted Hover Popovers**: Added floating white popover boxes on collapsed icons for 1-click sub-page navigation.

### Forward Buy Orders SWR Caching & UI Polish (`/buy-orders/forward`)
- **SWR Caching**: Implemented `useSWR` with isolated composite keys (`buy-orders:forward:${status}:${page}:${cursor}`) and `revalidateIfStale: false` for instant cached loads and zero redundant API calls.
- **Cache Purge on Refresh**: Clicking "Refresh" clears all `buy-orders:forward` cache keys and re-fetches live data fresh.
- **Dynamic Status Column**: Conditionally renders a 7th column for "Last Updated Timestamp" with status badges when a status filter is applied.
- **Grid & Spacing Optimization**: Re-engineered 6-col / 7-col CSS grid templates, added `pl-8` Customer Details clearance for the sticky divider, and enforced single-line `whitespace-nowrap` on all dates with right-aligned Created At.
- **Badges & Status Polish**: Restored `B2C`/`B2B` customer pill badges and simplified milestone "Pending" status to clean amber text.

## 2026-10-19

### Live Data Industry Operations & Analytics Dashboard (`/live-data-industry`)
- **Daily Sales Velocity Bar Chart (`DailySalesBarChart.jsx`)**:
  - Implemented daily revenue velocity analytics broken down by DACBY category codes (Consoles, Games, Controllers, Accessories, etc.) and volume units.
  - Added multi-mode toggle controls: Total Sales, Stacked (B2C + B2B), B2C Only, and B2B Only.
  - Built custom hover tooltip (`DailySalesCustomTooltip`) displaying category breakdown, rupee turnover, unit counts, and B2C vs B2B distribution.
  - Included executive summary KPI chips (Total Turnover in Lakhs/Cr, Daily Average, and Units) alongside dynamic Y-axis scaling and peak day record indicators.
  - Added category processing helpers in `utils/categoryUtils.js` for simulated turnover distribution and category code mappings.

- **Order Value Velocity Line Chart (`OrderValueVelocityChart.jsx`)**:
  - Implemented month-over-month order velocity benchmark comparison with previous month baseline (dashed line) and current month progress (solid line).
  - Built interactive hover tooltip showing day-of-month order values, historical benchmarks, and absolute/percentage differences with positive/negative color accents.
  - Added segment toggling (All, B2C, B2B) and metric filters (Total Sales, Total Orders, Average Order Value).
  - Integrated live highlights tracking the highest single day turnover and largest daily jump with date timestamps.
  - Connected with the live order analysis API in `api/orderAnalysisApi.js` with comprehensive loading, error retry, and empty states.

- **Live Data Industry Page Architecture & Enhancements (`Live_Data_Industry.jsx`)**:
  - **Filter Enhancements**: Updated reporting period controls (`today`, `yesterday`, `last7`, `last30`, `custom`) so that selecting "Today" retains key visual analytics (such as the Channel Mix circular donut chart) alongside metric cards.
  - **Live Operations Removal**: Removed the legacy live operations section to streamline dashboard focus on core commercial metrics and demand velocity.
  - **Descriptive Headings & Semantic Hierarchy**: Overhauled section headings, cards, and labels across Commercial Performance, Channel Mix, Daily Trends, Channel Trends, City Demand, and Inventory/Returns status with clear, readable titles, descriptive subtitles, and operational status badges.
  - **Typography & Contrast Audit**: Audited typography and upgraded contrast across subtitles, micro-labels, axis ticks, and metrics using Tailwind CSS utility classes directly on elements without modifying global stylesheets.

## 2026-10-18

### Customer Profile Overview & Left Sidebar Restructure (`/customers`)
- **2-Column SaaS CRM Layout Overhaul**:
  - Moved the full profile section to the left sidebar ([`CustomerProfileSidebar.jsx`](file:///Users/dacby/dacby-dashboard/src/app/customers/components/CustomerProfileSidebar.jsx)) matching the SaaS CRM layout (circular avatar, quick circular buttons for Note/Email/Call/Wallet/More, collapsible contact details, financial standing, and push notification tokens).
  - Added modern top bar ([`CustomerTopNav.jsx`](file:///Users/dacby/dacby-dashboard/src/app/customers/components/CustomerTopNav.jsx)) with breadcrumbs, centered search input with `⌘K` shortcut hint, action controls, and an "Add Funds" modal button.
  - Removed the Analytics tab per request, leaving a streamlined navigation tab bar (Overview, Orders, Wallet & B2B, Addresses, Payments).
- **Overview & Sidebar De-duplication**:
  - Removed fields from [`CustomerOverview.jsx`](file:///Users/dacby/dacby-dashboard/src/app/customers/components/CustomerOverview.jsx) that already exist on the left sidebar ([`CustomerProfileSidebar.jsx`](file:///Users/dacby/dacby-dashboard/src/app/customers/components/CustomerProfileSidebar.jsx)):
    - Removed `Contact Phone` (already in sidebar quick-call button & Contact Details).
    - Removed `Source` (already in sidebar as `Channel Source`).
    - Removed `Account Tier` (already in sidebar header badge).
    - Removed duplicate `UPI Settlement ID` & `Bank Account` rows from the Profile Overview key-value table, and removed duplicate payment pills from the sidebar so that Payment Details live exclusively in the dedicated **Payment & Settlement Details** card section in Overview.
    - Updated the Operational Facility card in Overview to focus on order fulfilment volume & delivery SLA pipeline rather than repeating the wallet balance from the sidebar.

## 2026-10-17

### Customer Profile & Operations Architecture (`/customers`)
- **Concurrent Data Fetching (`Promise.all`)**:
  - Refactored `Customer.jsx` and added `getCustomerWithOrders` in `src/app/customers/api.js` to execute `getUserDetails` and `fetchUserOrders` concurrently via `Promise.all`.
  - Passed `initialOrders` into `CustomerOrders` and `CustomerAnalytics` to eliminate duplicate redundant network requests across tab switches.
- **Industry-Level Customer Analytics Tab**:
  - Implemented `src/app/customers/components/CustomerAnalytics.jsx` deriving all analytical metrics directly from live API data.
  - Added summary KPIs for gross spend, completed orders, cancellations, and sell revenue.
  - Added real Order Frequency breakdown (Monthly averages, Quarterly volumes, Half-Yearly H1/H2, Yearly summary).
  - Integrated interactive Recharts Area Chart with metric toggle (Gross Spend vs Order Count Velocity) and customized tooltips.
  - Implemented Top Purchasing Categories ranker with percentage progress bars and Payment Method Distribution Donut Chart.
- **B2B Credit Facility & Conditional Wallet Switcher**:
  - Added B2B Credit Facility support inside `src/app/customers/components/CustomerWallet.jsx` alongside the standard retail store wallet.
  - Displays total facility limit, available-to-draw, on-hold reserves, and a dedicated searchable/paginated ledger for wholesale transactions (recharges, order hold transfers, UTR tracking).
  - Implemented conditional rendering (`hasB2BWallet`): when customer is not a vendor (`!isVendor` or absent `b2b_wallet`), the dual-card switcher is completely hidden, directly presenting a clean **Customer Store Wallet** view with an informative retail account badge.
- **Order Details Modal & Media Integration**:
  - Cleaned up `OrderDetailModal.jsx` by removing raw JSON response displays and aligning badge layout hierarchies.
  - Resolved product image rendering using Next.js `Image` (`next/image`) with pre-configured `remotePatterns` for `dacby-database.web.app/cdn/**`, resolving browser `Cross-Origin-Resource-Policy: same-origin` blocks without manual URL transformations.
- **Full DACBY Design System Alignment**:
  - Conducted a comprehensive color audit of all files in `src/app/customers/` against `.ai_context/color-palette.md`.
  - Replaced arbitrary `slate-*`, `gray-*`, `amber-*`, and non-palette colors across `Customer.jsx`, `CustomerHeader.jsx`, `CustomerTabs.jsx`, `CustomerOverview.jsx`, `CustomerOrders.jsx`, `CustomerPayments.jsx`, `CustomerAnalytics.jsx`, and `OrderDetailModal.jsx`.
  - Aligned surfaces to `#F6F8FC` / `#FFFFFF` / `#F2F5FA`, borders to `#DCE5F1`, text to `#151D35` / `#53647F` / `#71809A`, buttons to `#2A67EC` hover `#1E57D2`, and chart palette to DACBY multi-series tokens.

## 2026-10-13

### SLA Industry Operations Dashboard (`/sla-industry`)
- **Interactive Multi-Category Architecture**: Converted the mockup into full React JSX with Tailwind CSS v4 in `src/app/sla-industry/Sla_Industry.jsx`, supporting dynamic category switching across `All Categories (21)`, `B2C Purchases (6)`, `B2B Purchases (2)`, `B2C Sales (9)`, `B2B Sales (1)`, and `Inventory (3)`.
- **Status Filtering Engine**: Added dynamic status dropdown filtering (`Overdue`, `Due Soon`, `On Track`, `SLA Not Configured`, `All Cases`) wired simultaneously into the interactive horizontal bar chart and detailed data table.
- **Explicit Category Association**: Explicitly mapped each operational issue to its respective category badge pill (`B2C Purchases`, `B2C Sales`, `Inventory`, `B2B Purchases`, `B2B Sales`) in the **Top Breached Issues (All Categories)** card, the **Category Issues Breakdown Bar Chart**, and the **Operational Issues Table**, enabling click-to-filter navigation directly to each category.
- **Theme Unification & Color Restraint**: Converted the dashboard aesthetic to match the Scanner Console reference design:
  - Added solid Dark Navy (`#242b5c`) header bars across all major cards and data tables.
  - Replaced noisy rainbow colors with a cohesive palette (`#242b5c` dark navy, `#3b82f6` royal blue, `#94a3b8` cool slate, `#eff2fc` lavender-navy pills).
  - Aligned KPI summary cards with unified `#eff2fc` / `#242b5c` icon containers and muted typography.
  - Restyled donut chart and proportion progress bars with cohesive navy and slate tones.
- **Console-Styled Top Header**: Replaced the original header with a Scanner Console-style header card featuring an uppercase kicker (`OPERATIONS SLA`), bold console title, and a pulsing green `Ready & Active` pill indicator.
- **Sidebar & Clutter Removal**: Removed the Left Navigation Sidebar completely (`<aside>` and collapse state), stripped out redundant table search and date range filters, and expanded the dashboard layout to a clean full width.

### SLA Breach Monitor Dashboard (`/sla-breach`)
- **Dashboard Implementation**: Built `src/app/sla-breach/SLA_Breach.jsx` and connected to route `src/app/sla-breach/page.js` adhering strictly to the dashboard's blueish theme (`#232d65` navy, white cards, elevated shadows, slate typography).
- **Owners & Filters Removal**: Removed owner-related elements (owner dropdown, table owner columns, breaches by owner card) and top header filter controls (status/warehouse dropdowns, apply button) for an uncluttered live view.
- **Elevated Shadows & Layout**: Applied `shadow-md hover:shadow-lg` across all KPI cards, area breakdown bars, and data tables with full-width responsive padding.

## 2026-10-12

### Image URL Validation & Next.js Crash Fix
- **Image Input Sanitization**: Created `src/utils/imageValidation.js` with diagnostics, auto-clearing of invalid input strings, and red toast warnings (`toast.error("Please fill correct url using http or https")`).
- **Protocol-Relative Normalization**: Updated `formatters.js` and image helpers to convert `//` to `https://`, preventing fatal `next/image` runtime crashes.
- **Universal Form Protection**: Enforced validation and safe preview rendering across Add Items (PS5/PS4 CD, Preorders), Add Variant, Special Edition, New Product, and Update Inventory.

### Live Data Analytics Dashboard (`/live-data`)
- **Complete Analytics Interface**: Built all 8 modules in `src/app/live-data/LiveData_Analytics.js` and wired into `src/app/live-data/page.js` (B2C/B2B Sales, Volume, Quality, Purchases, Inventory, Returns).
- **Brand Theme Adherence**: Styled strictly with Navy `#232d65`, slate neutrals, emerald accents, and white cards (zero rainbow colors).
- **Layout & Visual Polish**: Reduced side padding for a full-width layout, added elevated card shadows (`shadow-md`), and combined "Sales today" and "Sales, last 30 days" into a single card.
- **Aggregated Sales Performance**: Replaced the per-day bar chart with a toggleable view for **Overall 30 days** (revenue, target completion, category distribution) and **Today only** (live revenue, dispatch pipeline, peak hour metrics).



## 2026-10-07

### Ledger Encapsulation & Refactoring
- Completely decoupled Ledger UI components from global space, relocating \`LedgerDetail\`, \`LedgerEntries\`, \`LedgerEntryDetail\`, and \`ItemJourneyTimeline\` entirely into \`src/app/ledger\`.
- Transformed \`LedgerEntryDetail\` into a conditional state-based view component that cleanly overlays the main list context instead of forcing full route navigations.

### Ledger Entries Filters & Client-side Pagination
- Revamped the table filters to trigger real-time clears whenever inputs are emptied, avoiding stale state.
- Enhanced filter UX to gracefully execute upon "Enter" key press.
- Implemented robust client-side pagination (10, 25, 50 rows) layered perfectly on top of the search and filter pipelines without breaking existing API fetch models.

### Ledger Entry Insights & UI Polishing
- Re-engineered the detailed information card layouts to employ consistent unified grid gaps (\`gap-4\`) and aligned standard informational cards into crisp 3-column rows (\`grid-cols-3\`).
- Developed a dynamic "Inventory Aging" pipeline under Current Status, automatically discerning whether to calculate aging relative to a past sale event or simply bounding it to the current date.

### Minimalist Item Journey Timeline
- Authored a dynamic mock backend generator for the Item Journey sequence to unblock frontend layout iteration before server-side models are ready.
- Designed a minimalist, elegant grayscale timeline, connected vertically via continuous thin grey lines, stripping away excess visual noise, icons, and bulky containers to purely focus on precise chronological milestones.
- Applied responsive layout padding to automatically rein in peripheral content on ultra-wide formats.

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
