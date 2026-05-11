import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

export function StickyStaffActionBar({
    processing,
    activeSubmitAction,
    backHref,
    onSaveClick,
    onSaveContinueClick,
}: {
    processing: boolean;
    activeSubmitAction: 'save' | 'continue';
    backHref: string;
    onSaveClick: () => void;
    onSaveContinueClick: () => void;
}) {
    return (
        <div className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky bottom-4 z-10 mt-6 flex flex-wrap items-center justify-end gap-2 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur">
            <Button type="button" variant="outline" asChild>
                <Link href={backHref}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={processing} onClick={onSaveClick}>
                {processing && activeSubmitAction === 'save' ? 'Saving...' : 'Save'}
            </Button>
            <Button type="submit" disabled={processing} onClick={onSaveContinueClick}>
                {processing && activeSubmitAction === 'continue' ? 'Saving...' : 'Save & Continue'}
            </Button>
        </div>
    );
}
