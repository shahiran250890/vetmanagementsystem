---
name: component-reuse-and-zod-validation
description: >-
  Ensures forms follow a component-first architecture with React Hook Form + Zod,
  inline validation via FormMessage, and browser validation disabled with noValidate.
  Use when building or refactoring forms, inputs, modals, cards, tables, or layout
  blocks; when adding Zod schemas, zodResolver, or react-hook-form; or when the user
  mentions form validation, fields, or UI data entry.
---

# Reuse existing components and standardize validation (React Hook Form + Zod)

## When to apply

- Any new or updated **form**, **field**, **modal**, **card**, **table column**, or **layout block** that collects or edits data.
- Whenever wiring **Zod**, **`useForm`**, or **`zodResolver`**.
- Together with **`vetms-ui-conventions`** for file placement under `resources/js/` (read `.cursor/skills/vetms-ui-conventions/SKILL.md`).

## Purpose

Ensure all generated forms follow a component-first architecture and use **React Hook Form + Zod** for validation. All validation errors must be displayed inline within the form, and browser-native validation popups must be disabled.

---

## Core standards

### 1. Reuse existing components first

Before creating any new field, form, modal, card, table column, or layout block:

1. Search the codebase for reusable components. In this app, start under:
   - `resources/js/components/` (including `resources/js/components/ui/` for primitives)
   - Domain and feature folders such as `resources/js/modules/**/components/` when applicable  
   Also check generic locations used elsewhere:
   - `shared/`, `common/`, `ui/`, `forms/`, `tables/`, `modals/` (when present).

2. Reuse existing components whenever possible, including:
   - `Input`
   - `TextField`
   - `InputField`
   - `SelectField`
   - `TextareaField`
   - `DatePickerField`
   - `CheckboxField`
   - `RadioGroupField`
   - `FormField`
   - `FormControl`
   - `FormItem`
   - `FormLabel`
   - `FormMessage`
   - `DataTable`
   - `Button`
   - `Card`
   - `Dialog`

3. Prefer reusable components for **inputs, selects, textareas, buttons, and labeled field groups**. Do not use raw HTML for those when an existing component covers the same behavior.

4. **Exceptions**: Use native `<form>` with **`noValidate`** as required for submission and accessibility. Other semantic elements are acceptable only when no suitable component exists.

5. Only create a new component if no suitable reusable component exists. New components must be generic and reusable.

---

### 2. Validation stack (mandatory)

All forms must use:

- `react-hook-form`
- `zod`
- `@hookform/resolvers/zod`

#### Required pattern

1. Define a Zod schema.
2. Infer TypeScript types using `z.infer`.
3. Initialize `useForm()` with `zodResolver(schema)`.
4. Wrap the form with `noValidate`.
5. Display errors inline using `<FormMessage />`.

---

### 3. Disable browser native validation

Every form must explicitly disable browser validation.

```tsx
<form noValidate onSubmit={form.handleSubmit(onSubmit)}>
    {/* Compose fields from shared/domain components; surface errors with FormMessage */}
</form>
```

---

## Coordination

- **Layout and naming**: follow `vetms-ui-conventions` for paths, kebab-case files, and `@/` imports.
- **Inertia forms**: follow `inertia-react-development` for client-side navigation and form submission patterns where applicable.
