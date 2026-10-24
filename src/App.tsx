/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { SPPProvider } from './context/SPPContext';
import { SPPAppContainer } from './views/SPPAppContainer';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomeView } from './views/HomeView';
import { ProfileView } from './views/ProfileView';
import { UnitsView } from './views/UnitsView';
import { ProgramsView } from './views/ProgramsView';
import { PPDBView } from './views/PPDBView';
import { NewsView } from './views/NewsView';
import { GalleryView } from './views/GalleryView';
import { FacilitiesView } from './views/FacilitiesView';
import { ContactView } from './views/ContactView';
import { AdminPanel } from './views/AdminPanel';
import { CheckCircle2, AlertCircle, Info, X, CreditCard, School, Shield } from 'lucide-react';

type AppSystemMode = 'spp' | 'public';

const PublicAppContent: React.FC<{ onSwitchToSPP: () => void }> = ({ onSwitchToSPP }) => {
  const { activeTab, toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Banner to switch to SPP Financial System */}
      <div className="no-print bg-emerald-950 text-emerald-100 px-4 py-2 text-xs border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-semibold text-white">SIT Insan Harapan Batam:</span>
            <span className="hidden sm:inline text-emerald-200">
              Sistem Informasi Pembayaran SPP Bulanan Terpusat Yayasan Harapan Ibu Kepri
            </span>
          </div>
          <button
            onClick={onSwitchToSPP}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs shadow-xs transition"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Buka Sistem SPP & Kasir</span>
          </button>
        </div>
      </div>

      {/* Top Navbar */}
      <div className="no-print">
        <Navbar onSwitchToSPP={onSwitchToSPP} />
      </div>

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'beranda' && <HomeView />}
        {activeTab === 'profil' && <ProfileView />}
        {activeTab === 'unit' && <UnitsView />}
        {activeTab === 'program' && <ProgramsView />}
        {activeTab === 'ppdb' && <PPDBView />}
        {activeTab === 'berita' && <NewsView />}
        {activeTab === 'galeri' && <GalleryView />}
        {activeTab === 'fasilitas' && <FacilitiesView />}
        {activeTab === 'kontak' && <ContactView />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Floating Official WhatsApp button */}
      <div className="no-print">
        <FloatingWhatsApp />
      </div>

      {/* Institutional Footer */}
      <div className="no-print">
        <Footer onSwitchToSPP={onSwitchToSPP} />
      </div>

      {/* Toast Notification Container */}
      <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 text-xs transition-all animate-in slide-in-from-right-4 ${
              toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'info'
                ? 'bg-stone-900 text-white border-stone-700'
                : 'bg-emerald-900 text-white border-emerald-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-300 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  // Defaults to public school website as requested by the user
  const [systemMode, setSystemMode] = useState<AppSystemMode>('public');

  return (
    <AppProvider>
      <SPPProvider>
        {systemMode === 'spp' ? (
          <SPPAppContainer onSwitchToPublicPortal={() => setSystemMode('public')} />
        ) : (
          <PublicAppContent onSwitchToSPP={() => setSystemMode('spp')} />
        )}
      </SPPProvider>
    </AppProvider>
  );
}
