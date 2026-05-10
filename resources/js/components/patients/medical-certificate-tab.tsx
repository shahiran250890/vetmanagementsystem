import { Link, router, useForm } from '@inertiajs/react';
import { ExternalLink, FilePlus2, Printer, RotateCcw } from 'lucide-react';
import type { FormEvent, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import { nativeTextareaClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import medicalCertificateRoutes from '@/routes/patients/medical-certificates';

import MCPreview from './mc-preview';
import StickyActionBar from './sticky-action-bar';
import type { MedicalCertificate, MedicalCertificateFormData, Patient } from './types';

function today(): string {
    return new Date().toISOString().slice(0, 10);
}

function inclusiveDays(from: string, to: string): number {
    if (!from || !to) {
        return 0;
    }

    const start = new Date(from);
    const end = new Date(to);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return 0;
    }

    return Math.max(
        1,
        Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1,
    );
}

export default function MedicalCertificateTab({ patient }: { patient: Patient }) {
    const [voidReasonByCertId, setVoidReasonByCertId] = useState<
        Record<number, string>
    >({});
    const [previewCertificate, setPreviewCertificate] =
        useState<MedicalCertificate | null>(null);

    const form = useForm<MedicalCertificateFormData>({
        medical_record_id: '',
        employer_name: '',
        unfit_from: today(),
        unfit_to: today(),
        remarks: '',
    });

    const certificates = useMemo(
        () => patient.medical_certificates ?? [],
        [patient.medical_certificates],
    );

    const certificateDays = inclusiveDays(form.data.unfit_from, form.data.unfit_to);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post(medicalCertificateRoutes.store.url({ patient: patient.id }), {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_28rem]">
                <form onSubmit={submit} className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <CardTitle>Issue Medical Certificate</CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Saves through the existing MC endpoint and
                                        print template.
                                    </p>
                                </div>
                                <Button asChild variant="outline" size="sm">
                                    <Link
                                        href={medicalCertificateRoutes.create.url({
                                            patient: patient.id,
                                        })}
                                    >
                                        <ExternalLink
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Full MC Page
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <Field label="Certificate Date" htmlFor="certificate_date">
                                <Input id="certificate_date" value={today()} disabled />
                            </Field>
                            <Field label="Issuing Doctor" htmlFor="issuing_doctor">
                                <Input
                                    id="issuing_doctor"
                                    value="Current authenticated doctor"
                                    disabled
                                />
                            </Field>
                            <Field label="Start Date" htmlFor="unfit_from">
                                <Input
                                    id="unfit_from"
                                    type="date"
                                    value={form.data.unfit_from}
                                    onChange={(event) =>
                                        form.setData('unfit_from', event.target.value)
                                    }
                                />
                                <InputError message={form.errors.unfit_from} />
                            </Field>
                            <Field label="End Date" htmlFor="unfit_to">
                                <Input
                                    id="unfit_to"
                                    type="date"
                                    value={form.data.unfit_to}
                                    onChange={(event) =>
                                        form.setData('unfit_to', event.target.value)
                                    }
                                />
                                <InputError message={form.errors.unfit_to} />
                            </Field>
                            <Field label="Number of Days" htmlFor="mc_days">
                                <Input
                                    id="mc_days"
                                    value={`${certificateDays} day${certificateDays === 1 ? '' : 's'}`}
                                    disabled
                                />
                            </Field>
                            <Field label="Employer / School" htmlFor="employer_name">
                                <Input
                                    id="employer_name"
                                    value={form.data.employer_name}
                                    onChange={(event) =>
                                        form.setData(
                                            'employer_name',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={form.errors.employer_name} />
                            </Field>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="remarks">Diagnosis / Reason / Remarks</Label>
                                <textarea
                                    id="remarks"
                                    className={nativeTextareaClassName}
                                    rows={5}
                                    value={form.data.remarks}
                                    onChange={(event) =>
                                        form.setData('remarks', event.target.value)
                                    }
                                />
                                <InputError message={form.errors.remarks} />
                            </div>

                            <InputError
                                message={
                                    (form.errors as Record<string, string | undefined>)
                                        .patient_id
                                }
                            />
                            <InputError
                                message={
                                    (form.errors as Record<string, string | undefined>)
                                        .clinic_type
                                }
                            />
                        </CardContent>
                    </Card>

                    <StickyActionBar>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => form.reset()}
                        >
                            <RotateCcw className="size-4" aria-hidden="true" />
                            Reset
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.print()}
                        >
                            <Printer className="size-4" aria-hidden="true" />
                            Print MC
                        </Button>
                        <Button
                            type="submit"
                            variant="secondary"
                            disabled={form.processing}
                        >
                            Save MC
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <FilePlus2 className="size-4" aria-hidden="true" />
                            Generate MC
                        </Button>
                    </StickyActionBar>
                </form>

                <MCPreview
                    patient={patient}
                    certificate={previewCertificate}
                    formData={form.data}
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <CardTitle>Previous Medical Certificates</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={certificates.length === 0}
                            onClick={() => {
                                if (certificates[0]) {
                                    setPreviewCertificate(certificates[0]);
                                }
                            }}
                        >
                            Reprint Previous MC
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {certificates.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-sm">
                                <thead>
                                    <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                                        <th className="py-3 pr-4 font-medium">
                                            MC Number
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Issue Date
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Start Date
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            End Date
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Days
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Doctor
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Status
                                        </th>
                                        <th className="py-3 pr-4 font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {certificates.map((certificate) => (
                                        <tr key={certificate.id}>
                                            <td className="py-4 pr-4 font-medium">
                                                {certificate.certificate_number ??
                                                    '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {certificate.issued_at ?? '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {certificate.unfit_from ?? '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {certificate.unfit_to ?? '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {inclusiveDays(
                                                    certificate.unfit_from ?? '',
                                                    certificate.unfit_to ?? '',
                                                ) || '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                {certificate.doctor?.name ?? '-'}
                                            </td>
                                            <td className="py-4 pr-4">
                                                <Badge
                                                    variant={
                                                        certificate.status ===
                                                        'voided'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                    className="capitalize"
                                                >
                                                    {certificate.status ?? 'issued'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setPreviewCertificate(
                                                                certificate,
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <a
                                                            href={medicalCertificateRoutes.print.url({
                                                                patient:
                                                                    patient.id,
                                                                medicalCertificate:
                                                                    certificate.id,
                                                            })}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            Print
                                                        </a>
                                                    </Button>
                                                </div>
                                                {certificate.can_void &&
                                                certificate.status !== 'voided' ? (
                                                    <div className="mt-3 grid gap-2">
                                                        <Label
                                                            htmlFor={`void-reason-${certificate.id}`}
                                                            className="sr-only"
                                                        >
                                                            Void reason
                                                        </Label>
                                                        <textarea
                                                            id={`void-reason-${certificate.id}`}
                                                            className={nativeTextareaClassName}
                                                            rows={2}
                                                            value={
                                                                voidReasonByCertId[
                                                                    certificate.id
                                                                ] ?? ''
                                                            }
                                                            onChange={(event) =>
                                                                setVoidReasonByCertId(
                                                                    (current) => ({
                                                                        ...current,
                                                                        [certificate.id]:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    }),
                                                                )
                                                            }
                                                            placeholder="Required reason to void"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                const reason =
                                                                    voidReasonByCertId[
                                                                        certificate.id
                                                                    ]?.trim() ?? '';

                                                                if (!reason) {
                                                                    return;
                                                                }

                                                                router.post(
                                                                    medicalCertificateRoutes.void.url({
                                                                        patient:
                                                                            patient.id,
                                                                        medicalCertificate:
                                                                            certificate.id,
                                                                    }),
                                                                    {
                                                                        void_reason:
                                                                            reason,
                                                                    },
                                                                    {
                                                                        preserveScroll:
                                                                            true,
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            Void
                                                        </Button>
                                                    </div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                            No medical certificates issued yet.
                        </div>
                    )}
                </CardContent>
            </Card>

            {previewCertificate ? (
                <div className="xl:hidden">
                    <MCPreview
                        patient={patient}
                        certificate={previewCertificate}
                    />
                </div>
            ) : null}
        </div>
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
