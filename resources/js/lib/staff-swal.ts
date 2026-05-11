import Swal from 'sweetalert2';

export async function staffSaveSuccessAlert(options: { isEdit: boolean; saveAction: 'save' | 'continue' }): Promise<void> {
    const { isEdit, saveAction } = options;
    const text = !isEdit
        ? 'The new staff record was created.'
        : saveAction === 'save'
          ? 'The staff record was saved successfully.'
          : 'This section was saved successfully.';

    await Swal.fire({
        icon: 'success',
        title: 'Success',
        text,
        confirmButtonText: 'OK',
    });
}

export async function staffSaveErrorAlert(): Promise<void> {
    await Swal.fire({
        icon: 'error',
        title: 'Unable to save',
        text: 'Please review the highlighted fields and try again.',
        confirmButtonText: 'OK',
    });
}
