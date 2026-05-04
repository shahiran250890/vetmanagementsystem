import type { ApiEnvelope } from '@/types/clinic-api';
import type { MedicalRecord } from '@/types/clinic-models';

import { api, assertSuccess, parsePaginated } from './api-client';

export type MedicalRecordListParams = {
    patient_id?: number;
    doctor_id?: number;
    page?: number;
    per_page?: number;
};

export const medicalRecordService = {
    async list(params: MedicalRecordListParams = {}) {
        const res = await api.get<ApiEnvelope<unknown>>(
            '/api/v1/medical-records',
            { params },
        );
        assertSuccess(res.data);

        return parsePaginated<MedicalRecord>(res.data);
    },

    async get(id: number) {
        const res = await api.get<ApiEnvelope<MedicalRecord>>(
            `/api/v1/medical-records/${id}`,
        );

        return assertSuccess(res.data);
    },

    async create(payload: Record<string, unknown>) {
        const res = await api.post<ApiEnvelope<MedicalRecord>>(
            '/api/v1/medical-records',
            payload,
        );

        return assertSuccess(res.data);
    },

    async update(id: number, payload: Record<string, unknown>) {
        const res = await api.put<ApiEnvelope<MedicalRecord>>(
            `/api/v1/medical-records/${id}`,
            payload,
        );

        return assertSuccess(res.data);
    },

    async remove(id: number) {
        const res = await api.delete<ApiEnvelope<unknown>>(
            `/api/v1/medical-records/${id}`,
        );
        assertSuccess(res.data);
    },
};
