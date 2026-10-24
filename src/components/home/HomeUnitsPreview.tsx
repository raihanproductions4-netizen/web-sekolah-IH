import React from 'react';
import { useApp } from '../../context/AppContext';
import { EducationalUnitType } from '../../types';
import { ArrowRight, CheckCircle2, Sparkles, GraduationCap } from 'lucide-react';

export const HomeUnitsPreview: React.FC = () => {
  const { units, navigateToUnit, setActiveTab, setSelectedUnitId } = useApp();

  const handleRegisterUnit = (unitId: EducationalUnitType) => {
    setSelectedUnitId(unitId);
    setActiveTab('ppdb');
  };

  return (
    <section className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Jenjang Pendidikan Terpadu</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight text-balance mb-4">
            Tiga Jenjang Pembinaan Berkesinambungan
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Mulai dari meletakkan fondasi fitrah di usia dini (RAIT), menguatkan akhlak dan literasi sains di sekolah dasar (SDIT), hingga membentuk pemimpin cendekia di sekolah menengah (SMPIT).
          </p>
        </div>

        {/* 3 Unit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Image Preview with Fallback */}
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src={unit.image}
                  alt={unit.fullName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized container if path fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-[11px] font-bold text-orange-300 uppercase tracking-wider block">
                      {unit.ageRange}
                    </span>
                    <h3 className="font-bold text-lg text-white leading-tight">
                      {unit.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-stone-950 font-bold text-[10px] uppercase">
                    Terakreditasi
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 mb-2">
                    {unit.fullName}
                  </p>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {unit.description}
                  </p>

                  {/* Highlights list with fresh light green checkmarks */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Keunggulan Unit:
                    </span>
                    {unit.highlights.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => navigateToUnit(unit.id)}
                    className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1.5 py-1.5 group-hover:underline"
                  >
                    <span>Kurikulum & Profil</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRegisterUnit(unit.id)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] rounded-xl transition-all shadow-sm shadow-orange-500/20 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
                    <span>Daftar {unit.id.toUpperCase()}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
