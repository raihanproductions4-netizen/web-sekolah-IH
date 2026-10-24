/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPUnit, InvoiceStatus, SPPInvoice } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, exportToCSV, getInvoiceDisplayStatus } from '../../utils/sppHelpers';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  CreditCard,
  Building,
  Eye,
  Edit3,
  Calendar,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export const SPPInvoicesView: React.FC = () => {
  const {
    invoices,
    students,
    settings,
    selectedUnitFilter,
    generateMonthlyInvoices,
    updateInvoiceManual,
    setCurrentTab,
  } = useSPP();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState<SPPUnit>(selectedUnitFilter);
  const [filterMonth, setFilterMonth] = useState<number>(10); // Oktober
  const [filterYear, setFilterYear] = useState<string>(settings.tahunAjaranAktif || '2024/2025');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedInvoiceDetail, setSelectedInvoiceDetail] = useState<SPPInvoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<SPPInvoice | null>(null);

  // Edit Invoice Nominal Form State
  const [editNominalForm, setEditNominalForm] = useState({
    nominalAsli: 0,
    potongan: 0,
    jatuhTempo: '',
  });

  // Mass Generation Modal Form State
  const [genMonth, setGenMonth] = useState<number>(11); // default next month: November
  const [genYear, setGenYear] = useState<string>(settings.tahunAjaranAktif || '2024/2025');
  const [genUnit, setGenUnit] = useState<SPPUnit>('all');
  const [genClass, setGenClass] = useState<string>('all');
  const [tariffMode, setTariffMode] = useState<'student_default' | 'class_custom'>('student_default');
  const [customTariffNominal, setCustomTariffNominal] = useState<number>(450000);

  React.useEffect(() => {
    if (selectedUnitFilter !== 'all') {
      setFilterUnit(selectedUnitFilter);
    }
  }, [selectedUnitFilter]);

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

  const getClassesForUnit = (unit: string) => {
    if (unit === 'rait') return ['TK-A Bulan', 'TK-A Bintang', 'TK-B Matahari', 'TK-B An-Nur'];
    if (unit === 'smpit') return ['7A Al-Khawarizmi', '7B Siti Khadijah', '8A Ibnu Sina', '8B Aisyah', '9A Al-Biruni'];
    return [
      '1A Umar bin Khattab',
      '1B Abu Bakar Ash-Shiddiq',
      '2A Utsman bin Affan',
      '2B Ali bin Abi Thalib',
      '3A Thariq bin Ziyad',
      '4A Khalid bin Walid',
      '5A Bilal bin Rabah',
      '6A Shalahuddin Al-Ayyubi',
    ];
  };

  // Filtering invoices
  const filteredInvoices = invoices.filter((inv) => {
    if (filterUnit !== 'all' && inv.unit !== filterUnit) return false;
    if (filterMonth !== 0 && inv.bulan !== filterMonth) return false;
    if (filterYear !== 'all' && inv.tahunAjaran !== filterYear) return false;
    if (filterClass !== 'all' && inv.kelas !== filterClass) return false;

    // Evaluate effective status (Belum Bayar, Dibayar Sebagian, Lunas, Terlambat)
    const effective = getInvoiceDisplayStatus(inv);
    if (filterStatus !== 'all') {
      if (filterStatus === 'terlambat') {
        if (!effective.isOverdue) return false;
      } else if (filterStatus === 'lunas') {
        if (effective.status !== 'lunas' && effective.status !== 'bebas') return false;
      } else if (filterStatus === 'sebagian') {
        if (effective.status !== 'sebagian') return false;
      } else if (filterStatus === 'belum_bayar') {
        if (effective.status !== 'belum_bayar' || effective.isOverdue) return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = inv.namaSiswa.toLowerCase().includes(q);
      const matchNIS = inv.nis.toLowerCase().includes(q);
      const matchNo = inv.nomorTagihan.toLowerCase().includes(q);
      if (!matchName && !matchNIS && !matchNo) return false;
    }

    return true;
  });

  // Summary / Rekap figures
  const totalBilled = filteredInvoices.reduce((a, b) => a + b.totalTagihan, 0);
  const totalPaid = filteredInvoices.reduce((a, b) => a + b.terbayar, 0);
  const totalRemaining = filteredInvoices.reduce((a, b) => a + b.sisaTagihan, 0);

  // Status breakdown count
  let countLunas = 0;
  let countSebagian = 0;
  let countBelumBayar = 0;
  let countTerlambat = 0;

  filteredInvoices.forEach((inv) => {
    const disp = getInvoiceDisplayStatus(inv);
    if (disp.status === 'lunas' || disp.status === 'bebas') countLunas++;
    else if (disp.isOverdue) countTerlambat++;
    else if (disp.status === 'sebagian') countSebagian++;
    else countBelumBayar++;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Mass Generation
  const handleRunMassGeneration = () => {
    const customRate = tariffMode === 'class_custom' ? customTariffNominal : undefined;
    generateMonthlyInvoices(genMonth, genYear, genUnit, genClass, customRate);
    setIsGenerateModalOpen(false);
    setFilterMonth(genMonth);
    setFilterYear(genYear);
    if (genUnit !== 'all') setFilterUnit(genUnit);
    if (genClass !== 'all') setFilterClass(genClass);
  };

  // Open Edit Nominal Modal
  const handleOpenEditInvoice = (inv: SPPInvoice) => {
    setEditingInvoice(inv);
    setEditNominalForm({
      nominalAsli: inv.nominalAsli,
      potongan: inv.potongan,
      jatuhTempo: inv.jatuhTempo,
    });
  };

  const handleSaveEditInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    updateInvoiceManual(editingInvoice.id, {
      nominalAsli: editNominalForm.nominalAsli,
      potongan: editNominalForm.potongan,
      jatuhTempo: editNominalForm.jatuhTempo,
    });

    setEditingInvoice(null);
  };

  const handleExportCSV = () => {
    const rows = filteredInvoices.map((inv) => {
      const disp = getInvoiceDisplayStatus(inv);
      return {
        'No Tagihan': inv.nomorTagihan,
        NIS: inv.nis,
        'Nama Siswa': inv.namaSiswa,
        Unit: inv.unit.toUpperCase(),
        Kelas: inv.kelas,
        Periode: inv.namaBulan,
        'Tahun Ajaran': inv.tahunAjaran,
        'Tarif Pokok': inv.nominalAsli,
        'Potongan Beasiswa': inv.potongan,
        'Total Bersih': inv.totalTagihan,
        'Sudah Dibayar': inv.terbayar,
        'Sisa Tagihan': inv.sisaTagihan,
        'Status Faktual': disp.label,
        'Jatuh Tempo': inv.jatuhTempo,
      };
    });
    exportToCSV(`DAFTAR_TAGIHAN_SPP_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  const renderStatusBadge = (inv: SPPInvoice) => {
    const disp = getInvoiceDisplayStatus(inv);

    if (disp.status === 'lunas' || disp.status === 'bebas') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 className="w-3 h-3" /> Lunas
        </span>
      );
    }
    if (disp.isOverdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 text-red-700" /> Terlambat
        </span>
      );
    }
    if (disp.status === 'sebagian') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3" /> Dibayar Sebagian
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
        <AlertCircle className="w-3 h-3" /> Belum Bayar
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Tagihan SPP Bulanan</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {filteredInvoices.length} Tagihan Terdaftar
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Penetapan tarif per siswa atau per kelas, pembentukan tagihan massal, pencegahan tagihan ganda, dan pemantauan status lunas/terlambat.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Ekspor Tagihan</span>
          </button>

          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Generate Tagihan Massal</span>
          </button>
        </div>
      </div>

      {/* REKAP SELURUH TAGIHAN (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tagihan */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Tagihan Bersih
          </span>
          <span className="text-xl font-black text-stone-900 font-mono mt-1 block">
            {formatRupiah(totalBilled)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Dari {filteredInvoices.length} invoice terfilter
          </span>
        </div>

        {/* Realisasi Kas */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Pembayaran Diterima
          </span>
          <span className="text-xl font-black text-emerald-800 font-mono mt-1 block">
            {formatRupiah(totalPaid)}
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
            {totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 0}% Tingkat Realisasi
          </span>
        </div>

        {/* Sisa Piutang / Tunggakan */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Sisa Tunggakan Belum Bayar
          </span>
          <span className="text-xl font-black text-amber-800 font-mono mt-1 block">
            {formatRupiah(totalRemaining)}
          </span>
          <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
            Kewajiban yang belum diselesaikan
          </span>
        </div>

        {/* Rekap Status */}
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-1">
            Rekap Status Pembayaran
          </span>
          <div className="grid grid-cols-2 gap-1 text-[11px]">
            <span className="text-emerald-700 font-semibold">✓ Lunas: {countLunas}</span>
            <span className="text-blue-700 font-semibold">◐ Cicilan: {countSebagian}</span>
            <span className="text-amber-700 font-semibold">○ Belum: {countBelumBayar}</span>
            <span className="text-red-700 font-semibold">⚠ Terlambat: {countTerlambat}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama, NIS, tagihan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Unit / Tingkat Filter */}
        <div>
          <select
            value={filterUnit}
            onChange={(e) => {
              setFilterUnit(e.target.value as SPPUnit);
              setFilterClass('all');
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Tingkat</option>
            <option value="rait">Tingkat RAIT</option>
            <option value="sdit">Tingkat SDIT</option>
            <option value="smpit">Tingkat SMPIT</option>
          </select>
        </div>

        {/* Kelas Filter */}
        <div>
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Kelas</option>
            {getClassesForUnit(filterUnit === 'all' ? 'sdit' : filterUnit).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Periode Bulan Filter */}
        <div>
          <select
            value={filterMonth}
            onChange={(e) => {
              setFilterMonth(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value={0}>Semua Bulan</option>
            {monthsList.map((m) => (
              <option key={m.num} value={m.num}>
                Bulan {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Periode Tahun Ajaran Filter */}
        <div>
          <select
            value={filterYear}
            onChange={(e) => {
              setFilterYear(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua TA</option>
            <option value="2024/2025">TA 2024/2025</option>
            <option value="2025/2026">TA 2025/2026</option>
          </select>
        </div>

        {/* Status Pembayaran Filter: Belum Bayar, Dibayar Sebagian, Lunas, Terlambat */}
        <div>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
          >
            <option value="all">Semua Status</option>
            <option value="belum_bayar">○ Belum Bayar</option>
            <option value="sebagian">◐ Dibayar Sebagian</option>
            <option value="lunas">✓ Lunas</option>
            <option value="terlambat">⚠ Terlambat (Lewat Jatuh Tempo)</option>
          </select>
        </div>
      </div>

      {/* Invoices Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Tagihan</th>
                <th className="py-3 px-4">Nama Siswa & Kelas</th>
                <th className="py-3 px-4">Periode Bulan</th>
                <th className="py-3 px-4 text-right">Tarif Pokok</th>
                <th className="py-3 px-4 text-right">Potongan</th>
                <th className="py-3 px-4 text-right">Total Bersih</th>
                <th className="py-3 px-4 text-right">Sudah Dibayar</th>
                <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-stone-400">
                    Tidak ada tagihan yang sesuai dengan kriteria filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-700">
                      {inv.nomorTagihan}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{inv.namaSiswa}</div>
                      <div className="text-[11px] text-stone-400">
                        NIS: {inv.nis} • {inv.unit.toUpperCase()} ({inv.kelas})
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-stone-800">{inv.namaBulan}</span>
                      <span className="block text-[10px] text-stone-400 font-mono">
                        Jatuh Tempo: {inv.jatuhTempo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-stone-600">
                      {formatRupiah(inv.nominalAsli)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-700">
                      {inv.potongan > 0 ? `-${formatRupiah(inv.potongan)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(inv.totalTagihan)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                      {formatRupiah(inv.terbayar)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-amber-800">
                      {formatRupiah(inv.sisaTagihan)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {renderStatusBadge(inv)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedInvoiceDetail(inv)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="Lihat Detail Tagihan Siswa"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditInvoice(inv)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-blue-700 hover:bg-blue-50 transition"
                          title="Sesuaikan / Edit Nominal Tagihan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {inv.sisaTagihan > 0 && (
                          <button
                            onClick={() => setCurrentTab('transaksi')}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 transition"
                            title="Catat Pembayaran Kasir"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Bayar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <div>
            Menampilkan{' '}
            <strong>
              {filteredInvoices.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            sampai{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</strong> dari{' '}
            <strong>{filteredInvoices.length}</strong> tagihan
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-stone-300 rounded-lg bg-white disabled:opacity-40 hover:bg-stone-100 transition"
            >
              Sebelumnya
            </button>
            <span className="px-2 font-bold text-stone-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-stone-300 rounded-lg bg-white disabled:opacity-40 hover:bg-stone-100 transition"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: Generate Tagihan Massal (dengan penentuan nominal per siswa / per kelas) */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Pembentukan Tagihan SPP Massal</h3>
                <p className="text-emerald-200 text-xs">Otomatisasi tagihan bulanan & pencegahan duplikasi</p>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 leading-relaxed">
                <strong>Sistem Anti-Duplikasi:</strong> Siswa yang sudah memiliki tagihan pada bulan dan tahun ajaran yang dipilih otomatis dilewati. Tagihan hanya dibentuk untuk siswa berstatus <strong>Aktif</strong>.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Bulan Tagihan: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={genMonth}
                    onChange={(e) => setGenMonth(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {monthsList.map((m) => (
                      <option key={m.num} value={m.num}>
                        Bulan {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Tahun Ajaran: <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={genYear}
                    onChange={(e) => setGenYear(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2025/2026">2025/2026</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Target Tingkat / Unit:
                  </label>
                  <select
                    value={genUnit}
                    onChange={(e) => {
                      setGenUnit(e.target.value as SPPUnit);
                      setGenClass('all');
                    }}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="all">Seluruh Tingkat (Semua)</option>
                    <option value="rait">Tingkat RAIT Saja</option>
                    <option value="sdit">Tingkat SDIT Saja</option>
                    <option value="smpit">Tingkat SMPIT Saja</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Target Kelas:
                  </label>
                  <select
                    value={genClass}
                    onChange={(e) => setGenClass(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="all">Seluruh Kelas</option>
                    {getClassesForUnit(genUnit === 'all' ? 'sdit' : genUnit).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Penentuan Nominal SPP: per siswa atau per kelas */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="block font-bold text-stone-800 text-[11px] uppercase tracking-wider">
                  Penentuan Skema Nominal SPP:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tariffMode"
                      value="student_default"
                      checked={tariffMode === 'student_default'}
                      onChange={() => setTariffMode('student_default')}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <span>
                      <strong>Gunakan Tarif Masing-masing Siswa / Default Unit</strong> (Sesuai profil siswa & potongan beasiswa)
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="tariffMode"
                      value="class_custom"
                      checked={tariffMode === 'class_custom'}
                      onChange={() => setTariffMode('class_custom')}
                      className="text-emerald-700 focus:ring-emerald-500"
                    />
                    <span>
                      <strong>Tentukan Nominal Khusus Seragam untuk Kelas/Tingkat Ini</strong>
                    </span>
                  </label>
                </div>

                {tariffMode === 'class_custom' && (
                  <div className="pt-2">
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nominal Pokok Seragam (Rp):
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={customTariffNominal}
                      onChange={(e) => setCustomTariffNominal(Number(e.target.value))}
                      className="w-full p-2.5 border border-emerald-400 rounded-xl font-mono font-bold text-emerald-950 bg-white"
                    />
                    <span className="text-[10px] text-stone-400 mt-1 block">
                      Potongan beasiswa siswa yang bersangkutan tetap akan dikurangkan secara otomatis.
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleRunMassGeneration}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  Generate Tagihan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Detail Tagihan per Siswa */}
      {selectedInvoiceDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
              <div>
                <h3 className="font-bold text-sm">Rincian Detail Tagihan Siswa</h3>
                <p className="text-emerald-200 text-xs font-mono">{selectedInvoiceDetail.nomorTagihan}</p>
              </div>
              <button
                onClick={() => setSelectedInvoiceDetail(null)}
                className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700">
              {/* Student info box */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Siswa:</span>
                  <span className="font-bold text-stone-900">{selectedInvoiceDetail.namaSiswa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Nomor Induk (NIS):</span>
                  <span className="font-mono font-bold text-stone-800">{selectedInvoiceDetail.nis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tingkat & Kelas:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedInvoiceDetail.unit.toUpperCase()} - {selectedInvoiceDetail.kelas}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Periode Tagihan:</span>
                  <span className="font-bold text-emerald-800">{selectedInvoiceDetail.namaBulan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tanggal Jatuh Tempo:</span>
                  <span className="font-mono font-semibold text-stone-800">{selectedInvoiceDetail.jatuhTempo}</span>
                </div>
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="space-y-2 border border-stone-200 rounded-xl p-4 bg-stone-50/50">
                <div className="flex justify-between text-stone-600">
                  <span>Tarif SPP Pokok:</span>
                  <span className="font-mono font-semibold">{formatRupiah(selectedInvoiceDetail.nominalAsli)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>Potongan Beasiswa / Keringanan:</span>
                  <span className="font-mono font-semibold">
                    {selectedInvoiceDetail.potongan > 0 ? `-${formatRupiah(selectedInvoiceDetail.potongan)}` : 'Rp 0'}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-2 text-sm">
                  <span>Total Tagihan Bersih:</span>
                  <span className="font-mono font-black">{formatRupiah(selectedInvoiceDetail.totalTagihan)}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-bold">
                  <span>Pembayaran yang Sudah Diterima:</span>
                  <span className="font-mono font-extrabold">{formatRupiah(selectedInvoiceDetail.terbayar)}</span>
                </div>
                <div className="flex justify-between text-amber-900 font-black border-t border-dashed border-stone-300 pt-2 text-sm">
                  <span>Sisa Tagihan Tertunggak:</span>
                  <span className="font-mono">{formatRupiah(selectedInvoiceDetail.sisaTagihan)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100">
                <span className="text-stone-600 font-semibold">Status Tagihan Saat Ini:</span>
                <div>{renderStatusBadge(selectedInvoiceDetail)}</div>
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceDetail(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Tutup
                </button>
                {selectedInvoiceDetail.sisaTagihan > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedInvoiceDetail(null);
                      setCurrentTab('transaksi');
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Lanjutkan Pembayaran Kasir</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Sesuaikan Nominal Tagihan Khusus */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Sesuaikan Nominal Tagihan</h3>
                <p className="text-emerald-200 text-xs">{editingInvoice.namaSiswa} ({editingInvoice.namaBulan})</p>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditInvoice} className="p-6 space-y-4 text-xs text-stone-700">
              <div>
                <label className="block font-semibold mb-1">Nominal Pokok Tagihan (Rp):</label>
                <input
                  type="number"
                  step={5000}
                  required
                  value={editNominalForm.nominalAsli}
                  onChange={(e) =>
                    setEditNominalForm({ ...editNominalForm, nominalAsli: Number(e.target.value) })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Potongan / Keringanan Khusus (Rp):</label>
                <input
                  type="number"
                  step={5000}
                  value={editNominalForm.potongan}
                  onChange={(e) =>
                    setEditNominalForm({ ...editNominalForm, potongan: Number(e.target.value) })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-amber-800 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tanggal Jatuh Tempo:</label>
                <input
                  type="date"
                  required
                  value={editNominalForm.jatuhTempo}
                  onChange={(e) =>
                    setEditNominalForm({ ...editNominalForm, jatuhTempo: e.target.value })
                  }
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-bold">
                <span>Total Tagihan Akhir:</span>
                <span className="font-mono text-emerald-900 text-sm">
                  {formatRupiah(Math.max(0, editNominalForm.nominalAsli - editNominalForm.potongan))}
                </span>
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
