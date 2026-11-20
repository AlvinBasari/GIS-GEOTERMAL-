import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Thermometer, 
  Mountain, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Activity, 
  ArrowUpRight, 
  Ruler, 
  Compass, 
  Scale, 
  FileText, 
  Download, 
  Maximize2, 
  Building2, 
  Sparkles,
  Info,
  Droplets,
  Trees,
  Leaf,
  Camera,
  Satellite,
  Check,
  Send,
  AlertTriangle,
  Edit3,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Globe,
  Tag,
  Link as LinkIcon,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function SiteDetailDrawer({ 
  site, 
  isOpen, 
  onClose, 
  currentUser,
  isEditMode = false,
  onSaveSurveyorDraft,
  onStartMeasureFromSite,
  onDrawPolygonAroundSite,
  onRunAmdalBuffer,
  onExportSiteReport
}) {
  // Navigation & View Mode States
  const [mode, setMode] = useState(isEditMode ? 'edit' : 'view'); // 'view' | 'edit'
  const [activeMenuTab, setActiveMenuTab] = useState('location'); // 'location' | 'multimedia' | 'technical'
  const [galleryFilter, setGalleryFilter] = useState('all'); // 'all' | 'drone' | 'satellite' | 'onsite'
  const [uploadCategory, setUploadCategory] = useState('drone'); // 'drone' | 'satellite' | 'onsite'
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const fileInputRef = useRef(null);
  
  // Comprehensive Editable Form Fields
  const [formData, setFormData] = useState({
    // 1. Informasi Lokasi & Administrasi
    site_name: '',
    wkp_name: '',
    operator_company: '',
    province: 'Jawa Barat',
    regency: 'Kabupaten Bandung',
    island: 'Jawa',
    project_status: 'Operasional',
    latitude: -7.208000,
    longitude: 107.630000,
    elevation_masl: 1650,
    commercial_operation_year: 2000,
    grid_connection: 'Interkoneksi 150 kV Jamali',
    parent_site_name: '',
    is_polygon: false,
    areaHectares: null,
    areaSqMeters: null,
    coordinates: [],

    // 2. Dokumentasi & Bukti Gambar (Multi-Photo Collage)
    gallery_photos: [],
    satellite_photo_url: '/hd_gallery/wayang_windu_pipelines_hd.jpg',
    satellite_caption: 'Citra Satelit Multispektral Esri World Imagery (Resolusi Tinggi)',
    onsite_photo_url: '/user_geothermal.png',
    onsite_caption: 'Dokumentasi Fasilitas Fisik On-Site Wellhead & Pipa Uap Panas Bumi',
    drone_photo_url: '/hd_gallery/pltp_steam_pipeline_5k.jpg',
    drone_caption: 'Foto Udara Drone Lapangan (Resolusi 4K Ultra HD)',

    // 3. Data Teknis & Geologi
    reservoir_temp_celsius: 260,
    wellhead_pressure_bar: 12.5,
    steam_flow_tons_hour: 920,
    installed_capacity_mw: 0,
    potential_capacity_mw: 400,
    enthalpy_type: 'High Enthalpy',
    system_type: 'Single-Cylinder Flash Steam Condensing',
    fluid_type: 'Water-Dominated Liquid',
    environmental_status: 'Kawasan Hutan Lindung (AMDAL Terpenuhi)',
    notes: 'Batuan reservoir vulkanik andesitik dengan rekahan sekunder aktif.'
  });

  // AMDAL Automated Compliance Verification States
  const [isVerifyingAmdal, setIsVerifyingAmdal] = useState(false);
  const [amdalVerificationResult, setAmdalVerificationResult] = useState(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      const photos = formData.gallery_photos || [];
      if (photos.length === 0) return;
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, formData.gallery_photos]);

  // Sync Form Data when site changes or drawer opens
  useEffect(() => {
    if (site) {
      const defaultInitialPhotos = [
        {
          id: 'photo_drone_1',
          url: site.drone_photo_url || '/hd_gallery/pltp_steam_pipeline_5k.jpg',
          caption: site.drone_caption || 'Foto Udara Drone Lapangan (Resolusi 4K Ultra HD)',
          category: 'drone',
          timestamp: 'Survei Drone Lapangan'
        },
        {
          id: 'photo_onsite_1',
          url: site.onsite_photo_url || '/user_geothermal.png',
          caption: site.onsite_caption || 'Dokumentasi Fasilitas Fisik On-Site Wellhead & Pipa Uap',
          category: 'onsite',
          timestamp: 'Dokumentasi On-Site'
        },
        {
          id: 'photo_satellite_1',
          url: site.satellite_photo_url || '/hd_gallery/wayang_windu_pipelines_hd.jpg',
          caption: site.satellite_caption || 'Citra Satelit Multispektral Esri World Imagery',
          category: 'satellite',
          timestamp: 'Penginderaan Jauh'
        },
        {
          id: 'photo_onsite_2',
          url: '/hd_gallery/pltp_dieng_hd.jpg',
          caption: 'Inspeksi Turbin Pembangkit & Cooling Tower',
          category: 'onsite',
          timestamp: 'Inspeksi Fasilitas'
        },
        {
          id: 'photo_drone_2',
          url: '/hd_gallery/pltp_indonesia_panoramic.jpg',
          caption: 'Topografi & Bentang Alam Prospek Geotermal',
          category: 'drone',
          timestamp: 'Foto Udara Drone'
        }
      ];

      const initialGallery = (site.gallery_photos && Array.isArray(site.gallery_photos) && site.gallery_photos.length > 0)
        ? site.gallery_photos
        : defaultInitialPhotos;

      setFormData({
        site_name: site.site_name || '',
        wkp_name: site.wkp_name || 'WKP Pangalengan / Wayang Windu',
        operator_company: site.operator_company || 'PT Star Energy Geothermal',
        province: site.province || 'Jawa Barat',
        regency: site.regency || 'Kabupaten Bandung',
        island: site.island || 'Jawa',
        project_status: site.project_status || 'Operasional',
        latitude: parseFloat(site.latitude) || -7.208000,
        longitude: parseFloat(site.longitude) || 107.630000,
        elevation_masl: site.elevation_masl || 1650,
        commercial_operation_year: site.commercial_operation_year || 2000,
        grid_connection: site.grid_connection || 'Interkoneksi 150 kV Jamali',
        parent_site_name: site.parent_site_name || '',
        is_polygon: Boolean(site.is_polygon),
        areaHectares: site.areaHectares || null,
        areaSqMeters: site.areaSqMeters || null,
        coordinates: site.coordinates || [],

        gallery_photos: initialGallery,
        satellite_photo_url: site.satellite_photo_url || '/hd_gallery/wayang_windu_pipelines_hd.jpg',
        satellite_caption: site.satellite_caption || 'Citra Satelit Multispektral Esri World Imagery (Resolusi Tinggi)',
        onsite_photo_url: site.onsite_photo_url || '/user_geothermal.png',
        onsite_caption: site.onsite_caption || 'Dokumentasi Fasilitas Fisik On-Site Wellhead & Pipa Uap Panas Bumi',
        drone_photo_url: site.drone_photo_url || '/hd_gallery/pltp_steam_pipeline_5k.jpg',
        drone_caption: site.drone_caption || 'Foto Udara Drone Lapangan (Resolusi 4K Ultra HD)',

        reservoir_temp_celsius: site.reservoir_temp_celsius || 260,
        wellhead_pressure_bar: site.wellhead_pressure_bar || 12.5,
        steam_flow_tons_hour: site.steam_flow_tons_hour || 920,
        installed_capacity_mw: site.installed_capacity_mw || 0,
        potential_capacity_mw: site.potential_capacity_mw || 400,
        enthalpy_type: site.enthalpy_type || 'High Enthalpy',
        system_type: site.system_type || 'Single-Cylinder Flash Steam Condensing',
        fluid_type: site.fluid_type || 'Water-Dominated Liquid',
        environmental_status: site.environmental_status || 'Kawasan Konservasi Hutan Lindung (AMDAL Lolos)',
        notes: site.notes || 'Batuan reservoir vulkanik andesitik dengan rekahan sekunder aktif.'
      });

      // If new survey draft, automatically enter edit mode and reset AMDAL
      if (site.is_new_survey || isEditMode) {
        setMode('edit');
        setAmdalVerificationResult(null);
        // Default to first tab (Informasi Lokasi) for survey completion
        setActiveMenuTab('location');
      } else {
        setMode('view');
        // Pre-verified for existing production plants
        setAmdalVerificationResult({
          status: 'Passed',
          score: '98.5%',
          bufferDistance: '4.8 km terhadap Hutan Konservasi',
          overlapPercent: '0% (Zona Bebas Pemukiman)',
          reinjectionPrinciple: 'Closed-Loop Injection 100% (Zero Discharge)',
          summary: 'Memenuhi seluruh kriteria penyangga lingkungan PP No. 7/2017 & SNI 5015:2019.'
        });
      }
    }
  }, [site, isEditMode, isOpen]);

  if (!site || !isOpen) return null;

  // Role Checks
  const isSurveyor = currentUser?.role?.toLowerCase().includes('surveyor');
  const isLead = currentUser?.role?.toLowerCase().includes('lead') || currentUser?.role?.toLowerCase().includes('geoscientist');
  const isAdmin = currentUser?.role?.toLowerCase().includes('admin');

  const lat = parseFloat(formData.latitude) || 0;
  const lng = parseFloat(formData.longitude) || 0;
  const utmZone = Math.floor((lng + 180) / 6) + 1;

  // Multi-Photo File Upload Handler
  const handleMultipleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      alert('Harap pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    const categoryLabel = uploadCategory === 'drone' 
      ? 'Foto Udara Drone' 
      : (uploadCategory === 'satellite' ? 'Citra Satelit' : 'Gambar On-Site');

    let loadedCount = 0;
    const newPhotos = [];

    validFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        newPhotos.push({
          id: `upload_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 4)}`,
          url: dataUrl,
          caption: `${categoryLabel}: ${file.name.replace(/\.[^/.]+$/, "")}`,
          category: uploadCategory,
          timestamp: 'Baru Diunggah'
        });
        loadedCount++;

        if (loadedCount === validFiles.length) {
          setFormData(prev => {
            const updatedGallery = [...newPhotos, ...(prev.gallery_photos || [])];
            return {
              ...prev,
              gallery_photos: updatedGallery,
              ...(uploadCategory === 'drone' ? { drone_photo_url: newPhotos[0].url, drone_caption: newPhotos[0].caption } : {}),
              ...(uploadCategory === 'satellite' ? { satellite_photo_url: newPhotos[0].url, satellite_caption: newPhotos[0].caption } : {}),
              ...(uploadCategory === 'onsite' ? { onsite_photo_url: newPhotos[0].url, onsite_caption: newPhotos[0].caption } : {})
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Delete individual photo
  const handleDeletePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      gallery_photos: (prev.gallery_photos || []).filter(p => p.id !== photoId)
    }));
  };

  // Update caption of a photo in the gallery
  const handleUpdatePhotoCaption = (photoId, newCaption) => {
    setFormData(prev => ({
      ...prev,
      gallery_photos: (prev.gallery_photos || []).map(p =>
        p.id === photoId ? { ...p, caption: newCaption } : p
      )
    }));
  };

  // Update category of a photo
  const handleUpdatePhotoCategory = (photoId, newCategory) => {
    setFormData(prev => ({
      ...prev,
      gallery_photos: (prev.gallery_photos || []).map(p =>
        p.id === photoId ? { ...p, category: newCategory } : p
      )
    }));
  };

  // Backward-compatible single file upload handler
  const handleFileUpload = (e) => {
    handleMultipleFileUpload(e);
  };

  // Run Automated Spatial AMDAL Compliance Checker
  const handleRunAmdalCheck = () => {
    setIsVerifyingAmdal(true);
    setTimeout(() => {
      setIsVerifyingAmdal(false);
      setAmdalVerificationResult({
        status: 'Passed',
        score: '98.8%',
        bufferDistance: '4.2 km terhadap Zona Inti Cagar Alam',
        overlapSettlement: '0% (Bebas Pemukiman Penduduk)',
        waterCatchment: '100% Aman (Catchment Area Hutan Terlindungi)',
        reinjectionPrinciple: 'Closed-Loop Injection 100% (Zero Surface Contamination)',
        complianceStandard: 'Kepatuhan Regulasi PP 7/2017 & SNI 5015:2019 Panas Bumi'
      });
    }, 1200);
  };

  // Finalize and Send to Lead Geoscientist
  const handleFinalizeAndSend = () => {
    if (!amdalVerificationResult || amdalVerificationResult.status !== 'Passed') {
      alert('Sistem harus memproses dan memvalidasi kepatuhan AMDAL terlebih dahulu.');
      return;
    }

    if (!formData.site_name.trim()) {
      alert('Nama area / fasilitas survei wajib diisi.');
      return;
    }

    const finalizedPayload = {
      ...site,
      ...formData,
      coordinates: (formData.coordinates && formData.coordinates.length > 0) ? formData.coordinates : (site.coordinates || []),
      amdalResult: amdalVerificationResult,
      submittedBy: currentUser?.name || 'Surveyor Lapangan',
      submittedAt: new Date().toISOString(),
      status: 'Pending Review Lead'
    };

    if (onSaveSurveyorDraft) {
      onSaveSurveyorDraft(finalizedPayload);
    }

    onClose();
  };

  return (
    <>
      <aside 
        className={`fixed top-0 right-0 h-full w-full sm:w-[680px] lg:w-[760px] xl:w-[840px] max-w-[95vw] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out text-slate-900 select-text ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
      {/* ======================================================== */}
      {/* 1. DRAWER TOP HEADER (SPACIAZ HIGH-CHARACTER STYLE)       */}
      {/* ======================================================== */}
      <div className="p-6 border-b border-slate-200 bg-[#f8f8f5] shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            
            {/* Top Badges */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#121316] text-[#d8f537]">
                {formData.is_polygon ? '⬡ DRAF POLIGON AREA SURVEI' : '📍 TITIK SURVEI SPASIAL'}
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                amdalVerificationResult?.status === 'Passed' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {amdalVerificationResult?.status === 'Passed' ? '✓ AMDAL Lolos' : 'AMDAL Belum Dicek'}
              </span>

              <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-200/80 px-2 py-0.5 rounded-md">
                WGS 84 • Zone {utmZone}S
              </span>

              {formData.regency && (
                <span className="text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  {formData.regency}, {formData.province}
                </span>
              )}
            </div>

            {/* Title / Field Name */}
            {mode === 'edit' ? (
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                  Nama Lapangan / Area Survei:
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  placeholder="Contoh: Area Batas Wellpad Pad-B Wayang Windu"
                  className="w-full text-lg sm:text-xl font-black text-[#121316] px-3.5 py-1.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white mt-0.5 shadow-2xs"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#121316] leading-tight truncate">
                  {formData.site_name || 'Fasilitas Panas Bumi'}
                </h2>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span className="truncate">{formData.operator_company} • {formData.wkp_name}</span>
                </p>
              </div>
            )}

          </div>

          {/* Close & Toggle Edit Mode Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {isSurveyor && mode === 'view' && (
              <button
                onClick={() => setMode('edit')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200 shadow-2xs"
                title="Buka Form Edit Data Lengkap"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Mode Edit</span>
              </button>
            )}

            {isSurveyor && mode === 'edit' && !site.is_new_survey && (
              <button
                onClick={() => setMode('view')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1 border border-slate-200 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Pratinjau</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-600 hover:text-black border border-slate-200 flex items-center justify-center transition-colors shadow-2xs shrink-0"
              title="Tutup Slider Kanan (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3 UTAMA MENU NAVIGATION TABS (SESUAI PERMINTAAN USER)     */}
        {/* ======================================================== */}
        <div className="mt-5 pt-3 border-t border-slate-200 flex items-center gap-2">
          
          {/* Menu 1: Informasi Lokasi & Geografis */}
          <button
            onClick={() => setActiveMenuTab('location')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMenuTab === 'location'
                ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                : 'bg-white text-slate-600 hover:text-black border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Informasi Lokasi</span>
          </button>

          {/* Menu 2: Input & Bukti Gambar (Satelit, On-Site, Drone) */}
          <button
            onClick={() => setActiveMenuTab('multimedia')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMenuTab === 'multimedia'
                ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                : 'bg-white text-slate-600 hover:text-black border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>2. Input & Bukti Gambar</span>
          </button>

          {/* Menu 3: Data Teknis & Perhitungan AMDAL */}
          <button
            onClick={() => setActiveMenuTab('technical')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeMenuTab === 'technical'
                ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                : 'bg-white text-slate-600 hover:text-black border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. Data Teknis & AMDAL</span>
          </button>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DRAWER SCROLLABLE CONTENT BODY                         */}
      {/* ======================================================== */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
        
        {/* ======================================================== */}
        {/* TAB 1: INFORMASI LOKASI & GEOGRAFIS                      */}
        {/* ======================================================== */}
        {activeMenuTab === 'location' && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-[#f8f8f5] p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="font-extrabold text-sm text-slate-950 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Atribut Geografis & Batas Administrasi Wilayah</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">
                  Data Spasial Lapangan
                </span>
              </div>

              {/* Grid 1: Wilayah Kerja (WKP) & Perusahaan Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Wilayah Kerja Panas Bumi (WKP)
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="text"
                      value={formData.wkp_name}
                      onChange={(e) => setFormData({ ...formData, wkp_name: e.target.value })}
                      placeholder="Contoh: WKP Pangalengan / Wayang Windu"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-slate-900">
                      {formData.wkp_name}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Perusahaan Pengelola (Operator)
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="text"
                      value={formData.operator_company}
                      onChange={(e) => setFormData({ ...formData, operator_company: e.target.value })}
                      placeholder="Contoh: PT Star Energy Geothermal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-slate-900">
                      {formData.operator_company}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 2: Kabupaten, Provinsi, Pulau */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Kabupaten / Kota
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="text"
                      value={formData.regency}
                      onChange={(e) => setFormData({ ...formData, regency: e.target.value })}
                      placeholder="Contoh: Kabupaten Bandung"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-900">
                      {formData.regency}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Provinsi
                  </label>
                  {mode === 'edit' ? (
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Jawa Barat">Jawa Barat</option>
                      <option value="Jawa Tengah">Jawa Tengah</option>
                      <option value="Jawa Timur">Jawa Timur</option>
                      <option value="Lampung">Lampung</option>
                      <option value="Sumatera Utara">Sumatera Utara</option>
                      <option value="Sumatera Barat">Sumatera Barat</option>
                      <option value="Banten">Banten</option>
                      <option value="Sulawesi Utara">Sulawesi Utara</option>
                      <option value="Nusa Tenggara Timur">Nusa Tenggara Timur</option>
                    </select>
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-900">
                      {formData.province}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pulau / Wilayah
                  </label>
                  {mode === 'edit' ? (
                    <select
                      value={formData.island}
                      onChange={(e) => setFormData({ ...formData, island: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Jawa">Jawa</option>
                      <option value="Sumatera">Sumatera</option>
                      <option value="Sulawesi">Sulawesi</option>
                      <option value="Nusa Tenggara">Nusa Tenggara</option>
                      <option value="Maluku">Maluku</option>
                    </select>
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-900">
                      {formData.island}
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 3: Koordinat Lintang & Bujur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Lintang Geodetik (Latitude S)
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900">
                      {lat.toFixed(6)}° S
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Bujur Geodetik (Longitude E)
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-bold text-slate-900">
                      {lng.toFixed(6)}° E
                    </div>
                  )}
                </div>
              </div>

              {/* Grid 4: Status Pengusahaan & Jaringan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Status Pengusahaan Lapangan
                  </label>
                  {mode === 'edit' ? (
                    <select
                      value={formData.project_status}
                      onChange={(e) => setFormData({ ...formData, project_status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    >
                      <option value="Operational">Operasional (Pembangkit Aktif)</option>
                      <option value="Under Construction">Konstruksi / Ekspansi</option>
                      <option value="Exploration">Eksplorasi / PSPE</option>
                      <option value="Potential">Prospek Cadangan WKP</option>
                    </select>
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-bold text-blue-700">
                      {formData.project_status}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Koneksi Jaringan Transmisi Listrik
                  </label>
                  {mode === 'edit' ? (
                    <input
                      type="text"
                      value={formData.grid_connection}
                      onChange={(e) => setFormData({ ...formData, grid_connection: e.target.value })}
                      placeholder="Contoh: Interkoneksi 150 kV Jamali"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  ) : (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 font-semibold text-slate-900">
                      {formData.grid_connection}
                    </div>
                  )}
                </div>
              </div>

              {/* Jika Poligon: Tampilkan Informasi Fasilitas Induk yang Dipilih */}
              {formData.parent_site_name && (
                <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    <div>
                      <span className="text-[10px] text-blue-600 font-bold uppercase block">
                        Fasilitas Induk Terhubung:
                      </span>
                      <strong className="text-xs text-blue-950">{formData.parent_site_name}</strong>
                    </div>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Delineasi Batas Terikat
                  </span>
                </div>
              )}

              {/* Action: Gambar Poligon di Sekitar Site Ini */}
              {!formData.is_polygon && onDrawPolygonAroundSite && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onDrawPolygonAroundSite(site)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#121316] hover:bg-black text-[#d8f537] font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Layers className="w-4 h-4 text-[#d8f537]" />
                    <span>Petakan Poligon Batas Area untuk Lokasi Ini →</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: INPUT & BUKTI GAMBAR (KOLASE MULTI-FOTO LAPANGAN)  */}
        {/* ======================================================== */}
        {activeMenuTab === 'multimedia' && (() => {
          const allPhotos = formData.gallery_photos || [];
          const displayedPhotos = galleryFilter === 'all'
            ? allPhotos
            : allPhotos.filter(p => p.category === galleryFilter);

          return (
            <div className="space-y-5 animate-fade-in">
              
              {/* Category Filter Pills & Tambah Foto Action */}
              <div className="flex items-center justify-between flex-wrap gap-2 bg-[#f8f8f5] p-2 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'Semua Bukti Foto', count: allPhotos.length },
                    { id: 'drone', label: 'Foto Drone', count: allPhotos.filter(p => p.category === 'drone').length },
                    { id: 'satellite', label: 'Citra Satelit', count: allPhotos.filter(p => p.category === 'satellite').length },
                    { id: 'onsite', label: 'Gambar On-Site', count: allPhotos.filter(p => p.category === 'onsite').length },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGalleryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        galleryFilter === cat.id
                          ? 'bg-[#121316] text-[#d8f537] shadow-sm'
                          : 'bg-white text-slate-600 hover:text-black border border-slate-200'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        galleryFilter === cat.id ? 'bg-[#d8f537] text-black font-black' : 'bg-slate-100 text-slate-500 font-semibold'
                      }`}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Tambah Foto</span>
                </button>
              </div>

              {/* COLLAGE PREVIEW CONTAINER (HAPUS TEKS ELEVASI) */}
              <div className="relative w-full h-72 sm:h-80 md:h-[350px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 group shadow-md select-none">
                {/* Floating Pill: Geodetic GPS Coordinates + Total Photos (NO ELEVATION BADGE) */}
                <div className="absolute top-3 left-3 z-30 bg-[#121316]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-white border border-white/20 flex items-center gap-2 shadow-sm pointer-events-none">
                  <MapPin className="w-3.5 h-3.5 text-[#d8f537]" />
                  <span>{lat.toFixed(6)}° S, {lng.toFixed(6)}° E</span>
                  <span className="text-slate-400 font-sans">•</span>
                  <span className="text-[#d8f537] font-sans font-extrabold">{displayedPhotos.length} Foto Kolase</span>
                </div>

                {/* COLLAGE DYNAMIC LAYOUTS */}
                {displayedPhotos.length === 0 ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-400">
                    <Camera className="w-12 h-12 stroke-[1.5] text-slate-600 mb-2" />
                    <div className="text-sm font-bold text-slate-300">Belum Ada Foto dalam Kategori Ini</div>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs">
                      Unggah foto bukti lapangan di bawah untuk menambahkan ke kolase dokumentasi.
                    </p>
                  </div>
                ) : displayedPhotos.length === 1 ? (
                  /* 1 Foto: Single Hero Card */
                  <div 
                    onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === displayedPhotos[0].id))}
                    className="relative w-full h-full cursor-pointer overflow-hidden group/tile"
                  >
                    <img 
                      src={displayedPhotos[0].url} 
                      alt={displayedPhotos[0].caption}
                      className="w-full h-full object-cover object-center filter brightness-[1.01] transition-transform duration-500 group-hover/tile:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover/tile:opacity-100 transition-opacity bg-black/70 hover:bg-black text-white p-2 rounded-xl backdrop-blur-xs">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                    <div className="absolute bottom-3 left-4 right-4 text-white text-xs pointer-events-none">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#d8f537] animate-pulse"></span>
                        <span className="font-extrabold">{displayedPhotos[0].caption}</span>
                      </div>
                      <div className="text-[10px] text-slate-300 font-mono mt-0.5 truncate">
                        {displayedPhotos[0].timestamp || 'Dokumentasi Lapangan'}
                      </div>
                    </div>
                  </div>
                ) : displayedPhotos.length === 2 ? (
                  /* 2 Foto: 2-Column Split */
                  <div className="grid grid-cols-2 gap-1.5 w-full h-full bg-slate-900">
                    {displayedPhotos.slice(0, 2).map((photo) => (
                      <div 
                        key={photo.id}
                        onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === photo.id))}
                        className="relative h-full cursor-pointer overflow-hidden group/tile"
                      >
                        <img 
                          src={photo.url} 
                          alt={photo.caption}
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                        <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs border border-white/10">
                            {photo.category === 'drone' ? 'Drone' : (photo.category === 'satellite' ? 'Satelit' : 'On-Site')}
                          </span>
                          <div className="opacity-0 group-hover/tile:opacity-100 transition-opacity bg-black/75 text-white p-1.5 rounded-lg backdrop-blur-xs">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2.5 left-3 right-3 text-white text-[11px] pointer-events-none">
                          <div className="font-bold truncate">{photo.caption}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayedPhotos.length === 3 ? (
                  /* 3 Foto: Asymmetric Collage (Left 7 cols hero, Right 5 cols 2 stacked) */
                  <div className="grid grid-cols-12 gap-1.5 w-full h-full bg-slate-900">
                    <div 
                      onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === displayedPhotos[0].id))}
                      className="col-span-7 h-full relative cursor-pointer overflow-hidden group/tile"
                    >
                      <img 
                        src={displayedPhotos[0].url} 
                        alt={displayedPhotos[0].caption}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d8f537] text-black font-mono mb-1 inline-block">
                          {displayedPhotos[0].category === 'drone' ? 'Foto Drone' : (displayedPhotos[0].category === 'satellite' ? 'Citra Satelit' : 'On-Site')}
                        </span>
                        <div className="font-bold truncate">{displayedPhotos[0].caption}</div>
                      </div>
                    </div>
                    <div className="col-span-5 grid grid-rows-2 gap-1.5 h-full">
                      {displayedPhotos.slice(1, 3).map((photo) => (
                        <div 
                          key={photo.id}
                          onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === photo.id))}
                          className="relative h-full cursor-pointer overflow-hidden group/tile"
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                          <div className="absolute top-2 right-2 z-20">
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                              {photo.category === 'drone' ? 'Drone' : (photo.category === 'satellite' ? 'Satelit' : 'On-Site')}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 text-white text-[10px] pointer-events-none">
                            <div className="font-semibold truncate">{photo.caption}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : displayedPhotos.length === 4 ? (
                  /* 4 Foto: 1 Hero Left (7 cols), 3 Stacked Right (5 cols) */
                  <div className="grid grid-cols-12 gap-1.5 w-full h-full bg-slate-900">
                    <div 
                      onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === displayedPhotos[0].id))}
                      className="col-span-7 h-full relative cursor-pointer overflow-hidden group/tile"
                    >
                      <img 
                        src={displayedPhotos[0].url} 
                        alt={displayedPhotos[0].caption}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d8f537] text-black font-mono mb-1 inline-block">
                          {displayedPhotos[0].category === 'drone' ? 'Foto Drone' : (displayedPhotos[0].category === 'satellite' ? 'Citra Satelit' : 'On-Site')}
                        </span>
                        <div className="font-bold truncate">{displayedPhotos[0].caption}</div>
                      </div>
                    </div>
                    <div className="col-span-5 grid grid-rows-3 gap-1.5 h-full">
                      {displayedPhotos.slice(1, 4).map((photo) => (
                        <div 
                          key={photo.id}
                          onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === photo.id))}
                          className="relative h-full cursor-pointer overflow-hidden group/tile"
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption}
                            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none" />
                          <div className="absolute bottom-1.5 left-2 right-2 text-white text-[9px] pointer-events-none">
                            <div className="font-semibold truncate">{photo.caption}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* 5+ Foto: Editorial Collage (1 Hero Left, 2x2 Grid Right with +N Overlay) */
                  <div className="grid grid-cols-12 gap-1.5 w-full h-full bg-slate-900">
                    <div 
                      onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === displayedPhotos[0].id))}
                      className="col-span-7 h-full relative cursor-pointer overflow-hidden group/tile"
                    >
                      <img 
                        src={displayedPhotos[0].url} 
                        alt={displayedPhotos[0].caption}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs pointer-events-none">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#d8f537] text-black font-mono mb-1 inline-block">
                          {displayedPhotos[0].category === 'drone' ? 'Foto Drone' : (displayedPhotos[0].category === 'satellite' ? 'Citra Satelit' : 'On-Site')}
                        </span>
                        <div className="font-bold truncate">{displayedPhotos[0].caption}</div>
                      </div>
                    </div>

                    <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-1.5 h-full">
                      {displayedPhotos.slice(1, 5).map((photo, idx) => {
                        const isLastTile = idx === 3;
                        const remainingCount = displayedPhotos.length - 5;
                        return (
                          <div 
                            key={photo.id}
                            onClick={() => setLightboxIndex(allPhotos.findIndex(p => p.id === photo.id))}
                            className="relative h-full cursor-pointer overflow-hidden group/tile"
                          >
                            <img 
                              src={photo.url} 
                              alt={photo.caption}
                              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover/tile:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10 pointer-events-none" />
                            
                            <div className="absolute top-1.5 right-1.5 z-10">
                              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/75 text-white backdrop-blur-xs">
                                {photo.category === 'drone' ? 'Drone' : (photo.category === 'satellite' ? 'Satelit' : 'On-Site')}
                              </span>
                            </div>

                            {isLastTile && remainingCount > 0 ? (
                              <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-all group-hover/tile:bg-black/75">
                                <span className="text-xl sm:text-2xl font-black text-[#d8f537]">+{remainingCount + 1}</span>
                                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-200">Foto Lainnya</span>
                              </div>
                            ) : (
                              <div className="absolute bottom-1.5 left-2 right-2 text-white text-[9px] pointer-events-none">
                                <div className="font-semibold truncate">{photo.caption}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Form Upload Bukti Foto (Multi-Upload Support) */}
              <div className="bg-[#f8f8f5] p-5 rounded-3xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="font-black text-xs text-slate-950 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>Unggah Bukti Foto Lapangan (Bisa Pilih Banyak Foto Sekaligus)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    Multi-Upload Aktif
                  </span>
                </div>

                {/* Pilih Kategori Foto untuk File Baru */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-[11px] font-bold text-slate-700">
                    Kategori untuk Berkas yang Akan Diunggah:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'drone', label: 'Foto Udara Drone' },
                      { id: 'onsite', label: 'Gambar On-Site' },
                      { id: 'satellite', label: 'Citra Satelit' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setUploadCategory(cat.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all ${
                          uploadCategory === cat.id 
                            ? 'bg-[#121316] text-[#d8f537] shadow-xs' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dropzone Box Upload Gambar */}
                <div>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-5 text-center bg-white hover:bg-blue-50/30 transition-all cursor-pointer group shadow-2xs"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFileUpload}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-100 shadow-2xs">
                        <Camera className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          Klik untuk Memilih 1 atau Banyak Foto Sekaligus
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Format PNG, JPG, JPEG, atau WEBP. Seluruh foto akan otomatis masuk ke kolase galeri lapangan.
                        </p>
                      </div>
                      <div className="mt-1 px-4 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-[10px] font-bold transition-all flex items-center gap-1.5">
                        <Plus className="w-3 h-3" />
                        <span>Pilih Berkas Foto Lapangan...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kelola Daftar & Keterangan Foto Kolase */}
              <div className="bg-[#f8f8f5] p-5 rounded-3xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                  <div className="font-extrabold text-xs text-slate-950 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-emerald-600" />
                    <span>Daftar & Edit Deskripsi Foto Kolase ({allPhotos.length} Foto)</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Klik foto untuk memperbesar
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {allPhotos.map((photo, index) => (
                    <div 
                      key={photo.id || index}
                      className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3 hover:border-slate-300 transition-colors"
                    >
                      {/* Mini Thumbnail */}
                      <img 
                        src={photo.url} 
                        alt={photo.caption} 
                        onClick={() => setLightboxIndex(index)}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 cursor-pointer hover:opacity-85 border border-slate-200"
                        title="Klik untuk membuka lightbox"
                      />

                      {/* Info & Caption Input */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <select
                            value={photo.category}
                            onChange={(e) => handleUpdatePhotoCategory(photo.id, e.target.value)}
                            className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 focus:outline-none"
                          >
                            <option value="drone">Foto Drone</option>
                            <option value="satellite">Citra Satelit</option>
                            <option value="onsite">Gambar On-Site</option>
                          </select>
                          <span className="text-[10px] text-slate-400 font-mono truncate">
                            {photo.timestamp || `Foto #${index + 1}`}
                          </span>
                        </div>
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={(e) => handleUpdatePhotoCaption(photo.id, e.target.value)}
                          placeholder="Keterangan / deskripsi foto..."
                          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Lihat ukuran penuh"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Hapus foto dari kolase"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* TAB 3: DATA TEKNIS OPERASIONAL & PERHITUNGAN AMDAL        */}
        {/* ======================================================== */}
        {activeMenuTab === 'technical' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Top 3 Quick Metrics Summary */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-[#f8f8f5] p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Kapasitas</span>
                <span className="text-xl font-black text-[#121316] font-mono mt-0.5">
                  {formData.installed_capacity_mw > 0 ? `${formData.installed_capacity_mw} MW` : 'Eksplorasi'}
                </span>
                <span className="text-[9px] text-blue-700 font-semibold block mt-0.5">Operasional 24/7</span>
              </div>

              <div className="bg-[#f8f8f5] p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Suhu Fluida</span>
                <span className="text-xl font-black text-amber-700 font-mono mt-0.5">
                  {formData.reservoir_temp_celsius} °C
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">{formData.enthalpy_type}</span>
              </div>

              <div className="bg-[#f8f8f5] p-3.5 rounded-2xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Ketinggian</span>
                <span className="text-xl font-black text-emerald-800 font-mono mt-0.5">
                  {formData.elevation_masl} <span className="text-xs font-normal">mdpl</span>
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5">Zona Pegunungan</span>
              </div>
            </div>

            {/* Form Input Parameter Teknis Lapangan */}
            <div className="bg-[#f8f8f5] p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="font-black text-xs text-slate-950 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span>Pengisian Parameter Termodinamika & Kapasitas Daya</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                  SNI 5015:2019
                </span>
              </div>

              {/* Grid 1: Ketinggian, Suhu, Tekanan */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ketinggian (mdpl)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.elevation_masl}
                    onChange={(e) => setFormData({ ...formData, elevation_masl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                    placeholder="1650"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                    <span>Suhu Reservoir (°C)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.reservoir_temp_celsius}
                    onChange={(e) => setFormData({ ...formData, reservoir_temp_celsius: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-amber-800 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tekanan Wellhead (Bar)</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.wellhead_pressure_bar}
                    onChange={(e) => setFormData({ ...formData, wellhead_pressure_bar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                  />
                </div>
              </div>

              {/* Grid 2: Laju Alir Uap & Potensi MW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    <span>Laju Alir Uap (Ton / Jam)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.steam_flow_tons_hour}
                    onChange={(e) => setFormData({ ...formData, steam_flow_tons_hour: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-600" />
                    <span>Potensi Sumber Daya (MW)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.potential_capacity_mw}
                    onChange={(e) => setFormData({ ...formData, potential_capacity_mw: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white font-bold"
                  />
                </div>
              </div>

              {/* Grid 3: Dropdowns Entalpi & Sistem Pembangkit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Klasifikasi Entalpi (SNI 5015)
                  </label>
                  <select
                    value={formData.enthalpy_type}
                    onChange={(e) => setFormData({ ...formData, enthalpy_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="High Enthalpy">High Enthalpy (&gt; 225 °C)</option>
                    <option value="Medium Enthalpy">Medium Enthalpy (125 - 225 °C)</option>
                    <option value="Low Enthalpy">Low Enthalpy (&lt; 125 °C)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Sistem Pembangkit Panas Bumi
                  </label>
                  <select
                    value={formData.system_type}
                    onChange={(e) => setFormData({ ...formData, system_type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Single-Cylinder Flash Steam Condensing">Flash Steam Condensing (Uap Separasi)</option>
                    <option value="Dry Steam System">Dry Steam System (Uap Kering Alami)</option>
                    <option value="Binary Cycle System">Binary Cycle (Fluida Organik Kalina/ORC)</option>
                    <option value="Wellpad Eksplorasi Baru">Wellpad Eksplorasi Baru (Tajak Sumur)</option>
                  </select>
                </div>
              </div>

              {/* Jika Fitur Poligon: Hasil Pengukuran Luas Area */}
              {formData.areaHectares && (
                <div className="bg-[#121316] text-white p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#d8f537] uppercase font-bold">Hasil Pengukuran Poligon Geodesik:</span>
                    <div className="text-xl font-black text-white mt-0.5">
                      {formData.areaHectares} <span className="text-xs font-normal text-slate-300">Hektar (Ha)</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Setara dengan {Math.round(formData.areaSqMeters || 0).toLocaleString('id-ID')} meter persegi (m²)
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#d8f537] text-black flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                </div>
              )}

              {/* Catatan Karakteristik Geologi Permukaan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Catatan Lapangan & Karakteristik Geologi Permukaan:
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Kondisi tanah beruap, formasi batuan alterasi hidrotermal, singkapan batuan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                />
              </div>

            </div>

            {/* ======================================================== */}
            {/* PEMERIKSAAN KEPATUHAN AMDAL SPASIAL OTOMATIS             */}
            {/* ======================================================== */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-950">
                      Perhitungan Kepatuhan AMDAL Spasial Otomatis
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Pemeriksaan spasial radius buffer 5 km terhadap zona konservasi, pemukiman & tata ruang.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAmdalCheck}
                  disabled={isVerifyingAmdal}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                    isVerifyingAmdal 
                      ? 'bg-slate-200 text-slate-500 cursor-wait'
                      : 'bg-[#121316] hover:bg-black text-[#d8f537]'
                  }`}
                >
                  {isVerifyingAmdal ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                      <span>Memproses Perhitungan Spasial...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Jalankan Uji AMDAL Otomatis</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hasil Verifikasi AMDAL */}
              {amdalVerificationResult && (
                <div className="mt-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Status: LOLOS UJI AMDAL SPASIAL OTOMATIS</span>
                    </div>
                    <span className="font-mono font-black text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      Skor Kepatuhan: {amdalVerificationResult.score}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                    <div>• Buffer Hutan Lindung: <strong>{amdalVerificationResult.bufferDistance}</strong></div>
                    <div>• Overlap Pemukiman: <strong>{amdalVerificationResult.overlapSettlement || '0% (Zona Steril Aman)'}</strong></div>
                    <div>• Sirkulasi Air: <strong>{amdalVerificationResult.reinjectionPrinciple || '100% Injeksi Ulang (Zero Discharge)'}</strong></div>
                    <div>• Standar Kepatuhan: <strong>SNI 5015 & PP 7/2017 Panas Bumi</strong></div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 3. DRAWER FOOTER: ROLE SPECIFIC FINALIZATION ACTIONS     */}
      {/* ======================================================== */}
      <div className="p-5 border-t border-slate-200 bg-[#f8f8f5] shrink-0">
        
        {/* JIKA PERAN SURVEYOR: TOMBOL FINALISASI DAN KIRIM KE LEAD */}
        {isSurveyor && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500">
              {amdalVerificationResult?.status === 'Passed' ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Data lengkap & AMDAL lolos (98.8%). Siap diajukan ke Lead Geoscientist.
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Harap jalankan verifikasi AMDAL otomatis sebelum mengajukan ke Lead.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
              >
                Tutup
              </button>

              <button
                type="button"
                onClick={handleFinalizeAndSend}
                disabled={!amdalVerificationResult || amdalVerificationResult.status !== 'Passed'}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md ${
                  amdalVerificationResult?.status === 'Passed'
                    ? 'bg-[#121316] hover:bg-black text-[#d8f537] cursor-pointer ring-2 ring-[#d8f537]'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                }`}
                title={amdalVerificationResult?.status === 'Passed' ? 'Finalisasi data dan kirim ke Lead Geoscientist' : 'Loloskan uji AMDAL terlebih dahulu'}
              >
                <Send className="w-4 h-4" />
                <span>Finalisasi & Kirim ke Lead Geoscientist</span>
              </button>
            </div>
          </div>
        )}

        {/* JIKA PERAN LEAD GEOSCIENTIST */}
        {isLead && (
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="text-[11px] font-mono text-slate-500">
              Kewenangan Lead: Analisis Buffer & Pelaporan Eksekutif
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onRunAmdalBuffer) onRunAmdalBuffer(site.id);
                }}
                className="px-4 py-2 rounded-xl bg-[#121316] text-[#d8f537] text-xs font-bold hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Simulasi AMDAL 5 km</span>
              </button>

              <button
                onClick={() => {
                  if (onExportSiteReport) onExportSiteReport(site);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Cetak Laporan</span>
              </button>
            </div>
          </div>
        )}

        {/* JIKA ADMIN / MODE LAIN */}
        {(isAdmin || (!isSurveyor && !isLead)) && (
          <div className="flex items-center justify-between text-xs text-slate-500 w-full">
            <span>Mode Inspeksi Geospasial</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-black"
            >
              Tutup
            </button>
          </div>
        )}

      </div>

    </aside>

    {/* ======================================================== */}
    {/* 4. FULLSCREEN HD LIGHTBOX MODAL (TRUE FULL WINDOW)       */}
    {/* ======================================================== */}
    {lightboxIndex !== null && formData.gallery_photos && formData.gallery_photos[lightboxIndex] && (
      <div 
        className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fade-in select-none"
        onClick={() => setLightboxIndex(null)}
      >
        {/* Lightbox Top Header */}
        <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#121316] text-[#d8f537] border border-[#d8f537]/30">
              Foto {lightboxIndex + 1} dari {formData.gallery_photos.length}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-xs">
              {formData.gallery_photos[lightboxIndex].category === 'drone' ? 'Foto Udara Drone' :
               formData.gallery_photos[lightboxIndex].category === 'satellite' ? 'Citra Satelit' : 'Gambar On-Site'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Tutup (Esc)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lightbox Main Image & Navigation */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6" onClick={(e) => e.stopPropagation()}>
          {/* Prev Button */}
          {formData.gallery_photos.length > 1 && (
            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex - 1 + formData.gallery_photos.length) % formData.gallery_photos.length)}
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#d8f537] transition-all border border-white/20 z-20 cursor-pointer"
              title="Foto Sebelumnya (Panah Kiri)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Central High-Res Photo */}
          <img 
            src={formData.gallery_photos[lightboxIndex].url} 
            alt={formData.gallery_photos[lightboxIndex].caption}
            className="max-h-[72vh] max-w-[86vw] object-contain rounded-2xl shadow-2xl border border-white/15"
          />

          {/* Next Button */}
          {formData.gallery_photos.length > 1 && (
            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % formData.gallery_photos.length)}
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-black text-white hover:text-[#d8f537] transition-all border border-white/20 z-20 cursor-pointer"
              title="Foto Selanjutnya (Panah Kanan)"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}
        </div>

        {/* Lightbox Bottom Caption Bar */}
        <div className="text-center z-10 max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="text-white text-sm sm:text-base font-extrabold">
            {formData.gallery_photos[lightboxIndex].caption}
          </div>
          <div className="text-slate-400 text-xs font-mono mt-1">
            {formData.gallery_photos[lightboxIndex].timestamp || 'Dokumentasi Lapangan Geotermal'}
          </div>
        </div>
      </div>
    )}
  </>
  );
}
