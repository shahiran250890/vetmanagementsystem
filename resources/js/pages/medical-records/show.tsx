import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/loading-spinner';
import { RoleGate } from '@/components/role-gate';
import AppLayout from '@/layouts/app-layout';
import { medicalRecordService } from '@/services/medical-record-service';
import type { MedicalRecord } from '@/types/clinic-models';
import type { BreadcrumbItem } from '@/types';

export default function MedicalRecordShow({
    medicalRecordId,
}: {
    medicalRecordId: number;
}) {
    const [loading, setLoading] = useState(true);
    const [record, setRecord] = useState<MedicalRecord | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Medical records', href: '/medical-records' },
        { title: `Record #${medicalRecordId}`, href: `/medical-records/${medicalRecordId}` },
    ];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const r = await medicalRecordService.get(medicalRecordId);
                if (!cancelled) {
                    setRecord(r);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [medicalRecordId]);

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Medical record" />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    if (!record) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Medical record" />
                <p className="text-muted-foreground py-12 text-center text-sm">Not found</p>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Medical record #${record.id}`} />
            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold text-foreground">
                        Medical record #{record.id}
                    </h1>
                    <div className="flex gap-2">
                        <Link
                            href="/medical-records"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                            Back
                        </Link>
                        <RoleGate anyOf={['admin', 'superadmin', 'receptionist', 'doctor']}>
                            <Link
                                href={`/medical-records/${record.id}/edit`}
                                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                            >
                                Edit
                            </Link>
                        </RoleGate>
                    </div>
                </div>
                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-muted-foreground text-sm">
                        Patient:{' '}
                        <strong className="text-foreground">{record.patient?.name}</strong>{' '}
                        · Doctor:{' '}
                        <strong className="text-foreground">{record.doctor?.name}</strong>
                    </p>
                    <Section title="Symptoms" body={record.symptoms} />
                    <Section title="Diagnosis" body={record.diagnosis} />
                    <Section title="Treatment" body={record.treatment} />
                    <Section title="Notes" body={record.notes} />
                    {record.prescriptions && record.prescriptions.length > 0 ? (
                        <div>
                            <h3 className="text-foreground text-sm font-semibold">
                                Prescriptions
                            </h3>
                            <ul className="text-foreground mt-2 list-disc space-y-1 pl-5 text-sm">
                                {record.prescriptions.map((p) => (
                                    <li key={p.id}>
                                        {p.medicine_name}
                                        {p.dosage ? ` — ${p.dosage}` : ''}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            </div>
        </AppLayout>
    );
}

function Section({ title, body }: { title: string; body?: string | null }) {
    return (
        <div>
            <h3 className="text-foreground text-sm font-semibold">{title}</h3>
            <p className="text-foreground mt-1 text-sm whitespace-pre-wrap">
                {body?.trim() ? body : '—'}
            </p>
        </div>
    );
}
