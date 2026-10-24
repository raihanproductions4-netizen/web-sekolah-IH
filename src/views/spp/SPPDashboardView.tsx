/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { formatRupiah, formatTanggalIndo } from '../../utils/sppHelpers';
import { SPPCharts } from '../../components/spp/SPPCharts';
import {
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Percent,
  Wallet,
  ArrowUpRight,
  PlusCircle,
  Clock,
  Printer,
  ChevronRight,
  Calendar,
} from 'lucide-react';

export const SPPDashboardView: React.FC = () => {
  const {
    students,
    invoices,
    transactions,
    settings,
    selectedUnitFilter,
    setCurrentTab,
    setActiveReceipt,
  } = useSPP();

  const [filterMonth, setFilterMonth] = useState<number>(settings.bulanBerjalan || 10); // Oktober
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>(settings.tahunAjaranAktif || '2024/2025');

  // Filtered dataset based on header unit filter and local month/year
  const unitFilteredStudents = students.filter((s) => {
    if (selectedUnitFilter !== 'all' && s.unit !== selectedUnitFilter) return false;
    return true;
  });

  const unitFilteredInvoices = invoices.filter((inv) => {
    if (selectedUnitFilter !== 'all' && inv.unit !== selectedUnitFilter) return false;
    return true;
  });

  // Current Month Invoices
  const currentMonthInvoices = unitFilteredInvoices.filter(
    (inv) => inv.bulan === filterMonth && inv.tahunAjaran === filterAcademicYear
  );

  // 1. Total Siswa Aktif
  const totalActiveStudents = unitFilteredStudents.filter((s) => s.status === 'aktif').length;

  // 2. Total Tagihan SPP Bulan Berjalan
  const totalTagihanBulanIni = currentMonthInvoices.reduce((acc, i) => acc + i.totalTagihan, 0);

  // 3. Total Pembayaran yang Sudah Diterima Bulan Berjalan
  const totalDiterimaBulanIni = currentMonthInvoices.reduce((acc, i) => acc + i.terbayar, 0);

  // 4. Total Tunggakan SPP (Bulan Berjalan)
  const totalTunggakanBulanIni = currentMonthInvoices.reduce((acc, i) => acc + i.sisaTagihan, 0);

  // 5. Jumlah Siswa yang Sudah Lunas Bulan Ini
  const totalSiswaLunas = currentMonthInvoices.filter(
    (i) => i.status === 'lunas' || i.status === 'bebas'
  ).length;

  // 6. Jumlah Siswa yang Belum Lunas Bulan Ini
  const totalSiswaBelumLunas = currentMonthInvoices.filter(
    (i) => i.sisaTagihan > 0 && i.status !== 'lunas' && i.status !== 'bebas'
  ).length;

  // 7. Persentase Pembayaran Bulan Berjalan
  const persentasePembayaran =
    totalTagihanBulanIni > 0
      ? Math.round((totalDiterimaBulanIni / totalTagihanBulanIni) * 100)
      : 0;

  // 8. Total Pemasukan SPP Tahun Berjalan (Seluruh bulan di tahun ajaran ini)
  const totalPemasukanTahunBerjalan = unitFilteredInvoices
    .filter((inv) => inv.tahunAjaran === filterAcademicYear)
    .reduce((acc, i) => acc + i.terbayar, 0);

  // Recent transactions
  const recentTransactions = transactions
    .filter((t) => selectedUnitFilter === 'all' || t.unit === selectedUnitFilter)
    .slice(0, 5);

  const monthsList = [
    { num: 7, name: 'Juli' },
    { num: 8, name: 'Agustus' },
    { num: 9, name: 'September' },
    { num: 10, name: 'Oktober' },
    { num: 11, name: 'November' },
    { num: 12, name: 'Desember' },
    { num: 1, name: 'Januari' },
    { num: 2, name: 'Februari' },
    { num: 3, name: 'Maret' },
    { num: 4, name: 'April' },
    { num: 5, name: 'Mei' },
    { num: 6, name: 'Juni' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Islamic Greeting */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative Islamic geometric star pattern background */}
        <div className="absolute right-0 top-0 w-96 h-96 opacity-10 pointer-events-none translate-x-20 -translate-y-20">
          <svg viewBox="0 0 200 200" fill="currentColor">
            <polygon points="100,0 120,70 190,70 135,110 160,180 100,140 40,180 65,110 10,70 80,70" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-semibold mb-2">
              <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
              <span>•</span>
              <span>Sistem Terpusat SIT Insan Harapan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Administrasi Keuangan SPP
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Yayasan Harapan Ibu Kepri • Unit Pendidikan: RAIT, SDIT, dan SMPIT Insan Harapan Batam.
              Pemantauan kas masuk, rekap tagihan, dan monitoring tunggakan terintegrasi.
            </p>
          </div>

          {/* Quick Filter Selection */}
          <div className="flex flex-wrap items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            <div>
              <label className="block text-[10px] text-emerald-200 uppercase font-semibold mb-0.5">
                Bulan Tagihan:
              </label>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(Number(e.target.value))}
                className="bg-emerald-950/80 border border-emerald-600/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              >
                {monthsList.map((m) => (
                  <option key={m.num} value={m.num}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-emerald-200 uppercase font-semibold mb-0.5">
                Tahun Ajaran:
              </label>
              <select
                value={filterAcademicYear}
                onChange={(e) => setFilterAcademicYear(e.target.value)}
                className="bg-emerald-950/80 border border-emerald-600/50 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium"
              >
                <option value="2024/2025">2024/2025</option>
                <option value="2025/2026">2025/2026</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Shortcuts Bar */}
        <div className="mt-6 pt-5 border-t border-emerald-700/60 flex flex-wrap items-center gap-2.5 text-xs">
          <span className="text-emerald-200 text-[11px] font-semibold mr-1">Aksi Cepat:</span>
          <button
            onClick={() => setCurrentTab('transaksi')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold transition shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Catat Pembayaran Kasir
          </button>
          <button
            onClick={() => setCurrentTab('tagihan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            Generate Tagihan Massal
          </button>
          <button
            onClick={() => setCurrentTab('tunggakan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            Lihat Tunggakan ({totalSiswaBelumLunas} Siswa)
          </button>
          <button
            onClick={() => setCurrentTab('laporan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium border border-white/30 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak Laporan Keuangan
          </button>
        </div>
      </div>

      {/* Section: 8 Kartu Statistik Wajib */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            8 Indikator Keuangan SPP Utama
          </h2>
          <span className="text-xs text-stone-400">
            Unit: <strong>{selectedUnitFilter.toUpperCase()}</strong> • Periode: {monthsList.find((m) => m.num === filterMonth)?.name} {filterAcademicYear}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Siswa Aktif */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">1. Total Siswa Aktif</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900">{totalActiveStudents}</div>
            <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
              <span>Terdaftar di {selectedUnitFilter === 'all' ? 'seluruh unit' : selectedUnitFilter.toUpperCase()}</span>
            </div>
          </div>

          {/* Card 2: Total Tagihan Bulan Berjalan */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">2. Tagihan Bulan Berjalan</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-stone-900 font-mono">
              {formatRupiah(totalTagihanBulanIni)}
            </div>
            <div className="text-[11px] text-stone-400 mt-1">
              Dari {currentMonthInvoices.length} surat tagihan diterbitkan
            </div>
          </div>

          {/* Card 3: Pembayaran Sudah Diterima */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">3. Pembayaran Diterima</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              {formatRupiah(totalDiterimaBulanIni)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">
              Realisasi kas masuk bulan berjalan
            </div>
          </div>

          {/* Card 4: Total Tunggakan SPP */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">4. Total Tunggakan SPP</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-800 font-mono">
              {formatRupiah(totalTunggakanBulanIni)}
            </div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">
              Sisa piutang bulan berjalan
            </div>
          </div>

          {/* Card 5: Siswa Sudah Lunas */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">5. Siswa Sudah Lunas</span>
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-teal-900">{totalSiswaLunas} Siswa</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Kewajiban bulan berjalan terpenuhi
            </div>
          </div>

          {/* Card 6: Siswa Belum Lunas */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-amber-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">6. Siswa Belum Lunas</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-rose-900">{totalSiswaBelumLunas} Siswa</div>
            <div className="text-[11px] text-stone-400 mt-1">
              Termasuk cicilan dan belum bayar
            </div>
          </div>

          {/* Card 7: Persentase Pembayaran */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500">7. Capaian Pembayaran</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-950">{persentasePembayaran}%</div>
            <div className="w-full bg-stone-100 h-2 rounded-full mt-2 overflow-hidden">
              <div
                style={{ width: `${persentasePembayaran}%` }}
                className="bg-emerald-600 h-full rounded-full transition-all"
              />
            </div>
          </div>

          {/* Card 8: Total Pemasukan Tahun Berjalan */}
          <div className="bg-gradient-to-br from-emerald-950 to-emerald-900 text-white p-5 rounded-2xl shadow-md border border-emerald-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                8. Kas Masuk SPP (TA)
              </span>
              <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center border border-white/20">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {formatRupiah(totalPemasukanTahunBerjalan)}
            </div>
            <div className="text-[11px] text-emerald-200 mt-1 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Akumulasi TA {filterAcademicYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: 4 Dynamic Interactive Charts */}
      <div className="pt-2">
        <SPPCharts invoices={unitFilteredInvoices} transactions={transactions} />
      </div>

      {/* Section: Recent Transactions Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Transaksi Pembayaran SPP Terkini</h3>
            <p className="text-xs text-stone-500">5 riwayat pembayaran kasir dan transfer perbankan terakhir</p>
          </div>
          <button
            onClick={() => setCurrentTab('transaksi')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1"
          >
            <span>Buka Kasir & Semua Transaksi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Kuitansi</th>
                <th className="py-3 px-4">Siswa & Jenjang</th>
                <th className="py-3 px-4">Periode Dibayar</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-stone-800">
                    {trx.nomorKuitansi}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{trx.namaSiswa}</div>
                    <div className="text-[11px] text-stone-400">
                      NIS: {trx.nis} • {trx.unit.toUpperCase()} {trx.kelas}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-stone-700">
                      {trx.alokasi.map((a) => a.namaBulan).join(', ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]">
                      {trx.metodePembayaran}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500">
                    {formatTanggalIndo(trx.tanggalBayar, true)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-800">
                    {formatRupiah(trx.totalBayar)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setActiveReceipt(trx)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition"
                      title="Cetak Kuitansi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
