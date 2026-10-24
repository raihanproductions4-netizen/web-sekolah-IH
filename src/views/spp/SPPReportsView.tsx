/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPUnit, Student, SPPInvoice, SPPTransaction } from '../../types/spp';
import {
  formatRupiah,
  formatTanggalIndo,
  exportToCSV,
  terbilangRupiah,
  getCleanWhatsAppNumber,
} from '../../utils/sppHelpers';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Award,
  Layers,
  FileText,
  Users,
  Search,
  Clock,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

export const SPPReportsView: React.FC = () => {
  const {
    students,
    invoices,
    transactions,
    settings,
    classes,
    selectedUnitFilter,
  } = useSPP();

  // Report Category Types
  const reportCategories = [
    { id: 'harian', name: '1. Rekap Pembayaran Harian', desc: 'Rincian penerimaan kas per tanggal pembayaran' },
    { id: 'bulanan', name: '2. Rekap Pembayaran Bulanan', desc: 'Rekapitulasi penerimaan kas per bulan dan metode' },
    { id: 'tahunan', name: '3. Rekap Pembayaran Tahunan', desc: 'Progres penerimaan 1 tahun ajaran (Juli - Juni)' },
    { id: 'kelas', name: '4. Rekap Pembayaran per Kelas', desc: 'Perbandingan tagihan, kas masuk & tunggakan per rombel' },
    { id: 'belum_bayar', name: '5. Daftar Siswa Belum Membayar', desc: 'Daftar siswa yang belum ada pembayaran di periode ini' },
    { id: 'sebagian', name: '6. Daftar Siswa Pembayaran Sebagian', desc: 'Daftar siswa dengan status cicilan belum lunas' },
    { id: 'per_siswa', name: '7. Riwayat Pembayaran per Siswa', desc: 'Buku besar ledger tagihan dan pembayaran individual' },
  ];

  const [activeReport, setActiveReport] = useState<string>('bulanan');

  // Filter States
  const [filterUnit, setFilterUnit] = useState<SPPUnit>(selectedUnitFilter);
  const [filterMonth, setFilterMonth] = useState<number>(10); // Oktober
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>(settings.tahunAjaranAktif || '2024/2025');
  const [filterKelas, setFilterKelas] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentSearchLedger, setStudentSearchLedger] = useState<string>('');

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

  // Distinct classes list
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((c) => set.add(c.namaKelas));
    students.forEach((s) => set.add(s.kelas));
    return Array.from(set).sort();
  }, [classes, students]);

  // Base Invoices Filtered
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (filterUnit !== 'all' && inv.unit !== filterUnit) return false;
      if (inv.tahunAjaran !== filterAcademicYear) return false;
      if (filterKelas !== 'all' && inv.kelas !== filterKelas) return false;
      if (filterMonth !== 0 && inv.bulan !== filterMonth) return false;
      if (filterStatus !== 'all' && inv.status !== filterStatus) return false;
      return true;
    });
  }, [invoices, filterUnit, filterAcademicYear, filterKelas, filterMonth, filterStatus]);

  // Base Transactions Filtered
  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      if (trx.status === 'dibatalkan') return false;
      if (filterUnit !== 'all' && trx.unit !== filterUnit) return false;
      if (filterKelas !== 'all' && trx.kelas !== filterKelas) return false;

      // Date Range filter
      if (filterDateFrom) {
        const trxDate = trx.tanggalBayar.slice(0, 10);
        if (trxDate < filterDateFrom) return false;
      }
      if (filterDateTo) {
        const trxDate = trx.tanggalBayar.slice(0, 10);
        if (trxDate > filterDateTo) return false;
      }

      // Month filter
      if (filterMonth !== 0) {
        const monthName = monthsList.find((m) => m.num === filterMonth)?.name.toLowerCase() || '';
        const matchesMonth = trx.alokasi.some((a) => a.namaBulan.toLowerCase().includes(monthName));
        if (!matchesMonth && !filterDateFrom && !filterDateTo) return false;
      }

      return true;
    });
  }, [transactions, filterUnit, filterKelas, filterDateFrom, filterDateTo, filterMonth]);

  // Summary KPI Totals
  const reportKPI = useMemo(() => {
    const totalTagihan = filteredInvoices.reduce((a, b) => a + b.totalTagihan, 0);
    const totalTerbayar = filteredInvoices.reduce((a, b) => a + b.terbayar, 0);
    const totalTunggakan = filteredInvoices.reduce((a, b) => a + b.sisaTagihan, 0);
    const totalSiswaLunas = filteredInvoices.filter((i) => i.status === 'lunas' || i.status === 'bebas').length;
    const totalSiswaBelumLunas = filteredInvoices.filter((i) => i.sisaTagihan > 0).length;
    const persentase = totalTagihan > 0 ? Math.round((totalTerbayar / totalTagihan) * 100) : 0;

    return {
      totalTagihan,
      totalTerbayar,
      totalTunggakan,
      totalSiswaLunas,
      totalSiswaBelumLunas,
      persentase,
    };
  }, [filteredInvoices]);

  // Trigger browser print
  const handlePrint = () => {
    window.print();
  };

  // Export Active Report to CSV
  const handleExportCSV = () => {
    const filename = `LAPORAN_SPP_${activeReport.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`;

    switch (activeReport) {
      case 'harian': {
        const rows = filteredTransactions.map((t) => ({
          'No. Kuitansi': t.nomorKuitansi,
          'No. Transaksi': t.nomorTransaksi,
          'Tanggal Bayar': formatTanggalIndo(t.tanggalBayar, true),
          NIS: t.nis,
          'Nama Siswa': t.namaSiswa,
          Unit: t.unit.toUpperCase(),
          Kelas: t.kelas,
          'Bulan Dibayar': t.alokasi.map((a) => a.namaBulan).join('; '),
          'Total Bayar': t.totalBayar,
          'Metode Pembayaran': t.metodePembayaran,
          'No. Referensi': t.nomorReferensi || '-',
          Petugas: t.petugas,
        }));
        exportToCSV(filename, rows);
        break;
      }
      case 'kelas': {
        const classSummaries = availableClasses.map((cls) => {
          const classInvoices = filteredInvoices.filter((i) => i.kelas === cls);
          const tagihan = classInvoices.reduce((a, b) => a + b.totalTagihan, 0);
          const terbayar = classInvoices.reduce((a, b) => a + b.terbayar, 0);
          const tunggakan = classInvoices.reduce((a, b) => a + b.sisaTagihan, 0);
          const lunasCount = classInvoices.filter((i) => i.status === 'lunas').length;
          return {
            Kelas: cls,
            'Jumlah Tagihan': classInvoices.length,
            'Total Tagihan': tagihan,
            'Pembayaran Diterima': terbayar,
            'Total Tunggakan': tunggakan,
            'Persentase Pelunasan': tagihan > 0 ? `${Math.round((terbayar / tagihan) * 100)}%` : '0%',
            'Siswa Lunas': lunasCount,
          };
        });
        exportToCSV(filename, classSummaries);
        break;
      }
      case 'belum_bayar': {
        const unpaidBills = filteredInvoices.filter((i) => i.terbayar === 0 && i.status !== 'bebas');
        const rows = unpaidBills.map((b) => ({
          'No. Tagihan': b.nomorTagihan,
          NIS: b.nis,
          'Nama Siswa': b.namaSiswa,
          Unit: b.unit.toUpperCase(),
          Kelas: b.kelas,
          'Bulan Tagihan': b.namaBulan,
          'Total Tagihan': b.totalTagihan,
          'Sisa Tagihan': b.sisaTagihan,
          'Jatuh Tempo': b.jatuhTempo,
          Status: b.status,
        }));
        exportToCSV(filename, rows);
        break;
      }
      case 'sebagian': {
        const partialBills = filteredInvoices.filter((i) => i.terbayar > 0 && i.sisaTagihan > 0);
        const rows = partialBills.map((b) => ({
          'No. Tagihan': b.nomorTagihan,
          NIS: b.nis,
          'Nama Siswa': b.namaSiswa,
          Unit: b.unit.toUpperCase(),
          Kelas: b.kelas,
          'Bulan Tagihan': b.namaBulan,
          'Total Tagihan': b.totalTagihan,
          'Sudah Dicicil': b.terbayar,
          'Sisa Tunggakan': b.sisaTagihan,
          'Jatuh Tempo': b.jatuhTempo,
        }));
        exportToCSV(filename, rows);
        break;
      }
      default: {
        const rows = filteredInvoices.map((inv) => ({
          'No. Tagihan': inv.nomorTagihan,
          NIS: inv.nis,
          'Nama Siswa': inv.namaSiswa,
          Unit: inv.unit.toUpperCase(),
          Kelas: inv.kelas,
          Bulan: inv.namaBulan,
          'Tarif Bersih': inv.totalTagihan,
          'Terbayar (Rp)': inv.terbayar,
          'Sisa Tagihan (Rp)': inv.sisaTagihan,
          Status: inv.status,
          'Jatuh Tempo': inv.jatuhTempo,
        }));
        exportToCSV(filename, rows);
        break;
      }
    }
  };

  // Selected student for Ledger
  const targetStudentLedger = useMemo(() => {
    if (!selectedStudentId && students.length > 0) return students[0];
    return students.find((s) => s.id === selectedStudentId) || students[0];
  }, [students, selectedStudentId]);

  const studentLedgerInvoices = useMemo(() => {
    if (!targetStudentLedger) return [];
    return invoices
      .filter((i) => i.siswaId === targetStudentLedger.id)
      .sort((a, b) => a.bulan - b.bulan);
  }, [invoices, targetStudentLedger]);

  const studentLedgerTransactions = useMemo(() => {
    if (!targetStudentLedger) return [];
    return transactions.filter(
      (t) => t.siswaId === targetStudentLedger.id && t.status === 'sukses'
    );
  }, [transactions, targetStudentLedger]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Laporan Administrasi Keuangan SPP</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Rekapitulasi Resmi
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Rekap harian, bulanan, tahunan, rekap kelas, daftar tunggakan, riwayat pembayaran per siswa, cetak dokumen resmi, dan ekspor data CSV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Report Categories Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        {reportCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveReport(cat.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
              activeReport === cat.id
                ? 'bg-emerald-800 text-white shadow-xs font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* KPI Cards (Total Tagihan, Pembayaran Diterima, Tunggakan, % Lunas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Total Tagihan Terbit
          </span>
          <div className="text-xl font-black font-mono text-stone-900 mt-1">
            {formatRupiah(reportKPI.totalTagihan)}
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            {filteredInvoices.length} Dokumen Tagihan Terpilih
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
            Total Pembayaran Diterima
          </span>
          <div className="text-xl font-black font-mono text-emerald-900 mt-1">
            {formatRupiah(reportKPI.totalTerbayar)}
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
            Realisasi Kas Masuk ({reportKPI.persentase}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">
            Total Tunggakan SPP
          </span>
          <div className="text-xl font-black font-mono text-rose-900 mt-1">
            {formatRupiah(reportKPI.totalTunggakan)}
          </div>
          <div className="text-[11px] text-rose-700 mt-0.5 font-medium">
            Sisa Piutang Sekolah
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
            Status Pelunasan Siswa
          </span>
          <div className="text-xl font-bold text-stone-900 mt-1 flex items-center gap-2">
            <span className="text-emerald-700">{reportKPI.totalSiswaLunas} Lunas</span>
            <span className="text-stone-300">/</span>
            <span className="text-amber-700">{reportKPI.totalSiswaBelumLunas} Belum</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-0.5">
            Tahun Ajaran {filterAcademicYear}
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 font-bold text-stone-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-emerald-700" />
          <span>Filter Laporan:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          {/* Unit Filter */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Unit Pendidikan</label>
            <select
              value={filterUnit}
              onChange={(e) => setFilterUnit(e.target.value as SPPUnit)}
              className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Unit (RAIT, SD, SMP)</option>
              <option value="rait">RAIT Insan Harapan</option>
              <option value="sdit">SDIT Insan Harapan</option>
              <option value="smpit">SMPIT Insan Harapan</option>
            </select>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Periode Bulan</label>
            <select
              value={filterMonth}
              onChange={(e) => setFilterMonth(Number(e.target.value))}
              className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value={0}>Semua Bulan (1 Tahun)</option>
              {monthsList.map((m) => (
                <option key={m.num} value={m.num}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Tahun Ajaran</label>
            <select
              value={filterAcademicYear}
              onChange={(e) => setFilterAcademicYear(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="2024/2025">2024/2025</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2023/2024">2023/2024</option>
            </select>
          </div>

          {/* Kelas Filter */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Kelas / Rombel</label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Kelas</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Status Pembayaran</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="lunas">Lunas</option>
              <option value="sebagian">Dibayar Sebagian</option>
              <option value="belum_bayar">Belum Bayar</option>
              <option value="terlambat">Terlambat</option>
            </select>
          </div>

          {/* Date range inputs */}
          <div>
            <label className="block text-[10px] text-stone-400 uppercase font-bold mb-1">Rentang Tanggal</label>
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="w-full p-1.5 border border-stone-300 rounded-lg text-[11px] bg-white"
                placeholder="Dari"
              />
              <span className="text-stone-400">-</span>
              <input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="w-full p-1.5 border border-stone-300 rounded-lg text-[11px] bg-white"
                placeholder="Sampai"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Report Document Sheet (Printable Container) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden" id="report-printable-area">
        {/* Printable Official Header (Shown both on screen and print) */}
        <div className="p-6 border-b border-stone-200 bg-stone-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-900 text-amber-300 font-black flex items-center justify-center text-lg shadow-xs">
                SIT
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 block">
                  {settings.namaYayasan}
                </span>
                <h2 className="text-base sm:text-lg font-black text-stone-900">
                  {settings.namaSekolah}
                </h2>
                <p className="text-[11px] text-stone-500">
                  {settings.alamatYayasan} • Telp: {settings.kontakYayasan}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs">
                {reportCategories.find((c) => c.id === activeReport)?.name}
              </span>
              <div className="text-[10px] text-stone-400 mt-1">
                Tahun Ajaran: <strong>{filterAcademicYear}</strong> • Periode:{' '}
                <strong>{filterMonth === 0 ? '1 Tahun Penuh' : monthsList.find((m) => m.num === filterMonth)?.name}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Content based on Active Report */}
        <div className="p-6">
          {/* 1. Rekap Harian */}
          {activeReport === 'harian' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">No. Transaksi & Kuitansi</th>
                      <th className="py-2.5 px-3">Waktu Bayar</th>
                      <th className="py-2.5 px-3">Siswa</th>
                      <th className="py-2.5 px-3">Unit / Kelas</th>
                      <th className="py-2.5 px-3">Bulan Tagihan</th>
                      <th className="py-2.5 px-3">Metode Bayar</th>
                      <th className="py-2.5 px-3">Kasir</th>
                      <th className="py-2.5 px-3 text-right">Nominal Diterima</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-stone-400">
                          Tidak ada transaksi penerimaan kas pada filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((trx) => (
                        <tr key={trx.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                            {trx.nomorKuitansi}
                            <span className="block text-[10px] text-stone-400 font-normal">{trx.nomorTransaksi}</span>
                          </td>
                          <td className="py-2.5 px-3">{formatTanggalIndo(trx.tanggalBayar, true)}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-stone-900">{trx.namaSiswa}</div>
                            <div className="text-[10px] text-stone-400">NIS: {trx.nis}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-emerald-800">{trx.unit.toUpperCase()}</span> ({trx.kelas})
                          </td>
                          <td className="py-2.5 px-3">{trx.alokasi.map((a) => a.namaBulan).join(', ')}</td>
                          <td className="py-2.5 px-3">
                            <span className="text-stone-800 font-medium">{trx.metodePembayaran}</span>
                            {trx.nomorReferensi && (
                              <span className="block text-[10px] font-mono text-stone-400">Ref: {trx.nomorReferensi}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-stone-600">{trx.petugas}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                            {formatRupiah(trx.totalBayar)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-stone-100 font-bold border-t-2 border-stone-300">
                    <tr>
                      <td colSpan={7} className="py-3 px-3 text-right uppercase tracking-wider text-stone-700">
                        Total Penerimaan Harian Terfilter:
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-950 font-mono font-black text-sm">
                        {formatRupiah(filteredTransactions.reduce((a, b) => a + b.totalBayar, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 2. Rekap Bulanan */}
          {activeReport === 'bulanan' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">No. Tagihan</th>
                      <th className="py-2.5 px-3">Siswa</th>
                      <th className="py-2.5 px-3">Jenjang & Kelas</th>
                      <th className="py-2.5 px-3">Periode</th>
                      <th className="py-2.5 px-3 text-right">Tarif Bersih</th>
                      <th className="py-2.5 px-3 text-right">Terbayar</th>
                      <th className="py-2.5 px-3 text-right">Sisa Tunggakan</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-stone-400">
                          Tidak ada tagihan yang cocok dengan filter yang dipilih.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-mono font-semibold text-stone-800">{inv.nomorTagihan}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-stone-900">{inv.namaSiswa}</div>
                            <div className="text-[10px] text-stone-400">NIS: {inv.nis}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-emerald-800">{inv.unit.toUpperCase()}</span> ({inv.kelas})
                          </td>
                          <td className="py-2.5 px-3">{inv.namaBulan}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(inv.totalTagihan)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                            {formatRupiah(inv.terbayar)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-900">
                            {formatRupiah(inv.sisaTagihan)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'lunas' || inv.status === 'bebas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'sebagian'
                                ? 'bg-blue-100 text-blue-800'
                                : inv.status === 'terlambat'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {inv.status === 'lunas' ? 'Lunas' : inv.status === 'sebagian' ? 'Sebagian' : inv.status === 'terlambat' ? 'Terlambat' : 'Belum Bayar'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  <tfoot className="bg-stone-100 font-bold border-t-2 border-stone-300">
                    <tr>
                      <td colSpan={4} className="py-3 px-3 text-right uppercase tracking-wider text-stone-700">
                        Total Rekapitulasi:
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-extrabold text-stone-900">
                        {formatRupiah(reportKPI.totalTagihan)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-emerald-900">
                        {formatRupiah(reportKPI.totalTerbayar)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-rose-900">
                        {formatRupiah(reportKPI.totalTunggakan)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* 3. Rekap Tahunan */}
          {activeReport === 'tahunan' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-3 text-center">Jml Tagihan</th>
                      <th className="py-2.5 px-3 text-right">Target Tagihan</th>
                      <th className="py-2.5 px-3 text-right">Realisasi Kas Masuk</th>
                      <th className="py-2.5 px-3 text-right">Sisa Tunggakan</th>
                      <th className="py-2.5 px-3 text-center">% Realisasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {monthsList.map((m) => {
                      const monthBills = invoices.filter(
                        (i) =>
                          i.bulan === m.num &&
                          i.tahunAjaran === filterAcademicYear &&
                          (filterUnit === 'all' || i.unit === filterUnit)
                      );
                      const target = monthBills.reduce((a, b) => a + b.totalTagihan, 0);
                      const masuk = monthBills.reduce((a, b) => a + b.terbayar, 0);
                      const sisa = monthBills.reduce((a, b) => a + b.sisaTagihan, 0);
                      const pct = target > 0 ? Math.round((masuk / target) * 100) : 0;

                      return (
                        <tr key={m.num} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-bold text-stone-900">{m.name}</td>
                          <td className="py-2.5 px-3 text-center text-stone-600">{monthBills.length}</td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(target)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                            {formatRupiah(masuk)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-900">
                            {formatRupiah(sisa)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-stone-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="font-bold text-[11px]">{pct}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Rekap per Kelas */}
          {activeReport === 'kelas' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-emerald-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Nama Rombel / Kelas</th>
                      <th className="py-2.5 px-3 text-center">Siswa Aktif</th>
                      <th className="py-2.5 px-3 text-right">Total Tagihan</th>
                      <th className="py-2.5 px-3 text-right">Pembayaran Diterima</th>
                      <th className="py-2.5 px-3 text-right">Total Tunggakan</th>
                      <th className="py-2.5 px-3 text-center">Rasio Pelunasan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {availableClasses.map((cls) => {
                      const classBills = filteredInvoices.filter((i) => i.kelas === cls);
                      const classStudents = students.filter((s) => s.kelas === cls && s.status === 'aktif');
                      const tagihan = classBills.reduce((a, b) => a + b.totalTagihan, 0);
                      const masuk = classBills.reduce((a, b) => a + b.terbayar, 0);
                      const tunggakan = classBills.reduce((a, b) => a + b.sisaTagihan, 0);
                      const pct = tagihan > 0 ? Math.round((masuk / tagihan) * 100) : 0;

                      return (
                        <tr key={cls} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 font-bold text-stone-900">
                            Kelas {cls}
                          </td>
                          <td className="py-2.5 px-3 text-center font-semibold text-stone-700">
                            {classStudents.length} Santri
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(tagihan)}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-900">
                            {formatRupiah(masuk)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-900">
                            {formatRupiah(tunggakan)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-[11px] ${
                              pct >= 80 ? 'bg-emerald-100 text-emerald-900' : pct >= 50 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                            }`}>
                              {pct}% Lunas
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. Daftar Siswa Belum Membayar */}
          {activeReport === 'belum_bayar' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-rose-950 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">No. Tagihan</th>
                      <th className="py-2.5 px-3">Siswa</th>
                      <th className="py-2.5 px-3">Unit & Kelas</th>
                      <th className="py-2.5 px-3">Bulan Tertunggak</th>
                      <th className="py-2.5 px-3 text-right">Nominal Tagihan</th>
                      <th className="py-2.5 px-3">Nama Orang Tua</th>
                      <th className="py-2.5 px-3">WhatsApp Wali</th>
                      <th className="py-2.5 px-3 text-center">Aksi Pengingat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredInvoices.filter((i) => i.terbayar === 0 && i.status !== 'bebas').length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-emerald-700 font-semibold bg-emerald-50">
                          Alhamdulillah! Tidak ada siswa dengan status belum bayar sama sekali pada filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices
                        .filter((i) => i.terbayar === 0 && i.status !== 'bebas')
                        .map((b) => {
                          const stu = students.find((s) => s.id === b.siswaId);
                          const waPhone = stu?.noWhatsapp || '';

                          return (
                            <tr key={b.id} className="hover:bg-rose-50/40">
                              <td className="py-2.5 px-3 font-mono font-semibold text-stone-800">{b.nomorTagihan}</td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-stone-900">{b.namaSiswa}</div>
                                <div className="text-[10px] text-stone-400">NIS: {b.nis}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="font-bold text-emerald-800">{b.unit.toUpperCase()}</span> ({b.kelas})
                              </td>
                              <td className="py-2.5 px-3 font-medium text-stone-800">{b.namaBulan}</td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-900">
                                {formatRupiah(b.totalTagihan)}
                              </td>
                              <td className="py-2.5 px-3 text-stone-700">{stu?.namaOrangTua || '-'}</td>
                              <td className="py-2.5 px-3 font-mono text-stone-600">{waPhone || '-'}</td>
                              <td className="py-2.5 px-3 text-center">
                                {waPhone ? (
                                  <a
                                    href={`https://wa.me/${getCleanWhatsAppNumber(waPhone)}?text=${encodeURIComponent(
                                      `Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu Wali dari ${b.namaSiswa}, kami informasikan tagihan SPP ${b.namaBulan} sebesar ${formatRupiah(b.totalTagihan)} belum tercatat lunas di SIT Insan Harapan. Terima kasih.`
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] transition shadow-2xs"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Kirim WA</span>
                                  </a>
                                ) : (
                                  <span className="text-stone-400 text-[10px]">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. Daftar Siswa Pembayaran Sebagian */}
          {activeReport === 'sebagian' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-stone-700">
                  <thead className="bg-blue-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">No. Tagihan</th>
                      <th className="py-2.5 px-3">Siswa</th>
                      <th className="py-2.5 px-3">Unit & Kelas</th>
                      <th className="py-2.5 px-3">Bulan</th>
                      <th className="py-2.5 px-3 text-right">Tarif Bersih</th>
                      <th className="py-2.5 px-3 text-right">Sudah Dicicil</th>
                      <th className="py-2.5 px-3 text-right">Sisa Tunggakan</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredInvoices.filter((i) => i.terbayar > 0 && i.sisaTagihan > 0).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-stone-400">
                          Tidak ada siswa dengan status pembayaran sebagian (cicilan) pada filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices
                        .filter((i) => i.terbayar > 0 && i.sisaTagihan > 0)
                        .map((b) => (
                          <tr key={b.id} className="hover:bg-blue-50/40">
                            <td className="py-2.5 px-3 font-mono font-semibold text-stone-800">{b.nomorTagihan}</td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-stone-900">{b.namaSiswa}</div>
                              <div className="text-[10px] text-stone-400">NIS: {b.nis}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-emerald-800">{b.unit.toUpperCase()}</span> ({b.kelas})
                            </td>
                            <td className="py-2.5 px-3">{b.namaBulan}</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(b.totalTagihan)}</td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-900">
                              {formatRupiah(b.terbayar)}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-900">
                              {formatRupiah(b.sisaTagihan)}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                Cicilan Sebagian
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 7. Riwayat Pembayaran per Siswa (Buku Besar Individual) */}
          {activeReport === 'per_siswa' && (
            <div className="space-y-5">
              {/* Student Selector Bar */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Pilih Siswa / Santri untuk Melihat Riwayat Lengkap:
                  </label>
                  <select
                    value={targetStudentLedger?.id || ''}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full sm:w-80 p-2 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.namaLengkap} (NIS: {s.nis}) - {s.unit.toUpperCase()} {s.kelas}
                      </option>
                    ))}
                  </select>
                </div>

                {targetStudentLedger && (
                  <div className="text-right text-xs">
                    <span className="text-stone-500 block">Wali Murid:</span>
                    <strong className="text-stone-900">{targetStudentLedger.namaOrangTua}</strong>
                    <span className="text-[11px] text-stone-500 block">WA: {targetStudentLedger.noWhatsapp}</span>
                  </div>
                )}
              </div>

              {/* Individual Ledger Tables */}
              {targetStudentLedger && (
                <div className="space-y-4">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                    Daftar Seluruh Tagihan SPP: {targetStudentLedger.namaLengkap}
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-stone-700">
                      <thead className="bg-emerald-900 text-white font-semibold">
                        <tr>
                          <th className="py-2 px-3">No. Tagihan</th>
                          <th className="py-2 px-3">Bulan</th>
                          <th className="py-2 px-3 text-right">Tarif Asli</th>
                          <th className="py-2 px-3 text-right">Potongan</th>
                          <th className="py-2 px-3 text-right">Tarif Bersih</th>
                          <th className="py-2 px-3 text-right">Terbayar</th>
                          <th className="py-2 px-3 text-right">Sisa Kewajiban</th>
                          <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {studentLedgerInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-stone-50">
                            <td className="py-2 px-3 font-mono font-semibold text-stone-800">{inv.nomorTagihan}</td>
                            <td className="py-2 px-3 font-bold text-stone-900">{inv.namaBulan}</td>
                            <td className="py-2 px-3 text-right font-mono text-stone-500">{formatRupiah(inv.nominalAsli)}</td>
                            <td className="py-2 px-3 text-right font-mono text-emerald-700">
                              {inv.potongan > 0 ? `-${formatRupiah(inv.potongan)}` : '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatRupiah(inv.totalTagihan)}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-900">{formatRupiah(inv.terbayar)}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-rose-900">{formatRupiah(inv.sisaTagihan)}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                inv.status === 'lunas' || inv.status === 'bebas'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : inv.status === 'sebagian'
                                  ? 'bg-blue-100 text-blue-800'
                                  : inv.status === 'terlambat'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {inv.status === 'lunas' ? 'Lunas' : inv.status === 'sebagian' ? 'Sebagian' : inv.status === 'terlambat' ? 'Terlambat' : 'Belum Bayar'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment Transactions by this student */}
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider pt-2">
                    Riwayat Bukti Transaksi Kasir / Transfer ({studentLedgerTransactions.length} Transaksi)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-stone-700 border border-stone-200 rounded-lg">
                      <thead className="bg-stone-100 text-stone-700 font-semibold">
                        <tr>
                          <th className="py-2 px-3">No. Kuitansi</th>
                          <th className="py-2 px-3">Tanggal Transaksi</th>
                          <th className="py-2 px-3">Bulan Terbayar</th>
                          <th className="py-2 px-3">Metode Bayar</th>
                          <th className="py-2 px-3 text-right">Nominal Bayar</th>
                          <th className="py-2 px-3">Kasir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-medium">
                        {studentLedgerTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-stone-400">
                              Belum ada transaksi pembayaran yang tercatat untuk siswa ini.
                            </td>
                          </tr>
                        ) : (
                          studentLedgerTransactions.map((trx) => (
                            <tr key={trx.id} className="hover:bg-stone-50">
                              <td className="py-2 px-3 font-mono font-bold text-stone-900">{trx.nomorKuitansi}</td>
                              <td className="py-2 px-3">{formatTanggalIndo(trx.tanggalBayar, true)}</td>
                              <td className="py-2 px-3">{trx.alokasi.map((a) => a.namaBulan).join(', ')}</td>
                              <td className="py-2 px-3">{trx.metodePembayaran}</td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-emerald-900">
                                {formatRupiah(trx.totalBayar)}
                              </td>
                              <td className="py-2 px-3 text-stone-600">{trx.petugas}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Printable Formal Signatures Block */}
        <div className="p-6 bg-stone-50 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs text-stone-800">
          <div>
            <span className="text-stone-500 block text-[11px]">Mengetahui,</span>
            <span className="font-semibold block text-stone-700 mb-14">Kepala SIT Insan Harapan Batam</span>
            <div className="font-bold underline text-stone-900">{settings.kepalaYayasan}</div>
            <span className="text-[10px] text-stone-500">NIP / ID: YHI-DIR-001</span>
          </div>

          <div className="text-right">
            <span className="text-stone-500 block text-[11px]">Batam, {formatTanggalIndo(new Date().toISOString())}</span>
            <span className="font-semibold block text-stone-700 mb-14">Bendahara Administrasi SPP</span>
            <div className="font-bold underline text-stone-900">{settings.bendaharaYayasan}</div>
            <span className="text-[10px] text-stone-500">Bagian Keuangan Yayasan Harapan Ibu Kepri</span>
          </div>
        </div>
      </div>
    </div>
  );
};
