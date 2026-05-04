import { Button } from '@/components/ui/button';

type ListPageFilterActionsProps = {
    onApply: () => void;
    onReset: () => void;
    applyLabel?: string;
    resetLabel?: string;
};

/** Apply / Reset pairing for use inside `ListPageFilters` (patient list pattern). */
export function ListPageFilterActions({
    onApply,
    onReset,
    applyLabel = 'Apply',
    resetLabel = 'Reset',
}: ListPageFilterActionsProps) {
    return (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button type="button" onClick={onApply}>
                {applyLabel}
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
                {resetLabel}
            </Button>
        </div>
    );
}
