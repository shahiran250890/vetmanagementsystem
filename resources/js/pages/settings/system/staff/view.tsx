import { Link } from '@inertiajs/react';
import { Building2, Calendar, ClipboardList, Mail, MapPin, Phone, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import SystemLayout from '@/layouts/settings/system-layout';
import { StaffHeader } from '@/modules/staff/components/staff-header';
import { AccountStatusBadge } from '@/modules/staff/components/account-status-badge';
import { StaffStatusBadge } from '@/modules/staff/components/staff-status-badge';
import { index as systemHome } from '@/routes/settings/system';
import usersRoutes from '@/routes/settings/system/users';
import type { BreadcrumbItem } from '@/types';

import type { StaffMember } from '@/modules/staff/types';

function formatStructuredAddress(s: StaffMember): string | null {
    const lines: string[] = [];
    if (s.address_line_1?.trim()) {
        lines.push(s.address_line_1.trim());
    }
    if (s.address_line_2?.trim()) {
        lines.push(s.address_line_2.trim());
    }
    const cityState = [s.city, s.state].map((x) => x?.trim()).filter(Boolean).join(', ');
    if (cityState) {
        lines.push(cityState);
    }
    const postalCountry = [s.postcode, s.country].map((x) => x?.trim()).filter(Boolean).join(' ');
    if (postalCountry) {
        lines.push(postalCountry);
    }
    if (lines.length === 0) {
        return null;
    }
    return lines.join('\n');
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
    return (
        <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">{label}</p>
            <p className="text-sm font-medium">{value && value !== '' ? value : '—'}</p>
        </div>
    );
}

export default function StaffView({
    managedStaff,
    canUpdateUser,
}: {
    managedStaff: StaffMember;
    canUpdateUser: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'System Setting', href: systemHome() },
        { title: 'Staff Management', href: usersRoutes.index() },
        { title: managedStaff.full_name, href: usersRoutes.show.url(managedStaff.id) },
    ];

    return (
        <SystemLayout pageTitle={`System Setting — ${managedStaff.full_name}`} breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-5xl space-y-6">
                <StaffHeader staff={managedStaff}>
                    {canUpdateUser && (
                        <Button variant="outline" asChild>
                            <Link href={usersRoutes.edit.url(managedStaff.id)}>Edit staff</Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href={usersRoutes.index.url()}>Back</Link>
                    </Button>
                </StaffHeader>

                <div className="grid gap-6 lg:grid-cols-3">
                    <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm lg:col-span-2">
                        <div className="flex items-center gap-2">
                            <ClipboardList className="text-muted-foreground size-5" />
                            <h2 className="text-lg font-semibold">Employment</h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Info label="Employee number" value={managedStaff.employee_number} />
                            <Info label="Department" value={managedStaff.department} />
                            <Info label="Position" value={managedStaff.position} />
                            <Info label="Hire date" value={managedStaff.hire_date} />
                            <Info label="Confirmation" value={managedStaff.confirmation_date} />
                            <Info label="Working hours" value={managedStaff.working_hours} />
                            <Info label="Reporting manager" value={managedStaff.reporting_manager?.full_name ?? null} />
                        </div>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <StaffStatusBadge employmentStatus={managedStaff.employment_status} />
                            <span className="text-muted-foreground text-xs">
                                Staff active: <strong>{managedStaff.is_active ? 'Yes' : 'No'}</strong>
                            </span>
                        </div>
                    </section>

                    <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Shield className="text-muted-foreground size-5" />
                            <h2 className="text-lg font-semibold">Login account</h2>
                        </div>
                        <AccountStatusBadge enableLogin={managedStaff.enable_login} isEnabled={managedStaff.is_enabled} />
                        <Info label="Login email" value={managedStaff.account_email} />
                        <p className="text-muted-foreground text-xs">
                            Two-factor authentication:{' '}
                            <strong className="text-foreground">
                                {managedStaff.two_factor_confirmed_at ? 'Enabled' : 'Not enabled'}
                            </strong>
                        </p>
                    </section>
                </div>

                <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Phone className="text-muted-foreground size-5" />
                        <h2 className="text-lg font-semibold">Contact</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Info label="Mobile" value={managedStaff.mobile_number} />
                        <Info label="Alternate" value={managedStaff.alternate_phone} />
                        <div className="space-y-1 sm:col-span-2">
                            <div className="flex items-center gap-1.5">
                                <Mail className="text-muted-foreground size-3.5" />
                                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Email</p>
                            </div>
                            <p className="text-sm font-medium">
                                {managedStaff.email && managedStaff.email !== '' ? managedStaff.email : '—'}
                            </p>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="text-muted-foreground size-3.5" />
                                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Address</p>
                            </div>
                            <p className="text-sm font-medium whitespace-pre-line">
                                {formatStructuredAddress(managedStaff) ?? '—'}
                            </p>
                        </div>
                        <Info label="Emergency contact" value={managedStaff.emergency_contact_name} />
                        <Info label="Emergency phone" value={managedStaff.emergency_contact_phone} />
                    </div>
                </section>

                <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Building2 className="text-muted-foreground size-5" />
                        <h2 className="text-lg font-semibold">Assigned clinics</h2>
                    </div>
                    {managedStaff.assigned_clinics.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No clinic labels recorded.</p>
                    ) : (
                        <ul className="flex flex-wrap gap-2">
                            {managedStaff.assigned_clinics.map((c) => (
                                <li key={c} className="bg-muted rounded-full px-3 py-1 text-sm">
                                    {c}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Calendar className="text-muted-foreground size-5" />
                        <h2 className="text-lg font-semibold">Professional</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Info label="Medical council registration" value={managedStaff.medical_registration_number} />
                        <Info label="APC" value={managedStaff.apc_number} />
                        <Info label="APC expiry" value={managedStaff.apc_expiry_date} />
                        <Info label="Specialization" value={managedStaff.specialization} />
                    </div>
                </section>

                <section className="border-border bg-card space-y-4 rounded-2xl border p-5 shadow-sm">
                    <h2 className="text-lg font-semibold">Roles</h2>
                    {managedStaff.roles.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No roles assigned (requires login account).</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {managedStaff.roles.map((role) => (
                                <span key={role.id} className="bg-muted rounded-full px-3 py-1 text-sm">
                                    {role.name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                <section className="border-border bg-muted/30 rounded-2xl border p-5">
                    <h2 className="mb-3 text-sm font-semibold">Audit</h2>
                    <div className="text-muted-foreground grid gap-2 text-xs sm:grid-cols-2">
                        <p>
                            Created: {managedStaff.created_at ? new Date(managedStaff.created_at).toLocaleString() : '—'}
                        </p>
                        <p>
                            Updated: {managedStaff.updated_at ? new Date(managedStaff.updated_at).toLocaleString() : '—'}
                        </p>
                    </div>
                </section>
            </div>
        </SystemLayout>
    );
}
