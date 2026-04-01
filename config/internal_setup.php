<?php

return [
    'issuer' => env('INTERNAL_SETUP_ISSUER', 'tenant-management'),
    'shared_secret' => env('INTERNAL_SETUP_SHARED_SECRET', 'ea2c45eda2ff7f48d7b5c93eb48beba60b4bad9a7b34230adc2c28b6ea962dab'),
    'allowed_clock_skew_seconds' => (int) env('INTERNAL_SETUP_ALLOWED_CLOCK_SKEW_SECONDS', 60),
    'access_token_ttl_seconds' => (int) env('INTERNAL_SETUP_ACCESS_TOKEN_TTL_SECONDS', 120),
];
