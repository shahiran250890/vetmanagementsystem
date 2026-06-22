/**
 * Heuristic: Inertia/Laravel validation errors are typically a flat object of
 * string or string[] values. Adjust if a module uses a different envelope.
 */
export function isLikelyLaravelValidationErrors(errors: unknown): boolean {
    if (!errors || typeof errors !== 'object' || Array.isArray(errors)) {
        return false;
    }

    const values = Object.values(errors as Record<string, unknown>);

    if (values.length === 0) {
        return false;
    }

    return values.every((value) => {
        if (typeof value === 'string') {
            return true;
        }

        return Array.isArray(value) && value.every((item) => typeof item === 'string');
    });
}
