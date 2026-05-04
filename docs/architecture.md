# Application architecture

This document summarizes how the Vet Management System is structured after the modular clinical refactor. For database tables, see `docs/database-tenant-schema.md`. For multitenancy setup, see the root `README.md`.

## High-level stack

- **Backend:** Laravel 12, PHP 8.2+ (see `composer.json`), Spatie Multitenancy, Spatie Permission.
- **Frontend:** Inertia.js v2, React 19, Tailwind CSS v4, Laravel Wayfinder for typed routes/actions.
- **Tenancy:** One database per tenant; tenant resolved from request host via landlord `domain` records. Tenant models use `UsesTenantConnection`.

## Domain modules (`app/Modules`)

Feature code is grouped by bounded context under `app/Modules/{ModuleName}/`. Typical layout per module:

| Area | Role |
|------|------|
| `Application/Services/` | Use-case orchestration (create/update/list). |
| `Domain/DTOs/` | Filter and list query objects passed into repositories. |
| `Http/Controllers/` | Inertia controllers and JSON API controllers. |
| `Http/Requests/` | Form and API request validation. |
| `Http/Resources/` | API Resources for JSON responses. |
| `Infrastructure/` | Eloquent repositories and adapters (e.g. `*Repository`, audit loggers). |
| `Events/` / `Listeners/` | Domain events and side effects (e.g. patient audit trail). |
| `Policies/` | Authorization for module models. |

Current modules include **Patients**, **Appointments**, **Medical** (medical records and prescriptions), **Billing** (bills, bill items, payments), and **Settings** (system settings, users, roles, permissions, species, organization, profile/security).

Shared Eloquent models for cross-module relations remain under `app/Models/` (e.g. `App\Models\Patients\Patient`, `App\Models\Appointments\Appointment`).

## HTTP routing

| File | Purpose |
|------|---------|
| `routes/web.php` | Core web routes, dashboard. |
| `routes/patients.php` | Inertia patient CRUD and history store (`App\Modules\Patients\Http\Controllers\…`). |
| `routes/clinical.php` | Inertia shells for appointments, medical records, and billing list/detail/payment pages (data loaded via API from the SPA). |
| `routes/settings.php` | Authenticated settings and `settings/system/*` (`App\Modules\Settings\Http\Controllers\…`). |
| `routes/api.php` | Prefixes `v1` API (see below) and internal tenant-setup endpoints. |
| `routes/api_v1.php` | Versioned JSON API for the clinical UI: patients, appointments, medical-records, bills, payments, plus clinic helpers (`ClinicSpaSupportController`: `me`, doctor lookup). |

Form requests for **Settings** remain in `app/Http/Requests/Settings/` for now; **Patients** (and other clinical modules) use requests under their module’s `Http/Requests/`.

## Patient history as an audit log

`patient_history_entries` is an **append-only style audit log**, not a rich clinical visit row. Each entry has:

- `action` (string discriminator),
- optional `description`,
- optional `metadata` (JSON; legacy visit fields were migrated into `metadata` with `legacy: true`),
- optional polymorphic `reference` (`reference_type` / `reference_id`) linking to originating records (appointments, bills, etc. where applicable),
- `created_by` user,
- timestamps.

Listeners in each module record patient-affecting events into this table for traceability.

## Clinical data model (tenant DB)

New tenant tables support end-to-end clinical workflows:

- **Appointments** — scheduled visits linked to patient and doctor; status and type enums at the application layer.
- **Medical records** — optional link to an appointment; symptoms, diagnosis, treatment, notes.
- **Prescriptions** — belong to a medical record.
- **Bills** / **bill_items** / **payments** — billing totals, line items, and recorded payments.
- **Patient vitals** — time-series measurements (e.g. weight, height, temperature) with `recorded_at`.

Animal-specific scalar fields such as **species** and denormalized weight on the legacy `patients` row were consolidated: species and related animal profile fields live on **`patient_animal_profiles`**; longitudinal metrics favor **`patient_vitals`** (see migrations `2026_05_04_120000_*` and `2026_05_04_120100_*`).

## Frontend conventions

- **Main navigation** is role-aware (`resources/js/config/main-nav.ts`) for Dashboard, Patients, Appointments, Medical records, and Billing.
- **System settings** navigation remains in `resources/js/config/settings-nav.ts` with clinic-type gating for Species (hidden/disallowed for `human` clinic type).
- Clinical pages under `resources/js/pages/appointments/`, `medical-records/`, and `bills/` consume the v1 API; shared UI includes data tables, filters, toasts, and loading patterns used across modules.

## Testing

Feature tests live under `tests/Feature/` grouped by area (e.g. `Settings/`, patient and API tests). After backend changes, run targeted tests with `php artisan test --compact` and a path or filter.
