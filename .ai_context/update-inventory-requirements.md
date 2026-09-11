# Update Inventory UI — Requirements & Implementation Context

## 1. Document Purpose

This document defines the requirements for designing and implementing the **Update Inventory** UI in the existing application.

The goal is to allow an admin/user to safely update an existing inventory listing without exposing or editing raw JSON.

The implementation must work with the application's **existing architecture, components, APIs, state management, routing, styling system, authentication, and backend behavior**.

This document describes the desired behavior and UX for the new Update Inventory feature.

---

# 2. IMPORTANT INSTRUCTIONS FOR THE AI CODING AGENT

Before making any code changes:

1. Thoroughly inspect the existing codebase.
2. Read all existing AI context/documentation files in the project.
3. Understand the current:

   * project architecture
   * routing
   * API layer
   * Firebase/database implementation
   * inventory implementation
   * specification implementation
   * reusable components
   * form components
   * modal/drawer components
   * table/list components
   * state management
   * validation
   * notification/toast system
   * loading states
   * error handling
   * authentication/authorization
   * styling system
   * responsive design patterns
4. Search the codebase for existing inventory-related functionality before creating anything new.
5. Reuse existing components and patterns whenever possible.
6. Reuse existing API functions/services whenever possible.
7. Do not create duplicate implementations of functionality that already exists.
8. Do not change the database schema unless absolutely required and explicitly justified.
9. Do not replace the existing architecture with a new architecture.
10. Do not create mock APIs or fake inventory data for the final implementation.

### Source of truth

Use the following priority:

1. Existing working code
2. Existing API/backend behavior
3. Existing project context documentation
4. This requirements document

This document defines the **new UX and feature requirements**, but it must be adapted to the actual implementation discovered in the codebase.

---

# 3. Core UX Goal

The Update Inventory experience should feel like a professional admin/inventory management system.

The user should be able to:

* understand what listing they are editing
* update listing-level information
* inspect vendors
* inspect combinations
* inspect items
* edit individual inventory items
* manage specification information
* manage dynamic questions
* manage images
* manage pricing
* save changes safely
* understand what has changed
* avoid accidentally losing changes

The UI must avoid presenting the entire inventory JSON as one huge form.

---

# 4. High-Level Page Architecture

The Update Inventory experience should be implemented as:

**One main page + top-level tabs + drawers/modals for complex editing.**

Recommended structure:

```text
Update Inventory
│
├── Header
│
├── Overview
│
├── Inventory
│
├── Specification
│
└── Change History
```

Top-level navigation:

```text
[ Overview ] [ Inventory ] [ Specification ] [ Change History ]
```

Do not create separate pages for every subsection unless the existing application architecture requires it.

---

# 5. Page Header

The header should clearly identify the inventory listing.

Example:

```text
← Inventory

Atomic Heart

D002Y
PS4 CDs
Pre Owned

● Inactive
```

The header should show useful read-only metadata such as:

* Product title
* Inventory code
* Category
* Condition
* Stock status
* Specification ID where useful
* Last updated timestamp where useful

Do not expose internal JSON unnecessarily.

The header should provide access to save/discard functionality where appropriate.

---

# 6. Editable vs Read-Only Data

Not every field in the backend JSON should be editable.

## Editable listing-level fields

From `inventory_json`:

```text
product_title
category_name
condition
mrp
price
sell_max_price
yt_iframe
```

The UI must allow these fields to be edited.

---

## Inventory item editable fields

Inside:

```text
vendors
  → vendor
    → combination
      → item
```

The following item fields should be editable:

```text
price
sell_price
weight
sell
images
sku
mrp
stocks
```

However, the implementation must respect existing backend/business rules.

If any of these fields are intentionally system-controlled in the existing application, do not make them editable merely because they exist in the JSON.

Inspect the existing code first.

---

## Specification editable fields

The specification editor should support editing:

```text
whats_in_the_box
color_codes
description
minimum_price
questions
```

If the existing implementation exposes additional specification fields that are intentionally editable, preserve compatibility with them.

---

## Generally read-only/system fields

Unless the existing application explicitly supports editing them:

```text
spec_id
created_at
updated_at
rating_count
total_sales
vendor_id
```

These should normally be displayed as metadata rather than editable form fields.

---

# 7. OVERVIEW TAB

The Overview tab contains listing-level information.

## Basic Information

Fields:

### Product Title

Text input.

Example:

```text
Product Title
[ Atomic Heart ]
```

---

### Category

Use the existing category selector used elsewhere in the project.

Do not hardcode category options.

Example:

```text
Category
[ PS4 CDs ▼ ]
```

---

### Condition

Use the existing condition selector if available.

Example:

```text
Condition
[ Pre Owned ▼ ]
```

---

### MRP

Numeric currency input.

```text
MRP
[ ₹3,894 ]
```

Validation:

* numeric
* non-negative
* appropriate currency formatting
* respect existing business rules

---

### Price

Numeric currency input.

```text
Selling Price
[ ₹3,249 ]
```

---

### Sell Maximum Price

Numeric currency input.

```text
Sell Maximum Price
[ ₹2,050 ]
```

Use the terminology already established elsewhere in the application if a different label is already used.

---

# 8. Product Video

Do not make the user manually edit raw iframe HTML unless the existing application explicitly requires it.

The backend currently stores:

```text
yt_iframe
```

but the UI should preferably provide a YouTube URL input.

Example:

```text
Product Video

YouTube URL
[ https://www.youtube.com/watch?v=... ]

[ Preview ]
```

The application can internally convert/store the required iframe representation if the existing backend requires it.

If the current API expects the iframe directly, preserve compatibility.

Show a video preview when a valid URL is present.

Handle:

* empty URL
* invalid URL
* normal YouTube URL
* youtu.be URL
* embed URL

Do not allow arbitrary unsafe HTML injection.

---

# 9. INVENTORY TAB

The Inventory tab represents:

```text
Vendor
  ↓
Combination
  ↓
Item
```

This hierarchy must remain visible in the UI.

Do not flatten everything into one massive table.

---

# 10. Vendor UI

Display each vendor as a card/section.

Example:

```text
Dacby Technologies Pvt. Ltd.

Rating: ★ 4.7
Total Sales: 500

1 Combination
1 Item

[ Expand ]
```

Vendor metadata should generally be read-only.

The primary focus should be on inventory combinations and items.

---

# 11. Combination UI

A listing may have:

```text
combination_1
combination_2
combination_3
...
```

The UI must support an arbitrary number of combinations.

Do NOT assume that:

```text
combination_1
```

is the only combination.

Display combinations as expandable cards/rows.

Example:

```text
Combinations                              [+ Add Combination]

┌─────────────────────────────────────────────┐
│ Combination 1                     3 Items   │
│ Storage: 1TB • Color: White                 │
│                                  [Edit] [⌄] │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Combination 2                     2 Items   │
│ Storage: 825GB • Color: White               │
│                                  [Edit] [⌄] │
└─────────────────────────────────────────────┘
```

The UI should derive combination information dynamically from the actual data.

Do not hardcode:

* Storage
* Color
* RAM
* Platform
* any other specific attribute

unless those are actually present in the data.

---

# 12. Combination Attributes

Combination attributes can vary between specifications.

For example:

```text
combination_1:
{
    storage: ["1TB", "825GB"],
    color: ["White"]
}
```

Another specification may contain completely different attributes.

Therefore:

**Combination rendering must be dynamic.**

Display available attributes as metadata/chips:

```text
Storage
1TB • 825GB

Color
White
```

Do not build PS5-specific UI.

---

# 13. Item UI

Each combination may contain multiple items.

Example:

```text
Combination 1

Item 1
Item 2
Item 3
...
```

Display items in a compact card/list.

Example:

```text
┌──────────────────────────────────────────────────────┐
│ Item 1                                                │
│                                                      │
│ SKU          atomic-heart-ps4-cds                    │
│ Stock        0                                       │
│ Price        ₹3,249                                  │
│ Sell Price   ₹2,050                                  │
│ Weight       0.1 kg                                  │
│ Sell         ● ON                                    │
│ Images       4                                       │
│                                                      │
│                                  [ Edit Item ]       │
└──────────────────────────────────────────────────────┘
```

Do not expose the full item JSON directly.

---

# 14. Edit Item Drawer

When the user clicks `Edit Item`, open a right-side drawer if the existing design system supports drawers.

The drawer should contain:

```text
Edit Item

SKU
[ atomic-heart-ps4-cds ]

Price
[ ₹3,249 ]

Sell Price
[ ₹2,050 ]

Weight
[ 0.1 ]

MRP
[ ₹3,894 ]

Stock
[ 0 ]

Sell
[ ON ]

Images
[ image ] [ image ] [ image ] [ image ]

[ + Add Image ]

[ Cancel ] [ Save Item ]
```

The drawer should have its own save action.

Do not navigate the user away from the main Update Inventory page.

---

# 15. Item Images

Images should be presented visually.

Example:

```text
Images

┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│      │ │      │ │      │ │      │
│ IMG  │ │ IMG  │ │ IMG  │ │ IMG  │
│      │ │      │ │      │ │      │
└──────┘ └──────┘ └──────┘ └──────┘

[ + Add Image ]
```

Support where existing infrastructure allows:

* preview
* add
* remove
* reorder
* replace

Do not show long image URLs as the primary interface.

If image upload functionality already exists in the project, reuse it.

If images are URL-based, provide a clean URL/image management UI.

---

# 16. SKU Handling

SKU should be displayed clearly.

If SKU is system-generated or required to remain unique, inspect the existing backend behavior before allowing modification.

If editable:

* validate uniqueness if backend supports it
* clearly warn about changing SKU
* do not silently modify SKU format

If not editable, display it as read-only.

---

# 17. Stock Handling

Stock is operationally important.

Use a numeric input or appropriate stock control.

Example:

```text
Stock
[ 10 ]
```

Prevent:

* negative values
* invalid numeric input

If stock is managed by another system/process, do not override that system.

Inspect existing implementation first.

---

# 18. Sell Toggle

Use a clear switch:

```text
Available for Sale

[ ON ]
```

Avoid ambiguous checkbox styling.

When switching from ON to OFF, consider confirmation if the existing business logic treats this as a significant action.

Example:

```text
Disable selling?

This item will no longer be available for sale.

[Cancel] [Disable]
```

Only add confirmation if appropriate to the existing application behavior.

---

# 19. IMPORTANT: Price Ownership

The JSON can contain similar values at different levels.

Example:

```text
inventory.price
inventory.mrp

item.price
item.mrp

item.sell_price
inventory.sell_max_price
```

Do not assume these values are interchangeable.

Before implementation, inspect the existing code/backend to determine:

* which value controls customer selling price
* which value controls seller/buyback price
* whether item-level price overrides listing-level price
* whether listing-level price is copied into items
* whether updating one should automatically update another

The UI should make this relationship clear.

If both values genuinely need independent editing, label them distinctly.

For example:

```text
Listing Selling Price
₹3,249

Item Selling Price
₹3,249
```

If one is derived from another, show it as derived/read-only rather than allowing contradictory values.

---

# 20. SPECIFICATION TAB

The Specification tab should not look like raw JSON.

Use collapsible sections.

Recommended structure:

```text
Specification

▼ What's in the Box
▼ Configurations
▼ Colors
▼ Description
▼ Pricing Rules
▼ Questions
```

Only open sections when the user needs them.

---

# 21. What's in the Box

Data structure:

```text
whats_in_the_box: [
    {
        image_url: "...",
        label: "PS5 Console"
    }
]
```

Display items visually.

Example:

```text
What's in the Box                         [+ Add Item]

┌────────────┐ ┌────────────┐ ┌────────────┐
│   image    │ │   image    │ │   image    │
│            │ │            │ │            │
│ PS5        │ │ Controller │ │ Power      │
│ Console    │ │            │ │ Cable      │
│            │ │            │ │            │
│ [Edit]     │ │ [Edit]     │ │ [Edit]     │
└────────────┘ └────────────┘ └────────────┘
```

Allow where supported:

* add
* edit
* delete
* reorder
* image replacement

---

# 22. Configuration Icons

If `configuration_icons` is editable in the existing system, expose it through a dynamic key-value/icon editor.

Example:

```text
Configuration Icons

Storage
[ image ] [Change]

RAM
[ image ] [Change]

Physical Condition
[ image ] [Change]

Battery Health
[ image ] [Change]

[ + Add Configuration Icon ]
```

Do not hardcode only these four keys.

The editor should support dynamic keys.

If this field is intentionally system-managed, display it as read-only.

---

# 23. Color Codes

Data structure:

```text
color_codes: {
    "White": "#ffffff"
}
```

UI:

```text
Colors                                      [+ Add Color]

● White                              #FFFFFF
                                    [Edit] [Delete]

● Black                              #000000
                                    [Edit] [Delete]
```

Adding/editing:

```text
Color Name
[ White ]

Color Code
[ #FFFFFF ]  ●

[Cancel] [Save Color]
```

Validate color values.

Do not allow malformed color codes.

---

# 24. Description Editor

The summary should be edited using a proper text editor.

Example:

```text
Description

Summary

┌──────────────────────────────────────────────┐
│ B  I  U  H1  H2  Link                       │
├──────────────────────────────────────────────┤
│ Looking for the best price...                │
│                                              │
│ ...                                          │
└──────────────────────────────────────────────┘
```

However, preserve the backend's current data format.

If the backend stores plain text, do not introduce rich-text HTML without checking backend compatibility.

---

# 25. Global Attributes

The specification can contain dynamic attributes:

```text
Global_Attributes
```

Example:

```text
Brand: Sony
Genre: Console Hardware
Language: All Supported
Mode: Single-player, Multiplayer
Platform: PlayStation 5 Slim Digital Edition
Publisher: Sony
Rating: Everyone
Release_Date: November 10, 2023
Release_Year: 2023
```

Use a dynamic key-value editor.

Example:

```text
Global Attributes

┌────────────────────┬───────────────────────────┬──────┐
│ Brand              │ Sony                      │ 🗑   │
│ Genre              │ Console Hardware          │ 🗑   │
│ Platform           │ PS5 Slim Digital Edition  │ 🗑   │
└────────────────────┴───────────────────────────┴──────┘

[ + Add Attribute ]
```

Do not hardcode attribute names.

---

# 26. Nested Description Sections

The description can contain dynamic sections such as:

```text
Connectivity
Design
Performance
Storage
```

These should be represented as editable sections.

Example:

```text
Description Sections

▼ Connectivity
    Bluetooth    5.1
    Ethernet     Gigabit Ethernet
    HDMI         HDMI 2.1
    USB          USB Type-A, Type-C
    WiFi         Wi-Fi 6

▼ Design
    Cooling      Fan-based cooling system
    Type         Slim Digital
    Dimensions   358 x 80 x 216 mm
    Weight       3.2 kg
```

Use the existing data structure.

Do not assume these sections always exist.

Allow dynamic sections if supported.

---

# 27. Minimum Price

Show minimum price as a clear pricing rule.

Example:

```text
Pricing Rules

Minimum Price

₹12,000

ⓘ This value controls the minimum allowed price for this specification.

[Edit]
```

Use existing business logic to determine the exact meaning.

Validate that the minimum price follows existing pricing rules.

---

# 28. QUESTIONS — QUESTION BUILDER

Questions are dynamic and can have different types.

Supported examples:

```text
radio
checkbox
dropdown
```

The UI must be schema-driven.

Do NOT create separate hardcoded question screens for PS4 or PS5.

---

# 29. Question List

Display questions as cards.

Example:

```text
Questions                                  [+ Add Question]

┌────────────────────────────────────────────────────┐
│ Q1                                                 │
│ Does the Console switch on?                       │
│                                                    │
│ Type: Radio       Required: Yes                    │
│ 2 Options                                          │
│                                                    │
│ [Edit] [Duplicate] [Delete]                  [⌄] │
└────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────┐
│ Q2                                                 │
│ Functional Condition                               │
│                                                    │
│ Type: Checkbox    Required: No                     │
│ 4 Options                                          │
│                                                    │
│ [Edit] [Duplicate] [Delete]                  [⌄] │
└────────────────────────────────────────────────────┘
```

---

# 30. Question Editor

The question editor should contain:

```text
Question
[ Does the Console switch on? ]

Description
[ Please select whether the console powers on ]

Question Type
[ Radio ▼ ]

Required
[ ON ]

Options

[ Yes ]                         [Delete]
[ No ]                          [Delete]

[ + Add Option ]

Deduction
[ ₹0 ]

[ Cancel ] [ Save Question ]
```

---

# 31. Question Types

## Radio

Single selection.

UI editor:

```text
Type
Radio

Options
○ Yes
○ No
```

---

## Dropdown

Single selection from dropdown.

UI editor:

```text
Type
Dropdown

Options
1. Option A
2. Option B
3. Option C
```

---

## Checkbox

Multiple selection.

Example:

```text
Functional Condition

☐ Internal Fan Noise
☐ Overheating
☐ HDMI Output port not working
☐ USB / Charging Ports Not Functional
```

Each option may have:

* label
* icon
* deduction

---

# 32. Question Option Editor

For object-based options:

```text
Option

Icon
[ Current Icon ] [Change]

Label
[ Internal Fan Noise ]

Deduction
[ ₹3,000 ]

[Save Option]
```

For string-based options:

```text
Option Label
[ No scratches or up to 3 light scratches ]

[Save Option]
```

The editor must support both existing data formats where necessary.

Do not silently change the backend schema.

---

# 33. Question Validation

Before saving:

### Required question

Must have:

* question text
* valid question type
* at least one option where applicable

### Checkbox

Must support multiple options.

### Radio

Must support options.

### Dropdown

Must support options.

### Deduction

Must be valid numeric data.

### Icon

If optional, allow missing icon.

---

# 34. Add / Delete / Reorder Questions

Where supported by the existing backend:

Allow:

```text
+ Add Question
Edit
Duplicate
Delete
Reorder
```

If order matters to the customer-facing flow, preserve question order.

Use drag-and-drop only if the existing application already uses that interaction pattern or it can be implemented cleanly.

---

# 35. Change History

If the existing application has audit/history support, expose it as a read-only tab.

Example:

```text
Change History

11 Sep 2026, 11:32 AM
Price changed
₹3,249 → ₹2,999

11 Sep 2026, 11:28 AM
Question updated
"Functional Condition"

10 Sep 2026, 05:20 PM
Inventory item added
Item 3
```

Do not invent history if the backend does not support it.

If no history system exists, do not build a fake history system.

Instead, omit the tab or mark it as unavailable based on the existing architecture.

---

# 36. Save Architecture

Avoid one giant save button that silently saves every field.

Use a combination of:

* section-level save
* item-level save
* global unsaved-changes indicator

Recommended global behavior:

```text
● 3 unsaved changes

[Discard] [Save Changes]
```

For item drawer:

```text
[Cancel] [Save Item]
```

For question editor:

```text
[Cancel] [Save Question]
```

For color editor:

```text
[Cancel] [Save Color]
```

---

# 37. Unsaved Changes

The application must detect unsaved changes.

If the user attempts to navigate away:

```text
Leave without saving?

You have unsaved changes.

[Stay] [Discard Changes]
```

Do not lose user input silently.

---

# 38. Save Feedback

After successful save:

Show the application's existing success toast/notification.

Example:

```text
✓ Inventory updated successfully
```

Do not invent a new notification system if one already exists.

On failure:

```text
Could not save changes.

Please try again.
```

Preserve the user's entered values.

---

# 39. Loading States

Every save operation should have a loading state.

Example:

```text
[ Saving... ]
```

Prevent duplicate submissions while saving.

For page loading:

Use the existing skeleton/loading components.

Do not show an empty form while the inventory is still loading.

---

# 40. Error Handling

Handle:

* inventory not found
* specification not found
* API failure
* validation failure
* permission failure
* image upload failure
* invalid image URL
* invalid YouTube URL
* duplicate SKU
* invalid price
* invalid stock
* malformed specification data

Use existing application error handling patterns.

---

# 41. Validation Rules

At minimum:

## Product title

Required.

Should not accept empty/whitespace-only value.

## Category

Required.

## Condition

Required.

## MRP

Numeric and non-negative.

## Price

Numeric and non-negative.

## Sell Max Price

Numeric and non-negative.

## Weight

Numeric and non-negative.

## Stock

Integer and non-negative unless existing backend supports another model.

## SKU

Validate according to existing backend rules.

## Colors

Must contain valid color values.

## Minimum price

Numeric and compatible with existing pricing rules.

## Questions

Validate according to question type.

---

# 42. Responsive Design

The page must work on:

* desktop
* laptop
* tablet
* mobile where the existing admin application supports mobile

Desktop:

```text
Main content
+ optional right-side drawer
```

Mobile:

* tabs may become horizontally scrollable
* drawers should become full-screen sheets
* multi-column forms should become one column
* image grids should adapt
* sticky save bar should remain accessible

Do not create a completely separate mobile application.

---

# 43. Accessibility

Use:

* proper labels
* keyboard-accessible controls
* visible focus states
* accessible switches
* accessible dialogs/drawers
* accessible image upload controls
* semantic buttons
* meaningful error messages

Do not use clickable `<div>` elements where buttons are appropriate.

---

# 44. Dynamic Data Requirement

This is one of the most important requirements.

The UI must NOT be hardcoded around the example:

```text
Atomic Heart
PS4 CDs
PS5
Storage
Color
```

The examples in this document are only examples.

The implementation must work with:

```text
0 or more vendors
0 or more combinations
0 or more items per combination
0 or more questions
different question types
different attributes
different specification structures
```

The UI should derive its structure from the actual data.

---

# 45. Do Not Expose Raw JSON

The user should never need to edit:

```text
{
  "combination_1": {
      "item1": {
          ...
      }
  }
}
```

Instead, the UI should transform the data into human-friendly controls.

JSON should remain an implementation/data layer.

---

# 46. Avoid Giant Forms

Do NOT create this:

```text
Everything

Product Title
Category
Condition
MRP
Price
Sell Max Price
Vendor
Combination 1
Item 1
Item 2
Item 3
Combination 2
Item 1
...
What's in Box
...
Question 1
...
Question 10
...
Save
```

This is specifically what the new UX should avoid.

Use:

```text
Overview
Inventory
Specification
```

with expandable sections and drawers.

---

# 47. Avoid Excessive Navigation

The user should not need to navigate:

```text
Inventory List
→ Inventory Details
→ Edit Listing
→ Edit Combination
→ Edit Item
→ Edit Question
→ back
→ back
→ back
```

Prefer:

```text
Inventory List
      ↓
Update Inventory
      ↓
Overview / Inventory / Specification
      ↓
Drawer for detailed editing
```

---

# 48. Pricing UX

Pricing is business-critical.

Make price fields visually clear.

Example:

```text
Pricing

MRP
₹3,894

Selling Price
₹3,249

Sell Maximum Price
₹2,050
```

If the existing business logic calculates any value automatically, clearly communicate that.

Example:

```text
ⓘ Automatically calculated from item pricing.
```

Never create conflicting editable sources of truth.

---

# 49. Destructive Actions

For deleting:

* item
* image
* question
* option
* color
* what's-in-the-box item

use confirmation when the action is destructive and difficult to undo.

Example:

```text
Delete question?

This question and its options will be removed.

[Cancel] [Delete]
```

Use the application's existing confirmation component if available.

---

# 50. Empty States

Handle empty collections gracefully.

Example:

```text
No combinations

This listing currently has no inventory combinations.

[+ Add Combination]
```

For questions:

```text
No questions configured.

[+ Add Question]
```

For what's-in-the-box:

```text
Nothing added yet.

[+ Add Item]
```

---

# 51. Add Combination

If creating combinations is already supported by the backend, provide:

```text
[ + Add Combination ]
```

The combination editor should be dynamic and based on the specification's available attributes.

Do not assume combinations only contain:

```text
storage
color
```

---

# 52. Data Integrity

Before submitting changes:

* preserve fields that were not edited
* do not accidentally remove unknown JSON properties
* do not replace entire nested objects unnecessarily
* use partial updates if the existing API supports them
* preserve existing array ordering unless intentionally changed
* preserve unknown fields when possible

This is especially important because the JSON structures are nested and may evolve.

---

# 53. API Integration

Before implementing API calls:

1. Search the existing project for inventory update APIs.
2. Search for existing inventory fetch APIs.
3. Search for existing specification update APIs.
4. Search for image upload functionality.
5. Search for existing mutation hooks/services.
6. Reuse them where possible.

Do not create a new API endpoint simply because it is convenient for the UI.

If the current backend requires a new endpoint, explain why before changing it.

---

# 54. State Management

Use the project's existing state management approach.

Do not introduce:

* Redux
* Zustand
* React Query
* custom global state

unless the project already uses them or the existing architecture clearly requires it.

Local form state is appropriate for drawer-level editing if consistent with existing patterns.

---

# 55. Component Architecture

Prefer reusable components.

Suggested conceptual structure:

```text
UpdateInventoryPage
│
├── InventoryHeader
│
├── InventoryTabs
│
├── OverviewTab
│   ├── BasicInformationForm
│   └── ProductVideoEditor
│
├── InventoryTab
│   ├── VendorCard
│   ├── CombinationCard
│   ├── ItemCard
│   └── ItemEditorDrawer
│
├── SpecificationTab
│   ├── WhatsInTheBoxEditor
│   ├── ConfigurationEditor
│   ├── ColorEditor
│   ├── DescriptionEditor
│   ├── PricingRulesEditor
│   ├── QuestionsEditor
│   └── QuestionEditorDrawer
│
├── ChangeHistoryTab
│
└── UnsavedChangesBar
```

These names are conceptual.

Use the project's actual naming conventions.

---

# 56. UX Priority

The most frequently used actions should be easiest to access.

Priority order:

### Highest

* Product title
* Category
* Condition
* Price
* MRP
* Sell Max Price
* Item price
* Item sell price
* Stock
* Sell status

### Medium

* Images
* SKU
* Weight
* What's in the box
* Colors

### Advanced

* Description
* Global attributes
* Questions
* Configuration icons
* Other specification metadata

Do not overwhelm the user with advanced configuration immediately.

---

# 57. Recommended Visual Hierarchy

Use cards/sections to establish hierarchy.

Example:

```text
Update Inventory

Atomic Heart
D002Y • PS4 CDs • Pre Owned

────────────────────────────────────

Overview | Inventory | Specification

────────────────────────────────────

Basic Information

Product Title
...

Pricing

MRP
...
Selling Price
...

Product Video

...

────────────────────────────────────

● Unsaved changes
                 [Discard] [Save]
```

Avoid excessive borders and unnecessary visual decoration.

The interface should feel like an admin/product-management tool.

---

# 58. Important UX Rule: Progressive Disclosure

Do not show all fields at once.

Use:

```text
Main page
    ↓
Section
    ↓
Expandable content
    ↓
Drawer for complex editing
```

This is particularly important for:

* combinations
* items
* questions
* question options
* image management

---

# 59. Important UX Rule: Preserve Context

When opening a drawer:

```text
Edit Item
```

the user should still be able to understand:

```text
Vendor
→ Combination 1
→ Item 2
```

The drawer header should therefore identify the item clearly.

Example:

```text
Edit Item

Combination 1
Item 2

SKU: atomic-heart-ps4-cds
```

---

# 60. Important UX Rule: Never Make Admins Guess

Labels should be explicit.

Avoid:

```text
Price
```

when multiple prices exist.

Prefer:

```text
Listing Selling Price
Item Selling Price
Sell Price / Buyback Price
MRP
Minimum Price
Sell Maximum Price
```

Use terminology consistent with the existing product.

---

# 61. Save Strategy Recommendation

Preferred behavior:

```text
User opens listing
        ↓
Loads current data
        ↓
User edits Overview
        ↓
Unsaved state appears
        ↓
User edits Inventory item
        ↓
Save Item
        ↓
User edits Specification
        ↓
Save section
        ↓
Global Save / confirmation if required
```

However, adapt this to the existing API architecture.

Do not create unnecessary multiple API requests if the backend expects a single atomic update.

The final implementation must preserve data consistency.

---

# 62. Before Coding — Required Analysis

The AI coding agent must first inspect:

### Project

* framework
* package manager
* folder structure
* routing
* build system

### UI

* design system
* component library
* existing forms
* existing cards
* existing tabs
* existing drawers
* existing dialogs
* existing tables
* existing toast system

### Inventory

Search for:

```text
inventory
inventory_json
spec_json
vendors
combination
sell_price
sell_max_price
product_title
```

### Backend

Search for:

```text
get-inventory
update-inventory
inventory update
product update
spec update
Firebase
Firestore
Cloud Functions
API
```

### Existing patterns

Identify existing screens that already perform:

* editing
* image upload
* dynamic forms
* question configuration
* product configuration

Reuse those patterns.

---

# 63. Implementation Sequence

Follow this order:

## Phase 1 — Understand

Inspect codebase and context files.

Do not modify code.

## Phase 2 — Map Data

Map:

```text
inventory_json
spec_json
```

to current backend/API structures.

## Phase 3 — Find Existing Components

Identify reusable components.

## Phase 4 — Build Page Shell

Implement:

```text
Header
Tabs
Save state
Loading/error states
```

## Phase 5 — Implement Overview

Implement listing-level editing.

## Phase 6 — Implement Inventory

Implement:

```text
Vendor
→ Combination
→ Item
→ Item Drawer
```

## Phase 7 — Implement Specification

Implement:

```text
What's in the Box
Colors
Description
Pricing
Questions
```

## Phase 8 — Validation

Add appropriate validation.

## Phase 9 — API Integration

Connect to existing update APIs.

## Phase 10 — Test

Test multiple combinations, multiple items, multiple question types, empty states, errors, and unsaved changes.

---

# 64. Acceptance Criteria

The feature is complete only when all of the following are true.

### Listing

* [ ] Product title can be updated.
* [ ] Category can be updated.
* [ ] Condition can be updated.
* [ ] MRP can be updated.
* [ ] Price can be updated.
* [ ] Sell Max Price can be updated.
* [ ] YouTube video can be updated.
* [ ] Video preview works where applicable.

### Inventory

* [ ] Vendors render dynamically.
* [ ] Multiple combinations render correctly.
* [ ] Multiple items per combination render correctly.
* [ ] Combination attributes are dynamic.
* [ ] Individual items can be edited.
* [ ] Item price can be updated.
* [ ] Item sell price can be updated.
* [ ] Item weight can be updated.
* [ ] Item sell status can be updated.
* [ ] Item images can be managed.
* [ ] SKU behavior follows backend rules.
* [ ] Stock behavior follows backend rules.

### Specification

* [ ] What's-in-the-box items can be managed.
* [ ] Colors can be managed.
* [ ] Color codes are validated.
* [ ] Description can be edited.
* [ ] Global attributes can be managed where supported.
* [ ] Dynamic description sections work.
* [ ] Minimum price can be updated.
* [ ] Questions can be listed.
* [ ] Questions can be created/edited where supported.
* [ ] Radio questions work.
* [ ] Checkbox questions work.
* [ ] Dropdown questions work.
* [ ] Question options can be managed.
* [ ] Option deductions can be managed.
* [ ] Option icons can be managed where supported.

### UX

* [ ] No raw JSON editing is required.
* [ ] No giant form is used.
* [ ] Overview, Inventory, and Specification are clearly separated.
* [ ] Complex editing uses drawers/modals where appropriate.
* [ ] Unsaved changes are visible.
* [ ] User cannot accidentally lose unsaved changes.
* [ ] Loading states exist.
* [ ] Save states exist.
* [ ] Error states exist.
* [ ] Success feedback exists.
* [ ] Empty states exist.
* [ ] Responsive behavior is implemented.
* [ ] Existing design system is reused.

### Data integrity

* [ ] Unedited fields are preserved.
* [ ] Unknown fields are not accidentally deleted.
* [ ] Nested inventory structures remain intact.
* [ ] Multiple combinations are preserved.
* [ ] Multiple items are preserved.
* [ ] Multiple question types are preserved.
* [ ] API behavior remains compatible with existing functionality.

---

# 65. Final Instruction to the AI Coding Agent

After reading the existing project and all context files:

1. Do not immediately start coding.
2. First understand the current implementation.
3. Identify existing components and APIs that can be reused.
4. Identify any conflicts between this document and the existing implementation.
5. Do not make assumptions about backend behavior.
6. Do not hardcode the example JSON.
7. Build the UI around the actual dynamic data model.
8. Reuse the existing project's visual language.
9. Keep the implementation modular and maintainable.
10. Avoid unnecessary architectural changes.

Before implementation, provide a concise implementation plan containing:

```text
1. Existing architecture discovered
2. Relevant existing components
3. Relevant existing APIs
4. Data flow
5. Proposed component structure
6. Save/update strategy
7. Potential risks or ambiguities
```

Then implement the feature.

The final result should feel like a **natural extension of the existing application**, not a separate application or a newly invented design system.

The most important principle is:

> **The UI should make complex inventory JSON easy for humans to edit without exposing the complexity of the underlying JSON.**
