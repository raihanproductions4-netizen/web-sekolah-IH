/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../context/SPPContext';
import { SPPSidebar } from '../components/spp/SPPSidebar';
import { SPPHeader } from '../components/spp/SPPHeader';
import { ReceiptModal } from '../components/spp/ReceiptModal';
import { SPPDashboardView } from './spp/SPPDashboardView';
import { SPPStudentsView } from './spp/SPPStudentsView';
import { SPPInvoicesView } from './spp/SPPInvoicesView';
import { SPPTransactionsView } from './spp/SPPTransactionsView';
import { SPPArrearsView } from './spp/SPPArrearsView';
import { SPPReportsView } from './spp/SPPReportsView';
import { SPPScholarshipsView } from './spp/SPPScholarshipsView';
import { SPPSettingsView } from './spp/SPPSettingsView';
import { SPPGuidelinesView } from './spp/SPPGuidelinesView';
import { SPPLoginView } from './spp/SPPLoginView';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface SPPAppContainerProps {
  onSwitchToPublicPortal?: () => void;
}

export const SPPAppContainer: React.FC<SPPAppContainerProps> = ({ onSwitchToPublicPortal }) => {
  const {
    currentTab,
    isLoggedIn,
    activeReceipt,
    setActiveReceipt,
    toasts,
    removeToast,
  } = useSPP();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user is logged out, show secure login page
  if (!isLoggedIn) {
    return <SPPLoginView onSwitchToPublicPortal={onSwitchToPublicPortal} />;
  }

  return (
    <div className="min-h-screen bg-stone-100/90 text-stone-900 font-sans flex antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Left Sidebar */}
      <div className="no-print">
        <SPPSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
          onSwitchToPublicPortal={onSwitchToPublicPortal}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="no-print">
          <SPPHeader
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onSwitchToPublicPortal={onSwitchToPublicPortal}
          />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <SPPDashboardView />}
          {currentTab === 'siswa' && <SPPStudentsView />}
          {currentTab === 'tagihan' && <SPPInvoicesView />}
          {currentTab === 'transaksi' && <SPPTransactionsView />}
          {currentTab === 'tunggakan' && <SPPArrearsView />}
          {currentTab === 'laporan' && <SPPReportsView />}
          {currentTab === 'beasiswa' && <SPPScholarshipsView />}
          {currentTab === 'pengaturan' && <SPPSettingsView />}
          {currentTab === 'panduan' && <SPPGuidelinesView />}
        </main>
      </div>

      {/* Global Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal
          transaction={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />
      )}

      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 text-xs transition-all animate-in slide-in-from-right-4 ${
              toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-700'
                : toast.type === 'info'
                ? 'bg-stone-900 text-white border-stone-700'
                : 'bg-emerald-900 text-white border-emerald-700'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
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
