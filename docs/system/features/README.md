# System Features Technical Notes

This document captures cross-module features used throughout System Settings.

## 1) Detail (Show / View) pages

Implemented detail pages:

- Staff: `resources/js/pages/settings/system/staff/view.tsx`
- Roles: `resources/js/pages/settings/system/roles/show.tsx`
- Permissions: `resources/js/pages/settings/system/permissions/show.tsx`
- Species: `resources/js/pages/settings/system/species/show.tsx`

Backend endpoints are provided by `show()` methods in each module controller and wired through resource routes in `routes/settings.php`. Staff uses the route name `settings.system.users.show` with parameter `managed_staff` (URL prefix kept for backward compatibility).

## 2) Unified list-form pattern

Most settings modules use a single Inertia page for:

- index list mode
- create mode
- edit mode

This is controlled by backend props such as `formMode`, `editing*` / `managedStaff` object, and permission flags from `HasResourcePermission`. Staff additionally has a separate `view.tsx` page for read-only detail.

## 3) Access control and permission aliases

Modules use `HasResourcePermission` plus `SettingsPermissionName` to support canonical and legacy naming.

Examples:

- canonical: `settings.system.users.view`
- legacy: `view user`

Both are checked so older tenant permission data remains compatible.

Disabled accounts are blocked at the request lifecycle by `App\Http\Middleware\EnsureUserAccountEnabled` and redirected to `resources/js/pages/auth/access-denied.tsx`.

## 4) Clinic type gating

Species is conditionally available:

- UI hides Species navigation and the system hub card for `human` clinic type.
- Backend enforces restriction with `403` in `SpeciesController`.

This avoids direct URL bypass for unauthorized clinic contexts. Gating logic lives in `getSystemSettingModules()` in `resources/js/config/system-setting-hub.ts`.

## 5) Species dynamic breed form (embedded sub-feature)

Species create/edit includes dynamic repeated breed rows:

- add/remove breed rows in UI
- submit nested array payload (`breeds[*]`)
- transaction-based create/update synchronization
- duplicate in-request guard for breed name/code
- tenant-aware validation rules via model class unique/exists checks

## 6) View button UI convention

System list pages use a highlighted View button style:

- `className="bg-sky-600 text-white hover:bg-sky-700"`

Applied in staff, roles, permissions, and species listings.

## 7) Settings hub & "back to hub" navigation

The `/settings/system` index renders the **System Setting Hub** — a card grid of available modules plus "coming soon" placeholders (Departments, Positions, Payment Methods, Services, Diagnosis Codes, Medication Master, Lab/Imaging Tests, Insurance Panels, Notification Templates, Audit Logs, Backup & Restore). Cards and sidebar children are produced by `getSystemSettingModules()` / `getSystemSettingSubItems()` in `resources/js/config/system-setting-hub.ts` with permission and role gating.

Settings module pages (Organization, System Settings, etc.) include a **back-to-hub** action so operators can return to `/settings/system` without using the browser history.

## 8) Form architecture: React Hook Form + Zod

All new and refactored forms follow the **component-reuse-and-zod-validation** skill:

- Forms use `react-hook-form` with `zodResolver` and render as `<form noValidate>` so the browser does not show native validation popups.
- Field errors render inline via `FormMessage`.
- Schemas are co-located with the feature:
  - Patients: `resources/js/components/patients/patient-form-schema.ts` (+ `*.test.ts`).
  - Staff: `resources/js/modules/staff/lib/staff-form-schema.ts` (+ `*.test.ts`).
  - Organization: `resources/js/lib/organization-profile-form-schema.ts` (+ `*.test.ts`).
- Shared utilities:
  - `resources/js/lib/zod-error-map.ts` — consistent server-friendly messages.
  - `resources/js/lib/strip-undefined-payload.ts` — clean Inertia/JSON payloads.
- Shared field components: `gender-selection`, `marital-status-select`, `nationality-select`, `address-fields`, `form-dropdown`, `select-dropdown`, `form-grid`.

## 9) Frontend module structure

Feature UIs that own their own components, hooks, schemas, and types live under `resources/js/modules/{name}/`:

- `modules/staff/components/` — section components, table, toolbar, header, badges, sticky action bar.
- `modules/staff/hooks/` — feature hooks (`use-staff`, `use-staff-permissions`).
- `modules/staff/lib/` — Zod schema, form data parser, tab policy.
- `modules/staff/types.ts` — feature types re-exported via `modules/staff/index.ts`.

Cross-feature UI primitives (buttons, inputs, dialogs, tables, page-header, stat-card, data-table, list filters, toast viewport, loading spinner) remain in `resources/js/components/`.

## 10) Clinical UI vs System Settings

Dashboard and clinical areas (patients, appointments, medical records, billing) use `resources/js/config/main-nav.ts` with role-based visibility. Those pages load data primarily through the authenticated **`/api/v1`** JSON API (see `routes/api_v1.php` and `docs/architecture.md`). System Settings continues to use classic Inertia full-page props from `App\Modules\Settings\Http\Controllers\*`.

The patient `show` workspace is split into tabs (`information`, `history`, `new-record`, `medical-certificate`) implemented in `resources/js/components/patients/*-tab.tsx`. The Medical Certificate tab integrates with the new MC module and supports printable output via `resources/views/medical-certificates/print.blade.php`.

## 11) Shared frontend utilities

Cross-cutting UI includes toast handling (`resources/js/contexts/toast-context.tsx`, `api-toast-bridge`), list filters, data tables, page headers, stat cards, dashboard widgets (under `resources/js/pages/dashboard/widgets/`), loading indicators, and the `system-setting-hub` configuration used by both clinical and settings flows where applicable.
