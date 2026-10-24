import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProgramItem } from '../types';
import {
  BookOpen,
  HeartHandshake,
  Trees,
  Cpu,
  Lightbulb,
  ShieldCheck,
  Trophy,
  HandHelping,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ProgramsView: React.FC = () => {
  const { programs, setActiveTab } = useApp();
  const [selectedProgram, setSelectedProgram] = useState<ProgramItem | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Semua');

  const categories = ['Semua', 'Al-Qur\'an & Ibadah', 'Karakter', 'Lingkungan & Sains', 'Teknologi & Digital', 'Akademik', 'Kemandirian', 'Bakat & Minat', 'Sosial Kemanusiaan'];

  const getIcon = (name: string) => {
    switch (name) {
      case 'BookOpen': return BookOpen;
      case 'HeartHandshake': return HeartHandshake;
      case 'Trees': return Trees;
      case 'Cpu': return Cpu;
      case 'Lightbulb': return Lightbulb;
      case 'ShieldCheck': return ShieldCheck;
      case 'Trophy': return Trophy;
      default: return HandHelping;
    }
  };

  const filteredPrograms = activeCategoryFilter === 'Semua'
    ? programs
    : programs.filter((p) => p.category === activeCategoryFilter);

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Kurikulum Berbasis Karakter</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Program Unggulan Sekolah Islam Terpadu
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menyiapkan generasi masa depan dengan keterpaduan pendidikan ruhiyah Al-Qur'an, adab mulia, riset alam, dan teknologi informasi mutakhir.
          </p>
        </div>

        {/* Filter Bar (Interactive Buttons in Fresh Green) */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategoryFilter === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:text-orange-600 hover:bg-orange-50/50 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((prog) => {
            const Icon = getIcon(prog.iconName);
            return (
              <div
                key={prog.id}
                className="bg-white rounded-3xl border border-stone-200 p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-md">
                      {prog.targetUnit}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                    {prog.category}
                  </span>

                  <h3 className="font-bold text-lg text-stone-900 mb-3 group-hover:text-emerald-900 transition-colors leading-snug">
                    {prog.title}
                  </h3>

                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {prog.shortDesc}
                  </p>

                  {/* Outcomes Preview */}
                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Target Capaian:
                    </span>
                    {prog.outcomes.slice(0, 3).map((out, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{out}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5"
                  >
                    <span>Baca Detail Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setActiveTab('ppdb')}
                    className="text-[11px] text-stone-500 hover:text-emerald-700 font-medium"
                  >
                    Daftar PPDB
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Program Detail Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    {React.createElement(getIcon(selectedProgram.iconName), { className: 'w-6 h-6' })}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 block">
                      {selectedProgram.category} · {selectedProgram.targetUnit}
                    </span>
                    <h3 className="text-xl font-bold text-stone-900 leading-tight">
                      {selectedProgram.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                <p>{selectedProgram.fullDesc}</p>
              </div>

              <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-100 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900">
                  Indikator Capaian Santri
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-800">
                  {selectedProgram.outcomes.map((out, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{out}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    setActiveTab('ppdb');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Daftarkan Ananda untuk Program Ini</span>
                </button>

                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900 font-medium"
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
