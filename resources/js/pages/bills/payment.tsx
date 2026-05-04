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
import type { BreadcrumbItem } from '@/types';

const methodOpts: SelectOption[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'transfer', label: 'Bank transfer' },
];

export default function BillPayment({ billId }: { billId: number }) {
    const { push } = useToast();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [total, setTotal] = useState('0');
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('cash');
    const [paidAt, setPaidAt] = useState(() =>
        new Date().toISOString().slice(0, 16),
    );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Bills', href: '/bills' },
        { title: `Bill #${billId}`, href: `/bills/${billId}` },
        { title: 'Payment', href: `/bills/${billId}/pay` },
    ];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const b = await billingService.getBill(billId);

                if (!cancelled) {
                    setTotal(b.total_amount);
                    setAmount(b.total_amount);
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
    }, [billId]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            await billingService.createPayment({
                bill_id: billId,
                amount,
                method,
                paid_at: new Date(paidAt).toISOString().slice(0, 19).replace('T', ' '),
            });
            push('Payment recorded.', 'success');
            router.visit(`/bills/${billId}`);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Record payment" />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record payment" />
            <FormPageContent
                title="Record payment"
                backHref={`/bills/${billId}`}
                beforeChildren={
                    <p className="text-sm text-muted-foreground">
                        Bill total:{' '}
                        <strong>RM {Number.parseFloat(total).toFixed(2)}</strong>
                    </p>
                }
            >
                <form
                    onSubmit={(e) => void onSubmit(e)}
                    className={formPageFormClassName}
                >
                    <FormInput
                        label="Amount (RM)"
                        name="amount"
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <SelectDropdown
                        label="Method"
                        name="method"
                        options={methodOpts}
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    />
                    <FormInput
                        label="Paid at"
                        name="paid_at"
                        type="datetime-local"
                        value={paidAt}
                        onChange={(e) => setPaidAt(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting}
                        className={formPagePrimarySubmitClassName}
                    >
                        {submitting ? 'Saving…' : 'Save payment'}
                    </button>
                </form>
            </FormPageContent>
        </AppLayout>
    );
}
