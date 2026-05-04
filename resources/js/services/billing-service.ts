import type { ApiEnvelope } from '@/types/clinic-api';
import type { Bill, Payment } from '@/types/clinic-models';

import { api, assertSuccess, parsePaginated } from './api-client';

export type BillListParams = {
    patient_id?: number;
    status?: string;
    page?: number;
    per_page?: number;
};

export const billingService = {
    async listBills(params: BillListParams = {}) {
        const res = await api.get<ApiEnvelope<unknown>>('/api/v1/bills', {
            params,
        });
        assertSuccess(res.data);

        return parsePaginated<Bill>(res.data);
    },

    async getBill(id: number) {
        const res = await api.get<ApiEnvelope<Bill>>(`/api/v1/bills/${id}`);

        return assertSuccess(res.data);
    },

    async createBill(payload: Record<string, unknown>) {
        const res = await api.post<ApiEnvelope<Bill>>('/api/v1/bills', payload);

        return assertSuccess(res.data);
    },

    async listPayments(
        params: { bill_id?: number; page?: number; per_page?: number } = {},
    ) {
        const res = await api.get<ApiEnvelope<unknown>>('/api/v1/payments', {
            params,
        });
        assertSuccess(res.data);

        return parsePaginated<Payment>(res.data);
    },

    async createPayment(payload: {
        bill_id: number;
        amount: number | string;
        method: string;
        paid_at: string;
    }) {
        const res = await api.post<ApiEnvelope<Payment>>(
            '/api/v1/payments',
            payload,
        );

        return assertSuccess(res.data);
    },
};
