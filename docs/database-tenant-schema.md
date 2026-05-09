# Tenant database schema

This document describes **tenant** table structures as defined by migrations in `database/migrations/tenant/`. Spatie Laravel Permission table names follow `config/permission.php` (defaults used below).

Clinical scheduling, EMR-style records, billing, vitals, and the patient audit log are shaped by migrations such as `2026_05_04_120000_create_appointments_medical_billing_vitals_tables`, `2026_05_04_120100_drop_patient_species_weight_sync_animal_profiles`, and `2026_05_04_120200_convert_patient_history_entries_to_audit_log`.

---

## `users`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string |
| `email` | string, unique |
| `phone` | string, nullable |
| `is_enabled` | boolean, default true |
| `email_verified_at` | timestamp, nullable |
| `password` | string |
| `two_factor_secret` | text, nullable |
| `two_factor_recovery_codes` | text, nullable |
| `two_factor_confirmed_at` | timestamp, nullable |
| `remember_token` | string, nullable |
| `created_at`, `updated_at` | timestamps |

---

## `password_reset_tokens`

| Column | Type / notes |
|--------|----------------|
| `email` | string PK |
| `token` | string |
| `created_at` | timestamp, nullable |

---

## `sessions`

| Column | Type / notes |
|--------|----------------|
| `id` | string PK |
| `user_id` | FK → `users`, nullable, indexed |
| `ip_address` | string(45), nullable |
| `user_agent` | text, nullable |
| `payload` | longText |
| `last_activity` | int, indexed |

---

## `cache`

| Column | Type / notes |
|--------|----------------|
| `key` | string PK |
| `value` | mediumText |
| `expiration` | int, indexed |

---

## `cache_locks`

| Column | Type / notes |
|--------|----------------|
| `key` | string PK |
| `owner` | string |
| `expiration` | int, indexed |

---

## `jobs`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `queue` | string |
| `payload` | longText |
| `attempts` | unsignedTinyInteger |
| `reserved_at` | unsignedInteger, nullable |
| `available_at` | unsignedInteger |
| `created_at` | unsignedInteger |
| | index(`queue`, `reserved_at`, `available_at`) |

---

## `job_batches`

| Column | Type / notes |
|--------|----------------|
| `id` | string PK |
| `name` | string |
| `total_jobs`, `pending_jobs`, `failed_jobs` | integer |
| `failed_job_ids` | longText |
| `options` | mediumText, nullable |
| `cancelled_at`, `created_at`, `finished_at` | integer (nullable where noted) |

---

## `failed_jobs`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `uuid` | string, unique |
| `connection`, `queue` | text |
| `payload`, `exception` | longText |
| `failed_at` | timestamp, use current |

---

## `permissions` (Spatie + application)

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string |
| `guard_name` | string |
| `module_id` | FK → `modules`, nullable, null on delete |
| `created_at`, `updated_at` | timestamps |
| | unique(`name`, `guard_name`) |

---

## `roles` (Spatie; teams disabled)

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string |
| `guard_name` | string |
| `created_at`, `updated_at` | timestamps |
| | unique(`name`, `guard_name`) |

---

## `model_has_permissions`

| Column | Type / notes |
|--------|----------------|
| `permission_id` | FK → `permissions`, cascade on delete |
| `model_type` | string |
| `model_id` | unsignedBigInteger, indexed with `model_type` |
| | composite PK: (`permission_id`, `model_id`, `model_type`) |

---

## `model_has_roles`

| Column | Type / notes |
|--------|----------------|
| `role_id` | FK → `roles`, cascade on delete |
| `model_type` | string |
| `model_id` | unsignedBigInteger, indexed with `model_type` |
| | composite PK: (`role_id`, `model_id`, `model_type`) |

---

## `role_has_permissions`

| Column | Type / notes |
|--------|----------------|
| `permission_id` | FK → `permissions`, cascade on delete |
| `role_id` | FK → `roles`, cascade on delete |
| | composite PK: (`permission_id`, `role_id`) |

---

## `modules`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string |
| `key` | string, unique |
| `is_enabled` | boolean, default true |
| `created_at`, `updated_at` | timestamps |

> Table was renamed from `module` to `modules` in a later migration.

---

## `patients`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `user_id` | FK → `users`, nullable, null on delete, indexed |
| `name` | string |
| `patient_type` | string, default `animal`, indexed |
| `breed`, `sex` | string, nullable |
| `date_of_birth` | date, nullable |
| `color`, `microchip_number` | string, nullable |
| `emergency_contact_name`, `emergency_contact_phone` | string, nullable |
| `allergies`, `current_medications`, `notes` | text, nullable |
| `vaccination_status`, `status` | string, nullable (`status` default `active`) |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | soft deletes |
| | indexes: `name`, `status`, `user_id` |

> **Note:** `species` and `latest_weight_kg` were removed from `patients` after consolidation into `patient_animal_profiles` and `patient_vitals` (see migration `2026_05_04_120100_*`). For animals, treat `patient_animal_profiles.species` (and related columns) as the source of truth for species and profile-level weight hints; use `patient_vitals` for measured vitals over time.

---

## `patient_human_profiles`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, unique, cascade on delete |
| `identification_number` | string, nullable, indexed |
| `blood_type` | string, nullable, indexed (legacy string column) |
| `blood_type_id` | FK → `blood_types`, nullable |
| `primary_phone` | string, nullable |
| `address` | text, nullable |
| `height_cm`, `weight_kg` | decimal(5,2), nullable |
| `blood_pressure` | string, nullable |
| `vital_medical_information` | text, nullable |
| `created_at`, `updated_at` | timestamps |

---

## `patient_animal_profiles`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, unique, cascade on delete |
| `owner_user_id` | FK → `users`, nullable, indexed |
| `species` | string, indexed (canonical species label for animal patients) |
| `breed`, `color`, `microchip_number`, `vaccination_status` | string, nullable |
| `latest_weight_kg` | decimal(8,2), nullable |
| `created_at`, `updated_at` | timestamps |
| | index `microchip_number` |

---

## `patient_history_entries` (audit log)

Append-only audit trail for patient-related activity (not the legacy visit narrative schema).

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, cascade on delete |
| `reference_type`, `reference_id` | nullable morph to originating model |
| `action` | string (discriminator, e.g. `legacy.history_entry` for migrated rows) |
| `description` | text, nullable |
| `metadata` | json, nullable (legacy visit fields stored here when migrated) |
| `created_by` | FK → `users`, nullable, null on delete |
| `created_at`, `updated_at` | timestamps |
| | index(`patient_id`, `created_at`) |

---

## `appointments`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, cascade on delete |
| `doctor_id` | FK → `users`, cascade on delete |
| `appointment_datetime` | datetime, indexed |
| `type` | string(32) |
| `status` | string(32) |
| `notes` | text, nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | soft deletes |
| | index(`patient_id`, `appointment_datetime`) |

---

## `medical_records`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, cascade on delete |
| `doctor_id` | FK → `users`, cascade on delete |
| `appointment_id` | FK → `appointments`, nullable, null on delete |
| `symptoms`, `diagnosis`, `treatment`, `notes` | text, nullable |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | soft deletes |
| | index(`patient_id`, `created_at`) |

---

## `prescriptions`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `medical_record_id` | FK → `medical_records`, cascade on delete |
| `medicine_name` | string |
| `dosage`, `duration` | string, nullable |
| `instructions` | text, nullable |
| `created_at`, `updated_at` | timestamps |

---

## `bills`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, cascade on delete |
| `total_amount` | decimal(12,2), default 0 |
| `status` | string(32) |
| `created_at`, `updated_at` | timestamps |
| `deleted_at` | soft deletes |
| | index(`patient_id`, `status`) |

---

## `bill_items`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `bill_id` | FK → `bills`, cascade on delete |
| `item_type` | string(64) |
| `description` | string, nullable |
| `amount` | decimal(12,2) |
| `created_at`, `updated_at` | timestamps |

---

## `payments`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `bill_id` | FK → `bills`, cascade on delete |
| `amount` | decimal(12,2) |
| `method` | string(64) |
| `paid_at` | datetime |
| `created_at`, `updated_at` | timestamps |
| | index(`bill_id`, `paid_at`) |

---

## `patient_vitals`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `patient_id` | FK → `patients`, cascade on delete |
| `weight_kg`, `height_cm` | decimal(8,2), nullable |
| `temperature` | decimal(5,2), nullable |
| `recorded_at` | datetime |
| `created_at`, `updated_at` | timestamps |
| | index(`patient_id`, `recorded_at`) |

---

## `species`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string, unique |
| `code` | string, unique |
| `is_enabled` | boolean, default true |
| `created_at`, `updated_at` | timestamps |

---

## `breeds`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `species_id` | FK → `species`, cascade on delete |
| `name` | string |
| `code` | string, unique |
| `is_enabled` | boolean, default true |
| `created_at`, `updated_at` | timestamps |
| | unique(`species_id`, `name`) |

---

## `blood_types`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `name` | string, unique (seeded: A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `created_at`, `updated_at` | timestamps |

---

## `system_settings`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `key` | string, unique |
| `label` | string |
| `value` | text, nullable |
| `is_enabled` | boolean, default true |
| `created_at`, `updated_at` | timestamps |

---

## `organization_profiles`

| Column | Type / notes |
|--------|----------------|
| `id` | bigint PK |
| `clinic_type` | string(20) |
| `organization_name` | string |
| `organization_phone`, `organization_fax` | string(50) |
| `organization_email` | string |
| `organization_license` | string |
| `created_at`, `updated_at` | timestamps |

---

## Source of truth

- Migrations: `database/migrations/tenant/`
- Permission config: `config/permission.php`

Central (non-tenant) databases may have additional migrations elsewhere; this file documents **tenant** tables only.
