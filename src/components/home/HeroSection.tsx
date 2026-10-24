import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Phone,
  ShieldCheck,
  Trees,
  Compass,
  Cpu
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { setActiveTab, schoolProfile } = useApp();

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white">
      {/* Background Image with Measured Scrim for WCAG AA Contrast */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_school_campus_1792641892359.jpg"
          alt="Kampus SIT Insan Harapan Batam"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/80 to-stone-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
      </div>

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
        <div className="max-w-3xl">
          {/* Unboxed inline kicker with fresh light green & orange accent */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-stone-950 font-bold text-[11px]">
              SIT Insan Harapan Batam
            </span>
            <span aria-hidden="true" className="text-orange-400">·</span>
            <span className="text-orange-400 font-bold">RAIT · SDIT · SMPIT</span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <span className="text-stone-300">Tahun Ajaran 2026/2027</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-tight mb-6">
            SELAMAT DATANG DI <span className="text-emerald-400">INSAN HARAPAN</span> <span className="text-orange-400">BATAM</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-stone-200 font-normal leading-relaxed mb-8 max-w-2xl">
            Membangun <span className="text-emerald-300 font-semibold">Generasi Qurani</span>, <span className="text-orange-300 font-semibold">Kreatif</span>, dan <span className="text-amber-300 font-semibold">Entrepreneur</span> yang siap memimpin masa depan melalui keterpaduan kurikulum Al-Qur'an, pembelajaran berbasis alam, dan penguasaan sains teknologi.
          </p>

          {/* 3 Action Buttons with Light Green and Orange Harmony */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('ppdb')}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2 whitespace-nowrap border border-orange-400/40"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Daftar PPDB Online</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('profil')}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-950/20 flex items-center gap-2 whitespace-nowrap border border-emerald-400/40"
            >
              <BookOpen className="w-4 h-4 text-orange-200" />
              <span>Mengenal Sekolah</span>
            </button>

            <button
              onClick={() => setActiveTab('kontak')}
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-medium rounded-xl text-sm border border-white/25 transition-all flex items-center gap-2 whitespace-nowrap backdrop-blur-xs"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Hubungi Kami</span>
            </button>
          </div>

          {/* Quick institutional accreditation notes */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Afiliasi JSIT Indonesia</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-400" />
              <span>Izin Resmi & Akreditasi A</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Kurikulum Berbasis Alam</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4-Item Feature Strip Below Hero (Full-width clean row) */}
      <div className="relative z-10 border-t border-white/10 bg-stone-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-300">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-900/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Tahfiz Al-Qur'an Bersanad</h4>
                <p className="text-[11px] text-stone-400">Target bertahap juz amma hingga 10 juz</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-950/80 border border-orange-500/50 flex items-center justify-center shrink-0 text-orange-400">
                <Trees className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Nature School & Eco Lab</h4>
                <p className="text-[11px] text-stone-400">Belajar langsung di kebun & alam terbuka</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-900/80 border border-emerald-500/50 flex items-center justify-center shrink-0 text-emerald-300">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">STEM & Robotika Santri</h4>
                <p className="text-[11px] text-stone-400">Keterampilan coding & sains abad ke-21</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-950/80 border border-orange-500/50 flex items-center justify-center shrink-0 text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Adab & Akhlak 24 Jam</h4>
                <p className="text-[11px] text-stone-400">Sinergi buku mutabaah ibadah bersama ortu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
