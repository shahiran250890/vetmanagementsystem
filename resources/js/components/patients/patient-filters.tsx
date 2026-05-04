import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PatientFiltersProps = {
    search: string;
    status: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
};

export default function PatientFilters({
    search,
    status,
    onSearchChange,
    onStatusChange,
    onApply,
    onReset,
}: PatientFiltersProps) {
    return (
        <ListPageFilters>
            <div className="grid w-full gap-4 md:grid-cols-[1fr_minmax(12rem,220px)_auto] md:items-end">
                <div className="grid gap-2">
                    <Label htmlFor="patient-search">Search</Label>
                    <Input
                        id="patient-search"
                        placeholder="Name, species, microchip..."
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="patient-status">Status</Label>
                    <select
                        id="patient-status"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={status}
                        onChange={(event) => onStatusChange(event.target.value)}
                    >
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="deceased">Deceased</option>
                        <option value="transferred">Transferred</option>
                    </select>
                </div>

                <ListPageFilterActions onApply={onApply} onReset={onReset} />
            </div>
        </ListPageFilters>
    );
}
