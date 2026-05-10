import { FormDropdown } from '@/components/form-dropdown';
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

                <FormDropdown
                    id="patient-status"
                    name="patient_status_filter"
                    label="Status"
                    options={[
                        { value: '', label: 'All statuses' },
                        { value: 'active', label: 'Active' },
                        { value: 'deceased', label: 'Deceased' },
                        { value: 'transferred', label: 'Transferred' },
                    ]}
                    value={status}
                    onValueChange={onStatusChange}
                    allowEmpty={false}
                    placeholder="All statuses"
                    className="gap-2"
                />

                <ListPageFilterActions onApply={onApply} onReset={onReset} />
            </div>
        </ListPageFilters>
    );
}
