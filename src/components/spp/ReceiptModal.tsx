/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SPPTransaction } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, terbilangRupiah } from '../../utils/sppHelpers';
import { useSPP } from '../../context/SPPContext';
import { Printer, X, CheckCircle, ShieldCheck, Download } from 'lucide-react';

interface ReceiptModalProps {
  transaction: SPPTransaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { settings } = useSPP();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const getUnitTitle = (unit: string) => {
    switch (unit) {
      case 'rait':
        return 'RAIT (Raudhatul Athfal Islam Terpadu) Insan Harapan';
      case 'smpit':
        return 'SMPIT (Sekolah Menengah Pertama Islam Terpadu) Insan Harapan';
      case 'sdit':
      default:
        return 'SDIT (Sekolah Dasar Islam Terpadu) Insan Harapan';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Actions bar (hidden in print) */}
        <div className="no-print bg-stone-100 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Pratinjau Kuitansi Resmi Pembayaran SPP
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Kuitansi (A4 / Slip)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 sm:p-10 bg-white text-stone-900 font-sans print:p-0 print:m-0" id="official-receipt">
          {/* Header Kop Yayasan */}
          <div className="border-b-2 border-emerald-900 pb-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-white flex flex-col items-center justify-center font-bold shadow-md border-2 border-amber-400 shrink-0">
                  <span className="text-lg tracking-wider">SIT</span>
                  <span className="text-[9px] uppercase tracking-widest text-amber-300">Harapan</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                    {settings.namaYayasan}
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                    {getUnitTitle(transaction.unit)}
                  </h1>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {settings.alamatYayasan} • Telp: {settings.kontakYayasan}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="inline-block px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold uppercase tracking-wider">
                  KUITANSI RESMI
                </div>
                <div className="text-[11px] text-stone-500 font-mono mt-1">
                  No: <span className="font-bold text-stone-800">{transaction.nomorKuitansi}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subheader info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200 mb-6">
            <div>
              <span className="text-stone-500 block">Telah Diterima Dari:</span>
              <span className="font-bold text-stone-900 text-sm">{transaction.namaSiswa}</span>
              <span className="block text-stone-600 mt-0.5">
                NIS: {transaction.nis} • Kelas: {transaction.kelas} ({transaction.unit.toUpperCase()})
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">Waktu Transaksi:</span>
              <span className="font-bold text-stone-800">
                {formatTanggalIndo(transaction.tanggalBayar, true)}
              </span>
              <span className="block text-stone-500 mt-0.5">
                Metode: <strong className="text-emerald-800">{transaction.metodePembayaran}</strong>
                {transaction.nomorReferensi ? ` (${transaction.nomorReferensi})` : ''}
              </span>
            </div>
          </div>

          {/* Allocation Breakdown Table */}
          <div className="mb-6">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Rincian Pembayaran SPP Bulanan
            </div>
            <table className="w-full text-xs border border-stone-200 rounded-lg overflow-hidden">
              <thead className="bg-emerald-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3 text-left">No</th>
                  <th className="py-2.5 px-3 text-left">Uraian / Periode SPP</th>
                  <th className="py-2.5 px-3 text-left">Status</th>
                  <th className="py-2.5 px-3 text-right">Nominal Alokasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {transaction.alokasi.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 text-stone-500">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-medium text-stone-900">
                      SPP Insan Harapan - Bulan {item.namaBulan}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle className="w-3 h-3" /> Tercatat Sah
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(item.nominal)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-stone-100 font-bold border-t-2 border-stone-300">
                <tr>
                  <td colSpan={3} className="py-3 px-3 text-right text-stone-700 uppercase tracking-wider">
                    Total Pembayaran:
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-900 text-sm font-mono font-extrabold">
                    {formatRupiah(transaction.totalBayar)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Terbilang Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs text-stone-800">
            <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-800 block mb-0.5">
              Terbilang:
            </span>
            <span className="font-semibold italic text-stone-900 text-sm">
              "{terbilangRupiah(transaction.totalBayar)}"
            </span>
          </div>

          {transaction.catatan && (
            <div className="text-[11px] text-stone-600 mb-6 italic">
              <strong>Catatan:</strong> {transaction.catatan}
            </div>
          )}

          {/* Signature & Digital Stamp Footer */}
          <div className="pt-4 border-t border-dashed border-stone-300 grid grid-cols-3 gap-4 text-xs items-end">
            <div>
              <div className="w-20 h-20 border border-stone-300 rounded-lg p-1.5 flex flex-col items-center justify-center text-center bg-stone-50">
                <div className="text-[9px] font-mono font-bold text-stone-600">VERIFIKASI QR</div>
                <div className="w-12 h-12 bg-stone-900 text-white flex items-center justify-center font-mono text-[8px] rounded mt-0.5 text-center p-0.5 leading-none">
                  VALID-IH-{transaction.nis.slice(-4)}
                </div>
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                No. Transaksi: {transaction.nomorTransaksi}
              </span>
            </div>

            <div className="text-center relative">
              {/* Digital Stamp */}
              <div className="inline-block border-2 border-emerald-700 rounded-full px-4 py-2 text-emerald-800 font-extrabold rotate-[-8deg] opacity-90 shadow-sm bg-white/80">
                <div className="text-[9px] tracking-widest uppercase">YAYASAN HARAPAN IBU KEPRI</div>
                <div className="text-xs uppercase font-black text-emerald-900 tracking-wider">LUNAS DIKASIR</div>
                <div className="text-[8px] font-mono text-emerald-700">TERVERIFIKASI SISTEM</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-stone-500 block text-[11px]">Batam, {formatTanggalIndo(transaction.tanggalBayar)}</span>
              <span className="text-stone-500 block text-[11px] mb-10">Petugas / Kasir Penerima,</span>
              <div className="font-bold text-stone-900 underline text-xs">{transaction.petugas}</div>
              <span className="text-[10px] text-stone-500 block">Bagian Administrasi Keuangan</span>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-8 text-[10px] text-center text-stone-400 border-t border-stone-200 pt-3">
            Dokumen ini merupakan bukti pembayaran SPP yang sah dikeluarkan oleh Sistem Informasi Pembayaran SPP SIT Insan Harapan. Harap disimpan dengan baik.
          </div>
        </div>
      </div>
    </div>
  );
};
