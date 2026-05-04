/**
 * WCAG 2.1 relative luminance & contrast helpers for dynamic surfaces (charts, badges on variable fills).
 *
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

export type ReadableTailwindTextClass = 'text-black' | 'text-white';

type Rgb = { r: number; g: number; b: number };

const LINEAR_THRESHOLD = 0.03928;
const LINEAR_SLOPE = 12.92;
const GAMMA = 2.4;

function channelToLinear(channel: number): number {
    const c = channel / 255;

    if (c <= LINEAR_THRESHOLD) {
        return c / LINEAR_SLOPE;
    }

    return ((c + 0.055) / 1.055) ** GAMMA;
}

/** WCAG relative luminance for sRGB 0–255 channels. */
export function relativeLuminance(rgb: Rgb): number {
    const r = channelToLinear(rgb.r);
    const g = channelToLinear(rgb.g);
    const b = channelToLinear(rgb.b);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two luminances (each 0–1). */
export function contrastRatio(lumA: number, lumB: number): number {
    const L1 = Math.max(lumA, lumB);
    const L2 = Math.min(lumA, lumB);

    return (L1 + 0.05) / (L2 + 0.05);
}

function parseHexColor(input: string): Rgb | null {
    const hex = input.trim().replace(/^#/, '');

    if (hex.length === 3) {
        const r = Number.parseInt(hex[0]! + hex[0]!, 16);
        const g = Number.parseInt(hex[1]! + hex[1]!, 16);
        const b = Number.parseInt(hex[2]! + hex[2]!, 16);

        if ([r, g, b].some((n) => Number.isNaN(n))) {
            return null;
        }

        return { r, g, b };
    }

    if (hex.length === 6) {
        const r = Number.parseInt(hex.slice(0, 2), 16);
        const g = Number.parseInt(hex.slice(2, 4), 16);
        const b = Number.parseInt(hex.slice(4, 6), 16);

        if ([r, g, b].some((n) => Number.isNaN(n))) {
            return null;
        }

        return { r, g, b };
    }

    return null;
}

function parseRgbFunction(input: string): Rgb | null {
    const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(input.trim());

    if (!m) {
        return null;
    }

    const r = Math.round(Number.parseFloat(m[1]!));
    const g = Math.round(Number.parseFloat(m[2]!));
    const b = Math.round(Number.parseFloat(m[3]!));

    if ([r, g, b].some((n) => Number.isNaN(n) || n < 0 || n > 255)) {
        return null;
    }

    return { r, g, b };
}

/**
 * Rough OKLCH L-only heuristic when full gamut conversion is not available without extra deps.
 * L is lightness 0–1 (CSS OKLCH). Good enough for chart label polarity on solid fills.
 */
function parseOklchLightness(input: string): number | null {
    const m = /^oklch\(\s*([\d.]+)/i.exec(input.trim());

    if (!m) {
        return null;
    }

    const L = Number.parseFloat(m[1]!);

    return Number.isFinite(L) ? L : null;
}

function luminanceFromBackground(backgroundColor: string): number | null {
    const hex = parseHexColor(backgroundColor);

    if (hex) {
        return relativeLuminance(hex);
    }

    const rgb = parseRgbFunction(backgroundColor);

    if (rgb) {
        return relativeLuminance(rgb);
    }

    const L = parseOklchLightness(backgroundColor);

    if (L !== null) {
        /** Map lightness to approximate luminance for polarity only (not for exact WCAG on chroma). */
        return L;
    }

    return null;
}

/**
 * Returns Tailwind classes for **black** or **white** body text on the given background,
 * picking whichever achieves higher contrast (WCAG-style ratio on sRGB luminance).
 *
 * Supports `#rgb`, `#rrggbb`, `rgb()/rgba()`, and `oklch(L …)` (uses L-only heuristic).
 */
export function getTextColorForBackground(backgroundColor: string): ReadableTailwindTextClass {
    const lumBg = luminanceFromBackground(backgroundColor);

    if (lumBg === null) {
        return 'text-black';
    }

    const lumWhite = relativeLuminance({ r: 255, g: 255, b: 255 });
    const lumBlack = relativeLuminance({ r: 0, g: 0, b: 0 });
    const contrastWithWhite = contrastRatio(lumBg, lumWhite);
    const contrastWithBlack = contrastRatio(lumBg, lumBlack);

    return contrastWithWhite >= contrastWithBlack ? 'text-white' : 'text-black';
}

/**
 * Same as {@link getTextColorForBackground} but returns theme-friendly classes when you are
 * on a near-default surface (unknown parse).
 */
export function getReadableForegroundClass(backgroundColor: string): 'text-foreground' | ReadableTailwindTextClass {
    const lumBg = luminanceFromBackground(backgroundColor);

    if (lumBg === null) {
        return 'text-foreground';
    }

    return getTextColorForBackground(backgroundColor);
}
