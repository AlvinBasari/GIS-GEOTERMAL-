<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeothermalSite extends Model
{
    use HasFactory;

    protected $table = 'geothermal_sites';

    protected $fillable = [
        'site_code',
        'site_name',
        'operator_company',
        'company_category',
        'is_star_energy',
        'project_status',
        'status_label',
        'installed_capacity_mw',
        'potential_capacity_mw',
        'enthalpy_type',
        'reservoir_temp_celsius',
        'wkp_name',
        'island',
        'province',
        'regency',
        'latitude',
        'longitude',
        'elevation_masl',
        'commercial_operation_year',
        'grid_connection',
        'data_source',
        'description',
    ];

    protected $casts = [
        'is_star_energy' => 'boolean',
        'installed_capacity_mw' => 'float',
        'potential_capacity_mw' => 'float',
        'latitude' => 'float',
        'longitude' => 'float',
        'reservoir_temp_celsius' => 'integer',
        'elevation_masl' => 'integer',
        'commercial_operation_year' => 'integer',
    ];

    /**
     * Transform the model into an OGC RFC 7946 GeoJSON Feature
     */
    public function toGeoJsonFeature(): array
    {
        return [
            'type' => 'Feature',
            'id' => $this->id,
            'geometry' => [
                'type' => 'Point',
                'coordinates' => [
                    (float) $this->longitude,
                    (float) $this->latitude,
                ],
            ],
            'properties' => [
                'id' => $this->id,
                'site_code' => $this->site_code,
                'site_name' => $this->site_name,
                'operator_company' => $this->operator_company,
                'company_category' => $this->company_category,
                'is_star_energy' => (bool) $this->is_star_energy,
                'project_status' => $this->project_status,
                'status_label' => $this->status_label ?? $this->project_status,
                'installed_capacity_mw' => (float) $this->installed_capacity_mw,
                'potential_capacity_mw' => (float) $this->potential_capacity_mw,
                'enthalpy_type' => $this->enthalpy_type,
                'reservoir_temp_celsius' => $this->reservoir_temp_celsius,
                'wkp_name' => $this->wkp_name,
                'island' => $this->island,
                'province' => $this->province,
                'regency' => $this->regency,
                'elevation_masl' => $this->elevation_masl,
                'commercial_operation_year' => $this->commercial_operation_year,
                'grid_connection' => $this->grid_connection,
                'data_source' => $this->data_source,
                'description' => $this->description,
                'updated_at' => $this->updated_at?->toIso8601String(),
            ],
        ];
    }

    public function scopeStarEnergy($query)
    {
        return $query->where('is_star_energy', true);
    }

    public function scopeCompetitors($query)
    {
        return $query->where('is_star_energy', false);
    }
}
