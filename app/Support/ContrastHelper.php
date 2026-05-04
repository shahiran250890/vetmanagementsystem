<?php

namespace App\Support;

/**
 * Mirrors {@see resources/js/lib/contrast.ts} for regression tests and optional server-side use.
 *
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
final class ContrastHelper
{
    public static function relativeLuminance(float $r, float $g, float $b): float
    {
        $lin = function (float $c): float {
            $c = $c / 255;
            if ($c <= 0.03928) {
                return $c / 12.92;
            }

            return (($c + 0.055) / 1.055) ** 2.4;
        };
        $R = $lin($r);
        $G = $lin($g);
        $B = $lin($b);

        return 0.2126 * $R + 0.7152 * $G + 0.0722 * $B;
    }

    public static function contrastRatio(float $lumA, float $lumB): float
    {
        $L1 = max($lumA, $lumB);
        $L2 = min($lumA, $lumB);

        return ($L1 + 0.05) / ($L2 + 0.05);
    }

    /**
     * @return 'text-black'|'text-white'
     */
    public static function getTextColorForHexBackground(string $hex): string
    {
        $hex = ltrim(trim($hex), '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
        }
        if (strlen($hex) !== 6) {
            return 'text-black';
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        $lumBg = self::relativeLuminance((float) $r, (float) $g, (float) $b);
        $lumWhite = self::relativeLuminance(255, 255, 255);
        $lumBlack = self::relativeLuminance(0, 0, 0);
        $cw = self::contrastRatio($lumBg, $lumWhite);
        $cb = self::contrastRatio($lumBg, $lumBlack);

        return $cw >= $cb ? 'text-white' : 'text-black';
    }
}
