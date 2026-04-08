import { Label } from '@/components/ui/label';

type FormStatusToggleProps = {
    id: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    enabledText?: string;
    disabledText?: string;
    hiddenOffValue?: string;
};

export default function FormStatusToggle({
    id,
    name,
    checked,
    onChange,
    label = 'Status',
    enabledText = 'Enabled',
    disabledText = 'Disabled',
    hiddenOffValue = '0',
}: FormStatusToggleProps) {
    return (
        <div className="flex items-center justify-between rounded-md border px-3 py-2">
            <Label htmlFor={id}>{label}</Label>
            <input type="hidden" name={name} value={hiddenOffValue} />
            <label htmlFor={id} className="relative inline-flex cursor-pointer items-center">
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    value="1"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="sr-only"
                />
                <div className={`inline-flex h-7 min-w-24 items-center justify-center rounded-full px-3 text-xs font-medium transition ${checked ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {checked ? enabledText : disabledText}
                </div>
            </label>
        </div>
    );
}
