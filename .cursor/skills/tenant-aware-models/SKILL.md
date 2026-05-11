---
name: tenant-aware-models
description: >-
  Ensures new Eloquent models and tenant database tables use the Spatie multitenancy tenant
  connection (`UsesTenantConnection`). Use when creating or editing models, migrations,
  factories, or queries for clinic/tenant data; when adding route model binding to tenant
  tables; or when debugging "table not found" on the central database. Read this skill before
  adding any model that stores per-clinic business data.
---

# Tenant-aware Eloquent models (Vet Management System)

This application uses **Spatie Laravel Multitenancy**. Business data lives in **per-tenant databases**. New models that represent tenant-owned records **must** use the tenant connection, or queries will hit the **default (central) MySQL database** and fail with missing tables or wrong data.

## When to apply

- Creating or editing any `app/Models/**` class that backs **tenant** data (staff, patients, files, settings rows, etc.).
- Adding **tenant** migrations under `database/migrations/tenant/`.
- Writing factories, seeders, or feature tests that touch tenant tables.
- Adding **implicit route model binding** to a tenant-scoped model.
- Reviewing PRs that introduce new tables or models.

## Mandatory pattern for tenant models

Use the same trait as existing tenant models (`Staff`, `User`, `FileAsset`, `Role`, …):

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class YourModel extends Model
{
    use UsesTenantConnection;

    // ...
}
```

Import path:

`Spatie\Multitenancy\Models\Concerns\UsesTenantConnection`

Do **not** set `$connection = 'tenant'` manually unless you have a rare, documented exception—the trait follows the configured tenant connection name from `config/multitenancy.php`.

## Migrations

- **Tenant tables** (clinic data): place migrations in **`database/migrations/tenant/`** and run them in tenant context (e.g. `tenants:artisan` with migrate `--path=database/migrations/tenant` and `--database=tenant`).
- **Central / landlord** tables (e.g. tenants list, domains): use the project’s landlord migration location and models **without** `UsesTenantConnection`.

## Models that must stay on the landlord connection

Do **not** add `UsesTenantConnection` to:

- `App\Models\Tenant`
- `App\Models\Domain`
- Any other model explicitly documented as **central** or **landlord-only**

When unsure, check where sibling data lives: if `Staff` / `User` reference the table, it is tenant data.

## Factories and tests

- Prefer creating tenant models through factories the same way existing tests do.
- Many Pest tests set `config(['multitenancy.tenant_database_connection_name' => config('database.default')])` and migrate `database/migrations/tenant` to exercise tenant models on the test connection—mirror that pattern for new tenant models.

## Common failure mode (what to avoid)

A model **without** `UsesTenantConnection` uses the **default** connection. Inserts go to the central database (e.g. `vetmanagementsystem`), while the migration only created the table on the **tenant** database → **`Base table or view not found`** in logs.

## Checklist (new model)

- [ ] Model uses `UsesTenantConnection` if the table is tenant-scoped.
- [ ] Migration lives under `database/migrations/tenant/` when the table is tenant-scoped.
- [ ] Relations to `User`, `Staff`, etc. remain consistent (those models are tenant-aware).
- [ ] Feature test covers at least one create/query path using the tenant migration path.

## Coordination

- For broader Laravel patterns, still follow **`laravel-best-practices`** (`.cursor/skills/laravel-best-practices/SKILL.md`).
- For Pest specifics, follow **`pest-testing`** when writing the tests above.
