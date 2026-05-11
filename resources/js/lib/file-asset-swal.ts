import Swal from 'sweetalert2';

export async function fileDeleteSuccessAlert(fileName: string): Promise<void> {
    await Swal.fire({
        icon: 'success',
        title: 'File removed',
        text: `${fileName} was deleted.`,
        confirmButtonText: 'OK',
    });
}

export async function fileDeleteErrorAlert(message: string): Promise<void> {
    await Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: message,
        confirmButtonText: 'OK',
    });
}
