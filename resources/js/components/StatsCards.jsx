import React from 'react';
import { Zap, ShieldCheck, Hammer, Compass, Filter } from 'lucide-react';

export default function StatsCards({ 
  stats, 
  activeFilter, 
  setActiveFilter, 
  starOnly, 
  setStarOnly 
}) {
  if (!stats) return null;

  const summary = stats.summary || {};
  const starData = summary.star_energy || {};

  return (
    <div className="bg-[#0c111a] border-b border-slate-800 px-4 lg:px-6 py-2.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        
        {/* Metric Cards Grid: Sober Executive Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 flex-1">
          
          {/* Card 1: Star Energy Share */}
          <div 
            onClick={() => setStarOnly(!starOnly)}
            className={`cursor-pointer rounded-lg p-2.5 transition-colors border ${
              starOnly 
                ? 'bg-[#121c2c] border-emerald-600 shadow-sm' 
                : 'bg-[#0f1523] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                STAR ENERGY SHARE
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-emerald-400 font-mono font-bold border border-slate-700">
                {starData.market_share_percent || 0}%
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                {starData.operating_mw || 0}
              </span>
              <span className="text-xs text-slate-400">MW Operasi</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>{starData.sites_count || 0} Aset Utama</span>
              <span className="text-emerald-400 font-medium">{starOnly ? '• Aktif' : 'Klik Filter'}</span>
            </div>
          </div>

          {/* Card 2: Total Operating National */}
          <div 
            onClick={() => setActiveFilter(activeFilter === 'Operational' ? 'all' : 'Operational')}
            className={`cursor-pointer rounded-lg p-2.5 transition-colors border ${
              activeFilter === 'Operational' 
                ? 'bg-[#121c2c] border-slate-600 shadow-sm' 
                : 'bg-[#0f1523] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                TOTAL OPERASIONAL RI
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono border border-slate-700">
                {summary.total_sites || 0} Titik
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                {summary.total_operating_mw || 0}
              </span>
              <span className="text-xs text-slate-400">MW Terpasang</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>Star + PGE + Geo Dipa</span>
              <span className="text-slate-300">{activeFilter === 'Operational' ? '• Terpilih' : ''}</span>
            </div>
          </div>

          {/* Card 3: Under Construction */}
          <div 
            onClick={() => setActiveFilter(activeFilter === 'Under Construction' ? 'all' : 'Under Construction')}
            className={`cursor-pointer rounded-lg p-2.5 transition-colors border ${
              activeFilter === 'Under Construction' 
                ? 'bg-[#121c2c] border-amber-600 shadow-sm' 
                : 'bg-[#0f1523] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                KONSTRUKSI / EKSPANSI
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-mono border border-slate-700">
                {summary.under_construction_count || 0} Proyek
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                {summary.under_construction_pipeline_mw || 0}
              </span>
              <span className="text-xs text-slate-400">MW Pipeline</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>Lumut Balai 2, Patuha 2</span>
              <span className="text-amber-400">{activeFilter === 'Under Construction' ? '• Terpilih' : ''}</span>
            </div>
          </div>

          {/* Card 4: Potential Prospects */}
          <div 
            onClick={() => setActiveFilter(activeFilter === 'Potential' ? 'all' : 'Potential')}
            className={`cursor-pointer rounded-lg p-2.5 transition-colors border ${
              activeFilter === 'Potential' 
                ? 'bg-[#121c2c] border-teal-600 shadow-sm' 
                : 'bg-[#0f1523] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                PROSPEK WKP ESDM
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-teal-400 font-mono border border-slate-700">
                {summary.potential_prospect_count || 0} WKP
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white font-mono tracking-tight">
                {summary.total_potential_mw || 0}
              </span>
              <span className="text-xs text-slate-400">MW Cadangan</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
              <span>Potensi Greenfield Baru</span>
              <span className="text-teal-400">{activeFilter === 'Potential' ? '• Terpilih' : ''}</span>
            </div>
          </div>

        </div>

        {/* Clean Neutral Filter Pills */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <div className="flex items-center gap-1 bg-[#070b12] p-1 rounded-lg border border-slate-800 text-[11px]">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Filter className="w-3 h-3 text-slate-500" /> Filter:
            </span>
            <button
              onClick={() => { setActiveFilter('all'); setStarOnly(false); }}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'all' && !starOnly 
                  ? 'bg-slate-800 text-white font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveFilter('Operational')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'Operational' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Operasi
            </button>
            <button
              onClick={() => setActiveFilter('Under Construction')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'Under Construction' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Konstruksi
            </button>
            <button
              onClick={() => setActiveFilter('Exploration')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'Exploration' ? 'bg-slate-800 text-blue-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Eksplorasi
            </button>
            <button
              onClick={() => setActiveFilter('Potential')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeFilter === 'Potential' ? 'bg-slate-800 text-teal-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              WKP Cadangan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
