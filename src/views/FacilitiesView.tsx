import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Building, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const { facilities, schoolProfile, setActiveTab } = useApp();

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Sarana & Prasarana</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Fasilitas Pembelajaran Modern & Ramah Alam
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Menyediakan ruang ibadah yang tenang, kelas yang nyaman dan aman, laboratorium sains berteknologi, serta alam terbuka yang luas untuk menunjang tumbuh kembang ananda.
          </p>
        </div>

        {/* Facilities List */}
        <div className="space-y-10">
          {facilities.map((fac, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={fac.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 items-stretch"
              >
                {/* Photo Column */}
                <div className={`lg:col-span-6 relative min-h-[300px] lg:min-h-full bg-stone-100 ${isReversed ? 'lg:order-2' : ''}`}>
                  <img
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-emerald-800 text-white text-[11px] font-semibold px-3 py-1 rounded-lg shadow-sm">
                    {fac.category}
                  </div>
                </div>

                {/* Text Content Column */}
                <div className={`lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between ${isReversed ? 'lg:order-1' : ''}`}>
                  <div>
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                      Fasilitas Resmi Insan Harapan
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 mb-3 leading-snug">
                      {fac.name}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {fac.description}
                    </p>

                    <div className="space-y-2">
                      <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                        Keunggulan & Fitur Sarana:
                      </span>
                      {fac.features.map((item, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 text-xs text-stone-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Standar Keamanan Terverifikasi</span>
                    </span>
                    <button
                      onClick={() => setActiveTab('kontak')}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                    >
                      Jadwalkan Kunjungan Fisik &rarr;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* School Tour Callout in Fresh Green & Energetic Orange */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-900 text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-emerald-600/30">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2">
              Ingin Melihat Langsung Fasilitas Kampus?
            </h3>
            <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
              Kami menyambut hangat kedatangan Ayah dan Bunda untuk melakukan tur kampus sekolah, melihat kebun alam, ruang kelas, serta berkonsultasi langsung dengan kepala sekolah.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('kontak')}
            className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl text-xs sm:text-sm shrink-0 transition-all shadow-md shadow-orange-950/20 border border-orange-400/40"
          >
            Jadwalkan School Tour
          </button>
        </div>
      </div>
    </div>
  );
};
