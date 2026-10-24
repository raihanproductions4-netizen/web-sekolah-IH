/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPUser } from '../../types/spp';
import {
  Lock,
  User,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  School,
  ArrowRight,
  LogIn,
  Sparkles,
  KeyRound,
} from 'lucide-react';

interface LoginViewProps {
  onSwitchToPublicPortal?: () => void;
}

export const SPPLoginView: React.FC<LoginViewProps> = ({ onSwitchToPublicPortal }) => {
  const {
    users,
    setCurrentUser,
    loginUserByUsername,
    loginWithGoogle,
    setIsLoggedIn,
    showToast,
  } = useSPP();

  const [identifier, setIdentifier] = useState('raihanproductions4@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await loginUserByUsername(identifier, password);
      if (success) {
        setIsLoggedIn(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (u: SPPUser) => {
    setCurrentUser(u);
    setIsLoggedIn(true);
    showToast(`Berhasil masuk sebagai ${u.nama} (${u.roleName})`, 'success');
  };

  const handleGoogleLoginClick = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      showToast(`Login Google gagal: ${err?.message || 'Terjadi kesalahan'}`, 'error');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Top Navbar Header */}
      <header className="bg-emerald-950 text-white px-4 sm:px-6 py-3.5 border-b border-emerald-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-amber-400/40 flex items-center justify-center font-black text-amber-300 text-sm shadow-inner">
            SIT
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Yayasan Harapan Ibu Kepri
            </div>
            <div className="text-sm font-extrabold text-white">
              SISTEM INFORMASI PEMBAYARAN SPP
            </div>
          </div>
        </div>

        {onSwitchToPublicPortal && (
          <button
            onClick={onSwitchToPublicPortal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-200 hover:text-white bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-700/50 transition cursor-pointer"
          >
            <School className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Lihat Profil Sekolah</span>
            <span className="sm:hidden">Web</span>
          </button>
        )}
      </header>

      {/* Main Login Center Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Left Decorative Islamic Banner */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Keuangan Terpadu</span>
              </div>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                Keuangan & SPP Insan Harapan
              </h2>
              <p className="text-xs text-emerald-200/90 mt-2 leading-relaxed">
                Unit Pendidikan: RAIT, SDIT, dan SMPIT Insan Harapan Batam.
                Amanah, akuntabel, dan tersinkronisasi langsung dengan Firebase Cloud Database.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-emerald-100/90">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pencatatan kasir & cetak bukti kuitansi sah</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Monitoring tunggakan & WhatsApp reminder</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>7 Varian rekap laporan & ekspor file CSV</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hak akses ganda: Administrator & Bendahara</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-emerald-800/60 text-[11px] text-emerald-300/70">
              Komplek Pendidikan Insan Harapan • Tiban, Sekupang, Batam
            </div>
          </div>

          {/* Right Form */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              <div className="mb-5">
                <h3 className="text-xl font-bold text-stone-900">Masuk ke Sistem SPP</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Gunakan email Anda, akun Google, atau pilih salah satu akun uji coba di bawah.
                </p>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleLoginClick}
                disabled={isGoogleLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 hover:border-emerald-600 font-bold text-xs text-stone-800 flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{isGoogleLoading ? 'Menghubungkan ke Google...' : 'Masuk dengan Akun Google (Firebase)'}</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-stone-400">
                  <span className="bg-white px-2">atau dengan email / sandi</span>
                </div>
              </div>

              {/* Email / Username & Password Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Email atau Nama Pengguna:
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="raihanproductions4@gmail.com, admin, atau bendahara"
                      className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 block">
                    Bisa menggunakan email Google Anda, admin, atau bendahara.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Kata Sandi:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-10 py-2 border border-stone-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-stone-400 hover:text-stone-700 absolute right-3 top-2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-emerald-700 focus:ring-emerald-500"
                    />
                    <span>Ingat saya di perangkat ini</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('raihanproductions4@gmail.com');
                      setPassword('admin123');
                      showToast('Kredensial Super Admin berhasil diisi otomatis.', 'info');
                    }}
                    className="text-emerald-700 hover:underline font-medium text-[11px]"
                  >
                    Reset isian
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Memproses Masuk...' : 'Masuk ke Dashboard SPP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Login / Fast Access 1-Click */}
            <div className="pt-3 border-t border-stone-200">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                Pilih Akun Cepat (1-Klik Langsung Masuk):
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {users.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="p-2 border border-stone-200 hover:border-emerald-600 hover:bg-emerald-50/60 rounded-xl text-left transition flex items-center justify-between group cursor-pointer bg-stone-50/50"
                  >
                    <div className="truncate">
                      <div className="font-bold text-stone-900 group-hover:text-emerald-900 flex items-center gap-1">
                        <span className="truncate">{u.nama.split(' ')[0]} {u.nama.split(' ')[1] || ''}</span>
                        {u.role === 'admin' ? (
                          <span className="px-1 py-0.2 text-[9px] bg-emerald-100 text-emerald-800 font-bold rounded">Admin</span>
                        ) : (
                          <span className="px-1 py-0.2 text-[9px] bg-blue-100 text-blue-800 font-bold rounded">Bendahara</span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[130px]">
                        {u.email}
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold opacity-0 group-hover:opacity-100 transition shrink-0 ml-1">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-3 text-xs text-stone-500 border-t border-stone-200 bg-white">
        © 2026 Yayasan Harapan Ibu Kepri • SIT Insan Harapan Batam (RAIT, SDIT, SMPIT). Seluruh hak cipta dilindungi.
      </footer>
    </div>
  );
};
