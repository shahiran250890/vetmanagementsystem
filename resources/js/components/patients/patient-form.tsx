import { useMemo } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import { formPageInsetSectionClassName, nativeTextareaClassName } from '@/components/form-page-layout';
import { GenderSelection } from '@/components/gender-selection';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
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

    const patientTypeOptions = useMemo(() => {
        const opts: { value: string; label: string }[] = [];

        if (allowedPatientType === null || allowedPatientType === 'animal') {
            opts.push({ value: 'animal', label: 'Animal' });
        }

        if (allowedPatientType === null || allowedPatientType === 'human') {
            opts.push({ value: 'human', label: 'Human' });
        }

        return opts;
    }, [allowedPatientType]);

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <FormDropdown
                        id="patient_type"
                        name="patient_type"
                        label="Patient type"
                        options={patientTypeOptions}
                        value={data.patient_type}
                        onValueChange={(v) => setData('patient_type', v as PatientType)}
                        allowEmpty={false}
                        placeholder="Search…"
                        disabled={allowedPatientType !== null}
                    />
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

                <GenderSelection
                    id="sex"
                    name="sex"
                    value={data.sex}
                    onChange={(value) => setData('sex', value)}
                    error={errors.sex}
                />

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
                    <FormDropdown
                        id="status"
                        name="status"
                        label="Status"
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'deceased', label: 'Deceased' },
                            { value: 'transferred', label: 'Transferred' },
                        ]}
                        value={data.status}
                        onValueChange={(v) => setData('status', v)}
                        allowEmpty={false}
                        placeholder="Search…"
                    />
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
                <div
                    className={cn(
                        'grid gap-4 md:grid-cols-2',
                        formPageInsetSectionClassName,
                    )}
                >
                    <h3 className="md:col-span-2 text-sm font-medium text-foreground">
                        Animal profile
                    </h3>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="owner_user_id"
                            name="animal_profile.owner_user_id"
                            label="Owner"
                            options={owners.map((owner) => ({
                                value: String(owner.id),
                                label: owner.name,
                            }))}
                            value={data.animal_profile.owner_user_id}
                            onValueChange={(v) => setData('animal_profile.owner_user_id', v)}
                            allowEmpty
                            emptyOptionLabel="Unassigned"
                            placeholder="Unassigned"
                        />
                        <InputError message={errors['animal_profile.owner_user_id']} />
                    </div>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="species"
                            name="animal_profile.species"
                            label="Species"
                            options={speciesOptions.map((species) => ({
                                value: species.name,
                                label: species.name,
                            }))}
                            value={data.animal_profile.species}
                            onValueChange={(v) => {
                                setData('animal_profile.species', v);
                                setData('animal_profile.breed', '');
                            }}
                            allowEmpty
                            emptyOptionLabel="Please select"
                            placeholder="Please select"
                        />
                        <InputError message={errors['animal_profile.species']} />
                    </div>
                    <div className="grid gap-2">
                        <FormDropdown
                            id="breed"
                            name="animal_profile.breed"
                            label="Breed"
                            options={breedOptions.map((breed) => ({
                                value: breed.name,
                                label: breed.name,
                            }))}
                            value={data.animal_profile.breed}
                            onValueChange={(v) => setData('animal_profile.breed', v)}
                            allowEmpty
                            emptyOptionLabel="Please select"
                            placeholder="Please select"
                            disabled={data.animal_profile.species === ''}
                        />
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
                <div
                    className={cn(
                        'grid gap-4 md:grid-cols-2',
                        formPageInsetSectionClassName,
                    )}
                >
                    <h3 className="md:col-span-2 text-sm font-medium text-foreground">
                        Human profile
                    </h3>
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
                        <FormDropdown
                            id="blood_type"
                            name="human_profile.blood_type_id"
                            label="Blood type"
                            options={bloodTypes.map((bloodType) => ({
                                value: String(bloodType.id),
                                label: bloodType.name,
                            }))}
                            value={data.human_profile.blood_type_id}
                            onValueChange={(v) => setData('human_profile.blood_type_id', v)}
                            allowEmpty
                            emptyOptionLabel="Please select"
                            placeholder="Please select"
                        />
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
                            className={cn(nativeTextareaClassName, 'min-h-20')}
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
                            className={nativeTextareaClassName}
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
                    className={nativeTextareaClassName}
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
                    className={nativeTextareaClassName}
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
                    className={nativeTextareaClassName}
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
