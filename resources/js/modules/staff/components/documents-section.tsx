import { useMemo } from 'react';

import type { UploadDropzoneDocument } from '@/components/file-upload-dropzone';
import { FileUploadDropzone } from '@/components/file-upload-dropzone';

import type { StaffMember } from '../types';

function normalizeDocuments(documents: unknown[]): UploadDropzoneDocument[] {
    return documents
        .filter((document): document is Record<string, unknown> => typeof document === 'object' && document !== null)
        .map((document, index) => ({
            id: typeof document.id === 'string' ? document.id : `staff-document-${index}`,
            name: typeof document.name === 'string' ? document.name : undefined,
            size: typeof document.size === 'number' ? document.size : undefined,
            mime_type: typeof document.mime_type === 'string' ? document.mime_type : undefined,
            view_url: typeof document.view_url === 'string' ? document.view_url : undefined,
            download_url: typeof document.download_url === 'string' ? document.download_url : undefined,
        }));
}

export function DocumentsSection({ managedStaff }: { managedStaff?: StaffMember }) {
    const defaultDocuments = useMemo(
        () => normalizeDocuments(managedStaff?.documents ?? []),
        [managedStaff?.documents],
    );

    return (
        <FileUploadDropzone
            name="documents_metadata"
            label="Documents"
            defaultDocuments={defaultDocuments}
            uploadUrl="/settings/system/files"
            deleteUrlBase="/settings/system/files"
            moduleName="staff-management"
            recordId={managedStaff?.id}
            category="documents"
            helperText="Supported for multiple files. Uploaded file references are saved into staff document metadata."
        />
    );
}
