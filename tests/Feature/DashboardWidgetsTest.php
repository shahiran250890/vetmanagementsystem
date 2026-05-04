<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Role;
use App\Models\User;
use App\ViewModels\DashboardWidgets;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function (): void {
    config(['multitenancy.tenant_database_connection_name' => config('database.default')]);
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();

    foreach (['admin', 'doctor', 'receptionist', 'superadmin', 'nurse'] as $roleName) {
        Role::findOrCreate($roleName, 'web');
    }
});

test('admin dashboard inertia props include revenue and today widgets', function (): void {
    $user = User::factory()->create();
    $user->assignRole('admin');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/index')
            ->where('dashboardWidgets', function ($ids) {
                $list = is_array($ids) ? $ids : $ids->all();

                return in_array(DashboardWidgets::RECENT_REVENUE, $list, true)
                    && in_array(DashboardWidgets::TODAY_APPOINTMENTS, $list, true)
                    && in_array(DashboardWidgets::TOTAL_PATIENTS, $list, true);
            }, 'Expected admin dashboard widgets'));
});

test('doctor dashboard includes my schedule widget', function (): void {
    $user = User::factory()->create();
    $user->assignRole('doctor');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/index')
            ->where('dashboardWidgets', function ($ids) {
                $list = is_array($ids) ? $ids : $ids->all();

                return in_array(DashboardWidgets::MY_SCHEDULE, $list, true);
            }));
});

test('nurse dashboard does not include revenue widget', function (): void {
    $user = User::factory()->create();
    $user->assignRole('nurse');

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/index')
            ->where('dashboardWidgets', function ($ids) {
                $list = is_array($ids) ? $ids : $ids->all();

                return ! in_array(DashboardWidgets::RECENT_REVENUE, $list, true)
                    && in_array(DashboardWidgets::TOTAL_PATIENTS, $list, true);
            }));
});
