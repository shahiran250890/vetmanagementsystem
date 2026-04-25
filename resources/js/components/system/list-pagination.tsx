import { Button } from '@/components/ui/button';

type ListPaginationProps = {
    currentPage: number;
    lastPage: number;
    from: number | null;
    to: number | null;
    total: number;
    onPageChange: (page: number) => void;
};

export default function ListPagination({
    currentPage,
    lastPage,
    from,
    to,
    total,
    onPageChange,
}: ListPaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between rounded border px-4 py-3 text-sm">
            <p className="text-muted-foreground">
                Showing {from ?? 0} to {to ?? 0} of {total}
            </p>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage <= 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={currentPage >= lastPage}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
