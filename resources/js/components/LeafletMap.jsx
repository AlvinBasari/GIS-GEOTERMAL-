import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Flame, 
  Zap, 
  Activity, 
  ShieldAlert, 
  Crosshair, 
  Maximize2,
  Compass,
  CheckCircle2,
  ExternalLink,
  Ruler,
  Square,
  Plus,
  Trash2,
  Check,
  X,
  Camera,
  CornerDownLeft
} from 'lucide-react';

export default function LeafletMap({ 
  sites, 
  faults, 
  onSelectSite, 
  selectedSite,
  isPickingLocation,
  onLocationPicked,
  activeFilter,
  starOnly,
  currentUser,
  surveyorPolygons = [],
  onSavePolygon,
  surveyorDraftPoints = [],
  drawingMode = 'none', // 'none' | 'polygon' | 'measure'
  setDrawingMode,
  onOpenNewPointForm,
  onFinishPolygonDrawing,
  isSelectingSiteForPolygon = false,
  targetSiteForPolygon = null,
  onSelectSiteForPolygon,
  onCancelSelectSiteForPolygon,
  onSelectPolygon,
  newlySavedPolygonId
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const faultsLayerRef = useRef(null);
  const bufferLayerRef = useRef(null);
  const surveyorPolygonsLayerRef = useRef(null);
  const surveyorDraftsLayerRef = useRef(null);
  const activeDrawLayerRef = useRef(null);
  const targetSiteHaloLayerRef = useRef(null);
  const tempMarkerRef = useRef(null);
  const provincesLayerRef = useRef(null);
  const provinceFeaturesRef = useRef([]);

  const [showSurveyorPolygons, setShowSurveyorPolygons] = useState(true);
  const [showProvinces, setShowProvinces] = useState(true);
  const [selectedProvinceFrame, setSelectedProvinceFrame] = useState('all');
  const [provinceList, setProvinceList] = useState([]);

  // Dynamic references to eliminate stale React closures in Leaflet event listeners
  const isPickingLocationRef = useRef(isPickingLocation);
  const drawingModeRef = useRef(drawingMode);
  const onLocationPickedRef = useRef(onLocationPicked);
  const isSelectingSiteForPolygonRef = useRef(isSelectingSiteForPolygon);
  const targetSiteForPolygonRef = useRef(targetSiteForPolygon);
  const onSelectSiteForPolygonRef = useRef(onSelectSiteForPolygon);
  const onSelectSiteRef = useRef(onSelectSite);

  useEffect(() => {
    isPickingLocationRef.current = isPickingLocation;
  }, [isPickingLocation]);

  useEffect(() => {
    drawingModeRef.current = drawingMode;
  }, [drawingMode]);

  useEffect(() => {
    onLocationPickedRef.current = onLocationPicked;
  }, [onLocationPicked]);

  useEffect(() => {
    isSelectingSiteForPolygonRef.current = isSelectingSiteForPolygon;
  }, [isSelectingSiteForPolygon]);

  useEffect(() => {
    targetSiteForPolygonRef.current = targetSiteForPolygon;
  }, [targetSiteForPolygon]);

  useEffect(() => {
    onSelectSiteForPolygonRef.current = onSelectSiteForPolygon;
  }, [onSelectSiteForPolygon]);

  useEffect(() => {
    onSelectSiteRef.current = onSelectSite;
  }, [onSelectSite]);

  const [activeBasemap, setActiveBasemap] = useState('satellite'); // Default to high-res ESRI satellite
  const [showFaults, setShowFaults] = useState(true);
  const [showBuffers, setShowBuffers] = useState(true);
  const [bufferRadiusKm, setBufferRadiusKm] = useState(10); // 5, 10, or 25 km

  // Interactive In-Progress Drawing States
  const [drawnPoints, setDrawnPoints] = useState([]);
  const [polygonName, setPolygonName] = useState('');
  const [isNamingPolygon, setIsNamingPolygon] = useState(false);

  // Basemap tile definitions
  const basemaps = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP',
      name: 'ESRI Satelit'
    },
    dark: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
      name: 'ESRI Dark Canvas'
    },
    osm: {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      name: 'OpenStreetMap'
    }
  };

  // Helper: Calculate Spherical Geodesic Area in square meters (Shoelace on Sphere)
  const calculateGeodesicArea = (latLngs) => {
    if (latLngs.length < 3) return 0;
    const radius = 6378137; // WGS 84 mean Earth radius in meters
    let total = 0;
    const len = latLngs.length;
    for (let i = 0; i < len; i++) {
      const p1 = latLngs[i];
      const p2 = latLngs[(i + 1) % len];
      const rad1Lat = (p1.lat * Math.PI) / 180;
      const rad2Lat = (p2.lat * Math.PI) / 180;
      const rad1Lng = (p1.lng * Math.PI) / 180;
      const rad2Lng = (p2.lng * Math.PI) / 180;
      total += (rad2Lng - rad1Lng) * (2 + Math.sin(rad1Lat) + Math.sin(rad2Lat));
    }
    return Math.abs((total * radius * radius) / 2.0);
  };

  // Helper: Calculate Total Distance along multi-segment line
  const calculateTotalDistance = (latLngs) => {
    if (latLngs.length < 2) return 0;
    let dist = 0;
    for (let i = 0; i < latLngs.length - 1; i++) {
      dist += L.latLng(latLngs[i]).distanceTo(L.latLng(latLngs[i + 1]));
    }
    return dist; // in meters
  };

  // Current live measurements
  const liveAreaSqMeters = calculateGeodesicArea(drawnPoints);
  const liveAreaHectares = (liveAreaSqMeters / 10000).toFixed(2);
  const liveDistanceMeters = calculateTotalDistance(drawnPoints);
  const liveDistanceKm = (liveDistanceMeters / 1000).toFixed(2);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [-7.02, 107.18], // Center around West Java geothermal cluster
      zoom: 8,
      minZoom: 4,
      maxZoom: 18,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    const tileLayer = L.tileLayer(basemaps[activeBasemap].url, {
      attribution: basemaps[activeBasemap].attribution,
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    mapInstanceRef.current._tileLayer = tileLayer;

    // Create Layer Groups
    provincesLayerRef.current = L.layerGroup().addTo(map);
    faultsLayerRef.current = L.layerGroup().addTo(map);
    bufferLayerRef.current = L.layerGroup().addTo(map);
    surveyorPolygonsLayerRef.current = L.layerGroup().addTo(map);
    surveyorDraftsLayerRef.current = L.layerGroup().addTo(map);
    activeDrawLayerRef.current = L.layerGroup().addTo(map);
    targetSiteHaloLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Map Click Handler for Drawing / Location Picking using latest Ref states
    map.on('click', (e) => {
      // Prevent double click zoom or other unwanted behavior
      if (e.originalEvent) {
        L.DomEvent.stopPropagation(e.originalEvent);
      }

      const { lat, lng } = e.latlng;

      // Location Picking Mode (Plot GPS Point)
      if (isPickingLocationRef.current) {
        if (onLocationPickedRef.current) {
          onLocationPickedRef.current(lat, lng);
        }
        if (tempMarkerRef.current) map.removeLayer(tempMarkerRef.current);
        const pickerIcon = L.divIcon({
          className: 'picker-crosshair-icon',
          html: `
            <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
              <div style="position:absolute; width:100%; height:100%; border:2px dashed #10b981; border-radius:50%; animation:spin 3s linear infinite;"></div>
              <div style="width:8px; height:8px; background:#10b981; border-radius:50%; border:2px solid #ffffff;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        tempMarkerRef.current = L.marker([lat, lng], { icon: pickerIcon }).addTo(map);
        return;
      }

      // Drawing Mode: Add point to in-progress polygon or ruler
      if (drawingModeRef.current === 'polygon' || drawingModeRef.current === 'measure') {
        setDrawnPoints(prev => [...prev, { lat, lng }]);
        return;
      }
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Control Double Click Zoom & Crosshair Cursor during Picking or Drawing
  useEffect(() => {
    if (!mapInstanceRef.current || !mapContainerRef.current) return;
    if (isPickingLocation || drawingMode === 'polygon' || drawingMode === 'measure' || isSelectingSiteForPolygon) {
      mapInstanceRef.current.doubleClickZoom.disable();
      mapContainerRef.current.style.cursor = 'crosshair';
    } else {
      mapInstanceRef.current.doubleClickZoom.enable();
      mapContainerRef.current.style.cursor = '';
    }
  }, [isPickingLocation, drawingMode, isSelectingSiteForPolygon]);

  // Smooth Fly and Focus when a target site is selected for polygon mapping
  useEffect(() => {
    if (targetSiteForPolygon && mapInstanceRef.current) {
      const lat = parseFloat(targetSiteForPolygon.latitude);
      const lng = parseFloat(targetSiteForPolygon.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.2 });
      }
    }
  }, [targetSiteForPolygon]);

  // Render Target Site Reference Halo & Focal Badge when mapping polygon
  useEffect(() => {
    if (!mapInstanceRef.current || !targetSiteHaloLayerRef.current) return;
    targetSiteHaloLayerRef.current.clearLayers();

    if (targetSiteForPolygon && (drawingMode === 'polygon' || isSelectingSiteForPolygon)) {
      const lat = parseFloat(targetSiteForPolygon.latitude);
      const lng = parseFloat(targetSiteForPolygon.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        // Outer pulsing reference halo
        const haloCircle = L.circle([lat, lng], {
          radius: 1200, // 1.2 km reference radius
          color: '#d8f537',
          weight: 2,
          dashArray: '5, 5',
          fillColor: '#d8f537',
          fillOpacity: 0.1
        });

        // Center badge label
        const centerIcon = L.divIcon({
          className: 'target-site-badge',
          html: `
            <div style="
              background: #121316;
              color: #d8f537;
              border: 2px solid #d8f537;
              padding: 3px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 800;
              white-space: nowrap;
              box-shadow: 0 4px 12px rgba(0,0,0,0.5);
              transform: translate(-50%, -150%);
            ">
              🎯 Pusat Fasilitas: ${targetSiteForPolygon.site_name}
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0]
        });
        const centerMarker = L.marker([lat, lng], { icon: centerIcon });

        targetSiteHaloLayerRef.current.addLayer(haloCircle);
        targetSiteHaloLayerRef.current.addLayer(centerMarker);
      }
    }
  }, [targetSiteForPolygon, drawingMode, isSelectingSiteForPolygon]);

  // 2. Handle Basemap Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !mapInstanceRef.current._tileLayer) return;

    mapInstanceRef.current.removeLayer(mapInstanceRef.current._tileLayer);
    const newTileLayer = L.tileLayer(basemaps[activeBasemap].url, {
      attribution: basemaps[activeBasemap].attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    mapInstanceRef.current._tileLayer = newTileLayer;
    newTileLayer.bringToBack();
  }, [activeBasemap]);

  // Helper: Format province name to Title Case & fix standard abbreviations
  const formatProvinceName = (rawName) => {
    if (!rawName) return '';
    const clean = rawName.trim().toUpperCase();
    if (clean === 'PROBANTEN') return 'Banten';
    if (clean === 'NUSATENGGARA BARAT') return 'Nusa Tenggara Barat';
    if (clean === 'DI. ACEH') return 'Aceh';
    if (clean === 'DKI JAKARTA') return 'DKI Jakarta';
    if (clean === 'DAERAH ISTIMEWA YOGYAKARTA') return 'DI Yogyakarta';
    return clean.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
  };

  // 2b. Load & Render Indonesian Provincial Boundaries (Garis Pemisah Antar Provinsi)
  useEffect(() => {
    if (!mapInstanceRef.current || !provincesLayerRef.current) return;
    provincesLayerRef.current.clearLayers();

    if (!showProvinces) return;

    fetch('/geojson/indonesia-provinces.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(geoJsonData => {
        if (!mapInstanceRef.current || !provincesLayerRef.current) return;
        provincesLayerRef.current.clearLayers();

        // Extract list of unique provinces
        const names = [];
        geoJsonData.features.forEach(f => {
          const raw = f.properties?.Propinsi;
          if (raw && !names.includes(raw)) names.push(raw);
        });
        names.sort();
        setProvinceList(names);
        provinceFeaturesRef.current = geoJsonData.features;

        const getProvStyle = (feature) => {
          const isSelected = selectedProvinceFrame === feature?.properties?.Propinsi;
          return {
            color: isSelected ? '#d8f537' : (activeBasemap === 'osm' ? '#0369a1' : '#38bdf8'),
            weight: isSelected ? 3.5 : 1.8,
            opacity: isSelected ? 1 : 0.85,
            dashArray: '6, 6', // Garis putus-putus pembatas administrasi provinsi
            fillColor: isSelected ? '#d8f537' : '#38bdf8',
            fillOpacity: isSelected ? 0.22 : 0.03,
          };
        };

        const geoJsonLayer = L.geoJSON(geoJsonData, {
          style: getProvStyle,
          onEachFeature: (feature, layer) => {
            feature._layer = layer;
            const provName = formatProvinceName(feature.properties?.Propinsi);

            // Count geothermal sites located in this province
            const siteCount = (sites || []).filter(s => {
              const p = (s.province || '').toLowerCase();
              const target = provName.toLowerCase();
              return p.includes(target) || target.includes(p);
            }).length;

            layer.bindTooltip(`
              <div style="font-family: inherit; font-size: 11px; padding: 2px 4px; line-height: 1.4;">
                <div style="color: #0284c7; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                  🏛️ Batas Administrasi Provinsi
                </div>
                <div style="font-weight: 800; font-size: 12px; color: #121316;">
                  ${provName}
                </div>
                ${siteCount > 0 ? `
                  <div style="color: #10b981; font-weight: 700; font-size: 10px; margin-top: 2px;">
                    ⚡ ${siteCount} Fasilitas Panas Bumi Terdata
                  </div>
                ` : ''}
                <div style="color: #64748b; font-size: 9px; margin-top: 1px;">
                  Klik untuk frame / perbesar wilayah provinsi ini
                </div>
              </div>
            `, {
              sticky: true,
              direction: 'auto',
              className: 'prov-boundary-tooltip'
            });

            layer.on({
              mouseover: (e) => {
                const target = e.target;
                target.setStyle({
                  weight: 3,
                  color: '#d8f537',
                  dashArray: null,
                  fillOpacity: 0.18,
                  fillColor: '#d8f537'
                });
                if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                  target.bringToFront();
                }
              },
              mouseout: (e) => {
                geoJsonLayer.resetStyle(e.target);
              },
              click: (e) => {
                // If picking location or drawing polygon, let map click handler take precedence
                if (isPickingLocationRef.current || drawingModeRef.current !== 'none') return;
                L.DomEvent.stopPropagation(e);
                const bounds = e.target.getBounds();
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
                setSelectedProvinceFrame(feature.properties?.Propinsi);
              }
            });
          }
        });

        provincesLayerRef.current.addLayer(geoJsonLayer);
        // Ensure boundaries sit behind markers and polygons
        provincesLayerRef.current.bringToBack();
      })
      .catch(err => {
        console.warn('Gagal memuat batas provinsi:', err);
      });
  }, [showProvinces, activeBasemap, selectedProvinceFrame, sites]);

  // Handle Quick Province Framing from Dropdown
  const handleFrameProvince = (provName) => {
    setSelectedProvinceFrame(provName);
    if (!mapInstanceRef.current) return;

    if (provName === 'all') {
      mapInstanceRef.current.flyTo([-2.5, 118.0], 5, { duration: 1.2 });
      return;
    }

    const feature = provinceFeaturesRef.current.find(f => f.properties?.Propinsi === provName);
    if (feature && feature._layer) {
      const bounds = feature._layer.getBounds();
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });

      feature._layer.setStyle({
        weight: 3.8,
        color: '#d8f537',
        dashArray: null,
        fillColor: '#d8f537',
        fillOpacity: 0.25,
      });

      setTimeout(() => {
        if (feature._layer && provincesLayerRef.current) {
          feature._layer.setStyle({
            color: activeBasemap === 'osm' ? '#0369a1' : '#38bdf8',
            weight: 2,
            opacity: 0.85,
            dashArray: '6, 6',
            fillColor: '#38bdf8',
            fillOpacity: 0.04,
          });
        }
      }, 2500);
    }
  };

  // 3. Render In-Progress Active Drawing (Polygon or Polyline Ruler)
  useEffect(() => {
    if (!mapInstanceRef.current || !activeDrawLayerRef.current) return;
    activeDrawLayerRef.current.clearLayers();

    if (drawnPoints.length === 0) return;

    // Draw vertex circle pins with clear sequence numbers
    drawnPoints.forEach((pt, idx) => {
      const isFirst = idx === 0;
      const isSecond = idx === 1;
      const isThird = idx === 2;
      const pinLabel = isFirst ? '1 (Titik Awal)' : (isThird ? '3 (Area Terbentuk)' : `${idx + 1}`);

      const vertexIcon = L.divIcon({
        className: 'vertex-pin',
        html: `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: ${isFirst ? '22px' : '18px'}; 
              height: ${isFirst ? '22px' : '18px'}; 
              background: ${isFirst ? '#10b981' : (drawingMode === 'polygon' ? '#d8f537' : '#38bdf8')}; 
              border: 2px solid #121316; 
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${isFirst ? '10px' : '9px'};
              font-weight: 900;
              color: #121316;
              box-shadow: 0 3px 8px rgba(0,0,0,0.5);
            ">
              ${idx + 1}
            </div>
            <div style="
              background: #121316; 
              color: ${isFirst ? '#34d399' : '#d8f537'}; 
              font-size: 8px; 
              font-weight: 800; 
              padding: 1px 5px; 
              border-radius: 4px; 
              margin-top: 2px; 
              white-space: nowrap; 
              border: 1px solid rgba(255,255,255,0.2);
              box-shadow: 0 2px 5px rgba(0,0,0,0.4);
            ">
              ${pinLabel}
            </div>
          </div>
        `,
        iconSize: [26, 34],
        iconAnchor: [13, isFirst ? 11 : 9]
      });

      const vMarker = L.marker([pt.lat, pt.lng], { icon: vertexIcon });
      activeDrawLayerRef.current.addLayer(vMarker);
    });

    // Draw Polygon or Polyline
    if (drawingMode === 'polygon' && drawnPoints.length >= 2) {
      const poly = L.polygon(drawnPoints.map(p => [p.lat, p.lng]), {
        color: '#d8f537',
        weight: 3,
        dashArray: '4, 4',
        fillColor: '#d8f537',
        fillOpacity: 0.25,
      });
      activeDrawLayerRef.current.addLayer(poly);
    } else if (drawingMode === 'measure' && drawnPoints.length >= 2) {
      const line = L.polyline(drawnPoints.map(p => [p.lat, p.lng]), {
        color: '#38bdf8',
        weight: 4,
        dashArray: '6, 6',
      });
      activeDrawLayerRef.current.addLayer(line);
    }
  }, [drawnPoints, drawingMode]);

  // 4. Render Saved Surveyor Polygons on Map (with High-Visibility Styling, Vertex Pins, and Clickable Center Badge)
  useEffect(() => {
    if (!mapInstanceRef.current || !surveyorPolygonsLayerRef.current) return;
    surveyorPolygonsLayerRef.current.clearLayers();

    if (!showSurveyorPolygons || !surveyorPolygons || surveyorPolygons.length === 0) return;

    surveyorPolygons.forEach((polyItem) => {
      const rawCoords = polyItem.coordinates;
      if (!rawCoords || rawCoords.length < 3) return;

      // Normalise coordinates to valid [lat, lng] pairs
      const validCoords = [];
      rawCoords.forEach(pt => {
        if (!pt) return;
        let lat, lng;
        if (Array.isArray(pt)) {
          lat = parseFloat(pt[0]);
          lng = parseFloat(pt[1]);
          // Check if coordinates were inverted [lng, lat]
          if (Math.abs(lat) > 90 && Math.abs(lng) <= 90) {
            const temp = lat;
            lat = lng;
            lng = temp;
          }
        } else if (typeof pt === 'object') {
          lat = parseFloat(pt.lat ?? pt.latitude);
          lng = parseFloat(pt.lng ?? pt.longitude);
        }
        if (!isNaN(lat) && !isNaN(lng)) {
          validCoords.push([lat, lng]);
        }
      });

      if (validCoords.length < 3) return;

      const isApproved = polyItem.status === 'Approved';
      const isSelected = selectedSite && (selectedSite.id === polyItem.id || selectedSite.site_name === polyItem.name);
      
      // High-contrast vibrant colors: Amber for draft/pending, Emerald for approved
      const strokeColor = isApproved ? '#10b981' : '#f59e0b';
      const fillColor = isApproved ? '#10b981' : '#f59e0b';

      const leafletPoly = L.polygon(validCoords, {
        color: strokeColor,
        weight: isSelected ? 4 : 3,
        dashArray: isApproved ? null : '5, 5',
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.45 : 0.28,
      });

      // Add vertex dots so the geometry is crisp and sharp
      validCoords.forEach((pt) => {
        const vertexDot = L.circleMarker(pt, {
          radius: 3.5,
          color: '#121316',
          weight: 1.5,
          fillColor: strokeColor,
          fillOpacity: 1,
        });
        surveyorPolygonsLayerRef.current.addLayer(vertexDot);
      });

      // Calculate centroid for center badge
      const centerLat = validCoords.reduce((sum, p) => sum + p[0], 0) / validCoords.length;
      const centerLng = validCoords.reduce((sum, p) => sum + p[1], 0) / validCoords.length;

      // Permanent Center Badge on Map
      const centerBadgeIcon = L.divIcon({
        className: 'saved-poly-badge',
        html: `
          <div style="
            background: #121316;
            color: #ffffff;
            border: 2px solid ${strokeColor};
            padding: 2.5px 8px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 800;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            transform: translate(-50%, -50%);
            cursor: pointer;
            pointer-events: auto;
          ">
            <span style="color:${strokeColor}; font-weight:900;">⬡</span>
            <span style="max-width:130px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${polyItem.name}</span>
            <span style="
              background: ${strokeColor}; 
              color: #121316; 
              font-size: 9px; 
              font-weight: 900; 
              padding: 0px 4px; 
              border-radius: 4px;
            ">
              ${polyItem.areaHectares} Ha
            </span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const centerMarker = L.marker([centerLat, centerLng], { icon: centerBadgeIcon });

      // Click event: Opens the Sliding Detail Drawer for this polygon!
      const handlePolygonClick = (e) => {
        if (e && e.originalEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
        }
        if (onSelectPolygon) {
          onSelectPolygon(polyItem);
        } else if (onSelectSite) {
          onSelectSite({
            ...polyItem,
            is_polygon: true,
            site_name: polyItem.name,
            latitude: centerLat,
            longitude: centerLng,
            elevation_masl: polyItem.elevation_masl || 1650,
            reservoir_temp_celsius: polyItem.reservoir_temp || 260,
            areaHectares: polyItem.areaHectares,
            areaSqMeters: polyItem.areaSqMeters,
            coordinates: validCoords
          });
        }
      };

      leafletPoly.on('click', handlePolygonClick);
      centerMarker.on('click', handlePolygonClick);

      leafletPoly.bindTooltip(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:5px 9px; font-size:11px;">
          <strong style="color:${strokeColor}; font-size:12px;">⬡ ${polyItem.name}</strong><br/>
          <span style="color:#0f172a; font-weight:bold;">Luas: ${polyItem.areaHectares} Ha (${Math.round(polyItem.areaSqMeters || 0).toLocaleString('id-ID')} m²)</span><br/>
          <span style="color:#64748b;">Status: <strong>${polyItem.status || 'Draft Lapangan'}</strong></span><br/>
          <span style="color:#2563eb; font-weight:bold; font-size:10px;">Klik untuk membuka panel detail &rarr;</span>
        </div>
      `, { sticky: true });

      surveyorPolygonsLayerRef.current.addLayer(leafletPoly);
      surveyorPolygonsLayerRef.current.addLayer(centerMarker);

      // Auto-focus if this is the newly saved polygon
      if (newlySavedPolygonId && (polyItem.id === newlySavedPolygonId)) {
        try {
          mapInstanceRef.current.fitBounds(leafletPoly.getBounds().pad(0.4), { duration: 1.2 });
        } catch (e) {}
      }
    });
  }, [surveyorPolygons, showSurveyorPolygons, selectedSite, newlySavedPolygonId]);

  // 5. Render Saved Surveyor Draft Points (Ground Truthing / GPS Pins)
  useEffect(() => {
    if (!mapInstanceRef.current || !surveyorDraftsLayerRef.current) return;
    surveyorDraftsLayerRef.current.clearLayers();

    surveyorDraftPoints.forEach((draft) => {
      const lat = parseFloat(draft.latitude);
      const lng = parseFloat(draft.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const draftIcon = L.divIcon({
        className: 'surveyor-draft-pin',
        html: `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center;">
            <div style="
              width: 26px; 
              height: 26px; 
              background: #f59e0b; 
              border: 2px solid #ffffff; 
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              font-size: 11px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">
              🧭
            </div>
            <div style="
              background: #121316; 
              color: #fef08a; 
              font-size: 9px; 
              font-weight: 800; 
              padding: 1px 6px; 
              border-radius: 4px;
              margin-top: 2px;
              white-space: nowrap;
              border: 1px solid rgba(255,255,255,0.2);
            ">
              ${draft.name} (${draft.temperature ? draft.temperature + '°C' : 'Draft'})
            </div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker([lat, lng], { icon: draftIcon });
      marker.bindPopup(`
        <div style="padding:10px; font-family:'Plus Jakarta Sans',sans-serif; max-width:240px;">
          <div style="font-size:9px; font-weight:800; color:#f59e0b; text-transform:uppercase;">DRAFT PENGUKURAN LAPANGAN</div>
          <div style="font-size:13px; font-weight:800; color:#0f172a; margin-top:2px;">${draft.name}</div>
          <div style="font-size:11px; color:#64748b; margin-top:4px;">
            Tipe: <strong>${draft.type || 'Manifestasi Panas'}</strong><br/>
            Suhu: <strong>${draft.temperature || '-'} °C</strong><br/>
            Elevasi: <strong>${draft.elevation || '-'} mdpl</strong><br/>
            Koordinat: <strong>${lat.toFixed(5)}°, ${lng.toFixed(5)}°</strong>
          </div>
          <div style="margin-top:8px; font-size:10px; padding:3px 6px; background:#fef3c7; color:#92400e; border-radius:4px; font-weight:600;">
            Menunggu Verifikasi Lead Geoscientist
          </div>
        </div>
      `);

      surveyorDraftsLayerRef.current.addLayer(marker);
    });
  }, [surveyorDraftPoints]);

  // 6. Render Active Geothermal Sites (Star Energy & National WKP)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !bufferLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    bufferLayerRef.current.clearLayers();

    if (!sites || sites.length === 0) return;

    const filteredSites = sites.filter(site => {
      if (starOnly && !site.is_star_energy) return false;
      if (activeFilter && activeFilter !== 'all' && site.project_status !== activeFilter) return false;
      return true;
    });

    filteredSites.forEach(site => {
      const lat = parseFloat(site.latitude);
      const lng = parseFloat(site.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const isStar = Boolean(site.is_star_energy);
      const status = site.project_status;
      const capacity = parseFloat(site.installed_capacity_mw) || 0;

      let markerColor = '#2563eb';
      let iconSymbol = '★';

      if (!isStar) {
        if (status === 'Operational') {
          markerColor = '#64748b';
          iconSymbol = '⚡';
        } else if (status === 'Under Construction') {
          markerColor = '#0284c7';
          iconSymbol = '⚙';
        } else if (status === 'Exploration') {
          markerColor = '#3b82f6';
          iconSymbol = '🧭';
        } else {
          markerColor = '#475569';
          iconSymbol = '♨';
        }
      }

      const isSelected = selectedSite && selectedSite.id === site.id;
      const markerSize = isStar ? 38 : (isSelected ? 36 : 28);

      const customIcon = L.divIcon({
        className: 'custom-geothermal-pin',
        html: `
          <div style="
            position: relative;
            width: ${markerSize}px;
            height: ${markerSize}px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${isStar ? `
              <div style="
                position: absolute;
                inset: -5px;
                border-radius: 50%;
                background: rgba(216, 245, 55, 0.45);
                animation: geothermal-pulse 2.5s infinite;
              "></div>
            ` : ''}
            <div style="
              width: ${markerSize - 4}px;
              height: ${markerSize - 4}px;
              background: ${isStar ? '#121316' : markerColor};
              border: 2px solid ${isStar ? '#d8f537' : '#ffffff'};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${isStar ? '#d8f537' : '#ffffff'};
              font-size: ${isStar ? '14px' : '10px'};
              font-weight: 900;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            ">
              ${isStar ? '★' : iconSymbol}
            </div>
          </div>
        `,
        iconSize: [markerSize, markerSize],
        iconAnchor: [markerSize / 2, markerSize / 2],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Click event on site marker
      marker.on('click', (e) => {
        if (e.originalEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
        }

        // 1. If currently choosing a target site to anchor polygon drawing:
        if (isSelectingSiteForPolygonRef.current) {
          if (onSelectSiteForPolygonRef.current) {
            onSelectSiteForPolygonRef.current(site);
          }
          return;
        }

        // 2. If drawing polygon or ruler is active, snap vertex to this marker
        if (drawingModeRef.current === 'polygon' || drawingModeRef.current === 'measure') {
          setDrawnPoints(prev => [...prev, { lat, lng }]);
          return;
        }

        // 3. If picking location is active, pick this site's coordinates
        if (isPickingLocationRef.current) {
          if (onLocationPickedRef.current) {
            onLocationPickedRef.current(lat, lng);
          }
          return;
        }

        // 4. Default: Opens the Sliding Detail Drawer on the right
        if (onSelectSiteRef.current) {
          onSelectSiteRef.current(site);
        }
      });

      // Simple hover tooltip
      marker.bindTooltip(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px 8px; font-size:11px;">
          <strong style="color:${isStar ? '#2563eb' : '#0f172a'};">${isStar ? '★ ' : ''}${site.site_name}</strong><br/>
          <span style="color:#64748b;">${site.operator_company} • ${capacity > 0 ? capacity + ' MW' : site.project_status}</span><br/>
          <span style="color:#2563eb; font-weight:bold;">${isSelectingSiteForPolygon ? '👉 Klik untuk pilih fasilitas ini sebagai target poligon' : 'Klik untuk membuka panel detail di kanan &rarr;'}</span>
        </div>
      `, { sticky: true });

      markersLayerRef.current.addLayer(marker);

      // Draw Buffer Rings for Selected Site or All Star Energy Sites
      if (showBuffers && (isSelected || (isStar && selectedSite === null))) {
        const radiusMeters = bufferRadiusKm * 1000;
        const outerCircle = L.circle([lat, lng], {
          radius: radiusMeters,
          color: isStar ? '#d8f537' : '#64748b',
          weight: 1.5,
          opacity: 0.7,
          dashArray: '4, 4',
          fillColor: isStar ? '#d8f537' : '#64748b',
          fillOpacity: 0.08,
        });

        bufferLayerRef.current.addLayer(outerCircle);
      }
    });
  }, [sites, selectedSite, showBuffers, bufferRadiusKm, activeFilter, starOnly]);

  // 7. Render Tectonic Faults
  useEffect(() => {
    if (!mapInstanceRef.current || !faultsLayerRef.current) return;
    faultsLayerRef.current.clearLayers();

    if (!showFaults || !faults || !faults.features) return;

    const geoJsonLayer = L.geoJSON(faults, {
      style: () => ({
        color: '#ef4444',
        weight: 3,
        opacity: 0.85,
        dashArray: '6, 6',
      }),
      onEachFeature: (feature, layer) => {
        const p = feature.properties || {};
        layer.bindTooltip(`
          <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px 8px; font-size:11px;">
            <strong style="color:#ef4444;">⚡ ${p.fault_name || 'Sesar Tektonik Aktif'}</strong><br/>
            <span style="color:#94a3b8;">Panjang: ~${p.length_approx_km || 0} km</span>
          </div>
        `, { sticky: true });
      }
    });

    faultsLayerRef.current.addLayer(geoJsonLayer);
  }, [faults, showFaults]);

  // Handler: Save Completed Polygon directly
  const handleConfirmSavePolygon = () => {
    if (drawnPoints.length < 3) return;
    const finalName = polygonName.trim() || `Area Survei Lapangan #${(surveyorPolygons?.length || 0) + 1}`;
    
    if (onSavePolygon) {
      onSavePolygon({
        id: 'poly-' + Date.now(),
        name: finalName,
        coordinates: drawnPoints.map(p => [p.lat, p.lng]),
        areaSqMeters: liveAreaSqMeters,
        areaHectares: liveAreaHectares,
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.name || 'Surveyor Lapangan',
        status: 'Pending Review'
      });
    }

    setDrawnPoints([]);
    setPolygonName('');
    setIsNamingPolygon(false);
    if (setDrawingMode) setDrawingMode('none');
  };

  // Handler: Finish Polygon and open Right Slider Drawer in Edit Mode for comprehensive details
  const handleFinishPolygonToDrawer = () => {
    if (drawnPoints.length < 3) return;
    const centerLat = drawnPoints.reduce((sum, p) => sum + p.lat, 0) / drawnPoints.length;
    const centerLng = drawnPoints.reduce((sum, p) => sum + p.lng, 0) / drawnPoints.length;
    
    if (onFinishPolygonDrawing) {
      onFinishPolygonDrawing({
        coordinates: drawnPoints.map(p => [p.lat, p.lng]),
        areaSqMeters: liveAreaSqMeters,
        areaHectares: liveAreaHectares,
        latitude: centerLat,
        longitude: centerLng,
        elevation_masl: targetSiteForPolygon?.elevation_masl || 1650,
        is_polygon: true,
        site_name: targetSiteForPolygon 
          ? `Batas Area Poligon - ${targetSiteForPolygon.site_name}`
          : `Area Survei Lapangan #${(surveyorPolygons?.length || 0) + 1}`,
        notes: `Area poligon hasil pemetaan ${drawnPoints.length} titik simpul batas lapangan.${targetSiteForPolygon ? ` Terkait fasilitas: ${targetSiteForPolygon.site_name}.` : ''}`,
        targetSite: targetSiteForPolygon
      });
    }

    setDrawnPoints([]);
    setIsNamingPolygon(false);
    if (setDrawingMode) setDrawingMode('none');
  };

  const handleCancelDrawing = () => {
    setDrawnPoints([]);
    setIsNamingPolygon(false);
    if (setDrawingMode) setDrawingMode('none');
    if (onCancelSelectSiteForPolygon) onCancelSelectSiteForPolygon();
  };

  const handleUndoPoint = () => {
    setDrawnPoints(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      
      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* ======================================================== */}
      {/* BANNER 1: MEMILIH TITIK LOKASI SEBELUM GAMBAR POLIGON    */}
      {/* ======================================================== */}
      {isSelectingSiteForPolygon && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#121316]/95 text-white backdrop-blur-md px-6 py-3.5 rounded-2xl border-2 border-[#d8f537] shadow-2xl flex items-center gap-4 text-xs animate-bounce max-w-[95vw]">
          <div className="w-3.5 h-3.5 rounded-full bg-[#d8f537] animate-ping shrink-0" />
          <div>
            <div className="font-black text-sm text-white flex items-center gap-2">
              <span>Langkah 1: Pilih Titik Lokasi Pembangkit</span>
              <span className="bg-[#d8f537] text-black font-extrabold px-2 py-0.5 rounded text-[10px]">Wajib Dipilih</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              👉 Silakan klik salah satu titik penanda lokasi pembangkit (★ Star Energy / PGE) di peta untuk menentukan fasilitas mana yang akan dipetakan batas areanya.
            </p>
          </div>
          <button
            onClick={() => {
              if (onCancelSelectSiteForPolygon) onCancelSelectSiteForPolygon();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold transition-colors shrink-0 border border-white/20"
          >
            Batal
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING TOP WORKBENCH FOR SURVEYOR TOOLS                */}
      {/* ======================================================== */}
      {drawingMode === 'polygon' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#121316]/95 text-white backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-white/20 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs max-w-[96vw] w-auto">
          
          {/* Step Guide & Status */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#d8f537] animate-ping shrink-0"></span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-white text-xs sm:text-sm">Mode Gambar Poligon Area</span>
                {targetSiteForPolygon && (
                  <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-xs truncate max-w-[220px]">
                    <span>🎯</span>
                    <span className="truncate">{targetSiteForPolygon.site_name}</span>
                  </span>
                )}
                <span className="bg-[#d8f537] text-black font-mono font-extrabold px-2 py-0.5 rounded text-[10px] shrink-0">
                  {drawnPoints.length === 0 && 'Langkah 1: Titik Awal'}
                  {drawnPoints.length === 1 && 'Langkah 2: Titik Ke-2'}
                  {drawnPoints.length === 2 && 'Langkah 3: Titik Ke-3'}
                  {drawnPoints.length >= 3 && `${drawnPoints.length} Titik Simpul Terbentuk`}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 truncate hidden sm:block">
                {drawnPoints.length === 0 && `👉 Klik di peta untuk meletakkan Titik 1 (Titik Awal)${targetSiteForPolygon ? ` di sekitar ${targetSiteForPolygon.site_name}` : ''}.`}
                {drawnPoints.length === 1 && '👉 Klik titik ke-2 di peta untuk menarik garis batas.'}
                {drawnPoints.length === 2 && '👉 Klik titik ke-3 di peta untuk menutup segitiga & membentuk area poligon.'}
                {drawnPoints.length >= 3 && '✅ Area terbentuk! Klik titik berikutnya untuk memperluas, atau klik tombol kuning.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end w-full lg:w-auto pt-1 lg:pt-0 border-t border-white/10 lg:border-t-0">
            {/* Area Measurement Result */}
            {drawnPoints.length >= 3 && (
              <div className="bg-white/10 px-3 py-1 rounded-xl border border-white/15 flex items-center gap-1.5 shrink-0">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Luas:</span>
                <span className="font-mono text-[#d8f537] font-black text-sm">
                  {liveAreaHectares} Ha
                </span>
                <span className="text-[9px] text-slate-300">({Math.round(liveAreaSqMeters).toLocaleString('id-ID')} m²)</span>
              </div>
            )}

            {/* Action Buttons */}
            {drawnPoints.length > 0 && (
              <button
                onClick={handleUndoPoint}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
                title="Batalkan titik terakhir"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
            )}

            {drawnPoints.length >= 3 && (
              <button
                onClick={handleFinishPolygonToDrawer}
                className="px-3.5 py-1.5 rounded-xl bg-[#d8f537] hover:bg-[#c9e62f] text-black font-black text-xs transition-all flex items-center gap-1.5 shadow-lg ring-2 ring-white/40 cursor-pointer animate-pulse shrink-0"
                title="Buka panel slider kanan untuk melengkapi atribut dan verifikasi AMDAL"
              >
                <Check className="w-4 h-4 text-black stroke-[3]" />
                <span>Selesai & Lengkapi Data →</span>
              </button>
            )}

            <button
              onClick={handleCancelDrawing}
              className="px-2.5 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>Batal</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL NAMING POLYGON */}
      {isNamingPolygon && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-white rounded-2xl p-4 shadow-2xl border border-slate-300 w-80 text-xs text-slate-900 animate-fade-in">
          <div className="font-extrabold text-sm mb-1 text-slate-950">Beri Nama Poligon Area:</div>
          <p className="text-[11px] text-slate-500 mb-3">Luas terukur: <strong className="text-blue-700">{liveAreaHectares} Hektar</strong></p>
          <input
            type="text"
            placeholder="Contoh: Batas Wellpad A Wayang Windu"
            value={polygonName}
            onChange={(e) => setPolygonName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs mb-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsNamingPolygon(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Kembali
            </button>
            <button
              onClick={handleConfirmSavePolygon}
              className="px-3 py-1.5 rounded-lg bg-[#121316] hover:bg-black text-[#d8f537] font-bold"
            >
              Simpan ke Draft
            </button>
          </div>
        </div>
      )}

      {/* RULER / DISTANCE MEASURING TOP BAR */}
      {drawingMode === 'measure' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#121316]/95 text-white backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-white">Alat Ukur Jarak (Ruler)</span>
            <span className="text-slate-400 font-mono text-[11px]">({drawnPoints.length} Titik)</span>
          </div>

          <div className="h-4 w-px bg-white/20"></div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px]">Total Jarak:</span>
            <span className="font-mono text-sky-400 font-extrabold text-sm">
              {liveDistanceKm} km <span className="text-xs font-normal text-slate-300">({Math.round(liveDistanceMeters).toLocaleString('id-ID')} m)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {drawnPoints.length > 0 && (
              <button
                onClick={handleUndoPoint}
                className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Undo
              </button>
            )}
            <button
              onClick={handleCancelDrawing}
              className="px-2.5 py-1 rounded bg-red-600/80 hover:bg-red-700 text-white text-xs font-semibold"
            >
              Tutup Penggaris
            </button>
          </div>
        </div>
      )}

      {/* Picking Location Banner Notification */}
      {isPickingLocation && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500 shadow-2xl flex items-center gap-2 animate-bounce text-xs font-semibold">
          <Crosshair className="w-4 h-4 text-emerald-300 animate-spin" />
          <span>Klik pada peta untuk mengambil koordinat Lintang & Bujur</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* FLOATING BASEMAP & GIS CONTROL DOCK (TOP-RIGHT)          */}
      {/* ======================================================== */}
      <div className="absolute top-4 right-4 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-3 text-xs text-slate-800 space-y-3">
        {/* Basemap Segmented Switcher */}
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
            Peta Dasar (Basemap)
          </div>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveBasemap('satellite')}
              className={`py-1 rounded-lg text-[11px] font-bold transition-colors ${
                activeBasemap === 'satellite' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satelit
            </button>
            <button
              onClick={() => setActiveBasemap('dark')}
              className={`py-1 rounded-lg text-[11px] font-bold transition-colors ${
                activeBasemap === 'dark' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gelap
            </button>
            <button
              onClick={() => setActiveBasemap('osm')}
              className={`py-1 rounded-lg text-[11px] font-bold transition-colors ${
                activeBasemap === 'osm' 
                  ? 'bg-white text-blue-700 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jalan
            </button>
          </div>
        </div>

        {/* Spatial Layers & Analysis Toggle */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Lapisan Tematik & AMDAL
          </div>

          <label className="flex items-center justify-between cursor-pointer font-medium hover:text-slate-950">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 border-b-2 border-dashed border-sky-400"></span>
              Batas Garis Provinsi
            </span>
            <input 
              type="checkbox" 
              checked={showProvinces} 
              onChange={(e) => setShowProvinces(e.target.checked)} 
              className="rounded accent-blue-600 border-slate-300"
            />
          </label>

          {/* Quick Province Frame Dropdown Selector */}
          {showProvinces && (
            <div className="pt-1.5 pb-1 flex flex-col gap-1 border-t border-slate-100/80">
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold font-mono">
                <span>FRAME / FOKUS PROVINSI:</span>
                {selectedProvinceFrame !== 'all' && (
                  <button 
                    onClick={() => handleFrameProvince('all')}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Reset
                  </button>
                )}
              </div>
              <select
                value={selectedProvinceFrame}
                onChange={(e) => handleFrameProvince(e.target.value)}
                className="w-full px-2 py-1.5 bg-slate-50 hover:bg-white text-slate-900 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">🗺️ Seluruh Indonesia (Overview)</option>
                <optgroup label="Klaster Geotermal Jawa">
                  <option value="JAWA BARAT">🏛️ Jawa Barat (Wayang Windu, Salak, Kamojang)</option>
                  <option value="JAWA TENGAH">🏛️ Jawa Tengah (Dieng)</option>
                  <option value="JAWA TIMUR">🏛️ Jawa Timur (Ijen, Arjuno Welirang)</option>
                  <option value="PROBANTEN">🏛️ Banten (Rawa Danau)</option>
                </optgroup>
                <optgroup label="Sumatera">
                  <option value="LAMPUNG">🏛️ Lampung (Ulubelu, Rajabasa)</option>
                  <option value="SUMATERA UTARA">🏛️ Sumatera Utara (Sarulla, Sibayak)</option>
                  <option value="SUMATERA BARAT">🏛️ Sumatera Barat (Muara Laboh)</option>
                  <option value="SUMATERA SELATAN">🏛️ Sumatera Selatan (Lumut Balai)</option>
                </optgroup>
                <optgroup label="Sulawesi & Nusa Tenggara">
                  <option value="SULAWESI UTARA">🏛️ Sulawesi Utara (Lahendong, Kotamobagu)</option>
                  <option value="NUSA TENGGARA TIMUR">🏛️ Nusa Tenggara Timur (Flores)</option>
                  <option value="BALI">🏛️ Bali (Bedugul)</option>
                </optgroup>
                <optgroup label="Semua Provinsi Lainnya">
                  {provinceList
                    .filter(p => !['JAWA BARAT', 'JAWA TENGAH', 'JAWA TIMUR', 'PROBANTEN', 'LAMPUNG', 'SUMATERA UTARA', 'SUMATERA BARAT', 'SUMATERA SELATAN', 'SULAWESI UTARA', 'NUSA TENGGARA TIMUR', 'BALI'].includes(p))
                    .map(p => (
                      <option key={p} value={p}>
                        {formatProvinceName(p)}
                      </option>
                    ))
                  }
                </optgroup>
              </select>
            </div>
          )}

          <label className="flex items-center justify-between cursor-pointer font-medium hover:text-slate-950">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-500 rounded"></span>
              Sesar Aktif (PuSGeN)
            </span>
            <input 
              type="checkbox" 
              checked={showFaults} 
              onChange={(e) => setShowFaults(e.target.checked)} 
              className="rounded accent-blue-600 border-slate-300"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer font-medium hover:text-slate-950">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 border border-amber-600"></span>
              Poligon Batas Area ({surveyorPolygons?.length || 0})
            </span>
            <input 
              type="checkbox" 
              checked={showSurveyorPolygons} 
              onChange={(e) => setShowSurveyorPolygons(e.target.checked)} 
              className="rounded accent-blue-600 border-slate-300"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer font-medium hover:text-slate-950">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600"></span>
              Buffer Konservasi
            </span>
            <input 
              type="checkbox" 
              checked={showBuffers} 
              onChange={(e) => setShowBuffers(e.target.checked)} 
              className="rounded accent-blue-600 border-slate-300"
            />
          </label>

          {showBuffers && (
            <div className="pt-1.5 flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold">Radius:</span>
              <div className="flex gap-1">
                {[5, 10, 25].map(radius => (
                  <button
                    key={radius}
                    onClick={() => setBufferRadiusKm(radius)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      bufferRadiusKm === radius 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {radius}km
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reset View Button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([-7.02, 107.18], 8, { duration: 1 });
            }
          }}
          className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Fokus Pembangkit Utama</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MAP LEGEND (BOTTOM-LEFT)                                 */}
      {/* ======================================================== */}
      <div className="absolute bottom-6 left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl max-w-xs text-xs text-slate-800">
        <div className="font-extrabold text-slate-900 mb-2 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-blue-600" />
          <span>Legenda Simbol Panas Bumi</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] text-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#121316] border border-[#d8f537] flex items-center justify-center text-[9px] text-[#d8f537] font-bold shadow-xs">★</span>
            <span className="font-bold text-slate-950">Star Energy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-500 border border-white shadow-xs"></span>
            <span>PGE & Mitra</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shadow-xs"></span>
            <span>Konstruksi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs"></span>
            <span>Draft Lapangan</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 pt-1 border-t border-slate-100 text-[10px] text-emerald-700 font-semibold">
            <span className="w-3 h-3 border-2 border-[#d8f537] bg-[#d8f537]/30 rounded"></span>
            <span>Poligon Area Surveyor</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 text-[10px] text-red-600 font-semibold">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-red-500"></span>
            <span>Sesar Tektonik Aktif PuSGeN</span>
          </div>
          <div className="flex items-center gap-2 col-span-2 text-[10px] text-sky-600 font-semibold">
            <span className="w-4 h-0.5 border-b-2 border-dashed border-sky-400"></span>
            <span>Garis Pemisah Batas Provinsi</span>
          </div>
        </div>
      </div>

    </div>
  );
}
