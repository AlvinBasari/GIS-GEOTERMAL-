# Web-GIS Pemetaan Portofolio dan Analisis Spasial Panas Bumi Nasional
### Studi Kasus: PT Star Energy Geothermal (Barito Renewables) & Analisis Kompetitif
**Konteks Akademis:** Tugas Akhir / Proyek Mata Kuliah Sistem Informasi Geografis (SIG)  
**Teknologi:** Laravel 13 (Backend REST API & SQLite Spatial ORM) + React 18 (Vite, Tailwind CSS)  
**Mesin Peta:** Dual-Engine (Leaflet Taktis & Kepler.gl / Deck.gl 3D Spasiotemporal)  
**Standar Geospasial:** OGC RFC 7946 Simple Feature Access (GeoJSON), EPSG:4326 (WGS 84), SNI 5015:2019  

---

## 1. Ringkasan Proyek
Aplikasi ini adalah platform **Sistem Informasi Geografis (Web-GIS)** terintegrasi untuk pemetaan sebaran Wilayah Kerja Panas Bumi (WKP), Pembangkit Listrik Tenaga Panas Bumi (PLTP) operasional, proyek dalam konstruksi/ekspansi, serta prospek *greenfield* di Indonesia.

Sistem dirancang khusus untuk memenuhi kebutuhan **Corporate Spatial Intelligence PT Star Energy Geothermal** dalam memantau portofolio aset internal dan membandingkannya secara spasial dengan kompetitor utama (PT Pertamina Geothermal Energy Tbk, PT Geo Dipa Energi, Sarulla Operations, PT Supreme Energy, dan Medco Power).

---

## 2. Inventaris Data Awal Terverifikasi (Baseline Dataset)

Seluruh data tersimpan dalam direktori `data/` dengan koordinat presisi dan atribut termodinamika lengkap:

### A. Aset PT Star Energy Geothermal (Internal)
1. **PLTP Wayang Windu** (Pangalengan, Kab. Bandung, Jawa Barat): 230.5 MW (Unit 1 & 2) — Operasional.
2. **PLTP Salak** (Kabandungan, Kab. Sukabumi & Bogor, Jawa Barat): 377.0 MW (Listrik & Uap) — Operasional.
3. **PLTP Darajat** (Pasirwangi, Kab. Garut, Jawa Barat): 274.5 MW (Unit 1-3, dry steam) — Operasional.
4. **Gunung Hamiding** (Halmahera Utara, Maluku Utara): Estimasi potensi 275–550 MW (Target awal 50 MW) — Tahap Eksplorasi (Tajak sumur Oktober 2025).
5. **Sekincau Selatan / Suoh-Sekincau** (Lampung Barat, Lampung): Estimasi potensi 430 MW — Eksplorasi / PSPE.
*Total Kapasitas Terpasang Star Energy:* **882.0 MW** (Menguasai **45.69%** pangsa pasar panas bumi nasional).

### B. Aset Kompetitor Utama Nasional
- **Pertamina Geothermal Energy (PGE):** Kamojang (235 MW), Ulubelu (220 MW), Lahendong (120 MW), Lumut Balai (55 MW Operasi + 55 MW Unit 2 Konstruksi), Karaha (30 MW), Sibayak (12 MW), Hululais (110 MW Konstruksi), Kotamobagu (80 MW Eksplorasi).
- **PT Geo Dipa Energi (BUMN):** Dieng (60 MW Operasi + 55 MW Unit 2 Konstruksi), Patuha (55 MW Operasi + 55 MW Unit 2 Konstruksi).
- **Sarulla Operations Ltd:** Sarulla Combined Cycle (330 MW, Sumatera Utara).
- **PT Supreme Energy:** Muara Laboh (85 MW Operasi + 65 MW Ekspansi), Rantau Dedap (91.2 MW), Rajabasa (220 MW Eksplorasi).
- **PT Medco Power Indonesia:** Blawan Ijen (34 MW, Jawa Timur - Commissioning).
- **PT PLN Gas & Geothermal:** Ulumbu (10 MW, Flores NTT).

### C. Prospek Nasional WKP Belum Digarap (Kementerian ESDM & Badan Geologi)
- Gunung Talang-Bukit Kili (Sumbar), Cisolok-Cisukarame (Jabar), Baturaden Slamet (Jateng), Telaga Ngebel (Jatim), Songa Wayaua (Malut), Marana (Sulteng), Jaboi (Aceh), Wapsalit (Buru Maluku).

### D. Layer Geologi Sesar Tektonik Aktif (PuSGeN)
- Sesar Besar Sumatera (*Great Sumatran Fault* / Semangko), Sesar Cimandiri, Sesar Lembang, Sesar Baribis-Kendeng, Sesar Palu-Koro, dan Sesar Sorong.

---

## 3. Fitur Utama Web-GIS

### 1. Dual-Engine Mapping (Leaflet & Kepler.gl 3D)
- **Leaflet Operational Engine:**
  - Multi-basemap selector: *Carto Dark Matter*, *ESRI World Imagery Satellite*, dan *Topografi Kontur OpenTopoMap*.
  - Pin marker khusus: Bintang Emas Berdenyut (Star Energy), Biru Sian (Kompetitor Operasional), Kuning (Konstruksi), Biru (Eksplorasi), Ungu (Prospek Cadangan).
  - **Dynamic Spatial Buffer Tool:** Membuat zona penyangga 5 km (area bahaya kepala sumur), 10 km (zona kawasan hutan lindung / AMDAL), dan 25 km (radius interkoneksi SUTET PLN).
  - **Map Coordinate Picker:** Klik langsung di peta untuk mengambil koordinat Latitude dan Longitude secara otomatis ke formulir pendaftaran.
- **Kepler.gl & Deck.gl 3D Spatial Engine:**
  - Visualisasi 3D ekstrusi pilar kapasitas Megawatt (`installed_capacity_mw`).
  - Agregasi heksagonal (*Hexbin clustering*) untuk memetakan konsentrasi energi per gugus vulkanik.
  - Lapisan patahan geologi 3D untuk korelasi batas lempeng dan manifestasi termal.
  - **Export Kepler Config:** Unduh berkas JSON konfigurasi resmi untuk diimpor ke [kepler.gl studio](https://kepler.gl/#/demo).

### 2. Modul CRUD Data Perusahaan (Star Energy Management)
- Input lapangan panas bumi baru (Beroperasi, Sedang Dibangun, atau Eksplorasi).
- Validasi teritori Indonesia dan entalpi termodinamika.
- Edit status dan kapasitas proyek secara langsung dengan pembaruan instan (*real-time sync*).
- Penghapusan data dengan konfirmasi keamanan.

### 3. Direktori Data & Analisis Tabular
- Pencarian multi-kriteria (nama lapangan, WKP, kabupaten/kota, operator).
- Filter status proyek dan kategori korporasi.
- Pengurutan daya MW terbesar ke terkecil.
- Tombol aksi cepat untuk memusatkan peta (*fly to coordinate*) ke titik lapangan yang dipilih.

### 4. Modal Bobot Akademis SIG
- Menampilkan landasan teoritis model vektor, sistem referensi koordinat (WGS 84 vs UTM), metodologi analisis spasial, standar SNI 5015:2019, dan daftar pustaka lengkap untuk keperluan presentasi sidang/evaluasi dosen.

---

## 4. Struktur Direktori Proyek

```
GEOTERMAL/
├── app/
│   ├── Http/Controllers/Api/
│   │   └── GeothermalSiteController.php  # Controller RESTful GeoJSON & CRUD
│   └── Models/
│       └── GeothermalSite.php            # Eloquent ORM + toGeoJsonFeature()
├── data/
│   ├── geothermal_star_energy.geojson    # Aset Star Energy (Wayang Windu, Salak, Darajat, Hamiding, Sekincau)
│   ├── geothermal_competitors.geojson    # Aset Kompetitor (PGE, Geo Dipa, Sarulla, Medco, Supreme)
│   ├── geothermal_potential_prospects.geojson # Prospek WKP Belum Digarap Ditjen EBTKE
│   ├── indonesia_tectonic_faults.geojson # Garis sesar tektonik aktif PuSGeN
│   └── data_sources_and_citations.json   # Metadata akademis & daftar pustaka
├── database/
│   ├── migrations/                       # Skema tabel geothermal_sites
│   └── seeders/
│       └── GeothermalSiteSeeder.php      # Seeder pembaca GeoJSON data awal
├── resources/
│   ├── css/
│   │   └── app.css                       # Tailwind CSS & styling peta kustom
│   ├── js/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                # Navigasi & view switcher
│   │   │   ├── StatsCards.jsx            # Kartu metrik analitik & filter
│   │   │   ├── LeafletMap.jsx            # Mesin peta taktis Leaflet
│   │   │   ├── KeplerMap.jsx             # Mesin peta 3D Kepler.gl/Deck.gl
│   │   │   ├── SitesTable.jsx            # Tabel direktori & pencarian
│   │   │   ├── SiteDetailModal.jsx       # Modal spesifikasi teknis lengkap
│   │   │   ├── AddSiteModal.jsx          # Modal input data lapangan baru
│   │   │   ├── EditSiteModal.jsx         # Modal edit parameter lapangan
│   │   │   └── AcademicDocsModal.jsx     # Landasan akademis & SNI 5015:2019
│   │   ├── App.jsx                       # Komponen root aplikasi
│   │   └── app.jsx                       # Entry point React 18
│   └── views/
│       └── welcome.blade.php             # Template Blade pembungkus SPA
└── routes/
    ├── api.php                           # Endpoint RESTful API
    └── web.php                           # Web routing
```

---

## 5. Cara Menjalankan Aplikasi di Komputer Lokal

### Prasyarat Sistem
- PHP 8.2 atau lebih baru (dengan ekstensi `pdo_sqlite`, `curl`, `mbstring`)
- Composer 2.x
- Node.js v18+ dan NPM

### Langkah Instalasi & Menjalankan:
1. **Buka Terminal di Direktori Proyek:**
   ```bash
   cd "c:\Users\alvin\Documents\WORKSPACE - IT\projek waril\GEOTERMAL"
   ```

2. **Jalankan Migrasi & Database Seeder (Jika Belum):**
   ```bash
   php artisan migrate --seed
   ```

3. **Kompilasi Aset Frontend React:**
   ```bash
   npm run build
   ```
   *(Atau jalankan `npm run dev` untuk mode hot-reload pengembangan).*

4. **Jalankan Server Laravel:**
   ```bash
   php artisan serve --port=8000
   ```

5. **Akses Aplikasi di Browser:**
   Buka URL: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 6. Daftar Rujukan & Pustaka Ilmiah
1. **Kementerian ESDM RI (Ditjen EBTKE). (2024).** *Neraca Panas Bumi Indonesia dan Sebaran Wilayah Kerja Panas Bumi (WKP) Nasional.*
2. **Badan Geologi Kementerian ESDM. (2023).** *Atlas Panas Bumi Indonesia: Wilayah Prospek dan Manifestasi Hidrotermal.* Pusat Sumber Daya Mineral Batubara dan Panas Bumi (PSDMBP).
3. **Pusat Studi Gempa Nasional (PuSGeN). (2017).** *Peta Sumber dan Bahaya Gempa Indonesia: Peta Sesar Tektonik Aktif.*
4. **Badan Standardisasi Nasional (BSN). (2019).** *SNI 5015:2019 - Pedoman Pelaporan Sumber Daya dan Cadangan Panas Bumi Indonesia.*
5. **PT Barito Renewables Energy Tbk & PT Star Energy Geothermal. (2024).** *Annual Report & Investor Presentation 2024.*
6. **Sieh, K., & Natawidjaja, D. (2000).** Neotectonics of the Sumatran fault, Indonesia. *Journal of Geophysical Research: Solid Earth*, 105(B12), 28295-28326.
7. **Saptadji, N. M. (2018).** *Teknik Panas Bumi: Karakterisasi Reservoar dan Eksplorasi Panas Bumi Indonesia.* Bandung: Penerbit ITB.
