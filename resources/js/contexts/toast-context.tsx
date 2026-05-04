import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

type Toast = {
    id: number;
    message: string;
    type: 'success' | 'error';
};

type ToastContextValue = {
    toasts: Toast[];
    push: (message: string, type?: 'success' | 'error') => void;
    dismiss: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = useCallback(
        (message: string, type: 'success' | 'error' = 'success') => {
            const id = Date.now();
            setToasts((prev) => [...prev, { id, message, type }]);
            window.setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        },
        [],
    );

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = useMemo(
        () => ({ toasts, push, dismiss }),
        [toasts, push, dismiss],
    );

    return (
        <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
    );
}

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within ToastProvider');
    }

    return ctx;
}
