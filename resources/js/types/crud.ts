/**
 * Shared configuration for Inertia CRUD visits (create / update / delete)
 * paired with {@link useCrudSubmit}'s `withCrudFeedback`.
 */
export type CrudSuccessVariant = 'created' | 'updated' | 'deleted';

export type CrudErrorContext = 'save' | 'delete';

export type CrudInertiaFeedbackConfig = {
    /** Shown on the blocking overlay while the Inertia visit is in flight. */
    loadingMessage: string;
    /**
     * Default success copy after a successful visit.
     * Ignored when `successAlert` is set.
     */
    successVariant?: CrudSuccessVariant;
    /** Fully custom success handling (e.g. tabbed staff saves). */
    successAlert?: () => Promise<void>;
    /**
     * Return true when Inertia `onError` received Laravel-style field validation errors.
     * Defaults to {@link isLikelyLaravelValidationErrors} from `@/lib/crud-validation-detect`.
     */
    treatAsValidation?: (errors: unknown) => boolean;
    /** Defaults to the global validation popup copy. */
    validationAlert?: () => Promise<void>;
    /** Defaults based on {@link CrudInertiaFeedbackConfig.errorContext}. */
    serverErrorAlert?: () => Promise<void>;
    /** Whether failed non-validation errors use delete vs save wording. */
    errorContext?: CrudErrorContext;
};
