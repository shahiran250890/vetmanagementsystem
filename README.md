# Vet Management System

Laravel application with multi-tenant support. Each tenant has its own database. Tenants are identified by domain (one tenant can have many domains).

## Requirements

- PHP 8.4+
- Composer
- Node.js & npm
- MySQL 8+
- Laravel Herd (or similar) for local URL (e.g. `vetmanagementsystem.test`)

## Installation

### 1. Set up Tenant Management first (landlord DB + tenant/domain data)

This app relies on a **tenant-management** project that owns the landlord database and manages tenants/domains. Set it up first so the landlord DB and tables exist.

**Tenant Management repo:** [https://github.com/shahiran250890/tenant-management](https://github.com/shahiran250890/tenant-management)

```bash
git clone https://github.com/shahiran250890/tenant-management.git tenant-management
cd tenant-management
composer install
npm install
cp .env.example .env
php artisan key:generate
```

Configure `.env` in the tenant-management project (e.g. MySQL with a database named `tenant_management`). Then:

```bash
# Create the landlord database (if not using SQLite)
mysql -u root -e "CREATE DATABASE tenant_management"

php artisan migrate
php artisan db:seed
```

This creates the landlord database, the **tenant** and **domain** tables, and seed data. Use the tenant-management UI or API to add tenants and domains. Each tenant must have a **dedicated** `database_name` (e.g. `vetmanagementsystem_clinic_1`).

**Do not** create the landlord database manually for Vet Management System—tenant-management creates and owns it. Ensure `LANDLORD_DB_DATABASE` in this project matches the database name used by tenant-management (e.g. `tenant_management`).

### 2. Clone and install Vet Management System

```bash
git clone <repository-url> vetmanagementsystem
cd vetmanagementsystem
composer install
npm install
```

### 3. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:

- Set `DB_*` (host, port, username, password) to the **same** MySQL server used by tenant-management. `DB_DATABASE` is the default connection name; this app uses **landlord** and **tenant** for multitenancy.
- Set `LANDLORD_DB_DATABASE=tenant_management` (same database name as in tenant-management).
- Keep `CACHE_STORE=file` and `SESSION_DRIVER=file` so cache/session do not depend on the default database (see “What not to do” below).

**Do not** create a new landlord database here—reuse the one from tenant-management.

### 4. Run tenant migrations

Run tenant migrations so each tenant’s database gets the Vet Management tables (users, cache, jobs, permissions, etc.):

```bash
php artisan tenants:artisan "migrate --path=database/migrations/tenant --database=tenant"
```

This runs for **every** tenant in the landlord DB (managed by tenant-management). Each tenant’s database is created automatically if it does not exist (via `EnsureTenantDatabaseExistsTask`).

### 5. Frontend

```bash
npm run build
# or for development
npm run dev
```

---

## Adding a new tenant

Tenants are managed by the [tenant-management](https://github.com/shahiran250890/tenant-management) app. Add the tenant and its domains there (UI or API). Each tenant must have:

- **name**
- **database_name** = a **dedicated** database name (e.g. `vetmanagementsystem_clinic_xyz`). Do **not** use the main app database name.
- **Domains** in the `domain` table linked to that tenant (e.g. `clinic1.vetmanagementsystem.test`).

Then run tenant migrations in this project so the new tenant’s database gets the Vet Management tables:

```bash
php artisan tenants:artisan "migrate --path=database/migrations/tenant --database=tenant"
```

The tenant database will be created automatically if it does not exist.

---

## Multitenancy overview

| What              | Where / How |
|-------------------|-------------|
| Tenant list       | Landlord DB (`LANDLORD_DB_DATABASE`), `tenant` table. |
| Domains           | Landlord DB, `domain` table; one tenant, many domains. |
| Current tenant    | Resolved by request host via `FindTenantByDomain` (looks up `domain` by host). |
| Tenant data       | Each tenant has its own DB; name from `tenant.database_name`. |
| Tenant migrations | `database/migrations/tenant/`; run with `tenants:artisan "migrate --path=database/migrations/tenant --database=tenant"`. |

Models that should use the **tenant** database must use the `UsesTenantConnection` trait (e.g. `User`). Models that live in the landlord DB use the landlord connection (e.g. `Tenant`, `Domain`).

---

## What not to do (initial setup and daily use)

1. **Do not set a tenant’s `database_name` to the main app database**  
   (e.g. do not use `DB_DATABASE` or `vetmanagementsystem` as a tenant’s `database_name`.) Each tenant must have a **dedicated** database name. The app throws if `database_name` equals the default DB.

2. **Do not use `CACHE_STORE=database` or `SESSION_DRIVER=database`**  
   unless the **default** database connection points to an existing database. With multitenancy, the default connection often points to a DB that does not exist; use `CACHE_STORE=file` and `SESSION_DRIVER=file` so `php artisan optimize:clear` and cache/session work without that DB.

3. **Do not run `php artisan config:cache`**  
   during development if you rely on runtime tenant switching. Cached config can prevent the tenant connection from using the current tenant’s database. For production, test thoroughly with config cache; run `php artisan config:clear` before running `tenants:artisan` if you see the wrong database being used.

4. **Do not put tenant-specific migrations in `database/migrations/`**  
   Tenant migrations live in `database/migrations/tenant/`. Only landlord (or shared) migrations should be in the root `database/migrations/` and run with `--database=landlord` (or the appropriate connection).

5. **Do not create or migrate the landlord database from this project**  
   When using [tenant-management](https://github.com/shahiran250890/tenant-management), the landlord DB is created and migrated there. This project only **connects** to it; ensure `LANDLORD_DB_DATABASE` matches tenant-management’s database name.

6. **Do not run `php artisan migrate`**  
   without `--database=landlord` if you intend to run only landlord migrations. The default connection may point to a DB you do not use for the app; specify the connection explicitly.

---

## Useful commands

| Command | Purpose |
|--------|--------|
| `php artisan tenants:artisan "migrate --path=database/migrations/tenant --database=tenant"` | Run tenant migrations for **all** tenants. |
| `php artisan tenants:artisan "migrate --path=database/migrations/tenant --database=tenant" --tenant=<id>` | Run tenant migrations for **one** tenant (use tenant UUID or ID). |
| `php artisan tenants:artisan "..." --tenant=id1 --tenant=id2` | Run for **multiple** tenants (repeat `--tenant`). |

## Internal setup API (for tenant-management)

This application exposes authenticated internal endpoints used by
`tenant-management` to run setup stages for a single tenant:

- `POST /api/internal/tenant-setup/token`
- `POST /api/internal/tenant-setup/tenants/{tenant}/database`
- `POST /api/internal/tenant-setup/tenants/{tenant}/migrations`
- `POST /api/internal/tenant-setup/tenants/{tenant}/seeders`
- `POST /api/internal/tenant-setup/tenants/{tenant}/ensure-user`

### Authentication flow

1. `tenant-management` calls `POST /api/internal/tenant-setup/token` with:
   - `X-Internal-Setup-Issuer`
   - `X-Internal-Setup-Timestamp` (unix timestamp, seconds)
   - `X-Internal-Setup-Signature` = `HMAC-SHA256("issuer|timestamp", shared_secret)`
2. This app validates the issuer/signature/clock-skew and issues a short-lived bearer token.
3. Each stage endpoint requires `Authorization: Bearer <access_token>`.
4. Access token is validated from cache and expires automatically based on TTL.

### Environment variables

Set these in this app and the same shared values in `tenant-management`:

- `INTERNAL_SETUP_ISSUER` (default: `tenant-management`)
- `INTERNAL_SETUP_SHARED_SECRET` (required)
- `INTERNAL_SETUP_ALLOWED_CLOCK_SKEW_SECONDS` (default: `60`)
- `INTERNAL_SETUP_ACCESS_TOKEN_TTL_SECONDS` (default: `120`)

### Stage behavior

- `database`: creates tenant database if it does not exist.
- `migrations`: runs tenant migrations via `tenants:artisan`.
- `seeders`: runs tenant seeders via `tenants:artisan`.
- `ensure-user`: runs `ensure-tenant-user` and returns either `seeded` or `skipped`.

All stage endpoints return JSON with:

- `ok` (boolean)
- `stage` (stage name)
- `message` (status detail)
- `result` (only for `ensure-user`)

Token endpoint returns:

- `ok` (boolean)
- `stage` (`token`)
- `message` (status detail)
- `access_token`
- `token_type` (`Bearer`)
- `expires_in` (seconds)

Tenant matching uses `tenant_artisan_search_fields` in `config/multitenancy.php`
(default: `id`). So `--tenant=<uuid>` runs setup only for that tenant.

---

## Local URL

With Laravel Herd, the app is typically available at `https://vetmanagementsystem.test`. Add domains (e.g. in `/etc/hosts` or Herd) and the `domain` table so each host resolves to the correct tenant.
