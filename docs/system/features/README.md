# System Features Technical Notes

This document captures cross-module features used throughout System Settings.

## 1) Detail (Show) pages

Implemented show/detail pages:

- Users: `resources/js/pages/settings/system/users/show.tsx`
- Roles: `resources/js/pages/settings/system/roles/show.tsx`
- Permissions: `resources/js/pages/settings/system/permissions/show.tsx`
- Species: `resources/js/pages/settings/system/species/show.tsx`

Backend endpoints are provided by `show()` methods in each module controller and are wired through resource routes in `routes/settings.php`.

## 2) Unified list-form pattern

Most settings modules use a single Inertia page for:

- index list mode
- create mode
- edit mode

This is controlled by backend props such as `formMode`, `editing*` object, and permission flags from `HasResourcePermission`.

## 3) Access control and permission aliases

Modules use `HasResourcePermission` plus `SettingsPermissionName` to support canonical and legacy naming.

Examples:

- canonical: `settings.system.users.view`
- legacy: `view user`

Both are checked so older tenant permission data remains compatible.

## 4) Clinic type gating

Species is conditionally available:

- UI hides Species navigation for `human` clinic type.
- Backend enforces restriction with `403` in `SpeciesController`.

This avoids direct URL bypass for unauthorized clinic contexts.

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

Applied in users, roles, permissions, and species listings.

## 7) Clinical UI vs System Settings

Dashboard and clinical areas (patients, appointments, medical records, billing) use `resources/js/config/main-nav.ts` with role-based visibility. Those pages load data primarily through the authenticated **`/api/v1`** JSON API (see `routes/api_v1.php` and `docs/architecture.md`). System Settings continues to use classic Inertia full-page props from `App\Modules\Settings\Http\Controllers\*`.

## 8) Shared frontend utilities

Cross-cutting UI includes toast handling (`resources/js/contexts/toast-context.tsx`, `api-toast-bridge`), list filters, data tables, and loading indicators used by both clinical and settings flows where applicable.
