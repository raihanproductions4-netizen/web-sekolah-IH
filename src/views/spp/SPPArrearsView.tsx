/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { Student, SPPInvoice, SPPUnit } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, exportToCSV } from '../../utils/sppHelpers';
import { WhatsAppReminderModal } from '../../components/spp/WhatsAppReminderModal';
import {
  AlertTriangle,
  Search,
  Filter,
  MessageSquare,
  Phone,
  Eye,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const SPPArrearsView: React.FC = () => {
  const {
    students,
    invoices,
    transactions,
    followUps,
    updateFollowUp,
    selectedUnitFilter,
    setSelectedStudentForDetail,
    setCurrentTab,
  } = useSPP();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState<SPPUnit>(selectedUnitFilter);
  const [filterDuration, setFilterDuration] = useState<string>('all'); // 'all' | '1' | '2-3' | '>3'
  const [filterClass, setFilterClass] = useState<string>('all');

  // WhatsApp Modal
  const [waTargetStudent, setWaTargetStudent] = useState<Student | null>(null);
  const [waTargetInvoices, setWaTargetInvoices] = useState<SPPInvoice[]>([]);

  React.useEffect(() => {
    if (selectedUnitFilter !== 'all') {
      setFilterUnit(selectedUnitFilter);
    }
  }, [selectedUnitFilter]);

  // Group unpaid invoices by student
  const activeStudents = students.filter((s) => s.status === 'aktif');

  interface ArrearsSummary {
    student: Student;
    unpaidInvoices: SPPInvoice[];
    monthsCount: number;
    periodeString: string;
    totalTunggakan: number;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
    followUp?: {
      status: string;
      tanggal: string;
      catatan?: string;
    };
  }

  const arrearsList: ArrearsSummary[] = [];
  activeStudents.forEach((stu) => {
    const unpaids = invoices.filter(
      (inv) => inv.siswaId === stu.id && inv.sisaTagihan > 0
    );
    if (unpaids.length === 0) return;

    const studentTrx = transactions.filter(
      (t) => t.siswaId === stu.id && t.status === 'sukses'
    );
    const lastTrx = studentTrx.length > 0 ? studentTrx[0] : undefined;
    const fu = followUps.find((f) => f.siswaId === stu.id);
    const totalTunggakan = unpaids.reduce((acc, i) => acc + i.sisaTagihan, 0);
    const periodeString = unpaids.map((i) => i.namaBulan).join(', ');

    arrearsList.push({
      student: stu,
      unpaidInvoices: unpaids,
      monthsCount: unpaids.length,
      periodeString,
      totalTunggakan,
      lastPaymentDate: lastTrx?.tanggalBayar,
      lastPaymentAmount: lastTrx?.totalBayar,
      followUp: fu,
    });
  });

  // Apply filters
  const filteredArrears = arrearsList.filter((item) => {
    if (filterUnit !== 'all' && item.student.unit !== filterUnit) return false;
    if (filterClass !== 'all' && item.student.kelas !== filterClass) return false;

    if (filterDuration === '1' && item.monthsCount !== 1) return false;
    if (filterDuration === '2-3' && (item.monthsCount < 2 || item.monthsCount > 3)) return false;
    if (filterDuration === '>3' && item.monthsCount <= 3) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.student.namaLengkap.toLowerCase().includes(q);
      const matchNIS = item.student.nis.toLowerCase().includes(q);
      const matchParent = item.student.namaOrangTua.toLowerCase().includes(q);
      if (!matchName && !matchNIS && !matchParent) return false;
    }

    return true;
  });

  const totalNominalTunggakan = filteredArrears.reduce((a, b) => a + b.totalTunggakan, 0);

  const handleOpenWA = (item: ArrearsSummary) => {
    setWaTargetStudent(item.student);
    setWaTargetInvoices(item.unpaidInvoices);
  };

  const handleExportCSV = () => {
    const rows = filteredArrears.map((a) => ({
      NIS: a.student.nis,
      'Nama Siswa': a.student.namaLengkap,
      Unit: a.student.unit.toUpperCase(),
      Kelas: a.student.kelas,
      'Nama Orang Tua': a.student.namaOrangTua,
      'No WhatsApp': a.student.noWhatsapp,
      'Jumlah Bulan Tertunggak': a.monthsCount,
      'Periode Tunggakan': a.periodeString,
      'Total Tunggakan': a.totalTunggakan,
      'Pembayaran Terakhir': a.lastPaymentDate ? formatTanggalIndo(a.lastPaymentDate) : 'Belum Pernah',
      'Status Tindak Lanjut': a.followUp?.status || 'Belum Dihubungi',
      'Catatan Follow Up': a.followUp?.catatan || '',
    }));
    exportToCSV(`MONITORING_TUNGGAKAN_SPP_${new Date().toISOString().slice(0, 10)}.csv`, rows);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Monitoring Tunggakan SPP</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {filteredArrears.length} Siswa Menunggak
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pantau siswa yang belum melunasi kewajiban SPP, filter durasi tunggakan, dan kirim pesan pengingat sopan via WhatsApp.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition"
        >
          <Download className="w-3.5 h-3.5 text-stone-500" />
          <span>Ekspor Daftar Tunggakan</span>
        </button>
      </div>

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Total Piutang Tertunggak
          </span>
          <span className="text-xl font-black text-amber-800 font-mono">
            {formatRupiah(totalNominalTunggakan)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            Dari {filteredArrears.length} siswa terfilter
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Tunggakan 1 Bulan
          </span>
          <span className="text-xl font-black text-stone-800">
            {arrearsList.filter((a) => a.monthsCount === 1).length} Siswa
          </span>
          <span className="text-[10px] text-emerald-600 block mt-0.5">Pengingat rutin awal</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Tunggakan 2 - 3 Bulan
          </span>
          <span className="text-xl font-black text-amber-700">
            {arrearsList.filter((a) => a.monthsCount >= 2 && a.monthsCount <= 3).length} Siswa
          </span>
          <span className="text-[10px] text-amber-600 block mt-0.5">Perlu konfirmasi orang tua</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
            Tunggakan &gt; 3 Bulan
          </span>
          <span className="text-xl font-black text-red-700">
            {arrearsList.filter((a) => a.monthsCount > 3).length} Siswa
          </span>
          <span className="text-[10px] text-red-600 block mt-0.5">Prioritas penanganan khusus</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari siswa atau nama wali..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Unit Filter */}
        <div>
          <select
            value={filterUnit}
            onChange={(e) => setFilterUnit(e.target.value as SPPUnit)}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Unit Pendidikan</option>
            <option value="rait">RAIT Saja</option>
            <option value="sdit">SDIT Saja</option>
            <option value="smpit">SMPIT Saja</option>
          </select>
        </div>

        {/* Duration Filter (1 bln, 2-3 bln, >3 bln) */}
        <div>
          <select
            value={filterDuration}
            onChange={(e) => setFilterDuration(e.target.value)}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Kategori Tunggakan</option>
            <option value="1">Tunggakan 1 Bulan Saja</option>
            <option value="2-3">Tunggakan 2 s.d 3 Bulan</option>
            <option value=">3">Tunggakan Lebih dari 3 Bulan (&gt;3 Bulan)</option>
          </select>
        </div>

        {/* Quick Follow-up update helper note */}
        <div className="flex items-center text-[11px] text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
          <span>Tekan tombol WhatsApp untuk meninjau & mengirim draf pesan resmi.</span>
        </div>
      </div>

      {/* Arrears Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">Nama Siswa & NIS</th>
                <th className="py-3 px-4">Jenjang & Kelas</th>
                <th className="py-3 px-4">Orang Tua / No WA</th>
                <th className="py-3 px-4 text-center">Durasi</th>
                <th className="py-3 px-4">Periode Bulan Menunggak</th>
                <th className="py-3 px-4 text-right">Total Tunggakan</th>
                <th className="py-3 px-4">Status Tindak Lanjut</th>
                <th className="py-3 px-4 text-center">Aksi Pengingat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredArrears.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Tidak ditemukan data siswa menunggak dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredArrears.map((item) => (
                  <tr key={item.student.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900 text-sm">{item.student.namaLengkap}</div>
                      <div className="text-[11px] text-stone-400 font-mono">NIS: {item.student.nis}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 mr-1.5">
                        {item.student.unit.toUpperCase()}
                      </span>
                      <span>{item.student.kelas}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-stone-800">{item.student.namaOrangTua}</div>
                      <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{item.student.noWhatsapp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          item.monthsCount > 3
                            ? 'bg-red-100 text-red-800'
                            : item.monthsCount >= 2
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {item.monthsCount} Bulan
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-stone-800 max-w-xs">{item.periodeString}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-amber-800 text-sm">
                      {formatRupiah(item.totalTunggakan)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-stone-800">
                        {item.followUp?.status || 'Belum Dihubungi'}
                      </div>
                      {item.followUp?.catatan && (
                        <div className="text-[10px] text-stone-400 truncate max-w-[160px]">
                          {item.followUp.catatan}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleOpenWA(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
                        title="Tinjau & Kirim WhatsApp Resmi"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Kirim WA</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Modal */}
      {waTargetStudent && (
        <WhatsAppReminderModal
          student={waTargetStudent}
          unpaidInvoices={waTargetInvoices}
          onClose={() => {
            setWaTargetStudent(null);
            setWaTargetInvoices([]);
          }}
        />
      )}
    </div>
  );
};
