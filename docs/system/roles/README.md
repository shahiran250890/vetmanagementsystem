# Role Management Module

## Functional overview

Role Management provides:

- Paginated role listing with search.
- Create and edit roles.
- Permission assignment to roles (`permission_ids[]`).
- Delete safeguards (cannot delete `superadmin` or roles assigned to users).
- View role detail page (`show`).

## Routes

Prefix: `/settings/system/roles`

- `GET /` -> `settings.system.roles.index`
- `GET /create` -> `settings.system.roles.create`
- `POST /` -> `settings.system.roles.store`
- `GET /{role}` -> `settings.system.roles.show`
- `GET /{role}/edit` -> `settings.system.roles.edit`
- `PUT/PATCH /{role}` -> `settings.system.roles.update`
- `DELETE /{role}` -> `settings.system.roles.destroy`

## Backend

- Controller: `App\Http\Controllers\Settings\RoleController`
  - Uses `HasResourcePermission` with resource name `role`.
  - `show()` loads role with permissions.
  - `destroy()` blocks:
    - role name `superadmin`
    - any role currently assigned to users
- Request validation:
  - `App\Http\Requests\Settings\RoleRequest`
  - Validates unique role name and `permission_ids`.

## Frontend

- List/form page: `resources/js/pages/settings/system/roles/index.tsx`
  - Handles list/create/edit modes.
  - Action buttons: `View`, `Edit`, `Delete`.
  - Uses confirm delete dialog with backend validation error feedback.
- Detail page: `resources/js/pages/settings/system/roles/show.tsx`
  - Displays role name and all assigned permissions.

## Permission model

Expected permission namespace:

- `view role`
- `create role`
- `update role`
- `delete role`

## Tests

Key feature tests:

- `tests/Feature/Settings/RoleManagementTest.php`
  - verifies delete guards.
- `tests/Feature/Settings/UserRolePermissionShowTest.php`
  - verifies role detail page rendering.
