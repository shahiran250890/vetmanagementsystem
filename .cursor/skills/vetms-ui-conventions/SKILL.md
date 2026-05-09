---
name: vetms-ui-conventions
description: >-
  Enforces Vet Management System file naming and React/Inertia layout patterns:
  kebab-case TS/TSX files, Inertia page paths matching resources/js/pages, shell
  layout composition (AppShell, AppSidebar, AppContent, AppMain), domain vs ui
  components, hooks, services, and Wayfinder imports. Use when creating or
  moving pages, layouts, components, hooks, services, or when the user asks for
  UI structure, naming consistency, or where to place new frontend files. Also
  use when scaffolding PHP under app/Modules for matching domain vocabulary.
---

# Vet Management System — UI and file conventions

## When to apply

- Adding or renaming anything under `resources/js/` (pages, layouts, components, hooks, services).
- Wiring Inertia `Inertia::render()` to a page component.
- Choosing between root `components/` vs `components/ui/` vs domain folders.
- PHP feature work where frontend names should align with module domains (`Patients`, `Billing`, etc.).

## Inertia pages

- **Physical path**: `resources/js/pages/<segments>.tsx` using **kebab-case** segments (e.g. `patients/index.tsx`, `settings/system/roles/show.tsx`, `dashboard/widgets/today-appointments.tsx`).
- **Inertia name** (first argument to `Inertia::render`): same logical path with **slashes**, no `pages/` prefix and no `.tsx` — e.g. `'patients/index'`, `'settings/system/roles/show'`.
- **Resolution**: Vite resolves `./pages/${name}.tsx` against `import.meta.glob('./pages/**/*.tsx')` — the string must match an existing file path.
- **Default export**: page modules export a single default React component.

## TypeScript / React file naming

| Area | Convention | Examples |
|------|------------|----------|
| Components (non-ui) | kebab-case | `app-sidebar.tsx`, `patient-filters.tsx`, `form-page-layout.tsx` |
| UI primitives | kebab-case in `components/ui/` | `button.tsx`, `dropdown-menu.tsx` |
| Hooks | kebab-case, `use-` prefix | `use-current-url.ts`, `use-patient-form-field-handler.ts` |
| Services | kebab-case, `-service` suffix | `patient-service.ts`, `billing-service.ts` |
| Lib / types / config | kebab-case | `list-query.ts`, `settings-nav.ts` |
| Domain-specific components | Subfolder **kebab-case** matching route area | `components/patients/`, `components/system/users/` |

Use **`@/`** path alias for imports (e.g. `@/components/...`, `@/layouts/...`, `@/routes/...`).

## Layout and shell usage

Use the existing shell **instead of inventing new page wrappers**.

1. **Main authenticated app (sidebar)**  
   - Pages use `import AppLayout from '@/layouts/app-layout'`.  
   - `app-layout.tsx` delegates to `layouts/app/app-sidebar-layout.tsx`.  
   - Stack: `AppShell` (`variant="sidebar"` default) → `AppSidebar` + `AppContent` → `AppSidebarHeader` (breadcrumbs) → `AppMain` → page body.  
   - Pass **`breadcrumbs`** when the page should show header crumbs (type `BreadcrumbItem[]` from `@/types`).

2. **AppShell variants**  
   - `sidebar` (default): uses `SidebarProvider` from `@/components/ui/sidebar`.  
   - `header`: plain full-height column; only use when a feature truly needs the header variant.

3. **Settings (account)**  
   - Use `@/layouts/settings/layout` (and related settings layouts) for profile/appearance flows — sidebar nav + `Heading`, not the main `AppSidebar` nav alone.

4. **Auth**  
   - Use `@/layouts/auth-layout` and nested `layouts/auth/*` patterns already used by Fortify views.

5. **Full-page forms**  
   - Reuse `@/components/form-page-layout` and its exported className helpers (`formPageSurfaceClassName`, `formPageFormClassName`, etc.) for consistent card surfaces and field spacing.

## Component placement rules

- **`components/ui/`** — shadcn-style primitives only; do not put feature logic here.
- **`components/<domain>/`** — list filters, forms, and tables specific to that domain (e.g. `components/patients/patient-form.tsx`).
- **`components/system/`** — cross-cutting admin/system UI (e.g. `system/users/`).
- **Root `components/`** — shared chrome (`app-sidebar`, `data-table`, `breadcrumbs`, `heading`) and small generic helpers.
- Prefer **`DataTable`** + typed **`Column<T>`** from `@/components/data-table` for index pages that mirror existing list UIs.

## Navigation and data fetching

- Prefer **Wayfinder** route helpers from `@/routes/...` (and controller actions from `@/actions/` when generated) over hardcoded paths; align query params with existing list pages (`preserveState`, `preserveScroll`, filter objects).
- **`lib/list-query.ts`** and **`types/pagination.ts`** — reuse for list/filter consistency when adding similar pages.

## PHP side (alignment only)

- Feature code lives under **`app/Modules/<StudlyCaseDomain>/`** with layers: `Application/Services`, `Domain/DTOs`, `Http/{Controllers,Requests,Resources}`, `Infrastructure`, `Events`, `Listeners`, `Policies`, `Contracts`.
- Class names are **PascalCase**; list/detail Inertia names should stay **kebab-case URL segments** and match the React tree under `pages/`.

## Out of scope / different tree

- **`premium-saas-dashboard/`** is a separate Vite app (e.g. `*-page.tsx` naming). Do **not** apply this skill’s `resources/js/pages/` rules there unless explicitly working in that package.

## Quick checklist (new screen)

- [ ] Page file path = kebab-case segments under `resources/js/pages/`.
- [ ] `Inertia::render('segment/...')` matches that file exactly.
- [ ] Default layout: `AppLayout` + breadcrumbs if needed.
- [ ] Domain pieces under `components/<domain>/`; primitives from `components/ui/`.
- [ ] Routes via `@/routes/...`; filenames kebab-case throughout.
