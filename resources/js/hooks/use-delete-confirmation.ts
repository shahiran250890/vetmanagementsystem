import Swal from 'sweetalert2';

export type CrudDeleteConfirmOptions = {
    title?: string;
    text?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
};

export async function confirmCrudDelete(options?: CrudDeleteConfirmOptions): Promise<boolean> {
    const result = await Swal.fire({
        icon: 'warning',
        title: options?.title ?? 'Delete record?',
        text: options?.text ?? 'Are you sure you want to delete this record?',
        showCancelButton: true,
        confirmButtonText: options?.confirmButtonText ?? 'Delete',
        cancelButtonText: options?.cancelButtonText ?? 'Cancel',
        focusCancel: true,
    });

    return result.isConfirmed;
}

/**
 * Small hook wrapper so pages can destructure `confirmDelete` consistently.
 */
export function useDeleteConfirmation(): { confirmDelete: typeof confirmCrudDelete } {
    return { confirmDelete: confirmCrudDelete };
}
