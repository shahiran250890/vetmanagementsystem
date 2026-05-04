import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
};

export const FormInput = forwardRef<HTMLInputElement, Props>(
    function FormInput({ label, error, id, className = '', ...rest }, ref) {
        const inputId = id ?? rest.name;

        return (
            <div className="grid gap-2">
                <Label htmlFor={inputId}>{label}</Label>
                <Input ref={ref} id={inputId} className={className} {...rest} />
                <InputError message={error} />
            </div>
        );
    },
);
