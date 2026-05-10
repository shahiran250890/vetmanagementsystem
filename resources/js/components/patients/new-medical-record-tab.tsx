import {
    ChevronDown,
    ClipboardCheck,
    FileText,
    HeartPulse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';

import {
    nativeSelectClassName,
    nativeTextareaClassName,
} from '@/components/form-page-layout';
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
}) {
    const clinicianIdLabel =
        patientType === 'animal' ? 'Veterinarian ID' : 'Doctor ID';

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
                            onChange={(event) =>
                                onSetData('entry_date', event.target.value)
                            }
                        />
                        <InputError message={errors.entry_date} />
                    </Field>
                    <Field label="Visit Date & Time" htmlFor="visit_at">
                        <Input
                            id="visit_at"
                            type="datetime-local"
                            value={data.visit_at}
                            onChange={(event) =>
                                onSetData('visit_at', event.target.value)
                            }
                        />
                        <InputError message={errors.visit_at} />
                    </Field>
                    <Field label="Clinic Location / Branch" htmlFor="clinic_location">
                        <Input
                            id="clinic_location"
                            value={data.clinic_location}
                            onChange={(event) =>
                                onSetData('clinic_location', event.target.value)
                            }
                        />
                        <InputError message={errors.clinic_location} />
                    </Field>
                    <Field label={clinicianIdLabel} htmlFor="veterinarian_user_id">
                        <Input
                            id="veterinarian_user_id"
                            value={data.veterinarian_user_id}
                            onChange={(event) =>
                                onSetData(
                                    'veterinarian_user_id',
                                    event.target.value,
                                )
                            }
                        />
                    </Field>
                    <Field label="Assistant / Nurse ID" htmlFor="assistant_user_id">
                        <Input
                            id="assistant_user_id"
                            value={data.assistant_user_id}
                            onChange={(event) =>
                                onSetData('assistant_user_id', event.target.value)
                            }
                        />
                    </Field>
                    <Field label="Visit Type" htmlFor="visit_type">
                        <select
                            id="visit_type"
                            className={nativeSelectClassName}
                            value={data.visit_type}
                            onChange={(event) =>
                                onSetData('visit_type', event.target.value)
                            }
                        >
                            <option value="consultation">Consultation</option>
                            <option value="vaccination">Vaccination</option>
                            <option value="surgery">Surgery</option>
                            <option value="emergency">Emergency</option>
                            <option value="grooming_medical_check">
                                Grooming medical check
                            </option>
                            <option value="follow_up">Follow-up</option>
                        </select>
                        <InputError message={errors.visit_type} />
                    </Field>
                    <Field label="Status" htmlFor="visit_status">
                        <select
                            id="visit_status"
                            className={nativeSelectClassName}
                            value={data.visit_status}
                            onChange={(event) =>
                                onSetData('visit_status', event.target.value)
                            }
                        >
                            <option value="waiting">Waiting</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <InputError message={errors.visit_status} />
                    </Field>
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
                    <Field label="Details" htmlFor="details">
                        <textarea
                            id="details"
                            className={nativeTextareaClassName}
                            rows={7}
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
                                Use the clinical details field above until a
                                dedicated {title.toLowerCase()} data field is
                                available in the current record API.
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
