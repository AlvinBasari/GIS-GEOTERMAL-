import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Globe, 
  ExternalLink 
} from 'lucide-react';

export default function AcademicDocsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('theory'); // theory, spatial_methods, standards, citations

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header (Clean Pure White with Blue Accent) */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-950">
                  Spesifikasi & Bobot Akademis Sistem Informasi Geografis (SIG)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Tugas Akhir SIG
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Landasan Teori Geospasial, Metode Analisis Spasial, Standar SNI 5015:2019 & Daftar Pustaka
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-4 text-xs">
          <button
            onClick={() => setActiveTab('theory')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'theory'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Landasan Teori SIG</span>
          </button>

          <button
            onClick={() => setActiveTab('spatial_methods')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'spatial_methods'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Metode Analisis Spasial</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'standards'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Standar SNI & Regulasi</span>
          </button>

          <button
            onClick={() => setActiveTab('citations')}
            className={`pb-2.5 font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'citations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Rujukan & Pustaka</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto text-xs text-slate-700 leading-relaxed space-y-4">
          
          {/* Tab 1: Theory */}
          {activeTab === 'theory' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  A. Model Data Spasial Vektor OGC (Open Geospatial Consortium)
                </h4>
                <p className="text-slate-700 mb-3">
                  Sistem Informasi Geografis ini mengadopsi standar <strong>OGC Simple Feature Access (RFC 7946 GeoJSON)</strong> dengan tiga tipe entitas geometris:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li>
                    <strong className="text-slate-900">Point Features (Titik):</strong> Titik koordinat kepala sumur (*wellhead*), pusat pembangkit listrik tenaga panas bumi (PLTP), dan manifestasi termal (fumarol/mata air panas).
                  </li>
                  <li>
                    <strong className="text-slate-900">LineString Features (Garis):</strong> Struktur patahan dan sesar tektonik aktif (PuSGeN) yang bertindak sebagai jalur permeabilitas konveksi fluida hidrotermal bawah permukaan.
                  </li>
                  <li>
                    <strong className="text-slate-900">Polygon Features (Poligon Buffer):</strong> Zona penyangga analisis spasial (buffer ring 5 km, 10 km, 25 km) dan batas Wilayah Kerja Panas Bumi (WKP).
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  B. Sistem Referensi Koordinat (Coordinate Reference System - CRS)
                </h4>
                <p className="text-slate-700 mb-2">
                  Dalam implementasi SIG profesional, terdapat perbedaan antara koordinat geografis untuk pertukaran data dan sistem proyeksi untuk kalkulasi metrik:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <span className="font-bold text-slate-900 block">EPSG:4326 (WGS 84)</span>
                    <span className="text-slate-500 text-[11px]">Sistem koordinat bola bumi derajat (Latitude/Longitude) yang digunakan untuk penyimpanan GeoJSON dan penayangan peta Leaflet/Kepler.gl.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <span className="font-bold text-slate-900 block">UTM (Universal Transverse Mercator)</span>
                    <span className="text-slate-500 text-[11px]">Sistem proyeksi konformal silinder dalam satuan meter (Zone 48S untuk Jawa Barat, 47S untuk Sumatera Bagian Selatan) guna kalkulasi jarak Euclidean dan luasan buffer presisi.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Spatial Methods */}
          {activeTab === 'spatial_methods' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  1. Buffer Analysis (Analisis Zona Penyangga Lingkungan & AMDAL)
                </h4>
                <p className="mb-2">
                  Metode buffer digunakan untuk membuat zona penyangga di sekitar tapak proyek panas bumi untuk menguji interaksi spasial terhadap kawasan konservasi:
                </p>
                <div className="space-y-2 mt-3">
                  <div className="p-2.5 bg-white rounded-lg border-l-4 border-red-500 shadow-xs">
                    <strong className="text-slate-900">Radius Buffer 5 km (Zona Inti Operasional):</strong> Area kontrol keselamatan teknis uap bertekanan tinggi (*H2S dispersion & wellhead safety*).
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border-l-4 border-amber-500 shadow-xs">
                    <strong className="text-slate-900">Radius Buffer 10 km (Zona Ekologis & Kawasan Lindung):</strong> Evaluasi tumpang tindih (*overlay*) dengan kawasan hutan lindung / Taman Nasional (seperti TNBBS di sekitar Sekincau, TN Gunung Halimun Salak di sekitar PLTP Salak).
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border-l-4 border-blue-500 shadow-xs">
                    <strong className="text-slate-900">Radius Buffer 25 km (Zona Interkoneksi Regional):</strong> Jangkauan jarak optimal ke gardu induk transmisi tegangan tinggi (SUTET 150/275/500 kV).
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  2. Fault Proximity Analysis (Korelasi Tektonik Sesar Aktif)
                </h4>
                <p>
                  Sistem panas bumi di Indonesia adalah sistem hidrotermal bertipe vulkanik dan tektonik. Data sesar tektonik aktif (Sesar Besar Sumatera / Semangko, Sesar Cimandiri, Sesar Lembang, Sesar Palu-Koro) di-overlay untuk membuktikan hipotesis bahwa permeabilitas rekahan (*fracture permeability*) batuan reservoar dikontrol oleh sistem sesar mendatar geser aktif.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  3. Spatiotemporal Deck.gl 3D Extrusion & Hexbin Density
                </h4>
                <p>
                  Menggunakan algoritma agregasi heksagonal (*Hexbin clustering*) untuk memetakan konsentrasi energi per satuan luas wilayah geologis, serta visualisasi ekstrusi 3D pilar kapasitas MW untuk menyajikan perbandingan daya antar entitas korporasi secara intuitif.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Standards */}
          {activeTab === 'standards' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  A. Standar Nasional Indonesia: SNI 5015:2019
                </h4>
                <p className="mb-2">
                  <strong>SNI 5015:2019</strong> mengatur <em>"Pedoman Pelaporan Sumber Daya dan Cadangan Panas Bumi Indonesia"</em>. Atribut basis data SIG pada aplikasi ini mematuhi klasifikasi entalpi dan status sumber daya resmi:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-[11px]">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <strong className="text-blue-700 block">Entalpi Tinggi (&gt;225°C)</strong>
                    <span className="text-slate-600">Wayang Windu (265°C), Salak (280°C), Darajat (245°C), Dieng (275°C), Sarulla (265°C).</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <strong className="text-amber-700 block">Entalpi Sedang (125-225°C)</strong>
                    <span className="text-slate-600">Marana (185°C), Cisolok (210°C), Wapsalit (200°C), pembangkit siklus biner (Binary Cycle).</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                    <strong className="text-slate-700 block">Entalpi Rendah (&lt;125°C)</strong>
                    <span className="text-slate-600">Pemanfaatan langsung (*direct use*) untuk pariwisata, agrobisnis, dan pengeringan hasil tani.</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-blue-700 text-sm mb-2">
                  B. Kerangka Hukum Pengusahaan Panas Bumi
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li><strong>Undang-Undang No. 21 Tahun 2014 tentang Panas Bumi:</strong> Menegaskan panas bumi bukan kegiatan pertambangan sehingga dapat dikembangkan di kawasan hutan konservasi.</li>
                  <li><strong>Peraturan Pemerintah No. 7 Tahun 2017:</strong> Pengusahaan panas bumi untuk pemanfaatan tidak langsung (pembangkitan tenaga listrik).</li>
                  <li><strong>Perpres No. 112 Tahun 2022:</strong> Percepatan pengembangan energi terbarukan untuk penyediaan tenaga listrik.</li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 4: Citations */}
          {activeTab === 'citations' && (
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm mb-3">
                  Daftar Pustaka & Sumber Rujukan Terpercaya
                </h4>
                
                <div className="space-y-2 text-[11px] text-slate-700 divide-y divide-slate-200">
                  <div className="pt-2">
                    <strong className="text-blue-700">Kementerian ESDM RI (Ditjen EBTKE). (2024).</strong> <em>Neraca Panas Bumi Indonesia dan Sebaran Wilayah Kerja Panas Bumi (WKP) Nasional.</em> Jakarta: Direktorat Panas Bumi.
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">Badan Geologi Kementerian ESDM. (2023).</strong> <em>Atlas Panas Bumi Indonesia: Wilayah Prospek dan Manifestasi Hidrotermal.</em> Bandung: Pusat Sumber Daya Mineral Batubara dan Panas Bumi (PSDMBP).
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">Pusat Studi Gempa Nasional (PuSGeN). (2017/2024).</strong> <em>Peta Sumber dan Bahaya Gempa Indonesia: Peta Sesar Tektonik Aktif Indonesia.</em> Bandung: Kementerian Pekerjaan Umum dan Perumahan Rakyat.
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">PT Barito Renewables Energy Tbk & PT Star Energy Geothermal. (2024).</strong> <em>Annual Report 2024 & Investor Factsheet: Powering Sustainable Transition.</em> Jakarta.
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">PT Pertamina Geothermal Energy Tbk. (2024).</strong> <em>Laporan Keberlanjutan & Portfolio Pembangkit Panas Bumi PGE.</em> Jakarta.
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">Sieh, K., & Natawidjaja, D. (2000).</strong> Neotectonics of the Sumatran fault, Indonesia. <em>Journal of Geophysical Research: Solid Earth</em>, 105(B12), 28295-28326.
                  </div>
                  <div className="pt-2">
                    <strong className="text-blue-700">Saptadji, N. M. (2018).</strong> <em>Teknik Panas Bumi: Karakterisasi Reservoar dan Eksplorasi Panas Bumi Indonesia.</em> Bandung: ITB Press.
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Dipersiapkan untuk Penilaian Mata Kuliah Sistem Informasi Geografis (SIG)
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}
