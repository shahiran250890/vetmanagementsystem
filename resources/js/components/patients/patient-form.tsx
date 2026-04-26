import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    AllowedPatientType,
    BloodTypeOption,
    OwnerOption,
    PatientFormData,
    SpeciesOption,
    PatientType,
} from '@/types/patient';

type ErrorBag = Record<string, string | undefined>;

type PatientFormProps = {
    data: PatientFormData;
    setData: (key: string, value: string | PatientType) => void;
    errors: ErrorBag;
    processing: boolean;
    owners: OwnerOption[];
    bloodTypes: BloodTypeOption[];
    speciesOptions: SpeciesOption[];
    submitLabel: string;
    allowedPatientType: AllowedPatientType;
};

export default function PatientForm({
    data,
    setData,
    errors,
    processing,
    owners,
    bloodTypes,
    speciesOptions,
    submitLabel,
    allowedPatientType,
}: PatientFormProps) {
    const selectedSpecies = speciesOptions.find(
        (species) => species.name === data.animal_profile.species,
    );
    const breedOptions = selectedSpecies?.breeds ?? [];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="patient_type">Patient type</Label>
                    <select
                        id="patient_type"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={data.patient_type}
                        disabled={allowedPatientType !== null}
                        onChange={(event) =>
                            setData('patient_type', event.target.value as PatientType)
                        }
                    >
                        {(allowedPatientType === null || allowedPatientType === 'animal') && <option value="animal">Animal</option>}
                        {(allowedPatientType === null || allowedPatientType === 'human') && <option value="human">Human</option>}
                    </select>
                    {allowedPatientType !== null && (
                        <p className="text-xs text-muted-foreground">
                            Patient type is locked by organization clinic type.
                        </p>
                    )}
                    <InputError message={errors.patient_type} />
                </div>

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
                    <Label htmlFor="sex">Sex</Label>
                    <select
                        id="sex"
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        value={data.sex}
                        onChange={(event) => setData('sex', event.target.value)}
                    >
                        <option value="">Please select</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                    </select>
                    <InputError message={errors.sex} />
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

            {data.patient_type === 'animal' ? (
                <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <h3 className="md:col-span-2 text-sm font-medium">Animal profile</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="owner_user_id">Owner</Label>
                        <select
                            id="owner_user_id"
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={data.animal_profile.owner_user_id}
                            onChange={(event) =>
                                setData('animal_profile.owner_user_id', event.target.value)
                            }
                        >
                            <option value="">Unassigned</option>
                            {owners.map((owner) => (
                                <option key={owner.id} value={String(owner.id)}>
                                    {owner.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors['animal_profile.owner_user_id']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="species">Species</Label>
                        <select
                            id="species"
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={data.animal_profile.species}
                            onChange={(event) =>
                                {
                                    setData('animal_profile.species', event.target.value);
                                    setData('animal_profile.breed', '');
                                }
                            }
                        >
                            <option value="">Please select</option>
                            {speciesOptions.map((species) => (
                                <option key={species.id} value={species.name}>
                                    {species.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors['animal_profile.species']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="breed">Breed</Label>
                        <select
                            id="breed"
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={data.animal_profile.breed}
                            disabled={data.animal_profile.species === ''}
                            onChange={(event) =>
                                setData('animal_profile.breed', event.target.value)
                            }
                        >
                            <option value="">Please select</option>
                            {breedOptions.map((breed) => (
                                <option key={breed.id} value={breed.name}>
                                    {breed.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                            id="color"
                            value={data.animal_profile.color}
                            onChange={(event) =>
                                setData('animal_profile.color', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="microchip_number">Microchip number</Label>
                        <Input
                            id="microchip_number"
                            value={data.animal_profile.microchip_number}
                            onChange={(event) =>
                                setData('animal_profile.microchip_number', event.target.value)
                            }
                        />
                        <InputError message={errors['animal_profile.microchip_number']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="latest_weight_kg">Latest weight (kg)</Label>
                        <Input
                            id="latest_weight_kg"
                            type="number"
                            step="0.01"
                            value={data.animal_profile.latest_weight_kg}
                            onChange={(event) =>
                                setData('animal_profile.latest_weight_kg', event.target.value)
                            }
                        />
                        <InputError message={errors['animal_profile.latest_weight_kg']} />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="vaccination_status">Vaccination status</Label>
                        <Input
                            id="vaccination_status"
                            value={data.animal_profile.vaccination_status}
                            onChange={(event) =>
                                setData('animal_profile.vaccination_status', event.target.value)
                            }
                        />
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <h3 className="md:col-span-2 text-sm font-medium">Human profile</h3>
                    <div className="grid gap-2">
                        <Label htmlFor="identification_number">ID number</Label>
                        <Input
                            id="identification_number"
                            value={data.human_profile.identification_number}
                            onChange={(event) =>
                                setData('human_profile.identification_number', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="blood_type">Blood type</Label>
                        <select
                            id="blood_type"
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={data.human_profile.blood_type_id}
                            onChange={(event) =>
                                setData(
                                    'human_profile.blood_type_id',
                                    event.target.value,
                                )
                            }
                        >
                            <option value="">Please select</option>
                            {bloodTypes.map((bloodType) => (
                                <option key={bloodType.id} value={String(bloodType.id)}>
                                    {bloodType.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors['human_profile.blood_type_id']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="primary_phone">Primary phone</Label>
                        <Input
                            id="primary_phone"
                            value={data.human_profile.primary_phone}
                            onChange={(event) =>
                                setData('human_profile.primary_phone', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="height_cm">Height (cm)</Label>
                        <Input
                            id="height_cm"
                            type="number"
                            step="0.01"
                            value={data.human_profile.height_cm}
                            onChange={(event) =>
                                setData('human_profile.height_cm', event.target.value)
                            }
                        />
                        <InputError message={errors['human_profile.height_cm']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="weight_kg">Weight (kg)</Label>
                        <Input
                            id="weight_kg"
                            type="number"
                            step="0.01"
                            value={data.human_profile.weight_kg}
                            onChange={(event) =>
                                setData('human_profile.weight_kg', event.target.value)
                            }
                        />
                        <InputError message={errors['human_profile.weight_kg']} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="blood_pressure">Blood pressure</Label>
                        <Input
                            id="blood_pressure"
                            value={data.human_profile.blood_pressure}
                            onChange={(event) =>
                                setData('human_profile.blood_pressure', event.target.value)
                            }
                        />
                        <InputError message={errors['human_profile.blood_pressure']} />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <textarea
                            id="address"
                            className="min-h-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.human_profile.address}
                            onChange={(event) =>
                                setData('human_profile.address', event.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="vital_medical_information">
                            Vital medical information
                        </Label>
                        <textarea
                            id="vital_medical_information"
                            className="min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={data.human_profile.vital_medical_information}
                            onChange={(event) =>
                                setData(
                                    'human_profile.vital_medical_information',
                                    event.target.value,
                                )
                            }
                        />
                        <InputError
                            message={errors['human_profile.vital_medical_information']}
                        />
                    </div>
                </div>
            )}

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
