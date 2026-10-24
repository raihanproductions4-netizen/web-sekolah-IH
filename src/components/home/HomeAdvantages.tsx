import React from 'react';
import {
  BookOpenCheck,
  Trees,
  Scroll,
  HeartHandshake,
  Cpu,
  Users2
} from 'lucide-react';

export const HomeAdvantages: React.FC = () => {
  const advantages = [
    {
      icon: BookOpenCheck,
      title: "Kurikulum Islam Terpadu & Nasional",
      desc: "Menyinergikan standar Kurikulum Merdeka Kemendikbudristek dengan Kurikulum JSIT Indonesia, memadukan ilmu sains dengan nilai ketauhidan secara utuh."
    },
    {
      icon: Trees,
      title: "Konsep Nature School & Eco-Campus",
      desc: "Lingkungan hijau tropis Batam difungsikan sebagai laboratorium hidup. Siswa belajar biologi, bercocok tanam hidroponik, dan merawat alam secara nyata."
    },
    {
      icon: Scroll,
      title: "Tahfiz Al-Qur'an Bertarget & Bersanad",
      desc: "Program hafalan terstruktur dengan bimbingan talaqqi dari asatidz berkualifikasi qiraah tartil, diuji melalui tasmi' terbuka sekali duduk berjenjang."
    },
    {
      icon: HeartHandshake,
      title: "Pembiasaan Adab & Akhlak Mulia 24 Jam",
      desc: "Membangun budaya salam, shalat berjamaah tepat waktu, birrul walidain, dan anti-bullying melalui buku mutabaah ibadah terhubung dengan orang tua."
    },
    {
      icon: Cpu,
      title: "Smart Digital Learning & STEM Robotika",
      desc: "Membekali santri keterampilan coding dasar, perakitan robotik ramah anak, dan etika pemanfaatan teknologi digital untuk masa depan."
    },
    {
      icon: Users2,
      title: "Rasio Guru & Santri Proporsional",
      desc: "Memastikan setiap anak mendapatkan perhatian individual, pendampingan fitrah belajar, serta bimbingan konseling dan minat bakat secara intensif."
    }
  ];

  return (
    <section className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Keunggulan Pendidikan</span>
            <span aria-hidden="true">·</span>
            <span>Mengapa Memilih Kami</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight text-balance mb-4">
            Fondasi Pendidikan Holistik untuk Generasi Masa Depan
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Kami memadukan kecerdasan spiritual, intelektual, emosional, dan kepedulian lingkungan agar ananda tumbuh menjadi insan muttaqin yang tangguh di dunia nyata.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            const isOrangeTheme = idx % 2 === 1;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all duration-300 group flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors shrink-0 shadow-sm ${
                    isOrangeTheme
                      ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white'
                      : 'bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-stone-900 mb-2 leading-snug group-hover:text-emerald-900 transition-colors">
                  {adv.title}
                </h3>
                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                  {adv.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
