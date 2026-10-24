/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPUnit, SPPUser } from '../../types/spp';
import {
  Menu,
  Building2,
  Calendar,
  UserCheck,
  ChevronDown,
  Sparkles,
  School,
  ExternalLink,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onSwitchToPublicPortal?: () => void;
}

export const SPPHeader: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onSwitchToPublicPortal,
}) => {
  const {
    currentUser,
    setCurrentUser,
    users,
    selectedUnitFilter,
    setSelectedUnitFilter,
    settings,
  } = useSPP();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const units: { id: SPPUnit; label: string; tag: string }[] = [
    { id: 'all', label: 'Semua Unit', tag: 'Gabungan Yayasan' },
    { id: 'rait', label: 'RAIT', tag: 'TK Islam Terpadu' },
    { id: 'sdit', label: 'SDIT', tag: 'Sekolah Dasar IT' },
    { id: 'smpit', label: 'SMPIT', tag: 'SMP Islam Terpadu' },
  ];

  const handleSwitchRole = (u: SPPUser) => {
    setCurrentUser(u);
    setIsRoleDropdownOpen(false);
  };

  const todayFormatted = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-6 py-3 transition shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Unit Filter Tabs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 md:hidden"
            title="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Unit Filter Pills */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200/70">
            {units.map((u) => {
              const isSelected = selectedUnitFilter === u.id;
              // If current user is restricted to a unit, disable changing to others unless super_admin or all
              const isAllowed =
                currentUser.unitAkses === 'all' || currentUser.unitAkses === u.id || u.id === 'all';

              return (
                <button
                  key={u.id}
                  onClick={() => isAllowed && setSelectedUnitFilter(u.id)}
                  disabled={!isAllowed}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : isAllowed
                      ? 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                      : 'text-stone-300 cursor-not-allowed'
                  }`}
                  title={u.tag}
                >
                  {u.label}
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-xl">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              TA <strong>{settings.tahunAjaranAktif}</strong> ({settings.semesterAktif})
            </span>
          </div>
        </div>

        {/* Right: Date, Portal Switch, and Role Quick Switcher */}
        <div className="flex items-center gap-3">
          <div className="hidden xl:block text-right">
            <div className="text-xs font-medium text-stone-700">{todayFormatted}</div>
            <div className="text-[10px] text-stone-400">Kota Batam, Kepri</div>
          </div>

          {onSwitchToPublicPortal && (
            <button
              onClick={onSwitchToPublicPortal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              title="Kunjungi website publik sekolah"
            >
              <School className="w-3.5 h-3.5 text-emerald-700" />
              <span>Portal Sekolah</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </button>
          )}

          {/* Quick Role Switcher Dropdown (Useful for testing permissions) */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.nama.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-stone-800 truncate max-w-[140px]">
                  {currentUser.nama}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                  {currentUser.roleName}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </button>

            {/* Dropdown Menu */}
            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-stone-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Ganti Peran Pengguna (Simulasi Hak Akses)
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Pilih akun untuk menguji fitur & batasan izin:
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  {users.map((u) => {
                    const isCurrent = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchRole(u)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition ${
                          isCurrent
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div>
                          <div className="font-bold">{u.nama}</div>
                          <div className="text-[10px] text-stone-400">
                            {u.roleName} • Unit: {u.unitAkses.toUpperCase()}
                          </div>
                        </div>
                        {isCurrent && <UserCheck className="w-4 h-4 text-emerald-700" />}
                      </button>
                    );
                  })}
                </div>

                <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 text-[10px] text-stone-400 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Sistem mematuhi hak akses peran yang dipilih</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
