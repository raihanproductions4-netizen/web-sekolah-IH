/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPPTransaction } from '../../types/spp';
import { formatRupiah, formatTanggalIndo } from '../../utils/sppHelpers';
import { useSPP } from '../../context/SPPContext';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

interface CorrectionModalProps {
  transaction: SPPTransaction | null;
  onClose: () => void;
}

export const CorrectionModal: React.FC<CorrectionModalProps> = ({ transaction, onClose }) => {
  const { cancelTransaction, currentUser } = useSPP();
  const [alasan, setAlasan] = useState<string>('');
  const [supervisor, setSupervisor] = useState<string>(currentUser.nama);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!transaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alasan.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await cancelTransaction(transaction.id, alasan, supervisor);
      if (success) {
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-red-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-bold text-sm">Koreksi / Pembatalan Transaksi</h3>
              <p className="text-red-200 text-xs">Jejak audit tersimpan dan saldo tagihan dikembalikan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-red-300 hover:text-white p-1 rounded-lg hover:bg-red-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-stone-700">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-900 leading-relaxed">
            <strong>Peringatan Keamanan & Akuntansi:</strong> Pembatalan transaksi ini tidak menghapus data secara permanen tanpa jejak, melainkan mencatat status pembatalan, memulihkan tagihan siswa terkait menjadi belum lunas/sesuai sisa, dan mencatat riwayat ke log audit.
          </div>

          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500">Nomor Transaksi:</span>
              <span className="font-mono font-bold text-stone-900">{transaction.nomorTransaksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Nomor Kuitansi:</span>
              <span className="font-mono text-stone-700">{transaction.nomorKuitansi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Siswa:</span>
              <span className="font-bold text-stone-900">{transaction.namaSiswa} ({transaction.unit.toUpperCase()} {transaction.kelas})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Nominal:</span>
              <span className="font-bold text-emerald-800">{formatRupiah(transaction.totalBayar)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Tanggal Bayar:</span>
              <span>{formatTanggalIndo(transaction.tanggalBayar, true)}</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Alasan Pembatalan / Koreksi: <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Contoh: Salah memasukkan nominal siswa / bukti transfer ganda terinput dua kali / kesalahan metode bayar"
              className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-800 mb-1">
              Nama Pejabat / Pihak yang Mengotorisasi:
            </label>
            <input
              type="text"
              required
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="w-full p-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="bg-stone-100 px-4 py-3 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !alasan.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold transition disabled:opacity-50"
            >
              <ShieldAlert className="w-4 h-4" />
              Konfirmasi Batalkan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
