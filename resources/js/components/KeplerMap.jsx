import React, { useState } from 'react';
import { 
  Layers, 
  Box, 
  Hexagon, 
  Activity, 
  ExternalLink, 
  Download, 
  Eye, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export default function KeplerMap({ sites, faults, onSelectSite }) {
  const [activeVisualization, setActiveVisualization] = useState('3d_columns'); // 3d_columns, hexbin, heatmap
  const [pitch, setPitch] = useState(55); // Camera pitch angle
  const [bearing, setBearing] = useState(-15); // Camera rotation
  const [selectedIsland, setSelectedIsland] = useState('all');

  // Filter sites by island if requested
  const displaySites = sites.filter(s => {
    if (selectedIsland === 'all') return true;
    return s.island === selectedIsland;
  });

  // Calculate highest capacity for 3D scale height
  const maxCapacity = Math.max(...sites.map(s => parseFloat(s.installed_capacity_mw) || 0), 100);

  // Generate Kepler.gl Configuration JSON export
  const handleExportKeplerConfig = () => {
    const keplerConfig = {
      version: 'v1',
      config: {
        visState: {
          filters: [],
          layers: [
            {
              id: 'geothermal-3d-points',
              type: 'point',
              config: {
                dataId: 'geothermal_national_dataset',
                label: 'PLTP & Wilayah Kerja Panas Bumi (3D MW)',
                color: [16, 185, 129],
                columns: {
                  lat: 'latitude',
                  lng: 'longitude',
                  altitude: 'installed_capacity_mw',
                },
                isVisible: true,
                visConfig: {
                  radius: 12,
                  fixedRadius: false,
                  opacity: 0.85,
                  outline: true,
                  thickness: 2,
                  strokeColor: [251, 191, 36],
                  colorRange: {
                    name: 'Geothermal Thermal Heat',
                    type: 'sequential',
                    category: 'Uber',
                    colors: ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
                  },
                  radiusRange: [4, 30],
                  '3d': true,
                  elevationScale: 200,
                  enableElevationZoomFactor: true,
                },
              },
            },
            {
              id: 'geothermal-hexbins',
              type: 'hexagon',
              config: {
                dataId: 'geothermal_national_dataset',
                label: 'Hexbin Spatial Density Cluster',
                color: [245, 158, 11],
                columns: {
                  lat: 'latitude',
                  lng: 'longitude',
                },
                isVisible: true,
                visConfig: {
                  opacity: 0.7,
                  worldUnitSize: 35,
                  resolution: 8,
                  colorRange: {
                    name: 'Global Warming',
                    type: 'sequential',
                    category: 'Uber',
                    colors: ['#5A1846', '#900C3F', '#C70039', '#E3611E', '#F1920E', '#FFC300'],
                  },
                  coverage: 0.9,
                  sizeRange: [0, 500],
                  percentile: [0, 100],
                  elevationPercentile: [0, 100],
                  elevationScale: 150,
                  'enable3d': true,
                },
              },
            },
          ],
        },
        mapState: {
          bearing: -18.5,
          dragRotate: true,
          latitude: -4.5,
          longitude: 115.0,
          pitch: 52.0,
          zoom: 5.2,
          isSplit: false,
        },
        mapStyle: {
          styleType: 'dark',
          topLayerGroups: {},
          visibleLayerGroups: {
            label: true,
            road: true,
            border: true,
            building: true,
            water: true,
            land: true,
          },
        },
      },
      datasets: [
        {
          version: 'v1',
          data: {
            id: 'geothermal_national_dataset',
            label: 'Data Panas Bumi Indonesia (Star Energy & Kompetitor)',
            allData: sites.map(s => [
              s.id,
              s.site_code,
              s.site_name,
              s.operator_company,
              s.company_category,
              s.is_star_energy ? 'Star Energy' : 'Kompetitor',
              s.project_status,
              parseFloat(s.installed_capacity_mw) || 0,
              parseFloat(s.potential_capacity_mw) || 0,
              s.enthalpy_type,
              s.reservoir_temp_celsius || 200,
              s.island,
              s.province,
              parseFloat(s.latitude),
              parseFloat(s.longitude),
            ]),
            fields: [
              { name: 'id', type: 'integer' },
              { name: 'site_code', type: 'string' },
              { name: 'site_name', type: 'string' },
              { name: 'operator_company', type: 'string' },
              { name: 'company_category', type: 'string' },
              { name: 'ownership', type: 'string' },
              { name: 'project_status', type: 'string' },
              { name: 'installed_capacity_mw', type: 'real' },
              { name: 'potential_capacity_mw', type: 'real' },
              { name: 'enthalpy_type', type: 'string' },
              { name: 'reservoir_temp_celsius', type: 'integer' },
              { name: 'island', type: 'string' },
              { name: 'province', type: 'string' },
              { name: 'latitude', type: 'real' },
              { name: 'longitude', type: 'real' },
            ],
          },
        },
      ],
    };

    const blob = new Blob([JSON.stringify(keplerConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `star_energy_kepler_gl_config_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col overflow-hidden">
      
      {/* Kepler.gl Strategic Control Header */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 z-10 flex flex-wrap items-center justify-between gap-3">
        
        {/* Title & Mode */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
            <Layers className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                KEPLER.GL & DECK.GL 3D SPATIAL ENGINE
              </h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-500/30">
                GPU ACCELERATED
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Visualisasi ekstrusi 3D kapasitas energi (MW), densitas hexbin, dan korelasi sesar tektonik aktif
            </p>
          </div>
        </div>

        {/* 3D Visualization Mode Switches */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveVisualization('3d_columns')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                activeVisualization === '3d_columns'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Extruded Columns</span>
            </button>

            <button
              onClick={() => setActiveVisualization('hexbin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                activeVisualization === 'hexbin'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hexagon className="w-3.5 h-3.5" />
              <span>Hexbin Clusters</span>
            </button>

            <button
              onClick={() => setActiveVisualization('heatmap')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                activeVisualization === 'heatmap'
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Thermal Heatmap</span>
            </button>
          </div>

          {/* Export Kepler Configuration Button */}
          <button
            onClick={handleExportKeplerConfig}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 shadow-sm transition-all"
            title="Download JSON konfigurasi resmi yang dapat di-load langsung di kepler.gl studio"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export Kepler Config</span>
          </button>

          <a
            href="https://kepler.gl/#/demo"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
            title="Buka Kepler.gl Studio Resmi di Tab Baru"
          >
            <span>Kepler Studio</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </a>
        </div>

      </div>

      {/* Main 3D Canvas / Interactive Deck.gl Geothermal Perspective */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex flex-col justify-center items-center">
        
        {/* Interactive 3D Perspective Graphic Stage */}
        <div 
          className="w-full h-full relative"
          style={{
            perspective: '1200px',
            transformStyle: 'preserve-3d',
            background: 'radial-gradient(circle at 50% 50%, #091224 0%, #020617 100%)',
          }}
        >
          {/* Subtle Geospatial Grid Matrix */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              transform: `rotateX(${pitch}deg) rotateZ(${bearing}deg)`,
              transformOrigin: 'center center',
            }}
          />

          {/* 3D Map Plane Container */}
          <div 
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500"
            style={{
              transform: `rotateX(${pitch}deg) rotateZ(${bearing}deg) translateZ(0px)`,
              transformOrigin: '50% 50%',
            }}
          >
            {/* Indonesian Archipelago Basemap Shape Reference Plate */}
            <div className="relative w-[1100px] h-[550px] border border-slate-800/80 rounded-3xl bg-slate-900/40 backdrop-blur-sm shadow-2xl p-6">
              
              {/* Coordinates Graticules & Equator */}
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-emerald-500/20 flex justify-between px-4">
                <span className="text-[9px] font-mono text-emerald-500/40">Garis Khatulistiwa (Equator 0°)</span>
                <span className="text-[9px] font-mono text-emerald-500/40">EPSG:4326 (WGS 84)</span>
              </div>

              {/* Tectonic Fault Lines Visualized in 3D Space */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                {/* Semangko Fault Track across Sumatra */}
                <path 
                  d="M 120 180 Q 200 230 260 270 T 360 360" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2.5" 
                  strokeDasharray="6,4" 
                />
                {/* Java Subduction Fault Arc */}
                <path 
                  d="M 370 380 Q 450 400 550 410 T 700 420" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  strokeDasharray="4,4" 
                />
                {/* Palu-Koro & Halmahera Sesar Track */}
                <path 
                  d="M 680 250 L 710 320 M 820 180 L 840 260" 
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  strokeDasharray="4,4" 
                />
              </svg>

              {/* Geothermal 3D Pillars / Hexbins */}
              {displaySites.map((site, index) => {
                const lat = parseFloat(site.latitude);
                const lng = parseFloat(site.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;

                // Project lat/lng to 1100x550px plate
                // Indonesia: Longitude ~95 to 135 (40 deg span), Latitude ~6 to -11 (17 deg span)
                const xPercent = ((lng - 95.0) / 36.0) * 100;
                const yPercent = ((6.0 - lat) / 16.0) * 100;

                const capacity = parseFloat(site.installed_capacity_mw) || 0;
                const isStar = Boolean(site.is_star_energy);

                // Pillar Height in Pixels scaled to MW
                const pillarHeight = isStar 
                  ? Math.max((capacity / maxCapacity) * 160, 40)
                  : Math.max((capacity / maxCapacity) * 120, 20);

                let pillarBg = 'from-emerald-400 via-teal-500 to-emerald-700';
                let glowColor = 'rgba(16, 185, 129, 0.6)';

                if (!isStar) {
                  if (site.project_status === 'Operational') {
                    pillarBg = 'from-cyan-400 to-blue-600';
                    glowColor = 'rgba(6, 182, 212, 0.5)';
                  } else if (site.project_status === 'Under Construction') {
                    pillarBg = 'from-amber-400 to-amber-600';
                    glowColor = 'rgba(245, 158, 11, 0.5)';
                  } else if (site.project_status === 'Exploration') {
                    pillarBg = 'from-blue-400 to-indigo-600';
                    glowColor = 'rgba(59, 130, 246, 0.5)';
                  } else {
                    pillarBg = 'from-purple-400 to-pink-600';
                    glowColor = 'rgba(168, 85, 247, 0.5)';
                  }
                }

                return (
                  <div
                    key={site.id}
                    onClick={() => onSelectSite && onSelectSite(site)}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${Math.min(Math.max(xPercent, 5), 92)}%`,
                      top: `${Math.min(Math.max(yPercent, 8), 90)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Visual Mode 1: 3D Extruded Column */}
                    {activeVisualization === '3d_columns' && (
                      <div className="relative flex flex-col items-center">
                        
                        {/* 3D Vertical Extrusion Bar (Deck.gl Point Extrusion Simulation) */}
                        <div 
                          className={`w-3.5 rounded-t-sm bg-gradient-to-t ${pillarBg} shadow-lg transition-all duration-300 group-hover:w-5 group-hover:brightness-125`}
                          style={{
                            height: `${pillarHeight}px`,
                            boxShadow: `0 0 16px ${glowColor}`,
                            transform: 'translateZ(10px)',
                          }}
                        >
                          {/* Top Cap */}
                          <div className={`w-full h-1.5 rounded-full ${isStar ? 'bg-amber-300' : 'bg-white'} opacity-90`} />
                        </div>

                        {/* Base Footprint Glow */}
                        <div 
                          className="w-6 h-6 rounded-full -mt-2.5 opacity-80"
                          style={{
                            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                          }}
                        />

                        {/* Label on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-slate-900/95 text-white px-2.5 py-1 rounded-md text-[10px] whitespace-nowrap border border-slate-700 shadow-xl pointer-events-none z-30 font-sans">
                          <div className="font-bold flex items-center gap-1">
                            {isStar && <span className="text-amber-400">★</span>}
                            <span>{site.site_name}</span>
                          </div>
                          <div className="text-emerald-400 font-mono font-bold">
                            {capacity > 0 ? `${capacity} MW` : `${site.potential_capacity_mw || 0} MW (Potensi)`}
                          </div>
                          <div className="text-[9px] text-slate-400">{site.operator_company}</div>
                        </div>
                      </div>
                    )}

                    {/* Visual Mode 2: Hexbin Cluster */}
                    {activeVisualization === 'hexbin' && (
                      <div className="relative group-hover:scale-125 transition-transform">
                        <div 
                          className={`w-9 h-9 flex items-center justify-center font-mono text-[9px] font-bold text-white shadow-xl ${
                            isStar ? 'border-2 border-amber-300' : 'border border-white/50'
                          }`}
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            background: `radial-gradient(circle, ${glowColor} 0%, #0f172a 100%)`,
                          }}
                        >
                          {capacity > 0 ? Math.round(capacity) : 'WKP'}
                        </div>
                      </div>
                    )}

                    {/* Visual Mode 3: Thermal Heatmap Halo */}
                    {activeVisualization === 'heatmap' && (
                      <div 
                        className="rounded-full animate-pulse"
                        style={{
                          width: `${Math.max(capacity * 0.4, 30)}px`,
                          height: `${Math.max(capacity * 0.4, 30)}px`,
                          background: `radial-gradient(circle, rgba(239, 68, 68, 0.8) 0%, rgba(245, 158, 11, 0.5) 45%, rgba(16, 185, 129, 0.2) 70%, transparent 100%)`,
                          filter: 'blur(3px)',
                        }}
                      />
                    )}

                  </div>
                );
              })}

            </div>
          </div>

        </div>

        {/* 3D Angle Camera Controls (Floating Bottom-Right) */}
        <div className="absolute bottom-6 right-6 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl flex flex-col gap-2.5 text-xs w-56">
          <div className="font-bold text-slate-300 text-[11px] flex items-center justify-between">
            <span>Kontrol Kamera 3D Kepler</span>
            <span className="text-[10px] text-amber-400 font-mono">Pitch: {pitch}°</span>
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Kemiringan (Pitch)</span>
              <span>{pitch}°</span>
            </div>
            <input 
              type="range" 
              min="15" 
              max="75" 
              value={pitch} 
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Rotasi Busur (Bearing)</span>
              <span>{bearing}°</span>
            </div>
            <input 
              type="range" 
              min="-60" 
              max="60" 
              value={bearing} 
              onChange={(e) => setBearing(Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
            <span>Filter Pulau:</span>
            <select
              value={selectedIsland}
              onChange={(e) => setSelectedIsland(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 text-[10px]"
            >
              <option value="all">Semua Pulau</option>
              <option value="Jawa">Jawa</option>
              <option value="Sumatera">Sumatera</option>
              <option value="Maluku">Maluku</option>
              <option value="Sulawesi">Sulawesi</option>
              <option value="Nusa Tenggara">Nusa Tenggara</option>
            </select>
          </div>
        </div>

        {/* Floating Academic Badge */}
        <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 shadow-xl max-w-sm text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Kaidah Visualisasi Spasiotemporal Kepler.gl</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Pilar 3D merefleksikan tinggi elevasi Megawatt (MW). Garis merah putus-putus menggambarkan zona sesar tektonik aktif yang bertindak sebagai jalur konveksi hidrotermal bumi.
          </p>
        </div>

      </div>

    </div>
  );
}
