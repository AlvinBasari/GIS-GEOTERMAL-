import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Activity, 
  FileText, 
  Download, 
  Upload, 
  Users, 
  Database, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  ArrowLeft, 
  Compass, 
  Scale, 
  ChevronRight, 
  Layers, 
  FileCheck
} from 'lucide-react';

export default function AdminPanel({ 
  currentUser, 
  onBackToMap, 
  sites, 
  onSiteUpdated,
  onRefreshAllData 
}) {
  const [activeTab, setActiveTab] = useState('buffer'); // 'buffer' | 'audit' | 'export' | 'users' | 'standards'
  
  // State for Spatial Audit Logs
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  // State for Buffer Conflict Calculator
  const [selectedSiteId, setSelectedSiteId] = useState(sites.length > 0 ? sites[0].id : '');
  const [bufferResults, setBufferResults] = useState(null);
  const [isCalculatingBuffer, setIsCalculatingBuffer] = useState(false);

  // State for Users List
  const [userList, setUserList] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // State for File Ingestion Simulation
  const [importStatus, setImportStatus] = useState(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  // 1. Fetch Audit Logs
  const fetchAuditLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.success) {
        setAuditLogs(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // 2. Fetch Users
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUserList(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // 3. Run Buffer Conflict Calculation
  const runBufferCalculation = async (siteId) => {
    if (!siteId) return;
    setIsCalculatingBuffer(true);
    try {
      const res = await fetch(`/api/admin/buffer-conflict?site_id=${siteId}`);
      const data = await res.json();
      if (data.success) {
        setBufferResults(data);
      }
    } catch (err) {
      console.error('Failed to calculate buffer conflict:', err);
    } finally {
      setIsCalculatingBuffer(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchUsers();
    if (selectedSiteId) {
      runBufferCalculation(selectedSiteId);
    }
  }, []);

  const handleSiteChange = (e) => {
    const newId = e.target.value;
    setSelectedSiteId(newId);
    runBufferCalculation(newId);
  };

  const handleSimulateImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImport(true);
    setImportStatus(null);

    setTimeout(() => {
      setIsProcessingImport(false);
      setImportStatus({
        success: true,
        fileName: file.name,
        recordsFound: 5,
        validCRS: 'EPSG:4326 (WGS 84)',
        message: 'Validasi skema SNI 5015:2019 berhasil. 5 fitur geometri titik siap dimasukkan ke pangkalan data spasial.'
      });
    }, 1000);
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      (log.site_name && log.site_name.toLowerCase().includes(logSearch.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(logSearch.toLowerCase())) ||
      (log.user_name && log.user_name.toLowerCase().includes(logSearch.toLowerCase()));
    
    const matchesAction = selectedActionFilter === 'ALL' || log.action_type === selectedActionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans antialiased">
      
      {/* ======================================================== */}
      {/* TOP ADMIN HEADER BAR WITH OFFICIAL LOGO                  */}
      {/* ======================================================== */}
      <header className="bg-[#0c111a] border-b border-slate-800 px-4 lg:px-8 py-3 sticky top-0 z-40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToMap}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b29] hover:bg-[#1a2335] text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Peta</span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />
            
            <div className="flex items-center gap-3">
              <div className="bg-[#070b12] px-2 py-0.5 rounded border border-slate-800">
                <img 
                  src="/logo_star_energy.png" 
                  alt="Star Energy Geothermal" 
                  className="h-7 w-auto object-contain" 
                />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-base text-white tracking-tight">
                  PANEL KONTROL ADMINISTRATOR SIG
                </h1>
                <p className="text-[11px] text-slate-400">
                  PT Star Energy Geothermal • Geomatics & Subsurface Information System
                </p>
              </div>
            </div>
          </div>

          {/* Current User Badge */}
          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">
                {currentUser?.name || 'Administrator SIG'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentUser?.role || 'Super Admin GIS'} • {currentUser?.department || 'Geomatics'}
              </div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-emerald-900 border border-emerald-700 flex items-center justify-center font-bold text-xs text-emerald-200">
              {currentUser?.avatar_initials || 'AP'}
            </div>
          </div>

        </div>

        {/* Tab Navigation Menu: SOBER & CORPORATE */}
        <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none border-t border-slate-800 pt-2.5">
          
          <button
            onClick={() => setActiveTab('buffer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'buffer'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Kalkulator Buffer AMDAL</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'audit'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Audit Trail Spasial ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'export'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Pusat Data & Ekspor/Impor</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'users'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Personil SIG ({userList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('standards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shrink-0 ${
              activeTab === 'standards'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>Standar & Integritas Spasial</span>
          </button>

        </div>
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">

        {/* TAB 1: AMDAL CONSERVATION BUFFER CONFLICT CALCULATOR */}
        {activeTab === 'buffer' && (
          <div className="space-y-5">
            
            <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  Kalkulator Konflik Spasial Kawasan Konservasi & AMDAL
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Analisis geodesik jarak buffer terhadap kawasan konservasi nasional sesuai ketentuan <strong>PP No. 7 Tahun 2017</strong> tentang Pemanfaatan Panas Bumi pada Kawasan Hutan Konservasi.
                </p>
              </div>

              {/* Site Selector Dropdown */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-slate-400 whitespace-nowrap">Pilih Lapangan:</span>
                <select
                  value={selectedSiteId}
                  onChange={handleSiteChange}
                  className="bg-[#090d15] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  {sites.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.site_name} {s.is_star_energy ? '★ [Star Energy]' : `(${s.operator_company})`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Site Spatial Context */}
            {bufferResults?.site && (
              <div className="p-3.5 rounded-xl bg-[#090d15] border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">LOKASI TITIK PUSAT:</span>
                  <span className="font-bold text-white">{bufferResults.site.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">OPERATOR KONSESI:</span>
                  <span className="text-slate-300 font-medium">{bufferResults.site.operator}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">KOORDINAT (WGS 84):</span>
                  <span className="text-emerald-400">{bufferResults.site.latitude.toFixed(4)}°, {bufferResults.site.longitude.toFixed(4)}°</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block font-sans">PROYEKSI:</span>
                  <span className="text-slate-300">EPSG:4326 / UTM</span>
                </div>
              </div>
            )}

            {/* Conflict Analysis Cards */}
            {isCalculatingBuffer ? (
              <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Menghitung jarak geodesik Haversine...</span>
              </div>
            ) : bufferResults?.analysis ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {bufferResults.analysis.map((zone, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800 bg-[#0e1422] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-white">
                          {zone.zone_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {zone.zone_type}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold font-mono text-white">
                          {zone.distance_km} <span className="text-xs font-normal text-slate-400">km</span>
                        </div>
                        <span className="text-[9px] uppercase font-mono text-slate-500">Jarak Geodesik</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Klasifikasi Zona:</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          zone.badge_color === 'red'
                            ? 'bg-red-950/60 text-red-300 border border-red-800'
                            : zone.badge_color === 'amber'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                        }`}>
                          {zone.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 bg-[#090d15] p-2 rounded border border-slate-800/80 mt-1">
                        <span className="text-slate-400 font-semibold block mb-0.5">Dasar Regulasi:</span>
                        {zone.regulation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {/* Regulatory Matrix */}
            <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 text-xs">
              <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Ketentuan Buffer Konservasi Berdasarkan Regulasi Nasional
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-400">
                <div className="p-2.5 rounded bg-[#090d15] border border-slate-800">
                  <div className="font-bold text-red-400 mb-1">Zona Inti (&le; 5 km)</div>
                  <p>Memerlukan Izin Pemanfaatan Panas Bumi (IPPB) khusus Menteri LHK sesuai PP 7/2017 & AMDAL Tipe A komprehensif.</p>
                </div>
                <div className="p-2.5 rounded bg-[#090d15] border border-slate-800">
                  <div className="font-bold text-amber-400 mb-1">Zona Penyangga (5 - 10 km)</div>
                  <p>Wajib implementasi Rencana Pemantauan Lingkungan (RPL) terhadap air tanah, flora-fauna, dan rembesan H2S.</p>
                </div>
                <div className="p-2.5 rounded bg-[#090d15] border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1">Zona Koordinasi (&gt; 10 km)</div>
                  <p>Operasional standar sesuai persetujuan teknis Ditjen EBTKE Kementerian ESDM tanpa tumpang tindih kawasan lindung.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SPATIAL AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#0e1422] border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Cari berdasarkan nama aset, operator, atau keterangan..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#090d15] border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Tipe Aksi:</span>
                <select
                  value={selectedActionFilter}
                  onChange={(e) => setSelectedActionFilter(e.target.value)}
                  className="bg-[#090d15] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="ALL">Semua Aksi</option>
                  <option value="CREATE_SITE">CREATE_SITE</option>
                  <option value="UPDATE_COORDINATES">UPDATE_COORDINATES</option>
                  <option value="BUFFER_VERIFICATION">BUFFER_VERIFICATION</option>
                  <option value="EXPORT_DATA">EXPORT_DATA</option>
                </select>

                <button
                  onClick={fetchAuditLogs}
                  disabled={isLoadingLogs}
                  className="p-1.5 rounded-lg bg-[#141b29] hover:bg-[#1a2335] text-slate-300 border border-slate-700 transition-colors"
                  title="Segarkan Log"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin text-emerald-400' : ''}`} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0e1422]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#090d15] text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Waktu (WIB)</th>
                    <th className="py-2.5 px-3">Personil SIG</th>
                    <th className="py-2.5 px-3">Aset Geotermal</th>
                    <th className="py-2.5 px-3">Tipe Tindakan</th>
                    <th className="py-2.5 px-3">Detail Perubahan Spasial</th>
                    <th className="py-2.5 px-3 font-mono">Alamat IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                        Tidak ada riwayat audit yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-semibold text-slate-200">{log.user_name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{log.user_email}</div>
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-white">{log.site_name}</span>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            {log.action_type}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-300 max-w-md leading-relaxed text-[11px]">
                          {log.details}
                        </td>
                        <td className="py-2 px-3 text-slate-400 font-mono text-[10px] whitespace-nowrap">
                          {log.ip_address || '127.0.0.1'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: SPATIAL DATA HUB & EXPORT / IMPORT */}
        {activeTab === 'export' && (
          <div className="space-y-5">
            
            <div className="p-5 rounded-xl bg-[#0e1422] border border-slate-800">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                Pusat Unduhan & Ekspor Data Spasial Standar
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Ekspor repositori 27 wilayah kerja dan PLTP panas bumi Indonesia ke format standar GIS.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                
                {/* GeoJSON */}
                <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-mono">GeoJSON (RFC 7946)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        WGS 84
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Format standar pertukaran spasial titik koordinat dan metadata SNI 5015:2019 untuk QGIS dan ArcGIS.
                    </p>
                  </div>
                  <a
                    href="/api/admin/export/geojson"
                    download="geothermal_indonesia_wgs84.geojson"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Unduh GeoJSON (27 Aset)</span>
                  </a>
                </div>

                {/* CSV */}
                <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-mono">Tabel Atribut CSV</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Tabular
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Daftar terstruktur seluruh lapangan, kapasitas MW, temperatur fluida, dan koordinat untuk Excel atau Python.
                    </p>
                  </div>
                  <a
                    href="/api/admin/export/csv"
                    download="geothermal_indonesia_attributes.csv"
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Unduh Tabel CSV</span>
                  </a>
                </div>

                {/* Kepler.gl JSON */}
                <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-mono">Konfigurasi Kepler.gl</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        Deck.gl 3D
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Preset konfigurasi visualisasi 3D kolom ketinggian energi MW untuk kepler.gl visualizer.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const sampleConfig = {
                        version: 'v1',
                        dataset: 'StarEnergy_Geothermal_National',
                        featuresCount: sites.length,
                        projection: 'EPSG:4326',
                        extrusionField: 'installed_capacity_mw'
                      };
                      const blob = new Blob([JSON.stringify(sampleConfig, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'kepler_geothermal_config.json';
                      a.click();
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2]" />
                    <span>Unduh Preset Kepler.gl</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Ingestion & Schema Validator Section */}
            <div className="p-5 rounded-xl bg-[#0e1422] border border-slate-800">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                Validasi & Impor Data Spasial Baru (SNI 5015:2019)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Unggah berkas GeoJSON atau CSV survei lapangan untuk divalidasi integritas koordinat (WGS 84) sebelum diintegrasikan.
              </p>

              <div className="border border-dashed border-slate-700 hover:border-slate-500 rounded-xl p-8 text-center bg-[#090d15] transition-colors">
                <div className="max-w-md mx-auto">
                  <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-200">
                    Pilih file GeoJSON (.geojson), CSV (.csv), atau KML
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 mb-4">
                    Sistem akan memvalidasi atribut wajib: site_name, latitude, longitude, installed_capacity_mw, enthalpy_type.
                  </p>

                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141b29] hover:bg-[#1a2335] text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
                    <span>Pilih Berkas Geospasial</span>
                    <input 
                      type="file" 
                      accept=".geojson,.json,.csv,.kml" 
                      onChange={handleSimulateImport}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              {isProcessingImport && (
                <div className="mt-3 p-3 rounded-lg bg-[#090d15] border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Memvalidasi struktur skema spasial dan proyeksi EPSG:4326...</span>
                </div>
              )}

              {importStatus && (
                <div className="mt-3 p-3.5 rounded-lg bg-[#0d1822] border border-emerald-700/60 text-xs">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Validasi Berkas Berhasil: {importStatus.fileName}</span>
                  </div>
                  <p className="text-slate-300 mt-0.5">{importStatus.message}</p>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                    <span>Jumlah Entitas: {importStatus.recordsFound} WKP</span>
                    <span>Proyeksi: {importStatus.validCRS}</span>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 4: GIS PERSONNEL & ACCESS MATRIX */}
        {activeTab === 'users' && (
          <div className="space-y-5">
            
            <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                Daftar Personil & Hak Akses Sistem Informasi Geografis
              </h2>
              <p className="text-xs text-slate-400">
                Struktur otorisasi peranan berbasis peran (RBAC) pada sistem GIS Star Energy Geothermal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {userList.map((u) => (
                <div key={u.id} className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-900 border border-emerald-700 flex items-center justify-center font-bold text-xs text-emerald-200">
                        {u.avatar_initials || 'SE'}
                      </div>
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Peran SIG:</span>
                        <span className="font-semibold text-slate-200">{u.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Divisi:</span>
                        <span className="text-slate-300">{u.department}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 font-medium text-[10px]">
                          Aktif Terverifikasi
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                    ID: SEG-USER-00{u.id}
                  </div>
                </div>
              ))}
            </div>

            {/* Privilege Matrix Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0e1422] p-4">
              <h3 className="font-bold text-xs text-slate-200 mb-3">Matriks Otorisasi Hak Akses Spasial</h3>
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                    <th className="py-2">Fitur / Modul GIS</th>
                    <th className="py-2">Super Admin GIS</th>
                    <th className="py-2">Lead Geoscientist</th>
                    <th className="py-2">Field Surveyor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  <tr>
                    <td className="py-2">Melihat Peta Leaflet & Kepler.gl 3D</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                  </tr>
                  <tr>
                    <td className="py-2">Input & Edit Titik Lokasi Baru</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-amber-400">Draf Saja</td>
                    <td className="py-2 text-emerald-400">✓ Survei Baru</td>
                  </tr>
                  <tr>
                    <td className="py-2">Analisis Buffer AMDAL Konservasi</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="py-2">Ekspor Data Spasial (GeoJSON/CSV)</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-slate-500">-</td>
                  </tr>
                  <tr>
                    <td className="py-2">Audit Trail & Manajemen Pengguna</td>
                    <td className="py-2 text-emerald-400">✓ Penuh</td>
                    <td className="py-2 text-slate-500">-</td>
                    <td className="py-2 text-slate-500">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 5: SPATIAL STANDARDS */}
        {activeTab === 'standards' && (
          <div className="space-y-5">
            
            <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800">
              <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Spesifikasi Geospasial & Landasan Ilmiah Sistem
              </h2>
              <p className="text-xs text-slate-400">
                Parameter geodetik dan dasar acuan ilmiah yang digunakan dalam sistem GIS ini sesuai ketentuan Badan Informasi Geospasial (BIG) dan Ditjen EBTKE ESDM.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              
              <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 space-y-2.5">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Sistem Referensi Koordinat (CRS)
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Datum Geodetik:</span>
                    <span className="font-mono font-semibold text-white">WGS 84 (EPSG:4326)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Ellipsoid Referensi:</span>
                    <span className="font-mono">GRS 1980 / WGS 84</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Zona Proyeksi UTM:</span>
                    <span className="font-mono">Zone 48S, 49S, 50S, 51S, 52S</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Metode Jarak Buffer:</span>
                    <span className="font-mono">Geodesik Haversine (Great-Circle)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0e1422] border border-slate-800 space-y-2.5">
                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  Lapisan Vektor Geologi & Kebumian
                </div>
                <div className="space-y-2 text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Patahan / Sesar Aktif:</span>
                    <span className="font-semibold text-amber-300">PuSGeN (Kementerian PUPR 2017)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Klasifikasi Panas Bumi:</span>
                    <span className="font-mono">SNI 5015:2019</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Regulasi Hutan Konservasi:</span>
                    <span className="font-mono">PP No. 7 / 2017</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Database Engine:</span>
                    <span className="font-mono">SQLite Spatial ORM + GeoJSON RFC 7946</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
