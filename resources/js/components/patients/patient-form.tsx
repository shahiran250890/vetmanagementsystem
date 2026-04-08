import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OwnerOption = {
    id: number;
    name: string;
};

export type PatientFormData = {
    user_id: string;
    name: string;
    species: string;
    breed: string;
    sex: string;
    date_of_birth: string;
    color: string;
    microchip_number: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    allergies: string;
    current_medications: string;
    latest_weight_kg: string;
    vaccination_status: string;
    status: string;
    notes: string;
};

type PatientFormProps = {
    data: PatientFormData;
    setData: (key: keyof PatientFormData, value: string) => void;
    errors: Record<string, string>;
    processing: boolean;
    owners: OwnerOption[];
    submitLabel: string;
};

export default function PatientForm({
    data,
    setData,
    errors,
    processing,
    owners,
    submitLabel,
}: PatientFormProps) {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(event) => setData('name', event.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="species">Species</Label>
                    <Input
                        id="species"
                        value={data.species}
                        onChange={(event) =>
                            setData('species', event.target.value)
                        }
                    />
                    <InputError message={errors.species} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                        id="breed"
                        value={data.breed}
                        onChange={(event) => setData('breed', event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="sex">Sex</Label>
                    <Input
                        id="sex"
                        value={data.sex}
                        onChange={(event) => setData('sex', event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="date_of_birth">Date of birth</Label>
                    <Input
                        id="date_of_birth"
                        type="date"
                        value={data.date_of_birth}
                        onChange={(event) =>
                            setData('date_of_birth', event.target.value)
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                        id="color"
                        value={data.color}
                        onChange={(event) => setData('color', event.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="microchip_number">Microchip number</Label>
                    <Input
                        id="microchip_number"
                        value={data.microchip_number}
                        onChange={(event) =>
                            setData('microchip_number', event.target.value)
                        }
                    />
                    <InputError message={errors.microchip_number} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <select
                        id="status"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={data.status}
                        onChange={(event) =>
                            setData('status', event.target.value)
                        }
                    >
                        <option value="active">Active</option>
                        <option value="deceased">Deceased</option>
                        <option value="transferred">Transferred</option>
                    </select>
                    <InputError message={errors.status} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="user_id">Owner</Label>
                    <select
                        id="user_id"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={data.user_id}
                        onChange={(event) =>
                            setData('user_id', event.target.value)
                        }
                    >
                        <option value="">Unassigned</option>
                        {owners.map((owner) => (
                            <option key={owner.id} value={String(owner.id)}>
                                {owner.name}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.user_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="latest_weight_kg">Latest weight (kg)</Label>
                    <Input
                        id="latest_weight_kg"
                        type="number"
                        step="0.01"
                        value={data.latest_weight_kg}
                        onChange={(event) =>
                            setData('latest_weight_kg', event.target.value)
                        }
                    />
                    <InputError message={errors.latest_weight_kg} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="vaccination_status">Vaccination status</Label>
                    <Input
                        id="vaccination_status"
                        value={data.vaccination_status}
                        onChange={(event) =>
                            setData('vaccination_status', event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_name">
                        Emergency contact name
                    </Label>
                    <Input
                        id="emergency_contact_name"
                        value={data.emergency_contact_name}
                        onChange={(event) =>
                            setData('emergency_contact_name', event.target.value)
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="emergency_contact_phone">
                        Emergency contact phone
                    </Label>
                    <Input
                        id="emergency_contact_phone"
                        value={data.emergency_contact_phone}
                        onChange={(event) =>
                            setData('emergency_contact_phone', event.target.value)
                        }
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="allergies">Allergies</Label>
                <textarea
                    id="allergies"
                    className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.allergies}
                    onChange={(event) =>
                        setData('allergies', event.target.value)
                    }
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="current_medications">Current medications</Label>
                <textarea
                    id="current_medications"
                    className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.current_medications}
                    onChange={(event) =>
                        setData('current_medications', event.target.value)
                    }
                />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="notes">Clinical notes</Label>
                <textarea
                    id="notes"
                    className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={data.notes}
                    onChange={(event) => setData('notes', event.target.value)}
                />
            </div>

            <Button type="submit" disabled={processing}>
                {submitLabel}
            </Button>
        </div>
    );
}
