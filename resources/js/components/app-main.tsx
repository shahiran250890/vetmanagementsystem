import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Shared horizontal rhythm + max width for all authenticated module pages. */
export const appMainInnerClassName =
    'relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8';

type AppMainProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Primary scroll region under {@link AppSidebarHeader}: one consistent canvas
 * for dashboard, clinical modules, billing, and settings.
 */
export function AppMain({ children, className }: AppMainProps) {
    const { url } = usePage();
    const reduceMotion = useReducedMotion();

    return (
        <div
            className={cn(
                'relative flex-1 overflow-x-hidden bg-zinc-50/90 dark:bg-zinc-950',
                className,
            )}
        >
            <div className={appMainInnerClassName}>
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={url}
                        initial={
                            reduceMotion
                                ? false
                                : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={
                            reduceMotion
                                ? { opacity: 1 }
                                : { opacity: 0, y: -6 }
                        }
                        transition={{
                            duration: reduceMotion ? 0 : 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        className="min-w-0"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
