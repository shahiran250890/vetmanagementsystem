# System Settings Module

## Functional overview

System Settings provides key/value configuration management:

- Paginated setting list with search by `key` or `label`.
- Create, edit, delete settings.
- Enable/disable setting rows via `is_enabled`.

No dedicated `show` endpoint exists currently for this module.

## Routes

Prefix: `/settings/system/system-settings`

- `GET /` -> `settings.system.system-settings.index`
- `GET /create` -> `settings.system.system-settings.create`
- `POST /` -> `settings.system.system-settings.store`
- `GET /{system_setting}/edit` -> `settings.system.system-settings.edit`
- `PUT/PATCH /{system_setting}` -> `settings.system.system-settings.update`
- `DELETE /{system_setting}` -> `settings.system.system-settings.destroy`

## Backend

- Controller: `App\Modules\Settings\Http\Controllers\SystemSettingController`
  - Uses `HasResourcePermission` with resource name `system setting`.
  - Returns list and form props in same Inertia page, controlled via `formMode`.
- Request validation:
  - `App\Http\Requests\Settings\SystemSettingRequest`
  - Validates:
    - unique `key`
    - `label`
    - optional string `value`
    - boolean `is_enabled`

## Frontend

- Page: `resources/js/pages/settings/system/system-settings/index.tsx`
  - Supports list/create/edit in one page.

## Permission model

Expected permission namespace:

- `view system setting`
- `create system setting`
- `update system setting`
- `delete system setting`
