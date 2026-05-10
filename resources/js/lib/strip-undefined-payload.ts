import type { FormDataConvertible } from '@inertiajs/core';

/** Drop keys whose value is `undefined` so JSON/Inertia bodies match Laravel optional inputs. */
export function stripUndefinedPayload(
    record: Record<string, FormDataConvertible | undefined>,
): Record<string, FormDataConvertible> {
    const out: Record<string, FormDataConvertible> = {};

    for (const [key, value] of Object.entries(record)) {
        if (value !== undefined) {
            out[key] = value;
        }
    }

    return out;
}
