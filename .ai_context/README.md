# AI Context

This folder contains project-specific context for AI agents working on the DACBY Dashboard.

The files document the project's architecture, technology stack, UI/UX patterns, coding conventions, feature requirements, and implementation history.

## Before Making Changes

Before modifying any code:

1. Read `.ai_context/README.md`.
2. Read `.ai_context/architecture.md` for architecture, entities, API payloads, and data flow.
3. Read `.ai_context/techStack.md` for technologies, dependencies, versions, configuration, and scripts.
4. Read `.ai_context/design.md` for existing UI/UX patterns and responsive behavior.
5. Read `.ai_context/conventions.md` for coding conventions and known implementation decisions.
6. For Update Inventory work, read:
   - `.ai_context/update-inventory-requirements.md`
   - `.ai_context/update-inventory-history.md`
7. Inspect the actual source code and relevant callers before making assumptions.

## Important AI Agent Rules

- Treat the actual source code as the ultimate source of truth.
- If the context files conflict with the current implementation, inspect the implementation first and mention the conflict before changing behavior.
- Do not rewrite or refactor unrelated code.
- Prefer small, targeted changes.
- Inspect existing components, helpers, hooks, and API functions before creating new ones.
- Reuse existing components and utilities whenever their contracts fit.
- Do not create duplicate components or duplicate API functions unnecessarily.
- Do not invent API endpoints, payload fields, backend behavior, or data structures.
- Preserve existing API/data contracts unless the task explicitly requires changing them.
- Follow the existing UI/UX patterns unless a redesign is explicitly requested.
- Do not add new dependencies unless they are actually required and the existing project cannot solve the problem.
- Check all callers before changing a shared component or utility.
- Do not modify unrelated files just to make the requested feature work.

## Update Inventory

For Update Inventory tasks:

1. Read `update-inventory-requirements.md`.
2. Read `update-inventory-history.md`.
3. Inspect the current implementation before changing it.
4. Follow the requirements and previously established decisions.
5. Preserve existing inventory/specification data that is not explicitly editable.
6. Do not create or delete vendors, combinations, items, or SKUs unless explicitly requested.
7. Reuse existing inventory image, API, and state-management helpers where possible.
8. Keep unfinished save/API behavior as documented in the history file.
9. After completing a significant change, update `update-inventory-history.md`.

## Working Process

Use this workflow for feature requests:

1. Understand the request.
2. Read the relevant context files.
3. Inspect the actual implementation.
4. Identify the exact files/components that need changes.
5. Explain the planned change briefly if the task is complex.
6. Make the smallest appropriate change.
7. Run the relevant lint/build checks.
8. Fix any errors caused by the change.
9. Verify that existing functionality was not unnecessarily changed.
10. Update the relevant context/history file when appropriate.

## Do Not Start Coding Immediately

For a new feature or unfamiliar area, first inspect the relevant context and source code.

Do not assume that a missing feature means a new component, API, hook, or dependency is required.

Always check whether an existing implementation can be reused.

## Context Files

- `README.md` — Instructions for AI agents and context navigation.
- `architecture.md` — Project architecture and data flow.
- `techStack.md` — Technologies, dependencies, configuration, and scripts.
- `design.md` — UI/UX patterns and design decisions.
- `conventions.md` — Coding conventions and implementation rules.
- `update-inventory-requirements.md` — Update Inventory requirements.
- `update-inventory-history.md` — Update Inventory implementation history and current status.

## File Naming

`architecture.md` is the canonical architecture document.

`archtecture.md` is a pre-existing misspelled file. Do not use it as the architecture source unless explicitly requested.

## Current Codebase Takes Priority

The context files are there to help AI agents understand the project, but they are not a replacement for inspecting the actual code.

When uncertain:

**Inspect → Understand → Make a targeted change → Verify.**
