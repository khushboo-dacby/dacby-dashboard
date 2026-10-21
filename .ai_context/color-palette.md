# DACBY Design System: Color Palette & Typography Reference

This document serves as the central visual reference for DACBY Dashboard pages. It defines color tokens, typography scales, font sizes, button styles, card surfaces, and border specifications.

---

## 1. Typography & Font Hierarchy

### 1.1 Font Scale & Hierarchy

| Role / Element | Font Size | Weight | Tracking | Text Color | Usage Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero / KPI Value** | `text-3xl` (30px) | `font-bold` (700) | `tracking-[-0.04em]` | `#151D35` / `#B83852` | Large metric numbers (₹4.82L, 5,412 units) |
| **Page Title** | `text-xl` to `text-2xl` (20-24px) | `font-bold` (700) | `tracking-tight` | `#151D35` | Main page heading |
| **Section Title** | `text-xl` (20px) | `font-bold` (700) | `tracking-[-0.03em]` | `#151D35` | Major section header |
| **Card / Subsection Title** | `text-base` (16px) | `font-bold` (700) | `tracking-normal` | `#151D35` | Card headings, chart titles, table headers |
| **Card Subtitle / Metric Unit** | `text-sm` (14px) | `font-semibold` (600) | `normal` | `#71809A` / `#C85E6B` | Metric units ("186 units", "orders") |
| **Body / Section Description** | `text-sm` (14px) | `font-medium` (500) | `normal` | `#53647F` | Informational sentences, descriptions |
| **Form Labels & Table Headings** | `text-xs` (12px) | `font-bold` (700) | `normal` | `#53647F` | Input field labels, table column headers |
| **Secondary Helper / Subtext** | `text-xs` (12px) | `font-medium` (500) | `normal` | `#71809A` | Timestamps, footnote hints, axis labels |
| **Control / Toggle Label** | `text-xs` (12px) | `font-bold` (700) | `normal` | `#71809A` / `#2A67EC` | Segmented control buttons, filter options |
| **Status Tag / Chip** | `text-[11px]` (11px) | `font-bold` (700) | `normal` | `#157348` / `#2459C4` | "Live Operational Data", pill badges |
| **Overline Category Label** | `text-[11px]` (11px) | `font-black` (900) | `tracking-[0.14em]` uppercase | `#2A67EC` | "ANALYTICS CONTROLS", "DACBY OPERATIONS" |
| **Section Micro-Badge** | `text-[10px]` (10px) | `font-black` (900) | `tracking-[0.14em]` uppercase | `#FFFFFF` | Pill badges on dark backgrounds |
| **Exception Micro-Badge** | `text-[10px]` (10px) | `font-black` (900) | `tracking-[0.10em]` uppercase | `#B83852` | "EXCEPTIONS", "CANCELLED ORDERS" |
| **Monospace Identifiers** | `text-xs` / `text-sm` | `font-mono` | `normal` | `#151D35` | SKUs, JSON data, spec IDs, order IDs |

---

### 1.2 Text Colors

| Token | Hex Value | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| `text.primary` | `#151D35` | `text-[#151D35]` | Primary headings, metric values, table titles, active items |
| `text.secondary` | `#53647F` | `text-[#53647F]` | Subheadings, section descriptions, form labels |
| `text.muted` | `#71809A` | `text-[#71809A]` | Secondary metric descriptions, inactive buttons, axis labels |
| `text.subtle` | `#8190A9` | `text-[#8190A9]` | Footnotes, disabled labels, placeholder text |
| `text.inverse` | `#FFFFFF` | `text-white` | Text inside solid dark badges, primary action buttons |
| `text.onDarkMuted` | `#C5D2E8` | `text-[#C5D2E8]` | Supporting descriptions inside navy headers or cards |

---

## 2. DACBY Brand & Base Colors

| Token | Hex Value | Tailwind Class | Role & Application |
| :--- | :--- | :--- | :--- |
| `brand.navy` | `#102449` | `bg-[#102449]`, `text-[#102449]` | Deep navy brand container, section badges, dark headers |
| `brand.navySoft` | `#1C3768` | `bg-[#1C3768]`, `text-[#1C3768]` | Secondary dark header backgrounds, navy card borders |
| `brand.navyPanel` | `#2A2D6F` | `bg-[#2A2D6F]`, `text-[#2A2D6F]` | High-contrast dark callout cards |
| `brand.blue` (Primary) | `#2A67EC` | `bg-[#2A67EC]`, `text-[#2A67EC]` | Core primary action blue, active tab indicators, chart primary |
| `brand.indigo` | `#3D55D9` | `bg-[#3D55D9]`, `text-[#3D55D9]` | Alternate primary actions, feature banners |
| `brand.teal` | `#13B89B` | `bg-[#13B89B]`, `text-[#13B89B]` | Operations highlight, website channels, secondary metrics |
| `brand.violet` | `#704CF3` | `bg-[#704CF3]`, `text-[#704CF3]` | Tertiary chart series, AI tags, special feature badges |

---

## 3. Buttons & Interactive Controls

| Control Type | Background | Border | Text | Hover / Active State |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Button** | `#2A67EC` (`bg-[#2A67EC]`) | None | `#FFFFFF` (`text-white`) | `hover:bg-[#1E57D2]`, active scale |
| **Secondary Button** | `#FFFFFF` (`bg-white`) | `#DCE5F1` (`border-[#DCE5F1]`) | `#53647F` (`text-[#53647F]`) | `hover:bg-[#EEF3FF] hover:text-[#2A67EC] hover:border-[#C9DCFF]` |
| **Positive / Submit** | `#16B879` (`bg-[#16B879]`) | None | `#FFFFFF` (`text-white`) | `hover:bg-[#139E67]` |
| **Destructive / Danger** | `#D34D5D` (`bg-[#D34D5D]`) | None | `#FFFFFF` (`text-white`) | `hover:bg-[#BE3B4B]` |
| **Soft Alert Button** | `#FFF0F2` (`bg-[#FFF0F2]`) | `#F5C2CA` (`border-[#F5C2CA]`) | `#B83852` (`text-[#B83852]`) | `hover:bg-[#FFE2E7]` |
| **Toggle Track** | `#EFF3F8` (`bg-[#EFF3F8]`) | None | N/A | Padding `p-1`, rounded `rounded-xl` |
| **Toggle Active Pill** | `#FFFFFF` (`bg-white`) | None | `#2A67EC` (`text-[#2A67EC]`) | `shadow-[0_2px_8px_rgba(32,68,128,0.12)] font-bold` |
| **Toggle Inactive Option** | Transparent | None | `#71809A` (`text-[#71809A]`) | `hover:text-[#53647F]` |
| **Icon Button** | `#FFFFFF` or `#F2F5FA` | `#DCE5F1` (`border-[#DCE5F1]`) | `#53647F` (`text-[#53647F]`) | `hover:bg-[#EDF3FF] hover:text-[#2A67EC]` |
| **Disabled Control** | `#F2F5FA` (`bg-[#F2F5FA]`) | `#DCE5F1` | `#8190A9` (`text-[#8190A9]`) | `opacity-50 cursor-not-allowed` |

---

## 4. Cards & Surfaces

| Surface Type | Background | Border | Shadow / Radius | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Page Canvas** | `#F6F8FC` (`bg-[#F6F8FC]`) | None | None | Base page background behind all content |
| **Standard Card** | `#FFFFFF` (`bg-white`) | `#DCE5F1` (`border-[#DCE5F1]`) | `rounded-2xl shadow-sm` | Primary content cards, KPI blocks, chart containers |
| **Subtle Container / Well** | `#F2F5FA` (`bg-[#F2F5FA]`) | None or `#DCE5F1` | `rounded-xl` | Grouped filters, table row highlights, inner wells |
| **Selected / Active Surface** | `#EEF3FF` (`bg-[#EEF3FF]`) | `#C9DCFF` (`border-[#C9DCFF]`) | `rounded-xl` | Selected list items, active row selection |
| **Information Surface** | `#EDF5FF` (`bg-[#EDF5FF]`) | `#C9DCFF` (`border-[#C9DCFF]`) | `rounded-xl` | Callout boxes, system notification cards |
| **Dark Header Panel** | `#102449` (`bg-[#102449]`) | `#1C3768` (`border-[#1C3768]`) | `rounded-2xl text-white` | Hero banners, dark summary statistics panels |

---

## 5. Borders & Dividers

| Border Type | Hex Value | Tailwind Class | Application |
| :--- | :--- | :--- | :--- |
| **Card & Section Border** | `#DCE5F1` | `border-[#DCE5F1]` | Standard card edges, table row dividers, panel borders |
| **Strong Outline** | `#C7D5E8` | `border-[#C7D5E8]` | Card borders on hover, form control default borders |
| **Active / Focus Border** | `#2A67EC` | `border-[#2A67EC]`, `focus:border-[#2A67EC]` | Focused input fields, active selected cards |
| **Subtle Divider** | `#DCE5F1` (with opacity `opacity-80` or `border-[#DCE5F1]/80`) | Divider lines within cards and metrics |
| **Success Border** | `#B7F1CD` | `border-[#B7F1CD]` | Live badges, positive status containers |
| **Info / Selected Border** | `#C9DCFF` | `border-[#C9DCFF]` | Blue status tags, selected metric filters |
| **Warning Border** | `#F4D877` | `border-[#F4D877]` | Warning banners, review alerts |
| **Danger Border** | `#F5C2CA` / `#F5C7CE` | `border-[#F5C2CA]` | Cancelled orders, exception callouts, error boxes |

---

## 6. Status Indicators, Badges & Chips

Use these preset 4-part combinations (Background + Border + Text + Dot) for consistent status representations:

| Status Role | Background | Border | Text Color | Dot / Indicator Color |
| :--- | :--- | :--- | :--- | :--- |
| **Live / Success** | `#ECFBF3` (`bg-[#ECFBF3]`) | `#B7F1CD` (`border-[#B7F1CD]`) | `#157348` (`text-[#157348]`) | `#16B879` (`bg-[#16B879]`) |
| **Info / Date Range** | `#EDF3FF` (`bg-[#EDF3FF]`) | `#C9DCFF` (`border-[#C9DCFF]`) | `#2459C4` (`text-[#2459C4]`) | `#2A67EC` (`bg-[#2A67EC]`) |
| **Warning / Pending** | `#FFF8E9` (`bg-[#FFF8E9]`) | `#F4D877` (`border-[#F4D877]`) | `#C87513` (`text-[#C87513]`) | `#C87513` (`bg-[#C87513]`) |
| **Danger / Cancelled** | `#FFF0F2` (`bg-[#FFF0F2]`) | `#F5C2CA` (`border-[#F5C2CA]`) | `#B83852` (`text-[#B83852]`) | `#D34D5D` (`bg-[#D34D5D]`) |
| **Operational Teal** | `#E9FBF7` (`bg-[#E9FBF7]`) | `#A6EBDD` (`border-[#A6EBDD]`) | `#11967F` (`text-[#11967F]`) | `#13B89B` (`bg-[#13B89B]`) |

### Metric Card Icon Pill Accents

| Metric Tone | Icon Background | Icon Color | Recommended Metric Types |
| :--- | :--- | :--- | :--- |
| **Blue** | `#EDF3FF` | `#2A67EC` | Sales, revenue, total orders |
| **Teal** | `#E9FBF7` | `#11967F` | Fulfilment, dispatches, purchases |
| **Violet** | `#EDF3FF` | `#1656C2` | B2B operations, secondary volumes |
| **Amber** | `#E9FBF7` / `#FFF8E9` | `#0D917F` / `#C87513` | Pending approvals, in-transit items |
| **Rose / Red** | `#FFF0F2` | `#D34D5D` | Cancelled orders, returns, overdue items |

---

## 7. Chart & Data Visualization Colors

### 7.1 Multi-Series Palette Sequence

| Position | Color Name | Hex Value | Application |
| :--- | :--- | :--- | :--- |
| **1 (Primary)** | Royal Blue | `#2A67EC` | App sales, primary trend series |
| **2 (Secondary)** | Mint Teal | `#13B89B` | Website sales, secondary comparison |
| **3 (Tertiary)** | Deep Violet | `#704CF3` | Third category / B2B series |
| **4 (Quaternary)**| Sky Blue | `#55A7F7` | Fourth breakdown category |
| **5 (Warm)** | Amber Gold | `#E8AD37` | Warning / intermediate statuses |
| **6 (Negative)** | Soft Crimson | `#E06475` | Cancellations, returns, defective rates |

### 7.2 Chart Infrastructure Colors

| Element | Hex Value | Usage |
| :--- | :--- | :--- |
| **Grid Lines** | `#DCE5F1` | Horizontal/vertical Cartesian grid lines (`strokeDasharray="3 5"`) |
| **Axes & Ticks** | `#8190A9` | XAxis and YAxis tick labels (`fontSize: 10` or `11`) |
| **Tooltip Background** | `#FFFFFF` | Solid white container with border `#DCE5F1` and shadow |
| **Area Fill Opacity** | `0.24` fading to `0.0` | Top stop `#2A67EC` at `24%` opacity, bottom stop at `0%` |

### 7.3 Multi-Series Breakdown Tones

- **Channel: App** `#2A67EC`
- **Channel: Website** `#13B89B`
- **B2B Secondary Blue:** `#1656C2`
- **B2B Secondary Green:** `#0D917F`
- **Cancellations / Exceptions (Tiers):**
  - High severity: `#B83852`
  - Medium severity: `#D84F63`
  - Moderate severity: `#E46A78`

---

## 8. Summary Reference Checklist for New Pages

1. **Text Contrast:** Always use `#151D35` for headers/KPIs and `#53647F` for descriptions; avoid unstyled browser blacks or faint grays.
2. **Card Surfaces:** Default to clean white `#FFFFFF` cards with `#DCE5F1` border and `rounded-2xl`.
3. **Primary Accent:** Use `#2A67EC` for primary actions and `#EDF3FF` for light blue fills.
4. **Borders:** Consistent `#DCE5F1` across cards, tables, and dividers keeps screens cohesive.
5. **Status Badges:** Always match the text color with its corresponding border and soft background (e.g., `#ECFBF3` + `#B7F1CD` + `#157348`).
