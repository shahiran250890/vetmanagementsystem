import type { FormDataConvertible } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import {
    Briefcase,
    CheckCircle2,
    ClipboardList,
    FileStack,
    FolderOpen,
    Shield,
    UserCircle,
} from 'lucide-react';
import type { FormEvent, ReactElement } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { z } from 'zod';

import type { NationalityOption } from '@/components/address-fields';
import { BlockingLoadingOverlay } from '@/components/blocking-loading-overlay';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { queueAfterPaint } from '@/lib/queue-after-paint';
import { staffSaveErrorAlert, staffSaveSuccessAlert } from '@/lib/staff-swal';
import { stripUndefinedPayload } from '@/lib/strip-undefined-payload';
import { cn } from '@/lib/utils';
import { zodIssuesToDotRecord } from '@/lib/zod-error-map';
import usersRoutes from '@/routes/settings/system/users';

import { parseStaffFormData } from '../lib/parse-staff-form-data';
import type { StaffFormParsed } from '../lib/parse-staff-form-data';
import { createStaffManagementSchema } from '../lib/staff-form-schema';
import { isStaffFormTabSelectable } from '../lib/staff-form-tab-policy';
import type { StaffMember } from '../types';

import { AccountStatusBadge } from './account-status-badge';
import { ContactSection } from './contact-section';
import { DocumentsSection } from './documents-section';
import type { ReportingManagerOption } from './employment-section';
import { EmploymentSection } from './employment-section';
import { PersonalInformationSection } from './personal-information-section';
import { ProfessionalSection } from './professional-section';
import { RolePermissionSection } from './role-permission-section';
import { ScheduleSection } from './schedule-section';
import { StickyStaffActionBar } from './sticky-staff-action-bar';
import { UserAccountSection } from './user-account-section';


type Role = { id: number; name: string };
type SubmitAction = 'save' | 'continue';

const TABS = [
    { id: 'personal', label: 'Personal', icon: UserCircle },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'professional', label: 'Professional', icon: ClipboardList },
    { id: 'access', label: 'System access', icon: Shield },
    { id: 'roles', label: 'Roles', icon: FolderOpen },
    { id: 'documents', label: 'Documents', icon: FileStack },
] as const;

type TabId = (typeof TABS)[number]['id'];

const TAB_VALIDATION_FIELDS: Record<TabId, (keyof StaffFormParsed)[]> = {
    personal: [
        'staff_number_source',
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
    employment: [
        'employee_number',
        'hire_date',
        'confirmation_date',
        'position',
        'department',
        'reporting_manager_id',
        'employment_type',
        'salary_type',
        'assigned_clinics_text',
        'working_hours',
        'employment_status',
        'is_active',
    ],
    professional: ['medical_registration_number', 'apc_number', 'apc_expiry_date', 'specialization', 'qualifications', 'years_experience'],
    access: ['enable_login', 'account_email', 'is_enabled', 'password', 'password_confirmation'],
    roles: ['role_ids'],
    documents: ['documents_metadata'],
};

const FIELD_TAB_MAP: Record<string, TabId> = Object.entries(TAB_VALIDATION_FIELDS).reduce<Record<string, TabId>>(
    (carry, [tab, fields]) => {
        const tabId = tab as TabId;

        for (const field of fields) {
            carry[field] = tabId;
        }

        return carry;
    },
    {},
);

const CREATE_FLOW_DISABLED_TAB_TITLE =
    'Create the staff record first. Other sections are available when editing this profile.';

function normalizePageErrors(raw: unknown): Record<string, string> {
    if (!raw || typeof raw !== 'object') {
        return {};
    }

    const out: Record<string, string> = {};

    for (const [key, value] of Object.entries(raw)) {
        if (typeof value === 'string') {
            out[key] = value;
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
            out[key] = value[0];
        }
    }

    return out;
}

function inferTabForErrorField(errorField: string): TabId {
    const [rootField] = errorField.split('.');

    return FIELD_TAB_MAP[rootField] ?? 'personal';
}

function StaffFormTabs({
    activeTab,
    isEdit,
    completedTabs,
    onActiveTabChange,
}: {
    activeTab: TabId;
    isEdit: boolean;
    completedTabs: Set<TabId>;
    onActiveTabChange: (tab: TabId) => void;
}): ReactElement {
    const isCreateWithPersonalTabOnly = !isEdit;

    return (
        <div className="space-y-2 border-b pb-3">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Staff form sections">
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    const selectable = isStaffFormTabSelectable(tab.id, isEdit);
                    const completed = completedTabs.has(tab.id);

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            id={`staff-form-tab-${tab.id}`}
                            disabled={!selectable}
                            title={selectable ? undefined : CREATE_FLOW_DISABLED_TAB_TITLE}
                            onClick={() => onActiveTabChange(tab.id)}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                active
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted/60 text-muted-foreground hover:bg-muted',
                                !selectable && 'cursor-not-allowed opacity-50',
                            )}
                        >
                            <Icon className="size-4 opacity-90" aria-hidden />
                            {tab.label}
                            {completed ? <CheckCircle2 className="size-4" aria-hidden /> : null}
                        </button>
                    );
                })}
            </div>
            {isCreateWithPersonalTabOnly ? (
                <p className="text-muted-foreground text-xs">
                    Employment, professional details, system access, roles, and documents are available after you create
                    this staff member — open their profile again to complete those sections.
                </p>
            ) : null}
        </div>
    );
}

export function StaffForm({
    isEdit,
    managedStaff,
    roles,
    reportingManagers,
    nationalities,
    formAction,
    formMethod,
    initialActiveTab,
    formatRoleName,
}: {
    isEdit: boolean;
    managedStaff?: StaffMember;
    roles: Role[];
    reportingManagers: ReportingManagerOption[];
    nationalities: NationalityOption[];
    formAction: string;
    formMethod: 'post' | 'put';
    initialActiveTab?: string;
    formatRoleName: (roleName: string) => string;
}) {
    const page = usePage<{ errors?: Record<string, unknown> }>();
    const visitOutcomeRef = useRef<'success' | 'error' | null>(null);
    const serverErrors = useMemo(() => normalizePageErrors(page.props.errors), [page.props.errors]);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const [submitAction, setSubmitAction] = useState<SubmitAction>('continue');

    const mergedErrors = useMemo(
        () => ({ ...serverErrors, ...clientErrors }),
        [serverErrors, clientErrors],
    );

    const normalizeTab = (tab: string | undefined): TabId =>
        TABS.some((item) => item.id === tab) ? (tab as TabId) : 'personal';
    const [activeTab, setActiveTab] = useState<TabId>(normalizeTab(initialActiveTab));
    const [completedTabs, setCompletedTabs] = useState<Set<TabId>>(
        new Set((managedStaff?.completed_tabs ?? ['personal']).filter((tab): tab is TabId => TABS.some((item) => item.id === tab))),
    );
    /** Create flow only shows Personal; ignore stored tab until the record is being edited. */
    const visibleTab: TabId = isEdit ? activeTab : 'personal';

    const [isActive, setIsActive] = useState(managedStaff?.is_active ?? true);
    const [isEnabled, setIsEnabled] = useState(managedStaff?.is_enabled ?? true);
    const [enableLogin, setEnableLogin] = useState(managedStaff?.enable_login ?? true);
    const [showPasswordFields, setShowPasswordFields] = useState(!isEdit);

    /* eslint-disable react-hooks/set-state-in-effect -- sync local UI state when Inertia props change after navigation */
    useEffect(() => {
        setActiveTab(normalizeTab(initialActiveTab));
    }, [initialActiveTab]);

    useEffect(() => {
        setCompletedTabs(
            new Set(
                (managedStaff?.completed_tabs ?? ['personal']).filter((tab): tab is TabId =>
                    TABS.some((item) => item.id === tab),
                ),
            ),
        );
    }, [managedStaff?.completed_tabs]);
    /* eslint-enable react-hooks/set-state-in-effect */

    const schemaContext = useMemo(
        () => ({
            mode: isEdit ? ('edit' as const) : ('create' as const),
            doctorRoleIds: roles.filter((r) => r.name.toLowerCase() === 'doctor').map((r) => r.id),
            hasLinkedUser: Boolean(managedStaff?.user_id),
            managedStaffId: managedStaff?.id,
        }),
        [isEdit, roles, managedStaff?.user_id, managedStaff?.id],
    );

    const schema = useMemo(() => createStaffManagementSchema(schemaContext), [schemaContext]);

    const validateTabPayload = (
        tab: TabId,
        parsed: StaffFormParsed,
    ): { success: true } | { success: false } => {
        const result = schema.safeParse(parsed);

        if (result.success) {
            setClientErrors({});

            return { success: true };
        }

        const allowedFields = new Set<string>(TAB_VALIDATION_FIELDS[tab]);
        const scopedIssues = result.error.issues.filter((issue) => {
            const [firstPathSegment] = issue.path;

            return typeof firstPathSegment === 'string' && allowedFields.has(firstPathSegment);
        });

        if (scopedIssues.length > 0) {
            setClientErrors(zodIssuesToDotRecord(new z.ZodError(scopedIssues)));

            return { success: false };
        }

        setClientErrors({});

        return { success: true };
    };

    const submitTab = (event: FormEvent<HTMLFormElement>, tab: TabId): void => {
        event.preventDefault();
        const parsed = parseStaffFormData(new FormData(event.currentTarget));
        const validation = validateTabPayload(tab, parsed);

        if (!validation.success) {
            return;
        }

        const scopedPayload: Record<string, FormDataConvertible | undefined> = {
            tab,
            save_action: submitAction,
        };

        for (const field of TAB_VALIDATION_FIELDS[tab]) {
            scopedPayload[field] = parsed[field];
        }

        const payload = stripUndefinedPayload(scopedPayload);

        setProcessing(true);
        visitOutcomeRef.current = null;

        const visitOptions = {
            preserveScroll: true,
            preserveState: false,
            onError: (errors: unknown): void => {
                visitOutcomeRef.current = 'error';

                if (!isEdit) {
                    return;
                }

                const normalizedErrors = normalizePageErrors(errors);
                const firstErrorField = Object.keys(normalizedErrors)[0];

                if (firstErrorField) {
                    setActiveTab(inferTabForErrorField(firstErrorField));
                }
            },
            onSuccess: (): void => {
                visitOutcomeRef.current = 'success';
                setCompletedTabs((previous) => new Set(previous).add(tab));
            },
            onFinish: (): void => {
                setProcessing(false);
                const outcome = visitOutcomeRef.current;
                visitOutcomeRef.current = null;

                if (outcome === 'success') {
                    queueAfterPaint(() => {
                        void staffSaveSuccessAlert({ isEdit, saveAction: submitAction });
                    });
                } else if (outcome === 'error') {
                    queueAfterPaint(() => {
                        void staffSaveErrorAlert();
                    });
                }
            },
        };

        if (formMethod === 'put') {
            router.put(formAction, payload, visitOptions);
        } else {
            router.post(formAction, payload, visitOptions);
        }
    };

    const handlePersonalSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'personal');
    };

    const handleEmploymentSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'employment');
    };

    const handleProfessionalSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'professional');
    };

    const handleAccessSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'access');
    };

    const handleRolesSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'roles');
    };

    const handleDocumentsSubmit = (event: FormEvent<HTMLFormElement>): void => {
        submitTab(event, 'documents');
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        if (!isEdit) {
            handlePersonalSubmit(event);

            return;
        }

        const handlers: Record<TabId, (submitEvent: FormEvent<HTMLFormElement>) => void> = {
            personal: handlePersonalSubmit,
            employment: handleEmploymentSubmit,
            professional: handleProfessionalSubmit,
            access: handleAccessSubmit,
            roles: handleRolesSubmit,
            documents: handleDocumentsSubmit,
        };

        handlers[visibleTab](event);
    };

    return (
        <form
            key={`staff-form-${managedStaff?.id ?? 'new'}-${isEdit ? 'edit' : 'create'}`}
            onSubmit={handleSubmit}
            noValidate
            className={cn(formPageSurfaceClassName, 'space-y-6')}
        >
            <BlockingLoadingOverlay
                open={processing}
                title={
                    !isEdit
                        ? 'Creating staff record…'
                        : submitAction === 'save'
                          ? 'Saving staff record…'
                          : 'Saving section…'
                }
                description="Please keep this tab open until the process finishes."
            />
            <StaffFormTabs
                activeTab={visibleTab}
                isEdit={isEdit}
                completedTabs={completedTabs}
                onActiveTabChange={setActiveTab}
            />

            <div className="space-y-6">
                <section hidden={visibleTab !== 'personal'} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">Personal information</h3>
                        <p className="text-muted-foreground text-sm">Identity and demographics</p>
                    </div>
                    <PersonalInformationSection
                        isEdit={isEdit}
                        managedStaff={managedStaff}
                        errors={mergedErrors}
                        nationalities={nationalities}
                    />
                    <div className="border-t pt-6">
                        <h4 className="mb-4 font-medium">Contact</h4>
                        <ContactSection
                            managedStaff={managedStaff}
                            errors={mergedErrors}
                            nationalities={nationalities}
                        />
                    </div>
                </section>

                <section hidden={visibleTab !== 'employment'} className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">Employment</h3>
                        <p className="text-muted-foreground text-sm">Role in the organization</p>
                    </div>
                    <EmploymentSection
                        managedStaff={managedStaff}
                        reportingManagers={reportingManagers}
                        errors={mergedErrors}
                        isActive={isActive}
                        onIsActiveChange={setIsActive}
                    />
                    <div className="border-t pt-6">
                        <h4 className="mb-4 font-medium">Schedule</h4>
                        <ScheduleSection managedStaff={managedStaff} />
                    </div>
                </section>

                <section hidden={visibleTab !== 'professional'} className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Professional credentials</h3>
                        <p className="text-muted-foreground text-sm">Required for clinical roles such as doctors</p>
                    </div>
                    <ProfessionalSection managedStaff={managedStaff} errors={mergedErrors} />
                </section>

                <section hidden={visibleTab !== 'access'} className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-lg font-semibold">System access</h3>
                            <p className="text-muted-foreground text-sm">Optional login linked to this staff record</p>
                        </div>
                        {managedStaff && (
                            <AccountStatusBadge enableLogin={managedStaff.enable_login} isEnabled={managedStaff.is_enabled} />
                        )}
                    </div>
                    <UserAccountSection
                        managedStaff={managedStaff}
                        errors={mergedErrors}
                        enableLogin={enableLogin}
                        onEnableLoginChange={setEnableLogin}
                        isEnabled={isEnabled}
                        onIsEnabledChange={setIsEnabled}
                        showPasswordFields={showPasswordFields}
                        onTogglePasswordFields={() => setShowPasswordFields((v) => !v)}
                    />
                </section>

                <section hidden={visibleTab !== 'roles'} className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Roles & permissions</h3>
                        <p className="text-muted-foreground text-sm">Spatie roles for users with a login account</p>
                    </div>
                    <RolePermissionSection roles={roles} managedStaff={managedStaff} formatRoleName={formatRoleName} />
                </section>

                <section hidden={visibleTab !== 'documents'} className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold">Documents</h3>
                        <p className="text-muted-foreground text-sm">Attachments and compliance files</p>
                    </div>
                    <DocumentsSection managedStaff={managedStaff} />
                </section>
            </div>

            <InputError message={mergedErrors.enable_login} />

            <StickyStaffActionBar
                processing={processing}
                activeSubmitAction={submitAction}
                backHref={usersRoutes.index.url()}
                onSaveClick={() => setSubmitAction('save')}
                onSaveContinueClick={() => setSubmitAction('continue')}
            />
        </form>
    );
}
