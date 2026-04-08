<?php

test('guest is redirected from system settings modules', function () {
    $routes = [
        'settings.system.system-settings.index',
        'settings.system.users.index',
        'settings.system.species.index',
        'settings.system.roles.index',
        'settings.system.permissions.index',
    ];

    foreach ($routes as $route) {
        $this->get(route($route))->assertRedirect(route('login'));
    }
});
