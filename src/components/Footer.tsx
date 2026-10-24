import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Lock,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

interface FooterProps {
  onSwitchToSPP?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSwitchToSPP }) => {
  const { schoolProfile, setActiveTab, setSelectedUnitId, isAdminLoggedIn } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1 & 2: School Identity & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 flex items-center justify-center text-white border border-emerald-400/30">
                <GraduationCap className="w-5 h-5 text-orange-300" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base leading-tight">
                  {schoolProfile.name}
                </h3>
                <span className="text-xs text-orange-400 font-medium">
                  {schoolProfile.foundationName}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              Membangun Generasi Qurani, Kreatif, Entrepreneur, dan Siap Menghadapi Masa Depan. Lembaga pendidikan Islam Terpadu berjenjang RAIT, SDIT, dan SMPIT di Kota Batam dengan kurikulum Al-Qur'an, Nature School, dan Digital Learning.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{schoolProfile.legalInfo.akreditasi}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{schoolProfile.legalInfo.afiliasi}</span>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={schoolProfile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-emerald-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={schoolProfile.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-emerald-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={schoolProfile.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-stone-900 hover:bg-emerald-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Jelajahi Halaman
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('beranda')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Beranda Utama
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('profil')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Profil & Visi Misi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('program')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Program Unggulan
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ppdb')}
                  className="hover:text-emerald-400 transition-colors font-medium text-emerald-300"
                >
                  PPDB 2026/2027
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('berita')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Warta & Berita Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('galeri')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Galeri Dokumentasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('fasilitas')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Fasilitas & Sarana
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Unit Pendidikan */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Unit Pendidikan
            </h4>
            <ul className="space-y-3 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedUnitId('rait');
                    setActiveTab('unit');
                  }}
                  className="text-left hover:text-emerald-400 transition-colors group"
                >
                  <span className="font-medium text-stone-200 block group-hover:text-emerald-300">
                    RAIT Insan Harapan
                  </span>
                  <span className="text-[11px] text-stone-500">PAUD & TK Islam Terpadu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedUnitId('sdit');
                    setActiveTab('unit');
                  }}
                  className="text-left hover:text-emerald-400 transition-colors group"
                >
                  <span className="font-medium text-stone-200 block group-hover:text-emerald-300">
                    SDIT Insan Harapan
                  </span>
                  <span className="text-[11px] text-stone-500">Sekolah Dasar Islam Terpadu</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedUnitId('smpit');
                    setActiveTab('unit');
                  }}
                  className="text-left hover:text-emerald-400 transition-colors group"
                >
                  <span className="font-medium text-stone-200 block group-hover:text-emerald-300">
                    SMPIT Insan Harapan
                  </span>
                  <span className="text-[11px] text-stone-500">SMP Islam Terpadu & STEM</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Kontak & Lokasi Batam */}
          <div>
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Sekretariat Sekolah
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {schoolProfile.address}, {schoolProfile.city}, {schoolProfile.province} {schoolProfile.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{schoolProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +{schoolProfile.whatsappPPDB}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{schoolProfile.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Link */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} SIT Insan Harapan Batam. Seluruh hak cipta dilindungi.
          </p>

          <div className="flex items-center gap-4">
            {onSwitchToSPP && (
              <button
                onClick={onSwitchToSPP}
                className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Sistem SPP Yayasan</span>
              </button>
            )}
            <span aria-hidden="true" className="text-stone-700">·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>{isAdminLoggedIn ? 'Panel Admin CMS (Aktif)' : 'Panel Admin CMS'}</span>
            </button>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span>Batam, Kepulauan Riau</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
