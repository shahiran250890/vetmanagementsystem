import type { ApiEnvelope } from '@/types/clinic-api';
import type { Appointment } from '@/types/clinic-models';

import { api, assertSuccess, parsePaginated } from './api-client';

export type AppointmentListParams = {
    patient_id?: number;
    doctor_id?: number;
    status?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    per_page?: number;
};

export const appointmentService = {
    async list(params: AppointmentListParams = {}) {
        const res = await api.get<ApiEnvelope<unknown>>('/api/v1/appointments', {
            params,
        });
        assertSuccess(res.data);

        return parsePaginated<Appointment>(res.data);
    },

    async get(id: number) {
        const res = await api.get<ApiEnvelope<Appointment>>(
            `/api/v1/appointments/${id}`,
        );

        return assertSuccess(res.data);
    },

    async create(payload: Record<string, unknown>) {
        const res = await api.post<ApiEnvelope<Appointment>>(
            '/api/v1/appointments',
            payload,
        );

        return assertSuccess(res.data);
    },

    async update(id: number, payload: Record<string, unknown>) {
        const res = await api.put<ApiEnvelope<Appointment>>(
            `/api/v1/appointments/${id}`,
            payload,
        );

        return assertSuccess(res.data);
    },

    async remove(id: number) {
        const res = await api.delete<ApiEnvelope<unknown>>(
            `/api/v1/appointments/${id}`,
        );
        assertSuccess(res.data);
    },
};
