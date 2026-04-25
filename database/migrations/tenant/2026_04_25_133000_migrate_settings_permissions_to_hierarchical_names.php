<?php

use App\Support\SettingsPermissionName;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $this->migratePermissions(SettingsPermissionName::legacyToCanonicalMap());
    }

    public function down(): void
    {
        $this->migratePermissions(array_flip(SettingsPermissionName::legacyToCanonicalMap()));
    }

    /**
     * @param  array<string, string>  $map
     */
    private function migratePermissions(array $map): void
    {
        $permissionTable = config('permission.table_names.permissions', 'permissions');
        $roleHasPermissionsTable = config('permission.table_names.role_has_permissions', 'role_has_permissions');
        $modelHasPermissionsTable = config('permission.table_names.model_has_permissions', 'model_has_permissions');
        $permissionPivotKey = config('permission.column_names.permission_pivot_key', 'permission_id');

        DB::transaction(function () use ($map, $permissionTable, $roleHasPermissionsTable, $modelHasPermissionsTable, $permissionPivotKey): void {
            foreach ($map as $from => $to) {
                $fromPermission = DB::table($permissionTable)->where('name', $from)->where('guard_name', 'web')->first();
                $toPermission = DB::table($permissionTable)->where('name', $to)->where('guard_name', 'web')->first();

                if ($fromPermission === null) {
                    continue;
                }

                if ($toPermission === null) {
                    DB::table($permissionTable)
                        ->where('id', $fromPermission->id)
                        ->update(['name' => $to]);

                    continue;
                }

                $this->moveRolePermissionLinks(
                    $roleHasPermissionsTable,
                    $permissionPivotKey,
                    (int) $fromPermission->id,
                    (int) $toPermission->id
                );

                $this->moveModelPermissionLinks(
                    $modelHasPermissionsTable,
                    $permissionPivotKey,
                    (int) $fromPermission->id,
                    (int) $toPermission->id
                );

                DB::table($permissionTable)->where('id', $fromPermission->id)->delete();
            }
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    private function moveRolePermissionLinks(string $table, string $permissionPivotKey, int $fromId, int $toId): void
    {
        $rows = DB::table($table)
            ->select('role_id')
            ->where($permissionPivotKey, $fromId)
            ->get();

        foreach ($rows as $row) {
            $existsOnTarget = DB::table($table)
                ->where($permissionPivotKey, $toId)
                ->where('role_id', $row->role_id)
                ->exists();

            if ($existsOnTarget) {
                DB::table($table)
                    ->where($permissionPivotKey, $fromId)
                    ->where('role_id', $row->role_id)
                    ->delete();

                continue;
            }

            DB::table($table)
                ->where($permissionPivotKey, $fromId)
                ->where('role_id', $row->role_id)
                ->update([$permissionPivotKey => $toId]);
        }
    }

    private function moveModelPermissionLinks(string $table, string $permissionPivotKey, int $fromId, int $toId): void
    {
        $morphKey = config('permission.column_names.model_morph_key', 'model_id');
        $teamKey = config('permission.column_names.team_foreign_key', 'team_id');
        $usesTeams = (bool) config('permission.teams', false);

        $rows = DB::table($table)
            ->where($permissionPivotKey, $fromId)
            ->get();

        foreach ($rows as $row) {
            $targetQuery = DB::table($table)
                ->where($permissionPivotKey, $toId)
                ->where('model_type', $row->model_type)
                ->where($morphKey, $row->{$morphKey});

            if ($usesTeams) {
                $targetQuery->where($teamKey, $row->{$teamKey});
            }

            if ($targetQuery->exists()) {
                $deleteQuery = DB::table($table)
                    ->where($permissionPivotKey, $fromId)
                    ->where('model_type', $row->model_type)
                    ->where($morphKey, $row->{$morphKey});

                if ($usesTeams) {
                    $deleteQuery->where($teamKey, $row->{$teamKey});
                }

                $deleteQuery->delete();

                continue;
            }

            $updateQuery = DB::table($table)
                ->where($permissionPivotKey, $fromId)
                ->where('model_type', $row->model_type)
                ->where($morphKey, $row->{$morphKey});

            if ($usesTeams) {
                $updateQuery->where($teamKey, $row->{$teamKey});
            }

            $updateQuery->update([$permissionPivotKey => $toId]);
        }
    }
};
