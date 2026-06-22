import { Link } from '@inertiajs/react';
import type { ReactElement } from 'react';


import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CrudActionButtons({
    cancelHref,
    processing,
    saveLabel = 'Save',
    saveContinueLabel = 'Save & Continue',
    activeSubmitAction,
    onSaveClick,
    onSaveContinueClick,
    className,
}: {
    cancelHref: string;
    processing: boolean;
    saveLabel?: string;
    saveContinueLabel?: string;
    activeSubmitAction: 'save' | 'continue';
    onSaveClick: () => void;
    onSaveContinueClick: () => void;
    className?: string;
}): ReactElement {
    return (
        <div className={cn('flex flex-wrap items-center justify-end gap-2', className)}>
            <Button type="button" variant="outline" asChild>
                <Link href={cancelHref}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing} onClick={onSaveClick}>
                {processing && activeSubmitAction === 'save' ? 'Saving...' : saveLabel}
            </Button>
            <Button type="submit" disabled={processing} onClick={onSaveContinueClick}>
                {processing && activeSubmitAction === 'continue' ? 'Saving...' : saveContinueLabel}
            </Button>
        </div>
    );
}
