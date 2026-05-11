import { isAxiosError } from 'axios';
import { CheckCircle2, File, FileImage, FileText, Upload, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { BlockingLoadingOverlay } from '@/components/blocking-loading-overlay';
import { Label } from '@/components/ui/label';
import { useToast } from '@/contexts/toast-context';
import { fileDeleteErrorAlert, fileDeleteSuccessAlert } from '@/lib/file-asset-swal';
import { queueAfterPaint } from '@/lib/queue-after-paint';
import { cn } from '@/lib/utils';
import { api } from '@/services/api-client';

export type UploadDropzoneDocument = {
    id?: string;
    name?: string;
    size?: number;
    mime_type?: string;
    view_url?: string;
    download_url?: string;
};

type UploadItem = {
    clientId: string;
    id?: string;
    name: string;
    size: number;
    mimeType: string;
    progress: number;
    completed: boolean;
    failed: boolean;
    viewUrl?: string;
    downloadUrl?: string;
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function pickFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) {
        return FileImage;
    }

    if (
        mimeType.includes('pdf')
        || mimeType.includes('word')
        || mimeType.includes('text')
        || mimeType.includes('excel')
        || mimeType.includes('sheet')
    ) {
        return FileText;
    }

    return File;
}

function messageFromApiError(error: unknown): string {
    if (isAxiosError(error)) {
        const payload = error.response?.data;

        if (payload && typeof payload === 'object' && 'message' in payload) {
            const candidate = (payload as { message: unknown }).message;

            if (typeof candidate === 'string' && candidate.trim() !== '') {
                return candidate;
            }
        }

        if (error.message.trim() !== '') {
            return error.message;
        }
    }

    return 'The file could not be removed. Please try again.';
}

function toUploadItems(defaultDocuments: UploadDropzoneDocument[]): UploadItem[] {
    return defaultDocuments.map((document, index) => ({
        clientId: `existing-${index}-${document.name ?? 'document'}`,
        id: document.id && document.id !== '' ? document.id : undefined,
        name: document.name && document.name !== '' ? document.name : 'document',
        size: Number.isFinite(document.size) ? Number(document.size) : 0,
        mimeType: document.mime_type ?? '',
        progress: 100,
        completed: true,
        failed: false,
        viewUrl: document.view_url,
        downloadUrl: document.download_url,
    }));
}

export function FileUploadDropzone({
    name,
    label,
    helperText,
    defaultDocuments = [],
    uploadUrl,
    moduleName,
    deleteUrlBase,
    recordId,
    category,
    className,
}: {
    name: string;
    label: string;
    helperText?: string;
    defaultDocuments?: UploadDropzoneDocument[];
    uploadUrl: string;
    moduleName: string;
    deleteUrlBase?: string;
    recordId?: string | number;
    category?: string;
    className?: string;
}) {
    const { push } = useToast();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const abortControllersRef = useRef<Record<string, AbortController>>({});
    const [isDragging, setIsDragging] = useState(false);
    const [isDeletingFile, setIsDeletingFile] = useState(false);
    const [uploads, setUploads] = useState<UploadItem[]>(() => toUploadItems(defaultDocuments));
    const previousServerDocumentsSignatureRef = useRef<string | null>(null);

    const serverDocumentsSignature = useMemo(
        () =>
            JSON.stringify(
                defaultDocuments.map((document) => ({
                    id: document.id ?? '',
                    name: document.name ?? '',
                    size: document.size ?? 0,
                    mime_type: document.mime_type ?? '',
                    view_url: document.view_url ?? '',
                    download_url: document.download_url ?? '',
                })),
            ),
        [defaultDocuments],
    );

    useEffect(() => {
        if (previousServerDocumentsSignatureRef.current === serverDocumentsSignature) {
            return;
        }

        previousServerDocumentsSignatureRef.current = serverDocumentsSignature;
        setUploads(toUploadItems(defaultDocuments));
    }, [defaultDocuments, serverDocumentsSignature]);

    useEffect(() => {
        return () => {
            Object.values(abortControllersRef.current).forEach((controller) => controller.abort());
        };
    }, []);

    const documentsMetadataValue = useMemo(() => {
        const completedFiles = uploads
            .filter((file) => file.completed)
            .map((file) => ({
                id: file.id ?? file.clientId,
                name: file.name,
                size: file.size,
                mime_type: file.mimeType,
                view_url: file.viewUrl ?? null,
                download_url: file.downloadUrl ?? null,
            }));

        return JSON.stringify(completedFiles);
    }, [uploads]);

    const uploadSingleFile = async (item: UploadItem, file: File): Promise<void> => {
        const controller = new AbortController();
        abortControllersRef.current[item.clientId] = controller;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('module_name', moduleName);

        if (recordId !== undefined && recordId !== null && String(recordId).trim() !== '') {
            formData.append('record_id', String(recordId));
        }

        if (category !== undefined && category.trim() !== '') {
            formData.append('category', category);
        }

        try {
            const response = await api.post<{
                id: string;
                name: string;
                size: number;
                mime_type: string;
                view_url: string;
                download_url: string;
            }>(uploadUrl, formData, {
                signal: controller.signal,
                onUploadProgress: (event) => {
                    const total = event.total ?? 0;
                    const percent = total > 0 ? Math.min(Math.round((event.loaded / total) * 100), 98) : 50;
                    setUploads((currentUploads) =>
                        currentUploads.map((upload) =>
                            upload.clientId === item.clientId
                                ? {
                                      ...upload,
                                      progress: percent,
                                  }
                                : upload,
                        ),
                    );
                },
            });

            setUploads((currentUploads) =>
                currentUploads.map((upload) =>
                    upload.clientId === item.clientId
                        ? {
                              ...upload,
                              id: response.data.id,
                              name: response.data.name,
                              size: response.data.size,
                              mimeType: response.data.mime_type,
                              progress: 100,
                              completed: true,
                              failed: false,
                              viewUrl: response.data.view_url,
                              downloadUrl: response.data.download_url,
                          }
                        : upload,
                ),
            );
        } catch {
            setUploads((currentUploads) =>
                currentUploads.map((upload) =>
                    upload.clientId === item.clientId
                        ? {
                              ...upload,
                              failed: true,
                              completed: false,
                              progress: 0,
                          }
                        : upload,
                ),
            );
            push(`Upload failed for ${item.name}.`, 'error');
        } finally {
            delete abortControllersRef.current[item.clientId];
        }
    };

    const enqueueFiles = (fileList: FileList | null): void => {
        if (!fileList || fileList.length === 0) {
            return;
        }

        const fileEntries = Array.from(fileList).map((file) => {
            const clientId = `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`;

            const item: UploadItem = {
                clientId,
                name: file.name,
                size: file.size,
                mimeType: file.type,
                progress: 0,
                completed: false,
                failed: false,
            };

            return { item, file };
        });

        setUploads((currentUploads) => [...currentUploads, ...fileEntries.map((entry) => entry.item)]);
        fileEntries.forEach((entry) => {
            void uploadSingleFile(entry.item, entry.file);
        });
    };

    const removeUpload = async (file: UploadItem): Promise<void> => {
        const activeController = abortControllersRef.current[file.clientId];

        if (activeController !== undefined) {
            activeController.abort();
            delete abortControllersRef.current[file.clientId];
        }

        if (file.id !== undefined && deleteUrlBase !== undefined) {
            const displayName = file.name;
            setIsDeletingFile(true);

            try {
                await api.delete(`${deleteUrlBase}/${file.id}`, { skipErrorToast: true });
                setUploads((currentUploads) => currentUploads.filter((upload) => upload.clientId !== file.clientId));
                queueAfterPaint(() => {
                    void fileDeleteSuccessAlert(displayName);
                });
            } catch (error: unknown) {
                queueAfterPaint(() => {
                    void fileDeleteErrorAlert(messageFromApiError(error));
                });

                return;
            } finally {
                setIsDeletingFile(false);
            }

            return;
        }

        setUploads((currentUploads) => currentUploads.filter((upload) => upload.clientId !== file.clientId));
    };

    return (
        <div className={cn('grid gap-4', className)}>
            <BlockingLoadingOverlay
                open={isDeletingFile}
                title="Removing file…"
                description="Please keep this tab open until the process finishes."
            />
            <Label htmlFor={name}>{label}</Label>
            <input id={name} name={name} type="hidden" value={documentsMetadataValue} readOnly />
            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                    enqueueFiles(event.currentTarget.files);
                    event.currentTarget.value = '';
                }}
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                }}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    enqueueFiles(event.dataTransfer.files);
                }}
                className={cn(
                    'bg-background rounded-xl border-2 border-dashed px-6 py-8 text-center transition-transform duration-200',
                    isDragging
                        ? 'border-primary bg-primary/5 scale-[1.01]'
                        : 'border-border hover:border-primary/60 hover:bg-muted/30',
                )}
            >
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={cn(
                            'rounded-full p-3 transition-colors',
                            isDragging ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                        )}
                    >
                        <Upload className="size-6" aria-hidden />
                    </div>
                    <div className="space-y-1">
                        <p className="font-medium">Drag and drop files here</p>
                        <p className="text-muted-foreground text-sm">or click to browse from your device</p>
                    </div>
                </div>
            </button>

            {uploads.length > 0 ? (
                <div className="space-y-3">
                    {uploads.map((file) => {
                        const FileIcon = pickFileIcon(file.mimeType);

                        return (
                            <div key={file.clientId} className="rounded-lg border p-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <FileIcon className="text-muted-foreground size-4 shrink-0" aria-hidden />
                                            <p className="truncate text-sm font-medium">{file.name}</p>
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                            <span>{formatFileSize(file.size)}</span>
                                            {file.completed ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600">
                                                    <CheckCircle2 className="size-3.5" aria-hidden />
                                                    Uploaded
                                                </span>
                                            ) : file.failed ? (
                                                <span className="text-destructive">Upload failed</span>
                                            ) : (
                                                <span>Uploading... {file.progress}%</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            {file.viewUrl ? (
                                                <a
                                                    href={file.viewUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    View
                                                </a>
                                            ) : null}
                                            {file.downloadUrl ? (
                                                <a href={file.downloadUrl} className="text-primary hover:underline">
                                                    Download
                                                </a>
                                            ) : null}
                                        </div>
                                        <div className="bg-muted h-2 overflow-hidden rounded-full">
                                            <div
                                                className={cn(
                                                    'h-full transition-all duration-300',
                                                    file.completed
                                                        ? 'bg-emerald-500'
                                                        : file.failed
                                                          ? 'bg-destructive'
                                                          : 'bg-primary animate-[pulse_1.2s_ease-in-out_infinite]',
                                                )}
                                                style={{ width: `${file.progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-muted-foreground hover:text-foreground rounded p-1"
                                        onClick={() => void removeUpload(file)}
                                        aria-label={`Remove ${file.name}`}
                                    >
                                        <X className="size-4" aria-hidden />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {helperText ? <p className="text-muted-foreground text-xs">{helperText}</p> : null}
        </div>
    );
}
