import { Activity, CalendarClock, Stethoscope } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { MedicalRecord } from './types';

function statusClassName(status: string | null | undefined): string {
    if (status === 'completed') {
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200';
    }

    if (status === 'cancelled') {
        return 'bg-destructive/10 text-destructive';
    }

    if (status === 'in_progress') {
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
    }

    return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200';
}

export default function MedicalHistoryTimeline({
    entries,
    onSelectEntry,
}: {
    entries: MedicalRecord[];
    onSelectEntry: (entry: MedicalRecord) => void;
}) {
    if (entries.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                No visits match the selected filters.
            </div>
        );
    }

    return (
        <div className="relative space-y-5 before:absolute before:top-3 before:bottom-3 before:left-5 before:w-px before:bg-border">
            {entries.map((entry) => (
                <article key={entry.id} className="relative pl-14">
                    <span className="absolute top-5 left-0 z-10 flex size-10 items-center justify-center rounded-full border bg-background shadow-sm">
                        <Stethoscope
                            className="size-4 text-primary"
                            aria-hidden="true"
                        />
                    </span>

                    <Card className="hover:border-primary/30 hover:shadow-md">
                        <CardHeader className="gap-3">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                        <CalendarClock
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            {entry.visit_at ??
                                                entry.entry_date ??
                                                'Unscheduled visit'}
                                        </span>
                                        {entry.creator?.name ? (
                                            <span>· Dr. {entry.creator.name}</span>
                                        ) : null}
                                    </div>
                                    <CardTitle className="text-base">
                                        {entry.title}
                                    </CardTitle>
                                </div>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        'capitalize',
                                        statusClassName(entry.visit_status),
                                    )}
                                >
                                    {entry.visit_status?.replace('_', ' ') ??
                                        'waiting'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6">
                                {entry.symptoms ?? entry.details ?? '-'}
                            </p>
                            <p className="line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-muted-foreground">
                                Diagnosis: {entry.diagnosis ?? '-'}
                            </p>

                            <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-2 xl:grid-cols-3">
                                <Meta label="Case" value={entry.visit_case_number} />
                                <Meta label="Type" value={entry.visit_type} />
                                <Meta
                                    label="Clinic"
                                    value={entry.clinic_location}
                                />
                                <Meta
                                    label="Appointment"
                                    value={entry.appointment_id}
                                />
                                <Meta
                                    label="Entry type"
                                    value={entry.entry_type}
                                />
                                <Meta
                                    label="Follow-up"
                                    value={entry.follow_up_date}
                                />
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Activity
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Vital signs and prescriptions are shown when
                                    available in the visit record.
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onSelectEntry(entry)}
                                >
                                    View details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </article>
            ))}
        </div>
    );
}

function Meta({
    label,
    value,
}: {
    label: string;
    value: string | number | null | undefined;
}) {
    return (
        <div>
            <span className="font-medium text-foreground">{label}:</span>{' '}
            {value ?? '-'}
        </div>
    );
}
