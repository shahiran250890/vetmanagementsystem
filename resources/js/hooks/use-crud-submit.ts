import { useCallback, useMemo, useRef, useState } from 'react';

import { defaultTreatAsValidation, runCrudPostVisitAlerts } from '@/lib/crud-alerts';
import { queueAfterPaint } from '@/lib/queue-after-paint';
import type { CrudInertiaFeedbackConfig } from '@/types/crud';

type VisitOptionBag = Record<string, unknown> & {
    onSuccess?: (...args: unknown[]) => unknown;
    onError?: (errors: unknown) => unknown;
    onFinish?: (...args: unknown[]) => unknown;
};

type VisitSnapshot = {
    feedback: CrudInertiaFeedbackConfig;
    outcome: 'success' | 'error' | null;
    errorWasValidation: boolean;
};

/**
 * Wraps Inertia visit callbacks with a blocking overlay and SweetAlert2 outcomes,
 * matching the Staff Management CRUD UX for reuse across modules.
 */
export function useCrudSubmit() {
    const [blockingMessage, setBlockingMessage] = useState<string | null>(null);
    const snapshotRef = useRef<VisitSnapshot | null>(null);

    const withCrudFeedback = useCallback(<T extends VisitOptionBag>(feedback: CrudInertiaFeedbackConfig, visitOptions: T): T => {
        snapshotRef.current = {
            feedback,
            outcome: null,
            errorWasValidation: false,
        };
        setBlockingMessage(feedback.loadingMessage);

        const onSuccess = visitOptions.onSuccess;
        const onError = visitOptions.onError;
        const onFinish = visitOptions.onFinish;

        return {
            ...visitOptions,
            onSuccess: (...args: unknown[]) => {
                if (snapshotRef.current !== null) {
                    snapshotRef.current.outcome = 'success';
                }

                return onSuccess?.(...args);
            },
            onError: (errors: unknown) => {
                if (snapshotRef.current !== null) {
                    snapshotRef.current.outcome = 'error';
                    const treat = feedback.treatAsValidation ?? defaultTreatAsValidation;
                    snapshotRef.current.errorWasValidation = treat(errors);
                }

                return onError?.(errors);
            },
            onFinish: (...args: unknown[]) => {
                const snap = snapshotRef.current;
                snapshotRef.current = null;
                setBlockingMessage(null);
                const finishResult = onFinish?.(...args);

                if (snap !== null) {
                    queueAfterPaint(() => {
                        void runCrudPostVisitAlerts({
                            outcome: snap.outcome,
                            errorWasValidation: snap.errorWasValidation,
                            feedback: snap.feedback,
                        });
                    });
                }

                return finishResult;
            },
        };
    }, []);

    const isBlocking = useMemo(() => blockingMessage !== null, [blockingMessage]);

    return {
        blockingMessage,
        isBlocking,
        withCrudFeedback,
    };
}
