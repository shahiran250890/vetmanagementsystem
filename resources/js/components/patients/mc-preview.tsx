import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import type { MedicalCertificate, MedicalCertificateFormData, Patient } from './types';

function inclusiveDays(from: string | null, to: string | null): number | null {
    if (!from || !to) {
        return null;
    }

    const start = new Date(from);
    const end = new Date(to);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return null;
    }

    return Math.max(
        1,
        Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1,
    );
}

export default function MCPreview({
    patient,
    certificate,
    formData,
}: {
    patient: Patient;
    certificate?: MedicalCertificate | null;
    formData?: MedicalCertificateFormData;
}) {
    const from = certificate?.unfit_from ?? formData?.unfit_from ?? null;
    const to = certificate?.unfit_to ?? formData?.unfit_to ?? null;
    const days = inclusiveDays(from, to);

    return (
        <Card className="sticky top-28 border-primary/20 bg-gradient-to-br from-card to-primary/5">
            <CardHeader>
                <CardTitle>Live MC Preview</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Uses the existing certificate numbering and print template
                    after save.
                </p>
            </CardHeader>
            <CardContent>
                <div className="rounded-2xl border bg-background p-6 shadow-inner">
                    <div className="border-b pb-4 text-center">
                        <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">
                            Medical Certificate
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">
                            {certificate?.certificate_number ?? 'Draft MC'}
                        </h3>
                    </div>

                    <div className="mt-6 space-y-4 text-sm leading-7">
                        <p>
                            This is to certify that{' '}
                            <span className="font-semibold">{patient.name}</span>
                            {patient.human_profile?.identification_number ? (
                                <>
                                    {' '}
                                    (IC/Passport:{' '}
                                    {patient.human_profile.identification_number})
                                </>
                            ) : null}{' '}
                            is medically unfit for work or school.
                        </p>
                        <div className="grid gap-3 rounded-xl bg-muted/50 p-4">
                            <PreviewRow label="From" value={from ?? '-'} />
                            <PreviewRow label="To" value={to ?? '-'} />
                            <PreviewRow
                                label="Number of days"
                                value={days ? `${days} day${days === 1 ? '' : 's'}` : '-'}
                            />
                            <PreviewRow
                                label="Employer / school"
                                value={
                                    certificate?.employer_name ??
                                    formData?.employer_name ??
                                    '-'
                                }
                            />
                        </div>
                        <div>
                            <p className="font-medium">Remarks / Reason</p>
                            <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                                {certificate?.remarks ?? formData?.remarks ?? '-'}
                            </p>
                        </div>
                        <div className="pt-6">
                            <p className="font-medium">
                                Issuing Doctor:{' '}
                                {certificate?.doctor?.name ?? 'Assigned on issue'}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}
