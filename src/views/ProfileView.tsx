import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  CheckCircle2,
  ShieldCheck,
  Award,
  Users,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { schoolProfile, setActiveTab } = useApp();

  const culturalValues = [
    {
      title: "Qurani (Berpegang Teguh pada Al-Qur'an & Sunnah)",
      desc: "Menjadikan kalam Allah sebagai pedoman hidup, mengutamakan adab, serta membiasakan tilawah dan hafalan mutqin setiap hari."
    },
    {
      title: "Cendekia & Berpikir Kritis",
      desc: "Menumbuhkan daya nalar saintifik, rasa ingin tahu yang tinggi, serta kecakapan mengolah informasi secara cerdas dan bijak."
    },
    {
      title: "Mandiri & Berkarakter Juara",
      desc: "Melatih anak bertanggung jawab atas diri sendiri, memiliki ketangguhan mental, sportivitas, dan integritas kejujuran."
    },
    {
      title: "Ramah Lingkungan & Peduli Alam",
      desc: "Menyadari peran manusia sebagai khalifah yang berkewajiban merawat keasrian bumi, menghemat energi, dan menjaga ekosistem."
    },
    {
      title: "Sinergis & Berjiwa Sosial",
      desc: "Menjalin ukhuwah islamiyah yang erat, berempati pada sesama, serta siap berkontribusi positif bagi masyarakat Batam dan bangsa."
    }
  ];

  const organizationRoles = [
    { role: "Ketua Dewan Pembina Yayasan", name: "Drs. H. M. Syarifuddin, M.Si", note: "Pengawas Kebijakan & Strategi" },
    { role: "Direktur Pendidikan SIT Insan Harapan", name: schoolProfile.headmasterName, note: "Pimpinan Operasional Lembaga" },
    { role: "Kepala Sekolah RAIT", name: "Ustadzah Siti Maryam, S.Pd.I", note: "Pendidikan Usia Dini & Fitrah" },
    { role: "Kepala Sekolah SDIT", name: "Ustadz H. Ridwan Hakim, M.Pd", note: "Sekolah Dasar & Nature Lab" },
    { role: "Kepala Sekolah SMPIT", name: "Ustadz Faisal Rahman, S.Si", note: "Sekolah Menengah & STEM" },
    { role: "Koordinator Tahfiz & Al-Qur'an", name: "Al-Hafiz Ust. Zulkifli, Lc", note: "Penjamin Mutu Sanad Qiraah" }
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-3">
              <span>Profil Lembaga</span>
              <span aria-hidden="true">·</span>
              <span>SIT Insan Harapan Batam</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
              Membangun Generasi Madani yang Berakar Al-Qur'an dan Menjulang di Sains
            </h1>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              Mengenal lebih dekat visi, misi, sejarah, filosofi pendidikan Islam Terpadu, serta komitmen kami dalam melahirkan generasi unggul bagi umat dan bangsa di Kota Batam.
            </p>
          </div>
        </div>

        {/* Sambutan Pimpinan Lembaga */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="w-40 h-40 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-800 overflow-hidden mb-4 shadow-md">
              <GraduationCap className="w-20 h-20 text-emerald-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg leading-snug">
              {schoolProfile.headmasterName}
            </h3>
            <span className="text-xs text-emerald-800 font-medium mt-1">
              {schoolProfile.headmasterTitle}
            </span>
            <span className="text-[11px] text-stone-500 mt-0.5">
              {schoolProfile.foundationName}
            </span>
          </div>

          <div className="lg:col-span-8 lg:border-l lg:border-stone-200 lg:pl-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Sambutan Pimpinan Lembaga</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              "Menyiapkan Pemimpin Shalih di Era Kecerdasan Digital"
            </h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-3">
              <p>{schoolProfile.headmasterWelcome}</p>
              <p>
                Melalui sinergi erat antara sekolah dan rumah, kami meyakini setiap amanah ananda yang dititipkan di Insan Harapan Batam akan mekar menjadi pribadi yang teguh akidahnya, cerdas intelektualnya, serta santun akhlaknya.
              </p>
            </div>
          </div>
        </div>

        {/* Sejarah Berdirinya */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              <span>Sejarah Lembaga</span>
              <span aria-hidden="true">·</span>
              <span>Rekam Jejak</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-4">
              Tumbuh dari Cita-cita Menghadirkan Pendidikan Berkualitas di Batam
            </h2>
            <div className="text-stone-600 text-sm leading-relaxed space-y-4">
              <p>
                SIT Insan Harapan Batam berawal dari kegelisahan para tokoh pendidik dan cendekiawan muslim di Batam akan pentingnya lingkungan pendidikan yang mampu membentengi anak-anak dari dekadensi moral dan ketergantungan gawai yang kian masif.
              </p>
              <p>
                Didirikan di bawah naungan <strong>{schoolProfile.foundationName}</strong>, lembaga ini mengawali kiprahnya dengan mendirikan unit Raudhatul Athfal (RAIT) yang mengutamakan metode fitrah anak. Melihat animo dan kepercayaan orang tua yang begitu besar, sekolah kemudian mengembangkan jenjang Sekolah Dasar Islam Terpadu (SDIT) dan Sekolah Menengah Pertama Islam Terpadu (SMPIT).
              </p>
              <p>
                Kini, berlokasi strategis di kawasan asri Batam Kota, kampus SIT Insan Harapan menjadi rumah kedua bagi ratusan santri yang dibina oleh puluhan pendidik berpengalaman, mengintegrasikan kurikulum Al-Qur'an, konsep Nature School, serta fasilitas digital learning.
              </p>
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-gradient-to-br from-emerald-900 via-green-800 to-teal-950 text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-lg border border-emerald-700/40">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold mb-4 shadow-sm">
                <Compass className="w-3.5 h-3.5 text-emerald-100" />
                <span>Visi Resmi SIT Insan Harapan</span>
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold mb-4 leading-snug text-white">
                "{schoolProfile.vision}"
              </h3>
              <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed mb-6">
                Visi ini menjadi poros seluruh gerak kurikulum, pembiasaan karakter harian, dan pembinaan santri di unit RAIT, SDIT, dan SMPIT Insan Harapan Batam.
              </p>

              {/* 3 Pillars Visual Box */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block mb-0.5">Pilar 1</span>
                  <span className="font-extrabold text-xs text-white block">Qurani</span>
                  <span className="text-[9px] text-stone-300 leading-tight block mt-1">Tahfiz & Adab</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-orange-500/40 text-center">
                  <span className="text-[10px] uppercase font-bold text-orange-300 block mb-0.5">Pilar 2</span>
                  <span className="font-extrabold text-xs text-white block">Kreatif</span>
                  <span className="text-[9px] text-stone-300 leading-tight block mt-1">Sains & Alam</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-amber-500/40 text-center">
                  <span className="text-[10px] uppercase font-bold text-amber-300 block mb-0.5">Pilar 3</span>
                  <span className="font-extrabold text-xs text-white block">Entrepreneur</span>
                  <span className="text-[9px] text-stone-300 leading-tight block mt-1">Mandiri & Wirausaha</span>
                </div>
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200">
              <span className="font-medium text-orange-300">Generasi Qurani</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-emerald-300">Kreatif</span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-amber-300">Entrepreneur</span>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 text-emerald-800 rounded-lg text-xs font-semibold mb-4">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Misi Strategis Lembaga</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4">
                Langkah Nyata Mencapai Visi
              </h3>
              <div className="space-y-3">
                {schoolProfile.mission.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filosofi Pendidikan Islam Terpadu */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
              <span>Landasan Filosofis</span>
              <span aria-hidden="true">·</span>
              <span>Hakikat Pendidikan</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-4">
              Filosofi Pendidikan Islam Terpadu & Nature School
            </h2>
            <div className="text-stone-700 text-sm leading-relaxed space-y-4">
              <p className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-emerald-950 font-medium">
                {schoolProfile.educationalPhilosophy}
              </p>
              <p>
                Konsep <em>Integrated Islamic School</em> memandang bahwa ilmu tidak pernah terpisah (dikotomis) antara ilmu umum dan ilmu agama. Di Insan Harapan, matematika mengajarkan keteraturan hukum Allah, sains membuka rahasia ciptaan-Nya di alam raya, dan teknologi menjadi sarana dakwah kebaikan.
              </p>
            </div>
          </div>

          {/* Nilai dan Budaya Sekolah */}
          <div className="pt-6 border-t border-stone-100">
            <h3 className="text-lg font-bold text-stone-900 mb-6">
              Nilai-Nilai & Budaya Utama Insan Harapan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {culturalValues.map((val, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2"
                >
                  <h4 className="font-bold text-sm text-emerald-900">
                    {val.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Struktur Organisasi & Penjamin Mutu */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                <span>Struktur Kepemimpinan</span>
                <span aria-hidden="true">·</span>
                <span>Pendidik & Tenaga Kependidikan</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900">
                Pimpinan & Manajemen Lembaga
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-xs text-stone-500 hover:text-emerald-700 underline self-start sm:self-auto"
            >
              Kelola data pejabat di Panel Admin
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizationRoles.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-300 transition-colors"
              >
                <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                  {item.role}
                </span>
                <h4 className="font-bold text-sm text-stone-900">{item.name}</h4>
                <p className="text-xs text-stone-500 mt-1">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legalitas & Identitas Resmi */}
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12">
          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Legalitas & Akreditasi Resmi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Identitas & Izin Operasional Lembaga
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm">
              SIT Insan Harapan Batam telah memiliki izin operasional resmi dan terakreditasi oleh Badan Akreditasi Nasional (BAN-S/M).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-stone-300">
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">NPSN RAIT (TK IT)</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.npsnRAIT}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">NPSN SDIT</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.npsnSDIT}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">NPSN SMPIT</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.npsnSMPIT}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">SK Izin Operasional</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.skIzin}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">Status Akreditasi</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.akreditasi}</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-800/80 border border-stone-700">
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block mb-1">Afiliasi Jaringan</span>
              <p className="font-semibold text-white text-sm">{schoolProfile.legalInfo.afiliasi}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
