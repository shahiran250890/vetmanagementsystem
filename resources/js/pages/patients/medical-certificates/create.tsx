import { Head, Link, useForm } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';

import {
    formPageSurfaceClassName,
    nativeSelectClassName,
    nativeTextareaClassName,
} from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import medicalCertificateRoutes from '@/routes/patients/medical-certificates';
import { index as patientsIndex, show as showPatient } from '@/routes/patients';
import type { BreadcrumbItem, PatientRecord } from '@/types';

type MedicalRecordOption = {
    id: number;
    label: string;
};

export default function CreateMedicalCertificate({
    patient,
    medicalRecordOptions,
}: {
    patient: PatientRecord;
    medicalRecordOptions: MedicalRecordOption[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: patientsIndex() },
        { title: patient.name, href: showPatient(patient.id) },
        {
            title: 'Issue medical certificate',
            href: medicalCertificateRoutes.create.url({ patient: patient.id }),
        },
    ];

    const today = new Date().toISOString().slice(0, 10);

    const form = useForm({
        medical_record_id: '' as string | number,
        employer_name: '',
        unfit_from: today,
        unfit_to: today,
        remarks: '',
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        form.post(medicalCertificateRoutes.store.url({ patient: patient.id }), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`MC — ${patient.name}`} />
            <div className="mx-auto max-w-2xl space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-xl font-semibold">Issue medical certificate</h1>
                    <Button asChild variant="outline">
                        <Link href={showPatient(patient.id)}>Back to patient</Link>
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    Patient: <span className="font-medium text-foreground">{patient.name}</span>
                    {patient.human_profile?.identification_number ? (
                        <span className="text-foreground">
                            {' '}
                            · NRIC: {patient.human_profile.identification_number}
                        </span>
                    ) : null}
                </p>

                <form onSubmit={submit} className={cn(formPageSurfaceClassName, 'space-y-4')}>
                    <div className="grid gap-2">
                        <Label htmlFor="medical_record_id">Linked visit (optional)</Label>
                        <select
                            id="medical_record_id"
                            className={nativeSelectClassName}
                            value={form.data.medical_record_id === '' ? '' : String(form.data.medical_record_id)}
                            onChange={(event) =>
                                form.setData('medical_record_id', event.target.value === '' ? '' : Number(event.target.value))
                            }
                        >
                            <option value="">None</option>
                            {medicalRecordOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={form.errors.medical_record_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="employer_name">Employer / school (optional)</Label>
                        <Input
                            id="employer_name"
                            value={form.data.employer_name}
                            onChange={(event) => form.setData('employer_name', event.target.value)}
                        />
                        <InputError message={form.errors.employer_name} />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="unfit_from">Unfit from</Label>
                            <Input
                                id="unfit_from"
                                type="date"
                                value={form.data.unfit_from}
                                onChange={(event) => form.setData('unfit_from', event.target.value)}
                            />
                            <InputError message={form.errors.unfit_from} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="unfit_to">Unfit until (inclusive)</Label>
                            <Input
                                id="unfit_to"
                                type="date"
                                value={form.data.unfit_to}
                                onChange={(event) => form.setData('unfit_to', event.target.value)}
                            />
                            <InputError message={form.errors.unfit_to} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="remarks">Remarks (optional)</Label>
                        <textarea
                            id="remarks"
                            className={nativeTextareaClassName}
                            rows={4}
                            value={form.data.remarks}
                            onChange={(event) => form.setData('remarks', event.target.value)}
                        />
                        <InputError message={form.errors.remarks} />
                    </div>

                    <InputError
                        message={
                            (form.errors as Record<string, string | undefined>).patient_id
                        }
                    />
                    <InputError
                        message={
                            (form.errors as Record<string, string | undefined>).clinic_type
                        }
                    />

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            Issue certificate
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href={showPatient(patient.id)}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
