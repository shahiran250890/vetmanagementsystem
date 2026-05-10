import { Form } from '@inertiajs/react';
import {
    Briefcase,
    ClipboardList,
    FileStack,
    FolderOpen,
    Shield,
    UserCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import type { NationalityOption } from '@/components/address-fields';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import usersRoutes from '@/routes/settings/system/users';
import { cn } from '@/lib/utils';

import { AccountStatusBadge } from './account-status-badge';
import { ContactSection } from './contact-section';
import { DocumentsSection } from './documents-section';
import { EmploymentSection } from './employment-section';
import { PersonalInformationSection } from './personal-information-section';
import { ProfessionalSection } from './professional-section';
import { RolePermissionSection } from './role-permission-section';
import { ScheduleSection } from './schedule-section';
import { StickyStaffActionBar } from './sticky-staff-action-bar';
import { UserAccountSection } from './user-account-section';

import type { ReportingManagerOption } from './employment-section';
import type { StaffMember } from '../types';

type Role = { id: number; name: string };

const TABS = [
    { id: 'personal', label: 'Personal', icon: UserCircle },
    { id: 'employment', label: 'Employment', icon: Briefcase },
    { id: 'professional', label: 'Professional', icon: ClipboardList },
    { id: 'access', label: 'System access', icon: Shield },
    { id: 'roles', label: 'Roles', icon: FolderOpen },
    { id: 'documents', label: 'Documents', icon: FileStack },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function StaffForm({
    isEdit,
    managedStaff,
    roles,
    reportingManagers,
    nationalities,
    formAction,
    formMethod,
    formatRoleName,
}: {
    isEdit: boolean;
    managedStaff?: StaffMember;
    roles: Role[];
    reportingManagers: ReportingManagerOption[];
    nationalities: NationalityOption[];
    formAction: string;
    formMethod: 'post' | 'put';
    formatRoleName: (roleName: string) => string;
}) {
    const [activeTab, setActiveTab] = useState<TabId>('personal');
    const [isActive, setIsActive] = useState(managedStaff?.is_active ?? true);
    const [isEnabled, setIsEnabled] = useState(managedStaff?.is_enabled ?? true);
    const [enableLogin, setEnableLogin] = useState(managedStaff?.enable_login ?? true);
    const [showPasswordFields, setShowPasswordFields] = useState(!isEdit);

    useEffect(() => {
        setIsActive(managedStaff?.is_active ?? true);
    }, [managedStaff?.id, managedStaff?.is_active]);

    useEffect(() => {
        setIsEnabled(managedStaff?.is_enabled ?? true);
    }, [managedStaff?.id, managedStaff?.is_enabled]);

    useEffect(() => {
        setEnableLogin(managedStaff?.enable_login ?? true);
    }, [managedStaff?.id, managedStaff?.enable_login]);

    useEffect(() => {
        setShowPasswordFields(!isEdit);
    }, [isEdit, managedStaff?.id]);

    return (
        <Form
            action={formAction}
            method={formMethod}
            noValidate
            className={cn(formPageSurfaceClassName, 'space-y-6')}
        >
            {({ errors, processing }) => (
                <>
                    <div className="flex flex-wrap gap-2 border-b pb-3">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const active = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                        active
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted/60 text-muted-foreground hover:bg-muted',
                                    )}
                                >
                                    <Icon className="size-4 opacity-90" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="space-y-6">
                        {activeTab === 'personal' && (
                            <section className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold">Personal information</h3>
                                    <p className="text-muted-foreground text-sm">Identity and demographics</p>
                                </div>
                                <PersonalInformationSection
                                    isEdit={isEdit}
                                    managedStaff={managedStaff}
                                    errors={errors as Record<string, string>}
                                />
                                <div className="border-t pt-6">
                                    <h4 className="mb-4 font-medium">Contact</h4>
                                    <ContactSection
                                        managedStaff={managedStaff}
                                        errors={errors as Record<string, string>}
                                        nationalities={nationalities}
                                    />
                                </div>
                            </section>
                        )}

                        {activeTab === 'employment' && (
                            <section className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold">Employment</h3>
                                    <p className="text-muted-foreground text-sm">Role in the organization</p>
                                </div>
                                <EmploymentSection
                                    managedStaff={managedStaff}
                                    reportingManagers={reportingManagers}
                                    errors={errors as Record<string, string>}
                                    isActive={isActive}
                                    onIsActiveChange={setIsActive}
                                />
                                <div className="border-t pt-6">
                                    <h4 className="mb-4 font-medium">Schedule</h4>
                                    <ScheduleSection managedStaff={managedStaff} />
                                </div>
                            </section>
                        )}

                        {activeTab === 'professional' && (
                            <section className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Professional credentials</h3>
                                    <p className="text-muted-foreground text-sm">Required for clinical roles such as doctors</p>
                                </div>
                                <ProfessionalSection managedStaff={managedStaff} errors={errors as Record<string, string>} />
                            </section>
                        )}

                        {activeTab === 'access' && (
                            <section className="space-y-4">
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
                                    errors={errors as Record<string, string>}
                                    enableLogin={enableLogin}
                                    onEnableLoginChange={setEnableLogin}
                                    isEnabled={isEnabled}
                                    onIsEnabledChange={setIsEnabled}
                                    showPasswordFields={showPasswordFields}
                                    onTogglePasswordFields={() => setShowPasswordFields((v) => !v)}
                                />
                            </section>
                        )}

                        {activeTab === 'roles' && (
                            <section className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Roles & permissions</h3>
                                    <p className="text-muted-foreground text-sm">Spatie roles for users with a login account</p>
                                </div>
                                <RolePermissionSection roles={roles} managedStaff={managedStaff} formatRoleName={formatRoleName} />
                            </section>
                        )}

                        {activeTab === 'documents' && (
                            <section className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Documents</h3>
                                    <p className="text-muted-foreground text-sm">Attachments and compliance files</p>
                                </div>
                                <DocumentsSection managedStaff={managedStaff} />
                            </section>
                        )}
                    </div>

                    <InputError message={(errors as Record<string, string>).enable_login} />

                    <StickyStaffActionBar
                        processing={processing}
                        submitLabel={isEdit ? 'Save staff' : 'Create staff'}
                        backHref={usersRoutes.index.url()}
                    />
                </>
            )}
        </Form>
    );
}
