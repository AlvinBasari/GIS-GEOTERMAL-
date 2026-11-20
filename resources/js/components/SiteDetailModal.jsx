import React from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  Mountain, 
  BookOpen, 
  CheckCircle2,
  Clock,
  Radio,
  Edit3
} from 'lucide-react';

export default function SiteDetailModal({ site, onClose, onEdit }) {
  if (!site) return null;

  const isStar = Boolean(site.is_star_energy);
  const lat = parseFloat(site.latitude);
  const lng = parseFloat(site.longitude);

  // Approximate UTM Zone for Indonesia
  const utmZone = Math.floor((lng + 180) / 6) + 1;
  const utmHemisphere = lat >= 0 ? 'N' : 'S';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900">
        
        {/* Modal Header (Crisp White with Subtle Border) */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                  isStar 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  {isStar ? '★ ASET STAR ENERGY' : site.company_category}
                </span>

                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200 shadow-2xs">
                  {site.project_status}
                </span>

                <span className="font-mono text-[10px] text-slate-500 font-semibold">
                  {site.site_code}
                </span>
              </div>

              <h2 className="text-xl font-extrabold text-slate-950 leading-tight">
                {site.site_name}
              </h2>
              <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                <span>🏢</span> <span>{site.operator_company}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-800 border border-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Top Key Metrics Banner (Pure White Cards with Subtle Slate Borders) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Kapasitas Operasional</span>
              <div className="text-xl font-black text-slate-950 font-mono mt-0.5">
                {site.installed_capacity_mw > 0 ? `${site.installed_capacity_mw} MW` : '0 MW'}
              </div>
              <span className="text-[10px] text-blue-600 font-semibold">{site.status_label || 'Pembangkit Aktif'}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Estimasi Potensi</span>
              <div className="text-xl font-black text-slate-950 font-mono mt-0.5">
                {site.potential_capacity_mw ? `${site.potential_capacity_mw} MW` : '-'}
              </div>
              <span className="text-[10px] text-slate-500">Cadangan Terduga</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Suhu Reservoar</span>
              <div className="text-xl font-black text-slate-950 font-mono mt-0.5">
                {site.reservoir_temp_celsius ? `${site.reservoir_temp_celsius} °C` : '-'}
              </div>
              <span className="text-[10px] text-slate-500">{site.enthalpy_type}</span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Ketinggian Tapak</span>
              <div className="text-xl font-black text-slate-950 font-mono mt-0.5">
                {site.elevation_masl ? `${site.elevation_masl} m` : '-'}
              </div>
              <span className="text-[10px] text-slate-500">DPL</span>
            </div>
          </div>

          {/* Description & Overview */}
          {site.description && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed text-slate-700">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Profil Lapangan & Karakteristik Termal
              </h4>
              <p>{site.description}</p>
            </div>
          )}

          {/* Geospatial & Thermodynamic Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Spatial & Administrative */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" /> Parameter Geospasial (SIG)
              </h4>
              <div className="divide-y divide-slate-200 text-[11px]">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Koordinat Lintang (Lat):</span>
                  <span className="font-mono text-slate-950 font-bold">{lat.toFixed(6)}°</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Koordinat Bujur (Lng):</span>
                  <span className="font-mono text-slate-950 font-bold">{lng.toFixed(6)}°</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">CRS Standar:</span>
                  <span className="font-mono text-slate-900 font-medium">EPSG:4326 (WGS 84)</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Zona Proyeksi UTM:</span>
                  <span className="font-mono text-blue-600 font-bold">UTM Zone {utmZone}{utmHemisphere}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Kabupaten / Kota:</span>
                  <span className="text-slate-900 font-medium">{site.regency}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Provinsi & Pulau:</span>
                  <span className="text-slate-900 font-medium">{site.province} ({site.island})</span>
                </div>
              </div>
            </div>

            {/* Box 2: Engineering & Grid Connection */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-600" /> Teknis Energi & Transmisi
              </h4>
              <div className="divide-y divide-slate-200 text-[11px]">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Nama Wilayah Kerja (WKP):</span>
                  <span className="text-slate-900 font-semibold">{site.wkp_name || 'Cadangan Pemerintah RI'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Klasifikasi Entalpi:</span>
                  <span className="text-slate-900 font-semibold">{site.enthalpy_type}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Interkoneksi Transmisi:</span>
                  <span className="text-slate-900 text-right font-medium">{site.grid_connection || 'Sistem Kelistrikan Regional'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Tahun Operasi Komersial (COD):</span>
                  <span className="font-mono text-slate-900">{site.commercial_operation_year || 'Dalam Perencanaan'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Radius Buffer Analisis:</span>
                  <span className="text-blue-600 font-bold">5 km (Inti) / 10 km / 25 km (AMDAL)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Academic Source Citation */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 text-[10px] text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800">Sumber Rujukan Data:</span> {site.data_source}
            </div>
            <div className="font-mono text-slate-700 font-semibold">
              SNI 5015:2019 Compliant
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Terakhir dimutakhirkan: {new Date(site.updated_at || site.created_at).toLocaleDateString('id-ID')}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onClose(); onEdit && onEdit(site); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Parameter Lapangan</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
