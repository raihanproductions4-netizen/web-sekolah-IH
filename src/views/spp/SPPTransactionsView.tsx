/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useSPP } from '../../context/SPPContext';
import { Student, SPPInvoice, PaymentMethod, SPPTransaction, SPPUnit } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, exportToCSV, terbilangRupiah } from '../../utils/sppHelpers';
import { CorrectionModal } from '../../components/spp/CorrectionModal';
import { TransactionDetailModal } from '../../components/spp/TransactionDetailModal';
import {
  Search,
  CreditCard,
  Printer,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  User,
  Calendar,
  Building,
  CheckSquare,
  Square,
  Download,
  Filter,
  Eye,
  Info,
  RotateCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

export const SPPTransactionsView: React.FC = () => {
  const {
    students,
    invoices,
    transactions,
    recordPayment,
    currentUser,
    setActiveReceipt,
    selectedUnitFilter,
  } = useSPP();

  // Search & Student Selection
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Payment Form State
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [customNominals, setCustomNominals] = useState<Record<string, number>>({});
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>(
    'Tunai di Kasir'
  );
  const [nomorReferensi, setNomorReferensi] = useState('');
  const [tanggalBayar, setTanggalBayar] = useState(
    new Date().toISOString().slice(0, 16) // yyyy-MM-ddThh:mm
  );
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Modals
  const [selectedTrxForCancel, setSelectedTrxForCancel] = useState<SPPTransaction | null>(null);
  const [selectedTrxForDetail, setSelectedTrxForDetail] = useState<SPPTransaction | null>(null);

  // History Filter State
  const [historySearch, setHistorySearch] = useState('');
  const [historyUnitFilter, setHistoryUnitFilter] = useState<SPPUnit>(selectedUnitFilter);
  const [historyKelasFilter, setHistoryKelasFilter] = useState('all');
  const [historyMetodeFilter, setHistoryMetodeFilter] = useState('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'all' | 'sukses' | 'dibatalkan'>('all');
  const [historyBulanFilter, setHistoryBulanFilter] = useState<string>('all');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');

  // Filter students for search dropdown
  const filteredStudentSuggestions = studentSearch.trim()
    ? students
        .filter((s) => {
          if (s.status !== 'aktif') return false;
          if (selectedUnitFilter !== 'all' && s.unit !== selectedUnitFilter) return false;
          const q = studentSearch.toLowerCase();
          return s.namaLengkap.toLowerCase().includes(q) || s.nis.toLowerCase().includes(q);
        })
        .slice(0, 6)
    : [];

  // Outstanding unpaid invoices for the selected student
  const studentUnpaidInvoices = useMemo(() => {
    if (!selectedStudent) return [];
    return invoices
      .filter((inv) => inv.siswaId === selectedStudent.id && inv.sisaTagihan > 0)
      .sort((a, b) => a.bulan - b.bulan);
  }, [invoices, selectedStudent]);

  // Total payment calculated based on checked invoices
  const totalBayarCalculated = useMemo(() => {
    return selectedInvoiceIds.reduce((sum, invId) => {
      const inv = studentUnpaidInvoices.find((i) => i.id === invId);
      if (!inv) return sum;
      const custom = customNominals[invId];
      return sum + (custom !== undefined ? custom : inv.sisaTagihan);
    }, 0);
  }, [selectedInvoiceIds, customNominals, studentUnpaidInvoices]);

  const handleSelectStudent = (s: Student) => {
    setSelectedStudent(s);
    setStudentSearch(`${s.namaLengkap} (${s.nis})`);
    setValidationError(null);

    // Pre-select the first unpaid invoice by default
    const unpaids = invoices.filter((i) => i.siswaId === s.id && i.sisaTagihan > 0);
    if (unpaids.length > 0) {
      setSelectedInvoiceIds([unpaids[0].id]);
      setCustomNominals({ [unpaids[0].id]: unpaids[0].sisaTagihan });
    } else {
      setSelectedInvoiceIds([]);
      setCustomNominals({});
    }
  };

  const handleToggleInvoice = (inv: SPPInvoice) => {
    setValidationError(null);
    if (selectedInvoiceIds.includes(inv.id)) {
      setSelectedInvoiceIds((prev) => prev.filter((id) => id !== inv.id));
      const copy = { ...customNominals };
      delete copy[inv.id];
      setCustomNominals(copy);
    } else {
      setSelectedInvoiceIds((prev) => [...prev, inv.id]);
      setCustomNominals((prev) => ({ ...prev, [inv.id]: inv.sisaTagihan }));
    }
  };

  const handleNominalChange = (invId: string, val: number, maxVal: number) => {
    setValidationError(null);
    if (isNaN(val) || val < 0) {
      setCustomNominals((prev) => ({ ...prev, [invId]: 0 }));
      return;
    }
    if (val > maxVal) {
      setValidationError(`Nominal pembayaran melebihi sisa kewajiban (${formatRupiah(maxVal)}). Angka disesuaikan otomatis.`);
      setCustomNominals((prev) => ({ ...prev, [invId]: maxVal }));
      return;
    }
    setCustomNominals((prev) => ({ ...prev, [invId]: val }));
  };

  const handleSelectAllInvoices = () => {
    setValidationError(null);
    if (selectedInvoiceIds.length === studentUnpaidInvoices.length) {
      setSelectedInvoiceIds([]);
      setCustomNominals({});
    } else {
      const allIds = studentUnpaidInvoices.map((i) => i.id);
      setSelectedInvoiceIds(allIds);
      const nominalMap: Record<string, number> = {};
      studentUnpaidInvoices.forEach((i) => (nominalMap[i.id] = i.sisaTagihan));
      setCustomNominals(nominalMap);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedStudent) {
      setValidationError('Silakan pilih data siswa terlebih dahulu.');
      return;
    }

    if (selectedInvoiceIds.length === 0) {
      setValidationError('Pilih minimal satu periode tagihan bulan yang akan dibayar.');
      return;
    }

    if (totalBayarCalculated <= 0) {
      setValidationError('Nominal pembayaran harus lebih besar dari Rp 0.');
      return;
    }

    // Verify each selected invoice has a positive payment
    for (const id of selectedInvoiceIds) {
      const inv = studentUnpaidInvoices.find((i) => i.id === id);
      const nominal = customNominals[id] !== undefined ? customNominals[id] : inv?.sisaTagihan || 0;
      if (nominal <= 0) {
        setValidationError(`Nominal pembayaran untuk ${inv?.namaBulan || 'tagihan'} tidak boleh Rp 0.`);
        return;
      }
      if (inv && nominal > inv.sisaTagihan) {
        setValidationError(`Nominal pembayaran untuk ${inv.namaBulan} melebihi sisa tagihan (${formatRupiah(inv.sisaTagihan)}).`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const tagihanSelected = selectedInvoiceIds.map((id) => {
        const inv = studentUnpaidInvoices.find((i) => i.id === id);
        const nominal = customNominals[id] !== undefined ? customNominals[id] : inv?.sisaTagihan || 0;
        return {
          tagihanId: id,
          bayarNominal: nominal,
        };
      });

      const newTrx = recordPayment({
        siswaId: selectedStudent.id,
        tagihanSelected,
        totalBayar: totalBayarCalculated,
        metodePembayaran,
        nomorReferensi: nomorReferensi.trim() || undefined,
        catatan: catatan.trim() || undefined,
        tanggalBayar: new Date(tanggalBayar).toISOString(),
      });

      // Reset form on success
      setSelectedStudent(null);
      setStudentSearch('');
      setSelectedInvoiceIds([]);
      setCustomNominals({});
      setNomorReferensi('');
      setCatatan('');
    } catch (err: any) {
      setValidationError(err.message || 'Gagal menyimpan transaksi pembayaran.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Distinct classes for history filter
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.kelas));
    return Array.from(set).sort();
  }, [students]);

  // Transaction history filtering
  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      // Unit filter
      if (historyUnitFilter !== 'all' && trx.unit !== historyUnitFilter) return false;

      // Kelas filter
      if (historyKelasFilter !== 'all' && trx.kelas !== historyKelasFilter) return false;

      // Status filter
      if (historyStatusFilter !== 'all' && trx.status !== historyStatusFilter) return false;

      // Payment method filter
      if (historyMetodeFilter !== 'all' && trx.metodePembayaran !== historyMetodeFilter) return false;

      // Month filter
      if (historyBulanFilter !== 'all') {
        const matchesMonth = trx.alokasi.some((a) => a.namaBulan.toLowerCase().includes(historyBulanFilter.toLowerCase()));
        if (!matchesMonth) return false;
      }

      // Date range filter
      if (historyDateFrom) {
        const trxDate = trx.tanggalBayar.slice(0, 10);
        if (trxDate < historyDateFrom) return false;
      }
      if (historyDateTo) {
        const trxDate = trx.tanggalBayar.slice(0, 10);
        if (trxDate > historyDateTo) return false;
      }

      // Search query (Transaction number, receipt number, student name, NIS, notes, cashier)
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const matchName = trx.namaSiswa.toLowerCase().includes(q);
        const matchNIS = trx.nis.toLowerCase().includes(q);
        const matchKwitansi = trx.nomorKuitansi.toLowerCase().includes(q);
        const matchTrx = trx.nomorTransaksi.toLowerCase().includes(q);
        const matchNotes = trx.catatan ? trx.catatan.toLowerCase().includes(q) : false;
        const matchPetugas = trx.petugas.toLowerCase().includes(q);
        if (!matchName && !matchNIS && !matchKwitansi && !matchTrx && !matchNotes && !matchPetugas) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    historyUnitFilter,
    historyKelasFilter,
    historyStatusFilter,
    historyMetodeFilter,
    historyBulanFilter,
    historyDateFrom,
    historyDateTo,
    historySearch,
  ]);

  // Statistics for filtered history
  const historyStats = useMemo(() => {
    const successTrx = filteredTransactions.filter((t) => t.status === 'sukses');
    const cancelledTrx = filteredTransactions.filter((t) => t.status === 'dibatalkan');
    const totalPenerimaan = successTrx.reduce((sum, t) => sum + t.totalBayar, 0);

    return {
      totalCount: filteredTransactions.length,
      successCount: successTrx.length,
      cancelledCount: cancelledTrx.length,
      totalPenerimaan,
    };
  }, [filteredTransactions]);

  const handleExportTransactionsCSV = () => {
    const rows = filteredTransactions.map((t) => ({
      'No Transaksi': t.nomorTransaksi,
      'No Kuitansi': t.nomorKuitansi,
      NIS: t.nis,
      'Nama Siswa': t.namaSiswa,
      Unit: t.unit.toUpperCase(),
      Kelas: t.kelas,
      'Tanggal Bayar': formatTanggalIndo(t.tanggalBayar, true),
      'Periode Dibayar': t.alokasi.map((a) => a.namaBulan).join('; '),
      'Total Bayar (Rp)': t.totalBayar,
      'Metode Pembayaran': t.metodePembayaran,
      'No Referensi': t.nomorReferensi || '-',
      'Kasir Penerima': t.petugas,
      Status: t.status === 'dibatalkan' ? 'Dibatalkan' : 'Sukses',
      'Alasan Pembatalan': t.pembatalan?.alasan || '-',
      Catatan: t.catatan || '',
    }));
    exportToCSV(`RIWAYAT_TRANSAKSI_SPP_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  const handleResetFilters = () => {
    setHistorySearch('');
    setHistoryUnitFilter(selectedUnitFilter);
    setHistoryKelasFilter('all');
    setHistoryMetodeFilter('all');
    setHistoryStatusFilter('all');
    setHistoryBulanFilter('all');
    setHistoryDateFrom('');
    setHistoryDateTo('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Pencatatan Pembayaran SPP (Kasir Loket)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              Bendahara Sekolah
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pencarian siswa, pemilihan tagihan belum lunas, perhitungan sisa otomatis, dukungan cicilan sebagian, pencetakan kuitansi resmi, dan audit pembatalan transaksi.
          </p>
        </div>

        <button
          onClick={handleExportTransactionsCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Ekspor Riwayat CSV</span>
        </button>
      </div>

      {/* Main Cashier Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Step 1 & 2 */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Cari Siswa */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                1
              </span>
              Cari & Pilih Siswa Berdasarkan Nama atau NIS
            </h3>

            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ketik nama lengkap atau NIS siswa..."
                value={studentSearch}
                onChange={(e) => {
                  setStudentSearch(e.target.value);
                  if (selectedStudent && e.target.value !== selectedStudent.namaLengkap) {
                    setSelectedStudent(null);
                  }
                }}
                className="w-full pl-9 pr-3 py-2.5 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-stone-50/50 hover:bg-white transition"
              />

              {/* Autocomplete Dropdown Suggestions */}
              {!selectedStudent && filteredStudentSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-20 overflow-hidden divide-y divide-stone-100">
                  {filteredStudentSuggestions.map((stu) => (
                    <div
                      key={stu.id}
                      onClick={() => handleSelectStudent(stu)}
                      className="p-3 hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-xs transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {stu.namaLengkap.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{stu.namaLengkap}</div>
                          <div className="text-[11px] text-stone-500">
                            NIS: {stu.nis} • {stu.unit.toUpperCase()} {stu.kelas} • Wali: {stu.namaOrangTua}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        Pilih Siswa
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Student Information Card */}
            {selectedStudent && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-base shadow-xs">
                    {selectedStudent.namaLengkap.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span>{selectedStudent.namaLengkap}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-900 uppercase">
                        {selectedStudent.unit.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-0.5">
                      NIS: <strong className="text-stone-800">{selectedStudent.nis}</strong> • Kelas: <strong>{selectedStudent.kelas}</strong> • Wali: <strong>{selectedStudent.namaOrangTua}</strong> ({selectedStudent.noWhatsapp})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setStudentSearch('');
                    setSelectedInvoiceIds([]);
                    setCustomNominals({});
                    setValidationError(null);
                  }}
                  className="text-stone-500 hover:text-stone-800 text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-emerald-100 transition"
                >
                  Ganti Siswa
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Pilih Bulan Tagihan & Masukkan Nominal */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                Pilih Periode Tagihan SPP yang Ingin Dibayar
              </h3>
              {studentUnpaidInvoices.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllInvoices}
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline"
                >
                  {selectedInvoiceIds.length === studentUnpaidInvoices.length
                    ? 'Batal Pilih Semua'
                    : 'Pilih Semua Bulan'}
                </button>
              )}
            </div>

            {!selectedStudent ? (
              <div className="py-12 text-center text-stone-400 text-xs border border-dashed border-stone-200 rounded-xl bg-stone-50/50 space-y-1">
                <Search className="w-6 h-6 text-stone-300 mx-auto" />
                <div className="font-semibold text-stone-600">Pencarian Siswa</div>
                <p>Silakan cari nama atau NIS siswa di atas untuk melihat daftar tagihan yang belum lunas.</p>
              </div>
            ) : studentUnpaidInvoices.length === 0 ? (
              <div className="py-10 text-center text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
                <div className="font-bold text-sm text-emerald-900">Alhamdulillah, Seluruh Tagihan Telah Lunas!</div>
                <p className="text-[11px] text-emerald-700 max-w-sm mx-auto">
                  Siswa ini tidak memiliki tagihan tertunggak pada sistem saat ini. Tagihan baru dapat diterbitkan melalui menu Tagihan Bulanan.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-stone-500">
                  Centang bulan tagihan yang ingin dibayarkan. Anda dapat memasukkan nominal pembayaran sebagian (cicilan) atau membayar lunas.
                </p>

                {studentUnpaidInvoices.map((inv) => {
                  const isChecked = selectedInvoiceIds.includes(inv.id);
                  const currentCustomVal =
                    customNominals[inv.id] !== undefined
                      ? customNominals[inv.id]
                      : inv.sisaTagihan;
                  const sisaSetelahBayar = Math.max(0, inv.sisaTagihan - currentCustomVal);
                  const willBeLunas = sisaSetelahBayar === 0;

                  return (
                    <div
                      key={inv.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-500/30'
                          : 'border-stone-200 bg-stone-50/30 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          onClick={() => handleToggleInvoice(inv)}
                          className="flex items-start gap-3 cursor-pointer flex-1 select-none"
                        >
                          <div className="mt-0.5 text-emerald-700">
                            {isChecked ? (
                              <CheckSquare className="w-5 h-5 fill-emerald-800 text-white" />
                            ) : (
                              <Square className="w-5 h-5 text-stone-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 text-xs">
                                SPP Bulan {inv.namaBulan}
                              </span>
                              {inv.status === 'sebagian' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                  Sudah Dicicil Sebagian
                                </span>
                              )}
                              {inv.status === 'terlambat' && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                                  Terlambat
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              No. Tagihan: <span className="font-mono">{inv.nomorTagihan}</span> • Total Tarif: {formatRupiah(inv.totalTagihan)}
                            </div>
                            {inv.terbayar > 0 && (
                              <div className="text-[10px] text-emerald-700 font-medium">
                                Sudah terbayar sebelumnya: {formatRupiah(inv.terbayar)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Current Outstanding Balance */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-stone-400 block">Sisa Tagihan Saat Ini:</span>
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {formatRupiah(inv.sisaTagihan)}
                          </span>
                        </div>
                      </div>

                      {/* Partial / Full Payment Input Row when Checked */}
                      {isChecked && (
                        <div className="mt-3 pt-3 border-t border-emerald-200/70 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-stone-700">
                              <span className="font-medium text-[11px]">Nominal Dibayar Sekarang:</span>
                              <button
                                type="button"
                                onClick={() => handleNominalChange(inv.id, inv.sisaTagihan, inv.sisaTagihan)}
                                className="text-[10px] text-emerald-800 font-bold bg-emerald-100 hover:bg-emerald-200 px-1.5 py-0.5 rounded transition"
                              >
                                Bayar Lunas
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-stone-400 font-mono text-xs">Rp</span>
                              <input
                                type="number"
                                min={1000}
                                max={inv.sisaTagihan}
                                step={5000}
                                value={currentCustomVal}
                                onChange={(e) =>
                                  handleNominalChange(inv.id, Number(e.target.value), inv.sisaTagihan)
                                }
                                className="w-36 py-1.5 px-2.5 border border-emerald-500 rounded-lg text-right font-mono font-bold text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                              />
                            </div>
                          </div>

                          {/* Live Remaining Balance Calculation Preview */}
                          <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5">
                              <span className="text-stone-600">Sisa Tagihan Pasca Pembayaran:</span>
                              <strong className={`font-mono ${willBeLunas ? 'text-emerald-800' : 'text-amber-800'}`}>
                                {formatRupiah(sisaSetelahBayar)}
                              </strong>
                            </div>
                            <div>
                              {willBeLunas ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-200 text-emerald-900">
                                  <Check className="w-3 h-3" /> Status Menjadi LUNAS
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-bold text-[10px] bg-amber-200 text-amber-900">
                                  <Clock className="w-3 h-3" /> Status DIBAYAR SEBAGIAN
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Step 3 - Payment Details, Summary & Submit */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmitPayment}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs sticky top-20"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 pb-2 border-b border-stone-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              Konfirmasi & Rincian Pembayaran
            </h3>

            {/* Total Payment Highlight Card */}
            <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white p-4 rounded-xl shadow-sm border border-emerald-700 space-y-2">
              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-bold block">
                Total Diterima di Kasir:
              </span>
              <div className="text-2xl font-black font-mono tracking-tight text-white">
                {formatRupiah(totalBayarCalculated)}
              </div>
              <div className="text-[11px] text-emerald-200 flex items-center justify-between pt-1 border-t border-emerald-800">
                <span>{selectedInvoiceIds.length} Periode Bulan Dipilih</span>
                {totalBayarCalculated > 0 && (
                  <span className="text-[10px] text-amber-200 italic line-clamp-1 max-w-[200px]" title={terbilangRupiah(totalBayarCalculated)}>
                    "{terbilangRupiah(totalBayarCalculated)}"
                  </span>
                )}
              </div>
            </div>

            {/* Validation Alert */}
            {validationError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Metode Pembayaran: <span className="text-red-500">*</span>
              </label>
              <select
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value as PaymentMethod)}
                className="w-full p-2.5 border border-stone-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-xs"
              >
                <option value="Tunai di Kasir">💵 Tunai di Kasir / Loket Administrasi</option>
                <option value="Transfer Bank Syariah Indonesia (BSI)">
                  🏦 Transfer Bank Syariah Indonesia (BSI)
                </option>
                <option value="Transfer Bank Riau Kepri Syariah">
                  🏦 Transfer Bank Riau Kepri Syariah
                </option>
                <option value="Transfer Bank Mandiri">🏦 Transfer Bank Mandiri</option>
                <option value="QRIS Yayasan Harapan Ibu">📱 QRIS Yayasan Harapan Ibu Kepri</option>
              </select>
            </div>

            {/* Reference Number */}
            {metodePembayaran !== 'Tunai di Kasir' && (
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Nomor Referensi Transaksi Bank / QRIS:
                </label>
                <input
                  type="text"
                  value={nomorReferensi}
                  onChange={(e) => setNomorReferensi(e.target.value)}
                  placeholder="Contoh: BSI-10928374 / Ref QRIS..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            {/* Payment Date & Time */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Tanggal & Jam Pembayaran: <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={tanggalBayar}
                onChange={(e) => setTanggalBayar(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Cashier Staff (Read-only) */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Petugas Kasir Penerima (Bendahara):
              </label>
              <input
                type="text"
                disabled
                value={`${currentUser.nama} (${currentUser.roleName})`}
                className="w-full p-2.5 border border-stone-200 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium cursor-not-allowed"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Catatan Transaksi:
              </label>
              <input
                type="text"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Contoh: Dibayar oleh Ibunda / cicilan tahap 1..."
                className="w-full p-2.5 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                !selectedStudent ||
                selectedInvoiceIds.length === 0 ||
                totalBayarCalculated <= 0
              }
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Simpan Pembayaran & Terbitkan Kuitansi</span>
            </button>

            <div className="text-[10px] text-stone-400 text-center leading-relaxed">
              Transaksi otomatis dicatat permanen di riwayat pembayaran, saldo tagihan langsung diperbarui, dan kuitansi resmi siap dicetak.
            </div>
          </form>
        </div>
      </div>

      {/* History Transactions Section with Comprehensive Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Section Title & Statistics Bar */}
        <div className="p-5 border-b border-stone-200 bg-stone-50/70">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Riwayat Pembayaran & Transaksi SPP</h3>
              <p className="text-xs text-stone-500">
                Pencarian transaksi, filter periode, siswa, kelas, metode pembayaran, cetak kuitansi, dan pembatalan resmi.
              </p>
            </div>

            {/* Recap Counters */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="px-3 py-1.5 bg-emerald-100/70 border border-emerald-300 rounded-xl">
                <span className="text-[10px] text-emerald-800 font-bold block">Penerimaan Sah:</span>
                <strong className="font-mono text-emerald-950 font-extrabold">
                  {formatRupiah(historyStats.totalPenerimaan)}
                </strong>
              </div>
              <div className="px-3 py-1.5 bg-white border border-stone-200 rounded-xl">
                <span className="text-[10px] text-stone-500 block">Total Sukses:</span>
                <strong className="font-bold text-stone-800">{historyStats.successCount} Trx</strong>
              </div>
              {historyStats.cancelledCount > 0 && (
                <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] text-rose-600 block">Dibatalkan:</span>
                  <strong className="font-bold text-rose-800">{historyStats.cancelledCount} Trx</strong>
                </div>
              )}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 text-xs">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari No. Trx, Kuitansi, Nama, NIS..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>

            {/* Unit / Tingkat Filter */}
            <div>
              <select
                value={historyUnitFilter}
                onChange={(e) => setHistoryUnitFilter(e.target.value as SPPUnit)}
                className="w-full p-1.5 border border-stone-300 rounded-xl text-xs bg-white font-medium focus:outline-none"
              >
                <option value="all">Semua Unit (RAIT/SD/SMP)</option>
                <option value="rait">RAIT Insan Harapan</option>
                <option value="sdit">SDIT Insan Harapan</option>
                <option value="smpit">SMPIT Insan Harapan</option>
              </select>
            </div>

            {/* Kelas Filter */}
            <div>
              <select
                value={historyKelasFilter}
                onChange={(e) => setHistoryKelasFilter(e.target.value)}
                className="w-full p-1.5 border border-stone-300 rounded-xl text-xs bg-white font-medium focus:outline-none"
              >
                <option value="all">Semua Kelas</option>
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Metode Pembayaran Filter */}
            <div>
              <select
                value={historyMetodeFilter}
                onChange={(e) => setHistoryMetodeFilter(e.target.value)}
                className="w-full p-1.5 border border-stone-300 rounded-xl text-xs bg-white font-medium focus:outline-none"
              >
                <option value="all">Semua Metode Bayar</option>
                <option value="Tunai di Kasir">💵 Tunai Kasir</option>
                <option value="Transfer Bank Syariah Indonesia (BSI)">🏦 Bank BSI</option>
                <option value="Transfer Bank Riau Kepri Syariah">🏦 Bank Riau Kepri</option>
                <option value="Transfer Bank Mandiri">🏦 Bank Mandiri</option>
                <option value="QRIS Yayasan Harapan Ibu">📱 QRIS Yayasan</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={historyStatusFilter}
                onChange={(e) => setHistoryStatusFilter(e.target.value as any)}
                className="w-full p-1.5 border border-stone-300 rounded-xl text-xs bg-white font-medium focus:outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="sukses">Sukses / Sah</option>
                <option value="dibatalkan">Dibatalkan</option>
              </select>
            </div>

            {/* Date Range & Clear Filters */}
            <div className="lg:col-span-6 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
              <div className="flex items-center gap-2 text-stone-600 text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Rentang Tanggal Bayar:</span>
                <input
                  type="date"
                  value={historyDateFrom}
                  onChange={(e) => setHistoryDateFrom(e.target.value)}
                  className="px-2 py-1 border border-stone-300 rounded-lg text-xs bg-white"
                />
                <span>s.d.</span>
                <input
                  type="date"
                  value={historyDateTo}
                  onChange={(e) => setHistoryDateTo(e.target.value)}
                  className="px-2 py-1 border border-stone-300 rounded-lg text-xs bg-white"
                />
              </div>

              {(historySearch || historyKelasFilter !== 'all' || historyMetodeFilter !== 'all' || historyStatusFilter !== 'all' || historyDateFrom || historyDateTo || historyUnitFilter !== 'all') && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:underline"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Transaksi & Kuitansi</th>
                <th className="py-3 px-4">Siswa / Santri</th>
                <th className="py-3 px-4">Periode SPP</th>
                <th className="py-3 px-4 text-right">Nominal Bayar</th>
                <th className="py-3 px-4">Metode & Ref</th>
                <th className="py-3 px-4">Waktu & Kasir</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <CreditCard className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="font-semibold text-stone-600">Tidak ada transaksi yang cocok dengan filter.</p>
                    <p className="text-[11px] text-stone-400">Coba ubah kata kunci pencarian atau reset filter.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => {
                  const isCancelled = trx.status === 'dibatalkan';

                  return (
                    <tr
                      key={trx.id}
                      className={`hover:bg-stone-50/80 transition ${
                        isCancelled ? 'bg-rose-50/30 text-stone-400' : ''
                      }`}
                    >
                      {/* Nomor Transaksi & Kuitansi */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900 text-xs">
                          {trx.nomorKuitansi}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {trx.nomorTransaksi}
                        </div>
                      </td>

                      {/* Siswa */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{trx.namaSiswa}</div>
                        <div className="text-[11px] text-stone-500">
                          NIS: {trx.nis} • <strong className="text-emerald-800">{trx.unit.toUpperCase()}</strong> ({trx.kelas})
                        </div>
                      </td>

                      {/* Periode SPP */}
                      <td className="py-3 px-4">
                        <div className="text-stone-800 font-medium line-clamp-2">
                          {trx.alokasi.map((a) => a.namaBulan).join(', ')}
                        </div>
                        <span className="text-[10px] text-stone-400">
                          {trx.alokasi.length} Bulan
                        </span>
                      </td>

                      {/* Nominal */}
                      <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-950">
                        <span className={isCancelled ? 'line-through text-rose-700' : ''}>
                          {formatRupiah(trx.totalBayar)}
                        </span>
                      </td>

                      {/* Metode Pembayaran */}
                      <td className="py-3 px-4">
                        <div className="text-stone-800 font-semibold">{trx.metodePembayaran}</div>
                        {trx.nomorReferensi ? (
                          <div className="text-[10px] text-stone-500 font-mono">
                            Ref: {trx.nomorReferensi}
                          </div>
                        ) : (
                          <div className="text-[10px] text-stone-400 italic">Tanpa Ref</div>
                        )}
                      </td>

                      {/* Waktu & Petugas */}
                      <td className="py-3 px-4">
                        <div className="text-stone-800 font-medium">
                          {formatTanggalIndo(trx.tanggalBayar, true)}
                        </div>
                        <div className="text-[10px] text-stone-400">Kasir: {trx.petugas}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        {isCancelled ? (
                          <span
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300"
                            title={trx.pembatalan?.alasan}
                          >
                            Dibatalkan
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Sukses / Sah
                          </span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedTrxForDetail(trx)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] border border-stone-200 transition"
                            title="Lihat Detail Transaksi"
                          >
                            <Eye className="w-3 h-3 text-stone-500" />
                            <span>Detail</span>
                          </button>

                          {/* Print Receipt Button */}
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => setActiveReceipt(trx)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-[11px] shadow-2xs transition"
                              title="Cetak Kuitansi Resmi"
                            >
                              <Printer className="w-3 h-3 text-amber-300" />
                              <span>Kuitansi</span>
                            </button>
                          )}

                          {/* Cancel / Revert Button */}
                          {!isCancelled && currentUser.role !== 'operator' && (
                            <button
                              type="button"
                              onClick={() => setSelectedTrxForCancel(trx)}
                              className="p-1 rounded-lg text-stone-400 hover:text-rose-700 hover:bg-rose-50 transition"
                              title="Koreksi / Batalkan Transaksi"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTrxForDetail && (
        <TransactionDetailModal
          transaction={selectedTrxForDetail}
          onClose={() => setSelectedTrxForDetail(null)}
          onPrintReceipt={(trx) => setActiveReceipt(trx)}
          onCancelTransaction={(trx) => setSelectedTrxForCancel(trx)}
        />
      )}

      {/* Correction / Cancellation Modal */}
      {selectedTrxForCancel && (
        <CorrectionModal
          transaction={selectedTrxForCancel}
          onClose={() => setSelectedTrxForCancel(null)}
        />
      )}
    </div>
  );
};
