<?php

namespace Database\Seeders;

use App\Models\GeothermalSite;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class GeothermalSiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $files = [
            base_path('data/geothermal_star_energy.geojson'),
            base_path('data/geothermal_competitors.geojson'),
            base_path('data/geothermal_potential_prospects.geojson'),
        ];

        foreach ($files as $filePath) {
            if (!File::exists($filePath)) {
                $this->command?->warn("File {$filePath} does not exist. Skipping.");
                continue;
            }

            $jsonContent = File::get($filePath);
            $geoJson = json_decode($jsonContent, true);

            if (!isset($geoJson['features']) || !is_array($geoJson['features'])) {
                continue;
            }

            foreach ($geoJson['features'] as $feature) {
                $props = $feature['properties'] ?? [];
                $coords = $feature['geometry']['coordinates'] ?? [0, 0];

                $longitude = $coords[0] ?? 0;
                $latitude = $coords[1] ?? 0;

                GeothermalSite::updateOrCreate(
                    ['site_code' => $props['id'] ?? uniqid('GEO-')],
                    [
                        'site_name' => $props['site_name'] ?? 'Unknown Site',
                        'operator_company' => $props['operator_company'] ?? 'Unknown Operator',
                        'company_category' => $props['company_category'] ?? ($props['is_star_energy'] ? 'Star Energy' : 'Lainnya'),
                        'is_star_energy' => (bool) ($props['is_star_energy'] ?? false),
                        'project_status' => $props['project_status'] ?? 'Potential',
                        'status_label' => $props['status_label'] ?? ($props['project_status'] ?? 'Potential'),
                        'installed_capacity_mw' => (float) ($props['installed_capacity_mw'] ?? 0),
                        'potential_capacity_mw' => (float) ($props['potential_capacity_mw'] ?? 0),
                        'enthalpy_type' => $props['enthalpy_type'] ?? 'High Enthalpy',
                        'reservoir_temp_celsius' => isset($props['reservoir_temp_celsius']) ? (int) $props['reservoir_temp_celsius'] : null,
                        'wkp_name' => $props['wkp_name'] ?? null,
                        'island' => $props['island'] ?? 'Jawa',
                        'province' => $props['province'] ?? 'Indonesia',
                        'regency' => $props['regency'] ?? 'Wilayah Kerja',
                        'latitude' => (float) $latitude,
                        'longitude' => (float) $longitude,
                        'elevation_masl' => isset($props['elevation_masl']) ? (int) $props['elevation_masl'] : null,
                        'commercial_operation_year' => isset($props['commercial_operation_year']) ? (int) $props['commercial_operation_year'] : null,
                        'grid_connection' => $props['grid_connection'] ?? null,
                        'data_source' => $props['data_source'] ?? 'Kementerian ESDM & Ditjen EBTKE',
                        'description' => $props['description'] ?? null,
                    ]
                );
            }
        }
    }
}
