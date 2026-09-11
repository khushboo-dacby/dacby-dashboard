# AI Context

This folder contains project-specific context for AI agents working on the DACBY dashboard. It maps the implementation inspected on 2026-09-09, including incomplete save flows and unused code.

### Before making changes

1. Read `.ai_context/README.md`.
2. Read [architecture.md](architecture.md) for architecture, entities, API payloads, and data flow.
3. Read [techStack.md](techStack.md) for technology, dependency versions, configuration, and scripts.
4. Read [design.md](design.md) for existing UI/UX patterns and responsive behavior.
5. Read [conventions.md](conventions.md) for coding-style decisions and implementation inconsistencies.
6. Inspect the actual source and its callers before making assumptions. Per root `AGENTS.md`, read relevant guides in `node_modules/next/dist/docs/` before writing application code.

### Source of Truth

The current code is the ultimate source of truth. If these documents conflict with implementation, trust the implementation and update this context when appropriate. Root README and sample JSON files do not establish runtime behavior; the JSON fixtures are not imported by active screens.

Backend implementation and live response contracts were not available during this source review. Unknowns are explicitly marked **“Not clearly determined from the current codebase.”** Example shapes describe builders, consumers, and fixtures, not an invented server schema.

### Development Rules

- Trace a feature from `src/app/**/page.js` to its active component. `AddProduct.jsx` and `OrdersDashboard.jsx` are not the screens those routes render.
- Reuse existing inventory components, ImagePreview, confirmation dialogs, and the four draft-state hooks where their contracts fit. Inspect parent style overrides and callback behavior first.
- Reuse product helpers in `src/app/apis/api.js`; `/api/inventory` only echoes/logs input. Analytics currently uses a separate native-fetch request.
- Keep listing IDs, shared spec IDs, vendor keys, combination keys, item keys, and SKUs distinct. Follow the exact payload fields used by the caller; do not infer new API fields.
- Check persistence before changing forms: general Final Submit is disabled in code, AddVariant item submission only logs, detail save updates images only, and detail description edits are local.
- Preserve separate product/item pricing and availability fields, flattened persisted attributes, URL-based images, and description serialization behavior unless the task explicitly changes them.
- Inspect existing implementations before adding abstractions or dependencies. SKU/media helpers currently differ by screen; replacing one does not update all flows.
- Preserve existing page-specific UI patterns unless a redesign is requested. The detail section strip is not functional tab navigation.
- Read dependencies before changing architecture. Shared specifications can be reused by special editions; no local backend source establishes the impact of a specification change on other listings.
- Keep verification appropriate to the change. Available scripts are dev, build, start, and lint; there is no existing test script. Do not issue live mutations merely to validate documentation.

`architecture.md` is the canonical architecture document. The pre-existing empty `archtecture.md` spelling variant was left untouched because it was outside the requested edit allowlist.
