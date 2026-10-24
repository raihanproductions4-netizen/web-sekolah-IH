/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { SPPUser, UserRole, SPPUnit, SchoolClass } from '../../types/spp';
import { formatRupiah, formatTanggalIndo } from '../../utils/sppHelpers';
import {
  Settings,
  Shield,
  Users,
  Database,
  Building,
  CreditCard,
  Download,
  Upload,
  RefreshCw,
  Plus,
  CheckCircle,
  AlertTriangle,
  Lock,
  X,
  History,
  School,
  Image as ImageIcon,
  Calendar,
  Layers,
  Trash2,
  Edit,
  LogIn,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const SPPSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    users,
    addUser,
    updateUser,
    classes,
    addClass,
    updateClass,
    deleteClass,
    currentUser,
    isAdmin,
    isBendahara,
    switchUserRole,
    firebaseUser,
    isFirestoreConnected,
    loginWithGoogle,
    logoutFirebase,
    auditLogs,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetToDefaultData,
  } = useSPP();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profil' | 'tarif' | 'kelas' | 'tahun_ajaran' | 'pengguna' | 'firebase' | 'backup'>('profil');

  // Institution Profile Form
  const [profileForm, setProfileForm] = useState({
    namaYayasan: settings.namaYayasan,
    namaSekolah: settings.namaSekolah,
    tagline: settings.tagline || 'Membangun Generasi Qurani, Mandiri, dan Berakhlak Mulia',
    alamatYayasan: settings.alamatYayasan,
    kontakYayasan: settings.kontakYayasan,
    emailYayasan: settings.emailYayasan,
    logoUrl: settings.logoUrl || '',
    kepalaYayasan: settings.kepalaYayasan,
    bendaharaYayasan: settings.bendaharaYayasan,
  });

  // Tariff Form
  const [tariffForm, setTariffForm] = useState({
    rait: settings.tarifDefault.rait,
    sdit: settings.tarifDefault.sdit,
    smpit: settings.tarifDefault.smpit,
    jatuhTempoTanggal: settings.jatuhTempoTanggal,
  });

  // Academic Year Form
  const [academicYearForm, setAcademicYearForm] = useState({
    tahunAjaranAktif: settings.tahunAjaranAktif,
    semesterAktif: settings.semesterAktif,
    daftarTahunAjaran: settings.daftarTahunAjaran || ['2023/2024', '2024/2025', '2025/2026', '2026/2027'],
  });
  const [newYearInput, setNewYearInput] = useState('');

  // Class Management State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [classFormData, setClassFormData] = useState({
    namaKelas: '',
    unit: 'sdit' as 'rait' | 'sdit' | 'smpit',
    tahunAjaran: settings.tahunAjaranAktif,
    waliKelas: '',
    kapasitas: 28,
  });

  // User Management Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    nama: '',
    email: '',
    username: '',
    role: 'bendahara' as UserRole,
    roleName: 'Bendahara Keuangan SPP',
    unitAkses: 'all' as SPPUnit,
    telepon: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
  });

  // Handlers
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    await updateSettings(profileForm);
  };

  const handleSaveTariff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    await updateSettings({
      tarifDefault: {
        rait: tariffForm.rait,
        sdit: tariffForm.sdit,
        smpit: tariffForm.smpit,
      },
      jatuhTempoTanggal: tariffForm.jatuhTempoTanggal,
    });
  };

  const handleSaveAcademicYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    await updateSettings({
      tahunAjaranAktif: academicYearForm.tahunAjaranAktif,
      semesterAktif: academicYearForm.semesterAktif,
      daftarTahunAjaran: academicYearForm.daftarTahunAjaran,
    });
  };

  const handleAddYear = () => {
    if (!newYearInput.trim()) return;
    if (academicYearForm.daftarTahunAjaran.includes(newYearInput.trim())) return;
    setAcademicYearForm((prev) => ({
      ...prev,
      daftarTahunAjaran: [...prev.daftarTahunAjaran, newYearInput.trim()],
    }));
    setNewYearInput('');
  };

  // Class CRUD Submit
  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classFormData.namaKelas.trim()) return;

    if (editingClass) {
      await updateClass(editingClass.id, classFormData);
      setEditingClass(null);
    } else {
      await addClass(classFormData);
    }

    setIsClassModalOpen(false);
    setClassFormData({
      namaKelas: '',
      unit: 'sdit',
      tahunAjaran: settings.tahunAjaranAktif,
      waliKelas: '',
      kapasitas: 28,
    });
  };

  // User CRUD Submit
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.nama.trim() || !userFormData.username.trim()) return;

    let roleName = 'Bendahara Keuangan SPP';
    if (userFormData.role === 'admin' || userFormData.role === 'super_admin') {
      roleName = 'Administrator Sekolah / Pesantren';
    }

    await addUser({
      ...userFormData,
      roleName,
      terakhirLogin: 'Baru Dibuat',
    });

    setIsUserModalOpen(false);
    setUserFormData({
      nama: '',
      email: '',
      username: '',
      role: 'bendahara',
      roleName: 'Bendahara Keuangan SPP',
      unitAkses: 'all',
      telepon: '',
      status: 'aktif',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Pengaturan Lembaga & Manajemen Akun</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              isAdmin ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-blue-100 text-blue-900 border-blue-300'
            }`}>
              Peran Anda: {currentUser.roleName}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Pengaturan profil sekolah/pesantren, logo, tarif SPP default, rombel/kelas, periode tahun ajaran, dan manajemen hak akses akun pengguna.
          </p>
        </div>

        {/* Quick Role Switcher for Testing Operational Permissions */}
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-600 px-2">Beralih Peran:</span>
          <button
            type="button"
            onClick={() => switchUserRole('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              isAdmin ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => switchUserRole('bendahara')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              !isAdmin ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:bg-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bendahara</span>
          </button>
        </div>
      </div>

      {/* Role Restriction Banner for Bendahara */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold">Akses Terbatas: Anda Masuk sebagai Bendahara</div>
            <p className="text-blue-800">
              Sesuai ketentuan otorisasi sistem, Bendahara memiliki hak mengelola tagihan, mencatat pembayaran, memantau tunggakan, dan membuat laporan keuangan. Pengaturan lembaga dan hak akses akun hanya dapat diubah oleh <strong>Administrator</strong>. Anda dapat melihat pengaturan dalam mode hanya baca (read-only) atau beralih ke akun Admin di atas untuk keperluan pengujian.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profil')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'profil' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span>Profil Sekolah / Pesantren</span>
        </button>

        <button
          onClick={() => setActiveTab('tarif')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'tarif' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tarif SPP Default</span>
        </button>

        <button
          onClick={() => setActiveTab('kelas')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'kelas' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Daftar Kelas / Rombel ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tahun_ajaran')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'tahun_ajaran' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Tahun Ajaran & Periode</span>
        </button>

        <button
          onClick={() => setActiveTab('pengguna')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'pengguna' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Manajemen Pengguna</span>
        </button>

        <button
          onClick={() => setActiveTab('firebase')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'firebase' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Firebase & Firestore</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'backup' ? 'bg-emerald-800 text-white shadow-xs font-bold' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Cadangan Data</span>
        </button>
      </div>

      {/* Tab 1: Profil Sekolah / Pesantren */}
      {activeTab === 'profil' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Identitas Sekolah / Pesantren</h3>
              <p className="text-stone-500">Informasi nama yayasan, lembaga, alamat, dan logo yang tertera pada kuitansi dan laporan</p>
            </div>
            {isAdmin && (
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                Simpan Perubahan Profil
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Nama Yayasan / Badan Penyelenggara:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.namaYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, namaYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Nama Sekolah / Pesantren:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.namaSekolah}
                onChange={(e) => setProfileForm({ ...profileForm, namaSekolah: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-800 mb-1">Semboyan / Tagline Lembaga:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.tagline}
                onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-800 mb-1">Alamat Lengkap Lembaga:</label>
              <textarea
                rows={2}
                disabled={!isAdmin}
                value={profileForm.alamatYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, alamatYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Nomor Telepon / WhatsApp:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.kontakYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, kontakYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Email Resmi Keuangan:</label>
              <input
                type="email"
                disabled={!isAdmin}
                value={profileForm.emailYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, emailYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Nama Kepala Sekolah / Direktur:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.kepalaYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, kepalaYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Nama Bendahara Utama:</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.bendaharaYayasan}
                onChange={(e) => setProfileForm({ ...profileForm, bendaharaYayasan: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-stone-800 mb-1">URL Logo Lembaga (Opsional):</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={profileForm.logoUrl}
                onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                placeholder="https://... atau biarkan kosong untuk menggunakan lambang SIT Harapan"
                className="w-full p-2.5 border border-stone-300 rounded-xl disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Tarif SPP Default */}
      {activeTab === 'tarif' && (
        <form onSubmit={handleSaveTariff} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Tarif SPP Bulanan Default</h3>
              <p className="text-stone-500">Besaran iuran SPP standar per unit pendidikan dan tanggal jatuh tempo tagihan</p>
            </div>
            {isAdmin && (
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                Simpan Tarif Default
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 block">Unit RAIT (PAUD/TK IT)</span>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-mono">Rp</span>
                <input
                  type="number"
                  step={25000}
                  disabled={!isAdmin}
                  value={tariffForm.rait}
                  onChange={(e) => setTariffForm({ ...tariffForm, rait: Number(e.target.value) })}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono font-bold text-emerald-950 bg-white"
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Diterapkan untuk santri RAIT baru</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 block">Unit SDIT (Sekolah Dasar)</span>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-mono">Rp</span>
                <input
                  type="number"
                  step={25000}
                  disabled={!isAdmin}
                  value={tariffForm.sdit}
                  onChange={(e) => setTariffForm({ ...tariffForm, sdit: Number(e.target.value) })}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono font-bold text-emerald-950 bg-white"
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Diterapkan untuk siswa SDIT baru</span>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 block">Unit SMPIT (Sekolah Menengah)</span>
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-mono">Rp</span>
                <input
                  type="number"
                  step={25000}
                  disabled={!isAdmin}
                  value={tariffForm.smpit}
                  onChange={(e) => setTariffForm({ ...tariffForm, smpit: Number(e.target.value) })}
                  className="w-full p-2 border border-stone-300 rounded-lg font-mono font-bold text-emerald-950 bg-white"
                />
              </div>
              <span className="text-[10px] text-stone-500 block">Diterapkan untuk santri SMPIT baru</span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 max-w-sm">
            <label className="block font-semibold text-stone-800 mb-1">
              Tanggal Jatuh Tempo Pembayaran Setiap Bulan:
            </label>
            <div className="flex items-center gap-2">
              <span className="text-stone-500">Tanggal</span>
              <input
                type="number"
                min={1}
                max={28}
                disabled={!isAdmin}
                value={tariffForm.jatuhTempoTanggal}
                onChange={(e) => setTariffForm({ ...tariffForm, jatuhTempoTanggal: Number(e.target.value) })}
                className="w-20 p-2 border border-stone-300 rounded-lg font-bold text-stone-900 bg-white text-center"
              />
              <span className="text-stone-500">setiap bulannya (Default: 10)</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-1">
              Tagihan yang belum lunas setelah tanggal ini otomatis berstatus terlambat.
            </p>
          </div>
        </form>
      )}

      {/* Tab 3: Daftar Kelas / Rombel */}
      {activeTab === 'kelas' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Daftar Rombongan Belajar (Kelas)</h3>
              <p className="text-stone-500">Kelola master data kelas untuk penempatan santri dan penerbitan tagihan</p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setEditingClass(null);
                  setClassFormData({
                    namaKelas: '',
                    unit: 'sdit',
                    tahunAjaran: settings.tahunAjaranAktif,
                    waliKelas: '',
                    kapasitas: 28,
                  });
                  setIsClassModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Kelas</th>
                  <th className="py-2.5 px-3">Unit Pendidikan</th>
                  <th className="py-2.5 px-3">Tahun Ajaran</th>
                  <th className="py-2.5 px-3">Wali Kelas / Asatidz</th>
                  <th className="py-2.5 px-3 text-center">Kapasitas</th>
                  {isAdmin && <th className="py-2.5 px-3 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {classes.map((cls) => (
                  <tr key={cls.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-bold text-stone-900">{cls.namaKelas}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                        {cls.unit}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{cls.tahunAjaran}</td>
                    <td className="py-2.5 px-3 text-stone-800">{cls.waliKelas || '-'}</td>
                    <td className="py-2.5 px-3 text-center text-stone-600">{cls.kapasitas || 30} Siswa</td>
                    {isAdmin && (
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingClass(cls);
                              setClassFormData({
                                namaKelas: cls.namaKelas,
                                unit: cls.unit,
                                tahunAjaran: cls.tahunAjaran,
                                waliKelas: cls.waliKelas || '',
                                kapasitas: cls.kapasitas || 28,
                              });
                              setIsClassModalOpen(true);
                            }}
                            className="p-1 rounded text-stone-500 hover:text-emerald-800 hover:bg-stone-100"
                            title="Edit Kelas"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteClass(cls.id)}
                            className="p-1 rounded text-stone-400 hover:text-rose-700 hover:bg-rose-50"
                            title="Hapus Kelas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Tahun Ajaran & Periode */}
      {activeTab === 'tahun_ajaran' && (
        <form onSubmit={handleSaveAcademicYear} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Pengaturan Periode Tahun Ajaran</h3>
              <p className="text-stone-500">Tentukan tahun ajaran aktif dan semester berjalan untuk penagihan SPP</p>
            </div>
            {isAdmin && (
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                Simpan Periode Aktif
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Tahun Ajaran Aktif Saat Ini:</label>
              <select
                disabled={!isAdmin}
                value={academicYearForm.tahunAjaranAktif}
                onChange={(e) => setAcademicYearForm({ ...academicYearForm, tahunAjaranAktif: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white font-bold text-emerald-900"
              >
                {academicYearForm.daftarTahunAjaran.map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun Ajaran {yr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Semester Aktif Saat Ini:</label>
              <select
                disabled={!isAdmin}
                value={academicYearForm.semesterAktif}
                onChange={(e) => setAcademicYearForm({ ...academicYearForm, semesterAktif: e.target.value as any })}
                className="w-full p-2.5 border border-stone-300 rounded-xl bg-white font-bold text-stone-900"
              >
                <option value="Ganjil">Semester Ganjil (Juli - Desember)</option>
                <option value="Genap">Semester Genap (Januari - Juni)</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-3 border-t border-stone-100">
              <label className="block font-semibold text-stone-800 mb-2">Daftar Pilihan Tahun Ajaran di Sistem:</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {academicYearForm.daftarTahunAjaran.map((yr) => (
                  <span
                    key={yr}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 border ${
                      yr === academicYearForm.tahunAjaranAktif
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    <span>{yr}</span>
                    {yr === academicYearForm.tahunAjaranAktif && <span className="text-[10px] bg-emerald-800 text-white px-1.5 py-0.2 rounded">Aktif</span>}
                  </span>
                ))}
              </div>

              {isAdmin && (
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    placeholder="Contoh: 2027/2028"
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    className="p-2 border border-stone-300 rounded-xl text-xs flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleAddYear}
                    className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-stone-700 text-xs border border-stone-200 transition"
                  >
                    Tambah Tahun
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      )}

      {/* Tab 5: Manajemen Pengguna (Admin & Bendahara) */}
      {activeTab === 'pengguna' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Manajemen Akun Pengguna</h3>
              <p className="text-stone-500">Kelola akun Admin (otoritas penuh) dan Bendahara (pengelolaan kasir & tagihan)</p>
            </div>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsUserModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Pengguna</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-stone-700">
              <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Nama & Username</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Peran (Role)</th>
                  <th className="py-2.5 px-3">Unit Akses</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-stone-900">{usr.nama}</div>
                      <div className="text-[10px] text-stone-400 font-mono">@{usr.username}</div>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600">{usr.email}</td>
                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded font-bold text-[10px] ${
                        usr.role === 'admin' || usr.role === 'super_admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}>
                        {usr.role === 'admin' || usr.role === 'super_admin' ? 'Administrator' : 'Bendahara'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 uppercase font-semibold">{usr.unitAkses}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        usr.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {usr.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          updateUser(usr.id, {
                            status: usr.status === 'aktif' ? 'nonaktif' : 'aktif',
                          });
                        }}
                        disabled={!isAdmin || usr.id === currentUser.id}
                        className="text-[11px] font-bold text-stone-600 hover:text-emerald-800 disabled:opacity-30 disabled:cursor-not-allowed underline"
                      >
                        {usr.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Firebase & Firestore Integration */}
      {activeTab === 'firebase' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-bold text-sm text-stone-900">Integrasi Cloud Firestore & Firebase Auth</h3>
              <p className="text-stone-500">Status sinkronisasi live database permanen dan otentikasi login</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-emerald-800 text-xs">Terkoneksi Realtime</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <span className="font-bold text-stone-800 block">Status Cloud Firestore:</span>
              <div className="text-stone-600 space-y-1 text-[11px]">
                <p>• Database ID: <code className="font-mono bg-white px-1 py-0.5 rounded border border-stone-200">ai-studio-sitinsanharapanb...</code></p>
                <p>• Koleksi Terhubung: <strong className="text-emerald-800">users, students, classes, bills, payments, school_settings</strong></p>
                <p>• Aturan Keamanan: <strong className="text-emerald-800">firestore.rules (Hardened ABAC) Aktif</strong></p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="font-bold text-emerald-900 block">Sesi Autentikasi Firebase:</span>
              {firebaseUser ? (
                <div className="space-y-1 text-[11px] text-stone-700">
                  <p>• User: <strong>{firebaseUser.displayName || firebaseUser.email}</strong></p>
                  <p>• Email: <code className="font-mono">{firebaseUser.email}</code></p>
                  <p>• UID: <code className="font-mono text-[10px]">{firebaseUser.uid}</code></p>
                  <button
                    type="button"
                    onClick={logoutFirebase}
                    className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold transition text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout Sesi Firebase</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-[11px] text-stone-600">
                  <p>Masuk menggunakan akun Google Anda untuk menguji autentikasi Firebase live.</p>
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition shadow-xs text-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk dengan Google (Firebase Auth)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5 text-xs">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="font-bold text-sm text-stone-900">Cadangan & Pemulihan Basis Data</h3>
            <p className="text-stone-500">Unduh cadangan data lengkap JSON atau reset ke data awal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-900 block">Ekspor Cadangan Lengkap</span>
              <p className="text-stone-500 text-[11px]">
                Unduh berkas JSON berisi seluruh data siswa, kelas, tagihan, transaksi pembayaran kasir, dan pengaturan yayasan.
              </p>
              <button
                type="button"
                onClick={exportDatabaseJSON}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Cadangan JSON</span>
              </button>
            </div>

            {isAdmin && (
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2">
                <span className="font-bold text-rose-900 block">Reset Basis Data Awal</span>
                <p className="text-rose-700 text-[11px]">
                  Mengembalikan data sistem ke sampel standar awal Yayasan Harapan Ibu Kepri.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin mereset basis data ke kondisi awal?')) {
                      resetToDefaultData();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 font-bold transition shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Data Default</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingClass ? 'Edit Rombel / Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                type="button"
                onClick={() => setIsClassModalOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleClassSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Nama Kelas / Rombel: *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1A Umar bin Khattab atau 7A"
                  value={classFormData.namaKelas}
                  onChange={(e) => setClassFormData({ ...classFormData, namaKelas: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Unit Pendidikan: *</label>
                  <select
                    value={classFormData.unit}
                    onChange={(e) => setClassFormData({ ...classFormData, unit: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white font-medium"
                  >
                    <option value="rait">RAIT</option>
                    <option value="sdit">SDIT</option>
                    <option value="smpit">SMPIT</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Kapasitas: *</label>
                  <input
                    type="number"
                    min={10}
                    max={50}
                    value={classFormData.kapasitas}
                    onChange={(e) => setClassFormData({ ...classFormData, kapasitas: Number(e.target.value) })}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Wali Kelas / Asatidz:</label>
                <input
                  type="text"
                  placeholder="Contoh: Ustadzah Dewi Sartika, S.Pd."
                  value={classFormData.waliKelas}
                  onChange={(e) => setClassFormData({ ...classFormData, waliKelas: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Akun Pengguna Baru</h3>
              <button
                type="button"
                onClick={() => setIsUserModalOpen(false)}
                className="text-stone-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Nama Lengkap Pengguna: *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap dengan Gelar"
                  value={userFormData.nama}
                  onChange={(e) => setUserFormData({ ...userFormData, nama: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Username: *</label>
                  <input
                    type="text"
                    required
                    placeholder="username"
                    value={userFormData.username}
                    onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                    className="w-full p-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Peran (Role): *</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value as any })}
                    className="w-full p-2 border border-stone-300 rounded-xl bg-white font-bold"
                  >
                    <option value="bendahara">Bendahara SPP</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Email Resmi: *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@insanharapan.sch.id"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
