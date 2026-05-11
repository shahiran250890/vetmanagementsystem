# System Settings Technical Docs

This folder contains module-level technical documentation for the System Settings area.

## Scope

System modules documented here:

- Staff (replaces the previous Users module; URL prefix `/settings/system/users` retained for backward compatibility)
- Roles
- Permissions
- Species (including breeds as an embedded management feature)
- System Settings (key/value)
- Organization Profile / Clinic Information

The System Settings entry page (`/settings/system`) is a hub of module cards driven by `resources/js/config/system-setting-hub.ts`, including "coming soon" placeholders (Departments, Positions, Payment Methods, Services, Diagnosis Codes, Medication Master, Lab/Imaging Tests, Insurance Panels, Notification Templates, Audit Logs, Backup & Restore).

Clinical modules (patients, appointments, medical records, medical certificates, billing) are documented at the application level in `docs/architecture.md` and `docs/database-tenant-schema.md`.

## Architecture summary

- Backend routes: `routes/settings.php` under `settings/system`.
- Backend controllers: `app/Modules/Settings/Http/Controllers/*Controller.php` (e.g. `StaffManagementController`, `RoleController`, `PermissionController`, `SpeciesController`, `SystemSettingController`, `OrganizationProfileController`).
- Validation: `app/Http/Requests/Settings/*Request.php` (shared FormRequests; not yet relocated under the module).
- Frontend pages (Inertia React): `resources/js/pages/settings/system/**`.
- Frontend feature module (Staff): `resources/js/modules/staff/{components,hooks,lib,types.ts}` — components, schemas, hooks, and parsers co-located with the Staff feature.
- Shared layout and nav:
  - `resources/js/layouts/settings/system-layout.tsx`
  - `resources/js/config/settings-nav.ts` (account/settings sidebar)
  - `resources/js/config/system-setting-hub.ts` (system hub cards + sidebar children)
- Authorization:
  - `HasResourcePermission` concern.
  - Permission alias normalization in `App\Support\SettingsPermissionName`.
  - Disabled accounts blocked by `App\Http\Middleware\EnsureUserAccountEnabled` (redirects to `pages/auth/access-denied.tsx`).
- Form validation: React Hook Form + Zod, with `noValidate` and inline `FormMessage`. Schemas live next to the feature (e.g. `resources/js/modules/staff/lib/staff-form-schema.ts`, `resources/js/lib/organization-profile-form-schema.ts`). See the `component-reuse-and-zod-validation` skill.

## Routing notes

- Most modules use `Route::resource(...)`. `show` endpoints exist for:
  - `users` (Staff Management — also exports CSV/PDF, bulk status, bulk roles, status toggle endpoints)
  - `roles`
  - `permissions`
  - `species`
- `organization` is implemented with dedicated `GET/PUT` routes (not resourceful).
- `system-settings` supports index/create/store/edit/update/destroy (no `show` endpoint).
- Staff routes live under `/settings/system/users` with route parameter `managed_staff` for backward compatibility with the previous User Management URLs and permission keys.

## Tenant and clinic-type behavior

- Settings data is tenant-scoped when models use tenant connection behavior.
- Species module is blocked for human clinics:
  - `SpeciesController::speciesManagementEnabled()` returns false when `organization_profiles.clinic_type = human`.
- System hub and sidebar hide Species for human clinic type via `getSystemSettingModules` in `system-setting-hub.ts`.
- Staff records reference tenant-scoped `nationalities` for the country-of-origin / nationality picker.

## Module docs

- `docs/system/users/README.md` — Staff Management
- `docs/system/roles/README.md`
- `docs/system/permissions/README.md`
- `docs/system/species/README.md`
- `docs/system/system-settings/README.md`
- `docs/system/organization/README.md`
- `docs/system/features/README.md`
