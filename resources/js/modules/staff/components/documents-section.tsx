import { nativeTextareaClassName } from '@/components/form-page-layout';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import type { StaffMember } from '../types';

export function DocumentsSection({ managedStaff }: { managedStaff?: StaffMember }) {
    const defaultJson =
        managedStaff?.documents && managedStaff.documents.length > 0
            ? JSON.stringify(managedStaff.documents, null, 2)
            : '';

    return (
        <div className="grid gap-2">
            <Label htmlFor="documents_metadata">Document references (JSON)</Label>
            <textarea
                id="documents_metadata"
                name="documents_metadata"
                rows={8}
                placeholder='[{"type":"ic_copy","label":"IC copy","url":"..."}]'
                defaultValue={defaultJson}
                className={cn(nativeTextareaClassName, 'font-mono text-xs')}
            />
            <p className="text-muted-foreground text-xs">
                Structured placeholders for IC, certificates, APC, contracts — wire to storage uploads when ready.
            </p>
        </div>
    );
}
