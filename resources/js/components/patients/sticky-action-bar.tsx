import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export default function StickyActionBar({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'sticky bottom-0 z-20 -mx-6 mt-6 border-t bg-background/95 px-6 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur supports-[backdrop-filter]:bg-background/80',
                className,
            )}
        >
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                {children}
            </div>
        </div>
    );
}
