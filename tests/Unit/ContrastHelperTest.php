<?php

use App\Support\ContrastHelper;

test('white background prefers black text', function (): void {
    expect(ContrastHelper::getTextColorForHexBackground('#ffffff'))->toBe('text-black');
});

test('black background prefers white text', function (): void {
    expect(ContrastHelper::getTextColorForHexBackground('#000000'))->toBe('text-white');
});

test('mid blue background prefers white text', function (): void {
    expect(ContrastHelper::getTextColorForHexBackground('#1e40af'))->toBe('text-white');
});

test('contrast ratio is symmetric', function (): void {
    $a = ContrastHelper::relativeLuminance(20, 40, 60);
    $b = ContrastHelper::relativeLuminance(240, 240, 240);
    expect(ContrastHelper::contrastRatio($a, $b))->toBe(ContrastHelper::contrastRatio($b, $a));
});
