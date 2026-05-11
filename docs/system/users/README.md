# Staff Management Module

> This file lives under `docs/system/users/` for backward compatibility.
> The module is now called **Staff Management** and replaces the older User Management feature. The URL prefix `/settings/system/users` and permission keys (`*.user`) are retained so existing tenant data and bookmarks keep working.

## Functional overview

Staff Management provides:

- Paginated **staff directory** listing with multi-criteria filters (search, role, department, employment status, clinic) and sortable columns.
- Create, edit, and view staff records.
- Optional **login account** section (links a `staff` row to a `users` row via `users.staff_id`).
- Role assignment (`role_ids[]`) when an account is linked.
- Status toggle (`PATCH .../{managed_staff}/status`) for the linked user account.
- **Bulk actions:** bulk status change and bulk role assignment.
- **Exports:** staff directory CSV and PDF (Blade view `views/exports/staff-directory-print.blade.php`).
- Disabled accounts are blocked from login by `App\Http\Middleware\EnsureUserAccountEnabled` and routed to `pages/auth/access-denied.tsx`.

## Routes

URL prefix: `/settings/system/users` (legacy, see note above). Route name prefix: `settings.system.users.*`. Route parameter: `managed_staff`.

- `GET /` -> `settings.system.users.index`
- `GET /create` -> `settings.system.users.create`
- `POST /` -> `settings.system.users.store`
- `GET /{managed_staff}` -> `settings.system.users.show`
- `GET /{managed_staff}/edit` -> `settings.system.users.edit`
- `PUT/PATCH /{managed_staff}` -> `settings.system.users.update`
- `DELETE /{managed_staff}` -> `settings.system.users.destroy`
- `PATCH /{managed_staff}/status` -> `settings.system.users.toggle-status`
- `POST /bulk-status` -> `settings.system.users.bulk-status`
- `POST /bulk-roles` -> `settings.system.users.bulk-roles`
- `GET /export/csv` -> `settings.system.users.export.csv`
- `GET /export/pdf` -> `settings.system.users.export.pdf`

## Backend

- Controller: `App\Modules\Settings\Http\Controllers\StaffManagementController`
  - Uses `HasResourcePermission` with resource name `user`.
  - `index()` paginates via `Staff::scopeManageableFor()` which excludes the super-admin (`users.id = 1`) and the current actor.
  - `show()` renders `settings/system/staff/view.tsx` with the staff record, its linked user, and roles.
  - Handles auto vs manual `staff_number` (auto generates `STF-#####` from `staff.id`).
  - Synchronises optional login account: creates / updates `users` row, hashes password, calls `syncRoles()`.
- Models:
  - `App\Models\Staff` — tenant model (`UsesTenantConnection`, `SoftDeletes`); fillable covers personal, contact, employment, professional, and document fields; casts dates and JSON columns; `user()` `HasOne`; `reportingManager()` self `BelongsTo`.
  - `App\Models\User` gains nullable `staff_id` FK and `staff()` relation; `Nationality` lookup model under `App\Models\Nationality`.
- Request validation:
  - `App\Http\Requests\Settings\StaffManagementRequest` — validates personal, contact, employment, and professional sections; conditionally requires doctor-specific fields (medical registration / APC / specialization); normalises `assigned_clinics_text` to an array; decodes `documents_metadata` JSON; permits manual or auto `staff_number`.
  - `App\Http\Requests\Settings\StaffStatusToggleRequest` — single user enable/disable.
  - `App\Http\Requests\Settings\StaffBulkStatusRequest` — bulk enable/disable across selected staff.
  - `App\Http\Requests\Settings\StaffBulkRolesRequest` — bulk role assignment.

## Frontend

- Pages:
  - `resources/js/pages/settings/system/staff/index.tsx` — single page handling list, create, and edit modes.
  - `resources/js/pages/settings/system/staff/view.tsx` — read-only detail page.
- Feature module (`resources/js/modules/staff/`):
  - `components/staff-form.tsx` — tabbed form composed of section components.
  - `components/staff-directory-table.tsx`, `staff-toolbar.tsx`, `staff-header.tsx`, `sticky-staff-action-bar.tsx`.
  - Sections: `personal-information-section`, `contact-section`, `employment-section`, `professional-section`, `schedule-section`, `documents-section`, `role-permission-section`, `user-account-section`.
  - Badges: `staff-status-badge`, `account-status-badge`.
  - `lib/staff-form-schema.ts` — Zod schema and types.
  - `lib/parse-staff-form-data.ts` — flattens nested form data for API submission.
  - `lib/staff-form-tab-policy.ts` — controls which tabs are enabled by mode/role.
  - `hooks/use-staff.ts`, `hooks/use-staff-permissions.ts`.
  - `types.ts` — shared `StaffMember`, `StaffFilters`, `StaffFilterOptions` types.
- Shared inputs used by the form: `address-fields`, `gender-selection`, `marital-status-select`, `nationality-select`, `form-dropdown`, `select-dropdown`.

## Permission model

Resource permission name (canonical and legacy aliases supported via `SettingsPermissionName`):

- `view user` / `settings.system.users.view`
- `create user` / `settings.system.users.create`
- `update user` / `settings.system.users.update`
- `delete user` / `settings.system.users.delete`

## Tenant schema

Created/extended by:

- `2026_05_10_120000_create_staff_and_link_users_table` — creates the `staff` table and adds `users.staff_id` FK; backfills a `staff` row for each existing user (skips super-admin id 1) and copies `mmc_registration_number` from staff back to user.
- `2026_05_10_140000_create_nationalities_table` — tenant-scoped reference list for the nationality picker.
- `2026_05_10_150000_split_staff_address_columns` — splits `staff.address` into `address_line_1/2`, `city`, `state`, `postcode`, `country`.

See `docs/database-tenant-schema.md` for column definitions.

## Seeders

- `database/seeders/NationalitySeeder.php` — populates default nationality list.
- `database/seeders/UserSeeder.php` — updated to create staff rows alongside users.

## Tests

Key feature tests:

- `tests/Feature/Settings/StaffManagementAccountAccessTest.php`
- `tests/Feature/Settings/StaffStaffNumberStoreTest.php`
- `tests/Feature/Settings/UserRolePermissionShowTest.php`
- `tests/Feature/Auth/DisabledAccountAccessTest.php`
- `tests/Feature/NationalitySeederTest.php`
