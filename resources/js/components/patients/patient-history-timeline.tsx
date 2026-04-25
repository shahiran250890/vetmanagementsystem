import type { HistoryEntry } from '@/types/patient';

export default function PatientHistoryTimeline({
    entries,
}: {
    entries: HistoryEntry[];
}) {
    if (entries.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                No history entries yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {entries.map((entry) => (
                <article key={entry.id} className="rounded-lg border p-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{entry.entry_date}</span>
                        {entry.entry_type ? <span>- {entry.entry_type}</span> : null}
                        {entry.creator?.name ? (
                            <span>- by {entry.creator.name}</span>
                        ) : null}
                    </div>
                    <div className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
                        {entry.visit_case_number ? (
                            <span>Case: {entry.visit_case_number}</span>
                        ) : null}
                        {entry.visit_at ? <span>Visit: {entry.visit_at}</span> : null}
                        {entry.clinic_location ? (
                            <span>Location: {entry.clinic_location}</span>
                        ) : null}
                        {entry.visit_type ? <span>Type: {entry.visit_type}</span> : null}
                        {entry.visit_status ? (
                            <span>Status: {entry.visit_status}</span>
                        ) : null}
                        {entry.appointment_id ? (
                            <span>Appointment: {entry.appointment_id}</span>
                        ) : null}
                    </div>
                    <h3 className="mt-2 font-medium">{entry.title}</h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm">
                        {entry.details}
                    </p>
                </article>
            ))}
        </div>
    );
}
