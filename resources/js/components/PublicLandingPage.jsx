import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Gauge,
  Search,
  Filter,
  X,
  Phone,
  Mail,
  MapPinned,
  Send,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function PublicLandingPage({ sites: propSites = [], onOpenInternalPortal, onSelectSite }) {
  // ========================================================
  // 1. DATA MASTER ASET PANAS BUMI SELURUH INDONESIA
  // (Meliputi Star Energy Geothermal, PGE, IPP, & Prospek)
  // ========================================================
  const defaultSites = useMemo(() => [
    {
      id: 'SEG-WW',
      site_name: 'PLTP Wayang Windu',
      site_code: 'WW-01/02',
      operator_company: 'Star Energy Geothermal (Wayang Windu) Ltd.',
      company_category: 'Star Energy',
      is_star_energy: true,
      project_status: 'Operational',
      status_label: 'Beroperasi (227 MW)',
      regency: 'Kabupaten Bandung',
      province: 'Jawa Barat',
      island: 'Jawa',
      latitude: -7.2080,
      longitude: 107.6300,
      elevation_masl: 1650,
      wkp_name: 'WKP Pangalengan',
      installed_capacity_mw: 227.0,
      potential_capacity_mw: 420.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Single-Cylinder Flash Steam Condensing',
      reservoir_temp_celsius: 265,
      commercial_operation_year: 2000,
      grid_connection: 'Interkoneksi 150 kV Jamali (Jawa-Madura-Bali)',
      homesPowered: '454.000',
      co2SavedTons: '1.240.000',
      coalReplacedTons: '560.000',
      image: '/hd_gallery/wayang_windu_pipelines_hd.jpg',
      badge: 'Turbin Geotermal Terbesar Dunia',
      description: 'Mengoperasikan turbin uap single-cylinder terbesar di dunia di tengah hamparan perkebunan teh Pangalengan yang asri dan sejuk. 100% kondensat diinjeksi kembali ke reservoir bumi.',
      amdalStatus: 'Terverifikasi Ramah Lingkungan (AMDAL A)'
    },
    {
      id: 'SEG-SLK',
      site_name: 'PLTP Gunung Salak',
      site_code: 'SLK-01/06',
      operator_company: 'Star Energy Geothermal Salak, Ltd.',
      company_category: 'Star Energy',
      is_star_energy: true,
      project_status: 'Operational',
      status_label: 'Beroperasi (377 MW)',
      regency: 'Kabupaten Sukabumi & Bogor',
      province: 'Jawa Barat',
      island: 'Jawa',
      latitude: -6.7404,
      longitude: 106.6432,
      elevation_masl: 1400,
      wkp_name: 'WKP Gunung Salak',
      installed_capacity_mw: 377.0,
      potential_capacity_mw: 415.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'High-Enthalpy Multi-Unit Flash Steam',
      reservoir_temp_celsius: 280,
      commercial_operation_year: 1994,
      grid_connection: 'Interkoneksi 150 kV Jamali',
      homesPowered: '754.000',
      co2SavedTons: '2.100.000',
      coalReplacedTons: '940.000',
      image: '/hd_gallery/pltp_steam_pipeline_5k.jpg',
      badge: 'Pembangkit Terbesar Star Energy',
      description: 'Pusat pasokan listrik hijau terbesar di Jawa Barat dengan 6 unit turbin aktif. Beroperasi harmonis di kawasan Taman Nasional Gunung Halimun Salak.',
      amdalStatus: 'Sertifikasi Keanekaragaman Hayati TN Gunung Halimun Salak'
    },
    {
      id: 'SEG-DRJ',
      site_name: 'PLTP Darajat',
      site_code: 'DRJ-01/03',
      operator_company: 'Star Energy Geothermal (Darajat) Ltd.',
      company_category: 'Star Energy',
      is_star_energy: true,
      project_status: 'Operational',
      status_label: 'Beroperasi (271 MW)',
      regency: 'Kabupaten Garut & Bandung',
      province: 'Jawa Barat',
      island: 'Jawa',
      latitude: -7.2175,
      longitude: 107.7394,
      elevation_masl: 1920,
      wkp_name: 'WKP Darajat',
      installed_capacity_mw: 271.0,
      potential_capacity_mw: 330.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Vapour-Dominated Dry Steam System',
      reservoir_temp_celsius: 245,
      commercial_operation_year: 1994,
      grid_connection: 'Interkoneksi 150 kV Jamali',
      homesPowered: '542.000',
      co2SavedTons: '1.520.000',
      coalReplacedTons: '680.000',
      image: '/user_geothermal_sharp.jpg',
      badge: 'Dry Steam System Langka Dunia',
      description: 'Salah satu lapangan uap kering (dry steam) langka di dunia, menghasilkan uap murni bertekanan tinggi tanpa memerlukan pemisahan air asin brine berat.',
      amdalStatus: 'PROPER Emas KLHK RI & Zona Konservasi Hutan Garut'
    },
    {
      id: 'COMP-PGE-KMJ',
      site_name: 'PLTP Kamojang',
      site_code: 'PGE-KMJ',
      operator_company: 'PT Pertamina Geothermal Energy Tbk (PGE)',
      company_category: 'Pertamina Geothermal Energy (PGE)',
      is_star_energy: false,
      project_status: 'Operational',
      status_label: 'Beroperasi (235 MW)',
      regency: 'Kabupaten Bandung & Garut',
      province: 'Jawa Barat',
      island: 'Jawa',
      latitude: -7.1350,
      longitude: 107.7950,
      elevation_masl: 1500,
      wkp_name: 'WKP Kamojang - Darajat',
      installed_capacity_mw: 235.0,
      potential_capacity_mw: 300.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Dry Steam Geothermal Plant',
      reservoir_temp_celsius: 240,
      commercial_operation_year: 1982,
      grid_connection: 'Transmisi 150 kV Jawa-Bali',
      homesPowered: '470.000',
      co2SavedTons: '1.280.000',
      coalReplacedTons: '580.000',
      image: '/hd_gallery/pltp_indonesia_panoramic.jpg',
      badge: 'Pelopor Panas Bumi Pertama Indonesia',
      description: 'Tonggak sejarah pemanfaatan panas bumi nasional sejak tahun 1982. Lapangan uap kering legendaris dengan efisiensi konversi termal prima.',
      amdalStatus: 'AMDAL Terverifikasi & Penyangga Hutan Lindung'
    },
    {
      id: 'COMP-GDE-DNG',
      site_name: 'PLTP Dieng Unit 1',
      site_code: 'GDE-DNG-01',
      operator_company: 'PT Geo Dipa Energi (Persero)',
      company_category: 'Geo Dipa Energi',
      is_star_energy: false,
      project_status: 'Operational',
      status_label: 'Beroperasi (60 MW)',
      regency: 'Kabupaten Banjarnegara & Wonosobo',
      province: 'Jawa Tengah',
      island: 'Jawa',
      latitude: -7.2050,
      longitude: 109.9050,
      elevation_masl: 2050,
      wkp_name: 'WKP Dieng',
      installed_capacity_mw: 60.0,
      potential_capacity_mw: 400.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Flash Steam System',
      reservoir_temp_celsius: 280,
      commercial_operation_year: 2002,
      grid_connection: 'Transmisi 150 kV Jawa Tengah',
      homesPowered: '120.000',
      co2SavedTons: '330.000',
      coalReplacedTons: '150.000',
      image: '/hd_gallery/pltp_dieng_hd.jpg',
      badge: 'Pembangkit Tertinggi di Dataran Dieng',
      description: 'Berada di dataran tinggi Dieng pada elevasi 2.050 mdpl. Menghasilkan energi hijau dari reservoir vulkanik kompleks pegunungan Dieng.',
      amdalStatus: 'AMDAL Pengelolaan Wilayah Dataran Tinggi Dieng'
    },
    {
      id: 'COMP-SARULLA',
      site_name: 'PLTP Sarulla (Silangkitang & Namora-I-Langit)',
      site_code: 'SARULLA-01',
      operator_company: 'Sarulla Operations Ltd. (SOL)',
      company_category: 'Konsorsium Swasta / IPP',
      is_star_energy: false,
      project_status: 'Operational',
      status_label: 'Beroperasi (330 MW)',
      regency: 'Kabupaten Tapanuli Utara',
      province: 'Sumatera Utara',
      island: 'Sumatera',
      latitude: 1.8845,
      longitude: 99.0435,
      elevation_masl: 850,
      wkp_name: 'WKP Sarulla',
      installed_capacity_mw: 330.0,
      potential_capacity_mw: 330.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Combined Cycle Binary & Flash',
      reservoir_temp_celsius: 270,
      commercial_operation_year: 2017,
      grid_connection: 'Interkoneksi 150 kV Tol Listrik Sumatera',
      homesPowered: '660.000',
      co2SavedTons: '1.800.000',
      coalReplacedTons: '810.000',
      image: '/hd_gallery/pltp_karo_hd.jpg',
      badge: 'PLTP Binary Terbesar di Sumatera',
      description: 'Salah satu pembangkit panas bumi siklus kombinasi (flash & binary) tunggal terbesar di dunia, memperkuat ketahanan energi Pulau Sumatera.',
      amdalStatus: 'AMDAL Komprehensif Kawasan Batang Toru'
    },
    {
      id: 'COMP-PGE-ULB',
      site_name: 'PLTP Ulubelu (Unit 1 - 4)',
      site_code: 'PGE-ULB',
      operator_company: 'PT Pertamina Geothermal Energy Tbk (PGE)',
      company_category: 'Pertamina Geothermal Energy (PGE)',
      is_star_energy: false,
      project_status: 'Operational',
      status_label: 'Beroperasi (220 MW)',
      regency: 'Kabupaten Tanggamus',
      province: 'Lampung',
      island: 'Sumatera',
      latitude: -5.3120,
      longitude: 104.5750,
      elevation_masl: 750,
      wkp_name: 'WKP Ulubelu',
      installed_capacity_mw: 220.0,
      potential_capacity_mw: 280.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Double Flash Condensing',
      reservoir_temp_celsius: 250,
      commercial_operation_year: 2012,
      grid_connection: 'Sistem Interkoneksi Lampung - Sumatera Selatan',
      homesPowered: '440.000',
      co2SavedTons: '1.200.000',
      coalReplacedTons: '540.000',
      image: '/barito_wayang_windu.jpg',
      badge: 'Penyangga Utama Listrik Provinsi Lampung',
      description: 'Menyuplai lebih dari 25% kebutuhan listrik seluruh Provinsi Lampung secara bersih, andal, dan bebas dari emisi gas rumah kaca.',
      amdalStatus: 'AMDAL Kawasan Tanggamus & Perlindungan Daerah Aliran Sungai'
    },
    {
      id: 'COMP-PGE-LHD',
      site_name: 'PLTP Lahendong (Unit 1 - 6)',
      site_code: 'PGE-LHD',
      operator_company: 'PT Pertamina Geothermal Energy Tbk (PGE)',
      company_category: 'Pertamina Geothermal Energy (PGE)',
      is_star_energy: false,
      project_status: 'Operational',
      status_label: 'Beroperasi (120 MW)',
      regency: 'Kota Tomohon & Minahasa',
      province: 'Sulawesi Utara',
      island: 'Sulawesi',
      latitude: 1.2840,
      longitude: 124.8150,
      elevation_masl: 800,
      wkp_name: 'WKP Lahendong - Tompaso',
      installed_capacity_mw: 120.0,
      potential_capacity_mw: 150.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Single Flash Steam Condensing',
      reservoir_temp_celsius: 250,
      commercial_operation_year: 2001,
      grid_connection: 'Sistem Interkoneksi Sulutenggo 150 kV',
      homesPowered: '240.000',
      co2SavedTons: '650.000',
      coalReplacedTons: '290.000',
      image: '/user_geothermal.png',
      badge: 'Ikon Energi Hijau Sulawesi Utara',
      description: 'Pusat energi panas bumi terdepan di kawasan Indonesia Timur, mengalirkan daya listrik stabil ke Tomohon, Manado, dan sekitarnya.',
      amdalStatus: 'AMDAL Wilayah Danau Linow & Konservasi Tomohon'
    },
    {
      id: 'PROS-HAMIDING',
      site_name: 'Prospek Geotermal Gunung Hamiding',
      site_code: 'PROS-HMD-01',
      operator_company: 'PT Star Energy Geothermal (Penugasan PSPE)',
      company_category: 'Star Energy',
      is_star_energy: true,
      project_status: 'Exploration',
      status_label: 'Tahap Eksplorasi & Uji Sumur (50 MW)',
      regency: 'Kabupaten Halmahera Utara',
      province: 'Maluku Utara',
      island: 'Maluku',
      latitude: 1.4870,
      longitude: 127.8730,
      elevation_masl: 920,
      wkp_name: 'WKP Gunung Hamiding',
      installed_capacity_mw: 0.0,
      potential_capacity_mw: 50.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Rencana Flash Steam Unit',
      reservoir_temp_celsius: 235,
      commercial_operation_year: 2028,
      grid_connection: 'Rencana Sistem Halmahera EBTKE',
      homesPowered: '100.000',
      co2SavedTons: '270.000',
      coalReplacedTons: '120.000',
      image: '/hd_gallery/pltp_indonesia_panoramic.jpg',
      badge: 'Prospek Strategis Indonesia Timur',
      description: 'Eksplorasi panas bumi terdepan untuk menghadirkan listrik hijau ramah lingkungan bagi kawasan Halmahera Utara dan hilirisasi industri nikel.',
      amdalStatus: 'AMDAL Studi Lingkungan Pendahuluan (UKL-UPL)'
    },
    {
      id: 'COMP-MEDCO-IJN',
      site_name: 'PLTP Blawan Ijen',
      site_code: 'MEDCO-IJN-01',
      operator_company: 'PT Medco Cahaya Geothermal (MCG)',
      company_category: 'Konsorsium Swasta / IPP',
      is_star_energy: false,
      project_status: 'Under Construction',
      status_label: 'Konstruksi Unit 1 (34 MW)',
      regency: 'Kabupaten Bondowoso & Banyuwangi',
      province: 'Jawa Timur',
      island: 'Jawa',
      latitude: -8.0210,
      longitude: 114.1980,
      elevation_masl: 1850,
      wkp_name: 'WKP Ijen',
      installed_capacity_mw: 34.0,
      potential_capacity_mw: 110.0,
      enthalpy_type: 'High Enthalpy',
      systemType: 'Flash Steam Cycle',
      reservoir_temp_celsius: 260,
      commercial_operation_year: 2025,
      grid_connection: 'Interkoneksi 150 kV Jawa Timur',
      homesPowered: '68.000',
      co2SavedTons: '185.000',
      coalReplacedTons: '83.000',
      image: '/hd_gallery/pltp_dieng_hd.jpg',
      badge: 'Pembangkit Perdana Kaldera Ijen',
      description: 'Pembangkit listrik tenaga panas bumi pertama di ujung timur Pulau Jawa, memanfaatkan potensi kaldera gunung api Ijen.',
      amdalStatus: 'AMDAL Perlindungan Cagar Alam Ijen'
    }
  ], []);

  // Merge with prop sites if available
  const allSites = useMemo(() => {
    if (propSites && propSites.length > 0) {
      const merged = [...defaultSites];
      propSites.forEach(ps => {
        const idx = merged.findIndex(m => m.id === ps.site_code || m.id === ps.id || m.site_name === ps.site_name);
        if (idx >= 0) {
          merged[idx] = { ...merged[idx], ...ps };
        } else {
          merged.push({
            id: ps.site_code || `SITE-${ps.id}`,
            site_name: ps.site_name,
            site_code: ps.site_code || `GEO-${ps.id}`,
            operator_company: ps.operator_company,
            company_category: ps.company_category || 'Lainnya',
            is_star_energy: Boolean(ps.is_star_energy),
            project_status: ps.project_status || 'Operational',
            status_label: ps.status_label || `${ps.installed_capacity_mw || 0} MW`,
            regency: ps.regency || 'Kabupaten',
            province: ps.province || 'Indonesia',
            island: ps.island || 'Jawa',
            latitude: Number(ps.latitude) || -7.2,
            longitude: Number(ps.longitude) || 107.6,
            elevation_masl: ps.elevation_masl || 1500,
            wkp_name: ps.wkp_name || 'WKP Nasional',
            installed_capacity_mw: Number(ps.installed_capacity_mw) || 0,
            potential_capacity_mw: Number(ps.potential_capacity_mw) || 0,
            enthalpy_type: ps.enthalpy_type || 'High Enthalpy',
            systemType: 'Single/Double Flash Steam',
            reservoir_temp_celsius: ps.reservoir_temp_celsius || 250,
            commercial_operation_year: ps.commercial_operation_year || 2010,
            grid_connection: ps.grid_connection || 'Sistem Interkoneksi PLN',
            homesPowered: `${Math.round((ps.installed_capacity_mw || 50) * 2000).toLocaleString('id-ID')}`,
            co2SavedTons: `${Math.round((ps.installed_capacity_mw || 50) * 5500).toLocaleString('id-ID')}`,
            coalReplacedTons: `${Math.round((ps.installed_capacity_mw || 50) * 2400).toLocaleString('id-ID')}`,
            image: ps.is_star_energy ? '/hd_gallery/wayang_windu_pipelines_hd.jpg' : '/hd_gallery/pltp_indonesia_panoramic.jpg',
            badge: ps.is_star_energy ? 'Star Energy Portfolio' : 'Pembangkit Nasional',
            description: ps.description || 'Pembangkit Listrik Tenaga Panas Bumi ramah lingkungan.',
            amdalStatus: 'AMDAL Terverifikasi Standar Nasional'
          });
        }
      });
      return merged;
    }
    return defaultSites;
  }, [propSites, defaultSites]);

  // ========================================================
  // STATE MANAGEMENT
  // ========================================================
  // 3. Cari Lokasi State
  const [searchQuery, setSearchQuery] = useState('');
  
  // 4. Filter Provinsi & Status State
  const [selectedProvince, setSelectedProvince] = useState('Semua Provinsi');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [selectedOperatorCategory, setSelectedOperatorCategory] = useState('Semua');

  // 5. Detail Lokasi State
  const [selectedSiteDetail, setSelectedSiteDetail] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Map Instance & Layer Refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const bufferLayerRef = useRef(null);
  const provincesLayerRef = useRef(null);
  const [activeBasemap, setActiveBasemap] = useState('satellite'); // 'satellite' | 'streets' | 'topo'
  const [showBuffers, setShowBuffers] = useState(true);
  const [showProvinces, setShowProvinces] = useState(true);

  // 6. Statistik Nasional Tabs
  const [activeStatTab, setActiveStatTab] = useState('operator_share'); // 'operator_share' | 'province_distribution' | 'emissions' | 'calculator'
  const [monthlyKwh, setMonthlyKwh] = useState(450);

  // 7. Kontak Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    institution: '',
    category: 'Pertanyaan Umum Panas Bumi',
    subject: '',
    message: ''
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccessAlert, setContactSuccessAlert] = useState(false);

  // List of unique provinces extracted from sites
  const provinceList = useMemo(() => {
    const list = Array.from(new Set(allSites.map(s => s.province))).filter(Boolean).sort();
    return ['Semua Provinsi', ...list];
  }, [allSites]);

  // Filtered sites according to search, province, status, and operator
  const filteredSites = useMemo(() => {
    return allSites.filter(site => {
      // 1. Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = site.site_name.toLowerCase().includes(q);
        const matchWkp = (site.wkp_name || '').toLowerCase().includes(q);
        const matchRegency = (site.regency || '').toLowerCase().includes(q);
        const matchProvince = (site.province || '').toLowerCase().includes(q);
        const matchOperator = (site.operator_company || '').toLowerCase().includes(q);
        if (!matchName && !matchWkp && !matchRegency && !matchProvince && !matchOperator) {
          return false;
        }
      }

      // 2. Province Filter
      if (selectedProvince !== 'Semua Provinsi') {
        if (site.province !== selectedProvince) return false;
      }

      // 3. Status Filter
      if (selectedStatus === 'Operational') {
        if (site.project_status !== 'Operational') return false;
      } else if (selectedStatus === 'Exploration') {
        if (site.project_status === 'Operational') return false;
      }

      // 4. Operator Filter
      if (selectedOperatorCategory === 'Star Energy') {
        if (!site.is_star_energy) return false;
      } else if (selectedOperatorCategory === 'PGE') {
        if (!site.company_category.toLowerCase().includes('pertamina')) return false;
      } else if (selectedOperatorCategory === 'Lainnya') {
        if (site.is_star_energy || site.company_category.toLowerCase().includes('pertamina')) return false;
      }

      return true;
    });
  }, [allSites, searchQuery, selectedProvince, selectedStatus, selectedOperatorCategory]);

  // Province Coordinates for Smooth Map FlyTo
  const provinceCenterMap = {
    'Semua Provinsi': { coords: [-2.5, 118.0], zoom: 5 },
    'Jawa Barat': { coords: [-6.92, 107.60], zoom: 8 },
    'Jawa Tengah': { coords: [-7.30, 110.00], zoom: 8 },
    'Jawa Timur': { coords: [-7.80, 112.50], zoom: 8 },
    'Sumatera Utara': { coords: [2.10, 99.10], zoom: 7 },
    'Sumatera Barat': { coords: [-0.70, 100.50], zoom: 8 },
    'Sumatera Selatan': { coords: [-3.50, 104.00], zoom: 7 },
    'Lampung': { coords: [-5.00, 105.00], zoom: 8 },
    'Sulawesi Utara': { coords: [1.25, 124.80], zoom: 8 },
    'Maluku Utara': { coords: [1.10, 127.80], zoom: 7 },
    'Nusa Tenggara Timur': { coords: [-8.60, 121.00], zoom: 8 }
  };

  // Open Location Detail Modal
  const handleOpenSiteDetail = (site) => {
    setSelectedSiteDetail(site);
    setIsDetailModalOpen(true);
    if (onSelectSite) {
      onSelectSite(site);
    }
  };

  // Focus Map on a Specific Site
  const handleFocusSiteOnMap = (site) => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([site.latitude, site.longitude], 13, {
      duration: 1.5
    });

    // Scroll smoothly to map section
    const mapSection = document.getElementById('peta-interaktif');
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset Map View to Whole Indonesia
  const handleResetMapIndonesia = () => {
    if (!mapInstanceRef.current) return;
    setSelectedProvince('Semua Provinsi');
    setSearchQuery('');
    mapInstanceRef.current.flyTo([-2.5, 118.0], 5, { duration: 1.2 });
  };

  // ========================================================
  // LEAFLET MAP INITIALIZATION & PROVINCE GEOJSON
  // ========================================================
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-2.5, 118.0],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Basemap layer
      const basemapUrl = activeBasemap === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : activeBasemap === 'topo'
        ? 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(basemapUrl, { maxZoom: 18 }).addTo(map);
      mapInstanceRef.current = map;
      mapInstanceRef.current._tileLayer = tileLayer;

      // Layers groups
      provincesLayerRef.current = L.layerGroup().addTo(map);
      bufferLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);

      // Load Indonesian Province Boundaries
      fetch('/geojson/indonesia-provinces.json')
        .then(res => res.ok ? res.json() : null)
        .then(geoJsonData => {
          if (!geoJsonData || !provincesLayerRef.current) return;
          provincesLayerRef.current.clearLayers();

          const geoLayer = L.geoJSON(geoJsonData, {
            style: (feature) => {
              const provName = feature?.properties?.Propinsi || feature?.properties?.name || '';
              const isCurrentSelected = selectedProvince !== 'Semua Provinsi' && 
                provName.toLowerCase().includes(selectedProvince.toLowerCase().replace('provinsi', '').trim());

              return {
                color: isCurrentSelected ? '#d8f537' : '#94a3b8',
                weight: isCurrentSelected ? 2.5 : 1.2,
                opacity: isCurrentSelected ? 0.95 : 0.45,
                dashArray: isCurrentSelected ? '0' : '5, 5',
                fillColor: isCurrentSelected ? '#d8f537' : 'transparent',
                fillOpacity: isCurrentSelected ? 0.08 : 0.0
              };
            },
            onEachFeature: (feature, layer) => {
              const provName = feature?.properties?.Propinsi || feature?.properties?.name || 'Provinsi';
              layer.bindTooltip(
                `<div class="font-sans text-xs font-bold px-2 py-1 bg-slate-950 text-white rounded shadow-md border border-slate-700">${provName}</div>`,
                { permanent: false, direction: 'center', opacity: 0.9 }
              );
            }
          });

          provincesLayerRef.current.addLayer(geoLayer);
          mapInstanceRef.current._provincesGeoLayer = geoLayer;
        })
        .catch(err => console.warn('GeoJSON provinces note:', err));

    } else {
      // Update Basemap if changed
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
  }, [activeBasemap]);

  // Update Province GeoJSON Style when Selected Province Changes
  useEffect(() => {
    if (mapInstanceRef.current?._provincesGeoLayer) {
      mapInstanceRef.current._provincesGeoLayer.setStyle((feature) => {
        const provName = feature?.properties?.Propinsi || feature?.properties?.name || '';
        const isCurrentSelected = selectedProvince !== 'Semua Provinsi' && 
          provName.toLowerCase().includes(selectedProvince.toLowerCase().replace('provinsi', '').trim());

        return {
          color: isCurrentSelected ? '#d8f537' : '#94a3b8',
          weight: isCurrentSelected ? 2.5 : 1.2,
          opacity: isCurrentSelected ? 0.95 : 0.45,
          dashArray: isCurrentSelected ? '0' : '5, 5',
          fillColor: isCurrentSelected ? '#d8f537' : 'transparent',
          fillOpacity: isCurrentSelected ? 0.08 : 0.0
        };
      });
    }

    // Toggle Province Layer Visibility
    if (provincesLayerRef.current && mapInstanceRef.current) {
      if (showProvinces) {
        if (!mapInstanceRef.current.hasLayer(provincesLayerRef.current)) {
          mapInstanceRef.current.addLayer(provincesLayerRef.current);
        }
      } else {
        if (mapInstanceRef.current.hasLayer(provincesLayerRef.current)) {
          mapInstanceRef.current.removeLayer(provincesLayerRef.current);
        }
      }
    }
  }, [selectedProvince, showProvinces]);

  // Pan Map when Selected Province changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const target = provinceCenterMap[selectedProvince];
    if (target) {
      mapInstanceRef.current.flyTo(target.coords, target.zoom, { duration: 1.2 });
    }
  }, [selectedProvince]);

  // Render Map Markers & AMDAL Buffers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    if (bufferLayerRef.current) bufferLayerRef.current.clearLayers();

    filteredSites.forEach((site) => {
      const isStarEnergy = site.is_star_energy;
      const isOperational = site.project_status === 'Operational';

      // Pin Color Scheme
      const pinBg = isStarEnergy ? 'bg-[#d8f537] text-black border-black' : 
                    isOperational ? 'bg-blue-600 text-white border-white' : 
                    'bg-amber-500 text-black border-black';
      
      const pinPulse = isStarEnergy ? 'bg-[#d8f537]' : isOperational ? 'bg-blue-400' : 'bg-amber-400';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        iconSize: [36, 44],
        iconAnchor: [18, 42],
        popupAnchor: [0, -40],
        html: `
          <div class="relative flex flex-col items-center group cursor-pointer">
            <div class="absolute -top-1 w-6 h-6 rounded-full ${pinPulse} opacity-60 animate-ping"></div>
            <div class="relative w-8 h-8 rounded-full ${pinBg} border-2 shadow-xl flex items-center justify-center font-bold text-xs transition-transform transform group-hover:scale-125">
              ${isStarEnergy ? '⚡' : isOperational ? '♨️' : '🔍'}
            </div>
            <div class="w-1.5 h-2 bg-slate-900 mx-auto -mt-0.5 rounded-b"></div>
            <div class="w-2.5 h-1 bg-black/40 rounded-full mx-auto -mt-0.5"></div>
          </div>
        `
      });

      const marker = L.marker([site.latitude, site.longitude], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div class="font-sans text-slate-900 w-64 p-1">
          <div class="relative h-28 w-full rounded-xl overflow-hidden bg-slate-900 mb-2">
            <img src="${site.image || '/hd_gallery/wayang_windu_pipelines_hd.jpg'}" class="w-full h-full object-cover" />
            <div class="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${isStarEnergy ? 'bg-[#d8f537] text-black' : 'bg-blue-600 text-white'}">
              ${site.is_star_energy ? 'Star Energy' : site.project_status}
            </div>
          </div>
          <h4 class="font-extrabold text-sm text-slate-950 leading-tight">${site.site_name}</h4>
          <p class="text-[11px] text-slate-600 font-medium mt-0.5">${site.wkp_name || 'WKP Nasional'} • ${site.regency}</p>
          <div class="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
            <span class="text-slate-500 text-[10px]">Kapasitas:</span>
            <span class="font-extrabold text-slate-900">${site.installed_capacity_mw > 0 ? `${site.installed_capacity_mw} MW` : `Potensi ${site.potential_capacity_mw} MW`}</span>
          </div>
          <button id="btn-detail-${site.id}" class="mt-2.5 w-full py-1.5 px-3 bg-[#121316] hover:bg-black text-[#d8f537] text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5">
            <span>Lihat Detail Lokasi</span>
            <span>&rarr;</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280, className: 'clean-leaflet-popup' });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-detail-${site.id}`);
        if (btn) {
          btn.onclick = () => handleOpenSiteDetail(site);
        }
      });

      markersLayerRef.current.addLayer(marker);

      // Render 5 km AMDAL Buffer if enabled
      if (showBuffers && bufferLayerRef.current) {
        const bufferCircle = L.circle([site.latitude, site.longitude], {
          radius: 5000,
          color: isStarEnergy ? '#d8f537' : '#3b82f6',
          weight: 1.5,
          dashArray: '4, 4',
          fillColor: isStarEnergy ? '#d8f537' : '#3b82f6',
          fillOpacity: 0.05
        });
        bufferCircle.bindTooltip(`Zona Penyangga Konservasi 5 km: ${site.site_name}`, { direction: 'top' });
        bufferLayerRef.current.addLayer(bufferCircle);
      }
    });
  }, [filteredSites, showBuffers]);

  // Handle Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert('Harap isi Nama Lengkap, Email, dan Isi Pesan.');
      return;
    }

    setIsSubmittingContact(true);
    setTimeout(() => {
      setIsSubmittingContact(false);
      setContactSuccessAlert(true);
      setContactForm({
        name: '',
        email: '',
        institution: '',
        category: 'Pertanyaan Umum Panas Bumi',
        subject: '',
        message: ''
      });
      setTimeout(() => setContactSuccessAlert(false), 8000);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#f8f8f5] text-[#121316] font-sans antialiased selection:bg-[#d8f537] selection:text-black">
      
      {/* ======================================================== */}
      {/* TOP FLOATING STICKY NAVBAR DENGAN 7 MENU RESMI PUBLIK   */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#f8f8f5]/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <a href="#beranda" className="flex items-center gap-3 group">
            <img 
              src="/logo_star_energy.png" 
              alt="Star Energy Geothermal" 
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <div className="border-l border-slate-300 pl-3 hidden sm:block">
              <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-slate-500">
                Barito Renewables Group
              </div>
              <div className="text-sm font-extrabold tracking-tight text-[#121316] leading-none mt-0.5">
                Portal Geospasial Panas Bumi
              </div>
            </div>
          </a>

          {/* Clean Executive Corporate Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/80 border border-slate-200/90 rounded-full px-2 py-1.5 shadow-2xs backdrop-blur-md">
            <a 
              href="#beranda" 
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
            >
              Beranda
            </a>
            <a 
              href="#peta-interaktif" 
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all flex items-center gap-1.5"
            >
              <span>Peta Interaktif</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d8f537]"></span>
            </a>
            <a 
              href="#cari-filter" 
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
            >
              Cari & Filter
            </a>
            <a 
              href="#statistik-nasional" 
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
            >
              Statistik Nasional
            </a>
            <a 
              href="#kontak" 
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 transition-all"
            >
              Kontak
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const el = document.getElementById('peta-interaktif');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-300 hover:border-black bg-white text-xs font-bold text-slate-800 transition-all shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Jelajah Peta</span>
            </button>

            <button
              onClick={onOpenInternalPortal}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-[#d8f537] hover:bg-[#c9e62f] active:scale-95 text-[#121316] text-xs font-extrabold transition-all shadow-sm"
              title="Akses Portal Khusus Chief Admin & Analis GIS"
            >
              <Lock className="w-3.5 h-3.5 text-black" />
              <span className="whitespace-nowrap">Portal Internal</span>
              <div className="w-5 h-5 rounded-full bg-black text-[#d8f537] flex items-center justify-center transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* FITUR 1: BERANDA (HERO BENTO ASYMMETRY DENGAN SEARCH)    */}
      {/* ======================================================== */}
      <section id="beranda" className="pt-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Kolom Kiri: Tall Architectural Frame Photo (5 Kolom) */}
          <div className="lg:col-span-5 relative rounded-[32px] overflow-hidden min-h-[460px] lg:min-h-[580px] shadow-lg border border-slate-200/90 group bg-slate-950">
            <img 
              src="/hd_gallery/wayang_windu_pipelines_hd.jpg" 
              alt="Jaringan Pipa Uap Panas Bumi Wayang Windu" 
              className="w-full h-full object-cover object-center filter brightness-[0.98] transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/30 pointer-events-none" />

            {/* Top Badge on Photo */}
            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#121316] shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Energi Bersih Terbarukan • Base Load 24/7</span>
            </div>

            {/* Bottom Floating Info Pill */}
            <div className="absolute bottom-5 left-5 right-5 bg-[#121316]/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d8f537] font-semibold">
                Fasilitas Unggulan Panas Bumi
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                PLTP Wayang Windu • 227 MW
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-snug line-clamp-2">
                Pipa uap meliuk megah di hamparan perkebunan teh Pangalengan Jawa Barat tanpa menghasilkan emisi berbahaya bagi alam.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Editorial Content Card & Headline (7 Kolom) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            
            <div>
              {/* Micro Tag Header */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4f4f0] border border-slate-200 text-xs font-semibold text-slate-700 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Portal Sistem Informasi Geospasial (Web GIS) EBTKE Nasional</span>
              </div>

              {/* Bold Editorial Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#121316] tracking-tight leading-[1.12]">
                Eksplorasi potensi panas bumi nusantara dengan peta digital interaktif.
              </h1>

              {/* Sub-headline / Description */}
              <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-xl">
                Indonesia dianugerahi lebih dari 23,9 Gigawatt potensi geotermal di sepanjang jalur gunung api (Ring of Fire). Pantau sebaran Wilayah Kerja Panas Bumi (WKP), transmisi uap, dan analisis perlindungan lingkungan secara terbuka.
              </p>

              {/* Quick Hero Search Input: Langsung loncat ke Peta */}
              <div className="mt-6 p-2 rounded-2xl bg-[#f4f4f0] border border-slate-300 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
                <input 
                  type="text"
                  placeholder="Cari lokasi: Wayang Windu, Kamojang, Dieng, Salak, Sarulla..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const el = document.getElementById('peta-interaktif');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-transparent text-xs text-slate-900 w-full focus:outline-none placeholder:text-slate-400 font-medium"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('peta-interaktif');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-xl bg-[#121316] hover:bg-black text-[#d8f537] text-xs font-bold transition-all shrink-0"
                >
                  Cari di Peta
                </button>
              </div>

              {/* Quick Recommendation Chips */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Paling Dicari:</span>
                {['Wayang Windu', 'Gunung Salak', 'Darajat', 'Dieng', 'Sarulla', 'Kamojang'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      const el = document.getElementById('peta-interaktif');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-black hover:text-black transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Headline Metric Cards */}
            <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Kapasitas RI</span>
                <span className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 block">
                  2.356 <span className="text-xs font-normal text-blue-600">MW</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Terpasang Nasional</span>
              </div>

              <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Potensi Sumber</span>
                <span className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 block">
                  23.965 <span className="text-xs font-normal text-amber-600">MW</span>
                </span>
                <span className="text-[10px] text-slate-500 block">No. 2 Terbesar Dunia</span>
              </div>

              <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Portofolio Star Energy</span>
                <span className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 block">
                  882.0 <span className="text-xs font-normal text-emerald-600">MW</span>
                </span>
                <span className="text-[10px] text-slate-500 block">Pangsa Pasar 37,4%</span>
              </div>

              <div className="bg-[#f8f8f5] p-3 rounded-2xl border border-slate-200/80">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Reduksi Emisi</span>
                <span className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5 block">
                  4,8 <span className="text-xs font-normal text-green-600">Jt Ton</span>
                </span>
                <span className="text-[10px] text-slate-500 block">CO2 Dicegah/Tahun</span>
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* FITUR 2, 3 & 4: PETA INTERAKTIF, CARI LOKASI & FILTER    */}
      {/* ======================================================== */}
      <section id="peta-interaktif" className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        {/* Section Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200">
              <Globe2 className="w-3.5 h-3.5" />
              <span>SEBARAN SPASIAL & PETA DIGITAL NASIONAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mt-2">
              Peta Interaktif Sebaran Panas Bumi Seluruh Indonesia
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Jelajahi pembangkit operasional, wilayah kerja (WKP), dan calon prospek eksplorasi energi hijau dengan batas garis provinsi dan zona penyangga konservasi.
            </p>
          </div>

          {/* Map View Mode Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetMapIndonesia}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:border-black text-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Peta Seluruh RI</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* FITUR 3 & 4: TOOLBAR CARI LOKASI & FILTER PROVINSI       */}
        {/* ======================================================== */}
        <div id="cari-filter" className="mb-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
          
          {/* Baris 1: Input Pencarian Real-Time (Cari Lokasi) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ketik nama PLTP, WKP, Kabupaten, atau Pengembang (misal: Wayang Windu, Dieng, Salak)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Counter Hasil Pencarian */}
            <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-2 whitespace-nowrap self-start sm:self-auto border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Menampilkan: <strong>{filteredSites.length}</strong> dari {allSites.length} Lokasi</span>
            </div>
          </div>

          {/* Baris 2: Filter Provinsi & Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            
            {/* Filter Provinsi Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Provinsi:</span>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {provinceList.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Filter Status Proyek */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Status:</span>
              {[
                { id: 'Semua', label: 'Semua' },
                { id: 'Operational', label: 'Operasional' },
                { id: 'Exploration', label: 'Eksplorasi/Konstruksi' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedStatus === st.id
                      ? 'bg-[#121316] text-[#d8f537]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Filter Operator */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-500 mr-1">Operator:</span>
              {[
                { id: 'Semua', label: 'Semua' },
                { id: 'Star Energy', label: 'Star Energy' },
                { id: 'PGE', label: 'Pertamina' }
              ].map(op => (
                <button
                  key={op.id}
                  onClick={() => setSelectedOperatorCategory(op.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedOperatorCategory === op.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>

          </div>

          {/* Quick Province Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
            <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Pilih Cepat Provinsi:</span>
            {['Jawa Barat', 'Jawa Tengah', 'Sumatera Utara', 'Lampung', 'Sulawesi Utara', 'Maluku Utara'].map(p => (
              <button
                key={p}
                onClick={() => setSelectedProvince(p)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors border ${
                  selectedProvince === p
                    ? 'bg-[#d8f537] text-black border-black font-bold'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

        </div>

        {/* ======================================================== */}
        {/* MAP CONTAINER & INTERACTIVE LAYERS                       */}
        {/* ======================================================== */}
        <div className="bg-white rounded-[32px] border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
          
          <div className="flex flex-col h-[520px] sm:h-[620px] relative rounded-[24px] overflow-hidden border border-slate-300">
            
            {/* Map Canvas */}
            <div ref={mapContainerRef} className="w-full h-full z-0" />

            {/* Floating Map Controls di Atas Peta */}
            <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-[#121316]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs text-white shadow-xl">
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

              {/* Batas Provinsi Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] select-none">
                <input
                  type="checkbox"
                  checked={showProvinces}
                  onChange={(e) => setShowProvinces(e.target.checked)}
                  className="rounded border-slate-700 text-[#d8f537] w-3 h-3 accent-[#d8f537]"
                />
                <span className="text-slate-200 font-medium">Garis Batas Provinsi</span>
              </label>

              {/* Buffer AMDAL Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[10px] select-none">
                <input
                  type="checkbox"
                  checked={showBuffers}
                  onChange={(e) => setShowBuffers(e.target.checked)}
                  className="rounded border-slate-700 text-[#d8f537] w-3 h-3 accent-[#d8f537]"
                />
                <span className="text-slate-200 font-medium">Buffer Konservasi 5 km</span>
              </label>
            </div>

            {/* Map Legend Floating Bottom Right */}
            <div className="absolute bottom-3 right-3 z-10 bg-[#121316]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-white text-[10px] shadow-lg hidden sm:block">
              <div className="font-bold text-slate-300 uppercase font-mono mb-1">Legenda Pin:</div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d8f537] border border-black"></span>
                  <span>Star Energy</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 border border-white"></span>
                  <span>Operasional Nasional</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-black"></span>
                  <span>Eksplorasi/Prospek</span>
                </div>
              </div>
            </div>

          </div>

          {/* Horizontal Card Carousel of Filtered Sites (Klik untuk Fokus & Detail) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Daftar Lokasi Terpilih ({filteredSites.length} Titik) — Klik untuk Buka Detail Lokasi</span>
              </h3>
              <span className="text-[11px] text-slate-500">Geser untuk melihat semua</span>
            </div>

            <div className="flex items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {filteredSites.map(site => (
                <div
                  key={site.id}
                  onClick={() => handleOpenSiteDetail(site)}
                  className="w-72 shrink-0 bg-[#f8f8f5] hover:bg-white p-3 rounded-2xl border border-slate-200/90 hover:border-black cursor-pointer transition-all shadow-xs group"
                >
                  <div className="relative h-28 w-full rounded-xl overflow-hidden bg-slate-900 mb-2">
                    <img src={site.image || '/hd_gallery/wayang_windu_pipelines_hd.jpg'} alt={site.site_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#121316]/90 text-white backdrop-blur-md">
                      {site.province}
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#d8f537] text-black">
                      {site.installed_capacity_mw > 0 ? `${site.installed_capacity_mw} MW` : `Potensi ${site.potential_capacity_mw} MW`}
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-950 group-hover:text-blue-700 transition-colors line-clamp-1">
                    {site.site_name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {site.wkp_name || 'WKP Nasional'} • {site.regency}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[140px]">{site.operator_company}</span>
                    <span className="text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                      <span>Detail</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* FITUR 5: DETAIL LOKASI (MODAL DIALOG RESMI INTERAKTIF)   */}
      {/* ======================================================== */}
      {isDetailModalOpen && selectedSiteDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative">
            
            {/* Top Close Button */}
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-black text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Photo Frame */}
            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
              <img 
                src={selectedSiteDetail.image || '/hd_gallery/wayang_windu_pipelines_hd.jpg'} 
                alt={selectedSiteDetail.site_name} 
                className="w-full h-full object-cover filter brightness-[0.95]" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedSiteDetail.is_star_energy ? 'bg-[#d8f537] text-black' : 'bg-blue-600 text-white'
                  }`}>
                    {selectedSiteDetail.is_star_energy ? 'Star Energy Geothermal' : selectedSiteDetail.project_status}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    {selectedSiteDetail.site_code || selectedSiteDetail.id}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {selectedSiteDetail.site_name}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedSiteDetail.operator_company}
                </p>
              </div>
            </div>

            {/* Modal Body: 4 Bento Parameter Columns */}
            <div className="p-6 space-y-6">
              
              {/* Deskripsi & Ringkasan */}
              <div className="p-4 rounded-2xl bg-[#f8f8f5] border border-slate-200/90">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-700 tracking-wider block mb-1">
                  Ringkasan Lapangan & Operasional
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedSiteDetail.description || 'Pembangkit listrik tenaga panas bumi strategis nasional berwawasan lingkungan lestari.'}
                </p>
              </div>

              {/* 4 Bento Spec Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Geospasial & Kewilayahan */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>Data Geospasial & WKP</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Wilayah Kerja (WKP):</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.wkp_name || 'WKP Nasional'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kabupaten/Kota:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.regency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Provinsi / Pulau:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.province} ({selectedSiteDetail.island})</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-500 font-sans">Koordinat WGS 84:</span>
                      <span className="text-blue-700 font-semibold">{selectedSiteDetail.latitude.toFixed(4)}°, {selectedSiteDetail.longitude.toFixed(4)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Elevasi Kepala Sumur:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.elevation_masl} mdpl</span>
                    </div>
                  </div>
                </div>

                {/* 2. Parameter Teknis & Termodinamika */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Gauge className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Spesifikasi Teknis & Kapasitas</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kapasitas Terpasang:</span>
                      <span className="font-extrabold text-slate-900">{selectedSiteDetail.installed_capacity_mw} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Potensi Cadangan:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.potential_capacity_mw} MW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Suhu Reservoir:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.reservoir_temp_celsius} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipe Entalpi:</span>
                      <span className="font-semibold text-slate-900">{selectedSiteDetail.enthalpy_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sistem Konversi Uap:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{selectedSiteDetail.systemType}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Operasional & Interkoneksi Listrik */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Zap className="w-3.5 h-3.5 text-amber-600" />
                    <span>Operasional & Interkoneksi Grid</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tahun Beroperasi (COD):</span>
                      <span className="font-semibold text-slate-900">Tahun {selectedSiteDetail.commercial_operation_year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Koneksi Jaringan:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{selectedSiteDetail.grid_connection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Estimasi Rumah Teraliri:</span>
                      <span className="font-extrabold text-emerald-700">{selectedSiteDetail.homesPowered} KK</span>
                    </div>
                  </div>
                </div>

                {/* 4. AMDAL & Keberlanjutan Lingkungan */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <h4 className="text-xs font-bold text-slate-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    <Trees className="w-3.5 h-3.5 text-green-600" />
                    <span>AMDAL & Manfaat Emisi Bersih</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Reduksi CO2 / Tahun:</span>
                      <span className="font-bold text-emerald-700">{selectedSiteDetail.co2SavedTons} Ton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Batu Bara Tergantikan:</span>
                      <span className="font-bold text-slate-900">{selectedSiteDetail.coalReplacedTons} Ton/Thn</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kelayakan Lingkungan:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[160px]">{selectedSiteDetail.amdalStatus}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons in Modal */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleFocusSiteOnMap(selectedSiteDetail);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#121316] hover:bg-black text-[#d8f537] text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <MapPinned className="w-4 h-4" />
                  <span>Fokuskan di Peta Interaktif</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FITUR 6: STATISTIK NASIONAL (TABEL, GRAFIK & KALKULATOR) */}
      {/* ======================================================== */}
      <section id="statistik-nasional" className="py-12 bg-white border-y border-slate-200/90 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>NERACA ENERGI & STATISTIK EBTKE NASIONAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mt-2">
              Statistik & Bauran Panas Bumi Nasional
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Transparansi data kapasitas pembangkit, sebaran per provinsi, perbandingan emisi bersih, dan kalkulator penghematan karbon rumah tangga.
            </p>

            {/* 4 Interactive Statistics Tabs */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
              {[
                { id: 'operator_share', label: 'Pangsa Pasar Operator', icon: PieChart },
                { id: 'province_distribution', label: 'Sebaran per Provinsi', icon: MapPin },
                { id: 'emissions', label: 'Komparasi Emisi Bersih', icon: Leaf },
                { id: 'calculator', label: 'Kalkulator Manfaat Hijau', icon: Sliders }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeStatTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveStatTab(tab.id)}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                      isActive 
                        ? 'border-[#121316] text-[#121316] bg-[#f8f8f5]' 
                        : 'border-transparent text-slate-500 hover:text-black hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: PANGSA PASAR OPERATOR */}
          {activeStatTab === 'operator_share' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
              {[
                {
                  operator: 'Star Energy Geothermal',
                  parent: 'Barito Renewables (BREN Group)',
                  mw: 882.0,
                  share: '37.44%',
                  desc: 'Wayang Windu (227 MW), Salak (377 MW), Darajat (271 MW)',
                  color: 'bg-[#d8f537] text-black border-black',
                  badge: 'Kontributor Terbesar RI'
                },
                {
                  operator: 'PT Pertamina Geothermal Energy',
                  parent: 'Pertamina (Persero) BUMN',
                  mw: 672.0,
                  share: '28.52%',
                  desc: 'Kamojang (235 MW), Ulubelu (220 MW), Lahendong (120 MW), Lumut Balai (55 MW)',
                  color: 'bg-blue-600 text-white border-blue-700',
                  badge: 'BUMN Panas Bumi'
                },
                {
                  operator: 'Sarulla Operations & IPP Lain',
                  parent: 'Konsorsium Swasta Nasional & Asing',
                  mw: 682.0,
                  share: '28.95%',
                  desc: 'Sarulla (330 MW), Sorik Marapi (140 MW), Muara Laboh (85 MW), Rantau Dedap (91 MW)',
                  color: 'bg-slate-800 text-white border-slate-900',
                  badge: 'Konsorsium Swasta'
                },
                {
                  operator: 'PT Geo Dipa Energi (Persero)',
                  parent: 'Kementerian Keuangan RI',
                  mw: 120.0,
                  share: '5.09%',
                  desc: 'Dieng Unit 1 (60 MW), Patuha Unit 1 (60 MW)',
                  color: 'bg-slate-600 text-white border-slate-700',
                  badge: 'BUMN Khusus EBT'
                }
              ].map((op, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#f8f8f5] border border-slate-200 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider block">
                      {op.badge}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-950 mt-1">
                      {op.operator}
                    </h3>
                    <p className="text-[11px] text-slate-500">{op.parent}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-snug">{op.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-950">{op.mw}</span>
                      <span className="text-xs text-slate-500 ml-1 font-semibold">MW</span>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-white border border-slate-300">
                      {op.share}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: SEBARAN PER PROVINSI */}
          {activeStatTab === 'province_distribution' && (
            <div className="bg-[#f8f8f5] p-6 rounded-3xl border border-slate-200 animate-in fade-in duration-300 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Peringkat Kapasitas Terpasang Pembangkit Panas Bumi per Provinsi
              </h3>
              <div className="space-y-3">
                {[
                  { prov: 'Jawa Barat', mw: 1258, percent: 53.4, note: 'Pusat geotermal terbesar nasional (Wayang Windu, Salak, Darajat, Kamojang, Patuha)' },
                  { prov: 'Sumatera Utara', mw: 470, percent: 19.9, note: 'Sarulla (330 MW) & Sorik Marapi (140 MW)' },
                  { prov: 'Lampung', mw: 220, percent: 9.3, note: 'PLTP Ulubelu Unit 1-4' },
                  { prov: 'Sulawesi Utara', mw: 120, percent: 5.1, note: 'PLTP Lahendong Unit 1-6 Tomohon' },
                  { prov: 'Jawa Tengah', mw: 60, percent: 2.5, note: 'PLTP Dieng Unit 1' },
                  { prov: 'Sumatera Selatan', mw: 91, percent: 3.9, note: 'PLTP Rantau Dedap & Lumut Balai' },
                  { prov: 'Sumatera Barat', mw: 85, percent: 3.6, note: 'PLTP Muara Laboh' },
                  { prov: 'Nusa Tenggara Timur & Lainnya', mw: 52, percent: 2.3, note: 'PLTP Ulumbu & Mataloko' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900">{idx + 1}. {item.prov}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500">{item.note}</span>
                        <span className="font-black text-slate-950">{item.mw} MW ({item.percent}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-700"
                        style={{ width: `${item.percent * 1.5}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: KOMPARASI EMISI BERSIH */}
          {activeStatTab === 'emissions' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in duration-300">
              {[
                { source: 'PLTU Batu Bara', co2: 1020, color: 'bg-red-500', ratio: '26.8x Lebih Berpolusi', desc: 'Emisi karbon tertinggi dengan partikulat debu abu terbang.' },
                { source: 'PLTD Minyak Solar', co2: 780, color: 'bg-orange-500', ratio: '20.5x Lebih Berpolusi', desc: 'Biaya pokok penyediaan listrik mahal dan sangat mencemari.' },
                { source: 'PLTGU Gas Bumi', co2: 490, color: 'bg-amber-500', ratio: '12.9x Lebih Berpolusi', desc: 'Masih menghasilkan emisi metana dan gas rumah kaca.' },
                { source: 'PLTP Panas Bumi (EBT)', co2: 38, color: 'bg-emerald-500', ratio: 'Paling Bersih (Tolok Ukur)', desc: '100% uap alam terbarukan. Uap kondensat diinjeksi ulang zero discharge.' }
              ].map((fuel, idx) => (
                <div key={idx} className={`p-5 rounded-2xl border ${fuel.co2 === 38 ? 'bg-[#121316] text-white border-black ring-2 ring-[#d8f537]' : 'bg-[#f8f8f5] text-slate-900 border-slate-200'}`}>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">{fuel.ratio}</span>
                  <h3 className="text-base font-extrabold mt-1">{fuel.source}</h3>
                  <div className="my-3">
                    <span className="text-3xl font-black">{fuel.co2}</span>
                    <span className="text-xs ml-1 opacity-75">g CO2/kWh</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700/30 rounded-full overflow-hidden mb-3">
                    <div className={`h-full ${fuel.color}`} style={{ width: `${(fuel.co2 / 1020) * 100}%` }} />
                  </div>
                  <p className="text-xs opacity-80 leading-relaxed">{fuel.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: KALKULATOR MANFAAT HIJAU */}
          {activeStatTab === 'calculator' && (
            <div className="bg-[#f8f8f5] p-6 sm:p-8 rounded-3xl border border-slate-200 animate-in fade-in duration-300">
              <div className="max-w-2xl mx-auto space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-950">
                    Kalkulator Simulasi Manfaat Bersih Rumah Tangga
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Geser nilai pemakaian listrik bulanan rumah Anda untuk melihat berapa banyak emisi yang dihemat jika menggunakan listrik panas bumi:
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Pemakaian Listrik Bulanan:</span>
                    <span className="text-lg font-black text-blue-700 font-mono">{monthlyKwh} kWh / bulan</span>
                  </div>

                  <input 
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={monthlyKwh}
                    onChange={(e) => setMonthlyKwh(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase block">Reduksi CO2 Tahunan</span>
                      <span className="text-lg font-black text-emerald-700 block mt-0.5">
                        {((monthlyKwh * 12 * (1020 - 38)) / 1000000).toFixed(2)} Ton
                      </span>
                      <span className="text-[10px] text-emerald-600">dibandingkan batu bara</span>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">Batu Bara Dicegah</span>
                      <span className="text-lg font-black text-blue-700 block mt-0.5">
                        {((monthlyKwh * 12 * 0.45) / 1000).toFixed(2)} Ton
                      </span>
                      <span className="text-[10px] text-blue-600">pembakaran bahan bakar</span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                      <span className="text-[10px] font-bold text-amber-800 uppercase block">Setara Menanam Pohon</span>
                      <span className="text-lg font-black text-amber-700 block mt-0.5">
                        {Math.round((monthlyKwh * 12 * 0.98) / 22)} Pohon
                      </span>
                      <span className="text-[10px] text-amber-600">pohon pelindung 10 tahun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ======================================================== */}
      {/* FITUR 7: KONTAK (LAYANAN INFORMASI & FORM HUBUNGI KAMI)  */}
      {/* ======================================================== */}
      <section id="kontak" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        {/* Section Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50/90 px-3 py-1 rounded-full border border-blue-200">
            <Mail className="w-3.5 h-3.5" />
            <span>PUSAT LAYANAN INFORMASI & KONSULTASI PUBLIK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#121316] tracking-tight mt-2">
            Pusat Layanan Informasi & Hubungi Kami
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Layanan resmi permohonan data geospasial, riset akademik mahasiswa/dosen, kunjungan lapangan, dan kemitraan energi baru terbarukan.
          </p>
        </div>

        {/* Layout 2 Kolom: Informasi Kontak (Kiri) & Form Pesan (Kanan) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Informasi Kantor & Saluran Resmi (5 Kolom) */}
          <div className="lg:col-span-5 bg-[#121316] text-white rounded-[32px] p-6 sm:p-8 space-y-6 shadow-md border border-black">
            
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#d8f537] font-semibold">
                Alamat Kantor Resmi
              </span>
              <h3 className="text-lg font-extrabold text-white mt-1">
                Star Energy Geothermal Head Office
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Wisma Barito Pacific Tower B, Lantai 9-11<br />
                Jl. Letjen S. Parman Kav. 62-63, Slipi, Palmerah<br />
                Jakarta Barat 11410, DKI Jakarta, Indonesia
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs text-slate-300">
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#d8f537]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Telepon Hotline</div>
                  <div className="text-[11px] font-mono text-slate-300">+62 21 530 6711 • Fax: +62 21 530 6680</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#d8f537]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Email Informasi Publik & GIS</div>
                  <div className="text-[11px] font-mono text-slate-300">info.geothermal@starenergy.co.id</div>
                  <div className="text-[11px] font-mono text-slate-300">gis.public@starenergy.co.id</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#d8f537]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Sentra Operasi Lapangan</div>
                  <div className="text-[11px] text-slate-300">
                    • WKP Pangalengan (Wayang Windu, Kab. Bandung)<br />
                    • WKP Gunung Salak (Sukabumi & Bogor)<br />
                    • WKP Darajat (Garut)
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#d8f537]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">Jam Layanan Konsultasi Publik</div>
                  <div className="text-[11px] text-slate-300">Senin - Jumat: 08.00 - 17.00 WIB (Kecuali Hari Libur Nasional)</div>
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-[#d8f537]" />
              <span>Sertifikasi Standar Layanan Informasi Publik EBTKE</span>
            </div>

          </div>

          {/* Kolom Kanan: Formulir Interaktif Kirim Pesan Publik (7 Kolom) */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            
            <div>
              <h3 className="text-lg font-extrabold text-slate-950">
                Formulir Pengajuan Pertanyaan & Permohonan Informasi
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kirimkan pertanyaan, permohonan data peta, atau usulan kerja sama kepada tim kami:
              </p>
            </div>

            {contactSuccessAlert && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-900">Terima kasih! Pesan Anda Berhasil Terkirim.</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">Tim Hubungan Publik & Geospasial kami akan memproses permohonan Anda maksimal 1x24 jam kerja melalui email yang dicantumkan.</div>
                </div>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Budi Prasetyo"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Instansi / Universitas / Perusahaan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Institut Teknologi Bandung (ITB)"
                    value={contactForm.institution}
                    onChange={(e) => setContactForm({ ...contactForm, institution: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori Kepentingan
                  </label>
                  <select
                    value={contactForm.category}
                    onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans font-medium"
                  >
                    <option value="Pertanyaan Umum Panas Bumi">Pertanyaan Umum Panas Bumi</option>
                    <option value="Permintaan Data Riset/Skripsi">Permintaan Data Riset / Skripsi Akademik</option>
                    <option value="Kunjungan Lapangan / Edukasi">Kunjungan Lapangan & Edukasi WKP</option>
                    <option value="Kemitraan EBT & Lingkungan">Kemitraan EBT & AMDAL Lingkungan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Judul / Subjek Pesan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Permohonan Data Spasial Sesar & Suhu Reservoir Wayang Windu"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pesan / Rincian Permohonan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pertanyaan atau deskripsi kebutuhan data Anda secara jelas di sini..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 font-sans resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Semua data dijaga kerahasiaannya sesuai UU Perlindungan Data Pribadi (PDP).
                </span>
                <button
                  type="submit"
                  disabled={isSubmittingContact}
                  className="px-6 py-2.5 bg-[#121316] hover:bg-black text-[#d8f537] text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingContact ? 'Mengirim...' : 'Kirim Pesan'}</span>
                </button>
              </div>

            </form>

          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* FOOTER RESMI MODUL USER / PUBLIK                        */}
      {/* ======================================================== */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <img 
              src="/logo_star_energy.png" 
              alt="Star Energy Geothermal" 
              className="h-8 w-auto object-contain" 
            />
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-900">Star Energy Geothermal</span> • Barito Renewables (BREN)
              <div className="text-[10px] text-slate-400">Platform Pemetaan Geospasial Panas Bumi Nasional Indonesia</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <a href="#beranda" className="hover:text-black transition-colors">Beranda</a>
            <a href="#peta-interaktif" className="hover:text-black transition-colors">Peta Interaktif</a>
            <a href="#cari-filter" className="hover:text-black transition-colors">Cari & Filter</a>
            <a href="#statistik-nasional" className="hover:text-black transition-colors">Statistik Nasional</a>
            <a href="#kontak" className="hover:text-black transition-colors">Kontak</a>
          </div>

          <div className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} Star Energy Geothermal. Hak Cipta Dilindungi Undang-Undang.
          </div>

        </div>
      </footer>

    </div>
  );
}
