# Clinic system user manual

This document is a **step-by-step guide** to using the Vet Management System (clinic web app) after you have an account. Your organization’s URL and access are provided by your administrator (for example, a site served via Laravel Herd as `https://<project>.test` or your production domain).

---

## 1. Before you start

1. **Use a supported browser** — Current versions of Chrome, Firefox, Safari, or Edge work best.
2. **Know your role** — What you see in the sidebar depends on your role (for example: **Superadmin**, **Admin**, **Doctor**, **Receptionist**, **Nurse**). Some areas are restricted by role (see section 10).
3. **Verify your email** — If your organization requires it, complete email verification before core features unlock (`verified` middleware).

---

## 2. Signing in and signing out

### 2.1 Log in

1. Open your clinic URL.
2. Go to the **Login** page (from the welcome screen or `/login`).
3. Enter your **email** and **password**.
4. If **two-factor authentication (2FA)** is enabled on your account, complete the challenge when prompted.
5. After a successful login you are taken to the **Dashboard** (or your app’s default authenticated landing route).

### 2.2 Forgot password

1. On the login page, use **Forgot password** (or `/forgot-password`).
2. Submit your email and follow the link in the message your organization sends.
3. Set a new password on the reset screen, then log in again.

### 2.3 Log out

1. Open the **user menu** at the bottom of the left sidebar (your name and avatar area).
2. Choose **Log out**.

---

## 3. Main screen layout

After you log in you use the **main app shell**:

| Area | Purpose |
|------|---------|
| **Left sidebar** | Logo (links to Dashboard), main navigation, and your user menu at the bottom |
| **Top of the content area** | **Breadcrumbs** on many pages so you know where you are |
| **Center** | The page you selected (lists, forms, patient details, etc.) |

### 3.1 Sidebar navigation (role-based)

Everyone with access typically sees **Dashboard**. Depending on your role you may also see:

- **Patients**
- **Appointments**
- **Medical records**
- **Billing**

If an item is missing, your role does not include that module (this is expected).

### 3.2 Personal settings

1. Click your **user menu** (sidebar footer).
2. Choose **Settings** — this opens **account settings** (profile, security, appearance, and a link to **System Setting** when your role allows).

---

## 4. Dashboard

**Goal:** Quick overview of clinic activity.

1. Click **Dashboard** in the sidebar (or follow the logo link).
2. Review the **widgets** shown — which cards appear depends on your permissions (for example total patients, today’s appointments, revenue, your schedule).
3. Use links inside widgets (where available) to drill into the related area (for example patients or appointments).

---

## 5. Patients

**Who usually uses this:** Roles that include **Patients** in the sidebar (e.g. Admin, Superadmin, Doctor, Receptionist, Nurse).

### 5.1 Find a patient

1. Click **Patients** in the sidebar.
2. Use **search and filters** on the list as needed.
3. Click a row or patient name to open the **patient detail** page.

### 5.2 Register a new patient

1. Go to **Patients**.
2. Open **Create** / **Add patient** (exact label follows the UI).
3. Complete the form — fields depend on **patient type** (for example **animal** vs **human**) and your organization’s configuration.
4. Save. You are typically redirected to the new patient’s profile or back to the list.

### 5.3 View and edit a patient

1. Open a patient from the list.
2. Review identity, status, species/owner (for animals), and other profile fields.
3. Click **Edit** to change profile data, then save.

### 5.4 Patient history (timeline)

On the patient detail page you can add **history / visit** entries when the form is available:

1. Fill in the fields (dates, visit type, status, title, details, etc.).
2. Submit. The entry appears in the **timeline** for that patient.

### 5.5 Medical certificates (where enabled)

For roles allowed to manage certificates (e.g. Admin, Superadmin, Doctor, Receptionist):

1. Open the **patient** record.
2. Use the action to **create a medical certificate** (wording on screen).
3. Complete the form and submit.
4. For an issued certificate you can **print** a printable view and, when policy allows, **void** a certificate with a reason.

Human-clinic organizations may use certificates differently; follow labels on screen.

---

## 6. Appointments

**Who usually uses this:** Admin, Superadmin, Doctor, Receptionist (**Nurse** does not have this item in the main nav by default).

### 6.1 Browse appointments

1. Click **Appointments**.
2. Review the list and open an appointment to view or change it per your permissions.

### 6.2 Create an appointment

1. Go to **Appointments**.
2. Choose **Create** (or equivalent).
3. Enter date, time, patient, and other required fields.
4. Save.

### 6.3 Edit an appointment

1. Open the appointment (from the list or a detail flow).
2. Use **Edit** when available, adjust fields, save.

---

## 7. Medical records

**Who usually uses this:** Admin, Superadmin, Doctor (**Receptionist** and **Nurse** are not in the route group for these pages).

### 7.1 List and open records

1. Click **Medical records**.
2. Open a record to view details, or create/edit according to the UI.

### 7.2 Create or edit a record

1. From **Medical records**, use **Create** or open an existing record and choose **Edit**.
2. Complete clinical fields as required by your clinic workflow.
3. Save.

---

## 8. Billing

**Who usually uses this:** Admin, Superadmin, Receptionist (Doctors are not in the billing route group by default).

### 8.1 Bills list

1. Click **Billing**.
2. Review open and past bills as shown in the table.

### 8.2 Create a bill

1. From **Billing**, start **New bill** / **Create** (per UI).
2. Attach line items and patient/customer context as required.
3. Save.

### 8.3 View a bill and take payment

1. Open a bill from the list.
2. Review totals and line items.
3. Use **Pay** / payment flow when you need to record a payment (opens the payment screen for that bill where implemented).

---

## 9. Account settings (every user)

From **Settings** in the user menu (or `/settings/profile`):

1. **Profile** — Name and email (and other profile fields your app exposes).
2. **Security** — Change password; manage two-factor and related security options if shown.
3. **Appearance** — Theme or display preferences if your deployment enables them.

---

## 10. System administration (authorized roles only)

Users who can open **System Setting** (`/settings/system`) see an overview of administration modules. Typical modules:

| Module | What it is for |
|--------|----------------|
| **User Management** | Create and manage user accounts; assign roles; enable/disable users where supported |
| **Role Management** | Define roles and attach permission bundles |
| **Permission Management** | Maintain permission keys used by the application |
| **Species Management** | Manage species lists for patients (**hidden for organizations configured as human clinic type**) |
| **System Settings** | Key–value settings used across the app |
| **Organization Profile** | Clinic name, address, branding or certificate-related fields your deployment stores |

**Step-by-step (example — add a user):**

1. Open **Settings** → **System Setting** (or go directly to `/settings/system`).
2. Click **User Management**.
3. Create or select a user, assign roles, and save.

Repeat similarly for roles, permissions, species, and organization data — always save after changes.

---

## 11. Typical day flows (summary)

### Receptionist

1. **Dashboard** — Check today’s overview.
2. **Appointments** — Book and adjust visits.
3. **Patients** — Register walk-ins, open records, add history notes if allowed.
4. **Billing** — Create bills and record payments.
5. **Medical certificates** — Issue or print when your role allows.

### Doctor

1. **Dashboard** — Schedule and metrics.
2. **Patients** — Open today’s cases; document in **history**; issue **medical certificates** if applicable.
3. **Appointments** — Confirm or update visits.
4. **Medical records** — Full clinical documentation per clinic process.

### Nurse (when deployed)

1. **Patients** — Support lookups and documentation allowed by role.
2. Use **Dashboard** widgets available to you.

### Administrator

1. All modules your role includes.
2. **System Setting** — Users, roles, organization, and configuration.

---

## 12. If something does not work

1. **Missing menu item** — Your **role** may not include that module; ask an admin.
2. **403 / forbidden** — You reached a URL your role cannot use; use the sidebar instead of bookmarked admin URLs.
3. **Email not verified** — Complete verification from the **Verify email** screen or ask an admin to resend.
4. **Tenant disabled** — If your organization’s subscription or tenant is disabled, the app may show a dedicated error; contact support or admin.
5. **Blank or stale UI after an update** — Run a fresh build in development (`npm run dev` / `npm run build`) or hard-refresh the browser; production deployments are handled by your host.

---

## 13. Document control

- **Application:** Vet Management System (Laravel + Inertia/React).
- **Purpose:** End-user reading guide for clinic staff.
- **Accuracy:** Written to match route groups and navigation in the codebase; labels on screen may vary slightly (always trust the live UI).

For database or developer-focused schema notes, see other files under `docs/` in this repository as applicable.
