import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { FormInput } from '@/components/form-input';
import {
    FormPageContent,
    formPageFormClassName,
    formPagePrimarySubmitClassName,
} from '@/components/form-page-layout';
import { LoadingSpinner } from '@/components/loading-spinner';
import { SelectDropdown  } from '@/components/select-dropdown';
import type {SelectOption} from '@/components/select-dropdown';
import { useToast } from '@/contexts/toast-context';
import AppLayout from '@/layouts/app-layout';
import { billingService } from '@/services/billing-service';
import { patientService } from '@/services/patient-service';
import type { BreadcrumbItem } from '@/types';
import type { Patient } from '@/types/clinic-models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Bills', href: '/bills' },
    { title: 'New bill', href: '/bills/create' },
];

export default function BillNew() {
    const { push } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [patientId, setPatientId] = useState('');
    const [status, setStatus] = useState('unpaid');
    const [lineType, setLineType] = useState('consultation');
    const [lineDesc, setLineDesc] = useState('');
    const [lineAmount, setLineAmount] = useState('');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const res = await patientService.list({ per_page: 100, page: 1 });

            if (!cancelled) {
                setPatients(res.items);
            }

            if (!cancelled) {
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const bill = await billingService.createBill({
                patient_id: Number(patientId),
                status,
                items: [
                    {
                        item_type: lineType,
                        description: lineDesc || null,
                        amount: Number.parseFloat(lineAmount) || 0,
                    },
                ],
            });
            push('Bill created.', 'success');
            router.visit(`/bills/${bill.id}`);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="New bill" />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    const opts: SelectOption[] = patients.map((p) => ({
        value: String(p.id),
        label: p.name,
    }));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New bill" />
            <FormPageContent title="New bill" backHref="/bills">
                <form
                    onSubmit={(e) => void onSubmit(e)}
                    className={formPageFormClassName}
                >
                    <SelectDropdown
                        label="Patient"
                        name="patient_id"
                        options={opts}
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        required
                    />
                    <SelectDropdown
                        label="Bill status"
                        name="status"
                        options={[
                            { value: 'unpaid', label: 'Unpaid' },
                            { value: 'paid', label: 'Paid' },
                        ]}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                    <p className="text-sm font-semibold text-foreground">Line item</p>
                    <FormInput
                        label="Item type"
                        name="item_type"
                        value={lineType}
                        onChange={(e) => setLineType(e.target.value)}
                        required
                    />
                    <FormInput
                        label="Description"
                        name="desc"
                        value={lineDesc}
                        onChange={(e) => setLineDesc(e.target.value)}
                    />
                    <FormInput
                        label="Amount (RM)"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={lineAmount}
                        onChange={(e) => setLineAmount(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className={formPagePrimarySubmitClassName}
                    >
                        {submitting ? 'Creating…' : 'Create bill'}
                    </button>
                </form>
            </FormPageContent>
        </AppLayout>
    );
}
