# Permission Management Module

## Functional overview

Permission Management provides:

- Permission listing with search.
- Create and edit permission keys.
- Delete safeguards (permission cannot be deleted while assigned to roles).
- View permission detail page (`show`) with assigned roles.

## Routes

Prefix: `/settings/system/permissions`

- `GET /` -> `settings.system.permissions.index`
- `GET /create` -> `settings.system.permissions.create`
- `POST /` -> `settings.system.permissions.store`
- `GET /{permission}` -> `settings.system.permissions.show`
- `GET /{permission}/edit` -> `settings.system.permissions.edit`
- `PUT/PATCH /{permission}` -> `settings.system.permissions.update`
- `DELETE /{permission}` -> `settings.system.permissions.destroy`

## Backend

- Controller: `App\Http\Controllers\Settings\PermissionController`
  - Uses `HasResourcePermission` with resource name `permission`.
  - Normalizes permission names through `SettingsPermissionName::normalizePermissionInput(...)`.
  - `show()` loads permission with related roles.
  - `destroy()` blocks deletion when permission is in use by roles.
- Request validation:
  - `App\Http\Requests\Settings\PermissionRequest`
  - Enforces permission key format:
    - regex `^[a-z0-9]+(?:\.[a-z0-9_]+){3,}$`
  - Ensures uniqueness.

## Frontend

- List/form page: `resources/js/pages/settings/system/permissions/index.tsx`
  - Handles list/create/edit modes.
  - Action buttons: `View`, `Edit`, `Delete`.
- Detail page: `resources/js/pages/settings/system/permissions/show.tsx`
  - Displays permission key and assigned roles.

## Permission model

Expected permission namespace:

- `view permission`
- `create permission`
- `update permission`
- `delete permission`

## Tests

Key feature test:

- `tests/Feature/Settings/UserRolePermissionShowTest.php`
  - verifies permission detail page rendering.
