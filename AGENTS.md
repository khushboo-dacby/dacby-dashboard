# DACBY Dashboard — Codex Instructions

<!-- BEGIN:nextjs-agent-rules -->
**# This is NOT the Next.js you know**

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 1. Core Principles

- Work only within the existing DACBY Dashboard project.
- Understand the relevant code before implementing changes.
- Follow the existing technology stack, project conventions, and architecture.
- Keep implementations simple, focused, and maintainable.
- Reuse existing infrastructure when necessary, without modifying it by default.
- Avoid unnecessary dependencies, abstractions, and duplicate functionality.
- Never make unrelated changes.
- Follow all instructions in this file for every task.

## 2. Next.js and Technology Stack

- Inspect `package.json` and the lockfile to identify the installed framework and dependency versions.
- Before writing or modifying Next.js-specific code, read the relevant documentation available in `node_modules/next/dist/docs/`.
- Follow the APIs, routing conventions, styling rules, and patterns supported by the installed version.
- Pay attention to deprecated APIs and breaking changes.
- Follow the existing JavaScript or JSX conventions used by the project.
- Do not upgrade, downgrade, or install packages without explicit approval.
- Do not assume that conventions from another Next.js version apply to this project.

## 3. Feature-Based Modular Architecture for New Code

**IMPORTANT: This architecture applies only to newly created pages, features, and files. It must not be used as a reason to refactor or reorganize existing code.**

Whenever creating a new route or feature, keep its feature-specific implementation inside that feature's route folder.

### 3.1 Required Folder Structure

Use the following structure for newly created features, adapting file placement to the installed Next.js version and existing project conventions.

```text
src/app/
├── analytics/
│   ├── page.js
│   ├── components/
│   │   ├── AnalyticsHeader.jsx
│   │   └── AnalyticsKpiCards.jsx
│   ├── styles/
│   │   └── analytics.module.css
│   └── api/
│       └── analyticsApi.js
│
├── customers/
│   ├── page.js
│   ├── components/
│   ├── styles/
│   └── api/
│
└── inventory/
    ├── page.js
    ├── components/
    ├── styles/
    └── api/
```

The folder names above are examples. Use the actual route name for each new feature.

### 3.2 Components

- Place new feature-specific UI components inside that feature's `components/` directory.
- Do not place new feature-specific components in global component directories.
- Do not import feature-specific components from another feature's folder.
- Create local components for new features rather than introducing new global components.
- Keep components focused on the requirements of their own feature.
- Do not move, rename, or refactor existing components to fit this structure.
- Existing shared components may be used when technically necessary, but must not be modified without explicit approval.

### 3.3 CSS and Styling

- Place feature-specific styles inside that feature's `styles/` directory.
- Prefer CSS Modules, such as `*.module.css`, when supported by the existing project.
- Keep styles scoped to their own feature.
- Avoid global selectors and styling changes that affect unrelated routes.
- Do not modify global stylesheets, shared design tokens, Tailwind configuration, or other global styling configuration unless explicitly approved.
- Do not change existing styles merely to make them conform to the new architecture.
- Follow the existing project's styling conventions where required for compatibility.

### 3.4 API Functions

- Place new feature-specific API functions inside that feature's `api/` directory.
- Keep feature-specific request handling, response processing, and data transformations local to the feature.
- Do not import API functions from another feature's folder.
- Do not place new feature-specific API functions in a global API directory.
- Do not modify existing API functions, API clients, endpoints, request payloads, response structures, or authentication logic without explicit approval.
- Reuse existing shared infrastructure when necessary, without modifying it by default.
- Do not duplicate authentication, base URL configuration, or request configuration unnecessarily.
- Never expose private server credentials, API secrets, or sensitive environment variables in client-side code.
- Follow the installed Next.js documentation for server-side and client-side API boundaries.

### 3.5 State, Helpers, and Business Logic

- Keep new feature-specific state, calculations, and helper functions within the feature's own folder.
- Place helpers alongside the relevant component or API code.
- Do not create separate `hooks/` or `types/` directories.
- React hooks may be used inside `page.js` or relevant component files when needed.
- Do not introduce new global state, context providers, stores, or shared abstractions for feature-specific requirements without explicit approval.
- Keep feature-specific business rules and calculations local unless an existing shared implementation must be used.
- Do not change existing business calculations, pricing rules, or data transformations without explicit approval.

## 4. Existing Code Protection

**Existing code must remain unchanged by default. The new architecture is for new code only.**

- Do not refactor, reorganize, relocate, rename, or delete existing files just to match this architecture.
- Do not migrate existing components, stylesheets, API functions, or utilities into new feature folders.
- Do not modify existing pages or components as part of creating a new page unless explicitly approved.
- Do not rewrite existing implementations simply because a different approach appears cleaner.
- Do not make unrelated formatting changes or broad refactors.
- Preserve existing routes, functionality, API integrations, and business logic.
- Do not overwrite uncommitted user changes.
- Before editing a file, inspect its current contents and the relevant dependencies.

### If a New Feature Depends on Existing Code

- Use the existing component, API function, utility, or infrastructure when necessary without modifying it by default.
- Keep the new feature's own implementation inside its feature folder.
- Do not create a new global abstraction simply to avoid a small amount of duplication.
- If the requested implementation cannot be completed without modifying existing code, explain why and ask for explicit approval before making that change.
- Do not silently change existing code to make the implementation easier.

## 5. Routing and Imports

- Each new `page.js` must serve as the entry point for its route.
- Keep new feature-specific imports within that feature folder wherever practical.
- Avoid unnecessary dependencies between feature folders.
- Do not import implementation details from another feature's internal directories.
- Existing application layouts, providers, middleware, and routing infrastructure may remain shared when required.
- Do not duplicate or modify root layouts, authentication providers, or routing configuration without explicit approval.
- Follow the routing, layout, and file-placement rules supported by the installed Next.js version.
- Verify any framework-specific assumptions against the installed documentation.

## 6. UI and UX Guidelines

- Follow the existing DACBY Dashboard design language for new pages.
- Keep layouts clear, consistent, responsive, and easy to understand.
- Avoid unnecessary cards, decorative elements, duplicate information, and redundant KPIs.
- Use meaningful labels and clear information hierarchy.
- Reuse existing visual patterns as references without modifying their source files.
- Keep feature-specific styling local.
- For UI-only tasks, preserve existing API integrations, data flow, calculations, and business logic.
- Do not replace real API data with dummy data unless explicitly requested.
- Do not redesign unrelated pages.

## 7. API, Data, and Security Guidelines

- Inspect relevant existing data structures and API contracts before implementing a feature.
- Preserve existing request and response formats unless explicitly instructed otherwise.
- Do not invent production data, API fields, endpoints, or business rules.
- Do not hardcode values that should come from real API responses.
- Handle loading, empty, error, and success states where appropriate.
- Never expose secrets, access tokens, private credentials, or sensitive configuration.
- Follow existing authentication and authorization rules.
- Do not perform destructive database operations or change database schemas without explicit approval.

## 8. Testing and Verification

After implementing a task:

- Check that changes are limited to the requested feature.
- Verify that new feature-specific components, styles, and API functions are in their own feature folder.
- Verify that no unnecessary cross-feature imports were introduced.
- Confirm that existing files were not modified unless explicitly approved.
- Check available scripts in `package.json` before running lint, build, or tests.
- Run appropriate checks when possible.
- Do not suppress errors or claim tests passed when they were not run.
- If a test fails, report the actual error and distinguish pre-existing failures from failures caused by the new changes when possible.
- Do not install packages or alter the environment to fix a problem without approval.

## 9. Completion Report

After each implementation task, provide a concise report containing:

1. **Implemented:** What was added or changed.
2. **New files:** List every newly created file.
3. **Modified existing files:** List separately and explain why each modification was necessary.
4. **Architecture:** Confirm that new feature-specific components, styles, and APIs are isolated in the relevant feature folder.
5. **Dependencies:** Identify any existing shared infrastructure or external dependencies used.
6. **Business logic:** Confirm whether existing business logic or API contracts changed.
7. **Verification:** List the checks or tests performed and their actual results.
8. **Remaining issues:** Report any limitations or manual testing required.

If no existing files were modified, explicitly state that fact.

## 10. Highest-Priority Rule

**New architecture for new code only. Existing code remains unchanged unless the user explicitly authorizes modifications.**

When instructions conflict, protect existing functionality and ask for clarification before making changes that could affect unrelated code.

Never interpret a request to create a new feature as permission to refactor existing pages, global components, styles, APIs, or infrastructure.