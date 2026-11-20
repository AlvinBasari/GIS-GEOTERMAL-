import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  MapPin, 
  Crosshair, 
  ShieldCheck, 
  AlertCircle,
  Save
} from 'lucide-react';

export default function AddSiteModal({ 
  isOpen, 
  onClose, 
  onSiteAdded,
  onActivateMapPicker,
  pickedCoordinates
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    site_name: '',
    operator_company: 'Star Energy Geothermal Ltd.',
    company_category: 'Star Energy',
    is_star_energy: true,
    project_status: 'Operational',
    status_label: '',
    installed_capacity_mw: '0',
    potential_capacity_mw: '100',
    enthalpy_type: 'High Enthalpy',
    reservoir_temp_celsius: '240',
    wkp_name: '',
    island: 'Jawa',
    province: 'Jawa Barat',
    regency: 'Kabupaten Bandung',
    latitude: pickedCoordinates ? pickedCoordinates.lat.toFixed(6) : '-7.2000',
    longitude: pickedCoordinates ? pickedCoordinates.lng.toFixed(6) : '107.6000',
    elevation_masl: '1500',
    commercial_operation_year: '2025',
    grid_connection: 'Interkoneksi Jamali 150 kV',
    data_source: 'Star Energy Geothermal Internal Technical Report (2025)',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync if new coordinates picked from map
  React.useEffect(() => {
    if (pickedCoordinates) {
      setFormData(prev => ({
        ...prev,
        latitude: pickedCoordinates.lat.toFixed(6),
        longitude: pickedCoordinates.lng.toFixed(6),
      }));
    }
  }, [pickedCoordinates]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        ...formData,
        is_star_energy: formData.company_category === 'Star Energy',
        installed_capacity_mw: parseFloat(formData.installed_capacity_mw) || 0,
        potential_capacity_mw: parseFloat(formData.potential_capacity_mw) || 0,
        reservoir_temp_celsius: formData.reservoir_temp_celsius ? parseInt(formData.reservoir_temp_celsius) : null,
        elevation_masl: formData.elevation_masl ? parseInt(formData.elevation_masl) : null,
        commercial_operation_year: formData.commercial_operation_year ? parseInt(formData.commercial_operation_year) : null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      };

      const res = await fetch('/api/geothermal/sites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Gagal menyimpan data lokasi.');
      }

      onSiteAdded(result.data);
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
              <PlusCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-950">
                Input Lokasi Lapangan Panas Bumi
              </h3>
              <p className="text-xs text-slate-500">
                Pendaftaran aset Star Energy Geothermal (Beroperasi, Sedang Dibangun, atau Eksplorasi)
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Section 1: Identitas Lapangan & Korporasi */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              1. Identitas Lapangan & Status Proyek
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Lapangan / Pembangkit (PLTP) *
                </label>
                <input
                  type="text"
                  required
                  name="site_name"
                  placeholder="Contoh: PLTP Wayang Windu Unit 3"
                  value={formData.site_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Perusahaan / Operator *
                </label>
                <input
                  type="text"
                  required
                  name="operator_company"
                  placeholder="Star Energy Geothermal Ltd."
                  value={formData.operator_company}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kategori Kepemilikan *
                </label>
                <select
                  name="company_category"
                  value={formData.company_category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
                >
                  <option value="Star Energy">★ Star Energy Geothermal (Internal)</option>
                  <option value="Pertamina Geothermal Energy (PGE)">Pertamina Geothermal (PGE)</option>
                  <option value="Geo Dipa Energi">Geo Dipa Energi (BUMN)</option>
                  <option value="Medco Power">Medco Power Indonesia</option>
                  <option value="Supreme Energy">Supreme Energy</option>
                  <option value="Sarulla Operations">Sarulla Operations Ltd</option>
                  <option value="Pemerintah (ESDM)">Pemerintah (ESDM) / Cadangan</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Status Pengusahaan *
                </label>
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

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama WKP (Wilayah Kerja)
                </label>
                <input
                  type="text"
                  name="wkp_name"
                  placeholder="Contoh: WKP Pangalengan"
                  value={formData.wkp_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kapasitas & Termodinamika */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              2. Kapasitas Daya (MW) & Karakteristik Reservoar
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Kapasitas Operasi (MW)
                </label>
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
                <label className="block text-slate-700 font-semibold mb-1">
                  Potensi Cadangan (MW)
                </label>
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
                <label className="block text-slate-700 font-semibold mb-1">
                  Suhu Reservoar (°C)
                </label>
                <input
                  type="number"
                  name="reservoir_temp_celsius"
                  placeholder="240"
                  value={formData.reservoir_temp_celsius}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tipe Entalpi
                </label>
                <select
                  name="enthalpy_type"
                  value={formData.enthalpy_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
                >
                  <option value="High Enthalpy">Entalpi Tinggi (&gt;225°C)</option>
                  <option value="Medium Enthalpy">Entalpi Sedang (125-225°C)</option>
                  <option value="Low Enthalpy">Entalpi Rendah (&lt;125°C)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Koordinat Spasial & Geografis */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                3. Posisi Spasial & Titik Koordinat (WGS 84)
              </h4>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onActivateMapPicker();
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-blue-600 border border-slate-300 text-[11px] font-semibold transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Titik di Peta (Map Picker)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Garis Lintang (Latitude) *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  name="latitude"
                  placeholder="-7.200000"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Garis Bujur (Longitude) *
                </label>
                <input
                  type="number"
                  step="0.000001"
                  required
                  name="longitude"
                  placeholder="107.600000"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Elevasi (mdpl)
                </label>
                <input
                  type="number"
                  name="elevation_masl"
                  placeholder="1500"
                  value={formData.elevation_masl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pulau *</label>
                <select
                  name="island"
                  value={formData.island}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
                >
                  <option value="Jawa">Jawa</option>
                  <option value="Sumatera">Sumatera</option>
                  <option value="Maluku">Maluku</option>
                  <option value="Sulawesi">Sulawesi</option>
                  <option value="Nusa Tenggara">Nusa Tenggara</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Provinsi *</label>
                <input
                  type="text"
                  required
                  name="province"
                  placeholder="Jawa Barat"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Kabupaten / Kota *</label>
                <input
                  type="text"
                  required
                  name="regency"
                  placeholder="Kabupaten Bandung"
                  value={formData.regency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Deskripsi & Sumber */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Catatan Teknis & Deskripsi Lapangan
              </label>
              <textarea
                name="description"
                rows="2"
                placeholder="Catatan geologi, tahapan pengeboran tajak sumur, atau target COD..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Submit Actions */}
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
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan ke Basis Data SIG'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
