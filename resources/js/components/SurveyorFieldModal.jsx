import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Thermometer, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Mountain, 
  Flame, 
  Compass, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function SurveyorFieldModal({ isOpen, onClose, onSaveDraft, initialCoords }) {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState(initialCoords?.lat || -7.208);
  const [longitude, setLongitude] = useState(initialCoords?.lng || 107.630);
  const [elevation, setElevation] = useState('1650');
  const [temperature, setTemperature] = useState('88.5');
  const [manifestationType, setManifestationType] = useState('Fumarol / Solfatara');
  const [photoType, setPhotoType] = useState('drone'); // 'drone' | 'ground'
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Nama titik / manifestasi wajib diisi.');
      return;
    }

    const draft = {
      id: 'draft-point-' + Date.now(),
      name,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      elevation: parseFloat(elevation) || 0,
      temperature: parseFloat(temperature) || 0,
      type: manifestationType,
      photoType,
      photoUrl: photoType === 'drone' ? '/hd_gallery/wayang_windu_pipelines_hd.jpg' : '/hd_gallery/pltp_steam_pipeline_5k.jpg',
      notes,
      createdAt: new Date().toISOString(),
      status: 'Pending Review'
    };

    onSaveDraft(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-900">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-[#f8f8f5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#121316] text-[#d8f537]">
                SUB SISTEM INPUT: PENGUKURAN LAPANGAN
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-950">
              Input Dokumentasi & Titik GPS Surveyor
            </h3>
            <p className="text-xs text-slate-600">
              Akuisisi data ground-truthing lapangan dan foto udara drone baru.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-black border border-slate-200 flex items-center justify-center transition-colors shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Nama Titik / Manifestasi Panas Bumi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Fumarol Sektor Wayang Windu North-02"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs font-medium"
            />
          </div>

          {/* 2 Kolom Koordinat */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Lintang (Latitude S) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                required
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Bujur (Longitude E) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.000001"
                required
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
              />
            </div>
          </div>

          {/* Elevasi & Suhu */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Mountain className="w-3.5 h-3.5 text-emerald-600" />
                <span>Elevasi Permukaan (mdpl)</span>
              </label>
              <input
                type="number"
                value={elevation}
                onChange={(e) => setElevation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs"
                placeholder="1650"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" />
                <span>Suhu Terukur Lapangan (°C)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs text-amber-700 font-bold"
                placeholder="92.4"
              />
            </div>
          </div>

          {/* Tipe Manifestasi */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Klasifikasi Tipe Lapangan
            </label>
            <select
              value={manifestationType}
              onChange={(e) => setManifestationType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
            >
              <option value="Fumarol / Solfatara">Fumarol / Solfatara (Emisi Uap Alami)</option>
              <option value="Mata Air Panas (Hot Spring)">Mata Air Panas (Hot Spring)</option>
              <option value="Tanah Beruap (Steaming Ground)">Tanah Beruap (Steaming Ground)</option>
              <option value="Kepala Sumur / Wellpad Baru">Kepala Sumur / Wellpad Baru</option>
              <option value="Jalur Pipa Transmisi Uap">Jalur Pipa Transmisi Uap</option>
            </select>
          </div>

          {/* Upload / Pilih Dokumentasi Foto Lapangan & Drone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              <span>Dokumentasi Foto Udara Drone / Lapangan</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                photoType === 'drone' ? 'bg-[#121316] text-[#d8f537] border-black' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input 
                  type="radio" 
                  name="photoType" 
                  checked={photoType === 'drone'} 
                  onChange={() => setPhotoType('drone')} 
                  className="sr-only" 
                />
                <span className="font-bold text-xs">Foto Udara Drone</span>
                <span className="text-[10px] opacity-80 mt-0.5">Perspektif aerial lanskap</span>
              </label>

              <label className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all ${
                photoType === 'ground' ? 'bg-[#121316] text-[#d8f537] border-black' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <input 
                  type="radio" 
                  name="photoType" 
                  checked={photoType === 'ground'} 
                  onChange={() => setPhotoType('ground')} 
                  className="sr-only" 
                />
                <span className="font-bold text-xs">Foto Lapangan (Ground)</span>
                <span className="text-[10px] opacity-80 mt-0.5">Detail fisik kepala sumur</span>
              </label>
            </div>
          </div>

          {/* Catatan Lapangan */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Catatan Kondisi Fisik Geologi
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan kondisi batuan alterasi hidrotermal, debit uap, atau vegetasi sekitar..."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Alur Sub Sistem:</strong> Data ini akan disimpan sebagai draft terenkripsi dan diteruskan ke <strong>Lead Geoscientist</strong> untuk proses verifikasi ilmiah sebelum disinkronkan ke Master Basis Data.
            </span>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#121316] hover:bg-black text-[#d8f537] font-extrabold flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Kirim ke Lead</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
