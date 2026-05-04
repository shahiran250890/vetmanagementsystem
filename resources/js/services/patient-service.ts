import type { ApiEnvelope } from '@/types/clinic-api';
import type { Patient } from '@/types/clinic-models';

import { api, assertSuccess, parsePaginated } from './api-client';

export type PatientListParams = {
    search?: string;
    status?: string;
    patient_type?: string;
    page?: number;
    per_page?: number;
};

export const patientService = {
    async list(params: PatientListParams = {}) {
        const res = await api.get<ApiEnvelope<unknown>>('/api/v1/patients', {
            params,
        });
        assertSuccess(res.data);

        return parsePaginated<Patient>(res.data);
    },

    async get(id: number) {
        const res = await api.get<ApiEnvelope<Patient>>(`/api/v1/patients/${id}`);

        return assertSuccess(res.data);
    },

    async create(payload: Record<string, unknown>) {
        const res = await api.post<ApiEnvelope<Patient>>(
            '/api/v1/patients',
            payload,
        );

        return assertSuccess(res.data);
    },

    async update(id: number, payload: Record<string, unknown>) {
        const res = await api.put<ApiEnvelope<Patient>>(
            `/api/v1/patients/${id}`,
            payload,
        );

        return assertSuccess(res.data);
    },

    async remove(id: number) {
        const res = await api.delete<ApiEnvelope<unknown>>(
            `/api/v1/patients/${id}`,
        );
        assertSuccess(res.data);
    },
};
