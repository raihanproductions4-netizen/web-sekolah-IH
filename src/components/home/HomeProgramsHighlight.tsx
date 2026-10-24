import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  HeartHandshake,
  Trees,
  Cpu,
  Lightbulb,
  ShieldCheck,
  Trophy,
  HandHelping,
  ArrowRight
} from 'lucide-react';

export const HomeProgramsHighlight: React.FC = () => {
  const { programs, setActiveTab } = useApp();

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

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              <span>Program Pendidikan</span>
              <span aria-hidden="true">·</span>
              <span>Karakter & Potensi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight text-balance">
              Program Unggulan Insan Harapan
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Disusun secara berjenjang untuk memastikan keseimbangan aspek ruhiyah, intelektual, fisik, dan sosial kemasyarakatan santri.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('program')}
            className="self-start md:self-auto px-4 py-2.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <span>Lihat Semua 8 Program</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.slice(0, 8).map((prog, idx) => {
            const Icon = getIcon(prog.iconName);
            const isOrange = idx % 2 === 1;
            return (
              <div
                key={prog.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                    isOrange ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
                    {prog.category}
                  </span>
                  <h3 className="font-bold text-sm text-stone-900 mb-2 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-stone-600 text-xs leading-relaxed line-clamp-3">
                    {prog.shortDesc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-medium">
                    {prog.targetUnit}
                  </span>
                  <button
                    onClick={() => setActiveTab('program')}
                    className="text-xs font-bold text-emerald-700 hover:text-orange-600 flex items-center gap-1 transition-colors"
                  >
                    <span>Detail</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
