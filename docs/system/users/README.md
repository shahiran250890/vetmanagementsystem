# User Management Module

## Functional overview

User Management provides:

- Paginated user listing with search.
- Create and edit user account details.
- Role assignment (`role_ids[]`) during create/update.
- Status toggle endpoint (`users/{managed_user}/status`).
- Delete user.
- View user detail page (`show`).

## Routes

Prefix: `/settings/system/users`

- `GET /` -> `settings.system.users.index`
- `GET /create` -> `settings.system.users.create`
- `POST /` -> `settings.system.users.store`
- `GET /{managed_user}` -> `settings.system.users.show`
- `GET /{managed_user}/edit` -> `settings.system.users.edit`
- `PUT/PATCH /{managed_user}` -> `settings.system.users.update`
- `DELETE /{managed_user}` -> `settings.system.users.destroy`
- `PATCH /{managed_user}/status` -> `settings.system.users.toggle-status`

## Backend

- Controller: `App\Modules\Settings\Http\Controllers\UserManagementController`
  - Uses `HasResourcePermission` with resource name `user`.
  - `show()` loads user with roles and renders detail page.
  - `manageableUsers()` excludes superadmin account id `1` and current authenticated user.
- Request validation:
  - `App\Http\Requests\Settings\UserManagementRequest`
  - Required fields: `name`, `email`, `is_enabled`.
  - Password required on create, optional on edit.
  - Role IDs validated via `role_ids.*`.
- Status toggle request:
  - `App\Http\Requests\Settings\UserStatusToggleRequest`

## Frontend

- List/form page: `resources/js/pages/settings/system/users/index.tsx`
  - Single page supports list/create/edit modes using `formMode`.
  - Includes action buttons: `View`, `Edit`, `Delete`.
- Detail page: `resources/js/pages/settings/system/users/show.tsx`
  - Displays user identity fields, status, and assigned roles.

## Permission model

Expected permission namespace:

- `view user`
- `create user`
- `update user`
- `delete user`

Canonical aliases are also supported via `SettingsPermissionName`.

## Technical notes

- URL parameter name is `managed_user` (resource parameter mapping in `routes/settings.php`).
- Role synchronization uses `syncRoles(...)`.
- Password updates are conditional and hashed with `Hash::make(...)`.
