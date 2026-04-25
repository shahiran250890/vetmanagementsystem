import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

type ConfirmDeleteDialogProps = {
    open: boolean;
    title?: string;
    description: string;
    errorMessage?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    processing?: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    onCancel?: () => void;
};

export default function ConfirmDeleteDialog({
    open,
    title = 'Confirm deletion',
    description,
    errorMessage,
    confirmLabel = 'Confirm Delete',
    cancelLabel = 'Cancel',
    processing = false,
    onOpenChange,
    onConfirm,
    onCancel,
}: ConfirmDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {errorMessage && (
                    <p className="text-sm text-destructive">{errorMessage}</p>
                )}
                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={processing}
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={processing}
                        onClick={onConfirm}
                    >
                        {processing ? (
                            <span className="inline-flex items-center gap-2">
                                <Spinner className="size-4" />
                                Deleting...
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
