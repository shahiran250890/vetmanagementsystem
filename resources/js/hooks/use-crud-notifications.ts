import {
    crudRecordCreatedSuccess,
    crudRecordDeletedSuccess,
    crudRecordUpdatedSuccess,
    crudUnableToDeleteAlert,
    crudUnableToSaveAlert,
    crudValidationFieldsAlert,
} from '@/lib/crud-alerts';

export {
    crudRecordCreatedSuccess,
    crudRecordDeletedSuccess,
    crudRecordUpdatedSuccess,
    crudUnableToDeleteAlert,
    crudUnableToSaveAlert,
    crudValidationFieldsAlert,
} from '@/lib/crud-alerts';

/**
 * Imperative CRUD popups for modules that are not using {@link useCrudSubmit} yet.
 */
export function useCrudNotifications(): {
    notifyCreated: typeof crudRecordCreatedSuccess;
    notifyUpdated: typeof crudRecordUpdatedSuccess;
    notifyDeleted: typeof crudRecordDeletedSuccess;
    notifyUnableToSave: typeof crudUnableToSaveAlert;
    notifyUnableToDelete: typeof crudUnableToDeleteAlert;
    notifyValidation: typeof crudValidationFieldsAlert;
} {
    return {
        notifyCreated: crudRecordCreatedSuccess,
        notifyUpdated: crudRecordUpdatedSuccess,
        notifyDeleted: crudRecordDeletedSuccess,
        notifyUnableToSave: crudUnableToSaveAlert,
        notifyUnableToDelete: crudUnableToDeleteAlert,
        notifyValidation: crudValidationFieldsAlert,
    };
}
