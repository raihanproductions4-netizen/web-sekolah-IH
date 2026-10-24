/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SPPTransaction } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, terbilangRupiah, getCleanWhatsAppNumber } from '../../utils/sppHelpers';
import { useSPP } from '../../context/SPPContext';
import {
  X,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  CreditCard,
  Building,
  MessageCircle,
  FileText,
  Copy,
  Check,
} from 'lucide-react';

interface TransactionDetailModalProps {
  transaction: SPPTransaction | null;
  onClose: () => void;
  onPrintReceipt: (trx: SPPTransaction) => void;
  onCancelTransaction: (trx: SPPTransaction) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onPrintReceipt,
  onCancelTransaction,
}) => {
  const { currentUser } = useSPP();
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!transaction) return null;

  const isCancelled = transaction.status === 'dibatalkan';

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className={`p-5 text-white flex items-center justify-between ${
          isCancelled ? 'bg-rose-900' : 'bg-emerald-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isCancelled ? 'bg-rose-800 text-amber-300' : 'bg-emerald-800 text-amber-300'
            }`}>
              {isCancelled ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">Detail Transaksi Pembayaran</h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isCancelled ? 'bg-rose-800 text-white border border-rose-600' : 'bg-emerald-800 text-amber-300 border border-emerald-700'
                }`}>
                  {isCancelled ? 'STATUS: DIBATALKAN' : 'STATUS: SUKSES / SAH'}
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5">
                No. Transaksi: <span className="font-mono font-bold">{transaction.nomorTransaksi}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-xs text-stone-700 max-h-[75vh] overflow-y-auto">
          {/* Cancellation Alert Banner */}
          {isCancelled && transaction.pembatalan && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Transaksi ini Telah Dibatalkan / Dikoreksi</span>
              </div>
              <p className="text-[11px] text-rose-700">
                <strong>Waktu Pembatalan:</strong> {formatTanggalIndo(transaction.pembatalan.tanggal, true)}
              </p>
              <p className="text-[11px] text-rose-700">
                <strong>Alasan:</strong> {transaction.pembatalan.alasan}
              </p>
              <p className="text-[11px] text-rose-700">
                <strong>Diotorisasi oleh:</strong> {transaction.pembatalan.diotorisasiOleh}
              </p>
              <p className="text-[10px] text-rose-600 italic mt-1">
                Saldo tagihan siswa telah dipulihkan secara otomatis saat transaksi ini dibatalkan.
              </p>
            </div>
          )}

          {/* Student Profile Card */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {transaction.namaSiswa.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-stone-900 text-sm">{transaction.namaSiswa}</div>
                <div className="text-[11px] text-stone-500">
                  NIS: <span className="font-mono font-semibold text-stone-700">{transaction.nis}</span> • Unit:{' '}
                  <span className="font-bold text-emerald-800">{transaction.unit.toUpperCase()}</span> (Kelas: {transaction.kelas})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => copyToClipboard(transaction.nomorTransaksi, 'trx')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 text-[11px] transition"
              >
                {copiedField === 'trx' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>Salin No. Trx</span>
              </button>
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Nomor Kuitansi Resmi
              </span>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-stone-900 text-xs">{transaction.nomorKuitansi}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(transaction.nomorKuitansi, 'kw')}
                  className="text-stone-400 hover:text-stone-700 text-[10px]"
                >
                  {copiedField === 'kw' ? 'Tersalin' : 'Salin'}
                </button>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Waktu Transaksi
              </span>
              <span className="font-medium text-stone-800 text-xs block">
                {formatTanggalIndo(transaction.tanggalBayar, true)}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Metode Pembayaran
              </span>
              <span className="font-bold text-emerald-900 text-xs block">
                {transaction.metodePembayaran}
              </span>
              {transaction.nomorReferensi && (
                <span className="text-[10px] text-stone-500 font-mono block">
                  Ref Bank: {transaction.nomorReferensi}
                </span>
              )}
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Petugas Kasir Penerima
              </span>
              <span className="font-medium text-stone-800 text-xs block">
                {transaction.petugas}
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                Alokasi Pembayaran SPP
              </h4>
              <span className="text-[11px] text-stone-500">
                {transaction.alokasi.length} Bulan Tagihan
              </span>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Periode Bulan</th>
                    <th className="py-2.5 px-3 text-right">Nominal Alokasi</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {transaction.alokasi.map((item, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-stone-900 block">{item.namaBulan}</span>
                        <span className="text-[10px] text-stone-400 font-mono">ID: {item.tagihanId}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                        {formatRupiah(item.nominal)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isCancelled ? 'Batal' : 'Terbayar'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-emerald-50/50 border-t-2 border-stone-200 font-bold">
                  <tr>
                    <td className="py-2.5 px-3 text-stone-700 uppercase tracking-wider text-[11px]">
                      Total Pembayaran:
                    </td>
                    <td className={`py-2.5 px-3 text-right text-sm font-mono font-black ${
                      isCancelled ? 'line-through text-rose-700' : 'text-emerald-900'
                    }`}>
                      {formatRupiah(transaction.totalBayar)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-2 text-[11px] text-stone-500 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              Terbilang: <strong>"{terbilangRupiah(transaction.totalBayar)}"</strong>
            </div>
          </div>

          {/* Notes */}
          {transaction.catatan && (
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-stone-700">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-0.5">
                Catatan Kasir:
              </span>
              <p className="text-xs">{transaction.catatan}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isCancelled && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPrintReceipt(transaction);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Bukti Pembayaran / Kuitansi</span>
              </button>
            )}

            {!isCancelled && currentUser.role !== 'operator' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onCancelTransaction(transaction);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Batalkan / Koreksi Transaksi</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
