<?php

use Laravel\Fortify\Features;

test('public registration is not available', function () {
    if (Features::enabled(Features::registration())) {
        $this->markTestSkipped('Registration feature is enabled');
    }

    $this->get('/register')->assertNotFound();
});

describe('when registration is enabled', function () {
    beforeEach(function () {
        $this->skipUnlessFortifyFeature(Features::registration());
    });

    test('registration screen can be rendered', function () {
        $response = $this->get(route('register'));

        $response->assertOk();
    });

    test('new users can register', function () {
        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    });
});
