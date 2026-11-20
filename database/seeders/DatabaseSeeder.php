<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Geothermal Sites
        $this->call([
            GeothermalSiteSeeder::class,
        ]);

        // 2. Seed Users
        User::updateOrCreate(
            ['email' => 'admin@starenergy.co.id'],
            [
                'name' => 'Alvin Pratama, S.T.',
                'password' => Hash::make('password123'),
                'role' => 'Chief GIS Administrator',
                'department' => 'Geospatial Strategy & Asset Intelligence',
                'avatar_initials' => 'AP',
            ]
        );

        User::updateOrCreate(
            ['email' => 'geoscientist@starenergy.co.id'],
            [
                'name' => 'Dr. Budi Santoso, M.T.',
                'password' => Hash::make('password123'),
                'role' => 'Lead Exploration Geoscientist',
                'department' => 'Subsurface Exploration & Drilling',
                'avatar_initials' => 'BS',
            ]
        );

        User::updateOrCreate(
            ['email' => 'geologist@starenergy.co.id'],
            [
                'name' => 'Dr. Budi Santoso, M.T.',
                'password' => Hash::make('password123'),
                'role' => 'Lead Geoscientist',
                'department' => 'Subsurface Exploration & Reservoir Engineering',
                'avatar_initials' => 'BS',
            ]
        );

        User::updateOrCreate(
            ['email' => 'reservoir@starenergy.co.id'],
            [
                'name' => 'Siti Rahmawati, M.Sc.',
                'password' => Hash::make('password123'),
                'role' => 'Senior Reservoir Engineer',
                'department' => 'Asset Optimization & Thermodynamic Modeling',
                'avatar_initials' => 'SR',
            ]
        );

        User::updateOrCreate(
            ['email' => 'surveyor@starenergy.co.id'],
            [
                'name' => 'Siti Rahmawati, M.Sc.',
                'password' => Hash::make('password123'),
                'role' => 'Field Exploration Surveyor',
                'department' => 'GIS Field Survey & Drone Mapping',
                'avatar_initials' => 'SR',
            ]
        );

        // 3. Seed Spatial Audit Logs
        DB::table('spatial_audit_logs')->truncate();
        DB::table('spatial_audit_logs')->insert([
            [
                'site_id' => 4,
                'site_name' => 'Gunung Hamiding Geothermal Prospect',
                'action_type' => 'STATUS_CHANGE',
                'user_name' => 'Dr. Budi Santoso, M.T.',
                'user_email' => 'geoscientist@starenergy.co.id',
                'details' => 'Pemutakhiran status penugasan pengusahaan PSPE: Tajak sumur eksplorasi (spud-in drilling) resmi dimulai menggunakan Rig 1500 HP.',
                'ip_address' => '10.24.1.88',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'site_id' => 1,
                'site_name' => 'Wayang Windu Geothermal Power Plant',
                'action_type' => 'UPDATE',
                'user_name' => 'Alvin Pratama, S.T.',
                'user_email' => 'admin@starenergy.co.id',
                'details' => 'Verifikasi proyeksi koordinat kepala sumur ke UTM Zone 48S (WGS 84). Kapasitas operasional Unit 1 (110 MW) dan Unit 2 (117 MW) sinkron dengan data EBTKE.',
                'ip_address' => '10.24.1.12',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'site_id' => 2,
                'site_name' => 'Salak Geothermal Field & Power Plant',
                'action_type' => 'BUFFER_CALC',
                'user_name' => 'Alvin Pratama, S.T.',
                'user_email' => 'admin@starenergy.co.id',
                'details' => 'Kalkulasi buffer spatial 10 km terhadap batas kawasan Taman Nasional Gunung Halimun Salak (TNGHS). Tidak terindikasi konflik tata ruang konservasi.',
                'ip_address' => '10.24.1.12',
                'created_at' => now()->subDays(8),
                'updated_at' => now()->subDays(8),
            ],
            [
                'site_id' => 5,
                'site_name' => 'Sekincau Selatan / Suoh-Sekincau Geothermal Field',
                'action_type' => 'CREATE',
                'user_name' => 'Dr. Budi Santoso, M.T.',
                'user_email' => 'geoscientist@starenergy.co.id',
                'details' => 'Pendaftaran delineasi awal WKP Suoh-Sekincau berdasarkan Kepmen ESDM No. 1870/2018 dengan estimasi cadangan terduga 430 MW.',
                'ip_address' => '10.24.1.88',
                'created_at' => now()->subDays(12),
                'updated_at' => now()->subDays(12),
            ]
        ]);
    }
}
