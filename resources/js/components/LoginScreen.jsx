import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Building2,
  CheckCircle2,
  MapPin,
  Compass
} from 'lucide-react';

export default function LoginScreen({ onLoginSuccess, onGuestAccess, onBackToPublic }) {
  const [email, setEmail] = useState('admin@starenergy.co.id');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'geoscientist' | 'surveyor'

  const roleOptions = [
    {
      id: 'admin',
      name: 'Chief GIS Administrator',
      roleBadge: 'Super Admin',
      email: 'admin@starenergy.co.id',
      password: 'password123',
      layoutDesc: 'Sub Sistem Manajemen: Pengguna, Hak Akses RBAC, Audit Trail & Database Master',
      buttonText: 'Masuk ke Admin Console (Sidebar Slim Rail)'
    },
    {
      id: 'geoscientist',
      name: 'Lead Geoscientist',
      roleBadge: 'Supervisor & Analis',
      email: 'geologist@starenergy.co.id',
      password: 'password123',
      layoutDesc: 'Sub Sistem Analisis & Output: Verifikasi Temuan, Analisis Sesar, AMDAL 5 km & Laporan',
      buttonText: 'Masuk ke Supervisory & Geoscience Console'
    },
    {
      id: 'surveyor',
      name: 'Field Exploration Surveyor',
      roleBadge: 'Survei Lapangan',
      email: 'surveyor@starenergy.co.id',
      password: 'password123',
      layoutDesc: 'Sub Sistem Input: Pengukuran Lapangan, Ukur Jarak, Gambar Poligon Area & Plot GPS',
      buttonText: 'Masuk ke Field Exploration Workstation'
    }
  ];

  const handleSelectRole = (role) => {
    setSelectedRole(role.id);
    setEmail(role.email);
    setPassword(role.password);
    setErrorMessage('');
  };

  const submitLogin = async (loginEmail, loginPassword) => {
    setErrorMessage('');
    setIsLoading(true);

    const demoUsers = {
      'admin@starenergy.co.id': {
        id: 1,
        name: 'Alvin Pratama, S.T.',
        email: 'admin@starenergy.co.id',
        role: 'Chief GIS Administrator',
        department: 'Geospatial Strategy & Asset Intelligence',
        avatar_initials: 'AP',
      },
      'geoscientist@starenergy.co.id': {
        id: 2,
        name: 'Dr. Budi Santoso, M.T.',
        email: 'geoscientist@starenergy.co.id',
        role: 'Lead Exploration Geoscientist',
        department: 'Subsurface Exploration & Drilling',
        avatar_initials: 'BS',
      },
      'geologist@starenergy.co.id': {
        id: 3,
        name: 'Dr. Budi Santoso, M.T.',
        email: 'geologist@starenergy.co.id',
        role: 'Lead Geoscientist',
        department: 'Subsurface Exploration & Reservoir Engineering',
        avatar_initials: 'BS',
      },
      'reservoir@starenergy.co.id': {
        id: 4,
        name: 'Siti Rahmawati, M.Sc.',
        email: 'reservoir@starenergy.co.id',
        role: 'Senior Reservoir Engineer',
        department: 'Asset Optimization & Thermodynamic Modeling',
        avatar_initials: 'SR',
      },
      'surveyor@starenergy.co.id': {
        id: 5,
        name: 'Siti Rahmawati, M.Sc.',
        email: 'surveyor@starenergy.co.id',
        role: 'Field Exploration Surveyor',
        department: 'GIS Field Survey & Drone Mapping',
        avatar_initials: 'SR',
      },
    };

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Jika server menolak tapi merupakan akun demo resmi, lakukan fallback instan
        if (loginPassword === 'password123' && demoUsers[loginEmail]) {
          const fallbackUser = demoUsers[loginEmail];
          const authPayload = {
            user: fallbackUser,
            token: 'demo-token-' + Date.now(),
            loginAt: new Date().toISOString(),
          };
          if (rememberMe) {
            localStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
          } else {
            sessionStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
          }
          onLoginSuccess(fallbackUser);
          return;
        }

        throw new Error(data.message || 'Kombinasi email atau kata sandi tidak valid.');
      }

      const authPayload = {
        user: data.user,
        token: data.token,
        loginAt: new Date().toISOString(),
      };

      if (rememberMe) {
        localStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
      } else {
        sessionStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
      }

      onLoginSuccess(data.user);
    } catch (err) {
      // Fallback offline / network fail jika akun demo
      if (loginPassword === 'password123' && demoUsers[loginEmail]) {
        const fallbackUser = demoUsers[loginEmail];
        const authPayload = {
          user: fallbackUser,
          token: 'demo-token-' + Date.now(),
          loginAt: new Date().toISOString(),
        };
        if (rememberMe) {
          localStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
        } else {
          sessionStorage.setItem('seg_gis_auth', JSON.stringify(authPayload));
        }
        onLoginSuccess(fallbackUser);
        return;
      }

      setErrorMessage(err.message || 'Terjadi gangguan autentikasi server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Harap masukkan email dan kata sandi.');
      return;
    }
    submitLogin(email, password);
  };

  const currentRoleObj = roleOptions.find(r => r.id === selectedRole) || roleOptions[0];

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-slate-950 font-sans antialiased overflow-hidden select-none">
      
      {/* ======================================================== */}
      {/* SISI KIRI: GAMBAR FASILITAS SEPARATOR UAP SEBAGAI BACKGROUND */}
      {/* DILENGKAPI BADGE PERUSAHAAN & TELEMETRI GEOSPASIAL        */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[54%] xl:w-[56%] h-full relative flex flex-col justify-between p-6 sm:p-8 xl:p-10 overflow-hidden border-r border-slate-800">
        
        {/* Foto Background Separator Uap HD (Asli, Tajam & Penuh) */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hd_gallery/pltp_steam_pipeline_5k.jpg" 
            alt="Fasilitas Separator Uap & Lapangan Panas Bumi" 
            className="w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.03]"
          />
          {/* Scrim gradasi halus: bersih dan terang di atas/tengah, kontras di bawah untuk teks */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-slate-950/30 z-10" />
        </div>

        {/* Top Header di Bagian Gambar: Badge Perusahaan Resmi */}
        <div className="relative z-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/60 shadow-lg">
            <img 
              src="/logo_star_energy.png" 
              alt="Star Energy Geothermal" 
              className="h-8 w-auto object-contain" 
            />
            <div className="border-l border-slate-200 pl-3">
              <div className="text-[9px] font-bold tracking-wider text-blue-700 uppercase leading-none">
                Barito Renewables Group
              </div>
              <div className="text-xs font-extrabold text-slate-950 mt-0.5 leading-tight">
                Star Energy Geothermal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-[10px] font-mono text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">WGS 84 • EPSG:4326</span>
          </div>
        </div>

        {/* Bottom Narrative di Bagian Gambar: Deskripsi Elegan & Metrik */}
        <div className="relative z-20 max-w-xl text-white">
          <div className="flex items-center gap-2 text-[10px] font-mono text-blue-300 font-bold uppercase tracking-wider mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            <span>Pangkalan Data Geospasial Panas Bumi Nasional</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
            Sistem Informasi Geografis & Manajemen Aset Panas Bumi Terpadu
          </h2>

          <p className="mt-1.5 text-slate-200 text-xs leading-relaxed max-w-lg">
            Platform pemetaan spasial konsesi Wilayah Kerja Panas Bumi (WKP), transmisi uap, dan analisis zona penyangga konservasi lingkungan AMDAL.
          </p>

          {/* Baris Metrik Minimalis */}
          <div className="mt-4 pt-3.5 border-t border-white/20 grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-300 block text-[9px] font-medium uppercase">Kapasitas Star Energy</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                882.0 <span className="text-[10px] font-normal text-blue-300">MW</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Wayang Windu, Salak & Darajat</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-300 block text-[9px] font-medium uppercase">Pangsa Pasar Nasional</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                45.69 <span className="text-[10px] font-normal text-blue-300">%</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Portofolio Terbesar di RI</span>
            </div>

            <div className="bg-slate-950/60 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              <span className="text-slate-300 block text-[9px] font-medium uppercase">Integrasi Wilayah</span>
              <span className="text-base font-extrabold text-white mt-0.5 block">
                27 <span className="text-[10px] font-normal text-blue-300">WKP</span>
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Titik Lapangan Terpetakan</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* SISI KANAN: FORM LOGIN BERSIH & NYAMAN (PUTIH)           */}
      {/* POSISI ERGONOMIS: MUDAH DIISI, TIDAK MEMBINGUNGKAN       */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[46%] xl:w-[44%] h-full flex flex-col justify-between p-6 sm:p-8 xl:p-10 bg-white relative z-20 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            PORTAL OTENTIKASI RESMI
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            SNI 5015:2019
          </span>
        </div>

        {/* Central Form Container */}
        <div className="my-auto max-w-sm w-full mx-auto py-2">
          
          <div className="mb-4">
            <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight">
              Masuk ke Sistem
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Pilih peranan akses untuk menyesuaikan tata letak kerja spasial Anda:
            </p>
          </div>

          {/* 3 Role Selection Cards */}
          <div className="space-y-2 mb-4">
            {roleOptions.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                  }`}
                >
                  {/* Radio Indicator */}
                  <div className="mt-0.5 shrink-0">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Role Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                        {role.name}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                        isSelected 
                          ? 'bg-blue-100 text-blue-700 border-blue-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {role.roleBadge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      {role.layoutDesc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form Credentials */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors font-sans"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Kata Sandi
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Demo: password123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors font-sans"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-600">Ingat sesi di perangkat ini</span>
              </label>
            </div>

            {/* Tombol Masuk Utama */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi Otorisasi...</span>
                </>
              ) : (
                <>
                  <span>{currentRoleObj.buttonText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Back to Public Education & Guest Link */}
          <div className="mt-3.5 space-y-1 text-center">
            {onBackToPublic && (
              <button
                type="button"
                onClick={onBackToPublic}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors block w-full"
              >
                ← Kembali ke Halaman Edukasi Publik
              </button>
            )}
            <button
              type="button"
              onClick={onGuestAccess}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-700 transition-colors block w-full"
            >
              Lanjutkan sebagai Tamu (Mode Peta Cepat) →
            </button>
          </div>

        </div>

        {/* Bottom Corporate Footer */}
        <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between">
          <span>PT Star Energy Geothermal • Barito Renewables Group</span>
          <span className="font-mono text-slate-600">© 2026</span>
        </div>

      </div>

    </div>
  );
}
