import axios from 'axios';
import type {AxiosError} from 'axios';

import type { ApiEnvelope, PaginatedData, PaginationMeta } from '@/types/clinic-api';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL ?? '',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

let toastHandler: ((message: string, type: 'error' | 'success') => void) | null =
    null;

export function registerApiToastHandler(
    handler: (message: string, type: 'error' | 'success') => void,
): void {
    toastHandler = handler;
}

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiEnvelope<unknown>>) => {
        const msg =
            error.response?.data?.message ||
            error.message ||
            'Something went wrong. Please try again.';

        if (!error.config?.skipErrorToast) {
            toastHandler?.(msg, 'error');
        }

        return Promise.reject(error);
    },
);

export function parsePaginated<T>(
    envelope: ApiEnvelope<unknown>,
): { items: T[]; pagination: PaginationMeta } {
    const inner = envelope.data as PaginatedData<T>;
    const fromResource = inner?.meta;
    const fromEnvelope = envelope.meta?.pagination;

    const pagination: PaginationMeta = fromEnvelope ?? {
        current_page: fromResource?.current_page ?? 1,
        last_page: fromResource?.last_page ?? 1,
        per_page: fromResource?.per_page ?? inner?.data?.length ?? 0,
        total: fromResource?.total ?? inner?.data?.length ?? 0,
    };

    return {
        items: inner?.data ?? [],
        pagination,
    };
}

export function assertSuccess<T>(envelope: ApiEnvelope<T>): T {
    if (!envelope.success) {
        throw new Error(envelope.message || 'Request failed');
    }

    return envelope.data;
}

export { api };
