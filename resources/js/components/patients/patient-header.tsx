import { Link } from '@inertiajs/react';
import {
    CalendarPlus,
    ClipboardPlus,
    CreditCard,
    Edit3,
    HeartPulse,
    Phone,
    Printer,
    ShieldAlert,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { genderDisplayLabel } from '@/lib/gender-selection';
import { edit as editPatient } from '@/routes/patients';

import type { Patient, PatientWorkspaceTab } from './types';

function patientInitials(name: string): string {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

function patientAge(dateOfBirth: string | null): string {
    if (!dateOfBirth) {
        return '-';
    }

    const birthDate = new Date(dateOfBirth);

    if (Number.isNaN(birthDate.getTime())) {
        return '-';
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age -= 1;
    }

    return `${age} years`;
}

export default function PatientHeader({
    patient,
    canManageMedicalCertificates,
    onOpenTab,
}: {
    patient: Patient;
    canManageMedicalCertificates: boolean;
    onOpenTab: (tab: PatientWorkspaceTab) => void;
}) {
    const allergies = patient.allergies
        ?.split(/[,;\n]/)
        .map((allergy) => allergy.trim())
        .filter(Boolean);

    return (
        <Card className="overflow-hidden border-primary/10 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
            <CardHeader className="border-b bg-background/60">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                        <Avatar className="size-20 border-4 border-background shadow-md">
                            <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
                                {patientInitials(patient.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-3">
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <CardTitle className="text-2xl">
                                        {patient.name}
                                    </CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {patient.status}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="capitalize"
                                    >
                                        {patient.patient_type}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    MRN P-
                                    {String(patient.id).padStart(6, '0')}
                                </p>
                            </div>

                            {allergies && allergies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {allergies.map((allergy) => (
                                        <Badge
                                            key={allergy}
                                            variant="destructive"
                                            className="gap-1"
                                        >
                                            <ShieldAlert
                                                className="size-3"
                                                aria-hidden="true"
                                            />
                                            Allergy: {allergy}
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:justify-end">
                        <Button asChild variant="outline" size="sm">
                            <Link href={editPatient(patient.id)}>
                                <Edit3 className="size-4" aria-hidden="true" />
                                Edit Patient
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" type="button">
                            <CalendarPlus
                                className="size-4"
                                aria-hidden="true"
                            />
                            Schedule Appointment
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            onClick={() => onOpenTab('new-record')}
                        >
                            <ClipboardPlus
                                className="size-4"
                                aria-hidden="true"
                            />
                            Add Medical Record
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => window.print()}
                        >
                            <Printer className="size-4" aria-hidden="true" />
                            Print Patient Card
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-6 sm:grid-cols-2 xl:grid-cols-4">
                <HeaderMetric
                    icon={CreditCard}
                    label="IC / Passport"
                    value={patient.human_profile?.identification_number ?? '-'}
                />
                <HeaderMetric
                    icon={HeartPulse}
                    label="Gender"
                    value={genderDisplayLabel(patient.sex)}
                />
                <HeaderMetric
                    label="Date of Birth / Age"
                    value={`${patient.date_of_birth ?? '-'} · ${patientAge(patient.date_of_birth)}`}
                />
                <HeaderMetric
                    icon={Phone}
                    label="Phone"
                    value={
                        patient.human_profile?.primary_phone ??
                        patient.emergency_contact_phone ??
                        '-'
                    }
                />
                <HeaderMetric
                    label="Blood Group"
                    value={patient.human_profile?.blood_type ?? '-'}
                />
                <HeaderMetric
                    label="Current Medications"
                    value={patient.current_medications ?? '-'}
                    className="sm:col-span-2 xl:col-span-3"
                />
                {canManageMedicalCertificates ? null : (
                    <p className="text-xs text-muted-foreground sm:col-span-2 xl:col-span-4">
                        Medical certificates are hidden for this patient or
                        your current permissions.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function HeaderMetric({
    icon: Icon,
    label,
    value,
    className,
}: {
    icon?: LucideIcon;
    label: string;
    value: string;
    className?: string;
}) {
    return (
        <div className={className}>
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
                {label}
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
        </div>
    );
}
