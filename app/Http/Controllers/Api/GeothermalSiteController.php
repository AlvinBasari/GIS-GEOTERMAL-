<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GeothermalSite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class GeothermalSiteController extends Controller
{
    /**
     * Return all geothermal sites as standard OGC GeoJSON FeatureCollection
     */
    public function geojson(Request $request): JsonResponse
    {
        $query = GeothermalSite::query();

        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('project_status', $request->status);
        }

        if ($request->has('category') && $request->category !== 'all' && $request->category !== '') {
            $query->where('company_category', $request->category);
        }

        if ($request->has('island') && $request->island !== 'all' && $request->island !== '') {
            $query->where('island', $request->island);
        }

        if ($request->has('star_energy_only') && $request->boolean('star_energy_only')) {
            $query->where('is_star_energy', true);
        }

        $sites = $query->orderBy('installed_capacity_mw', 'desc')->get();

        $features = $sites->map(fn(GeothermalSite $site) => $site->toGeoJsonFeature());

        return response()->json([
            'type' => 'FeatureCollection',
            'metadata' => [
                'count' => $features->count(),
                'crs' => 'EPSG:4326',
                'title' => 'Indonesia Geothermal Power Plants & Prospects',
                'generated_at' => now()->toIso8601String(),
            ],
            'features' => $features,
        ]);
    }

    /**
     * Get paginated or filtered list of sites
     */
    public function index(Request $request): JsonResponse
    {
        $query = GeothermalSite::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('site_name', 'like', "%{$search}%")
                  ->orWhere('operator_company', 'like', "%{$search}%")
                  ->orWhere('regency', 'like', "%{$search}%")
                  ->orWhere('province', 'like', "%{$search}%")
                  ->orWhere('wkp_name', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('project_status', $request->status);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('company_category', $request->category);
        }

        if ($request->filled('island') && $request->island !== 'all') {
            $query->where('island', $request->island);
        }

        if ($request->boolean('star_energy_only')) {
            $query->where('is_star_energy', true);
        }

        $sites = $query->orderBy('is_star_energy', 'desc')
                       ->orderBy('installed_capacity_mw', 'desc')
                       ->get();

        return response()->json([
            'success' => true,
            'count' => $sites->count(),
            'data' => $sites,
        ]);
    }

    /**
     * Store a newly created geothermal site (Input Data Perusahaan / Tambah Lokasi)
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'site_name' => 'required|string|max:150',
            'operator_company' => 'required|string|max:150',
            'company_category' => 'required|string|max:100',
            'is_star_energy' => 'boolean',
            'project_status' => 'required|in:Operational,Under Construction,Exploration,Potential',
            'status_label' => 'nullable|string|max:150',
            'installed_capacity_mw' => 'required|numeric|min:0',
            'potential_capacity_mw' => 'nullable|numeric|min:0',
            'enthalpy_type' => 'required|in:High Enthalpy,Medium Enthalpy,Low Enthalpy',
            'reservoir_temp_celsius' => 'nullable|integer|between:40,400',
            'wkp_name' => 'nullable|string|max:150',
            'island' => 'required|string|max:100',
            'province' => 'required|string|max:100',
            'regency' => 'required|string|max:100',
            'latitude' => 'required|numeric|between:-11.5,6.5',
            'longitude' => 'required|numeric|between:94.5,141.5',
            'elevation_masl' => 'nullable|integer',
            'commercial_operation_year' => 'nullable|integer|between:1970,2035',
            'grid_connection' => 'nullable|string|max:255',
            'data_source' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Auto-generate site_code if missing
        $prefix = ($data['is_star_energy'] ?? false) ? 'SEG-' : 'GEO-';
        $data['site_code'] = $prefix . strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $data['site_name']), 0, 4)) . '-' . rand(100, 999);
        
        if (empty($data['status_label'])) {
            $data['status_label'] = match ($data['project_status']) {
                'Operational' => "Beroperasi ({$data['installed_capacity_mw']} MW)",
                'Under Construction' => "Dalam Konstruksi / Ekspansi",
                'Exploration' => "Tahap Eksplorasi / Pengeboran",
                'Potential' => "Prospek WKP Belum Digarap",
                default => $data['project_status'],
            };
        }

        if (empty($data['data_source'])) {
            $data['data_source'] = 'Star Energy Geothermal Internal Database (SIG Lapangan)';
        }

        $site = GeothermalSite::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Lokasi panas bumi berhasil ditambahkan ke basis data SIG.',
            'data' => $site,
            'geojson' => $site->toGeoJsonFeature(),
        ], 201);
    }

    /**
     * Display a specific geothermal site
     */
    public function show(int $id): JsonResponse
    {
        $site = GeothermalSite::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi panas bumi tidak ditemukan.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $site,
            'geojson' => $site->toGeoJsonFeature(),
        ]);
    }

    /**
     * Update an existing geothermal site
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $site = GeothermalSite::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi panas bumi tidak ditemukan.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'site_name' => 'sometimes|required|string|max:150',
            'operator_company' => 'sometimes|required|string|max:150',
            'company_category' => 'sometimes|required|string|max:100',
            'is_star_energy' => 'sometimes|boolean',
            'project_status' => 'sometimes|required|in:Operational,Under Construction,Exploration,Potential',
            'status_label' => 'nullable|string|max:150',
            'installed_capacity_mw' => 'sometimes|required|numeric|min:0',
            'potential_capacity_mw' => 'nullable|numeric|min:0',
            'enthalpy_type' => 'sometimes|required|in:High Enthalpy,Medium Enthalpy,Low Enthalpy',
            'reservoir_temp_celsius' => 'nullable|integer|between:40,400',
            'wkp_name' => 'nullable|string|max:150',
            'island' => 'sometimes|required|string|max:100',
            'province' => 'sometimes|required|string|max:100',
            'regency' => 'sometimes|required|string|max:100',
            'latitude' => 'sometimes|required|numeric|between:-11.5,6.5',
            'longitude' => 'sometimes|required|numeric|between:94.5,141.5',
            'elevation_masl' => 'nullable|integer',
            'commercial_operation_year' => 'nullable|integer|between:1970,2035',
            'grid_connection' => 'nullable|string|max:255',
            'data_source' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $site->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Data lokasi panas bumi berhasil diperbarui.',
            'data' => $site,
            'geojson' => $site->toGeoJsonFeature(),
        ]);
    }

    /**
     * Remove a geothermal site
     */
    public function destroy(int $id): JsonResponse
    {
        $site = GeothermalSite::find($id);

        if (!$site) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi panas bumi tidak ditemukan.',
            ], 404);
        }

        $site->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lokasi panas bumi berhasil dihapus dari sistem SIG.',
        ]);
    }

    /**
     * Comprehensive Executive and Academic Geospatial Statistics
     */
    public function statistics(): JsonResponse
    {
        $totalSites = GeothermalSite::count();
        $totalOperatingMW = (float) GeothermalSite::where('project_status', 'Operational')->sum('installed_capacity_mw');
        $totalPotentialMW = (float) GeothermalSite::sum('potential_capacity_mw');
        $underConstructionCount = GeothermalSite::where('project_status', 'Under Construction')->count();
        $underConstructionMW = (float) GeothermalSite::where('project_status', 'Under Construction')->sum('potential_capacity_mw');
        $explorationCount = GeothermalSite::where('project_status', 'Exploration')->count();
        $potentialProspectCount = GeothermalSite::where('project_status', 'Potential')->count();

        // Star Energy Specifics
        $starSites = GeothermalSite::where('is_star_energy', true)->get();
        $starOperatingMW = (float) $starSites->where('project_status', 'Operational')->sum('installed_capacity_mw');
        $starPotentialMW = (float) $starSites->sum('potential_capacity_mw');
        $starSharePercent = $totalOperatingMW > 0 ? round(($starOperatingMW / $totalOperatingMW) * 100, 2) : 0;

        // Breakdown by Company Category
        $byCompany = GeothermalSite::selectRaw('company_category, sum(installed_capacity_mw) as total_installed_mw, sum(potential_capacity_mw) as total_potential_mw, count(*) as sites_count')
            ->groupBy('company_category')
            ->orderBy('total_installed_mw', 'desc')
            ->get();

        // Breakdown by Island
        $byIsland = GeothermalSite::selectRaw('island, sum(installed_capacity_mw) as total_installed_mw, sum(potential_capacity_mw) as total_potential_mw, count(*) as sites_count')
            ->groupBy('island')
            ->orderBy('total_installed_mw', 'desc')
            ->get();

        // Breakdown by Status
        $byStatus = GeothermalSite::selectRaw('project_status, count(*) as count, sum(installed_capacity_mw) as total_installed_mw, sum(potential_capacity_mw) as total_potential_mw')
            ->groupBy('project_status')
            ->get();

        return response()->json([
            'success' => true,
            'summary' => [
                'total_sites' => $totalSites,
                'total_operating_mw' => $totalOperatingMW,
                'total_potential_mw' => $totalPotentialMW,
                'under_construction_count' => $underConstructionCount,
                'under_construction_pipeline_mw' => $underConstructionMW,
                'exploration_count' => $explorationCount,
                'potential_prospect_count' => $potentialProspectCount,
                'star_energy' => [
                    'sites_count' => $starSites->count(),
                    'operating_mw' => $starOperatingMW,
                    'potential_mw' => $starPotentialMW,
                    'market_share_percent' => $starSharePercent,
                    'operational_assets' => $starSites->where('project_status', 'Operational')->values(),
                    'pipeline_assets' => $starSites->where('project_status', '!=', 'Operational')->values(),
                ],
            ],
            'breakdown' => [
                'by_company' => $byCompany,
                'by_island' => $byIsland,
                'by_status' => $byStatus,
            ],
        ]);
    }

    /**
     * Get tectonic fault lines GeoJSON
     */
    public function faultLines(): JsonResponse
    {
        $faultPath = base_path('data/indonesia_tectonic_faults.geojson');

        if (!File::exists($faultPath)) {
            return response()->json([
                'type' => 'FeatureCollection',
                'features' => [],
            ]);
        }

        $content = json_decode(File::get($faultPath), true);
        return response()->json($content);
    }
}
