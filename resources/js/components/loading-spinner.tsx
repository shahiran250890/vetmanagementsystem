export function LoadingSpinner({ label = 'Loading…' }: { label?: string }) {
    return (
        <div
            className="text-muted-foreground flex flex-col items-center justify-center gap-3 py-16"
            role="status"
        >
            <div
                className="border-border h-10 w-10 animate-spin rounded-full border-2 border-t-primary"
                aria-hidden
            />
            <span className="text-sm">{label}</span>
        </div>
    );
}
