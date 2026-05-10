import {
    ChevronDown,
    ClipboardCheck,
    FileText,
    HeartPulse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useEffect } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import { nativeTextareaClassName } from '@/components/form-page-layout';
import { useAuthRoles } from '@/hooks/use-auth-roles';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import StickyActionBar from './sticky-action-bar';
import type {
    FormErrors,
    NewMedicalRecordFormData,
    Patient,
} from './types';

export default function NewMedicalRecordTab({
    data,
    errors,
    processing,
    onSubmit,
    onSetData,
    onReset,
    patientType,
    doctorOptions,
    nurseOptions,
}: {
    data: NewMedicalRecordFormData;
    errors: FormErrors<NewMedicalRecordFormData>;
    processing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onSetData: <K extends keyof NewMedicalRecordFormData>(
        field: K,
        value: NewMedicalRecordFormData[K],
    ) => void;
    onReset: () => void;
    patientType: Patient['patient_type'];
    doctorOptions: Array<{ id: number; name: string }>;
    nurseOptions: Array<{ id: number; name: string }>;
}) {
    const { hasAnyRole, auth } = useAuthRoles();
    const canEditDoctorDropdown = hasAnyRole('admin', 'superadmin');
    const shouldAutoAssignDoctor =
        hasAnyRole('doctor') && !canEditDoctorDropdown;
    const clinicianLabel = patientType === 'animal' ? 'Veterinarian' : 'Doctor';

    useEffect(() => {
        if (!shouldAutoAssignDoctor) {
            return;
        }

        const currentUserId = auth.user?.id;
        if (!currentUserId) {
            return;
        }

        if (data.veterinarian_user_id === String(currentUserId)) {
            return;
        }

        onSetData('veterinarian_user_id', String(currentUserId));
    }, [
        auth.user?.id,
        data.veterinarian_user_id,
        onSetData,
        shouldAutoAssignDoctor,
    ]);

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <Section title="Visit Information" icon={ClipboardCheck} defaultOpen>
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Visit ID / Case Number" htmlFor="visit_case_number">
                        <Input
                            id="visit_case_number"
                            value="Auto-generated on save"
                            readOnly
                            disabled
                        />
                    </Field>
                    <Field label="Date" htmlFor="entry_date">
                        <Input
                            id="entry_date"
                            type="date"
                            value={data.entry_date}
                            readOnly
                            disabled
                        />
                        <InputError message={errors.entry_date} />
                    </Field>
                    <Field label="Visit Date & Time" htmlFor="visit_at">
                        <Input
                            id="visit_at"
                            type="datetime-local"
                            value={data.visit_at}
                            readOnly
                            disabled
                        />
                        <InputError message={errors.visit_at} />
                    </Field>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="veterinarian_user_id"
                            name="veterinarian_user_id"
                            label={clinicianLabel}
                            options={doctorOptions.map((doctor) => ({
                                value: String(doctor.id),
                                label: doctor.name,
                            }))}
                            value={data.veterinarian_user_id}
                            onValueChange={(v) =>
                                onSetData('veterinarian_user_id', v)
                            }
                            allowEmpty
                            emptyOptionLabel=""
                            placeholder="Please select"
                            error={errors.veterinarian_user_id}
                            disabled={!canEditDoctorDropdown}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="assistant_user_id"
                            name="assistant_user_id"
                            label="Assistant/Nurse"
                            options={nurseOptions.map((nurse) => ({
                                value: String(nurse.id),
                                label: nurse.name,
                            }))}
                            value={data.assistant_user_id}
                            onValueChange={(v) =>
                                onSetData('assistant_user_id', v)
                            }
                            allowEmpty
                            emptyOptionLabel=""
                            placeholder="Please select"
                            error={errors.assistant_user_id}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="visit_type"
                            name="visit_type"
                            label="Visit Type"
                            options={[
                                { value: 'consultation', label: 'Consultation' },
                                { value: 'vaccination', label: 'Vaccination' },
                                { value: 'surgery', label: 'Surgery' },
                                { value: 'emergency', label: 'Emergency' },
                                {
                                    value: 'grooming_medical_check',
                                    label: 'Grooming medical check',
                                },
                                { value: 'follow_up', label: 'Follow-up' },
                            ]}
                            value={data.visit_type}
                            onValueChange={(v) => onSetData('visit_type', v)}
                            allowEmpty={false}
                            placeholder="Search…"
                            error={errors.visit_type}
                        />
                    </div>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="visit_status"
                            name="visit_status"
                            label="Status"
                            options={[
                                { value: 'waiting', label: 'Waiting' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                            value={data.visit_status}
                            onValueChange={(v) => onSetData('visit_status', v)}
                            allowEmpty={false}
                            placeholder="Search…"
                            error={errors.visit_status}
                        />
                    </div>
                    <Field label="Appointment ID (optional)" htmlFor="appointment_id">
                        <Input
                            id="appointment_id"
                            value={data.appointment_id}
                            onChange={(event) =>
                                onSetData('appointment_id', event.target.value)
                            }
                        />
                    </Field>
                </div>
            </Section>

            <Section title="Vital Signs" icon={HeartPulse}>
                <p className="text-sm text-muted-foreground">
                    Vital signs remain captured in the existing patient profile
                    and clinical note fields for this workflow.
                </p>
            </Section>

            <Section title="Symptoms & Clinical Notes" icon={FileText} defaultOpen>
                <div className="grid gap-4">
                    <Field label="Entry Type (optional)" htmlFor="entry_type">
                        <Input
                            id="entry_type"
                            value={data.entry_type}
                            onChange={(event) =>
                                onSetData('entry_type', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Title" htmlFor="title">
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(event) =>
                                onSetData('title', event.target.value)
                            }
                        />
                        <InputError message={errors.title} />
                    </Field>
                    <Field
                        label="Symptoms (Patient complaint)"
                        htmlFor="symptoms"
                    >
                        <textarea
                            id="symptoms"
                            className={nativeTextareaClassName}
                            rows={5}
                            value={data.symptoms}
                            onChange={(event) =>
                                onSetData('symptoms', event.target.value)
                            }
                        />
                        <InputError message={errors.symptoms} />
                    </Field>
                    <Field
                        label="Diagnosis (Clinical assessment)"
                        htmlFor="diagnosis"
                    >
                        <textarea
                            id="diagnosis"
                            className={nativeTextareaClassName}
                            rows={5}
                            value={data.diagnosis}
                            onChange={(event) =>
                                onSetData('diagnosis', event.target.value)
                            }
                        />
                        <InputError message={errors.diagnosis} />
                    </Field>
                    <Field label="Details (Legacy / optional notes)" htmlFor="details">
                        <textarea
                            id="details"
                            className={nativeTextareaClassName}
                            rows={5}
                            value={data.details}
                            onChange={(event) =>
                                onSetData('details', event.target.value)
                            }
                        />
                        <InputError message={errors.details} />
                    </Field>
                </div>
            </Section>

            <div className="grid gap-4 lg:grid-cols-2">
                {[
                    'Diagnosis',
                    'Procedures',
                    'Prescriptions',
                    'Lab Requests',
                    'Imaging Requests',
                    'Follow-up Instructions',
                ].map((title) => (
                    <Card key={title} className="border-dashed">
                        <CardHeader>
                            <CardTitle className="text-base">{title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Dedicated {title.toLowerCase()} fields are
                                being rolled out. Use diagnosis plus optional
                                details as needed for now.
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <StickyActionBar>
                <Button type="button" variant="outline" onClick={onReset}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.print()}
                >
                    Print Summary
                </Button>
                <Button
                    type="submit"
                    variant="secondary"
                    disabled={processing}
                    onClick={() => onSetData('visit_status', 'waiting')}
                >
                    Save Draft
                </Button>
                <Button
                    type="submit"
                    disabled={processing}
                    onClick={() => onSetData('visit_status', 'completed')}
                >
                    Save & Complete
                </Button>
            </StickyActionBar>
        </form>
    );
}

function Section({
    title,
    icon: Icon,
    defaultOpen = false,
    children,
}: {
    title: string;
    icon: LucideIcon;
    defaultOpen?: boolean;
    children: ReactNode;
}) {
    return (
        <Collapsible defaultOpen={defaultOpen}>
            <Card>
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Icon className="size-4" aria-hidden="true" />
                            </span>
                            <CardTitle className="text-base">{title}</CardTitle>
                        </div>
                        <ChevronDown className="size-4 text-muted-foreground" />
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent>{children}</CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}

function Field({
    label,
    htmlFor,
    children,
}: {
    label: string;
    htmlFor: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
        </div>
    );
}
