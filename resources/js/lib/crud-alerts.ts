import Swal from 'sweetalert2';

import { isLikelyLaravelValidationErrors } from '@/lib/crud-validation-detect';
import type { CrudErrorContext, CrudInertiaFeedbackConfig, CrudSuccessVariant } from '@/types/crud';


export const CRUD_DEFAULT_BLOCKING_DESCRIPTION =
    'Please keep this tab open until the process finishes.';

const SUCCESS_TITLE = 'Success';
const ERROR_TITLE = 'Error';

function successTextForVariant(variant: CrudSuccessVariant): string {
    switch (variant) {
        case 'created':
            return 'Record created successfully.';
        case 'updated':
            return 'Record updated successfully.';
        case 'deleted':
            return 'Record deleted successfully.';
    }
}

export async function crudRecordCreatedSuccess(): Promise<void> {
    await Swal.fire({
        icon: 'success',
        title: SUCCESS_TITLE,
        text: successTextForVariant('created'),
        confirmButtonText: 'OK',
    });
}

export async function crudRecordUpdatedSuccess(): Promise<void> {
    await Swal.fire({
        icon: 'success',
        title: SUCCESS_TITLE,
        text: successTextForVariant('updated'),
        confirmButtonText: 'OK',
    });
}

export async function crudRecordDeletedSuccess(): Promise<void> {
    await Swal.fire({
        icon: 'success',
        title: SUCCESS_TITLE,
        text: successTextForVariant('deleted'),
        confirmButtonText: 'OK',
    });
}

export async function crudUnableToSaveAlert(): Promise<void> {
    await Swal.fire({
        icon: 'error',
        title: ERROR_TITLE,
        text: 'Unable to save record.',
        confirmButtonText: 'OK',
    });
}

export async function crudUnableToDeleteAlert(): Promise<void> {
    await Swal.fire({
        icon: 'error',
        title: ERROR_TITLE,
        text: 'Unable to delete record.',
        confirmButtonText: 'OK',
    });
}

export async function crudValidationFieldsAlert(): Promise<void> {
    await Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Please correct the highlighted fields and try again.',
        confirmButtonText: 'OK',
    });
}

export async function runCrudPostVisitAlerts(args: {
    outcome: 'success' | 'error' | null;
    errorWasValidation: boolean;
    feedback: CrudInertiaFeedbackConfig;
}): Promise<void> {
    const { outcome, errorWasValidation, feedback } = args;

    if (outcome === null) {
        return;
    }

    if (outcome === 'success') {
        if (feedback.successAlert) {
            await feedback.successAlert();

            return;
        }

        const variant: CrudSuccessVariant = feedback.successVariant ?? 'updated';
        const text = successTextForVariant(variant);
        await Swal.fire({
            icon: 'success',
            title: SUCCESS_TITLE,
            text,
            confirmButtonText: 'OK',
        });

        return;
    }

    if (outcome === 'error') {
        if (errorWasValidation) {
            await (feedback.validationAlert ?? crudValidationFieldsAlert)();

            return;
        }

        const context: CrudErrorContext = feedback.errorContext ?? 'save';
        await (feedback.serverErrorAlert
            ?? (context === 'delete' ? crudUnableToDeleteAlert : crudUnableToSaveAlert))();
    }
}

export function defaultTreatAsValidation(errors: unknown): boolean {
    return isLikelyLaravelValidationErrors(errors);
}
