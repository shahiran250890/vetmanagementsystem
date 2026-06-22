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
