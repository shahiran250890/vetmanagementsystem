import { CrudActionButtons } from '@/components/crud-action-buttons';

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
        <div className="border-border/80 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky bottom-4 z-10 mt-6 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur">
            <CrudActionButtons
                cancelHref={backHref}
                processing={processing}
                activeSubmitAction={activeSubmitAction}
                onSaveClick={onSaveClick}
                onSaveContinueClick={onSaveContinueClick}
            />
        </div>
    );
}
