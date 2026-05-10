<?php

namespace Database\Seeders;

use App\Models\Nationality;
use Illuminate\Database\Seeder;

class NationalitySeeder extends Seeder
{
    /**
     * Seed nationality options (country-based labels, ISO 3166-1 alpha-2 codes).
     */
    public function run(): void
    {
        foreach ($this->nationalityRows() as $row) {
            Nationality::query()->updateOrCreate(
                ['iso3166_alpha2' => $row['iso3166_alpha2']],
                [
                    'name' => $row['name'],
                    'sort_order' => $row['sort_order'],
                ],
            );
        }
    }

    /**
     * Malaysia and neighbours listed first; remaining countries alphabetical by name with higher sort_order.
     *
     * @return list<array{name: string, iso3166_alpha2: string, sort_order: int}>
     */
    private function nationalityRows(): array
    {
        $priority = [
            ['name' => 'Malaysia', 'iso3166_alpha2' => 'MY', 'sort_order' => 10],
            ['name' => 'Singapore', 'iso3166_alpha2' => 'SG', 'sort_order' => 20],
            ['name' => 'Brunei Darussalam', 'iso3166_alpha2' => 'BN', 'sort_order' => 30],
            ['name' => 'Indonesia', 'iso3166_alpha2' => 'ID', 'sort_order' => 40],
            ['name' => 'Thailand', 'iso3166_alpha2' => 'TH', 'sort_order' => 50],
            ['name' => 'Philippines', 'iso3166_alpha2' => 'PH', 'sort_order' => 60],
            ['name' => 'Viet Nam', 'iso3166_alpha2' => 'VN', 'sort_order' => 70],
            ['name' => 'Cambodia', 'iso3166_alpha2' => 'KH', 'sort_order' => 80],
            ['name' => 'Lao People\'s Democratic Republic', 'iso3166_alpha2' => 'LA', 'sort_order' => 90],
            ['name' => 'Myanmar', 'iso3166_alpha2' => 'MM', 'sort_order' => 100],
            ['name' => 'Timor-Leste', 'iso3166_alpha2' => 'TL', 'sort_order' => 110],
            ['name' => 'China', 'iso3166_alpha2' => 'CN', 'sort_order' => 120],
            ['name' => 'Hong Kong', 'iso3166_alpha2' => 'HK', 'sort_order' => 130],
            ['name' => 'Taiwan, Province of China', 'iso3166_alpha2' => 'TW', 'sort_order' => 140],
            ['name' => 'Japan', 'iso3166_alpha2' => 'JP', 'sort_order' => 150],
            ['name' => 'Korea, Republic of', 'iso3166_alpha2' => 'KR', 'sort_order' => 160],
            ['name' => 'India', 'iso3166_alpha2' => 'IN', 'sort_order' => 170],
            ['name' => 'Bangladesh', 'iso3166_alpha2' => 'BD', 'sort_order' => 180],
            ['name' => 'Pakistan', 'iso3166_alpha2' => 'PK', 'sort_order' => 190],
            ['name' => 'Sri Lanka', 'iso3166_alpha2' => 'LK', 'sort_order' => 200],
            ['name' => 'Nepal', 'iso3166_alpha2' => 'NP', 'sort_order' => 210],
            ['name' => 'Australia', 'iso3166_alpha2' => 'AU', 'sort_order' => 220],
            ['name' => 'New Zealand', 'iso3166_alpha2' => 'NZ', 'sort_order' => 230],
            ['name' => 'United Kingdom', 'iso3166_alpha2' => 'GB', 'sort_order' => 240],
            ['name' => 'United States of America', 'iso3166_alpha2' => 'US', 'sort_order' => 250],
            ['name' => 'Canada', 'iso3166_alpha2' => 'CA', 'sort_order' => 260],
        ];

        $other = [
            'AF' => 'Afghanistan',
            'AL' => 'Albania',
            'DZ' => 'Algeria',
            'AD' => 'Andorra',
            'AO' => 'Angola',
            'AR' => 'Argentina',
            'AM' => 'Armenia',
            'AT' => 'Austria',
            'AZ' => 'Azerbaijan',
            'BH' => 'Bahrain',
            'BY' => 'Belarus',
            'BE' => 'Belgium',
            'BZ' => 'Belize',
            'BJ' => 'Benin',
            'BT' => 'Bhutan',
            'BO' => 'Bolivia (Plurinational State of)',
            'BA' => 'Bosnia and Herzegovina',
            'BW' => 'Botswana',
            'BR' => 'Brazil',
            'BG' => 'Bulgaria',
            'BF' => 'Burkina Faso',
            'BI' => 'Burundi',
            'CV' => 'Cabo Verde',
            'CM' => 'Cameroon',
            'CF' => 'Central African Republic',
            'TD' => 'Chad',
            'CL' => 'Chile',
            'CO' => 'Colombia',
            'CR' => 'Costa Rica',
            'HR' => 'Croatia',
            'CU' => 'Cuba',
            'CY' => 'Cyprus',
            'CZ' => 'Czechia',
            'CD' => 'Congo, Democratic Republic of the',
            'DK' => 'Denmark',
            'DJ' => 'Djibouti',
            'DO' => 'Dominican Republic',
            'EC' => 'Ecuador',
            'EG' => 'Egypt',
            'SV' => 'El Salvador',
            'EE' => 'Estonia',
            'SZ' => 'Eswatini',
            'ET' => 'Ethiopia',
            'FJ' => 'Fiji',
            'FI' => 'Finland',
            'FR' => 'France',
            'GA' => 'Gabon',
            'GM' => 'Gambia',
            'GE' => 'Georgia',
            'DE' => 'Germany',
            'GH' => 'Ghana',
            'GR' => 'Greece',
            'GT' => 'Guatemala',
            'GN' => 'Guinea',
            'GY' => 'Guyana',
            'HT' => 'Haiti',
            'HN' => 'Honduras',
            'HU' => 'Hungary',
            'IS' => 'Iceland',
            'IR' => 'Iran (Islamic Republic of)',
            'IQ' => 'Iraq',
            'IE' => 'Ireland',
            'IL' => 'Israel',
            'IT' => 'Italy',
            'CI' => 'Côte d\'Ivoire',
            'JM' => 'Jamaica',
            'JO' => 'Jordan',
            'KZ' => 'Kazakhstan',
            'KE' => 'Kenya',
            'KI' => 'Kiribati',
            'KW' => 'Kuwait',
            'KG' => 'Kyrgyzstan',
            'LV' => 'Latvia',
            'LB' => 'Lebanon',
            'LS' => 'Lesotho',
            'LR' => 'Liberia',
            'LY' => 'Libya',
            'LI' => 'Liechtenstein',
            'LT' => 'Lithuania',
            'LU' => 'Luxembourg',
            'MG' => 'Madagascar',
            'MW' => 'Malawi',
            'MV' => 'Maldives',
            'ML' => 'Mali',
            'MT' => 'Malta',
            'MR' => 'Mauritania',
            'MU' => 'Mauritius',
            'MX' => 'Mexico',
            'MD' => 'Moldova, Republic of',
            'MC' => 'Monaco',
            'MN' => 'Mongolia',
            'ME' => 'Montenegro',
            'MA' => 'Morocco',
            'MZ' => 'Mozambique',
            'NA' => 'Namibia',
            'NR' => 'Nauru',
            'NL' => 'Netherlands',
            'NI' => 'Nicaragua',
            'NE' => 'Niger',
            'NG' => 'Nigeria',
            'MK' => 'North Macedonia',
            'NO' => 'Norway',
            'OM' => 'Oman',
            'PW' => 'Palau',
            'PA' => 'Panama',
            'PG' => 'Papua New Guinea',
            'PY' => 'Paraguay',
            'PE' => 'Peru',
            'PL' => 'Poland',
            'PT' => 'Portugal',
            'QA' => 'Qatar',
            'RO' => 'Romania',
            'RU' => 'Russian Federation',
            'RW' => 'Rwanda',
            'SM' => 'San Marino',
            'SA' => 'Saudi Arabia',
            'SN' => 'Senegal',
            'RS' => 'Serbia',
            'SC' => 'Seychelles',
            'SL' => 'Sierra Leone',
            'SK' => 'Slovakia',
            'SI' => 'Slovenia',
            'SB' => 'Solomon Islands',
            'SO' => 'Somalia',
            'ZA' => 'South Africa',
            'SS' => 'South Sudan',
            'ES' => 'Spain',
            'SD' => 'Sudan',
            'SR' => 'Suriname',
            'SE' => 'Sweden',
            'CH' => 'Switzerland',
            'SY' => 'Syrian Arab Republic',
            'TJ' => 'Tajikistan',
            'TZ' => 'Tanzania, United Republic of',
            'TG' => 'Togo',
            'TO' => 'Tonga',
            'TT' => 'Trinidad and Tobago',
            'TN' => 'Tunisia',
            'TR' => 'Türkiye',
            'TM' => 'Turkmenistan',
            'UG' => 'Uganda',
            'UA' => 'Ukraine',
            'AE' => 'United Arab Emirates',
            'UY' => 'Uruguay',
            'UZ' => 'Uzbekistan',
            'VU' => 'Vanuatu',
            'VA' => 'Holy See',
            'VE' => 'Venezuela (Bolivarian Republic of)',
            'YE' => 'Yemen',
            'ZM' => 'Zambia',
            'ZW' => 'Zimbabwe',
        ];

        $base = 500;
        $sort = $base;
        $rest = [];
        foreach ($other as $iso => $name) {
            $rest[] = [
                'name' => $name,
                'iso3166_alpha2' => $iso,
                'sort_order' => $sort,
            ];
            $sort++;
        }

        return array_merge($priority, $rest);
    }
}
