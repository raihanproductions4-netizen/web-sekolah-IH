import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, MessageCircle, FileText, CheckCircle2 } from 'lucide-react';

export const HomePPDBBanner: React.FC = () => {
  const { setActiveTab, generateWhatsAppUrl } = useApp();

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-800 via-green-700 to-teal-950 text-white relative overflow-hidden">
      {/* Subtle decorative background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PENERIMAAN PESERTA DIDIK BARU (PPDB) T.A. 2026/2027</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Kesiapan Masa Depan Ananda Dimulai dari Sekarang
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
              Pendaftaran Gelombang I telah dibuka untuk jenjang RAIT (TK IT), SDIT, dan SMPIT Insan Harapan Batam. Dapatkan penawaran early-bird dan kemudahan observasi fitrah anak.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-stone-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-300" />
                <span>Kuota Kelas Terbatas</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Formulir Pendaftaran Online</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-300" />
                <span>Konsultasi Syarat Fleksibel</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('ppdb')}
              className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-950/30 flex items-center justify-center gap-2 whitespace-nowrap border border-orange-400/40"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Daftar Online Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={generateWhatsAppUrl("Assalamu'alaikum Panitia PPDB Insan Harapan Batam, saya ingin berkonsultasi mengenai pendaftaran PPDB 2026/2027.")}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-emerald-700/80 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold rounded-xl text-sm border border-emerald-400/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-orange-300" />
              <span>Konsultasi WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
