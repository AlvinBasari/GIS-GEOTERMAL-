import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  MapPin, 
  AlertCircle,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function EditSiteModal({ site, isOpen, onClose, onSiteUpdated }) {
  if (!isOpen || !site) return null;

  const [formData, setFormData] = useState({
    site_name: '',
    project_status: 'Operational',
    installed_capacity_mw: '0',
    potential_capacity_mw: '0',
    reservoir_temp_celsius: '',
    enthalpy_type: 'High Enthalpy',
    wkp_name: '',
    island: 'Jawa',
    province: 'Jawa Barat',
    regency: '',
    latitude: '',
    longitude: '',
    elevation_masl: '',
    commercial_operation_year: '',
    grid_connection: '',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (site) {
      setFormData({
        site_name: site.site_name || '',
        project_status: site.project_status || 'Operational',
        installed_capacity_mw: String(site.installed_capacity_mw ?? 0),
        potential_capacity_mw: String(site.potential_capacity_mw ?? 0),
        reservoir_temp_celsius: site.reservoir_temp_celsius ? String(site.reservoir_temp_celsius) : '',
        enthalpy_type: site.enthalpy_type || 'High Enthalpy',
        wkp_name: site.wkp_name || '',
        island: site.island || 'Jawa',
        province: site.province || '',
        regency: site.regency || '',
        latitude: String(site.latitude ?? ''),
        longitude: String(site.longitude ?? ''),
        elevation_masl: site.elevation_masl ? String(site.elevation_masl) : '',
        commercial_operation_year: site.commercial_operation_year ? String(site.commercial_operation_year) : '',
        grid_connection: site.grid_connection || '',
        description: site.description || '',
      });
      setErrorMessage(null);
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        installed_capacity_mw: parseFloat(formData.installed_capacity_mw) || 0,
        potential_capacity_mw: parseFloat(formData.potential_capacity_mw) || 0,
        reservoir_temp_celsius: formData.reservoir_temp_celsius ? parseInt(formData.reservoir_temp_celsius) : null,
        elevation_masl: formData.elevation_masl ? parseInt(formData.elevation_masl) : null,
        commercial_operation_year: formData.commercial_operation_year ? parseInt(formData.commercial_operation_year) : null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      const res = await fetch(`/api/geothermal/sites/${site.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal memperbarui data lokasi.');
      }

      onSiteUpdated(result.data);
      onClose();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header (Clean Pure White with Blue Accent) */}
        <div className="p-5 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Edit3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                Edit Parameter Lapangan: {site.site_name}
              </h3>
              <p className="text-xs text-slate-500">
                Pembaruan kapasitas, status siklus proyek, atau koordinat WKP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Nama Lapangan *</label>
              <input
                type="text"
                required
                name="site_name"
                value={formData.site_name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Status Proyek *</label>
              <select
                name="project_status"
                value={formData.project_status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-semibold text-blue-600"
              >
                <option value="Operational">Sudah Beroperasi (COD)</option>
                <option value="Under Construction">Sedang Dibangun / Konstruksi</option>
                <option value="Exploration">Tahap Eksplorasi / Pengeboran</option>
                <option value="Potential">Prospek Belum Dieksplorasi</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Kapasitas Operasi (MW)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="installed_capacity_mw"
                value={formData.installed_capacity_mw}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Potensi Cadangan (MW)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                name="potential_capacity_mw"
                value={formData.potential_capacity_mw}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Suhu Reservoar (°C)</label>
              <input
                type="number"
                name="reservoir_temp_celsius"
                value={formData.reservoir_temp_celsius}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Lintang (Latitude)</label>
              <input
                type="number"
                step="0.000001"
                required
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bujur (Longitude)</label>
              <input
                type="number"
                step="0.000001"
                required
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Deskripsi Lapangan</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 placeholder-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
