/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPTab } from '../../types/spp';
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  CreditCard,
  AlertCircle,
  BarChart3,
  Award,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  School,
  X,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPublicPortal?: () => void;
}

export const SPPSidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSwitchToPublicPortal,
}) => {
  const {
    currentTab,
    setCurrentTab,
    currentUser,
    invoices,
    students,
    logoutUser,
    selectedUnitFilter,
  } = useSPP();

  // Compute badges
  const totalArrearsCount = invoices.filter(
    (inv) =>
      inv.sisaTagihan > 0 &&
      (selectedUnitFilter === 'all' || inv.unit === selectedUnitFilter)
  ).length;

  const activeStudentsCount = students.filter(
    (s) =>
      s.status === 'aktif' &&
      (selectedUnitFilter === 'all' || s.unit === selectedUnitFilter)
  ).length;

  interface MenuItem {
    tab: SPPTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    roles?: string[];
  }

  const menuItems: MenuItem[] = [
    {
      tab: 'dashboard',
      label: 'Dashboard Utama',
      icon: LayoutDashboard,
    },
    {
      tab: 'siswa',
      label: 'Master Data Siswa',
      icon: Users,
      badge: activeStudentsCount,
      badgeColor: 'bg-emerald-800 text-emerald-100',
    },
    {
      tab: 'tagihan',
      label: 'Tagihan SPP Bulanan',
      icon: FileSpreadsheet,
    },
    {
      tab: 'transaksi',
      label: 'Kasir & Transaksi',
      icon: CreditCard,
    },
    {
      tab: 'tunggakan',
      label: 'Monitoring Tunggakan',
      icon: AlertCircle,
      badge: totalArrearsCount > 0 ? totalArrearsCount : undefined,
      badgeColor: 'bg-amber-500 text-amber-950 font-bold',
    },
    {
      tab: 'laporan',
      label: 'Laporan Keuangan (12)',
      icon: BarChart3,
    },
    {
      tab: 'beasiswa',
      label: 'Beasiswa & Keringanan',
      icon: Award,
    },
    {
      tab: 'pengaturan',
      label: 'Pengaturan & Akun',
      icon: Settings,
      roles: ['admin', 'bendahara', 'super_admin', 'admin_keuangan'],
    },
    {
      tab: 'panduan',
      label: 'Panduan Sistem',
      icon: HelpCircle,
    },
  ];

  const handleSelectTab = (tab: SPPTab) => {
    setCurrentTab(tab);
    onClose();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'bg-amber-400/20 text-amber-300 border-amber-400/30';
      case 'bendahara':
      case 'admin_keuangan':
        return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30';
      case 'kepala_sekolah':
        return 'bg-blue-400/20 text-blue-300 border-blue-400/30';
      default:
        return 'bg-stone-500/20 text-stone-300 border-stone-500/30';
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-72 bg-gradient-to-b from-emerald-950 via-emerald-900 to-stone-950 text-white flex flex-col justify-between border-r border-emerald-800/40 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div>
          <div className="p-5 border-b border-emerald-800/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 border border-amber-400/40 flex items-center justify-center p-2 shadow-inner">
                <span className="font-black text-amber-400 text-sm tracking-wider">SIT</span>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 leading-tight">
                  Yayasan Harapan Ibu Kepri
                </div>
                <div className="text-sm font-extrabold text-white tracking-tight leading-tight">
                  SISTEM SPP INSAN HARAPAN
                </div>
                <div className="text-[9px] text-emerald-300/80">RAIT • SDIT • SMPIT Batam</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 text-emerald-300 hover:text-white rounded-lg md:hidden hover:bg-emerald-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Mini Bar */}
          <div className="px-5 py-3.5 bg-emerald-950/50 border-b border-emerald-800/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-700/80 border border-emerald-500/50 flex items-center justify-center text-xs font-bold text-amber-300 shadow-sm">
                {currentUser.nama.slice(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden flex-1">
                <div className="text-xs font-bold text-white truncate">{currentUser.nama}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block px-1.5 py-0.2 text-[9px] font-semibold rounded border uppercase tracking-wider ${getRoleBadgeColor(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.roleName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-270px)]">
            <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400/70">
              Menu Administrasi
            </div>

            {menuItems.map((item) => {
              // Access check
              if (item.roles && !item.roles.includes(currentUser.role)) {
                return null;
              }

              const isActive = currentTab === item.tab;
              const Icon = item.icon;

              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20'
                      : 'text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 transition ${
                        isActive
                          ? 'text-stone-950'
                          : 'text-emerald-300 group-hover:text-amber-300'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-stone-950 text-amber-300' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher & Logout */}
        <div className="p-4 border-t border-emerald-800/50 bg-emerald-950/70 space-y-2">
          {onSwitchToPublicPortal && (
            <button
              onClick={onSwitchToPublicPortal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-emerald-200 hover:text-white hover:bg-emerald-800/60 border border-emerald-700/40 transition group"
            >
              <div className="flex items-center gap-2">
                <School className="w-4 h-4 text-amber-400" />
                <span>Web Profil Sekolah</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
            </button>
          )}

          <button
            onClick={logoutUser}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-white hover:bg-red-950/50 border border-red-900/40 transition"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Keluar Akun SPP</span>
          </button>

          <div className="text-[10px] text-center text-emerald-400/50 pt-1">
            v2.4 • Keuangan SIT Insan Harapan
          </div>
        </div>
      </aside>
    </>
  );
};
