# Species Management Module

## Functional overview

Species Management provides:

- Paginated species listing with search.
- Species create, edit, delete.
- View species detail page (`show`).
- Embedded dynamic breed management in species create/edit form.

Breed management is implemented as a species sub-feature:

- Add multiple breeds while creating a species.
- Update, add, and remove breeds when editing a species.
- Breed data is persisted transactionally with species updates.

## Routes

Prefix: `/settings/system/species`

- `GET /` -> `settings.system.species.index`
- `GET /create` -> `settings.system.species.create`
- `POST /` -> `settings.system.species.store`
- `GET /{species}` -> `settings.system.species.show`
- `GET /{species}/edit` -> `settings.system.species.edit`
- `PUT/PATCH /{species}` -> `settings.system.species.update`
- `DELETE /{species}` -> `settings.system.species.destroy`

## Backend

- Controller: `App\Http\Controllers\Settings\SpeciesController`
  - Uses `HasResourcePermission` with resource name `species`.
  - Uses clinic-type guard:
    - `speciesManagementEnabled()` forbids module when organization clinic type is `human`.
  - `show()` loads species with ordered breeds.
  - `store()` and `update()` run in DB transactions.
  - `update()` sync strategy:
    - removes deleted breeds
    - updates existing breeds
    - creates new breeds
- Request validation:
  - `App\Http\Requests\Settings\SpeciesRequest`
  - Tenant-aware model-based rules:
    - `Rule::unique(Species::class, ...)`
    - `Rule::exists(Breed::class, ...)`
  - Validates nested breed array:
    - `breeds.*.id`
    - `breeds.*.name`
    - `breeds.*.code`
    - `breeds.*.is_enabled`
  - `after()` hook rejects duplicate breed names/codes within a single submission.

## Frontend

- List/form page: `resources/js/pages/settings/system/species/index.tsx`
  - Includes dynamic breed row UI in create/edit mode.
  - Action buttons: `View`, `Edit`, `Delete`.
- Detail page: `resources/js/pages/settings/system/species/show.tsx`
  - Displays species details and breeds table.

## Related standalone breed module

A separate breed CRUD exists:

- Controller: `App\Http\Controllers\Settings\BreedController`
- Page: `resources/js/pages/settings/system/breeds/index.tsx`

Current System navigation emphasizes species-first management, with breeds maintained from species form for common workflows.

## Permission model

Expected permission namespace:

- `view species`
- `create species`
- `update species`
- `delete species`

## Tests

Key feature tests:

- `tests/Feature/Settings/SpeciesManagementTest.php`
  - create species with multiple breeds
  - update species with breed synchronization
  - species detail page response payload
- `tests/Feature/Settings/OrganizationProfileTest.php`
  - species module forbidden when clinic type is `human`
