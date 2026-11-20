import React from 'react';
import { 
  X, 
  Database, 
  MapPin, 
  FileText, 
  Layers, 
  Activity, 
  CheckCircle2, 
  ArrowRight, 
  HardDrive, 
  Search, 
  Scale, 
  Ruler, 
  Table, 
  Camera, 
  Satellite, 
  TrendingUp,
  Award
} from 'lucide-react';

export default function SubSistemSigModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-900 select-text">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-[#f8f8f5] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121316] text-[#d8f537] text-[10px] font-black uppercase tracking-wider mb-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Standar Kurikulum Sains Informasi Geografis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Arsitektur 4 Sub Sistem SIG Panas Bumi
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Struktur integrasi komponen sistem dari Data Input, Manajemen Basis Data, Manipulasi & Analisis, hingga Output.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-600 hover:text-black border border-slate-200 flex items-center justify-center transition-colors shadow-2xs shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Diagram */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Visual Workflow Grid of the 4 Subsystems */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Box 1: DATA INPUT */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                  01
                </div>
                <h3 className="font-extrabold text-blue-950 text-sm mb-1">
                  DATA INPUT
                </h3>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-3 font-mono">
                  Primer & Sekunder
                </span>
                
                <ul className="space-y-2 text-[11px] text-slate-700 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Pengukuran Lapangan:</strong> Plot koordinat GPS & digitasi poligon area oleh Surveyor.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Foto Udara & Drone:</strong> Dokumentasi aerial lanskap WKP dan kepala sumur.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Citra Satelit & DEM:</strong> Citra satelit Esri High-Resolution & topografi SRTM.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span><strong>Peta Tematik:</strong> Patahan sesar aktif seismik PuSGeN & batas WKP.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-2 border-t border-blue-200 text-[10px] font-mono text-blue-800">
                Aktor: <strong>Surveyor & Lead</strong>
              </div>
            </div>

            {/* Box 2: DATA MANAGEMENT */}
            <div className="bg-purple-50/70 rounded-2xl p-4 border border-purple-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                  02
                </div>
                <h3 className="font-extrabold text-purple-950 text-sm mb-1">
                  DATA MANAGEMENT
                </h3>
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-3 font-mono">
                  Storage & Retrieval
                </span>

                <ul className="space-y-2 text-[11px] text-slate-700 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Storage / Basis Data:</strong> Database relasional spasial PostGIS / SQLite (WGS 84 • EPSG:4326).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Retrieval Engine:</strong> Query spasial cepat, indexing koordinat, dan pencarian multi-kriteria.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Tata Kelola Pengguna:</strong> RBAC (Role-Based Access Control) untuk Admin, Lead, dan Surveyor.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Audit Trail:</strong> Rekam jejak riwayat revisi dan keamanan spasial.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-2 border-t border-purple-200 text-[10px] font-mono text-purple-800">
                Aktor: <strong>Chief GIS Admin</strong>
              </div>
            </div>

            {/* Box 3: DATA MANIPULATION & ANALYSIS */}
            <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                  03
                </div>
                <h3 className="font-extrabold text-amber-950 text-sm mb-1">
                  MANIPULASI & ANALISIS
                </h3>
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-3 font-mono">
                  Processing Spasial
                </span>

                <ul className="space-y-2 text-[11px] text-slate-700 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>Kalkulator Buffer AMDAL:</strong> Pemodelan radius proteksi lingkungan 5 km di hutan lindung.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>Kalkulasi Area Poligon:</strong> Algoritma geodesik spherical shoelace untuk luas Hektar (Ha).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>Ruler Jarak Geodesik:</strong> Mengukur panjang bentang pipa uap & jarak antar sumur.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span><strong>Korelasi Sesar Sesar Aktif:</strong> Evaluasi permeabilitas reservoir geotermal.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-2 border-t border-amber-200 text-[10px] font-mono text-amber-800">
                Aktor: <strong>Lead Geoscientist</strong>
              </div>
            </div>

            {/* Box 4: DATA OUTPUT */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 flex flex-col justify-between">
              <div>
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs mb-2 shadow-xs">
                  04
                </div>
                <h3 className="font-extrabold text-emerald-950 text-sm mb-1">
                  DATA OUTPUT
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-3 font-mono">
                  Multi-Channel Reporting
                </span>

                <ul className="space-y-2 text-[11px] text-slate-700 font-medium">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Peta Interaktif:</strong> Visualisasi Web GIS + Sliding Detail Drawer di kanan.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Tabel Spasial:</strong> Direktori 27 WKP seluruh Indonesia dengan pagination & sorting.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Laporan Eksekutif:</strong> Ringkasan potensi energi bersih siap cetak / PDF.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span><strong>Softcopy Export:</strong> Ekspor OGC GeoJSON (EPSG:4326) & CSV untuk GIS desktop (QGIS/ArcGIS).</span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 pt-2 border-t border-emerald-200 text-[10px] font-mono text-emerald-800">
                Aktor: <strong>Seluruh Pemangku Kepentingan</strong>
              </div>
            </div>

          </div>

          {/* Academic Conclusion Banner */}
          <div className="bg-[#121316] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#d8f537] font-bold">
                KESIMPULAN IMPLEMENTASI
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                Pemisahan Peran Mencerminkan Sub-Sistem SIG Nyata
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Surveyor menguasai <strong>Sub Sistem Input</strong>, Admin mengendalikan <strong>Sub Sistem Data Management</strong>, dan Lead Geoscientist memimpin <strong>Sub Sistem Analisis & Output</strong>.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-[#d8f537] hover:bg-[#c9e62f] text-black font-extrabold text-xs whitespace-nowrap transition-colors shadow-sm"
            >
              Tutup Penjelasan
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
