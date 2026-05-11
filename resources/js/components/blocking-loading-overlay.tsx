import { createPortal } from 'react-dom';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function BlockingLoadingOverlay({
    open,
    title = 'Please wait…',
    description,
}: {
    open: boolean;
    title?: string;
    description?: string;
}) {
    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            className={cn(
                'fixed inset-0 z-[10000] flex items-center justify-center',
                'bg-background/65 backdrop-blur-md',
                'animate-in fade-in-50 duration-200',
            )}
            aria-busy="true"
            aria-live="polite"
            aria-modal="true"
            aria-labelledby="blocking-loading-title"
        >
            <div
                className={cn(
                    'bg-card text-card-foreground border-border mx-4 max-w-md rounded-2xl border px-8 py-10 shadow-xl',
                    'flex flex-col items-center gap-5 text-center',
                )}
            >
                <Spinner className="text-primary size-10" aria-hidden />
                <div className="space-y-2">
                    <p id="blocking-loading-title" className="text-base font-semibold tracking-tight">
                        {title}
                    </p>
                    {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
                </div>
            </div>
        </div>,
        document.body,
    );
}
