import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  ArrowUpRight, 
  MapPin, 
  Activity, 
  Flame, 
  Zap, 
  Droplets, 
  Trees, 
  Leaf, 
  Lock, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  PieChart, 
  TrendingUp, 
  ChevronRight, 
  Info, 
  Sliders, 
  Eye, 
  Globe2, 
  Building2, 
  Sparkles,
  RefreshCw,
  Compass,
  Award,
  ShieldCheck,
  Calendar,
  Gauge
} from 'lucide-react';

export default function PublicLandingPage({ onOpenInternalPortal }) {
  // ========================================================
  // 1. DATA RESMI PEMBANGKIT STAR ENERGY GEOTHERMAL (BREN)
  // (Hanya aset milik Star Energy Geothermal di Jawa Barat)
  // ========================================================
  const starEnergyPlants = [
    {
      id: 'SEG-WW',
      name: 'PLTP Wayang Windu',
      code: 'WW-01/02',
      operator: 'Star Energy Geothermal (Wayang Windu) Ltd.',
      regency: 'Kabupaten Bandung',
      province: 'Jawa Barat',
      coordinates: [-7.2080, 107.6300],
      elevation: '1.650 mdpl',
      wkp: 'WKP Pangalengan',
      installedCapacity: 227.0,
      potentialCapacity: 420.0,
      systemType: 'Single-Cylinder Flash Steam Condensing',
      temperature: '265 °C',
      commercialYear: 2000,
      homesPowered: '454.000',
      co2SavedTons: '1.240.000',
      coalReplacedTons: '560.000',
      image: '/hd_gallery/wayang_windu_pipelines_hd.jpg',
      badge: 'Turbin Geotermal Terbesar Dunia',
      tagline: 'Harmoni Energi Bersih di Tengah Hamparan Kebun Teh',
      highlight: 'Mengoperasikan salah satu turbin single-cylinder uap panas bumi terbesar di dunia. Pipa uap berdiameter besar meliuk megah di tengah bentang kebun teh Pangalengan yang asri dan sejuk.',
      features: [
        'Kapasitas Unit 1 (110 MW) & Unit 2 (117 MW)',
        '100% air kondensat diinjeksi kembali ke reservoir bumi tanpa limbah',
        'Berdampingan erat dengan konservasi dan ekowisata Wayang Windu Panenjoan'
      ]
    },
    {
      id: 'SEG-SLK',
      name: 'PLTP Gunung Salak',
      code: 'SLK-01/06',
      operator: 'Star Energy Geothermal Salak, Ltd.',
      regency: 'Kabupaten Sukabumi & Bogor',
      province: 'Jawa Barat',
      coordinates: [-6.7404, 106.6432],
      elevation: '1.400 mdpl',
      wkp: 'WKP Gunung Salak',
      installedCapacity: 377.0,
      potentialCapacity: 415.0,
      systemType: 'High-Enthalpy Multi-Unit Flash Steam',
      temperature: '280 °C',
      commercialYear: 1994,
      homesPowered: '754.000',
      co2SavedTons: '2.100.000',
      coalReplacedTons: '940.000',
      image: '/hd_gallery/pltp_steam_pipeline_5k.jpg',
      badge: 'Pembangkit Terbesar Portofolio Star Energy',
      tagline: 'Jantung Pasokan Listrik Hijau Jawa Barat & Jabodetabek',
      highlight: 'Sentral energi bersih terbesar di Jawa Barat dengan 6 unit pembangkit aktif. Beroperasi harmonis di dalam kawasan konservasi Taman Nasional Gunung Halimun Salak dengan standar lingkungan kelas dunia.',
      features: [
        'Kapasitas raksasa 377 MW menopang sistem interkoneksi 150 kV Jamali',
        'Memelihara hutan hujan lindung sebagai catchment area resapan alami',
        'Equivalent Availability Factor (EAF) konsisten melampaui 99.1% per tahun'
      ]
    },
    {
      id: 'SEG-DRJ',
      name: 'PLTP Darajat',
      code: 'DRJ-01/03',
      operator: 'Star Energy Geothermal (Darajat) Ltd.',
      regency: 'Kabupaten Garut & Bandung',
      province: 'Jawa Barat',
      coordinates: [-7.2175, 107.7394],
      elevation: '1.920 mdpl',
      wkp: 'WKP Darajat',
      installedCapacity: 271.0,
      potentialCapacity: 330.0,
      systemType: 'Vapour-Dominated Dry Steam System',
      temperature: '245 °C',
      commercialYear: 1994,
      homesPowered: '542.000',
      co2SavedTons: '1.520.000',
      coalReplacedTons: '680.000',
      image: '/user_geothermal.png',
      badge: 'Sistem Dry Steam Langka Dunia',
      tagline: 'Efisiensi Uap Kering Tertinggi Tanpa Separasi Brine',
      highlight: 'Salah satu dari sedikit lapangan uap kering (dry steam field) alami di dunia. Menghasilkan uap murni bertekanan tinggi langsung dari perut bumi tanpa memerlukan pemisahan air garam berat.',
      features: [
        'Unit 1, 2, dan 3 beroperasi dengan efisiensi termal mendekati 99%',
        'Penerima Penghargaan Lingkungan PROPER Emas dari KLHK RI',
        'Penyangga utama stabilitas frekuensi jaringan tegangan ekstra tinggi Jamali'
      ]
    }
  ];

  // Selected Plant State
  const [selectedPlantId, setSelectedPlantId] = useState('SEG-WW');
  const selectedPlant = starEnergyPlants.find(p => p.id === selectedPlantId) || starEnergyPlants[0];

  // Leaflet Map Refs & States
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const bufferLayerRef = useRef(null);
  const [activeBasemap, setActiveBasemap] = useState('satellite'); // 'satellite' | 'streets' | 'topo'
  const [showBuffers, setShowBuffers] = useState(true);

  // Chart Interactive Tabs State
  const [activeChartTab, setActiveChartTab] = useState('national_share'); // 'national_share' | 'emissions' | 'roadmap'
  const [chartUnit, setChartUnit] = useState('mw'); // 'mw' | 'percent'

  // Interactive Science Cycle Simulator State
  const [activeCycleStep, setActiveCycleStep] = useState(0);

  // Interactive Public Green Calculator State
  const [monthlyKwh, setMonthlyKwh] = useState(450);

  // ========================================================
  // 2. DATA GRAFIK: BAURAN PANAS BUMI INDONESIA (ESDM 2024)
  // Total Kapasitas Panas Bumi Nasional Eksisting: 2.356 MW
  // ========================================================
  const nationalOperatorsData = [
    {
      operator: 'Star Energy Geothermal (BREN Group)',
      plants: 'Wayang Windu (227 MW), Salak (377 MW), Darajat (271 MW)',
      capacityMW: 882,
      sharePercent: 37.44,
      isStarEnergy: true,
      color: '#d8f537', // Electric Lime Accent
      textColor: '#121316',
      badge: 'Kontributor Terbesar RI'
    },
    {
      operator: 'PT Pertamina Geothermal Energy (PGE Tbk)',
      plants: 'Kamojang (235 MW), Ulubelu (220 MW), Lahendong (120 MW), Lumut Balai (55 MW), dll',
      capacityMW: 672,
      sharePercent: 28.52,
      isStarEnergy: false,
      color: '#3b82f6', // Corporate Slate Blue
      textColor: '#ffffff',
      badge: 'BUMN Panas Bumi'
    },
    {
      operator: 'Sarulla Operations & IPP Lainnya',
      plants: 'Sarulla (330 MW), Sorik Marapi (140 MW), Muara Laboh (85 MW), Rantau Dedap (91 MW)',
      capacityMW: 682,
      sharePercent: 28.95,
      isStarEnergy: false,
      color: '#64748b', // Slate Gray
      textColor: '#ffffff',
      badge: 'Konsorsium Swasta'
    },
    {
      operator: 'PT Geo Dipa Energi (Persero BUMN)',
      plants: 'Dieng Unit 1 (60 MW), Patuha Unit 1 (60 MW)',
      capacityMW: 120,
      sharePercent: 5.09,
      isStarEnergy: false,
      color: '#94a3b8', // Light Slate
      textColor: '#0f172a',
      badge: 'BUMN Khusus EBT'
    }
  ];

  // Data Komparasi Emisi CO2 (Gram CO2 per kWh)
  const emissionsComparisonData = [
    {
      source: 'PLTU Batu Bara (Sub-critical)',
      co2GramPerKwh: 1020,
      color: '#ef4444',
      ratioVsGeothermal: '26.8x Lebih Berpolusi',
      category: 'Fosil Beremisi Tinggi'
    },
    {
      source: 'PLTD Minyak Diesel',
      co2GramPerKwh: 780,
      color: '#f97316',
      ratioVsGeothermal: '20.5x Lebih Berpolusi',
      category: 'Bahan Bakar Cair'
    },
    {
      source: 'PLTG Gas Alam (Open Cycle)',
      co2GramPerKwh: 490,
      color: '#eab308',
      ratioVsGeothermal: '12.9x Lebih Berpolusi',
      category: 'Fosil Transisi'
    },
    {
      source: 'PLTS Tenaga Surya (Solar PV Lifecycle)',
      co2GramPerKwh: 45,
      color: '#38bdf8',
      ratioVsGeothermal: '1.2x Emisi Manufaktur',
      category: 'EBT Intermittent'
    },
    {
      source: 'PLTP Panas Bumi (Star Energy)',
      co2GramPerKwh: 38,
      color: '#d8f537', // Electric Lime Highlight
      ratioVsGeothermal: 'Paling Bersih (100% Sirkulasi Tertutup)',
      category: 'EBT Baseload 24/7'
    }
  ];

  // Data Peta Jalan (Roadmap) Panas Bumi ESDM Menuju Net Zero 2060
  const nationalRoadmapData = [
    { year: '2020', capacity: 2133, label: 'Realisasi Awal', note: 'Pondasi EBTKE' },
    { year: '2022', capacity: 2292, label: 'Ekspansi Unit', note: 'Komersialisasi Baru' },
    { year: '2024', capacity: 2356, label: 'Eksisting Saat Ini', note: 'Star Energy 882 MW (37.4%)' },
    { year: '2026', capacity: 2750, label: 'Target RUPTL', note: 'Salak & Wayang Windu Exp.' },
    { year: '2030', capacity: 3355, label: 'Target EBTKE ESDM', note: 'Pilar Dekarbonisasi RI' },
    { year: '2035', capacity: 4500, label: 'Akselerasi Transisi', note: 'Pengganti PLTU Pensiun' }
  ];

  // 4 Tahap Siklus Termodinamika
  const cycleSteps = [
    {
      step: 1,
      title: 'Panas Alami Perut Bumi',
      short: 'Reservoir Magma',
      temp: '260 - 300 °C',
      depth: '1.500 - 3.000 meter',
      desc: 'Air meteorik alami meresap masuk ke rekahan batuan bawah tanah. Pemanas alami dari dapur magma bumi memanaskan fluida hidrotermal hingga bersuhu dan bertekanan sangat tinggi di dalam reservoir batuan permeabel.',
      metricLabel: 'Tekanan Reservoir',
      metricVal: '80 - 120 Bar'
    },
    {
      step: 2,
      title: 'Pemisahan Uap Murni (Separator)',
      short: 'Pipa & Separator',
      temp: '180 - 220 °C',
      depth: 'Permukaan Tanah',
      desc: 'Fluida panas dialirkan ke permukaan melalui sumur produksi berkepala sumur (wellhead) baja khusus. Tabung separator gravitasi memisahkan uap murni bertekanan dari cairan brine. Uap kering berkecepatan tinggi dialirkan ke gedung turbin.',
      metricLabel: 'Debit Aliran Uap',
      metricVal: '950 Ton/Jam'
    },
    {
      step: 3,
      title: 'Pemutaran Turbin & Generator 150 kV',
      short: 'Turbin Listrik',
      temp: '160 °C (Ekspansi)',
      depth: 'Power House 150 kV',
      desc: 'Uap panas mendorong ribuan bilah sudu turbin magnet dengan kecepatan konstan 3.000 RPM. Rotor elektromagnet berputar memotong medan statis, membangkitkan listrik hijau tegangan tinggi untuk interkoneksi Jamali.',
      metricLabel: 'Daya Pembangkitan',
      metricVal: '882.0 MW Total'
    },
    {
      step: 4,
      title: '100% Injeksi Ulang Tertutup',
      short: 'Sirkulasi Tertutup',
      temp: '45 - 50 °C (Kondensat)',
      depth: 'Sumur Injeksi Bumi',
      desc: 'Uap yang telah memutar turbin didinginkan di menara kondensor (cooling tower). 100% air kondensat disuntikkan kembali ke dalam formasi bumi melalui sumur injeksi. Reservoir terjaga lestari dan tidak ada setetes pun air yang mencemari lingkungan.',
      metricLabel: 'Limbah Permukaan',
      metricVal: '0% (Zero Discharge)'
    }
  ];

  // Inisialisasi Peta Leaflet Khusus Pembangkit Star Energy
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Pusatkan di Jawa Barat (melingkupi Salak di Bogor/Sukabumi, Wayang Windu di Bandung, Darajat di Garut)
      const map = L.map(mapContainerRef.current, {
        center: [-7.02, 107.18],
        zoom: 9,
        minZoom: 6,
        maxZoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Basemap Layer
      const basemapUrl = activeBasemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : activeBasemap === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(basemapUrl, { maxZoom: 18 }).addTo(map);
      mapInstanceRef.current = map;
      mapInstanceRef.current._tileLayer = tileLayer;

      markersLayerRef.current = L.layerGroup().addTo(map);
      bufferLayerRef.current = L.layerGroup().addTo(map);
    } else {
      // Ganti basemap jika berubah
      if (mapInstanceRef.current._tileLayer) {
        mapInstanceRef.current.removeLayer(mapInstanceRef.current._tileLayer);
      }
      const basemapUrl = activeBasemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : activeBasemap === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(basemapUrl, { maxZoom: 18 }).addTo(mapInstanceRef.current);
      mapInstanceRef.current._tileLayer = tileLayer;
    }

    renderStarEnergyMarkers();
  }, [selectedPlantId, activeBasemap, showBuffers]);

  // Render Marker Khusus Star Energy dengan Desain Lime / Obsidian Modern
  const renderStarEnergyMarkers = () => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (bufferLayerRef.current) bufferLayerRef.current.clearLayers();

    starEnergyPlants.forEach((plant) => {
      const isSelected = plant.id === selectedPlantId;

      const iconHtml = `
        <div class="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'}">
          ${isSelected ? `
            <div class="absolute -inset-3 rounded-full bg-[#d8f537]/40 animate-ping"></div>
            <div class="absolute -inset-1.5 rounded-full bg-[#d8f537]/70"></div>
          ` : ''}
          <div class="relative w-10 h-10 rounded-full ${isSelected ? 'bg-[#d8f537] text-black ring-4 ring-black shadow-2xl' : 'bg-[#121316] text-[#d8f537] border-2 border-[#d8f537]/70 shadow-lg'} flex items-center justify-center font-extrabold text-xs">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/></svg>
          </div>
          <div class="mt-1 whitespace-nowrap bg-[#121316]/95 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20 shadow-md">
            ${plant.name} • <span class="text-[#d8f537]">${plant.installedCapacity} MW</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-star-marker',
        html: iconHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker(plant.coordinates, { icon: customIcon });

      marker.on('click', () => {
        handleSelectPlant(plant.id);
      });

      markersLayerRef.current.addLayer(marker);

      // Zona Penyangga Konservasi Lingkungan (AMDAL 5 km)
      if (showBuffers && bufferLayerRef.current) {
        const circle = L.circle(plant.coordinates, {
          radius: 5000,
          color: isSelected ? '#d8f537' : '#10b981',
          fillColor: isSelected ? '#d8f537' : '#10b981',
          fillOpacity: isSelected ? 0.22 : 0.08,
          weight: isSelected ? 2.5 : 1.5,
          dashArray: '5, 5'
        });
        bufferLayerRef.current.addLayer(circle);
      }
    });
  };

  const handleSelectPlant = (plantId) => {
    setSelectedPlantId(plantId);
    const plant = starEnergyPlants.find(p => p.id === plantId);
    if (plant && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(plant.coordinates, 13, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  };

  const handleZoomAll = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-7.02, 107.18], 9, { duration: 1.2 });
    }
  };

  // Kalkulasi Interaktif Penghematan Karbon Rumah Tangga
  const co2AvoidedKg = Math.round(monthlyKwh * 0.85);
  const coalSavedKg = Math.round(monthlyKwh * 0.42);
  const treesEquiv = Math.round(co2AvoidedKg / 22);

  return (
    <div className="min-h-screen w-full bg-[#f8f8f5] text-[#121316] font-sans antialiased selection:bg-[#d8f537] selection:text-black">
      
      {/* ======================================================== */}
      {/* 1. TOP FLOATING STICKY NAVBAR (SPACIAZ INSPIRED)         */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#f8f8f5]/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo_star_energy.png" 
              alt="Star Energy Geothermal" 
              className="h-9 w-auto object-contain" 
            />
            <div className="border-l border-slate-300 pl-3 hidden sm:block">
              <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500">
                Barito Renewables Group
              </div>
              <div className="text-sm font-extrabold tracking-tight text-[#121316] leading-none mt-0.5">
                Star Energy Geothermal
              </div>
            </div>
          </div>

          {/* Clean Editorial Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-700">
            <a href="#peta-pembangkit" className="hover:text-black transition-colors">Peta Aset Pembangkit</a>
            <a href="#grafik-nasional" className="hover:text-black transition-colors flex items-center gap-1.5">
              <span>Bauran & Grafik Nasional</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d8f537]"></span>
            </a>
            <a href="#siklus-sains" className="hover:text-black transition-colors">Siklus Panas Bumi</a>
            <a href="#kalkulator-hijau" className="hover:text-black transition-colors">Kalkulator Emisi</a>
          </nav>

          {/* Top Right Action: Internal GIS Portal Button (Lime Accent Pill) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenInternalPortal}
              className="group flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#d8f537] hover:bg-[#c9e62f] active:scale-95 text-[#121316] text-xs font-bold transition-all shadow-sm"
              title="Akses Portal Khusus Chief Admin & Analis GIS"
            >
              <Lock className="w-3.5 h-3.5 text-black" />
              <span>Portal GIS Internal</span>
              <div className="w-5 h-5 rounded-full bg-black text-[#d8f537] flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION: SPACIAZ EDITORIAL BENTO ASYMMETRY       */}
      {/* ======================================================== */}
      <section className="pt-6 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetrical Bento Grid: Left Architectural Photo + Right Editorial Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Kolom Kiri: Tall Architectural Frame Photo (5 Kolom) */}
          <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden min-h-[420px] lg:min-h-[580px] shadow-lg border border-slate-200/90 group bg-slate-950">
            <img 
              src="/hd_gallery/wayang_windu_pipelines_hd.jpg" 
              alt="Jaringan Pipa Uap Panas Bumi Wayang Windu" 
              className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 pointer-events-none" />

            {/* Top Badge on Photo */}
            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#121316] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Operasional 24/7 Base Load</span>
            </div>

            {/* Bottom Floating Info Pill */}
            <div className="absolute bottom-5 left-5 right-5 bg-[#121316]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d8f537] font-semibold">
                Fasilitas Unggulan Pangalengan
              </div>
              <div className="text-sm font-bold text-white mt-0.5">
                PLTP Wayang Windu 227 MW
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug line-clamp-2">
                Pipa uap berdiameter besar melintasi hamparan perkebunan teh tanpa mencemari udara sedikit pun.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Editorial Content Card (7 Kolom) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-8 sm:p-12 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            
            <div>
              {/* Micro Tag Header */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f0] border border-slate-200 text-xs font-semibold text-slate-700 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pelopor Transisi Energi Terbarukan Nusantara</span>
              </div>

              {/* Bold Editorial Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#121316] tracking-tight leading-[1.08]">
                Standar baru keunggulan energi panas bumi.
              </h1>

              {/* Sub-headline / Description */}
              <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                PT Star Energy Geothermal (Barito Renewables) mengoperasikan <strong className="text-black">882 MW</strong> kapasitas pembangkit uap bumi murni di Wayang Windu, Salak, dan Darajat — menyuplai listrik tanpa henti untuk lebih dari <strong className="text-black">1.8 juta keluarga Indonesia</strong>.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href="#peta-pembangkit"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#121316] hover:bg-black text-white text-xs font-bold transition-all shadow-md"
                >
                  <span>Jelajahi Peta Pembangkit Kami</span>
                  <div className="w-6 h-6 rounded-full bg-[#d8f537] text-black flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </a>

                <a
                  href="#grafik-nasional"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#f4f4f0] hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-slate-700" />
                  <span>Lihat Grafik Kapasitas Se-Indonesia</span>
                </a>
              </div>
            </div>

            {/* Bottom Key Metric Stat Badges (Spaciaz Character Accent) */}
            <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Stat 1: Electric Lime Badge */}
              <div className="bg-[#d8f537] rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    882 <span className="text-lg font-bold">MW</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">
                    Total Kapasitas Terpasang Aktif
                  </div>
                  <div className="text-[10px] text-slate-700 font-mono mt-0.5">
                    Wayang Windu • Salak • Darajat
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-slate-950">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Stat 2: Obsidian Badge */}
              <div className="bg-[#121316] text-white rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-[#d8f537] tracking-tight">
                    37.4%
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">
                    Pangsa Panas Bumi Terbesar RI
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Dari Total 2.356 MW Nasional
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#d8f537]">
                  <Award className="w-5 h-5" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* HORIZONTAL PILL STRIP WITH PHOTO AVATARS (SPACIAZ STYLE) */}
        {/* ======================================================== */}
        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d8f537] ring-2 ring-black"></span>
            <span>100% Zero-Carbon BaseLoad Listrik</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm shrink-0">
            <img src="/hd_gallery/wayang_windu_pipelines_hd.jpg" alt="WW" className="w-5 h-5 rounded-full object-cover" />
            <span>PLTP Wayang Windu (227 MW)</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm shrink-0">
            <img src="/hd_gallery/pltp_steam_pipeline_5k.jpg" alt="SLK" className="w-5 h-5 rounded-full object-cover" />
            <span>PLTP Gunung Salak (377 MW)</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm shrink-0">
            <img src="/user_geothermal.png" alt="DRJ" className="w-5 h-5 rounded-full object-cover" />
            <span>PLTP Darajat (271 MW)</span>
          </div>

          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-800 whitespace-nowrap shadow-sm shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>4.86 Juta Ton CO₂ Reduksi/Tahun</span>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 3. BENTO GRID: TIGA PILAR UNGGULAN (SPACIAZ SIGNATURE)   */}
      {/* ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Headline */}
        <div className="max-w-2xl mb-8">
          <div className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 mb-1">
            PORTFOLIO HIGHLIGHTS
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121316] tracking-tight">
            Fasilitas unggulan & peran strategis energi nasional.
          </h2>
        </div>

        {/* 3 Distinctive Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Obsidian Dark Bento Card */}
          <div className="bg-[#121316] text-white rounded-[28px] p-8 flex flex-col justify-between shadow-lg relative group">
            <div>
              <div className="text-[11px] font-mono text-[#d8f537] font-bold">01. / KEANDALAN SISTEM</div>
              <h3 className="text-xl font-bold mt-3 text-white">
                Base-load 24 Jam Non-Stop Tanpa Tergantung Cuaca
              </h3>
              <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                Berbeda dari tenaga surya atau bayu yang terputus-putus (intermittent), uap bumi mengalir konstan dari magma bumi dengan tingkat ketersediaan pembangkit (EAF) konsisten 99.8%.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Availability: 99.8%</span>
              <div className="w-9 h-9 rounded-full bg-[#d8f537] text-black flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Electric Chartreuse Lime Bento Card */}
          <div className="bg-[#d8f537] text-slate-950 rounded-[28px] p-8 flex flex-col justify-between shadow-lg relative group">
            <div>
              <div className="text-[11px] font-mono text-black/80 font-bold">02. / DAMPAK IKLIM</div>
              <h3 className="text-xl font-bold mt-3 text-slate-950">
                Mencegah 4.8 Juta Ton Emisi CO₂ Setiap Tahun
              </h3>
              <p className="mt-3 text-xs text-slate-800 leading-relaxed font-medium">
                Setara dengan mempensiunkan 1.000.000 mobil dari jalan raya dan menghemat 2.180.000 ton pembakaran batu bara. Seluruh fasilitas meraih sertifikasi PROPER Lingkungan KLHK.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-black/10 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-slate-800">SNI 5015:2019 Certified</span>
              <div className="w-9 h-9 rounded-full bg-black text-[#d8f537] flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Facility Photo Bento Card */}
          <div className="relative rounded-[28px] overflow-hidden shadow-lg min-h-[300px] flex flex-col justify-between p-8 group bg-slate-950">
            <img 
              src="/hd_gallery/pltp_steam_pipeline_5k.jpg" 
              alt="Fasilitas Uap" 
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 pointer-events-none" />

            <div className="relative z-10">
              <div className="text-[11px] font-mono text-[#d8f537] font-bold">03. / TEKNOLOGI DUNIA</div>
              <h3 className="text-xl font-bold mt-3 text-white">
                Sistem Dry Steam & Turbin Single-Cylinder Raksasa
              </h3>
              <p className="mt-3 text-xs text-slate-200 leading-relaxed">
                Lapangan Darajat merupakan salah satu formasi uap kering terlangka di dunia, sedangkan Wayang Windu memegang rekor turbin single-cylinder geotermal terbesar.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-300">Garut & Pangalengan</span>
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 4. GRAFIK KAPASITAS TOTAL SE-INDONESIA & DATA RELEVAN     */}
      {/* (PERMINTAAN USER: GRAFIK TOTAL COVER SE-INDONESIA DLL)   */}
      {/* ======================================================== */}
      <section id="grafik-nasional" className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section Grafik */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4f0] border border-slate-200 text-slate-800 text-xs font-bold mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Statistik & Bauran Panas Bumi Nasional (Data Resmi ESDM 2024)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121316] tracking-tight">
                Pangsa Pasar Pembangkit Panas Bumi Total Se-Indonesia
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
                Indonesia saat ini memiliki total kapasitas terpasang panas bumi <strong className="text-black">2.356 MW</strong> (terbesar ke-2 di dunia setelah AS). Jelajahi perbandingan kontribusi produsen, emisi karbon, dan peta jalan transisi energi.
              </p>
            </div>

            {/* Tab Navigators */}
            <div className="flex items-center gap-1.5 bg-[#f4f4f0] p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => setActiveChartTab('national_share')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeChartTab === 'national_share'
                    ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Bauran Produsen RI
              </button>
              <button
                onClick={() => setActiveChartTab('emissions')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeChartTab === 'emissions'
                    ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Komparasi Emisi CO₂
              </button>
              <button
                onClick={() => setActiveChartTab('roadmap')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeChartTab === 'roadmap'
                    ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                    : 'text-slate-600 hover:text-black'
                }`}
              >
                Roadmap EBTKE 2030
              </button>
            </div>
          </div>

          {/* TAB 1: BAURAN KAPASITAS PEMBANGKIT SE-INDONESIA */}
          {activeChartTab === 'national_share' && (
            <div className="bg-[#f8f8f5] rounded-[32px] p-6 sm:p-10 border border-slate-200">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Interaktif: SVG Donut Visualizer + Total Box (5 Kolom) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                  
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Total Kapasitas Nasional Terpasang
                  </div>
                  
                  {/* Circular Donut Graphic */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 my-3 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track */}
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#e2e8f0" strokeWidth="16" />
                      
                      {/* Segment 1: Star Energy (37.44% -> circumference = 2 * PI * 38 = 238.76 -> strokeDasharray = 89.4, 149.3) */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="38" 
                        fill="transparent" 
                        stroke="#d8f537" 
                        strokeWidth="18" 
                        strokeDasharray="89.4 238.8" 
                        strokeDashoffset="0"
                        className="transition-all duration-500"
                      />
                      
                      {/* Segment 2: Sarulla & IPP (28.95% -> 69.1) */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="38" 
                        fill="transparent" 
                        stroke="#64748b" 
                        strokeWidth="16" 
                        strokeDasharray="69.1 238.8" 
                        strokeDashoffset="-89.4"
                      />

                      {/* Segment 3: PGE (28.52% -> 68.1) */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="38" 
                        fill="transparent" 
                        stroke="#3b82f6" 
                        strokeWidth="16" 
                        strokeDasharray="68.1 238.8" 
                        strokeDashoffset="-158.5"
                      />

                      {/* Segment 4: Geo Dipa (5.09% -> 12.1) */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="38" 
                        fill="transparent" 
                        stroke="#94a3b8" 
                        strokeWidth="16" 
                        strokeDasharray="12.1 238.8" 
                        strokeDashoffset="-226.6"
                      />
                    </svg>

                    {/* Donut Center Data */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl sm:text-3xl font-black text-[#121316]">2.356</span>
                      <span className="text-[11px] font-bold text-slate-500">Megawatt (MW)</span>
                      <span className="text-[9px] font-mono text-[#121316] bg-[#d8f537] px-2 py-0.5 rounded-full mt-1 font-bold">
                        RI #2 Terbesar Dunia
                      </span>
                    </div>
                  </div>

                  {/* Micro Legend */}
                  <div className="grid grid-cols-2 gap-2 text-left w-full mt-4 text-[11px] font-medium border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#d8f537] border border-black/20 shrink-0"></span>
                      <span className="truncate">Star Energy (37.4%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#3b82f6] shrink-0"></span>
                      <span className="truncate">Pertamina PGE (28.5%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#64748b] shrink-0"></span>
                      <span className="truncate">Sarulla/IPP (29.0%)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-md bg-[#94a3b8] shrink-0"></span>
                      <span className="truncate">Geo Dipa (5.1%)</span>
                    </div>
                  </div>

                </div>

                {/* Kolom Breakdown Produsen & Bar Progresif (7 Kolom) */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Peringkat Kontribusi Produsen Panas Bumi
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChartUnit('mw')}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-mono font-bold ${chartUnit === 'mw' ? 'bg-[#121316] text-[#d8f537]' : 'bg-slate-200 text-slate-700'}`}
                      >
                        Kapasitas (MW)
                      </button>
                      <button
                        onClick={() => setChartUnit('percent')}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-mono font-bold ${chartUnit === 'percent' ? 'bg-[#121316] text-[#d8f537]' : 'bg-slate-200 text-slate-700'}`}
                      >
                        Pangsa (%)
                      </button>
                    </div>
                  </div>

                  {nationalOperatorsData.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-2xl border transition-all ${
                        item.isStarEnergy 
                          ? 'bg-[#121316] text-white border-black shadow-md ring-2 ring-[#d8f537]/50' 
                          : 'bg-white text-slate-900 border-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            item.isStarEnergy ? 'bg-[#d8f537] text-black' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-extrabold text-xs sm:text-sm truncate">
                            {item.operator}
                          </span>
                          {item.badge && (
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              item.isStarEnergy ? 'bg-[#d8f537] text-black' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`font-mono text-sm sm:text-base font-extrabold ${item.isStarEnergy ? 'text-[#d8f537]' : 'text-slate-900'}`}>
                            {chartUnit === 'mw' ? `${item.capacityMW} MW` : `${item.sharePercent}%`}
                          </span>
                        </div>
                      </div>

                      {/* Bar Visualization */}
                      <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden my-2">
                        <div 
                          className="h-full rounded-full transition-all duration-700" 
                          style={{ 
                            width: `${item.sharePercent}%`, 
                            backgroundColor: item.color 
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span className="truncate max-w-[80%]">{item.plants}</span>
                        <span className="font-mono">{item.capacityMW} MW ({item.sharePercent}%)</span>
                      </div>
                    </div>
                  ))}

                  {/* Fact Footnote */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-xs text-amber-900 mt-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Catatan ESDM:</strong> Star Energy Geothermal adalah produsen listrik panas bumi swasta (IPP) terbesar di Asia Tenggara dan memegang pangsa pasar operasional nomor satu di Republik Indonesia.
                    </span>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: KOMPARASI EMISI CO2 (PANAS BUMI VS BATU BARA DLL) */}
          {activeChartTab === 'emissions' && (
            <div className="bg-[#f8f8f5] rounded-[32px] p-6 sm:p-10 border border-slate-200">
              <div className="max-w-2xl mb-6">
                <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold tracking-wider">
                  Lifecycle Emission Intensity (IPCC & ESDM)
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#121316] mt-1">
                  Berapa Gram Emisi CO₂ per 1 Kilowatt-hour Listrik?
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Panas bumi menghasilkan energi listrik tanpa proses pembakaran hidrokarbon. Uap dialirkan dalam siklus tertutup sehingga emisinya 96% lebih rendah daripada PLTU batu bara.
                </p>
              </div>

              <div className="space-y-4">
                {emissionsComparisonData.map((em, eIdx) => {
                  const isGeo = em.source.includes('Star Energy');
                  const barWidth = Math.max(4, Math.round((em.co2GramPerKwh / 1020) * 100));

                  return (
                    <div 
                      key={eIdx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isGeo 
                          ? 'bg-[#121316] text-white border-black shadow-lg ring-2 ring-[#d8f537]' 
                          : 'bg-white text-slate-900 border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${isGeo ? 'bg-[#d8f537]' : ''}`} style={{ backgroundColor: isGeo ? undefined : em.color }} />
                          <span className="font-extrabold text-xs sm:text-sm">{em.source}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold ${isGeo ? 'bg-[#d8f537] text-black' : 'bg-slate-100 text-slate-600'}`}>
                            {em.category}
                          </span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className={`font-mono text-base sm:text-lg font-black ${isGeo ? 'text-[#d8f537]' : 'text-slate-950'}`}>
                            {em.co2GramPerKwh} <span className="text-xs font-normal">g CO₂/kWh</span>
                          </span>
                        </div>
                      </div>

                      {/* Bar Grafik */}
                      <div className="w-full bg-slate-200 rounded-full h-3.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2 text-[9px] font-bold"
                          style={{ 
                            width: `${barWidth}%`, 
                            backgroundColor: em.color,
                            color: isGeo ? '#000000' : '#ffffff'
                          }}
                        >
                          {barWidth > 15 && `${em.co2GramPerKwh}g`}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] mt-2">
                        <span className={isGeo ? 'text-[#d8f537] font-semibold' : 'text-slate-500'}>
                          {em.ratioVsGeothermal}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {isGeo ? 'Tercapai di PLTP Star Energy' : 'Standar Rata-rata Indonesia'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Callout Ringkasan Lingkungan */}
              <div className="mt-6 bg-[#d8f537]/20 border border-[#d8f537] p-4 rounded-2xl flex items-center justify-between flex-wrap gap-4 text-xs text-slate-900">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d8f537] flex items-center justify-center text-black font-black text-lg">
                    96%
                  </div>
                  <div>
                    <div className="font-extrabold">Reduksi Emisi Bersih Dibandingkan Batu Bara</div>
                    <div className="text-slate-600 text-[11px]">Mencegah 4.860.000 ton CO₂ masuk ke atmosfer Nusantara setiap tahun.</div>
                  </div>
                </div>
                <a href="#kalkulator-hijau" className="px-4 py-2 rounded-xl bg-black text-[#d8f537] font-bold text-xs hover:bg-slate-900 transition-colors">
                  Hitung untuk Rumah Anda →
                </a>
              </div>

            </div>
          )}

          {/* TAB 3: PETA JALAN KAPASITAS NASIONAL (ROADMAP EBTKE 2030) */}
          {activeChartTab === 'roadmap' && (
            <div className="bg-[#f8f8f5] rounded-[32px] p-6 sm:p-10 border border-slate-200">
              <div className="max-w-2xl mb-8">
                <span className="text-[10px] font-mono text-blue-700 uppercase font-bold tracking-wider">
                  Target Net Zero Emission (NZE 2060)
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#121316] mt-1">
                  Peta Jalan Kapasitas Panas Bumi Nasional (2020 - 2035)
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Pemerintah Indonesia menargetkan kapasitas panas bumi mencapai 3.355 MW pada 2030. Star Energy terus memimpin ekspansi unit baru di Wayang Windu dan Salak.
                </p>
              </div>

              {/* Milestone Timeline / Stepped Visual */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {nationalRoadmapData.map((step, idx) => {
                  const isCurrent = step.year === '2024';
                  return (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        isCurrent 
                          ? 'bg-[#121316] text-white border-black shadow-md ring-2 ring-[#d8f537]' 
                          : 'bg-white text-slate-900 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-base font-black ${isCurrent ? 'text-[#d8f537]' : 'text-slate-900'}`}>
                            {step.year}
                          </span>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-[#d8f537] animate-ping" />
                          )}
                        </div>
                        <div className={`text-xl sm:text-2xl font-black ${isCurrent ? 'text-white' : 'text-slate-950'}`}>
                          {step.capacity} <span className="text-xs font-normal text-slate-400">MW</span>
                        </div>
                        <div className={`text-xs font-bold mt-1 ${isCurrent ? 'text-slate-200' : 'text-slate-700'}`}>
                          {step.label}
                        </div>
                      </div>

                      <div className="mt-4 pt-2 border-t border-slate-200/50 text-[10px] text-slate-400 font-mono">
                        {step.note}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rencana Ekspansi Star Energy */}
              <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d8f537] text-black flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#121316]">
                      Komitmen Ekspansi Portofolio Star Energy Geothermal
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Proyek penambahan kapasitas Unit 3 Wayang Windu (+23 MW) dan Unit 7 Salak (+30 MW) sedang berjalan untuk mempercepat target 1.000+ MW portofolio bersih.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenInternalPortal}
                  className="px-4 py-2 rounded-xl bg-[#121316] text-[#d8f537] text-xs font-bold whitespace-nowrap hover:bg-black transition-colors"
                >
                  Lihat Masterplan WKP ↗
                </button>
              </div>

            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. PETA INTERAKTIF RESMI KHUSUS PEMBANGKIT STAR ENERGY   */}
      {/* (STRICTLY RESTRICTED TO WAYANG WINDU, SALAK, DARAJAT)    */}
      {/* ======================================================== */}
      <section id="peta-pembangkit" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section Peta */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4f0] border border-slate-200 text-slate-800 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Eksplorasi Spasial Publik Interaktif</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#121316] tracking-tight">
              Peta Satelit Interaktif 3 Pembangkit Star Energy
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Pilih salah satu pembangkit listrik di bawah untuk menjelajahi citra satelit resolusi tinggi, fasilitas sumur, jaringan transmisi uap, dan zona perlindungan lingkungan AMDAL.
            </p>
          </div>

          {/* Plant Selector Chips (Interaktif 1-Klik) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {starEnergyPlants.map((plant) => {
              const isSelected = plant.id === selectedPlantId;
              return (
                <button
                  key={plant.id}
                  onClick={() => handleSelectPlant(plant.id)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#121316] text-[#d8f537] border-black shadow-md ring-2 ring-[#d8f537]'
                      : 'bg-white text-slate-800 border-slate-300 hover:bg-[#f4f4f0] hover:text-black'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#d8f537]' : 'text-slate-500'}`} />
                  <span>{plant.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${isSelected ? 'bg-[#d8f537] text-black' : 'bg-slate-100 text-slate-600'}`}>
                    {plant.installedCapacity} MW
                  </span>
                </button>
              );
            })}

            <button
              onClick={handleZoomAll}
              className="px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[#f4f4f0] hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors shrink-0"
              title="Lihat Seluruh Jawa Barat"
            >
              Zoom Jawa Barat
            </button>
          </div>
        </div>

        {/* Layout 2 Kolom: Peta Leaflet (Kiri) & Cockpit Dossier Pembangkit (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-[32px] border border-slate-200/90 p-4 sm:p-6 shadow-sm">
          
          {/* Kolom Peta Interaktif (7 Kolom di Desktop) */}
          <div className="lg:col-span-7 flex flex-col h-[480px] sm:h-[580px] relative rounded-[24px] overflow-hidden border border-slate-300">
            
            {/* Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Floating Map Controls di Atas Peta */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#121316]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs text-white shadow-lg">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Basemap:</span>
              <button
                onClick={() => setActiveBasemap('satellite')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${activeBasemap === 'satellite' ? 'bg-[#d8f537] text-black' : 'text-slate-300 hover:text-white'}`}
              >
                Satelit Esri
              </button>
              <button
                onClick={() => setActiveBasemap('topo')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${activeBasemap === 'topo' ? 'bg-[#d8f537] text-black' : 'text-slate-300 hover:text-white'}`}
              >
                Topografi
              </button>
              <button
                onClick={() => setActiveBasemap('streets')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${activeBasemap === 'streets' ? 'bg-[#d8f537] text-black' : 'text-slate-300 hover:text-white'}`}
              >
                Jalan
              </button>

              <div className="h-3 w-px bg-white/20 mx-1"></div>

              {/* Buffer AMDAL Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px]">
                <input
                  type="checkbox"
                  checked={showBuffers}
                  onChange={(e) => setShowBuffers(e.target.checked)}
                  className="rounded border-slate-700 text-[#d8f537] w-3 h-3 accent-[#d8f537]"
                />
                <span className="text-slate-200 font-medium">Buffer Konservasi 5 km</span>
              </label>
            </div>

            {/* Floating Info Bottom Bar */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between bg-[#121316]/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-white text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d8f537] animate-pulse shrink-0"></span>
                <span className="font-extrabold truncate">{selectedPlant.name}</span>
                <span className="text-slate-400 text-[11px] truncate hidden sm:inline">• {selectedPlant.wkp}</span>
              </div>
              <span className="font-mono text-[#d8f537] text-[11px] font-semibold shrink-0">
                {selectedPlant.coordinates[0].toFixed(4)}° S, {selectedPlant.coordinates[1].toFixed(4)}° E
              </span>
            </div>

          </div>

          {/* Kolom Informasi & Foto Aset Terpilih (5 Kolom di Desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            
            <div>
              {/* Foto Aset Terpilih (HD) */}
              <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-950 mb-4 group">
                <img 
                  src={selectedPlant.image} 
                  alt={selectedPlant.name} 
                  className="w-full h-full object-cover object-center filter brightness-[1.01] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#121316]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-[10px] font-bold text-[#d8f537]">
                  {selectedPlant.badge}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#d8f537] px-3 py-1 rounded-full text-xs font-mono font-black text-black shadow-md">
                  {selectedPlant.installedCapacity} MW
                </div>
              </div>

              {/* Identitas Pembangkit */}
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                  {selectedPlant.operator}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] mt-0.5">
                  {selectedPlant.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {selectedPlant.highlight}
                </p>
              </div>

              {/* 3 Grid Metrik Utama */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Kapasitas</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#121316] mt-0.5">
                    {selectedPlant.installedCapacity} <span className="text-[10px] font-normal text-slate-600">MW</span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{selectedPlant.elevation}</div>
                </div>

                <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Melistriki</div>
                  <div className="text-sm sm:text-base font-extrabold text-[#121316] mt-0.5">
                    {selectedPlant.homesPowered}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Rumah Tangga</div>
                </div>

                <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Reduksi CO₂</div>
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5">
                    {selectedPlant.co2SavedTons}
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">Ton / Tahun</div>
                </div>
              </div>

              {/* Poin Keunggulan Lapangan */}
              <div className="mt-4 space-y-1.5">
                {selectedPlant.features.map((feat, fIdx) => (
                  <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer Card */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Teknologi: <strong>{selectedPlant.systemType.split(' ')[0]}</strong> ({selectedPlant.temperature})
              </span>
              <button
                onClick={onOpenInternalPortal}
                className="text-black font-extrabold flex items-center gap-1 hover:text-blue-700 transition-colors"
              >
                <span>Buka Analisis SIG Khusus</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* 6. BIG DARK IMPACT STATS (SPACIAZ LOWER SECTION ADAPTED) */}
      {/* ======================================================== */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121316] text-white rounded-[32px] p-8 sm:p-14 shadow-xl border border-slate-800 relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl mb-10">
            <span className="text-[10px] font-mono text-[#d8f537] uppercase tracking-widest font-bold">
              KONTRIBUSI NYATA DEKARBONISASI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1.5 tracking-tight">
              Mengubah panas alami bumi menjadi ketahanan listrik Indonesia.
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6 border-t border-slate-800">
            
            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#d8f537] tracking-tight">
                882+
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">
                Megawatt (MW) Terpasang
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Kapasitas kumulatif di 3 WKP Jawa Barat.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                4.8M+
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">
                Ton CO₂ Dicegah / Thn
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Penurunan emisi karbon terverifikasi KLHK.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-[#d8f537] tracking-tight">
                1.8M+
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">
                Rumah Tangga Terlayani
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Listrik hijau menyuplai sistem Jamali.
              </p>
            </div>

            <div>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                99.8%
              </div>
              <div className="text-xs sm:text-sm font-bold text-white mt-1">
                Faktor Ketersediaan (EAF)
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Stabilitas energi base-load 24/7/365.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SIMULATOR INTERAKTIF: SIKLUS SAINS PANAS BUMI         */}
      {/* ======================================================== */}
      <section id="siklus-sains" className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-widest bg-[#f4f4f0] px-3.5 py-1.5 rounded-full border border-slate-200">
              Simulasi Termodinamika Edukasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#121316] tracking-tight mt-3">
              Bagaimana Panas Bumi Bekerja Tanpa Polusi?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Klik setiap tahapan di bawah ini untuk melihat bagaimana uap murni dari perut bumi menggerakkan turbin listrik dalam sirkulasi tertutup 100% ramah lingkungan.
            </p>
          </div>

          {/* Step Selector Buttons (4 Tahap Interaktif) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {cycleSteps.map((stepItem, sIdx) => {
              const isActive = activeCycleStep === sIdx;
              return (
                <button
                  key={stepItem.step}
                  onClick={() => setActiveCycleStep(sIdx)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#121316] text-white border-black shadow-md ring-2 ring-[#d8f537]'
                      : 'bg-[#f8f8f5] hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                      isActive ? 'bg-[#d8f537] text-black' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {stepItem.step}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold ${isActive ? 'text-[#d8f537]' : 'text-slate-500'}`}>
                      {stepItem.temp}
                    </span>
                  </div>
                  <div className="font-extrabold text-xs sm:text-sm leading-snug">{stepItem.short}</div>
                </button>
              );
            })}
          </div>

          {/* Interactive Step Detail Card */}
          <div className="bg-[#121316] text-white rounded-[32px] p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-8">
                <div className="flex items-center gap-2 text-[#d8f537] font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Tahap {cycleSteps[activeCycleStep].step} dari 4</span>
                  <span>•</span>
                  <span>Kedalaman: {cycleSteps[activeCycleStep].depth}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {cycleSteps[activeCycleStep].title}
                </h3>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {cycleSteps[activeCycleStep].desc}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">Temperatur Operasi:</span>
                    <span className="text-[#d8f537] font-bold text-sm">{cycleSteps[activeCycleStep].temp}</span>
                  </div>

                  <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700">
                    <span className="text-slate-400 block text-[10px]">{cycleSteps[activeCycleStep].metricLabel}:</span>
                    <span className="text-white font-bold text-sm">{cycleSteps[activeCycleStep].metricVal}</span>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: Visual Icon Badge */}
              <div className="md:col-span-4 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[#d8f537]/20 border border-[#d8f537]/40 flex items-center justify-center text-[#d8f537] mb-3">
                  {activeCycleStep === 0 && <Flame className="w-8 h-8 text-amber-400" />}
                  {activeCycleStep === 1 && <Droplets className="w-8 h-8 text-blue-400" />}
                  {activeCycleStep === 2 && <Zap className="w-8 h-8 text-[#d8f537]" />}
                  {activeCycleStep === 3 && <RefreshCw className="w-8 h-8 text-emerald-400" />}
                </div>
                <div className="text-xs font-bold text-white">
                  Prinsip Sirkulasi Tertutup 100%
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  Zero Emission & Zero Discharge: Seluruh air kondensat dikembalikan kembali ke dalam reservoir bumi.
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700 w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>SNI 5015:2019</span>
                  <span className="text-emerald-400 font-bold">100% Bersih</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. KALKULATOR DAMPAK HIJAU INTERAKTIF                    */}
      {/* ======================================================== */}
      <section id="kalkulator-hijau" className="py-14 bg-[#f8f8f5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200/90 shadow-sm">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Simulasi Mandiri Publik
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#121316] mt-2">
                  Hitung Kontribusi Hijau Rumah Tangga Anda
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Geser perkiraan pemakaian listrik bulanan rumah Anda untuk melihat berapa banyak emisi karbon dan batu bara yang dihemat.
                </p>
              </div>

              <div className="bg-[#121316] text-white px-5 py-3 rounded-2xl border border-black text-center shrink-0">
                <span className="text-[10px] text-[#d8f537] block uppercase font-bold font-mono">Listrik Rumah Tangga</span>
                <span className="text-2xl font-black text-white">{monthlyKwh} <span className="text-xs font-normal text-slate-400">kWh/bln</span></span>
              </div>
            </div>

            {/* Slider Kontrol */}
            <div className="mb-8">
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#121316]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-mono">
                <span>100 kWh (R-1 450 VA)</span>
                <span>450 kWh (R-1 900-1300 VA)</span>
                <span>1.200 kWh (R-2)</span>
                <span>2.500 kWh (R-3)</span>
              </div>
            </div>

            {/* 3 Kartu Hasil Kalkulasi Interaktif */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-[#f8f8f5] p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold mb-1">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>Emisi CO₂ Dicegah</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  {co2AvoidedKg.toLocaleString()} <span className="text-xs font-normal text-slate-600">kg / bulan</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Setara dengan tidak mengemudikan mobil pribadi sejauh {(co2AvoidedKg * 5).toLocaleString()} km.
                </p>
              </div>

              <div className="bg-[#f8f8f5] p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-blue-800 text-xs font-bold mb-1">
                  <Flame className="w-4 h-4 text-blue-600" />
                  <span>Batu Bara Dihindari</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  {coalSavedKg.toLocaleString()} <span className="text-xs font-normal text-slate-600">kg / bulan</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Bahan bakar fosil yang tidak perlu ditambang dan dibakar ke atmosfer.
                </p>
              </div>

              <div className="bg-[#f8f8f5] p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-1">
                  <Trees className="w-4 h-4 text-amber-600" />
                  <span>Setara Menanam Pohon</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
                  {treesEquiv} <span className="text-xs font-normal text-slate-600">pohon / tahun</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Daya serap karbon setara dengan menanam puluhan pohon pelindung baru.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. FOOTER KORPORAT & AKSES PORTAL INTERNAL               */}
      {/* ======================================================== */}
      <footer className="bg-[#121316] text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img 
                src="/logo_star_energy.png" 
                alt="Star Energy" 
                className="h-9 w-auto object-contain brightness-0 invert" 
              />
              <div className="border-l border-slate-700 pl-3">
                <div className="text-[10px] font-mono font-bold text-[#d8f537] uppercase">Barito Renewables Group</div>
                <div className="text-sm font-extrabold text-white">PT Star Energy Geothermal</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="text-slate-400">Standar Nasional: SNI 5015:2019</span>
              <span className="text-slate-600">•</span>
              <button
                onClick={onOpenInternalPortal}
                className="px-4 py-2.5 rounded-full bg-[#d8f537] hover:bg-[#c9e62f] text-black font-extrabold transition-all flex items-center gap-2 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Masuk Portal GIS Internal</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© 2026 PT Star Energy Geothermal (Barito Renewables Group). Seluruh hak cipta dilindungi.</span>
            <span>Platform Edukasi Publik & Pemetaan Geospasial Panas Bumi</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
