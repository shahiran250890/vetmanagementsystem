<?php

namespace App\Modules\Settings\Http\Controllers;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\StaffBulkRolesRequest;
use App\Http\Requests\Settings\StaffBulkStatusRequest;
use App\Http\Requests\Settings\StaffManagementRequest;
use App\Http\Requests\Settings\StaffStatusToggleRequest;
use App\Models\Nationality;
use App\Models\Role;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StaffManagementController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'user';
    }

    public function index(Request $request): InertiaResponse
    {
        $this->authorizeResourcePermission('view');

        $search = $request->string('search')->toString();
        $sort = $request->string('sort')->toString();
        $direction = strtolower($request->string('direction')->toString()) === 'desc' ? 'desc' : 'asc';
        $roleId = $request->integer('role_id') ?: null;
        $department = $request->string('department')->toString();
        $employmentStatus = $request->string('employment_status')->toString();
        $clinic = $request->string('clinic')->toString();
        $perPage = $request->integer('per_page', 10);

        return Inertia::render('settings/system/staff/index', [
            'staff' => $this->manageableStaffPaginator(
                $search,
                $sort,
                $direction,
                $roleId,
                $department,
                $employmentStatus,
                $clinic,
                $perPage
            ),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'sort' => $sort,
                'direction' => $direction,
                'role_id' => $roleId,
                'department' => $department,
                'employment_status' => $employmentStatus,
                'clinic' => $clinic,
                'per_page' => $perPage,
            ],
            'filterOptions' => $this->filterOptions(),
            'nationalities' => [],
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): InertiaResponse
    {
        $this->authorizeResourcePermission('create');

        $search = request()->string('search')->toString();
        $perPage = request()->integer('per_page', 10);

        return Inertia::render('settings/system/staff/index', [
            'staff' => $this->manageableStaffPaginator($search, '', 'asc', null, '', '', '', $perPage),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'reportingManagers' => $this->reportingManagerOptions(),
            'formMode' => 'create',
            'activeTab' => 'personal',
            'filters' => [
                'search' => $search,
                'sort' => '',
                'direction' => 'asc',
                'role_id' => null,
                'department' => '',
                'employment_status' => '',
                'clinic' => '',
                'per_page' => $perPage,
            ],
            'filterOptions' => $this->filterOptions(),
            'nationalities' => $this->nationalityOptions(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function show(Staff $managedStaff): InertiaResponse
    {
        $this->authorizeResourcePermission('view');
        $managedStaff->load(['user.roles:id,name', 'reportingManager:id,full_name,staff_number']);

        return Inertia::render('settings/system/staff/view', [
            'managedStaff' => $this->managedStaffPayload($managedStaff),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(StaffManagementRequest $request): RedirectResponse
    {
        $tab = $request->validatedTab();
        $saveAction = $this->saveActionFromRequest($request);
        if ($tab !== 'personal') {
            throw new HttpResponseException(back()->withErrors([
                'tab' => 'Create the staff profile in the Personal tab first.',
            ]));
        }

        $staff = DB::transaction(function () use ($request): Staff {
            $attrs = $this->staffAttributesFromRequest($request, 'personal');

            if ($request->string('staff_number_source')->toString() === 'auto') {
                unset($attrs['staff_number']);
                $staffRecord = Staff::query()->create(array_merge($attrs, [
                    'staff_number' => 'STF-TEMP-'.Str::uuid()->toString(),
                ]));
                $staffRecord->update([
                    'staff_number' => 'STF-'.str_pad((string) $staffRecord->id, 5, '0', STR_PAD_LEFT),
                ]);

                return $staffRecord->fresh() ?? $staffRecord;
            }

            return Staff::query()->create($attrs);
        });

        if ($saveAction === 'save') {
            return to_route('settings.system.users.index');
        }

        return to_route('settings.system.users.edit', [
            'managed_staff' => $staff->id,
            'tab' => 'employment',
        ]);
    }

    /**
     * Avoid losing index query state when redirecting from create/update.
     */
    public function edit(Request $request, Staff $managedStaff): InertiaResponse
    {
        $this->authorizeResourcePermission('update');

        $search = $request->string('search')->toString();
        $perPage = $request->integer('per_page', 10);
        $managedStaff->load(['user.roles:id,name']);

        return Inertia::render('settings/system/staff/index', [
            'staff' => $this->manageableStaffPaginator(
                $search,
                $request->string('sort')->toString(),
                strtolower($request->string('direction')->toString()) === 'desc' ? 'desc' : 'asc',
                $request->integer('role_id') ?: null,
                $request->string('department')->toString(),
                $request->string('employment_status')->toString(),
                $request->string('clinic')->toString(),
                $perPage
            ),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'reportingManagers' => $this->reportingManagerOptions($managedStaff),
            'managedStaff' => $this->managedStaffPayload($managedStaff),
            'formMode' => 'edit',
            'activeTab' => in_array($request->string('tab')->toString(), StaffManagementRequest::TABS, true)
                ? $request->string('tab')->toString()
                : 'personal',
            'filters' => [
                'search' => $search,
                'sort' => $request->string('sort')->toString(),
                'direction' => $request->string('direction')->toString(),
                'role_id' => $request->integer('role_id') ?: null,
                'department' => $request->string('department')->toString(),
                'employment_status' => $request->string('employment_status')->toString(),
                'clinic' => $request->string('clinic')->toString(),
                'per_page' => $perPage,
            ],
            'filterOptions' => $this->filterOptions(),
            'nationalities' => $this->nationalityOptions(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(StaffManagementRequest $request, Staff $managedStaff): RedirectResponse
    {
        $tab = $request->validatedTab();
        $saveAction = $this->saveActionFromRequest($request);

        DB::transaction(function () use ($request, $managedStaff, $tab): void {
            if (in_array($tab, ['personal', 'employment', 'professional', 'documents'], true)) {
                $managedStaff->update($this->staffAttributesFromRequest($request, $tab));
            }

            if ($tab === 'access') {
                $this->upsertAccessAccount($request, $managedStaff);
            }

            if ($tab === 'roles') {
                $this->syncStaffRoles($request, $managedStaff);
            }
        });

        if ($saveAction === 'save') {
            return to_route('settings.system.users.index');
        }

        return to_route('settings.system.users.edit', [
            'managed_staff' => $managedStaff->id,
            'tab' => $this->nextTabAfter($tab),
        ]);
    }

    public function destroy(Staff $managedStaff): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');

        DB::transaction(function () use ($managedStaff): void {
            $managedStaff->user?->delete();
            $managedStaff->delete();
        });

        return to_route('settings.system.users.index');
    }

    public function toggleStatus(StaffStatusToggleRequest $request, Staff $managedStaff): RedirectResponse
    {
        $user = $managedStaff->user;
        if ($user !== null) {
            $user->update([
                'is_enabled' => $request->boolean('is_enabled'),
            ]);
        }

        return to_route('settings.system.users.index');
    }

    public function bulkStatus(StaffBulkStatusRequest $request): RedirectResponse
    {
        $enabled = $request->boolean('is_enabled');

        Staff::query()
            ->whereIn('id', $request->input('staff_ids', []))
            ->manageableFor(Auth::id())
            ->with('user')
            ->get()
            ->each(function (Staff $staff) use ($enabled): void {
                if ($staff->user !== null) {
                    $staff->user->update(['is_enabled' => $enabled]);
                }
            });

        return to_route('settings.system.users.index');
    }

    public function bulkRoles(StaffBulkRolesRequest $request): RedirectResponse
    {
        $replace = $request->boolean('replace_existing');
        $roleIds = $request->input('role_ids', []);

        Staff::query()
            ->whereIn('id', $request->input('staff_ids', []))
            ->manageableFor(Auth::id())
            ->with('user.roles:id,name')
            ->get()
            ->each(function (Staff $staff) use ($replace, $roleIds): void {
                $user = $staff->user;
                if ($user === null) {
                    return;
                }

                $roleModels = Role::query()->whereIn('id', $roleIds)->get();

                if ($replace || $roleIds === []) {
                    $user->syncRoles($roleModels);

                    return;
                }

                $mergedIds = collect($user->roles->pluck('id'))
                    ->merge($roleIds)
                    ->unique()
                    ->values()
                    ->all();
                $mergedRoles = Role::query()->whereIn('id', $mergedIds)->get();
                $user->syncRoles($mergedRoles);
            });

        return to_route('settings.system.users.index');
    }

    public function exportCsv(Request $request): StreamedResponse|RedirectResponse
    {
        $this->authorizeResourcePermission('view');

        $search = $request->string('search')->toString();
        $sort = $request->string('sort')->toString();
        $direction = strtolower($request->string('direction')->toString()) === 'desc' ? 'desc' : 'asc';
        $roleId = $request->integer('role_id') ?: null;
        $department = $request->string('department')->toString();
        $employmentStatus = $request->string('employment_status')->toString();
        $clinic = $request->string('clinic')->toString();

        $query = $this->manageableStaffBaseQuery(
            $search,
            $sort,
            $direction,
            $roleId,
            $department,
            $employmentStatus,
            $clinic
        )->with(['user.roles:id,name']);

        $filename = 'staff-directory-'.now()->format('Y-m-d-His').'.csv';

        return response()->streamDownload(function () use ($query): void {
            $handle = fopen('php://output', 'w');
            if ($handle === false) {
                return;
            }

            fputcsv($handle, [
                'Staff number',
                'Full name',
                'IC/Passport',
                'Position',
                'Department',
                'Medical reg. no.',
                'Mobile',
                'Email',
                'Clinics',
                'Login',
                'Employment status',
                'Roles',
            ]);

            $query->chunk(100, function (Collection $chunk) use ($handle): void {
                foreach ($chunk as $staffRow) {
                    /** @var Staff $staffRow */
                    $loginStatus = $staffRow->user === null
                        ? 'No account'
                        : ($staffRow->user->is_enabled ? 'Enabled' : 'Disabled');

                    $clinics = '';
                    if (is_array($staffRow->assigned_clinics)) {
                        $clinics = implode('; ', $staffRow->assigned_clinics);
                    }

                    fputcsv($handle, [
                        $staffRow->staff_number,
                        $staffRow->full_name,
                        $staffRow->nric_passport ?? '',
                        $staffRow->position ?? '',
                        $staffRow->department ?? '',
                        $staffRow->medical_registration_number ?? '',
                        $staffRow->mobile_number ?? '',
                        $staffRow->email ?? '',
                        $clinics,
                        $loginStatus,
                        $staffRow->employment_status,
                        $staffRow->user
                            ? $staffRow->user->roles->pluck('name')->implode(', ')
                            : '',
                    ]);
                }
            });

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Printable HTML used with browser Print → Save as PDF.
     */
    public function exportPdf(Request $request): Response
    {
        $this->authorizeResourcePermission('view');

        $search = $request->string('search')->toString();
        $sort = $request->string('sort')->toString();
        $direction = strtolower($request->string('direction')->toString()) === 'desc' ? 'desc' : 'asc';
        $roleId = $request->integer('role_id') ?: null;
        $department = $request->string('department')->toString();
        $employmentStatus = $request->string('employment_status')->toString();
        $clinic = $request->string('clinic')->toString();

        $rows = $this->manageableStaffBaseQuery(
            $search,
            $sort,
            $direction,
            $roleId,
            $department,
            $employmentStatus,
            $clinic
        )->with(['user.roles:id,name'])->limit(500)->get();

        return response()->view('exports.staff-directory-print', [
            'staffRows' => $rows,
            'generatedAt' => now()->toDateTimeString(),
        ]);
    }

    /**
     * @return list<array{id: int, name: string, iso3166_alpha2: string|null}>
     */
    private function nationalityOptions(): array
    {
        return Nationality::query()
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'iso3166_alpha2'])
            ->map(fn (Nationality $nationality): array => [
                'id' => $nationality->id,
                'name' => $nationality->name,
                'iso3166_alpha2' => $nationality->iso3166_alpha2,
            ])
            ->all();
    }

    /**
     * @return list<array{id: int, full_name: string, staff_number: string}>
     */
    private function reportingManagerOptions(?Staff $exclude = null): array
    {
        return Staff::query()
            ->manageableFor(Auth::id())
            ->when($exclude !== null, fn (Builder $query) => $query->where('id', '!=', $exclude->id))
            ->orderBy('full_name')
            ->get(['id', 'full_name', 'staff_number'])
            ->map(fn (Staff $staff): array => [
                'id' => $staff->id,
                'full_name' => $staff->full_name,
                'staff_number' => $staff->staff_number,
            ])
            ->all();
    }

    /**
     * @return array{departments: list<string>, clinics: list<string>}
     */
    private function filterOptions(): array
    {
        $departments = Staff::query()
            ->manageableFor(Auth::id())
            ->whereNotNull('department')
            ->distinct()
            ->orderBy('department')
            ->pluck('department')
            ->filter()
            ->values()
            ->all();

        $clinicLabels = Staff::query()
            ->manageableFor(Auth::id())
            ->whereNotNull('assigned_clinics')
            ->pluck('assigned_clinics');

        $clinics = collect($clinicLabels)
            ->flatten()
            ->filter()
            ->unique()
            ->sort()
            ->values()
            ->all();

        return [
            'departments' => $departments,
            'clinics' => $clinics,
        ];
    }

    private function manageableStaffPaginator(
        string $search,
        string $sort,
        string $direction,
        ?int $roleId,
        string $department,
        string $employmentStatus,
        string $clinic,
        int $perPage
    ): LengthAwarePaginator {
        $paginator = $this->manageableStaffBaseQuery(
            $search,
            $sort,
            $direction,
            $roleId,
            $department,
            $employmentStatus,
            $clinic
        )
            ->with(['user.roles:id,name'])
            ->paginate($perPage)
            ->withQueryString();

        $paginator->setCollection(
            $paginator->getCollection()->map(fn (Staff $staff): array => $this->managedStaffPayload($staff))
        );

        return $paginator;
    }

    /**
     * @return Builder<Staff>
     */
    private function manageableStaffBaseQuery(
        string $search,
        string $sort,
        string $direction,
        ?int $roleId,
        string $department,
        string $employmentStatus,
        string $clinic
    ): Builder {
        $query = Staff::query()
            ->manageableFor(Auth::id());

        if ($search !== '') {
            $query->where(function (Builder $sub) use ($search): void {
                $sub->where('full_name', 'like', "%{$search}%")
                    ->orWhere('staff_number', 'like', "%{$search}%")
                    ->orWhere('nric_passport', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhereHas('user', fn (Builder $uq) => $uq->where('email', 'like', "%{$search}%"));
            });
        }

        if ($roleId !== null) {
            $query->whereHas('user', function (Builder $uq) use ($roleId): void {
                $uq->whereHas('roles', fn (Builder $rq) => $rq->where('roles.id', $roleId));
            });
        }

        if ($department !== '') {
            $query->where('department', $department);
        }

        if ($employmentStatus !== '') {
            $query->where('employment_status', $employmentStatus);
        }

        if ($clinic !== '') {
            $query->whereJsonContains('assigned_clinics', $clinic);
        }

        $sortColumn = match ($sort) {
            'staff_number', 'full_name', 'department', 'employment_status', 'position', 'created_at' => $sort,
            default => 'created_at',
        };

        return $query->orderBy($sortColumn, $direction);
    }

    /**
     * @return array<string, mixed>
     */
    private function staffAttributesFromRequest(StaffManagementRequest $request, string $tab): array
    {
        $allAttributes = [
            'staff_number' => $request->string('staff_number')->toString(),
            'full_name' => $request->string('full_name')->toString(),
            'preferred_name' => $request->string('preferred_name')->toString(),
            'nric_passport' => $request->string('nric_passport')->toString(),
            'gender' => $request->string('gender')->toString(),
            'date_of_birth' => $request->date('date_of_birth'),
            'nationality' => $request->string('nationality')->toString(),
            'marital_status' => $request->string('marital_status')->toString(),
            'photo_path' => $request->string('photo_path')->toString(),
            'mobile_number' => $request->string('mobile_number')->toString(),
            'alternate_phone' => $request->string('alternate_phone')->toString(),
            'email' => $request->string('email')->toString(),
            'address_line_1' => $request->string('address_line_1')->toString(),
            'address_line_2' => $request->string('address_line_2')->toString(),
            'city' => $request->string('city')->toString(),
            'state' => $request->string('state')->toString(),
            'postcode' => $request->string('postcode')->toString(),
            'country' => $request->string('country')->toString(),
            'emergency_contact_name' => $request->string('emergency_contact_name')->toString(),
            'emergency_contact_phone' => $request->string('emergency_contact_phone')->toString(),
            'employee_number' => $request->string('employee_number')->toString(),
            'hire_date' => $request->date('hire_date'),
            'confirmation_date' => $request->date('confirmation_date'),
            'position' => $request->string('position')->toString(),
            'department' => $request->string('department')->toString(),
            'reporting_manager_id' => $request->integer('reporting_manager_id') ?: null,
            'employment_type' => $request->string('employment_type')->toString(),
            'salary_type' => $request->string('salary_type')->toString(),
            'assigned_clinics' => $request->input('assigned_clinics'),
            'working_hours' => $request->string('working_hours')->toString(),
            'employment_status' => $request->string('employment_status')->toString(),
            'is_active' => $request->boolean('is_active'),
            'medical_registration_number' => $request->string('medical_registration_number')->toString(),
            'apc_number' => $request->string('apc_number')->toString(),
            'apc_expiry_date' => $request->date('apc_expiry_date'),
            'specialization' => $request->string('specialization')->toString(),
            'qualifications' => $request->string('qualifications')->toString(),
            'years_experience' => $request->filled('years_experience') ? $request->integer('years_experience') : null,
            'documents' => $request->input('documents'),
        ];

        $allowedByTab = [
            'personal' => [
                'staff_number',
                'full_name',
                'preferred_name',
                'nric_passport',
                'gender',
                'date_of_birth',
                'nationality',
                'marital_status',
                'photo_path',
                'mobile_number',
                'alternate_phone',
                'email',
                'address_line_1',
                'address_line_2',
                'city',
                'state',
                'postcode',
                'country',
                'emergency_contact_name',
                'emergency_contact_phone',
            ],
            'employment' => [
                'employee_number',
                'hire_date',
                'confirmation_date',
                'position',
                'department',
                'reporting_manager_id',
                'employment_type',
                'salary_type',
                'assigned_clinics',
                'working_hours',
                'employment_status',
                'is_active',
            ],
            'professional' => [
                'medical_registration_number',
                'apc_number',
                'apc_expiry_date',
                'specialization',
                'qualifications',
                'years_experience',
            ],
            'documents' => ['documents'],
        ];

        $allowed = $allowedByTab[$tab] ?? [];

        return array_intersect_key($allAttributes, array_flip($allowed));
    }

    private function upsertAccessAccount(StaffManagementRequest $request, Staff $managedStaff): void
    {
        if ($request->boolean('enable_login')) {
            $user = $managedStaff->user;
            if ($user === null) {
                User::query()->create([
                    'staff_id' => $managedStaff->id,
                    'name' => $managedStaff->full_name,
                    'email' => $request->string('account_email')->toString(),
                    'phone' => $managedStaff->mobile_number,
                    'mmc_registration_number' => $managedStaff->medical_registration_number,
                    'is_enabled' => $request->boolean('is_enabled'),
                    'password' => Hash::make($request->string('password')->toString()),
                ]);
            } else {
                $payload = [
                    'name' => $managedStaff->full_name,
                    'email' => $request->string('account_email')->toString(),
                    'phone' => $managedStaff->mobile_number,
                    'mmc_registration_number' => $managedStaff->medical_registration_number,
                    'is_enabled' => $request->boolean('is_enabled'),
                ];
                if ($request->filled('password')) {
                    $payload['password'] = Hash::make($request->string('password')->toString());
                }
                $user->update($payload);
            }

            return;
        }

        if ($managedStaff->user !== null) {
            $managedStaff->user->update([
                'name' => $managedStaff->full_name,
                'phone' => $managedStaff->mobile_number,
                'mmc_registration_number' => $managedStaff->medical_registration_number,
                'is_enabled' => false,
            ]);
        }
    }

    private function syncStaffRoles(StaffManagementRequest $request, Staff $managedStaff): void
    {
        $managedStaff->load('user');
        $managedStaff->user?->syncRoles($request->input('role_ids', []));
    }

    private function saveActionFromRequest(StaffManagementRequest $request): string
    {
        return $request->string('save_action')->toString() === 'save' ? 'save' : 'continue';
    }

    private function nextTabAfter(string $tab): string
    {
        $orderedTabs = StaffManagementRequest::TABS;
        $index = array_search($tab, $orderedTabs, true);
        if ($index === false) {
            return 'personal';
        }

        return $orderedTabs[$index + 1] ?? $tab;
    }

    /**
     * @return array<string, mixed>
     */
    private function managedStaffPayload(Staff $staff): array
    {
        $staff->loadMissing(['user.roles:id,name', 'reportingManager:id,full_name,staff_number']);

        $user = $staff->user;

        return [
            'id' => $staff->id,
            'staff_number' => $staff->staff_number,
            'full_name' => $staff->full_name,
            'preferred_name' => $staff->preferred_name,
            'nric_passport' => $staff->nric_passport,
            'gender' => $staff->gender,
            'date_of_birth' => $staff->date_of_birth?->format('Y-m-d'),
            'nationality' => $staff->nationality,
            'marital_status' => $staff->marital_status,
            'photo_path' => $staff->photo_path,
            'mobile_number' => $staff->mobile_number,
            'alternate_phone' => $staff->alternate_phone,
            'email' => $staff->email,
            'address_line_1' => $staff->address_line_1,
            'address_line_2' => $staff->address_line_2,
            'city' => $staff->city,
            'state' => $staff->state,
            'postcode' => $staff->postcode,
            'country' => $staff->country,
            'emergency_contact_name' => $staff->emergency_contact_name,
            'emergency_contact_phone' => $staff->emergency_contact_phone,
            'employee_number' => $staff->employee_number,
            'hire_date' => $staff->hire_date?->format('Y-m-d'),
            'confirmation_date' => $staff->confirmation_date?->format('Y-m-d'),
            'position' => $staff->position,
            'department' => $staff->department,
            'reporting_manager_id' => $staff->reporting_manager_id,
            'reporting_manager' => $staff->reportingManager
                ? [
                    'id' => $staff->reportingManager->id,
                    'full_name' => $staff->reportingManager->full_name,
                    'staff_number' => $staff->reportingManager->staff_number,
                ]
                : null,
            'employment_type' => $staff->employment_type,
            'salary_type' => $staff->salary_type,
            'assigned_clinics' => $staff->assigned_clinics ?? [],
            'working_hours' => $staff->working_hours,
            'employment_status' => $staff->employment_status,
            'is_active' => $staff->is_active,
            'medical_registration_number' => $staff->medical_registration_number,
            'apc_number' => $staff->apc_number,
            'apc_expiry_date' => $staff->apc_expiry_date?->format('Y-m-d'),
            'specialization' => $staff->specialization,
            'qualifications' => $staff->qualifications,
            'years_experience' => $staff->years_experience,
            'documents' => $staff->documents ?? [],
            'roles' => $user
                ? $user->roles->map(fn ($role) => ['id' => $role->id, 'name' => $role->name])->values()->all()
                : [],
            'enable_login' => $user !== null,
            'account_email' => $user?->email,
            'is_enabled' => $user?->is_enabled ?? false,
            'two_factor_confirmed_at' => $user?->two_factor_confirmed_at?->toIso8601String(),
            'created_at' => $staff->created_at?->toIso8601String(),
            'updated_at' => $staff->updated_at?->toIso8601String(),
            'user_id' => $user?->id,
            'completed_tabs' => $this->completedTabsForStaff($staff),
        ];
    }

    /**
     * @return array<int, string>
     */
    private function completedTabsForStaff(Staff $staff): array
    {
        $tabs = ['personal'];

        if (
            $staff->employee_number !== null
            || $staff->hire_date !== null
            || $staff->position !== null
            || $staff->department !== null
            || $staff->employment_type !== null
            || $staff->salary_type !== null
            || ($staff->assigned_clinics !== null && $staff->assigned_clinics !== [])
            || $staff->working_hours !== null
        ) {
            $tabs[] = 'employment';
        }

        if (
            $staff->medical_registration_number !== null
            || $staff->apc_number !== null
            || $staff->apc_expiry_date !== null
            || $staff->specialization !== null
            || $staff->qualifications !== null
            || $staff->years_experience !== null
        ) {
            $tabs[] = 'professional';
        }

        if ($staff->user !== null) {
            $tabs[] = 'access';
        }

        if ($staff->user !== null && $staff->user->roles->isNotEmpty()) {
            $tabs[] = 'roles';
        }

        if (is_array($staff->documents) && $staff->documents !== []) {
            $tabs[] = 'documents';
        }

        return array_values(array_unique($tabs));
    }
}
