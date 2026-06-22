import type { ReactElement } from 'react';

import { BlockingLoadingOverlay } from '@/components/blocking-loading-overlay';
import { CRUD_DEFAULT_BLOCKING_DESCRIPTION } from '@/lib/crud-alerts';

export function CrudBlockingOverlay({ message }: { message: string | null }): ReactElement {
    return (
        <BlockingLoadingOverlay
            open={message !== null}
            title={message ?? 'Please wait…'}
            description={CRUD_DEFAULT_BLOCKING_DESCRIPTION}
        />
    );
}
