<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Staff directory</title>
    <style>
        body { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; color: #111; margin: 24px; }
        h1 { font-size: 18px; margin: 0 0 8px; }
        .meta { color: #666; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; vertical-align: top; }
        th { background: #f4f4f5; font-weight: 600; }
        tr:nth-child(even) td { background: #fafafa; }
        @media print {
            body { margin: 12px; }
        }
    </style>
</head>
<body>
    <h1>Staff directory</h1>
    <p class="meta">Generated {{ $generatedAt }}</p>
    <table>
        <thead>
            <tr>
                <th>Staff number</th>
                <th>Name</th>
                <th>IC/Passport</th>
                <th>Position</th>
                <th>Department</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Login</th>
                <th>Employment</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($staffRows as $staff)
                <tr>
                    <td>{{ $staff->staff_number }}</td>
                    <td>{{ $staff->full_name }}</td>
                    <td>{{ $staff->nric_passport }}</td>
                    <td>{{ $staff->position }}</td>
                    <td>{{ $staff->department }}</td>
                    <td>{{ $staff->mobile_number }}</td>
                    <td>{{ $staff->email }}</td>
                    <td>
                        @if (!$staff->user)
                            No account
                        @elseif ($staff->user->is_enabled)
                            Enabled
                        @else
                            Disabled
                        @endif
                    </td>
                    <td>{{ $staff->employment_status }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
