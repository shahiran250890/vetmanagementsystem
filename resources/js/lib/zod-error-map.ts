import type { ZodError } from 'zod';

/**
 * Map a Zod error to Laravel-style flat keys using dot segments (e.g. `animal_profile.species`).
 */
export function zodIssuesToDotRecord(error: ZodError): Record<string, string> {
    const out: Record<string, string> = {};

    for (const issue of error.issues) {
        if (issue.path.length === 0) {
            continue;
        }

        const key = issue.path.map(String).join('.');

        if (out[key] === undefined) {
            out[key] = issue.message;
        }
    }

    return out;
}
