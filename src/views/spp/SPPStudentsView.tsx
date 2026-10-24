/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { Student, StudentStatus, StudentGender, SPPUnit } from '../../types/spp';
import { formatRupiah, formatTanggalIndo, exportToCSV } from '../../utils/sppHelpers';
import {
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  X,
  CheckCircle,
  FileSpreadsheet,
  Phone,
  Layers,
  Award,
  AlertCircle,
  User,
  CreditCard,
  UserX,
  Check,
} from 'lucide-react';

export const SPPStudentsView: React.FC = () => {
  const {
    students,
    invoices,
    scholarships,
    settings,
    selectedUnitFilter,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkAddStudents,
    currentUser,
    setCurrentTab,
  } = useSPP();

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<SPPUnit>(selectedUnitFilter);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Form State for Single Add / Edit
  const [formData, setFormData] = useState<{
    nis: string;
    nisn: string;
    namaLengkap: string;
    jenisKelamin: StudentGender;
    unit: 'rait' | 'sdit' | 'smpit';
    kelas: string;
    tahunAjaran: string;
    namaOrangTua: string;
    noWhatsapp: string;
    tarifSPP: number;
    beasiswaId: string;
    potonganSPP: number;
    tanggalMasuk: string;
    status: StudentStatus;
    catatan: string;
    alamat: string;
  }>({
    nis: '',
    nisn: '',
    namaLengkap: '',
    jenisKelamin: 'Laki-laki',
    unit: 'sdit',
    kelas: '1A Umar bin Khattab',
    tahunAjaran: '2024/2025',
    namaOrangTua: '',
    noWhatsapp: '',
    tarifSPP: 450000,
    beasiswaId: '',
    potonganSPP: 0,
    tanggalMasuk: new Date().toISOString().slice(0, 10),
    status: 'aktif',
    catatan: '',
    alamat: '',
  });

  // Bulk Form State (multi-line parser)
  const [bulkInputText, setBulkInputText] = useState('');

  // Synchronize unit filter when header filter changes
  React.useEffect(() => {
    if (selectedUnitFilter !== 'all') {
      setSelectedUnit(selectedUnitFilter);
    }
  }, [selectedUnitFilter]);

  // Classes list according to unit
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

  // Open Edit Modal
  const handleOpenEdit = (stu: Student) => {
    setEditingStudent(stu);
    setFormData({
      nis: stu.nis,
      nisn: stu.nisn || '',
      namaLengkap: stu.namaLengkap,
      jenisKelamin: stu.jenisKelamin || 'Laki-laki',
      unit: stu.unit,
      kelas: stu.kelas,
      tahunAjaran: stu.tahunAjaran,
      namaOrangTua: stu.namaOrangTua,
      noWhatsapp: stu.noWhatsapp,
      tarifSPP: stu.tarifSPP,
      beasiswaId: stu.beasiswaId || '',
      potonganSPP: stu.potonganSPP || 0,
      tanggalMasuk: stu.tanggalMasuk,
      status: stu.status,
      catatan: stu.catatan || '',
      alamat: stu.alamat || '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const targetUnit = selectedUnit === 'all' ? 'sdit' : selectedUnit;
    const defaultTarif = settings.tarifDefault[targetUnit] || 450000;
    const defaultClass = getClassesForUnit(targetUnit)[0];

    setFormData({
      nis: String(Math.floor(10000000 + Math.random() * 90000000)),
      nisn: '',
      namaLengkap: '',
      jenisKelamin: 'Laki-laki',
      unit: targetUnit,
      kelas: defaultClass,
      tahunAjaran: settings.tahunAjaranAktif || '2024/2025',
      namaOrangTua: '',
      noWhatsapp: '',
      tarifSPP: defaultTarif,
      beasiswaId: '',
      potonganSPP: 0,
      tanggalMasuk: new Date().toISOString().slice(0, 10),
      status: 'aktif',
      catatan: '',
      alamat: 'Batam, Kepulauan Riau',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap.trim() || !formData.nis.trim()) return;

    // Determine scholarship name
    let namaBeasiswa = undefined;
    if (formData.beasiswaId) {
      const sch = scholarships.find((s) => s.id === formData.beasiswaId);
      namaBeasiswa = sch?.nama;
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        ...formData,
        namaBeasiswa,
      });
    } else {
      addStudent({
        ...formData,
        namaBeasiswa,
      });
    }

    setIsAddModalOpen(false);
  };

  // Confirm delete handler
  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    deleteStudent(deletingStudent.id);
    setDeletingStudent(null);
  };

  // Bulk import parser
  const handleProcessBulk = () => {
    if (!bulkInputText.trim()) return;

    const lines = bulkInputText.trim().split('\n');
    const newStudents: Omit<Student, 'id'>[] = [];

    lines.forEach((line) => {
      // Format: NIS, Nama, JenisKelamin (L/P), Unit (rait/sdit/smpit), Kelas, OrangTua, NoWA, TarifSPP
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      if (parts.length >= 4) {
        const nis = parts[0] || String(Date.now()).slice(-6);
        const nama = parts[1] || 'Siswa Baru';
        const genderRaw = parts[2]?.toUpperCase();
        const jenisKelamin: StudentGender = genderRaw === 'P' || genderRaw === 'PEREMPUAN' ? 'Perempuan' : 'Laki-laki';
        const unit = (['rait', 'sdit', 'smpit'].includes(parts[3]?.toLowerCase())
          ? parts[3].toLowerCase()
          : 'sdit') as 'rait' | 'sdit' | 'smpit';
        const kelas = parts[4] || '1A';
        const orangTua = parts[5] || 'Orang Tua / Wali';
        const wa = parts[6] || '081270000000';
        const tarif = Number(parts[7]) || settings.tarifDefault[unit] || 450000;

        newStudents.push({
          nis,
          namaLengkap: nama,
          jenisKelamin,
          unit,
          kelas,
          tahunAjaran: settings.tahunAjaranAktif,
          namaOrangTua: orangTua,
          noWhatsapp: wa,
          tarifSPP: tarif,
          potonganSPP: 0,
          tanggalMasuk: new Date().toISOString().slice(0, 10),
          status: 'aktif',
          catatan: 'Diimpor massal',
        });
      }
    });

    if (newStudents.length > 0) {
      bulkAddStudents(newStudents);
      setIsBulkModalOpen(false);
      setBulkInputText('');
    }
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    const exportRows = filteredStudents.map((s) => ({
      NIS: s.nis,
      NISN: s.nisn || '-',
      'Nama Lengkap': s.namaLengkap,
      'Jenis Kelamin': s.jenisKelamin || 'Laki-laki',
      Tingkat: s.unit.toUpperCase(),
      Kelas: s.kelas,
      'Tahun Ajaran': s.tahunAjaran,
      'Nama Orang Tua / Wali': s.namaOrangTua,
      'No WhatsApp': s.noWhatsapp,
      'Tarif SPP Pokok': s.tarifSPP,
      'Potongan Beasiswa': s.potonganSPP || 0,
      'Tarif Bersih': Math.max(0, s.tarifSPP - (s.potonganSPP || 0)),
      'Program Beasiswa': s.namaBeasiswa || '-',
      Status: s.status,
      'Tanggal Masuk': s.tanggalMasuk,
      Catatan: s.catatan || '',
    }));
    exportToCSV(`DATA_SISWA_SANTRI_SPP_${new Date().toISOString().slice(0, 10)}.csv`, exportRows);
  };

  // CSV File upload trigger
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setBulkInputText(text);
        setIsBulkModalOpen(true);
      }
    };
    reader.readAsText(file);
  };

  // Filter logic
  const filteredStudents = students.filter((s) => {
    // Filter tingkat / unit
    if (selectedUnit !== 'all' && s.unit !== selectedUnit) return false;

    // Filter status aktif/nonaktif
    if (selectedStatus === 'aktif' && s.status !== 'aktif') return false;
    if (selectedStatus === 'nonaktif' && s.status === 'aktif') return false;
    if (selectedStatus !== 'all' && selectedStatus !== 'aktif' && selectedStatus !== 'nonaktif' && s.status !== selectedStatus) return false;

    // Filter kelas
    if (selectedClass !== 'all' && s.kelas !== selectedClass) return false;

    // Filter jenis kelamin
    if (selectedGender !== 'all' && (s.jenisKelamin || 'Laki-laki') !== selectedGender) return false;

    // Filter pencarian nama atau nomor induk (NIS)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.namaLengkap.toLowerCase().includes(q);
      const matchNIS = s.nis.toLowerCase().includes(q);
      const matchParent = s.namaOrangTua.toLowerCase().includes(q);
      if (!matchName && !matchNIS && !matchParent) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Data Siswa / Santri</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              {filteredStudents.length} Siswa Terdaftar
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pengelolaan data induk siswa/santri, jenis kelamin, kelas/tingkat, nama wali, nomor WhatsApp, tarif SPP bulanan, dan status keaktifan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer border border-stone-200 transition">
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Impor CSV</span>
            <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition"
          >
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            <span>Input Massal</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold border border-stone-200 transition"
          >
            <Download className="w-3.5 h-3.5 text-stone-500" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa/Santri</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        {/* Search Input: Nama atau Nomor Induk */}
        <div className="relative lg:col-span-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama atau nomor induk (NIS)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Tingkat / Unit Filter */}
        <div>
          <select
            value={selectedUnit}
            onChange={(e) => {
              setSelectedUnit(e.target.value as SPPUnit);
              setSelectedClass('all');
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Tingkat (RAIT, SDIT, SMPIT)</option>
            <option value="rait">Tingkat RAIT (TK IT)</option>
            <option value="sdit">Tingkat SDIT (SD IT)</option>
            <option value="smpit">Tingkat SMPIT (SMP IT)</option>
          </select>
        </div>

        {/* Kelas Filter */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Kelas</option>
            {getClassesForUnit(selectedUnit === 'all' ? 'sdit' : selectedUnit).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Status Aktif / Nonaktif Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="aktif">Status Aktif Saja</option>
            <option value="nonaktif">Status Nonaktif / Pindah / Lulus</option>
            <option value="pindah">Khusus Pindah</option>
            <option value="lulus">Khusus Lulus</option>
          </select>
        </div>

        {/* Jenis Kelamin Filter */}
        <div>
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full py-2 px-3 border border-stone-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="all">Semua Gender (L & P)</option>
            <option value="Laki-laki">Laki-laki (Ikhwan)</option>
            <option value="Perempuan">Perempuan (Akhwat)</option>
          </select>
        </div>
      </div>

      {/* Main Student Data Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Induk (NIS)</th>
                <th className="py-3 px-4">Nama Lengkap & Gender</th>
                <th className="py-3 px-4">Tingkat & Kelas</th>
                <th className="py-3 px-4">Orang Tua/Wali & WhatsApp</th>
                <th className="py-3 px-4">Tgl Masuk</th>
                <th className="py-3 px-4 text-right">Tarif Bersih SPP</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Tidak ditemukan data siswa/santri yang cocok dengan kriteria filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((stu) => {
                  const netTarif = Math.max(0, stu.tarifSPP - (stu.potonganSPP || 0));
                  const gender = stu.jenisKelamin || 'Laki-laki';

                  return (
                    <tr key={stu.id} className="hover:bg-stone-50/80 transition">
                      {/* NIS & NISN */}
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">
                        {stu.nis}
                        {stu.nisn && (
                          <span className="block text-[10px] text-stone-400 font-normal">
                            NISN: {stu.nisn}
                          </span>
                        )}
                      </td>

                      {/* Nama Lengkap & Jenis Kelamin */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 text-sm">{stu.namaLengkap}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                              gender === 'Laki-laki'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-pink-50 text-pink-800 border border-pink-200'
                            }`}
                          >
                            {gender === 'Laki-laki' ? '♂ Laki-laki' : '♀ Perempuan'}
                          </span>
                        </div>
                      </td>

                      {/* Tingkat & Kelas */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 mr-1.5">
                          {stu.unit.toUpperCase()}
                        </span>
                        <span className="text-stone-800">{stu.kelas}</span>
                      </td>

                      {/* Orang Tua & WhatsApp */}
                      <td className="py-3 px-4">
                        <div className="text-stone-800 font-medium">{stu.namaOrangTua}</div>
                        <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{stu.noWhatsapp}</span>
                        </div>
                      </td>

                      {/* Tanggal Masuk */}
                      <td className="py-3 px-4 text-stone-600">
                        {formatTanggalIndo(stu.tanggalMasuk)}
                      </td>

                      {/* Tarif SPP Pokok & Bersih */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-stone-900 text-sm">
                          {formatRupiah(netTarif)}
                        </div>
                        {stu.potonganSPP > 0 && (
                          <div className="text-[10px] text-amber-700 font-medium">
                            Diskon: {formatRupiah(stu.potonganSPP)}
                          </div>
                        )}
                      </td>

                      {/* Status Aktif / Nonaktif */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                            stu.status === 'aktif'
                              ? 'bg-emerald-100 text-emerald-800'
                              : stu.status === 'lulus'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {stu.status}
                        </span>
                      </td>

                      {/* Aksi: Detail, Edit, Hapus */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setDetailStudent(stu)}
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                            title="Lihat Detail Siswa/Santri & Riwayat SPP"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(stu)}
                            className="p-1.5 text-stone-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Data Siswa/Santri"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(stu)}
                            className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Data Siswa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <div>
            Menampilkan{' '}
            <strong>
              {filteredStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
            </strong>{' '}
            sampai{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</strong> dari{' '}
            <strong>{filteredStudents.length}</strong> siswa
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

      {/* MODAL 1: Tambah / Edit Siswa */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">
                  {editingStudent ? 'Edit Data Siswa / Santri' : 'Tambah Data Siswa / Santri Baru'}
                </h3>
                <p className="text-emerald-200 text-xs">
                  SIT Insan Harapan Batam • Yayasan Harapan Ibu Kepri
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 text-xs text-stone-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Nomor Induk Siswa/Santri (NIS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">NISN (Jika Ada):</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0182736450"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1">
                    Nama Lengkap Siswa/Santri <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaLengkap}
                    onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Contoh: Muhammad Al-Fatih Pratama"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Jenis Kelamin <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) =>
                      setFormData({ ...formData, jenisKelamin: e.target.value as StudentGender })
                    }
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Laki-laki">♂ Laki-laki</option>
                    <option value="Perempuan">♀ Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Tingkat Pendidikan:</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => {
                      const newUnit = e.target.value as 'rait' | 'sdit' | 'smpit';
                      const defaultTarif = settings.tarifDefault[newUnit] || 450000;
                      const defaultClass = getClassesForUnit(newUnit)[0];
                      setFormData({
                        ...formData,
                        unit: newUnit,
                        tarifSPP: defaultTarif,
                        kelas: defaultClass,
                      });
                    }}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    <option value="rait">RAIT (TK Islam Terpadu)</option>
                    <option value="sdit">SDIT (Sekolah Dasar IT)</option>
                    <option value="smpit">SMPIT (SMP IT)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kelas:</label>
                  <select
                    value={formData.kelas}
                    onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {getClassesForUnit(formData.unit).map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Tahun Ajaran:</label>
                  <input
                    type="text"
                    value={formData.tahunAjaran}
                    onChange={(e) => setFormData({ ...formData, tahunAjaran: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">
                    Nama Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaOrangTua}
                    onChange={(e) => setFormData({ ...formData, namaOrangTua: e.target.value })}
                    placeholder="Contoh: Hendra Gunawan"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Nomor WhatsApp Orang Tua / Wali <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.noWhatsapp}
                    onChange={(e) => setFormData({ ...formData, noWhatsapp: e.target.value })}
                    placeholder="Contoh: 081270001928"
                    className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Tanggal Masuk & Status Aktif/Nonaktif */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Tanggal Masuk Siswa:</label>
                  <input
                    type="date"
                    value={formData.tanggalMasuk}
                    onChange={(e) => setFormData({ ...formData, tanggalMasuk: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Status Keaktifan:</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as StudentStatus })
                    }
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white font-bold"
                  >
                    <option value="aktif">Aktif (Mengikuti Pembelajaran)</option>
                    <option value="nonaktif">Nonaktif</option>
                    <option value="pindah">Pindah Sekolah</option>
                    <option value="lulus">Lulus</option>
                  </select>
                </div>
              </div>

              {/* SPP & Scholarship section */}
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
                <div className="font-bold text-emerald-900 uppercase tracking-wider text-[11px]">
                  Penentuan Nominal SPP Bulanan & Beasiswa Siswa
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Nominal SPP Pokok (Rp):</label>
                    <input
                      type="number"
                      value={formData.tarifSPP}
                      onChange={(e) =>
                        setFormData({ ...formData, tarifSPP: Number(e.target.value) })
                      }
                      className="w-full p-2 border border-stone-300 rounded-lg bg-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Program Beasiswa / Keringanan:</label>
                    <select
                      value={formData.beasiswaId}
                      onChange={(e) => {
                        const bId = e.target.value;
                        let pot = 0;
                        if (bId) {
                          const sch = scholarships.find((s) => s.id === bId);
                          if (sch) {
                            if (sch.tipe === 'penuh') pot = formData.tarifSPP;
                            else if (sch.tipe === 'persentase') pot = (formData.tarifSPP * sch.nilai) / 100;
                            else pot = sch.nilai;
                          }
                        }
                        setFormData({ ...formData, beasiswaId: bId, potonganSPP: pot });
                      }}
                      className="w-full p-2 border border-stone-300 rounded-lg bg-white text-xs"
                    >
                      <option value="">-- Tarif Normal (Tanpa Beasiswa) --</option>
                      {scholarships.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.tipe === 'persentase' ? `${s.nilai}%` : formatRupiah(s.nilai)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Nominal Potongan (Rp):</label>
                    <input
                      type="number"
                      value={formData.potonganSPP}
                      onChange={(e) =>
                        setFormData({ ...formData, potonganSPP: Number(e.target.value) })
                      }
                      className="w-full p-2 border border-stone-300 rounded-lg bg-white font-mono text-amber-800 font-bold"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-emerald-800 font-semibold flex justify-between pt-1 border-t border-emerald-200/60">
                  <span>Kewajiban Bersih per Bulan:</span>
                  <span className="font-mono text-sm text-emerald-950 font-black">
                    {formatRupiah(Math.max(0, formData.tarifSPP - formData.potonganSPP))}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Tambahan:</label>
                <textarea
                  rows={2}
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  placeholder="Catatan prestasi siswa, riwayat hafalan, atau kondisi khusus..."
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="bg-stone-100 px-6 py-4 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  {editingStudent ? 'Simpan Perubahan Siswa' : 'Daftarkan Siswa Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Konfirmasi Hapus Data Siswa */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-red-800 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm">Konfirmasi Hapus Data Siswa</h3>
              </div>
              <button
                onClick={() => setDeletingStudent(null)}
                className="text-red-200 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700">
              <p className="leading-relaxed">
                Apakah Anda yakin ingin menghapus data siswa/santri berikut dari database?
              </p>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-1">
                <div><strong>Nama:</strong> {deletingStudent.namaLengkap}</div>
                <div><strong>NIS:</strong> {deletingStudent.nis}</div>
                <div><strong>Tingkat / Kelas:</strong> {deletingStudent.unit.toUpperCase()} - {deletingStudent.kelas}</div>
                <div><strong>Wali:</strong> {deletingStudent.namaOrangTua}</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                <strong>Catatan:</strong> Jika siswa sudah memiliki riwayat transaksi keuangan, disarankan mengubah status menjadi <strong>Nonaktif</strong> atau <strong>Pindah</strong> di formulir Edit Siswa agar riwayat laporan keuangan tetap utuh.
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setDeletingStudent(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold transition shadow-sm"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Detail Siswa / Santri & Buku Besar Riwayat SPP */}
      {detailStudent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-950 text-white p-6 flex items-start justify-between border-b border-emerald-800">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-800 border-2 border-amber-400 flex items-center justify-center text-lg font-black text-amber-300 shadow-md">
                  {detailStudent.namaLengkap.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black">{detailStudent.namaLengkap}</h2>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-stone-950">
                      {detailStudent.unit.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-emerald-200 text-xs mt-0.5">
                    NIS: {detailStudent.nis} • Kelas: {detailStudent.kelas} • Gender: {detailStudent.jenisKelamin || 'Laki-laki'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailStudent(null)}
                className="text-stone-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs text-stone-700">
              {/* Profile Card Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Jenis Kelamin:</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">
                    {detailStudent.jenisKelamin === 'Perempuan' ? '♀ Perempuan (Akhwat)' : '♂ Laki-laki (Ikhwan)'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Orang Tua / Wali:</span>
                  <span className="font-bold text-stone-900 text-xs mt-0.5 block">{detailStudent.namaOrangTua}</span>
                  <span className="text-emerald-800 font-mono text-[11px] block mt-0.5">
                    WA: {detailStudent.noWhatsapp}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Tanggal Masuk:</span>
                  <span className="font-semibold text-stone-800 text-xs mt-0.5 block">
                    {formatTanggalIndo(detailStudent.tanggalMasuk)}
                  </span>
                  <span className="text-[10px] text-stone-400">TA {detailStudent.tahunAjaran}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Tarif Bersih SPP:</span>
                  <span className="font-black text-emerald-900 text-sm font-mono block mt-0.5">
                    {formatRupiah(Math.max(0, detailStudent.tarifSPP - (detailStudent.potonganSPP || 0)))}
                  </span>
                  {detailStudent.potonganSPP > 0 && (
                    <span className="text-[10px] text-amber-700">
                      Diskon: {formatRupiah(detailStudent.potonganSPP)} ({detailStudent.namaBeasiswa || 'Beasiswa'})
                    </span>
                  )}
                </div>
              </div>

              {/* Riwayat Tagihan Siswa Ini */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Buku Besar Tagihan & Status SPP Siswa (Tahun Ajaran {detailStudent.tahunAjaran})
                  </h3>
                  <button
                    onClick={() => {
                      setDetailStudent(null);
                      setCurrentTab('transaksi');
                    }}
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold hover:underline"
                  >
                    <CreditCard className="w-3 h-3" />
                    <span>Catat Pembayaran di Kasir</span>
                  </button>
                </div>

                {(() => {
                  const studentInvoices = invoices.filter((i) => i.siswaId === detailStudent.id);
                  if (studentInvoices.length === 0) {
                    return (
                      <div className="p-6 text-center text-stone-400 bg-stone-50 rounded-xl border border-stone-200">
                        Belum ada tagihan SPP yang diterbitkan untuk siswa ini.
                      </div>
                    );
                  }

                  const totalTagihanSiswa = studentInvoices.reduce((a, b) => a + b.totalTagihan, 0);
                  const totalTerbayarSiswa = studentInvoices.reduce((a, b) => a + b.terbayar, 0);
                  const totalSisaSiswa = studentInvoices.reduce((a, b) => a + b.sisaTagihan, 0);

                  return (
                    <div className="border border-stone-200 rounded-xl overflow-hidden">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                          <tr>
                            <th className="py-2.5 px-3">Periode Bulan</th>
                            <th className="py-2.5 px-3">Jatuh Tempo</th>
                            <th className="py-2.5 px-3 text-right">Tagihan</th>
                            <th className="py-2.5 px-3 text-right">Terbayar</th>
                            <th className="py-2.5 px-3 text-right">Sisa Tagihan</th>
                            <th className="py-2.5 px-3 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                          {studentInvoices.map((inv) => {
                            const isOverdue = inv.sisaTagihan > 0 && new Date(inv.jatuhTempo) < new Date();

                            return (
                              <tr key={inv.id} className="hover:bg-stone-50">
                                <td className="py-2.5 px-3 font-semibold text-stone-900">
                                  {inv.namaBulan}
                                </td>
                                <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">
                                  {inv.jatuhTempo}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                                  {formatRupiah(inv.totalTagihan)}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-bold">
                                  {formatRupiah(inv.terbayar)}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-amber-800 font-bold">
                                  {formatRupiah(inv.sisaTagihan)}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  {inv.status === 'lunas' || inv.sisaTagihan === 0 ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                      Lunas
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800">
                                      Terlambat
                                    </span>
                                  ) : inv.terbayar > 0 ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                      Dibayar Sebagian
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                      Belum Bayar
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-stone-100 font-bold border-t border-stone-200">
                          <tr>
                            <td colSpan={2} className="py-2.5 px-3 uppercase text-stone-600">Total Akumulasi:</td>
                            <td className="py-2.5 px-3 text-right font-mono">{formatRupiah(totalTagihanSiswa)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-emerald-900">{formatRupiah(totalTerbayarSiswa)}</td>
                            <td className="py-2.5 px-3 text-right font-mono text-amber-800">{formatRupiah(totalSisaSiswa)}</td>
                            <td className="py-2.5 px-3 text-center">
                              {totalSisaSiswa === 0 ? '✓ Lunas' : 'Ada Tunggakan'}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  );
                })()}
              </div>

              {detailStudent.catatan && (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                  <strong>Catatan Siswa:</strong> {detailStudent.catatan}
                </div>
              )}
            </div>

            <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setDetailStudent(null)}
                className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900 transition"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Input Massal Siswa */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Formulir Memasukkan Banyak Siswa Sekaligus</h3>
                <p className="text-emerald-200 text-xs">Salin & tempel dari Excel atau ketik berbaris</p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700">
              <div className="bg-stone-50 border border-stone-200 p-3 rounded-xl font-mono text-[11px] space-y-1">
                <div className="font-bold text-stone-800">Format Kolom per Baris (Pisahkan dengan koma atau tab):</div>
                <div className="text-emerald-800">
                  NIS, Nama Lengkap, Gender (L/P), Jenjang (rait/sdit/smpit), Kelas, Nama Wali, No WhatsApp, Tarif
                </div>
                <div className="text-stone-400">
                  Contoh: 20240901, Muhammad Bilal, L, sdit, 1A Umar bin Khattab, Ahmad, 081270001928, 450000
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Tempel Data Siswa di Sini:
                </label>
                <textarea
                  rows={8}
                  value={bulkInputText}
                  onChange={(e) => setBulkInputText(e.target.value)}
                  placeholder="20240901, Muhammad Bilal, L, sdit, 1A Umar bin Khattab, Ahmad, 081270001928, 450000&#10;20240902, Maryam Shofia, P, rait, TK-A Bulan, Ridwan, 081370001929, 350000"
                  className="w-full p-3 border border-stone-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleProcessBulk}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  Proses & Simpan Semua Siswa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
