import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  MapPin, 
  Thermometer, 
  Clock, 
  User, 
  FileText, 
  Camera, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function LeadSupervisionModal({ 
  isOpen, 
  onClose, 
  currentUser,
  surveyorDraftPoints = [], 
  surveyorPolygons = [], 
  onApprovePoint, 
  onRejectPoint, 
  onApprovePolygon, 
  onRejectPolygon,
  onInspectPolygon
}) {
  const [activeTab, setActiveTab] = useState('polygons'); // 'polygons' | 'points'

  if (!isOpen) return null;

  const userRoleLower = (currentUser?.role || '').toLowerCase();
  const isLead = userRoleLower.includes('lead') || userRoleLower.includes('geoscientist');
  const isSurveyor = userRoleLower.includes('surveyor');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-slate-900 select-text">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-[#f8f8f5] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#121316] text-[#d8f537]">
                {isSurveyor 
                  ? 'SUB SISTEM INPUT: STATUS PENGAJUAN LAPANGAN' 
                  : 'SUB SISTEM ANALISIS: SUPERVISI & APPROVAL'}
              </span>
              {isSurveyor && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  Mode Pantau (Hanya Baca)
                </span>
              )}
            </div>
            <h3 className="text-xl font-black text-slate-950">
              {isSurveyor 
                ? 'Status & Riwayat Pengajuan Lapangan Saya' 
                : 'Antrean Verifikasi Temuan Surveyor Lapangan'}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {isSurveyor
                ? 'Daftar pengajuan poligon area dan titik manifestasi yang Anda kirimkan untuk diverifikasi oleh Lead Geoscientist.'
                : 'Evaluasi keabsahan data spasial, luas area poligon, dan verifikasi AMDAL sebelum disinkronkan ke Basis Data Master.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-black border border-slate-200 flex items-center justify-center transition-colors shadow-2xs shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigators */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('polygons')}
            className={`py-2 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'polygons'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Poligon Area Lapangan ({surveyorPolygons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('points')}
            className={`py-2 px-4 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'points'
                ? 'border-blue-600 text-blue-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Titik GPS & Manifestasi ({surveyorDraftPoints.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* TAB 1: POLIGON AREA */}
          {activeTab === 'polygons' && (
            <div className="space-y-3">
              {surveyorPolygons.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Belum ada pengajuan poligon area dari Surveyor.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Surveyor dapat menggambar batas area menggunakan alat ukur poligon di atas peta.</p>
                </div>
              ) : (
                surveyorPolygons.map((poly) => (
                  <div key={poly.id} className="p-4 rounded-2xl border border-slate-200 bg-[#f8f8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-slate-950">{poly.name}</span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                          poly.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {poly.status === 'Approved' ? '✓ Disetujui Lead' : '⏳ Menunggu Review Lead'}
                        </span>
                        {poly.amdalResult && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            AMDAL Lolos ({poly.amdalResult.score || '98.8%'})
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-mono">
                        <span>Luas: <strong className="text-blue-700">{poly.areaHectares} Ha</strong> ({Math.round(poly.areaSqMeters || 0).toLocaleString()} m²)</span>
                        <span>Titik Simpul: <strong>{poly.coordinates?.length || 0} vertices</strong></span>
                        <span>Surveyor: <strong>{poly.createdBy || 'Surveyor'}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onInspectPolygon && (
                        <button
                          onClick={() => onInspectPolygon(poly)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
                        >
                          Lihat di Peta &rarr;
                        </button>
                      )}

                      {/* JIKA LEAD: TAMPILKAN TOMBOL APPROVE & KEMBALIKAN */}
                      {isLead ? (
                        <>
                          {poly.status !== 'Approved' && (
                            <button
                              onClick={() => onApprovePolygon(poly.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-2xs text-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Setujui (Approve)</span>
                            </button>
                          )}

                          <button
                            onClick={() => onRejectPolygon(poly.id)}
                            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors text-xs"
                          >
                            Kembalikan
                          </button>
                        </>
                      ) : (
                        /* JIKA SURVEYOR / ROLE LAIN: HANYA TAMPILKAN STATUS BADGE READ-ONLY */
                        <div className="text-right">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${
                            poly.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {poly.status === 'Approved' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Telah Di-ACC Lead</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Menunggu ACC Lead</span>
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: TITIK GPS & FOTO */}
          {activeTab === 'points' && (
            <div className="space-y-3">
              {surveyorDraftPoints.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Belum ada pengajuan titik manifestasi dari Surveyor.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Surveyor dapat menginput titik GPS manifestasi melalui form input lapangan.</p>
                </div>
              ) : (
                surveyorDraftPoints.map((pt) => (
                  <div key={pt.id} className="p-4 rounded-2xl border border-slate-200 bg-[#f8f8f5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                        <img 
                          src={pt.photoUrl || '/hd_gallery/wayang_windu_pipelines_hd.jpg'} 
                          alt="Foto" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-sm text-slate-950">{pt.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            pt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {pt.status === 'Approved' ? '✓ Disetujui Lead' : '⏳ Menunggu Review Lead'}
                          </span>
                          {pt.amdalResult && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              AMDAL Lolos
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-[11px] text-slate-600 font-mono">
                          <span>{pt.latitude ? parseFloat(pt.latitude).toFixed(5) : '0'}° S, {pt.longitude ? parseFloat(pt.longitude).toFixed(5) : '0'}° E</span>
                          <span className="mx-2">•</span>
                          <span className="text-amber-700 font-bold">{pt.temperature || pt.reservoir_temp_celsius || '-'} °C</span>
                          <span className="mx-2">•</span>
                          <span>{pt.type || 'Titik Survei'}</span>
                        </div>

                        {pt.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">
                            "{pt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {onInspectPolygon && (
                        <button
                          onClick={() => onInspectPolygon(poly)}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 transition-colors shadow-2xs"
                        >
                          Lihat di Peta &rarr;
                        </button>
                      )}

                      {/* JIKA LEAD: TAMPILKAN TOMBOL APPROVE & KEMBALIKAN */}
                      {isLead ? (
                        <>
                          {pt.status !== 'Approved' && (
                            <button
                              onClick={() => onApprovePoint(pt.id)}
                              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-2xs text-xs"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Setujui (Approve)</span>
                            </button>
                          )}

                          <button
                            onClick={() => onRejectPoint(pt.id)}
                            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 transition-colors text-xs"
                          >
                            Kembalikan
                          </button>
                        </>
                      ) : (
                        /* JIKA SURVEYOR / ROLE LAIN: HANYA TAMPILKAN STATUS BADGE READ-ONLY */
                        <div className="text-right">
                          <span className={`px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 ${
                            pt.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {pt.status === 'Approved' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Telah Di-ACC Lead</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Menunggu ACC Lead</span>
                              </>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-[#f8f8f5] flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {isSurveyor 
              ? 'Kewenangan Persetujuan: Hanya Lead Geoscientist yang berhak memvalidasi & menyetujui (ACC).'
              : 'Kewenangan Lead Geoscientist: Memvalidasi integritas data geodetik dan geokimia sebelum masuk database nasional.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-black transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
}
