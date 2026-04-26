# Organization Profile Module

## Functional overview

Organization Profile manages tenant-level clinic identity and clinic type:

- Edit and save core organization details.
- Clinic type (`vet` or `human`) selection.
- Drives module behavior (for example: Species module availability).

## Routes

Prefix: `/settings/system/organization`

- `GET /settings/system/organization` -> `settings.system.organization.edit`
- `PUT /settings/system/organization` -> `settings.system.organization.update`

## Backend

- Controller: `App\Http\Controllers\Settings\OrganizationProfileController`
  - Uses `HasResourcePermission` with resource name `system setting`.
  - Stores a single profile record via `firstOrNew()`.
- Request validation:
  - `App\Http\Requests\Settings\OrganizationProfileRequest`
  - Required fields:
    - `clinic_type` in `vet|human`
    - `organization_name`
    - `organization_phone`
    - `organization_email`
    - `organization_fax`
    - `organization_license`

## Frontend

- Page: `resources/js/pages/settings/system/organization/index.tsx`
  - Edit form for organization profile values.

## Integration behavior

- Species module checks `organization_profiles.clinic_type`:
  - if `human`, Species routes return `403`.
- System navigation hides Species when clinic type is `human`.

## Permission model

Organization profile uses the System Setting permission namespace:

- `view system setting`
- `update system setting`

## Tests

Key test coverage:

- `tests/Feature/Settings/OrganizationProfileTest.php`
  - page access
  - validation
  - save behavior
  - species module forbidden for human clinic type
