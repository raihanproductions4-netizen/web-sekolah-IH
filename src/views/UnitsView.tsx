import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationalUnitType } from '../types';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Download,
  MessageCircle,
  ArrowRight,
  Target,
  FileCheck
} from 'lucide-react';

export const UnitsView: React.FC = () => {
  const { units, selectedUnitId, setSelectedUnitId, setActiveTab, generateWhatsAppUrl, showToast } = useApp();
  const [downloadModalUnit, setDownloadModalUnit] = useState<string | null>(null);

  const currentUnit = units.find((u) => u.id === selectedUnitId) || units[1]; // default SDIT

  const handleDownloadBrochure = (unitName: string) => {
    // Generate brochure dialog
    setDownloadModalUnit(unitName);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Unit Pendidikan Terpadu</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Eksplorasi Kurikulum & Jenjang Pendidikan
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Pilihlah jenjang pendidikan yang sesuai dengan tahap tumbuh kembang ananda untuk melihat kurikulum, jadwal harian, dan target capaian lulusan.
          </p>
        </div>

        {/* Unit Selector Segmented Control (Tabs) */}
        <div className="flex justify-center">
          <div className="p-1.5 bg-stone-200/80 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 shadow-inner max-w-xl w-full">
            {units.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                  selectedUnitId === unit.id
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
                }`}
              >
                <span>{unit.name}</span>
                <span className={`text-[10px] ${selectedUnitId === unit.id ? 'text-orange-200 font-medium' : 'text-stone-500'}`}>
                  {unit.id === 'rait' ? 'PAUD/TK IT' : unit.id === 'sdit' ? 'Sekolah Dasar' : 'SMP IT'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Unit Detailed Showcase Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Unit Hero Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch border-b border-stone-200">
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-3">
                  <span>{currentUnit.fullName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-orange-500 font-bold bg-orange-50 px-2 py-0.5 rounded-md">{currentUnit.ageRange}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
                  {currentUnit.name}
                </h2>
                <p className="text-base font-semibold text-emerald-700 mb-4 italic">
                  "{currentUnit.tagline}"
                </p>
                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                  {currentUnit.description}
                </p>

                {/* Key Highlights with Fresh Light Green Checkmarks */}
                <div className="space-y-2.5">
                  {currentUnit.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedUnitId(currentUnit.id);
                    setActiveTab('ppdb');
                  }}
                  className="px-5 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-orange-500/25 flex items-center gap-2 border border-orange-400/40"
                >
                  <Sparkles className="w-4 h-4 text-emerald-100" />
                  <span>Daftar {currentUnit.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={generateWhatsAppUrl(`Assalamu'alaikum Admin PPDB Insan Harapan, saya ingin bertanya rincian informasi dan syarat pendaftaran untuk unit ${currentUnit.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl text-xs sm:text-sm border border-emerald-300 transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tanya WhatsApp</span>
                </a>

                <button
                  onClick={() => handleDownloadBrochure(currentUnit.name)}
                  className="px-4 py-3 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl text-xs sm:text-sm border border-stone-300 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-stone-500" />
                  <span>Unduh Brosur & Kurikulum</span>
                </button>
              </div>
            </div>

            {/* Photo Column */}
            <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full bg-stone-100">
              <img
                src={currentUnit.image}
                alt={currentUnit.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs bg-emerald-700/90 backdrop-blur-sm px-2.5 py-1 rounded-md font-semibold">
                  Dokumentasi Autentik
                </span>
                <p className="text-xs mt-2 text-stone-200">
                  Aktivitas belajar nyata santri di lingkungan SIT Insan Harapan Batam.
                </p>
              </div>
            </div>
          </div>

          {/* Curriculum & Daily Routine Columns */}
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-stone-50/50">
            {/* Left: Kurikulum & Pendekatan */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  Struktur Kurikulum & Metode Belajar
                </h3>
              </div>

              <div className="space-y-4">
                {currentUnit.curriculum.map((curr, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <h4 className="font-bold text-sm text-emerald-900 mb-1.5">
                      {curr.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {curr.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Daily Routine Timeline */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  Jadwal & Rutinitas Pembiasaan Harian
                </h3>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
                {currentUnit.dailyRoutine.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-3 border-b border-stone-100 last:border-b-0 last:pb-0">
                    <span className="font-mono text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md shrink-0">
                      {item.time}
                    </span>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {item.activity}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Target Capaian & Standar Lulusan */}
          <div className="p-8 sm:p-12 border-t border-stone-200 bg-emerald-900 text-white">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800 text-amber-300 rounded-lg text-xs font-semibold mb-2">
                <Target className="w-4 h-4" />
                <span>Standar Mutu Lulusan</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">
                Target Capaian Santri {currentUnit.name}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                Setiap santri didampingi hingga mencapai indikator kelulusan yang telah divalidasi oleh dewan asatidz dan standar JSIT:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentUnit.targetCompetencies.map((comp, idx) => (
                <div key={idx} className="bg-emerald-800/80 border border-emerald-700/60 p-4 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-stone-100">
                  <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{comp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Unduh Brosur Interaktif */}
        {downloadModalUnit && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Brosur & Panduan Silabus {downloadModalUnit}
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Dokumen panduan resmi berisi kurikulum terintegrasi, kalender akademik, biaya rincian, dan tata tertib santri SIT Insan Harapan Batam.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
                <p><strong>Format:</strong> Digital PDF Guidebook (T.A. 2026/2027)</p>
                <p><strong>Penerbit:</strong> Divisi Kurikulum Insan Harapan Batam</p>
                <p><strong>Status:</strong> Edisi Terverifikasi</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    showToast(`Brosur resmi ${downloadModalUnit} siap diunduh! Silakan hubungi admin untuk versi cetak lengkap.`, 'success');
                    setDownloadModalUnit(null);
                  }}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Simpan Panduan</span>
                </button>
                <button
                  onClick={() => setDownloadModalUnit(null)}
                  className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
