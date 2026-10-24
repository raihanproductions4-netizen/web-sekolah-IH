import React, { useState } from 'react';
import { useApp, ActiveNavTab } from '../context/AppContext';
import { EducationalUnitType } from '../types';
import {
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  PhoneCall,
  Lock,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onSwitchToSPP?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSwitchToSPP }) => {
  const {
    activeTab,
    setActiveTab,
    selectedUnitId,
    setSelectedUnitId,
    schoolProfile,
    isAdminLoggedIn
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unitsDropdownOpen, setUnitsDropdownOpen] = useState(false);

  const handleUnitSelect = (unitId: EducationalUnitType) => {
    setSelectedUnitId(unitId);
    setActiveTab('unit');
    setUnitsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks: { label: string; tab: ActiveNavTab }[] = [
    { label: 'Beranda', tab: 'beranda' },
    { label: 'Profil', tab: 'profil' },
    { label: 'Program Unggulan', tab: 'program' },
    { label: 'PPDB 2026/2027', tab: 'ppdb' },
    { label: 'Berita & Pengumuman', tab: 'berita' },
    { label: 'Galeri', tab: 'galeri' },
    { label: 'Fasilitas', tab: 'fasilitas' },
    { label: 'Kontak', tab: 'kontak' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      {/* Top Bar Announcement / Quick Contact in Fresh Green and Orange */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-800 text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold tracking-wide uppercase">
              PPDB 2026/2027
            </span>
            <span className="font-semibold text-emerald-100">Gelombang I Resmi Dibuka</span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <span className="text-emerald-100">RAIT · SDIT · SMPIT Insan Harapan Batam Kota</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-orange-300" />
              <span>Info WhatsApp: +{schoolProfile.whatsappPPDB}</span>
            </span>
            <span aria-hidden="true" className="text-emerald-400">·</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="hover:text-orange-300 transition-colors flex items-center gap-1 text-[11px]"
              title="Panel Admin CMS"
            >
              <Lock className="w-3 h-3 text-orange-400" />
              <span>{isAdminLoggedIn ? 'Panel Admin (Aktif)' : 'Portal Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: Brand — Links — 1 Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single clean lockup) */}
        <button
          onClick={() => setActiveTab('beranda')}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform border border-emerald-400/30">
            <GraduationCap className="w-6 h-6 text-orange-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg md:text-xl text-stone-900 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors whitespace-nowrap">
              Insan Harapan Batam
            </span>
            <span className="text-[11px] font-semibold text-orange-600 tracking-wider uppercase">
              RAIT · SDIT · SMPIT
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, quiet typography) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('beranda')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'beranda'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Beranda
          </button>

          <button
            onClick={() => setActiveTab('profil')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'profil'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Profil
          </button>

          {/* Unit Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setUnitsDropdownOpen(true)}
            onMouseLeave={() => setUnitsDropdownOpen(false)}
          >
            <button
              onClick={() => setActiveTab('unit')}
              className={`flex items-center gap-1 whitespace-nowrap py-1 transition-colors ${
                activeTab === 'unit'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-emerald-700'
              }`}
            >
              <span>Unit Pendidikan</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${unitsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {unitsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2.5 z-50">
                <button
                  onClick={() => handleUnitSelect('rait')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex flex-col ${
                    selectedUnitId === 'rait' && activeTab === 'unit' ? 'bg-emerald-50/70 text-emerald-800' : 'text-stone-800'
                  }`}
                >
                  <span className="font-semibold text-sm text-emerald-800">RAIT Insan Harapan</span>
                  <span className="text-xs text-stone-500">Pendidikan Anak Usia Dini & TK IT (4–6 Thn)</span>
                </button>
                <div className="h-px bg-stone-100 mx-3 my-1" />
                <button
                  onClick={() => handleUnitSelect('sdit')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex flex-col ${
                    selectedUnitId === 'sdit' && activeTab === 'unit' ? 'bg-emerald-50/70 text-emerald-800' : 'text-stone-800'
                  }`}
                >
                  <span className="font-semibold text-sm text-emerald-800">SDIT Insan Harapan</span>
                  <span className="text-xs text-stone-500">Sekolah Dasar Islam Terpadu & Nature Lab</span>
                </button>
                <div className="h-px bg-stone-100 mx-3 my-1" />
                <button
                  onClick={() => handleUnitSelect('smpit')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition-colors flex flex-col ${
                    selectedUnitId === 'smpit' && activeTab === 'unit' ? 'bg-emerald-50/70 text-emerald-800' : 'text-stone-800'
                  }`}
                >
                  <span className="font-semibold text-sm text-emerald-800">SMPIT Insan Harapan</span>
                  <span className="text-xs text-stone-500">SMP Islam Terpadu, STEM & Kepemimpinan</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('program')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'program'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Program
          </button>

          <button
            onClick={() => setActiveTab('berita')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'berita'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Berita
          </button>

          <button
            onClick={() => setActiveTab('galeri')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'galeri'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Galeri
          </button>

          <button
            onClick={() => setActiveTab('fasilitas')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'fasilitas'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Fasilitas
          </button>

          <button
            onClick={() => setActiveTab('kontak')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'kontak'
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-emerald-700'
            }`}
          >
            Kontak
          </button>
        </nav>

        {/* Zone 3: CTA Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {onSwitchToSPP && (
            <button
              onClick={onSwitchToSPP}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-xs border border-amber-300"
            >
              <Compass className="w-4 h-4 text-emerald-950" />
              <span>Sistem SPP Yayasan</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('ppdb')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] rounded-xl transition-all shadow-md shadow-orange-500/25 whitespace-nowrap shrink-0 flex items-center gap-2 border border-orange-400/40"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            <span>Daftar PPDB</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-lg transition-colors focus:outline-none"
            aria-label="Buka Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => {
                setActiveTab(link.tab);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === link.tab
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              {link.label}
            </button>
          ))}

          {/* Unit links in mobile */}
          <div className="pt-2 border-t border-stone-100 pl-3">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-2">
              Pilihan Unit Pendidikan
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleUnitSelect('rait')}
                className="px-2 py-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-800 text-xs rounded-lg font-medium border border-stone-200"
              >
                RAIT (TK IT)
              </button>
              <button
                onClick={() => handleUnitSelect('sdit')}
                className="px-2 py-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-800 text-xs rounded-lg font-medium border border-stone-200"
              >
                SDIT
              </button>
              <button
                onClick={() => handleUnitSelect('smpit')}
                className="px-2 py-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-800 text-xs rounded-lg font-medium border border-stone-200"
              >
                SMPIT
              </button>
            </div>
          </div>

          {onSwitchToSPP && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onSwitchToSPP();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs shadow-xs transition border border-amber-300 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-emerald-950" />
                <span>Buka Sistem SPP & Keuangan</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between px-2 text-xs text-stone-500">
            <span>Admin Portal</span>
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kelola Website</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
