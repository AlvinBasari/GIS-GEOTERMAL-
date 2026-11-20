import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  LayoutDashboard, 
  Database, 
  Scale, 
  Clock, 
  Download, 
  Users, 
  Compass, 
  GraduationCap, 
  LogOut, 
  PlusCircle, 
  RefreshCw, 
  ChevronRight, 
  Layers, 
  Globe2, 
  Building2,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Search,
  FileCheck,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
  Map as MapIcon,
  Table as TableIcon,
  Ruler,
  CheckSquare,
  Square,
  Award,
  CornerDownLeft
} from 'lucide-react';

import LoginScreen from './components/LoginScreen';
import PublicLandingPage from './components/PublicLandingPage';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import LeafletMap from './components/LeafletMap';
import KeplerMap from './components/KeplerMap';
import SitesTable from './components/SitesTable';
import SiteDetailModal from './components/SiteDetailModal';
import SiteDetailDrawer from './components/SiteDetailDrawer';
import SurveyorFieldModal from './components/SurveyorFieldModal';
import SubSistemSigModal from './components/SubSistemSigModal';
import LeadSupervisionModal from './components/LeadSupervisionModal';
import AddSiteModal from './components/AddSiteModal';
import EditSiteModal from './components/EditSiteModal';
import AcademicDocsModal from './components/AcademicDocsModal';

export default function GeothermalApp() {
  // Navigation & Authentication Modes: 'public' (Landing Page Edukasi Awam) | 'login' | 'app'
  const [appMode, setAppMode] = useState('public');
  const [activeMenu, setActiveMenu] = useState('peta'); // 'peta' | 'dashboard' | 'tabel' | 'amdal' | 'audit' | 'ekspor' | 'users' | 'standar'
  const [mapEngine, setMapEngine] = useState('leaflet'); // 'leaflet' | 'kepler'

  // Current authenticated user (loaded from session or login)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('seg_gis_auth') || sessionStorage.getItem('seg_gis_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || null;
      }
    } catch (e) {
      console.warn('Failed to parse saved auth session:', e);
    }
    return null;
  });

  // Role-Based Layout: 'admin_rail' (Slim Icon Rail) vs 'analyst_top' (Top Command Bar)
  const isInitialAdmin = currentUser?.role === 'Chief GIS Administrator' || currentUser?.email === 'admin@starenergy.co.id';
  const [layoutMode, setLayoutMode] = useState(isInitialAdmin ? 'admin_rail' : 'analyst_top');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Sub-Sistem SIG Modals & Surveyor Tool States
  const [drawingMode, setDrawingMode] = useState('none'); // 'none' | 'polygon' | 'measure'
  const [isSelectingSiteForPolygon, setIsSelectingSiteForPolygon] = useState(false);
  const [targetSiteForPolygon, setTargetSiteForPolygon] = useState(null);
  const [newlySavedPolygonId, setNewlySavedPolygonId] = useState(null);
  const [isSurveyorModalOpen, setIsSurveyorModalOpen] = useState(false);
  const [isSubSistemModalOpen, setIsSubSistemModalOpen] = useState(false);
  const [isSupervisionModalOpen, setIsSupervisionModalOpen] = useState(false);

  // Surveyor Polygons (Manual Polygon Area Mapper) with Persistence
  const [surveyorPolygons, setSurveyorPolygons] = useState(() => {
    try {
      const stored = localStorage.getItem('seg_surveyor_polygons');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'poly-1',
        name: 'Batas Area Wellpad Pad-A PLTP Wayang Windu',
        coordinates: [
          [-7.2065, 107.6285],
          [-7.2065, 107.6320],
          [-7.2095, 107.6320],
          [-7.2095, 107.6285]
        ],
        areaSqMeters: 84500,
        areaHectares: '8.45',
        createdAt: '2026-11-14T10:00:00Z',
        createdBy: 'Siti Rahmawati, M.Sc.',
        status: 'Approved'
      },
      {
        id: 'poly-2',
        name: 'Zona Konservasi Reservoir Salak Unit 1-6',
        coordinates: [
          [-6.7380, 106.6400],
          [-6.7380, 106.6480],
          [-6.7440, 106.6480],
          [-6.7440, 106.6400]
        ],
        areaSqMeters: 241200,
        areaHectares: '24.12',
        createdAt: '2026-11-15T02:30:00Z',
        createdBy: 'Siti Rahmawati, M.Sc.',
        status: 'Pending Review'
      }
    ];
  });

  // Surveyor Draft GPS Manifestation Points with Persistence
  const [surveyorDraftPoints, setSurveyorDraftPoints] = useState(() => {
    try {
      const stored = localStorage.getItem('seg_surveyor_points');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'pt-1',
        name: 'Manifestasi Fumarol Sektor Wayang North-02',
        latitude: -7.2150,
        longitude: 107.6380,
        elevation: 1720,
        temperature: 94.2,
        type: 'Fumarol / Solfatara',
        photoUrl: '/hd_gallery/wayang_windu_pipelines_hd.jpg',
        notes: 'Emisi uap bertekanan tinggi dengan endapan belerang kuat di rekahan batuan.',
        createdAt: '2026-11-15T03:00:00Z',
        status: 'Pending Review'
      },
      {
        id: 'pt-2',
        name: 'Mata Air Panas Cisuren Salak',
        latitude: -6.7450,
        longitude: 106.6520,
        elevation: 1350,
        temperature: 68.5,
        type: 'Mata Air Panas (Hot Spring)',
        photoUrl: '/hd_gallery/pltp_steam_pipeline_5k.jpg',
        notes: 'Debit air panas jernih, pH 7.1 netral, outflow reservoir timur laut.',
        createdAt: '2026-11-14T14:20:00Z',
        status: 'Approved'
      }
    ];
  });

  // Spatial Datasets
  const [sites, setSites] = useState([]);
  const [faults, setFaults] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Drawers
  const [selectedSite, setSelectedSite] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAcademicModalOpen, setIsAcademicModalOpen] = useState(false);

  // Map Filter State
  const [activeFilter, setActiveFilter] = useState('all');
  const [starOnly, setStarOnly] = useState(false);

  // Map Picker State
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickedCoordinates, setPickedCoordinates] = useState(null);

  // Admin Sub-States (Buffer, Audit, Users)
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [bufferResults, setBufferResults] = useState(null);
  const [isCalculatingBuffer, setIsCalculatingBuffer] = useState(false);

  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logSearch, setLogSearch] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  const [userList, setUserList] = useState([]);
  const [importStatus, setImportStatus] = useState(null);
  const [isProcessingImport, setIsProcessingImport] = useState(false);

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToastMessage({ text: msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // 1. Fetch initial geothermal spatial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sitesRes, statsRes, faultsRes] = await Promise.all([
        fetch('/api/geothermal/sites'),
        fetch('/api/geothermal/statistics'),
        fetch('/api/geothermal/fault-lines'),
      ]);

      const sitesData = await sitesRes.json();
      const statsData = await statsRes.json();
      const faultsData = await faultsRes.json();

      if (sitesData.success && sitesData.data) {
        setSites(sitesData.data);
        if (!selectedSiteId && sitesData.data.length > 0) {
          setSelectedSiteId(sitesData.data[0].id);
          runBufferCalculation(sitesData.data[0].id);
        }
      }

      if (statsData.success) {
        setStats(statsData);
      }

      setFaults(faultsData);
    } catch (err) {
      console.error('Error fetching geothermal data:', err);
      showToast('Gagal memuat data dari server.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Admin Logs & Users
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

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success) {
        setUserList(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

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
    fetchData();
    fetchAuditLogs();
    fetchUsers();
  }, []);

  // 3. Auth Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    const roleLower = (user?.role || '').toLowerCase();
    const isAdmin = roleLower.includes('admin') || user?.email === 'admin@starenergy.co.id';
    setLayoutMode(isAdmin ? 'admin_rail' : 'analyst_top');
    setAppMode('app');
    setActiveMenu('peta');
    showToast(`Otentikasi berhasil. Selamat datang, ${user.name}!`);
  };

  const handleLogout = () => {
    localStorage.removeItem('seg_gis_auth');
    sessionStorage.removeItem('seg_gis_auth');
    setCurrentUser(null);
    setAppMode('public');
    showToast('Sesi berakhir. Kembali ke Portal Edukasi Publik.');
  };

  // Role Detection Flags
  const userRoleLower = (currentUser?.role || '').toLowerCase();
  const isChiefAdmin = userRoleLower.includes('admin') || currentUser?.email === 'admin@starenergy.co.id';
  const isSurveyor = userRoleLower.includes('surveyor');
  const isLead = userRoleLower.includes('lead') || userRoleLower.includes('geoscientist');

  const pendingApprovalsCount = 
    surveyorDraftPoints.filter(p => p.status !== 'Approved').length + 
    surveyorPolygons.filter(p => p.status !== 'Approved').length;

  // Surveyor Polygon & Point Handlers
  const handleSavePolygon = (newPoly) => {
    setSurveyorPolygons(prev => {
      const updated = [newPoly, ...prev];
      localStorage.setItem('seg_surveyor_polygons', JSON.stringify(updated));
      return updated;
    });
    showToast(`Poligon area "${newPoly.name}" (${newPoly.areaHectares} Ha) berhasil disimpan ke draft lapangan.`);
  };

  const handleSaveDraftPoint = (newPt) => {
    setSurveyorDraftPoints(prev => {
      const updated = [newPt, ...prev];
      localStorage.setItem('seg_surveyor_points', JSON.stringify(updated));
      return updated;
    });
    showToast(`Titik manifestasi "${newPt.name}" (${newPt.temperature}°C) berhasil diajukan ke Lead Geoscientist.`);
  };

  const handleApprovePolygon = (id) => {
    setSurveyorPolygons(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status: 'Approved' } : p);
      localStorage.setItem('seg_surveyor_polygons', JSON.stringify(updated));
      return updated;
    });
    showToast('Poligon area disetujui & disinkronkan ke layer aktif master peta.');
  };

  const handleRejectPolygon = (id) => {
    setSurveyorPolygons(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('seg_surveyor_polygons', JSON.stringify(updated));
      return updated;
    });
    showToast('Poligon area dikembalikan ke Surveyor dengan catatan.');
  };

  const handleApprovePoint = (id) => {
    setSurveyorDraftPoints(prev => {
      const updated = prev.map(pt => pt.id === id ? { ...pt, status: 'Approved' } : pt);
      localStorage.setItem('seg_surveyor_points', JSON.stringify(updated));
      return updated;
    });
    showToast('Titik manifestasi disetujui & masuk ke database master.');
  };

  const handleRejectPoint = (id) => {
    setSurveyorDraftPoints(prev => {
      const updated = prev.filter(pt => pt.id !== id);
      localStorage.setItem('seg_surveyor_points', JSON.stringify(updated));
      return updated;
    });
    showToast('Titik manifestasi dikembalikan ke Surveyor.');
  };

  // 4. Site Interaction Handlers
  const handleSelectSite = (site) => {
    setSelectedSite(site);
    setIsDetailModalOpen(true);
  };

  const handleOpenEdit = (site) => {
    setEditingSite(site);
  };

  const handleSiteAdded = (newSite) => {
    setSites(prev => [newSite, ...prev]);
    showToast(`Lokasi "${newSite.site_name}" berhasil ditambahkan ke basis data SIG.`);
    fetchData();
  };

  const handleSiteUpdated = (updatedSite) => {
    setSites(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
    if (selectedSite && selectedSite.id === updatedSite.id) {
      setSelectedSite(updatedSite);
    }
    showToast(`Data lapangan "${updatedSite.site_name}" berhasil diperbarui.`);
    fetchData();
  };

  const handleDeleteSite = async (id) => {
    const targetSite = sites.find(s => s.id === id);
    const confirmName = targetSite ? targetSite.site_name : 'lapangan ini';

    if (!window.confirm(`Apakah Anda yakin ingin menghapus data "${confirmName}" dari SIG?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/geothermal/sites/${id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal menghapus');

      setSites(prev => prev.filter(s => s.id !== id));
      if (selectedSite && selectedSite.id === id) {
        setSelectedSite(null);
        setIsDetailModalOpen(false);
      }
      showToast(`Data lapangan berhasil dihapus dari sistem.`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleLocationPicked = (lat, lng) => {
    setPickedCoordinates({ lat, lng });
    setIsPickingLocation(false);

    if (isSurveyor) {
      setSelectedSite({
        id: 'draft-pt-' + Date.now(),
        site_name: `Titik Survei Lapangan #${surveyorDraftPoints.length + 1}`,
        operator_company: 'PT Star Energy Geothermal',
        wkp_name: 'WKP Lapangan Survei',
        latitude: lat,
        longitude: lng,
        elevation_masl: 1650,
        reservoir_temp_celsius: 245,
        wellhead_pressure_bar: 11.8,
        potential_capacity_mw: 150,
        enthalpy_type: 'High Enthalpy',
        system_type: 'Wellpad Eksplorasi Baru',
        notes: 'Titik pengamatan manifestasi termal dan alterasi batuan lapangan.',
        is_polygon: false,
        is_new_survey: true
      });
      setIsDetailModalOpen(true);
      showToast(`Koordinat titik ditentukan: [${lat.toFixed(5)}, ${lng.toFixed(5)}]. Lengkapi data & uji AMDAL di slider kanan.`);
    } else {
      setIsAddModalOpen(true);
      showToast(`Koordinat dipilih: [${lat.toFixed(4)}, ${lng.toFixed(4)}]`);
    }
  };

  const handleSelectSiteForPolygon = (site) => {
    setTargetSiteForPolygon(site);
    setIsSelectingSiteForPolygon(false);
    setDrawingMode('polygon');
    showToast(`🎯 Fasilitas terpilih: "${site.site_name}". Klik di peta untuk menentukan Titik 1.`);
  };

  const handleCancelSelectSiteForPolygon = () => {
    setIsSelectingSiteForPolygon(false);
    setTargetSiteForPolygon(null);
    setDrawingMode('none');
    showToast('Pemetaan poligon dibatalkan.');
  };

  const handleFinishPolygonDrawing = (polyData) => {
    const anchor = polyData.targetSite || targetSiteForPolygon;
    setSelectedSite({
      id: 'draft-poly-' + Date.now(),
      site_name: polyData.site_name || (anchor ? `Batas Area Poligon - ${anchor.site_name}` : `Area Survei Lapangan #${surveyorPolygons.length + 1}`),
      parent_site_name: anchor?.site_name || '',
      operator_company: anchor?.operator_company || 'PT Star Energy Geothermal',
      wkp_name: anchor?.wkp_name || 'WKP Lapangan Survei',
      province: anchor?.province || 'Jawa Barat',
      regency: anchor?.regency || 'Kabupaten Bandung',
      island: anchor?.island || 'Jawa',
      project_status: anchor?.project_status || 'Operasional',
      latitude: polyData.latitude,
      longitude: polyData.longitude,
      elevation_masl: anchor?.elevation_masl || polyData.elevation_masl || 1650,
      reservoir_temp_celsius: anchor?.reservoir_temp_celsius || 260,
      wellhead_pressure_bar: anchor?.wellhead_pressure_bar || 12.0,
      potential_capacity_mw: anchor?.potential_capacity_mw || 200,
      enthalpy_type: anchor?.enthalpy_type || 'High Enthalpy',
      system_type: anchor?.system_type || 'Single-Cylinder Flash Steam Condensing',
      coordinates: polyData.coordinates,
      areaHectares: polyData.areaHectares,
      areaSqMeters: polyData.areaSqMeters,
      notes: polyData.notes,
      is_polygon: true,
      is_new_survey: true
    });
    setIsDetailModalOpen(true);
    setTargetSiteForPolygon(null);
    setIsSelectingSiteForPolygon(false);
    showToast(`Poligon area ${polyData.areaHectares} Ha terbentuk! Lengkapi data & uji AMDAL di slider kanan.`);
  };

  const handleSelectPolygon = (poly) => {
    // Calculate centroid for polygon inspection
    const coords = poly.coordinates || [];
    let centerLat = -7.2;
    let centerLng = 107.6;
    if (coords.length > 0) {
      centerLat = coords.reduce((sum, p) => sum + (Array.isArray(p) ? p[0] : (p.lat || 0)), 0) / coords.length;
      centerLng = coords.reduce((sum, p) => sum + (Array.isArray(p) ? p[1] : (p.lng || 0)), 0) / coords.length;
    }

    setSelectedSite({
      ...poly,
      id: poly.id,
      site_name: poly.name,
      parent_site_name: poly.parent_site_name || '',
      wkp_name: poly.wkp_name || 'WKP Lapangan Panas Bumi',
      operator_company: poly.operator_company || 'PT Star Energy Geothermal',
      province: poly.province || 'Jawa Barat',
      regency: poly.regency || 'Kabupaten Bandung',
      island: poly.island || 'Jawa',
      latitude: centerLat,
      longitude: centerLng,
      elevation_masl: poly.elevation_masl || 1650,
      reservoir_temp_celsius: poly.reservoir_temp || poly.reservoir_temp_celsius || 260,
      wellhead_pressure_bar: poly.wellhead_pressure_bar || 12.0,
      potential_capacity_mw: poly.potential_capacity_mw || 200,
      enthalpy_type: poly.enthalpy_type || 'High Enthalpy',
      system_type: poly.system_type || 'Single-Cylinder Flash Steam Condensing',
      coordinates: poly.coordinates,
      areaHectares: poly.areaHectares,
      areaSqMeters: poly.areaSqMeters,
      drone_photo_url: poly.drone_photo_url,
      satellite_photo_url: poly.satellite_photo_url,
      onsite_photo_url: poly.onsite_photo_url,
      drone_caption: poly.drone_caption,
      satellite_caption: poly.satellite_caption,
      onsite_caption: poly.onsite_caption,
      gallery_photos: poly.gallery_photos || [],
      notes: poly.notes,
      is_polygon: true,
      is_new_survey: false
    });
    setIsDetailModalOpen(true);
  };

  const handleSaveSurveyorDraft = (finalizedPayload) => {
    if (finalizedPayload.is_polygon) {
      const newPoly = {
        id: finalizedPayload.id || ('poly-' + Date.now()),
        name: finalizedPayload.site_name,
        site_name: finalizedPayload.site_name,
        coordinates: finalizedPayload.coordinates,
        areaSqMeters: finalizedPayload.areaSqMeters,
        areaHectares: finalizedPayload.areaHectares,
        elevation_masl: finalizedPayload.elevation_masl,
        reservoir_temp: finalizedPayload.reservoir_temp_celsius,
        reservoir_temp_celsius: finalizedPayload.reservoir_temp_celsius,
        wellhead_pressure_bar: finalizedPayload.wellhead_pressure_bar,
        steam_flow_tons_hour: finalizedPayload.steam_flow_tons_hour,
        potential_capacity_mw: finalizedPayload.potential_capacity_mw,
        enthalpy_type: finalizedPayload.enthalpy_type,
        system_type: finalizedPayload.system_type,
        amdalResult: finalizedPayload.amdalResult,
        notes: finalizedPayload.notes,
        createdBy: currentUser?.name || 'Surveyor Lapangan',
        createdAt: new Date().toISOString(),
        status: 'Pending Review',
        parent_site_name: finalizedPayload.parent_site_name || '',
        wkp_name: finalizedPayload.wkp_name || '',
        operator_company: finalizedPayload.operator_company || '',
        province: finalizedPayload.province || '',
        regency: finalizedPayload.regency || '',
        island: finalizedPayload.island || '',
        gallery_photos: finalizedPayload.gallery_photos || [],
        drone_photo_url: finalizedPayload.drone_photo_url,
        satellite_photo_url: finalizedPayload.satellite_photo_url,
        onsite_photo_url: finalizedPayload.onsite_photo_url,
        drone_caption: finalizedPayload.drone_caption,
        satellite_caption: finalizedPayload.satellite_caption,
        onsite_caption: finalizedPayload.onsite_caption,
      };

      setSurveyorPolygons(prev => {
        const existingIdx = prev.findIndex(p => p.id === newPoly.id);
        let updated;
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = newPoly;
        } else {
          updated = [newPoly, ...prev];
        }
        localStorage.setItem('seg_surveyor_polygons', JSON.stringify(updated));
        return updated;
      });

      // Set newly saved polygon ID to auto-focus and highlight on the map
      setNewlySavedPolygonId(newPoly.id);
      showToast(`✅ Poligon area "${newPoly.name}" (${newPoly.areaHectares} Ha) berhasil disimpan dan tampil di peta!`);
    } else {
      const newPt = {
        id: finalizedPayload.id || ('pt-' + Date.now()),
        name: finalizedPayload.site_name,
        latitude: finalizedPayload.latitude,
        longitude: finalizedPayload.longitude,
        elevation: finalizedPayload.elevation_masl,
        temperature: finalizedPayload.reservoir_temp_celsius,
        type: finalizedPayload.system_type || 'Titik Manifestasi Lapangan',
        amdalResult: finalizedPayload.amdalResult,
        notes: finalizedPayload.notes,
        gallery_photos: finalizedPayload.gallery_photos || [],
        photoUrl: '/hd_gallery/pltp_steam_pipeline_5k.jpg',
        createdBy: currentUser?.name || 'Surveyor Lapangan',
        createdAt: new Date().toISOString(),
        status: 'Pending Review'
      };
      setSurveyorDraftPoints(prev => {
        const updated = [newPt, ...prev];
        localStorage.setItem('seg_surveyor_points', JSON.stringify(updated));
        return updated;
      });
      showToast(`✅ Titik survei "${newPt.name}" & hasil uji AMDAL berhasil diajukan ke Lead Geoscientist.`);
    }
    setIsDetailModalOpen(false);
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

  const summary = stats?.summary || {};
  const starData = summary.star_energy || {};

  // Filter audit logs
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      (log.site_name && log.site_name.toLowerCase().includes(logSearch.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(logSearch.toLowerCase())) ||
      (log.user_name && log.user_name.toLowerCase().includes(logSearch.toLowerCase()));
    
    const matchesAction = selectedActionFilter === 'ALL' || log.action_type === selectedActionFilter;
    return matchesSearch && matchesAction;
  });

  // ==========================================================
  // VIEW MODE 1: LANDING PAGE EDUKASI PUBLIK (TANPA PERLU LOGIN)
  // Menampilkan edukasi awam seputar panas bumi, lokasi PLTP, dan peta
  // ==========================================================
  if (appMode === 'public') {
    return (
      <>
        <PublicLandingPage
          sites={sites}
          onOpenInternalPortal={() => setAppMode('login')}
          onSelectSite={(site) => {
            setSelectedSite(site);
            setIsDetailModalOpen(true);
          }}
        />

        {/* Modal Detail Informasi Lapangan Saat Diklik dari Publik */}
        {isDetailModalOpen && selectedSite && (
          <SiteDetailModal
            site={selectedSite}
            onClose={() => setIsDetailModalOpen(false)}
            onOpenEdit={handleOpenEdit}
          />
        )}
      </>
    );
  }

  // ==========================================================
  // VIEW MODE 2: LOGIN SCREEN PETUGAS / ANALIS INTERNAL
  // ==========================================================
  if (appMode === 'login') {
    return (
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onGuestAccess={() => {
          setAppMode('app');
          setActiveMenu('peta');
        }}
        onBackToPublic={() => setAppMode('public')}
      />
    );
  }

  // ==========================================================
  // VIEW MODE 2: DUAL LAYOUT ENTERPRISE PORTAL
  // A. ADMIN: Sidebar Slim Icon Rail (64px -> 240px)
  // B. ANALIST: Top Command Bar (100% Full Canvas Workspace)
  // Palet: UNIFIED SWISS MINIMALIST LIGHT (Putih Bersih & Off-White, Aksen Biru)
  // ==========================================================
  return (
    <div className="flex h-screen w-screen bg-[#fafafa] text-slate-900 overflow-hidden font-sans select-none antialiased">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-2 border transition-all ${
          toastMessage.type === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-white text-blue-700 border-blue-200 shadow-blue-50'
        }`}>
          <span>{toastMessage.type === 'error' ? '⚠️' : '✓'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ADMIN MODE: SIDEBAR DENGAN SLIM ICON RAIL (64px / 240px) */}
      {/* (Warna: Seragam Putih Bersih & Slate Halus, Bukan Hitam Pekat) */}
      {/* ======================================================== */}
      {layoutMode === 'admin_rail' && (
        <aside className={`${isSidebarExpanded ? 'w-60' : 'w-16'} bg-white text-slate-800 flex flex-col justify-between shrink-0 z-30 border-r border-slate-200 transition-all duration-200 ease-in-out`}>
          
          <div>
            {/* Header: Logo Star Energy */}
            <div className={`h-14 border-b border-slate-200 flex items-center ${isSidebarExpanded ? 'px-4 gap-3' : 'justify-center'}`}>
              <img 
                src="/logo_star_energy.png" 
                alt="Star Energy" 
                className="h-7 w-auto object-contain" 
              />
              {isSidebarExpanded && (
                <div className="overflow-hidden whitespace-nowrap">
                  <div className="font-extrabold text-xs text-slate-950 tracking-tight leading-none">
                    STAR ENERGY
                  </div>
                  <div className="text-[10px] text-blue-700 font-mono font-bold">
                    ADMIN GIS CONSOLE
                  </div>
                </div>
              )}
            </div>

            {/* Admin Menu Items */}
            <nav className="p-2 space-y-1 text-xs">
              
              {/* Peta Spasial */}
              <button
                onClick={() => setActiveMenu('peta')}
                title="Peta Spasial GIS"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'peta'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Peta Spasial GIS</span>}
              </button>

              {/* Dashboard */}
              <button
                onClick={() => setActiveMenu('dashboard')}
                title="Dashboard Eksekutif"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'dashboard'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Dashboard Ringkasan</span>}
              </button>

              {/* Direktori WKP */}
              <button
                onClick={() => setActiveMenu('tabel')}
                title="Direktori 27 WKP"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'tabel'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Database className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Direktori 27 WKP</span>}
              </button>

              {/* Kalkulator AMDAL */}
              <button
                onClick={() => setActiveMenu('amdal')}
                title="Kalkulator Buffer AMDAL"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'amdal'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Scale className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Kalkulator AMDAL</span>}
              </button>

              <div className="my-2 border-t border-slate-100"></div>

              {/* Audit Trail */}
              <button
                onClick={() => setActiveMenu('audit')}
                title="Audit Trail Spasial"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'audit'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Audit Trail Spasial</span>}
              </button>

              {/* Ekspor & Validasi */}
              <button
                onClick={() => setActiveMenu('ekspor')}
                title="Ekspor & Validasi Data"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'ekspor'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Download className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Ekspor Data Spasial</span>}
              </button>

              {/* Personil SIG */}
              <button
                onClick={() => setActiveMenu('users')}
                title="Personil SIG & Akses"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'users'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Personil SIG & Akses</span>}
              </button>

              {/* Standar Geodetik */}
              <button
                onClick={() => setActiveMenu('standar')}
                title="Standar Geodetik (CRS)"
                className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2 rounded-lg' : 'justify-center py-2.5 rounded-lg'} text-xs font-semibold transition-colors ${
                  activeMenu === 'standar'
                    ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-4 h-4 text-slate-500 shrink-0" />
                {isSidebarExpanded && <span className="truncate">Standar Geodetik (CRS)</span>}
              </button>

            </nav>
          </div>

          {/* Sidebar Footer: Toggle Expand + Docs + Logout */}
          <div className="p-2 border-t border-slate-200 space-y-1">
            
            {/* Toggle Rail Button */}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              title={isSidebarExpanded ? 'Kecilkan Sidebar ke Slim Rail (64px)' : 'Perluas Sidebar'}
              className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-lg text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors`}
            >
              {isSidebarExpanded ? (
                <>
                  <PanelLeftClose className="w-4 h-4" />
                  <span>Kecilkan Rail (64px)</span>
                </>
              ) : (
                <PanelLeftOpen className="w-4 h-4" />
              )}
            </button>

            {/* Sub Sistem SIG Architecture */}
            <button
              onClick={() => setIsSubSistemModalOpen(true)}
              title="Arsitektur 4 Sub Sistem SIG"
              className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-lg text-xs text-[#121316] bg-[#d8f537]/30 hover:bg-[#d8f537] transition-colors font-bold`}
            >
              <Award className="w-4 h-4 text-black shrink-0" />
              {isSidebarExpanded && <span className="truncate">Sub Sistem SIG</span>}
            </button>

            {/* Academic Docs */}
            <button
              onClick={() => setIsAcademicModalOpen(true)}
              title="Dokumen Akademis SIG"
              className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-lg text-xs text-blue-700 hover:bg-blue-50 transition-colors font-semibold`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
              {isSidebarExpanded && <span className="truncate">Dokumen Akademis</span>}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              title="Keluar (Logout)"
              className={`w-full flex items-center ${isSidebarExpanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-lg text-xs text-slate-600 hover:text-red-700 hover:bg-red-50 transition-colors`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {isSidebarExpanded && <span className="truncate">Keluar</span>}
            </button>

          </div>

        </aside>
      )}

      {/* ======================================================== */}
      {/* 2. RIGHT WORKSPACE (CANVAS + HEADER)                     */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#fafafa] overflow-hidden">
        
        {/* HEADER A-1: JIKA PERAN SURVEYOR (FIELD EXPLORATION WORKSTATION) */}
        {layoutMode === 'analyst_top' && isSurveyor && (
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 z-20">
            {/* Logo & Subtitle */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo_star_energy.png" 
                alt="Star Energy" 
                className="h-8 w-auto object-contain" 
              />
              <div className="border-l border-slate-200 pl-3">
                <div className="font-extrabold text-xs text-slate-950 tracking-tight leading-none">
                  STAR ENERGY GEOTHERMAL
                </div>
                <div className="text-[10px] text-amber-600 font-mono font-bold mt-0.5">
                  FIELD EXPLORATION WORKSTATION • SUB SISTEM INPUT
                </div>
              </div>
            </div>

            {/* Surveyor Field Measurement Tools */}
            <div className="flex items-center gap-2">
              {/* Tool 1: Ruler Tool */}
              <button
                onClick={() => {
                  setActiveMenu('peta');
                  setDrawingMode(drawingMode === 'measure' ? 'none' : 'measure');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  drawingMode === 'measure'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200 ring-2 ring-sky-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
                title="Alat Ukur Jarak Lintasan Pipa / Titik (Ruler)"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{drawingMode === 'measure' ? 'Mode Ukur Aktif' : 'Ukur Jarak (Ruler)'}</span>
              </button>

              {/* Tool 2: Manual Polygon Area Mapper */}
              <button
                onClick={() => {
                  setActiveMenu('peta');
                  if (drawingMode === 'polygon' || isSelectingSiteForPolygon) {
                    setDrawingMode('none');
                    setIsSelectingSiteForPolygon(false);
                    setTargetSiteForPolygon(null);
                    showToast('Mode gambar poligon dibatalkan.');
                  } else {
                    // Always prompt Step 1 to select the target site on map cleanly
                    setIsSelectingSiteForPolygon(true);
                    setDrawingMode('none');
                    setTargetSiteForPolygon(null);
                    showToast('👉 Silakan klik salah satu titik penanda lokasi pembangkit di peta terlebih dahulu.');
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  drawingMode === 'polygon' || isSelectingSiteForPolygon
                    ? 'bg-[#121316] text-[#d8f537] shadow-md ring-2 ring-[#d8f537]'
                    : 'bg-[#d8f537] hover:bg-[#c9e62f] text-black border border-black/10'
                }`}
                title="Pilih lokasi fasilitas dan gambar poligon batas area (Ha)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {isSelectingSiteForPolygon 
                    ? 'Pilih Titik di Peta...' 
                    : (drawingMode === 'polygon' ? 'Mode Gambar Aktif' : 'Gambar Poligon Area')}
                </span>
              </button>

              {/* Tool 3: Plot GPS Point */}
              <button
                onClick={() => {
                  setActiveMenu('peta');
                  setIsPickingLocation(true);
                  showToast('👉 Klik di peta untuk menentukan koordinat titik survei lapangan.');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                  isPickingLocation 
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title="Klik di peta untuk menentukan koordinat dan melengkapi data teknis di slider kanan"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isPickingLocation ? 'Klik Lokasi di Peta...' : 'Plot Titik GPS Baru'}</span>
              </button>

              {/* Tool 4: View Drafts */}
              <button
                onClick={() => setIsSupervisionModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
                title="Lihat Daftar Draft Lapangan yang Diajukan"
              >
                <span>Draft Saya</span>
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                  {surveyorDraftPoints.length + surveyorPolygons.length}
                </span>
              </button>

              {/* Sub Sistem SIG Architecture Guide */}
              <button
                onClick={() => setIsSubSistemModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121316] text-[#d8f537] text-xs font-bold transition-colors hover:bg-black"
                title="Lihat Diagram 4 Sub Sistem SIG"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Alur Sub Sistem SIG</span>
              </button>
            </div>

            {/* Right Tools & User Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">
                    {currentUser?.name || 'Surveyor Lapangan'}
                  </div>
                  <div className="text-[10px] text-amber-700 font-mono mt-0.5 font-bold">
                    GIS Field Surveyor
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* HEADER A-2: JIKA PERAN LEAD GEOSCIENTIST (SUPERVISORY & ANALYSIS CONSOLE) */}
        {layoutMode === 'analyst_top' && !isSurveyor && (
          <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 z-20">
            {/* Logo & Subtitle */}
            <div className="flex items-center gap-3">
              <img 
                src="/logo_star_energy.png" 
                alt="Star Energy" 
                className="h-8 w-auto object-contain" 
              />
              <div className="border-l border-slate-200 pl-3">
                <div className="font-extrabold text-xs text-slate-950 tracking-tight leading-none">
                  STAR ENERGY GEOTHERMAL
                </div>
                <div className="text-[10px] text-blue-700 font-mono font-bold mt-0.5">
                  SUPERVISORY & GEOSCIENCE CONSOLE • SUB SISTEM ANALISIS
                </div>
              </div>
            </div>

            {/* Horizontal Nav Tabs */}
            <nav className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveMenu('peta')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeMenu === 'peta'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Peta Geologi & Sesar</span>
              </button>

              {/* Approval Queue for Lead */}
              <button
                onClick={() => setIsSupervisionModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
                title="Verifikasi Temuan Lapangan dari Surveyor"
              >
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Verifikasi Lapangan</span>
                {pendingApprovalsCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveMenu('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeMenu === 'dashboard'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard Potensi</span>
              </button>

              <button
                onClick={() => setActiveMenu('amdal')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeMenu === 'amdal'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Kalkulator AMDAL</span>
              </button>

              <button
                onClick={() => setActiveMenu('tabel')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeMenu === 'tabel'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Direktori 27 WKP</span>
              </button>

              {/* Sub Sistem SIG Button */}
              <button
                onClick={() => setIsSubSistemModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#121316] bg-[#d8f537] hover:bg-[#c9e62f] transition-colors"
                title="Lihat Arsitektur 4 Sub Sistem SIG"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Alur Sub Sistem SIG</span>
              </button>
            </nav>

            {/* Right Tools & User Info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">
                    {currentUser?.name || 'Dr. Budi Santoso, M.T.'}
                  </div>
                  <div className="text-[10px] text-blue-700 font-mono mt-0.5 font-bold">
                    Lead Exploration Geoscientist
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* HEADER B: JIKA DALAM MODE ADMIN (ADMIN CONSOLE HEADER) */}
        {layoutMode === 'admin_rail' && (
          <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 z-20">
            
            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                ADMIN CONSOLE
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
                {activeMenu === 'peta' && 'Peta Spasial Geospasial Panas Bumi'}
                {activeMenu === 'dashboard' && 'Dashboard Eksekutif Korporat'}
                {activeMenu === 'tabel' && 'Direktori 27 Lapangan & Prospek WKP'}
                {activeMenu === 'amdal' && 'Kalkulator Buffer Kawasan Konservasi & AMDAL'}
                {activeMenu === 'audit' && 'Audit Trail Geospasial Sistem'}
                {activeMenu === 'ekspor' && 'Pusat Ekspor & Validasi Berkas Spasial'}
                {activeMenu === 'users' && 'Manajemen Personil & Otorisasi SIG'}
                {activeMenu === 'standar' && 'Spesifikasi Sistem Referensi Koordinat'}
              </h1>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-3">
              
              {/* If in Map View: Sub-engine switcher (Leaflet 2D vs Kepler.gl 3D) */}
              {activeMenu === 'peta' && (
                <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setMapEngine('leaflet')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      mapEngine === 'leaflet'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Leaflet 2D</span>
                  </button>

                  <button
                    onClick={() => setMapEngine('kepler')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                      mapEngine === 'kepler'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kepler.gl 3D</span>
                  </button>
                </div>
              )}

              {/* Corporate Summary Pill */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono">
                <span className="text-slate-500">Star Energy:</span>
                <span className="text-blue-600 font-extrabold">{starData.operating_mw || 882.0} MW</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-700 font-bold">{starData.market_share_percent || 45.69}%</span>
              </div>

              {/* Switch to Analyst Top Command */}
              <button
                onClick={() => setLayoutMode('analyst_top')}
                title="Beralih ke Tampilan Analis (Top Command Bar)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xl:inline">Mode Top Command</span>
              </button>

              {/* Sync Data Button */}
              <button
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors disabled:opacity-50"
                title="Sinkronisasi Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              {/* Add Site Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span className="hidden sm:inline">Input Titik</span>
              </button>

            </div>

          </header>
        )}

        {/* ======================================================== */}
        {/* WORKSPACE CONTENT BODY: CRISP WHITE, BLACK & BLUE        */}
        {/* ======================================================== */}
        <main className="flex-1 relative overflow-auto">
          
          {/* MENU 1: PETA SPASIAL GIS ("PETA JADI MENU NYA SAJA") */}
          {activeMenu === 'peta' && (
            <div className="w-full h-full relative">
              {mapEngine === 'leaflet' ? (
                <LeafletMap
                  sites={sites}
                  faults={faults}
                  onSelectSite={handleSelectSite}
                  selectedSite={selectedSite}
                  isPickingLocation={isPickingLocation}
                  onLocationPicked={handleLocationPicked}
                  activeFilter={activeFilter}
                  starOnly={starOnly}
                  currentUser={currentUser}
                  surveyorPolygons={surveyorPolygons}
                  onSavePolygon={handleSavePolygon}
                  onFinishPolygonDrawing={handleFinishPolygonDrawing}
                  surveyorDraftPoints={surveyorDraftPoints}
                  drawingMode={drawingMode}
                  setDrawingMode={setDrawingMode}
                  isSelectingSiteForPolygon={isSelectingSiteForPolygon}
                  targetSiteForPolygon={targetSiteForPolygon}
                  onSelectSiteForPolygon={handleSelectSiteForPolygon}
                  onCancelSelectSiteForPolygon={handleCancelSelectSiteForPolygon}
                  onSelectPolygon={handleSelectPolygon}
                  newlySavedPolygonId={newlySavedPolygonId}
                  onOpenNewPointForm={() => {
                    setActiveMenu('peta');
                    setIsPickingLocation(true);
                    showToast('👉 Klik di peta untuk menentukan koordinat titik survei.');
                  }}
                />
              ) : (
                <KeplerMap
                  sites={sites}
                  faults={faults}
                  onSelectSite={handleSelectSite}
                />
              )}
            </div>
          )}

          {/* MENU 2: DASHBOARD EKSEKUTIF */}
          {activeMenu === 'dashboard' && (
            <ExecutiveDashboard
              sites={sites}
              stats={stats}
              onNavigateToMap={() => setActiveMenu('peta')}
              onNavigateToTable={() => setActiveMenu('tabel')}
            />
          )}

          {/* MENU 3: DIREKTORI LAPANGAN TABEL DATA */}
          {activeMenu === 'tabel' && (
            <div className="p-6">
              <SitesTable
                sites={sites}
                onSelectSite={(site) => {
                  setSelectedSite(site);
                  setActiveMenu('peta');
                  setMapEngine('leaflet');
                }}
                onEditSite={handleOpenEdit}
                onDeleteSite={handleDeleteSite}
                onOpenAddModal={() => setIsAddModalOpen(true)}
              />
            </div>
          )}

          {/* MENU 4: KALKULATOR BUFFER AMDAL */}
          {activeMenu === 'amdal' && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    Kalkulator Konflik Spasial Kawasan Konservasi & AMDAL
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Analisis jarak geodesik Haversine terhadap kawasan konservasi nasional sesuai <strong>PP No. 7 Tahun 2017</strong> tentang Pemanfaatan Panas Bumi pada Kawasan Hutan Konservasi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Pilih Lapangan:</span>
                  <select
                    value={selectedSiteId}
                    onChange={(e) => {
                      setSelectedSiteId(e.target.value);
                      runBufferCalculation(e.target.value);
                    }}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
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
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans font-bold">LOKASI TITIK PUSAT:</span>
                    <span className="font-extrabold text-slate-900 text-sm">{bufferResults.site.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans font-bold">OPERATOR KONSESI:</span>
                    <span className="text-slate-700 font-semibold">{bufferResults.site.operator}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans font-bold">KOORDINAT (WGS 84):</span>
                    <span className="text-blue-600 font-bold">{bufferResults.site.latitude.toFixed(4)}°, {bufferResults.site.longitude.toFixed(4)}°</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans font-bold">PROYEKSI:</span>
                    <span className="text-slate-800 font-semibold">EPSG:4326 / UTM</span>
                  </div>
                </div>
              )}

              {/* Conflict Analysis Cards */}
              {isCalculatingBuffer ? (
                <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Menghitung jarak geodesik Haversine...</span>
                </div>
              ) : bufferResults?.analysis ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bufferResults.analysis.map((zone, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {zone.zone_name}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {zone.zone_type}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-lg font-extrabold font-mono text-slate-950">
                            {zone.distance_km} <span className="text-xs font-normal text-slate-500">km</span>
                          </div>
                          <span className="text-[9px] uppercase font-mono text-slate-400 font-bold">Jarak Geodesik</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 uppercase font-bold">Klasifikasi Zona:</span>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                            zone.badge_color === 'red'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : zone.badge_color === 'amber'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {zone.status}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1">
                          <span className="text-slate-800 font-bold block mb-0.5">Dasar Regulasi:</span>
                          {zone.regulation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Regulatory Matrix */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
                <h3 className="font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  Ketentuan Buffer Konservasi Berdasarkan Regulasi Nasional
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-600">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-red-600 mb-1">Zona Inti (&le; 5 km)</div>
                    <p>Memerlukan Izin Pemanfaatan Panas Bumi (IPPB) khusus Menteri LHK sesuai PP 7/2017 & AMDAL Tipe A komprehensif.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-amber-700 mb-1">Zona Penyangga (5 - 10 km)</div>
                    <p>Wajib implementasi Rencana Pemantauan Lingkungan (RPL) terhadap air tanah, flora-fauna, dan rembesan H2S.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-blue-700 mb-1">Zona Koordinasi (&gt; 10 km)</div>
                    <p>Operasional standar sesuai persetujuan teknis Ditjen EBTKE Kementerian ESDM tanpa tumpang tindih kawasan lindung.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MENU 5: AUDIT TRAIL SPASIAL */}
          {activeMenu === 'audit' && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-4 text-slate-900">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Cari berdasarkan nama aset, operator, atau keterangan..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Tipe Aksi:</span>
                  <select
                    value={selectedActionFilter}
                    onChange={(e) => setSelectedActionFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-600"
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
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
                    title="Segarkan Log"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin text-blue-600' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3">Waktu (WIB)</th>
                      <th className="py-3 px-3">Personil SIG</th>
                      <th className="py-3 px-3">Aset Geotermal</th>
                      <th className="py-3 px-3">Tipe Tindakan</th>
                      <th className="py-3 px-3">Detail Perubahan Spasial</th>
                      <th className="py-3 px-3 font-mono">Alamat IP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans text-slate-800">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                          Tidak ada riwayat audit yang cocok dengan kriteria pencarian.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{log.user_name}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{log.user_email}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-950">{log.site_name}</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {log.action_type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-md leading-relaxed text-[11px]">
                            {log.details}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px] whitespace-nowrap">
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

          {/* MENU 6: PUSAT EKSPOR & DATA */}
          {activeMenu === 'ekspor' && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-950 mb-1 flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-600" />
                  Pusat Unduhan & Ekspor Data Spasial Standar
                </h2>
                <p className="text-xs text-slate-600 mb-5">
                  Ekspor seluruh repositori 27 wilayah kerja dan PLTP panas bumi Indonesia ke berbagai format standar Sistem Informasi Geografis.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* GeoJSON */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">GeoJSON (RFC 7946)</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                          WGS 84
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Format standar pertukaran spasial titik koordinat dan metadata SNI 5015:2019 untuk QGIS dan ArcGIS.
                      </p>
                    </div>
                    <a
                      href="/api/admin/export/geojson"
                      download="geothermal_indonesia_wgs84.geojson"
                      className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Unduh GeoJSON (27 Aset)</span>
                    </a>
                  </div>

                  {/* CSV */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">Tabel Atribut CSV</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold border border-slate-300">
                          Tabular
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        Daftar terstruktur seluruh lapangan, kapasitas MW, temperatur fluida, dan koordinat untuk Excel atau Python.
                      </p>
                    </div>
                    <a
                      href="/api/admin/export/csv"
                      download="geothermal_indonesia_attributes.csv"
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Unduh Tabel CSV</span>
                    </a>
                  </div>

                  {/* Kepler.gl JSON */}
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">Konfigurasi Kepler.gl</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                          Deck.gl 3D
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
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
                      className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Unduh Preset Kepler.gl</span>
                    </button>
                  </div>

                </div>
              </div>

              {/* Ingestion & Schema Validator Section */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-950 mb-1 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Validasi & Impor Data Spasial Baru (SNI 5015:2019)
                </h2>
                <p className="text-xs text-slate-600 mb-4">
                  Unggah berkas GeoJSON atau CSV survei lapangan untuk divalidasi integritas koordinat (WGS 84) sebelum diintegrasikan.
                </p>

                <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50 transition-colors">
                  <div className="max-w-md mx-auto">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-xs font-bold text-slate-800">
                      Pilih file GeoJSON (.geojson), CSV (.csv), atau KML
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 mb-4">
                      Sistem akan memvalidasi atribut wajib: site_name, latitude, longitude, installed_capacity_mw, enthalpy_type.
                    </p>

                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm">
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
                  <div className="mt-3 p-3.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-2.5 text-xs text-blue-800 font-semibold">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Memvalidasi struktur skema spasial dan proyeksi EPSG:4326...</span>
                  </div>
                )}

                {importStatus && (
                  <div className="mt-3 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <div className="flex items-center gap-2 text-blue-800 font-extrabold mb-1">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>Validasi Berkas Berhasil: {importStatus.fileName}</span>
                    </div>
                    <p className="text-slate-700 mt-0.5">{importStatus.message}</p>
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-600 font-mono font-medium">
                      <span>Jumlah Entitas: {importStatus.recordsFound} WKP</span>
                      <span>Proyeksi: {importStatus.validCRS}</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* MENU 7: PERSONIL SIG & AKSES */}
          {activeMenu === 'users' && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-950 mb-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Daftar Personil & Hak Akses Sistem Informasi Geografis
                </h2>
                <p className="text-xs text-slate-600">
                  Struktur otorisasi peranan berbasis peran (RBAC) pada sistem GIS Star Energy Geothermal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userList.map((u) => (
                  <div key={u.id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {u.avatar_initials || 'SE'}
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-slate-950">{u.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{u.email}</div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Peran SIG:</span>
                          <span className="font-bold text-slate-900">{u.role}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Divisi:</span>
                          <span className="text-slate-700">{u.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">Status:</span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">
                            Aktif Terverifikasi
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                      ID: SEG-USER-00{u.id}
                    </div>
                  </div>
                ))}
              </div>

              {/* Privilege Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-xs text-slate-900 mb-3">Matriks Otorisasi Hak Akses Spasial</h3>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-600 text-[10px] font-bold uppercase">
                      <th className="py-2.5">Fitur / Modul GIS</th>
                      <th className="py-2.5">Super Admin GIS</th>
                      <th className="py-2.5">Lead Geoscientist</th>
                      <th className="py-2.5">Field Surveyor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 text-[11px]">
                    <tr>
                      <td className="py-2.5 font-medium">Melihat Peta Leaflet & Kepler.gl 3D</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Input & Edit Titik Lokasi Baru</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-slate-500">Draf Saja</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Survei Baru</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Analisis Buffer AMDAL Konservasi</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-slate-400">-</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Ekspor Data Spasial (GeoJSON/CSV)</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-slate-400">-</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Audit Trail & Manajemen Pengguna</td>
                      <td className="py-2.5 text-blue-600 font-bold">✓ Penuh</td>
                      <td className="py-2.5 text-slate-400">-</td>
                      <td className="py-2.5 text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* MENU 8: STANDAR GEODETIK */}
          {activeMenu === 'standar' && (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6 text-slate-900">
              
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-950 mb-1 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  Spesifikasi Geospasial & Landasan Ilmiah Sistem
                </h2>
                <p className="text-xs text-slate-600">
                  Parameter geodetik dan dasar acuan ilmiah yang digunakan dalam sistem GIS ini sesuai ketentuan Badan Informasi Geospasial (BIG) dan Ditjen EBTKE ESDM.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3.5">
                  <div className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue-600" />
                    Sistem Referensi Koordinat (CRS)
                  </div>
                  <div className="space-y-2.5 text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Datum Geodetik:</span>
                      <span className="font-mono font-bold text-slate-950">WGS 84 (EPSG:4326)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Ellipsoid Referensi:</span>
                      <span className="font-mono font-medium">GRS 1980 / WGS 84</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Zona Proyeksi UTM:</span>
                      <span className="font-mono font-medium">Zone 48S, 49S, 50S, 51S, 52S</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Metode Jarak Buffer:</span>
                      <span className="font-mono font-medium">Geodesik Haversine (Great-Circle)</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3.5">
                  <div className="font-extrabold text-slate-950 text-sm flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Lapisan Vektor Geologi & Kebumian
                  </div>
                  <div className="space-y-2.5 text-slate-700">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Patahan / Sesar Aktif:</span>
                      <span className="font-bold text-slate-950">PuSGeN (Kementerian PUPR 2017)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Klasifikasi Panas Bumi:</span>
                      <span className="font-mono font-medium">SNI 5015:2019</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Regulasi Hutan Konservasi:</span>
                      <span className="font-mono font-medium">PP No. 7 / 2017</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Database Engine:</span>
                      <span className="font-mono font-medium">SQLite Spatial ORM + GeoJSON RFC 7946</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </main>

      </div>

      {/* ======================================================== */}
      {/* GLOBAL MODALS & SLIDING DRAWERS                          */}
      {/* ======================================================== */}
      
      {/* 1. SLIDING RIGHT DETAIL DRAWER (Saat Titik Peta Diklik, Sliding Informasi dari Kanan) */}
      <SiteDetailDrawer
        site={selectedSite}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        currentUser={currentUser}
        isEditMode={Boolean(selectedSite?.is_new_survey) || isSurveyor}
        onSaveSurveyorDraft={handleSaveSurveyorDraft}
        onStartMeasureFromSite={(site) => {
          setIsDetailModalOpen(false);
          setActiveMenu('peta');
          setDrawingMode('measure');
          showToast(`Penggaris aktif dari ${site.site_name}. Klik titik berikutnya di peta.`);
        }}
        onDrawPolygonAroundSite={(site) => {
          setIsDetailModalOpen(false);
          setActiveMenu('peta');
          setTargetSiteForPolygon(site);
          setIsSelectingSiteForPolygon(false);
          setDrawingMode('polygon');
          showToast(`🎯 Mode gambar poligon aktif untuk "${site.site_name}". Klik di peta untuk menentukan Titik 1.`);
        }}
        onRunAmdalBuffer={(siteId) => {
          runBufferCalculation(siteId);
          setActiveMenu('amdal');
          showToast('Analisis buffer AMDAL 5 km berhasil dijalankan.');
        }}
        onExportSiteReport={(site) => {
          showToast(`Laporan eksekutif ${site.site_name} siap dicetak.`);
          window.print();
        }}
      />

      {/* 2. SURVEYOR FIELD MEASUREMENT & GPS POINT MODAL (Sub Sistem Input) */}
      <SurveyorFieldModal
        isOpen={isSurveyorModalOpen}
        onClose={() => setIsSurveyorModalOpen(false)}
        onSaveDraft={handleSaveDraftPoint}
        initialCoords={pickedCoordinates}
      />

      {/* 3. SUB SISTEM SIG INTERACTIVE ARCHITECTURE MODAL */}
      <SubSistemSigModal
        isOpen={isSubSistemModalOpen}
        onClose={() => setIsSubSistemModalOpen(false)}
      />

      {/* 4. LEAD GEOSCIENTIST SUPERVISORY & APPROVAL QUEUE MODAL (Sub Sistem Analisis) */}
      <LeadSupervisionModal
        isOpen={isSupervisionModalOpen}
        onClose={() => setIsSupervisionModalOpen(false)}
        currentUser={currentUser}
        surveyorDraftPoints={surveyorDraftPoints}
        surveyorPolygons={surveyorPolygons}
        onApprovePoint={handleApprovePoint}
        onRejectPoint={handleRejectPoint}
        onApprovePolygon={handleApprovePolygon}
        onRejectPolygon={handleRejectPolygon}
        onInspectPolygon={(poly) => {
          setIsSupervisionModalOpen(false);
          setActiveMenu('peta');
          setMapEngine('leaflet');
          handleSelectPolygon(poly);
          setNewlySavedPolygonId(poly.id);
        }}
      />

      {/* Add Site Modal */}
      <AddSiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSiteAdded={handleSiteAdded}
        pickedCoordinates={pickedCoordinates}
        onActivateMapPicker={() => {
          setActiveMenu('peta');
          setMapEngine('leaflet');
          setIsPickingLocation(true);
          showToast('Silakan klik di peta untuk menentukan koordinat lintang & bujur.');
        }}
      />

      {/* Edit Site Modal */}
      <EditSiteModal
        site={editingSite}
        isOpen={Boolean(editingSite)}
        onClose={() => setEditingSite(null)}
        onSiteUpdated={handleSiteUpdated}
      />

      {/* Academic Documentation Modal */}
      <AcademicDocsModal
        isOpen={isAcademicModalOpen}
        onClose={() => setIsAcademicModalOpen(false)}
      />

    </div>
  );
}
