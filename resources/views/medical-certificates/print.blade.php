<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Medical certificate {{ $certificate->certificate_number }}</title>
    <style>
        body { font-family: DejaVu Sans, Helvetica, Arial, sans-serif; font-size: 12pt; color: #111; margin: 2rem; line-height: 1.45; }
        h1 { font-size: 1.25rem; margin: 0 0 1rem; text-align: center; }
        .muted { color: #555; font-size: 0.9rem; }
        .block { margin-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 0.35rem 0; vertical-align: top; }
        td.label { width: 32%; font-weight: 600; }
        .letterhead { border-bottom: 1px solid #ccc; padding-bottom: 0.75rem; margin-bottom: 1.25rem; }
        .void { color: #b00020; font-weight: bold; text-align: center; margin: 1rem 0; font-size: 1.1rem; }
        .sign { margin-top: 2.5rem; }
        @media print {
            body { margin: 1rem; }
            a { color: inherit; text-decoration: none; }
        }
    </style>
</head>
<body>
    @if ($certificate->status === \App\Enums\Medical\MedicalCertificateStatus::Voided)
        <div class="void">VOID — This certificate has been cancelled.</div>
    @endif

    <div class="letterhead">
        <strong>{{ e($organization?->organization_name ?? config('app.name')) }}</strong><br>
        @if ($organization?->organization_address)
            <span class="muted">{!! nl2br(e($organization->organization_address)) !!}</span><br>
        @endif
        <span class="muted">
            @if ($organization?->organization_phone)Tel: {{ e($organization->organization_phone) }}@endif
            @if ($organization?->organization_email) · Email: {{ e($organization->organization_email) }}@endif
        </span>
    </div>

    <h1>Medical Certificate / Sick Leave</h1>

    <p class="muted block">Reference: <strong>{{ e($certificate->certificate_number) }}</strong>
        · Issued: {{ $certificate->issued_at?->timezone(config('app.timezone'))->format('d M Y, H:i') ?? '—' }}</p>

    <table>
        <tr>
            <td class="label">Patient name</td>
            <td>{{ e($certificate->patient->name) }}</td>
        </tr>
        @if ($certificate->patient->humanProfile?->identification_number)
            <tr>
                <td class="label">NRIC / Identification</td>
                <td>{{ e($certificate->patient->humanProfile->identification_number) }}</td>
            </tr>
        @endif
        @if ($certificate->employer_name)
            <tr>
                <td class="label">Employer / School</td>
                <td>{{ e($certificate->employer_name) }}</td>
            </tr>
        @endif
        <tr>
            <td class="label">Unfit for duty from</td>
            <td>{{ $certificate->unfit_from?->format('d M Y') }}</td>
        </tr>
        <tr>
            <td class="label">Unfit for duty until</td>
            <td>{{ $certificate->unfit_to?->format('d M Y') }} (inclusive)</td>
        </tr>
        @if ($certificate->remarks)
            <tr>
                <td class="label">Remarks</td>
                <td>{!! nl2br(e($certificate->remarks)) !!}</td>
            </tr>
        @endif
    </table>

    <p class="block" style="margin-top:1.5rem;">
        This is to certify that the above-named patient was examined and is unfit for normal duties
        for the period stated (Malaysian clinic use — adjust wording per your clinical governance).
    </p>

    <div class="sign">
        <p><strong>{{ e($certificate->doctor->name) }}</strong><br>
            @if ($certificate->doctor->mmc_registration_number)
                MMC No.: {{ e($certificate->doctor->mmc_registration_number) }}<br>
            @endif
            Registered medical practitioner
        </p>
    </div>

    <p class="muted" style="margin-top:2rem;font-size:0.85rem;">
        Printed document — verify authenticity with the issuing clinic if required.
    </p>
</body>
</html>
