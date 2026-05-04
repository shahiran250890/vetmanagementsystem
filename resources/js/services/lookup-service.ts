import type { ApiEnvelope } from '@/types/clinic-api';
import type { DoctorOption } from '@/types/clinic-models';

import { api, assertSuccess } from './api-client';

export const lookupService = {
    async doctors(): Promise<DoctorOption[]> {
        const res = await api.get<ApiEnvelope<DoctorOption[]>>(
            '/api/v1/lookup/doctors',
        );

        return assertSuccess(res.data);
    },
};
