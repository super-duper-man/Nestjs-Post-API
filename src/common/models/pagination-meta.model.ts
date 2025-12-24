export interface PaginationMeta {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    hasPreviousPage: boolean;
    nextPage: boolean;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
}