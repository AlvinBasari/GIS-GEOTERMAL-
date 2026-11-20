import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Table as TableIcon, 
  PlusCircle, 
  GraduationCap, 
  RefreshCw,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  onOpenAddModal, 
  onOpenAcademicModal,
  onRefreshData,
  isLoading,
  sitesCount,
  starOperatingMW,
  starSharePercent,
  currentUser,
  onOpenAdminPanel,
  onOpenLogin,
  onLogout
}) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="bg-[#0c111a] border-b border-slate-800 text-slate-100 z-50 sticky top-0 px-4 lg:px-6 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        
        {/* Brand & Corporate Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#070b12] px-2.5 py-1 rounded-lg border border-slate-800">
            <img 
              src="/logo_star_energy.png" 
              alt="Star Energy Geothermal" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm sm:text-base text-white">
                STAR ENERGY GEOTHERMAL
              </span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                WEB-GIS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Sistem Informasi Geografis & Analisis Spasial Panas Bumi Nasional • Barito Renewables
            </p>
          </div>
        </div>

        {/* View Switcher: SOBER & UNIFIED PALETTE (No rainbow norak buttons) */}
        <div className="flex items-center bg-[#070b12] p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setCurrentView('leaflet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentView === 'leaflet'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Peta Wilayah</span>
          </button>

          <button
            onClick={() => setCurrentView('kepler')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentView === 'kepler'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Kepler.gl 3D</span>
          </button>

          <button
            onClick={() => setCurrentView('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              currentView === 'table'
                ? 'bg-slate-800 text-white font-semibold border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5 text-slate-300" />
            <span>Tabel Data ({sitesCount})</span>
          </button>
        </div>

        {/* Right Section: Admin, Academic, Add Site, User Profile */}
        <div className="flex items-center gap-2">
          
          {/* Admin Panel Button */}
          <button
            onClick={onOpenAdminPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#111927] hover:bg-[#182337] text-slate-200 border border-slate-700/80 transition-colors"
            title="Panel Kontrol Administrator & Analisis Buffer AMDAL"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Panel Admin SIG</span>
          </button>

          {/* Academic Docs Pill */}
          <button
            onClick={onOpenAcademicModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#111927] hover:bg-[#182337] text-slate-300 border border-slate-700/80 transition-colors"
            title="Spesifikasi Akademis & Landasan Teori SIG"
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>Dokumen SIG</span>
          </button>

          {/* Refresh Data */}
          <button
            onClick={onRefreshData}
            disabled={isLoading}
            className="p-2 rounded-lg bg-[#111927] hover:bg-[#182337] text-slate-300 border border-slate-700/80 transition-colors disabled:opacity-50"
            title="Sinkronisasi Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {/* Add Site */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2]" />
            <span className="hidden sm:inline">Input Titik</span>
          </button>

          {/* User Account / Profile Dropdown */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-[#111927] hover:bg-[#182337] border border-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded bg-emerald-900 border border-emerald-700 text-emerald-200 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.avatar_initials || 'AP'}
                </div>
                <span className="text-xs font-medium text-slate-200 hidden md:inline max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0e1422] border border-slate-700 shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-800">
                    <div className="font-bold text-slate-200 truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</div>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[9px] font-mono border border-slate-700">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAdminPanel();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Panel Administrator SIG</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenAcademicModal();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200 lg:hidden"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dokumen SIG</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-950/40 text-red-300 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              Masuk
            </button>
          )}

        </div>

      </div>
    </header>
  );
}
