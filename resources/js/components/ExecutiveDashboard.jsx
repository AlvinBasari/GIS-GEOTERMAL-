import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  ArrowUpRight,
  TrendingUp,
  Globe2
} from 'lucide-react';

export default function ExecutiveDashboard({ sites, stats, onNavigateToMap, onNavigateToTable }) {
  const summary = stats?.summary || {};
  const starData = summary.star_energy || {};

  // Star Energy Sites
  const starSites = sites.filter(s => s.is_star_energy);
  const competitorSites = sites.filter(s => !s.is_star_energy);

  // Group by Island
  const islandGroups = sites.reduce((acc, site) => {
    const isl = site.island || 'Lainnya';
    acc[isl] = (acc[isl] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-slate-900">
      
      {/* Top Banner (Pure White with Crisp Gray Border) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] font-mono font-bold text-blue-700 uppercase tracking-wider mb-1">
            Ringkasan Eksekutif • Portofolio Energi Terbarukan 2026
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950">
            PT Star Energy Geothermal (Barito Renewables)
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Produsen listrik tenaga panas bumi terbesar di Indonesia dengan penguasaan 45.69% pangsa pasar nasional. Memasok daya andal interkoneksi Jawa-Madura-Bali melalui tiga unit operasi strategis dan dua konsesi eksplorasi besar.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onNavigateToMap}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Buka Peta Spasial</span>
          </button>
          <button
            onClick={onNavigateToTable}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors"
          >
            <span>Direktori 27 WKP</span>
            <ArrowUpRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 4 Key Executive Metric Cards (Clean Swiss Minimalist, Zero Badge Clutter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Star Energy Operasional */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Kapasitas Star Energy
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
              {starData.operating_mw || 882.0}
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">MW</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
            45.69% Pangsa Pasar Nasional (Peringkat #1)
          </div>
        </div>

        {/* Card 2: Total Nasional Operasional */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Kapasitas Nasional
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
              {summary.total_operating_mw || 1930.5}
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">MW</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
            Tersebar di {summary.total_sites || 27} Lapangan & Prospek WKP
          </div>
        </div>

        {/* Card 3: Konstruksi & Ekspansi */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Pipa Proyek Konstruksi
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
              {summary.under_construction_pipeline_mw || 205.0}
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">MW</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
            {summary.under_construction_count || 4} Proyek dalam tahap pembangunan fisik
          </div>
        </div>

        {/* Card 4: Potensi & WKP Prospek */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cadangan Potensi Panas Bumi
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-950 font-mono tracking-tight">
              {summary.total_potential_mw || 1785.0}
            </span>
            <span className="text-xs text-slate-500 font-medium font-mono">MW</span>
          </div>
          <div className="mt-3 text-xs text-slate-600 pt-2.5 border-t border-slate-100">
            {summary.potential_prospect_count || 8} Prospek eksplorasi terverifikasi SNI 5015
          </div>
        </div>

      </div>

      {/* Grid: Star Energy Portfolio Assets vs Competitor Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Star Energy Portfolio Assets Detail */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Portofolio Aset PT Star Energy Geothermal
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Unit pembangkit beroperasi dan wilayah konsesi eksplorasi
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
              {starSites.length} Unit
            </span>
          </div>

          <div className="space-y-2.5">
            {starSites.map((site) => (
              <div 
                key={site.id}
                className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 hover:border-blue-400 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{site.site_name}</span>
                    <span className="text-[10px] font-mono text-slate-400">{site.site_code}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {site.regency}, {site.province} • {site.enthalpy_type} ({site.reservoir_temp_celsius || '240'}°C)
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-slate-950 text-sm">
                    {site.installed_capacity_mw > 0 ? `${site.installed_capacity_mw} MW` : `${site.potential_capacity_mw} MW`}
                  </div>
                  <span className="text-[10px] font-mono text-blue-700 font-semibold">
                    {site.project_status === 'Operational' ? 'Operasi Komersial' : 'Tahap Eksplorasi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competitor Breakdown & Geographic Distribution */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-700" />
              Pangsa Pasar Panas Bumi Nasional
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Porsi kapasitas terpasang berdasarkan korporasi pengembang
            </p>
          </div>

          {/* Corporate Share Progress Bars */}
          <div className="space-y-4 text-xs">
            
            {/* Star Energy */}
            <div>
              <div className="flex justify-between text-slate-800 mb-1.5 font-medium">
                <span className="font-bold flex items-center gap-2 text-slate-950">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600"></span>
                  PT Star Energy Geothermal (BREN)
                </span>
                <span className="font-mono font-bold text-blue-600">882.0 MW (45.69%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '45.69%' }}></div>
              </div>
            </div>

            {/* Pertamina Geothermal Energy */}
            <div>
              <div className="flex justify-between text-slate-800 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
                  PT Pertamina Geothermal Energy (PGE)
                </span>
                <span className="font-mono font-bold text-slate-700">672.5 MW (34.84%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-700 rounded-full" style={{ width: '34.84%' }}></div>
              </div>
            </div>

            {/* Sarulla */}
            <div>
              <div className="flex justify-between text-slate-800 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-500"></span>
                  Sarulla Operations Ltd.
                </span>
                <span className="font-mono font-bold text-slate-600">330.0 MW (17.10%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-500 rounded-full" style={{ width: '17.10%' }}></div>
              </div>
            </div>

            {/* Geo Dipa */}
            <div>
              <div className="flex justify-between text-slate-800 mb-1.5 font-medium">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-slate-400"></span>
                  PT Geo Dipa Energi (Persero)
                </span>
                <span className="font-mono font-bold text-slate-600">120.0 MW (6.22%)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '6.22%' }}></div>
              </div>
            </div>

          </div>

          {/* Regional Geothermal Islands */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
              Sebaran Geografis Kepulauan:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center text-xs">
              {Object.entries(islandGroups).map(([island, count]) => (
                <div key={island} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">{island}</div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">{count} Lapangan</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
