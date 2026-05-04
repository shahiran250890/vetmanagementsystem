import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import { type Column, DataTable } from '@/components/data-table';
import { LoadingSpinner } from '@/components/loading-spinner';
import { RoleGate } from '@/components/role-gate';
import AppLayout from '@/layouts/app-layout';
import { billingService } from '@/services/billing-service';
import type { Bill, BillItem, Payment } from '@/types/clinic-models';
import type { BreadcrumbItem } from '@/types';

export default function BillShow({ billId }: { billId: number }) {
    const [loading, setLoading] = useState(true);
    const [bill, setBill] = useState<Bill | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Bills', href: '/bills' },
        { title: `Bill #${billId}`, href: `/bills/${billId}` },
    ];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const b = await billingService.getBill(billId);
                if (!cancelled) {
                    setBill(b);
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

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Bill" />
                <LoadingSpinner />
            </AppLayout>
        );
    }

    if (!bill) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Bill" />
                <p className="text-muted-foreground py-12 text-center text-sm">Bill not found.</p>
            </AppLayout>
        );
    }

    const itemCols: Column<BillItem>[] = [
        { key: 't', header: 'Type', render: (i) => i.item_type },
        { key: 'd', header: 'Description', render: (i) => i.description ?? '—' },
        {
            key: 'a',
            header: 'Amount',
            render: (i) => `RM ${Number.parseFloat(i.amount).toFixed(2)}`,
        },
    ];

    const payCols: Column<Payment>[] = [
        { key: 'm', header: 'Method', render: (p) => p.method },
        {
            key: 'a',
            header: 'Amount',
            render: (p) => `RM ${Number.parseFloat(p.amount).toFixed(2)}`,
        },
        { key: 'd', header: 'Paid at', render: (p) => p.paid_at ?? '—' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bill #${bill.id}`} />
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Bill #{bill.id}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {bill.patient?.name} ·{' '}
                            <span className="capitalize">{bill.status}</span> · Total RM{' '}
                            {Number.parseFloat(bill.total_amount).toFixed(2)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href="/bills"
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        >
                            Back
                        </Link>
                        <RoleGate anyOf={['admin', 'superadmin', 'receptionist']}>
                            <Link
                                href={`/bills/${bill.id}/pay`}
                                className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                            >
                                Record payment
                            </Link>
                        </RoleGate>
                    </div>
                </div>
                <div>
                    <h2 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                        Line items
                    </h2>
                    <DataTable
                        columns={itemCols}
                        rows={bill.items ?? []}
                        rowKey={(i) => i.id}
                        empty={<span>No line items.</span>}
                    />
                </div>
                <div>
                    <h2 className="text-muted-foreground mb-2 text-sm font-semibold tracking-wide uppercase">
                        Payments
                    </h2>
                    <DataTable
                        columns={payCols}
                        rows={bill.payments ?? []}
                        rowKey={(p) => p.id}
                        empty={<span>No payments yet.</span>}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
