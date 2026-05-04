import {  useEffect } from 'react';
import type {ReactNode} from 'react';

type Props = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
};

export function ClinicModal({ open, title, onClose, children, footer }: Props) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <button
                type="button"
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
                aria-label="Close dialog"
                onClick={onClose}
            />
            <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold text-foreground">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1"
                    >
                        ✕
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto">{children}</div>
                {footer ? (
                    <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                        {footer}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
