# System Settings Technical Docs

This folder contains module-level technical documentation for the System Settings area.

## Scope

System modules documented here:

- Users
- Roles
- Permissions
- Species (including breeds as an embedded management feature)
- System Settings
- Organization Profile

Clinical modules (patients, appointments, medical records, billing) are documented at the application level in `docs/architecture.md` and `docs/database-tenant-schema.md`.

## Architecture summary

- Backend routes: `routes/settings.php` under `settings/system`.
- Backend controllers: `app/Modules/Settings/Http/Controllers/*Controller.php`.
- Validation: `app/Http/Requests/Settings/*Request.php` (shared FormRequests; not yet relocated under the module).
- Frontend pages (Inertia React): `resources/js/pages/settings/system/**`.
- Shared layout and nav:
  - `resources/js/layouts/settings/system-layout.tsx`
  - `resources/js/config/settings-nav.ts`
- Authorization:
  - `HasResourcePermission` concern.
  - Permission alias normalization in `App\Support\SettingsPermissionName`.

## Routing notes

- Most modules use `Route::resource(...)` and now include `show` endpoints for:
  - `users`
  - `roles`
  - `permissions`
  - `species`
- `organization` is implemented with dedicated `GET/PUT` routes (not resourceful).
- `system-settings` currently supports index/create/store/edit/update/destroy (no show endpoint).

## Tenant and clinic-type behavior

- Settings data is tenant-scoped when models use tenant connection behavior.
- Species module is blocked for human clinics:
  - `SpeciesController::speciesManagementEnabled()` returns false when `organization_profiles.clinic_type = human`.
- System navigation hides Species for human clinic type in `settings-nav`.

## Module docs

- `docs/system/users/README.md`
- `docs/system/roles/README.md`
- `docs/system/permissions/README.md`
- `docs/system/species/README.md`
- `docs/system/system-settings/README.md`
- `docs/system/organization/README.md`
- `docs/system/features/README.md`
