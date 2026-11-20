import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  Zap,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function SitesTable({ 
  sites, 
  onSelectSite, 
  onEditSite, 
  onDeleteSite,
  onOpenAddModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('capacity_desc');

  // Filter & Search
  const filtered = sites.filter(site => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (site.site_name && site.site_name.toLowerCase().includes(term)) ||
      (site.operator_company && site.operator_company.toLowerCase().includes(term)) ||
      (site.province && site.province.toLowerCase().includes(term)) ||
      (site.regency && site.regency.toLowerCase().includes(term)) ||
      (site.site_code && site.site_code.toLowerCase().includes(term));

    const matchStatus = statusFilter === 'all' || site.project_status === statusFilter;
    const matchCompany = companyFilter === 'all' || 
      (companyFilter === 'star' && site.is_star_energy) ||
      (companyFilter === 'pge' && site.company_category?.includes('PGE')) ||
      (companyFilter === 'geodipa' && site.company_category?.includes('Geo Dipa')) ||
      (companyFilter === 'other' && !site.is_star_energy && !site.company_category?.includes('PGE') && !site.company_category?.includes('Geo Dipa'));

    return matchSearch && matchStatus && matchCompany;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'capacity_desc') {
      return (parseFloat(b.installed_capacity_mw) || 0) - (parseFloat(a.installed_capacity_mw) || 0);
    }
    if (sortBy === 'capacity_asc') {
      return (parseFloat(a.installed_capacity_mw) || 0) - (parseFloat(b.installed_capacity_mw) || 0);
    }
    if (sortBy === 'name') {
      return a.site_name.localeCompare(b.site_name);
    }
    if (sortBy === 'star_first') {
      return (b.is_star_energy ? 1 : 0) - (a.is_star_energy ? 1 : 0);
    }
    return 0;
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto text-slate-900">
      
      {/* Table Header & Search Controls (Pure White Card) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div>
          <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Direktori 27 Lapangan & Prospek Panas Bumi Nasional
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Menampilkan {sorted.length} dari total {sites.length} titik koordinat geospasial terverifikasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari lapangan, daerah, operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-sans"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="Operational">Operasional</option>
            <option value="Under Construction">Konstruksi / Ekspansi</option>
            <option value="Exploration">Eksplorasi / PSPE</option>
            <option value="Potential">Prospek Cadangan</option>
          </select>

          {/* Company Filter */}
          <select
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="all">Semua Operator</option>
            <option value="star">★ Star Energy Geothermal</option>
            <option value="pge">Pertamina Geothermal (PGE)</option>
            <option value="geodipa">Geo Dipa Energi</option>
            <option value="other">Kompetitor Lainnya / ESDM</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-blue-600"
          >
            <option value="capacity_desc">MW Terbesar &darr;</option>
            <option value="capacity_asc">MW Terkecil &uarr;</option>
            <option value="star_first">Star Energy Dulu</option>
            <option value="name">Nama Alfabetis</option>
          </select>

          {/* Add Button */}
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            + Input Titik Baru
          </button>
        </div>

      </div>

      {/* Data Table (Crisp White Card & Clean Light Rows) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Lapangan / WKP</th>
                <th className="py-3.5 px-3">Operator / Korporasi</th>
                <th className="py-3.5 px-3">Status Pengusahaan</th>
                <th className="py-3.5 px-3 text-right">Kapasitas Operasi (MW)</th>
                <th className="py-3.5 px-3 text-right">Potensi (MW)</th>
                <th className="py-3.5 px-3">Wilayah & Pulau</th>
                <th className="py-3.5 px-3">Koordinat WGS 84</th>
                <th className="py-3.5 px-4 text-center">Aksi SIG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 text-sm">
                    Tidak ada lapangan panas bumi yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                sorted.map((site) => {
                  const isStar = Boolean(site.is_star_energy);
                  const capacity = parseFloat(site.installed_capacity_mw) || 0;

                  let statusBadge = (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      Operasional
                    </span>
                  );

                  if (site.project_status === 'Under Construction') {
                    statusBadge = (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        Konstruksi / Ekspansi
                      </span>
                    );
                  } else if (site.project_status === 'Exploration') {
                    statusBadge = (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Eksplorasi / PSPE
                      </span>
                    );
                  } else if (site.project_status === 'Potential') {
                    statusBadge = (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        Prospek WKP
                      </span>
                    );
                  }

                  return (
                    <tr 
                      key={site.id} 
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isStar ? 'bg-blue-50/20' : ''
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {isStar && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white font-mono">
                              STAR
                            </span>
                          )}
                          <span className="font-bold text-slate-950 text-xs">
                            {site.site_name}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {site.site_code} {site.wkp_name ? `• ${site.wkp_name}` : ''}
                        </div>
                      </td>

                      {/* Operator */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-800">{site.operator_company}</div>
                        <div className="text-[10px] text-slate-500">{site.company_category}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {statusBadge}
                      </td>

                      {/* Operating Capacity MW */}
                      <td className="py-3 px-3 text-right font-mono">
                        {capacity > 0 ? (
                          <span className="font-bold text-slate-950 text-sm">
                            {capacity.toFixed(1)} <span className="text-[10px] font-normal text-slate-500">MW</span>
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Potential Capacity MW */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {site.potential_capacity_mw ? `${parseFloat(site.potential_capacity_mw).toFixed(1)} MW` : '-'}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3">
                        <div className="font-medium text-slate-800">{site.island || 'Jawa'}</div>
                        <div className="text-[10px] text-slate-500">{site.province}</div>
                      </td>

                      {/* Coordinates */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        [{parseFloat(site.latitude).toFixed(4)}, {parseFloat(site.longitude).toFixed(4)}]
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectSite(site)}
                            className="p-1.5 rounded-md hover:bg-blue-100 text-blue-600 transition-colors"
                            title="Tampilkan di Peta Spasial"
                          >
                            <MapPin className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditSite(site)}
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                            title="Edit Data Lapangan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSite(site.id)}
                            className="p-1.5 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
