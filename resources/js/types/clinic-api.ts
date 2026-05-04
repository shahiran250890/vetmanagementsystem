export type ApiEnvelope<T> = {
    success: boolean;
    message: string;
    data: T;
    meta: Record<string, unknown> & {
        pagination?: PaginationMeta;
        filters?: Record<string, string>;
    };
};

export type PaginationMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
};

/** Laravel paginated JsonResource inner shape */
export type PaginatedData<T> = {
    data: T[];
    links?: Record<string, unknown>;
    meta?: PaginationMeta;
};
