import { Download, Printer, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

import MedicalHistoryTimeline from './medical-history-timeline';
import type { MedicalRecord, Patient } from './types';

const pageSize = 5;

export default function MedicalHistoryTab({ patient }: { patient: Patient }) {
    const [search, setSearch] = useState('');
    const [doctor, setDoctor] = useState('all');
    const [status, setStatus] = useState('all');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [page, setPage] = useState(1);
    const [selectedEntry, setSelectedEntry] = useState<MedicalRecord | null>(
        null,
    );

    const entries = useMemo(
        () =>
            [...patient.history_entries].sort((first, second) =>
                String(second.visit_at ?? second.entry_date ?? '').localeCompare(
                    String(first.visit_at ?? first.entry_date ?? ''),
                ),
            ) as MedicalRecord[],
        [patient.history_entries],
    );

    const doctorOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    entries
                        .map((entry) => entry.creator?.name)
                        .filter((name): name is string => Boolean(name)),
                ),
            ),
        [entries],
    );

    const filteredEntries = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return entries.filter((entry) => {
            const visitDate = String(entry.visit_at ?? entry.entry_date ?? '');
            const matchesSearch =
                normalizedSearch === '' ||
                [
                    entry.title,
                    entry.symptoms,
                    entry.diagnosis,
                    entry.details,
                    entry.visit_type,
                    entry.entry_type,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedSearch);
            const matchesDoctor =
                doctor === 'all' || entry.creator?.name === doctor;
            const matchesStatus =
                status === 'all' || entry.visit_status === status;
            const matchesFrom = fromDate === '' || visitDate >= fromDate;
            const matchesTo = toDate === '' || visitDate <= toDate;

            return (
                matchesSearch &&
                matchesDoctor &&
                matchesStatus &&
                matchesFrom &&
                matchesTo
            );
        });
    }, [doctor, entries, fromDate, search, status, toDate]);

    const totalPages = Math.max(1, Math.ceil(filteredEntries.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginatedEntries = filteredEntries.slice(
        (safePage - 1) * pageSize,
        safePage * pageSize,
    );

    const updateFilter = (callback: () => void) => {
        callback();
        setPage(1);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <CardTitle>Medical History</CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {filteredEntries.length} visit
                                {filteredEntries.length === 1 ? '' : 's'} found
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled
                            >
                                <Download
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Export
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.print()}
                            >
                                <Printer
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Print
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <div className="grid gap-2 md:col-span-2 xl:col-span-2">
                        <Label htmlFor="history-search">Search visits</Label>
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="history-search"
                                className="pl-9"
                                value={search}
                                onChange={(event) =>
                                    updateFilter(() =>
                                        setSearch(event.target.value),
                                    )
                                }
                                placeholder="Complaint, diagnosis, notes..."
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="history-from">From</Label>
                        <Input
                            id="history-from"
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                updateFilter(() => setFromDate(event.target.value))
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="history-to">To</Label>
                        <Input
                            id="history-to"
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                updateFilter(() => setToDate(event.target.value))
                            }
                        />
                    </div>
                    <FormDropdown
                        id="history-doctor"
                        name="history_doctor"
                        label="Doctor"
                        options={[
                            { value: 'all', label: 'All doctors' },
                            ...doctorOptions.map((option) => ({
                                value: option,
                                label: option,
                            })),
                        ]}
                        value={doctor}
                        onValueChange={(v) => updateFilter(() => setDoctor(v))}
                        allowEmpty={false}
                        placeholder="Search…"
                        className="gap-2"
                    />
                    <div className="md:col-start-2 xl:col-start-auto">
                        <FormDropdown
                            id="history-status"
                            name="history_status"
                            label="Status"
                            options={[
                                { value: 'all', label: 'All statuses' },
                                { value: 'waiting', label: 'Waiting' },
                                { value: 'in_progress', label: 'In progress' },
                                { value: 'completed', label: 'Completed' },
                                { value: 'cancelled', label: 'Cancelled' },
                            ]}
                            value={status}
                            onValueChange={(v) => updateFilter(() => setStatus(v))}
                            allowEmpty={false}
                            placeholder="Search…"
                            className="gap-2"
                        />
                    </div>
                </CardContent>
            </Card>

            <MedicalHistoryTimeline
                entries={paginatedEntries}
                onSelectEntry={setSelectedEntry}
            />

            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Page {safePage} of {totalPages}
                </p>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={safePage <= 1}
                        onClick={() => setPage((current) => current - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={safePage >= totalPages}
                        onClick={() => setPage((current) => current + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Sheet
                open={selectedEntry !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedEntry(null);
                    }
                }}
            >
                <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
                    {selectedEntry ? (
                        <>
                            <SheetHeader>
                                <SheetTitle>{selectedEntry.title}</SheetTitle>
                                <SheetDescription>
                                    {selectedEntry.visit_at ??
                                        selectedEntry.entry_date ??
                                        'Visit details'}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="space-y-5 px-4 pb-6">
                                <Detail
                                    label="Doctor"
                                    value={selectedEntry.creator?.name}
                                />
                                <Detail
                                    label="Case number"
                                    value={selectedEntry.visit_case_number}
                                />
                                <Detail
                                    label="Status"
                                    value={selectedEntry.visit_status}
                                />
                                <Detail
                                    label="Clinic"
                                    value={selectedEntry.clinic_location}
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        Symptoms (patient complaint)
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                                        {selectedEntry.symptoms ??
                                            selectedEntry.details ??
                                            '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        Diagnosis (clinical assessment)
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                                        {selectedEntry.diagnosis ?? '-'}
                                    </p>
                                </div>
                                {selectedEntry.details ? (
                                    <div>
                                        <p className="text-sm font-medium">
                                            Legacy notes
                                        </p>
                                        <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-muted/60 p-4 text-sm leading-6">
                                            {selectedEntry.details}
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </>
                    ) : null}
                </SheetContent>
            </Sheet>
        </div>
    );
}

function Detail({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="mt-1 text-sm font-medium">{value ?? '-'}</p>
        </div>
    );
}
