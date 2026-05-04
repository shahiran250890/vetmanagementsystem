import { useToast } from '@/contexts/toast-context';

export function ToastViewport() {
    const { toasts, dismiss } = useToast();

    return (
        <div className="pointer-events-none fixed right-4 bottom-4 z-[100] flex w-full max-w-sm flex-col gap-2">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg ${
                        t.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                            : 'border-red-200 bg-red-50 text-red-900'
                    }`}
                >
                    <div className="flex justify-between gap-3">
                        <p>{t.message}</p>
                        <button
                            type="button"
                            className="font-medium opacity-70 hover:opacity-100"
                            onClick={() => dismiss(t.id)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
