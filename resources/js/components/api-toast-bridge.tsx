import { useEffect } from 'react';

import { useToast } from '@/contexts/toast-context';
import { registerApiToastHandler } from '@/services/api-client';

export function ApiToastBridge() {
    const { push } = useToast();

    useEffect(() => {
        registerApiToastHandler((message, type) => {
            push(message, type);
        });
    }, [push]);

    return null;
}
