<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GeothermalSite;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    /**
     * User Login Endpoint
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Format email atau kata sandi tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Kombinasi email dan kata sandi salah.',
            ], 401);
        }

        // Return user data with role and fake/bearer token
        return response()->json([
            'success' => true,
            'message' => 'Autentikasi berhasil. Selamat datang di Portal GIS Star Energy.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department,
                'avatar_initials' => $user->avatar_initials,
            ],
            'token' => 'seg-gis-' . bin2hex(random_bytes(16)),
        ]);
    }

    /**
     * Get Spatial Audit Logs
     */
    public function auditLogs(Request $request): JsonResponse
    {
        $logs = DB::table('spatial_audit_logs')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs,
        ]);
    }

    /**
     * Get GIS Users list
     */
    public function users(): JsonResponse
    {
        $users = User::select('id', 'name', 'email', 'role', 'department', 'avatar_initials', 'created_at')->get();

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Log a spatial action
     */
    public function logSpatialAction(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'site_name' => 'required|string',
            'action_type' => 'required|string',
            'details' => 'required|string',
            'user_name' => 'nullable|string',
            'user_email' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $logId = DB::table('spatial_audit_logs')->insertGetId([
            'site_id' => $request->site_id,
            'site_name' => $request->site_name,
            'action_type' => $request->action_type,
            'user_name' => $request->user_name ?? 'System Administrator',
            'user_email' => $request->user_email ?? 'admin@starenergy.co.id',
            'details' => $request->details,
            'ip_address' => $request->ip(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'log_id' => $logId,
        ]);
    }

    /**
     * Spatial Buffer & AMDAL Proximity Conflict Analysis
     */
    public function calculateBufferConflict(Request $request): JsonResponse
    {
        $siteId = $request->query('site_id');
        $site = GeothermalSite::find($siteId);

        if (!$site) {
            return response()->json(['success' => false, 'message' => 'Site not found'], 404);
        }

        $lat = (float) $site->latitude;
        $lng = (float) $site->longitude;

        // Conservation reference zones in Indonesia
        $conservationZones = [
            [
                'name' => 'Taman Nasional Gunung Halimun Salak (TNGHS)',
                'type' => 'Taman Nasional / Hutan Konservasi',
                'lat' => -6.7167,
                'lng' => 106.5833,
                'regulation' => 'UU No. 5/1990 & Permen LHK P.46/2016',
            ],
            [
                'name' => 'Kawasan Lindung Hutan Gunung Wayang',
                'type' => 'Hutan Lindung / Tangkapan Air',
                'lat' => -7.2167,
                'lng' => 107.6167,
                'regulation' => 'Kepmenhut SK.195/Menhut-II/2003',
            ],
            [
                'name' => 'Taman Nasional Bukit Barisan Selatan (TNBBS)',
                'type' => 'Taman Nasional / UNESCO Tropical Rainforest',
                'lat' => -5.1500,
                'lng' => 104.2500,
                'regulation' => 'UNESCO World Heritage Heritage List ID 1167',
            ],
            [
                'name' => 'Cagar Alam Dataran Tinggi Dieng',
                'type' => 'Cagar Alam Geologi',
                'lat' => -7.2000,
                'lng' => 109.9000,
                'regulation' => 'SK Menhut No. 359/Menhut-II/2004',
            ]
        ];

        $results = [];

        foreach ($conservationZones as $zone) {
            // Haversine formula distance calculation in kilometers
            $earthRadiusKm = 6371;
            $dLat = deg2rad($zone['lat'] - $lat);
            $dLng = deg2rad($zone['lng'] - $lng);

            $a = sin($dLat / 2) * sin($dLat / 2) +
                 cos(deg2rad($lat)) * cos(deg2rad($zone['lat'])) *
                 sin($dLng / 2) * sin($dLng / 2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $distanceKm = round($earthRadiusKm * $c, 2);

            $conflictStatus = 'Aman (>25 km)';
            $badgeColor = 'green';

            if ($distanceKm <= 5) {
                $conflictStatus = 'Zona Inti (Tumpang Tindih / Izin Khusus Pemanfaatan PP 7/2017 Diperlukan)';
                $badgeColor = 'red';
            } elseif ($distanceKm <= 10) {
                $conflictStatus = 'Zona Penyangga Ekologis (Wajib Mitigasi AMDAL Ketat)';
                $badgeColor = 'amber';
            } elseif ($distanceKm <= 25) {
                $conflictStatus = 'Zona Koordinasi Wilayah (Studi Dampak Lingkungan Regional)';
                $badgeColor = 'blue';
            }

            $results[] = [
                'zone_name' => $zone['name'],
                'zone_type' => $zone['type'],
                'distance_km' => $distanceKm,
                'status' => $conflictStatus,
                'badge_color' => $badgeColor,
                'regulation' => $zone['regulation'],
            ];
        }

        // Sort by closest distance
        usort($results, fn($a, $b) => $a['distance_km'] <=> $b['distance_km']);

        return response()->json([
            'success' => true,
            'site' => [
                'id' => $site->id,
                'name' => $site->site_name,
                'operator' => $site->operator_company,
                'latitude' => $lat,
                'longitude' => $lng,
            ],
            'analysis' => $results,
        ]);
    }

    /**
     * Export All Sites Data (GeoJSON or CSV)
     */
    public function exportData(string $format): mixed
    {
        $sites = GeothermalSite::orderBy('is_star_energy', 'desc')->get();

        if ($format === 'csv') {
            $headers = [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="geothermal_sites_' . date('Y-m-d') . '.csv"',
            ];

            $callback = function () use ($sites) {
                $file = fopen('php://output', 'w');
                fputcsv($file, [
                    'ID', 'Site Code', 'Site Name', 'Operator Company', 'Company Category',
                    'Is Star Energy', 'Project Status', 'Installed Capacity (MW)', 'Potential Capacity (MW)',
                    'Enthalpy Type', 'Reservoir Temp (C)', 'WKP Name', 'Island', 'Province', 'Regency',
                    'Latitude', 'Longitude', 'Elevation (masl)', 'Operation Year', 'Grid Connection', 'Data Source'
                ]);

                foreach ($sites as $s) {
                    fputcsv($file, [
                        $s->id, $s->site_code, $s->site_name, $s->operator_company, $s->company_category,
                        $s->is_star_energy ? 'Yes' : 'No', $s->project_status, $s->installed_capacity_mw,
                        $s->potential_capacity_mw, $s->enthalpy_type, $s->reservoir_temp_celsius,
                        $s->wkp_name, $s->island, $s->province, $s->regency,
                        $s->latitude, $s->longitude, $s->elevation_masl, $s->commercial_operation_year,
                        $s->grid_connection, $s->data_source
                    ]);
                }
                fclose($file);
            };

            return response()->stream($callback, 200, $headers);
        }

        // GeoJSON
        $features = $sites->map(fn($s) => $s->toGeoJsonFeature());
        return response()->json([
            'type' => 'FeatureCollection',
            'metadata' => [
                'exported_at' => now()->toIso8601String(),
                'crs' => 'EPSG:4326',
                'count' => $features->count(),
                'publisher' => 'PT Star Energy Geothermal (GIS Enterprise)',
            ],
            'features' => $features,
        ]);
    }
}
