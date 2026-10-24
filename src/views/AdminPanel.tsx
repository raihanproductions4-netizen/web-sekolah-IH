import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NewsArticle, GalleryItem, PPDBRegistration, EducationalUnitType } from '../types';
import {
  Lock,
  Unlock,
  Users,
  Newspaper,
  Image as ImageIcon,
  Settings,
  Plus,
  Trash2,
  Edit,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  LogOut,
  Save,
  Search,
  ExternalLink,
  PhoneCall
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    registrations,
    updateRegistrationStatus,
    deleteRegistration,
    news,
    addNewsArticle,
    deleteNewsArticle,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    schoolProfile,
    updateSchoolProfile,
    resetAllDataToDefault,
    showToast
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'ppdb' | 'news' | 'gallery' | 'settings'>('ppdb');

  // Search in PPDB
  const [ppdbFilterUnit, setPpdbFilterUnit] = useState<string>('all');
  const [ppdbSearch, setPpdbSearch] = useState('');

  // Add News Form State
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    category: 'Kegiatan Sekolah' as NewsArticle['category'],
    author: 'Tim Humas SIT Insan Harapan',
    excerpt: '',
    contentParagraphs: '',
    image: '/src/assets/images/hero_school_campus_1792641892359.jpg',
    readTime: '3 menit baca'
  });

  // Add Gallery Form State
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    category: 'Pembelajaran' as GalleryItem['category'],
    mediaUrl: '/src/assets/images/sdit_nature_learning_1792641893015.jpg',
    date: 'Oktober 2026',
    description: ''
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: schoolProfile.name,
    foundationName: schoolProfile.foundationName,
    whatsappPPDB: schoolProfile.whatsappPPDB,
    phone: schoolProfile.phone,
    email: schoolProfile.email,
    address: schoolProfile.address,
    city: schoolProfile.city,
    headmasterName: schoolProfile.headmasterName,
    headmasterTitle: schoolProfile.headmasterTitle,
    headmasterWelcome: schoolProfile.headmasterWelcome
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminLogin(pinInput);
  };

  const handleExportCSV = () => {
    const headers = ['No Registrasi', 'Nama Calon Siswa', 'Unit', 'Tahun Ajaran', 'Nama Orang Tua', 'No WhatsApp', 'Asal Sekolah', 'Status', 'Waktu'];
    const rows = registrations.map((r) => [
      r.registrationNumber,
      `"${r.candidateName}"`,
      r.unit.toUpperCase(),
      r.academicYear,
      `"${r.parentName}"`,
      r.parentWhatsapp,
      `"${r.previousSchool || '-'}"`,
      r.status,
      `"${r.submittedAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_pendaftar_ppdb_insan_harapan_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data calon santri berhasil diekspor ke format CSV!', 'success');
  };

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.excerpt.trim()) {
      showToast('Judul dan ringkasan berita wajib diisi', 'error');
      return;
    }

    const paragraphs = newArticle.contentParagraphs
      ? newArticle.contentParagraphs.split('\n\n').filter((p) => p.trim())
      : [newArticle.excerpt];

    addNewsArticle({
      title: newArticle.title,
      category: newArticle.category,
      author: newArticle.author,
      excerpt: newArticle.excerpt,
      content: paragraphs,
      image: newArticle.image,
      readTime: newArticle.readTime
    });

    setShowAddNewsModal(false);
    setNewArticle({
      title: '',
      category: 'Kegiatan Sekolah',
      author: 'Tim Humas SIT Insan Harapan',
      excerpt: '',
      contentParagraphs: '',
      image: '/src/assets/images/hero_school_campus_1792641892359.jpg',
      readTime: '3 menit baca'
    });
  };

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.title.trim() || !newGallery.description.trim()) {
      showToast('Judul dan deskripsi foto wajib diisi', 'error');
      return;
    }

    addGalleryItem({
      title: newGallery.title,
      category: newGallery.category,
      type: 'photo',
      mediaUrl: newGallery.mediaUrl,
      date: newGallery.date,
      description: newGallery.description
    });

    setShowAddGalleryModal(false);
    setNewGallery({
      title: '',
      category: 'Pembelajaran',
      mediaUrl: '/src/assets/images/sdit_nature_learning_1792641893015.jpg',
      date: 'Oktober 2026',
      description: ''
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(settingsForm);
  };

  // If not logged in, render authentication gate
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-stone-50 min-h-screen py-20 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-stone-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900">
              Portal Administrator CMS
            </h2>
            <p className="text-xs text-stone-600">
              Masuk untuk mengelola data pendaftar PPDB, berita sekolah, galeri, dan kontak resmi.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                PIN Keamanan Administrator
              </label>
              <input
                type="password"
                placeholder="Masukkan PIN (Demo: 123456)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center text-sm tracking-widest px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Petunjuk Demo:</strong> Gunakan PIN bawaan: <code>123456</code> untuk mengakses panel admin.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Unlock className="w-4 h-4" />
              <span>Masuk ke Panel CMS</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesUnit = ppdbFilterUnit === 'all' || r.unit === ppdbFilterUnit;
    const matchesQuery =
      r.candidateName.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
      r.registrationNumber.toLowerCase().includes(ppdbSearch.toLowerCase()) ||
      r.parentName.toLowerCase().includes(ppdbSearch.toLowerCase());
    return matchesUnit && matchesQuery;
  });

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Control Bar */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h1 className="text-xl font-bold text-stone-900">
                Panel Manajemen Administrator (CMS)
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Kelola data konten dan penerimaan santri baru SIT Insan Harapan Batam
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={adminLogout}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation for Admin */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('ppdb')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'ppdb'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pendaftar PPDB ({registrations.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('news')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'news'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>Berita & Pengumuman ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'gallery'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Galeri Dokumentasi ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeAdminTab === 'settings'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Sekolah & Kontak</span>
          </button>
        </div>

        {/* TAB 1: PPDB REGISTRATIONS */}
        {activeAdminTab === 'ppdb' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Data Masuk Calon Santri Baru PPDB
                </h3>
                <p className="text-xs text-stone-500">
                  Total {registrations.length} pendaftar tercatat di sistem
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Ekspor CSV</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama atau no registrasi..."
                  value={ppdbSearch}
                  onChange={(e) => setPpdbSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={ppdbFilterUnit}
                  onChange={(e) => setPpdbFilterUnit(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="all">Semua Unit (RAIT, SDIT, SMPIT)</option>
                  <option value="rait">Hanya RAIT</option>
                  <option value="sdit">Hanya SDIT</option>
                  <option value="smpit">Hanya SMPIT</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-700 font-semibold">
                  <tr>
                    <th className="p-3">No. Reg</th>
                    <th className="p-3">Nama Santri</th>
                    <th className="p-3">Unit</th>
                    <th className="p-3">Orang Tua</th>
                    <th className="p-3">No. WhatsApp</th>
                    <th className="p-3">Asal Sekolah</th>
                    <th className="p-3">Waktu Daftar</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-emerald-800">{reg.registrationNumber}</td>
                      <td className="p-3 font-semibold text-stone-900">{reg.candidateName}</td>
                      <td className="p-3">
                        <span className="font-semibold uppercase text-stone-700">{reg.unit}</span>
                      </td>
                      <td className="p-3">{reg.parentName}</td>
                      <td className="p-3 font-mono">
                        <a
                          href={`https://wa.me/${reg.parentWhatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <span>{reg.parentWhatsapp}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="p-3 text-stone-500">{reg.previousSchool || '-'}</td>
                      <td className="p-3 text-stone-400">{reg.submittedAt}</td>
                      <td className="p-3">
                        <select
                          value={reg.status}
                          onChange={(e) => updateRegistrationStatus(reg.id, e.target.value as any)}
                          className="text-xs px-2 py-1 rounded-md border border-stone-300 font-medium bg-white focus:outline-none"
                        >
                          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                          <option value="Terverifikasi">Terverifikasi</option>
                          <option value="Lulus Seleksi">Lulus Seleksi</option>
                          <option value="Cadangan">Cadangan</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteRegistration(reg.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100 transition-colors"
                          title="Hapus pendaftar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-stone-400 text-xs">
                        Tidak ada pendaftar yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: NEWS MANAGEMENT */}
        {activeAdminTab === 'news' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Manajemen Artikel & Pengumuman
                </h3>
                <p className="text-xs text-stone-500">
                  Tambah warta prestasi, agenda akbar, dan pengumuman sekolah
                </p>
              </div>

              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Berita Baru</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-stone-200 flex items-start justify-between gap-4 bg-stone-50/50"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <span className="text-[11px] text-stone-400 block pt-1">
                      Dipublikasikan: {item.date} · Oleh {item.author}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteNewsArticle(item.id)}
                    className="p-2 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-200 transition-colors shrink-0"
                    title="Hapus berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Modal Tambah Berita */}
            {showAddNewsModal && (
              <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-stone-900">
                    Publikasi Berita / Pengumuman Baru
                  </h3>

                  <form onSubmit={handleSaveNews} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Judul Berita <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Siswa SDIT Juara 1 Olimpiade Sains Batam"
                        value={newArticle.title}
                        onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Kategori
                        </label>
                        <select
                          value={newArticle.category}
                          onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value as any })}
                          className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                        >
                          <option value="Kegiatan Sekolah">Kegiatan Sekolah</option>
                          <option value="Prestasi Siswa">Prestasi Siswa</option>
                          <option value="Info Akademik">Info Akademik</option>
                          <option value="Keislaman">Keislaman</option>
                          <option value="Sosial">Sosial</option>
                          <option value="Pengumuman">Pengumuman</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Penulis
                        </label>
                        <input
                          type="text"
                          value={newArticle.author}
                          onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                          className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Ringkasan / Cuplikan Singkat <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Ringkasan 1-2 kalimat untuk kartu depan warta..."
                        value={newArticle.excerpt}
                        onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Isi Berita Lengkap (Pisahkan paragraf dengan baris baru)
                      </label>
                      <textarea
                        rows={5}
                        placeholder="Tuliskan berita lengkap di sini..."
                        value={newArticle.contentParagraphs}
                        onChange={(e) => setNewArticle({ ...newArticle, contentParagraphs: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddNewsModal(false)}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                      >
                        Terbitkan Berita
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GALLERY MANAGEMENT */}
        {activeAdminTab === 'gallery' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Manajemen Galeri Dokumentasi Siswa
                </h3>
                <p className="text-xs text-stone-500">
                  Dokumentasi visual foto dan kegiatan belajar
                </p>
              </div>

              <button
                onClick={() => setShowAddGalleryModal(true)}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Foto Kegiatan</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 flex flex-col justify-between"
                >
                  <div>
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">
                        {item.category} · {item.date}
                      </span>
                      <h4 className="font-bold text-xs text-stone-900">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="p-3 pt-0 flex justify-end">
                    <button
                      onClick={() => deleteGalleryItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Tambah Galeri */}
            {showAddGalleryModal && (
              <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4">
                  <h3 className="text-lg font-bold text-stone-900">
                    Tambah Foto Dokumentasi Baru
                  </h3>

                  <form onSubmit={handleSaveGallery} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Judul Kegiatan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Panen Sayur Hidroponik Santri SDIT"
                        value={newGallery.title}
                        onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Kategori
                      </label>
                      <select
                        value={newGallery.category}
                        onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value as any })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                      >
                        <option value="Pembelajaran">Pembelajaran</option>
                        <option value="Tahfiz & Ibadah">Tahfiz & Ibadah</option>
                        <option value="Alam & Lingkungan">Alam & Lingkungan</option>
                        <option value="Outing Class">Outing Class</option>
                        <option value="Sosial & Kemanusiaan">Sosial & Kemanusiaan</option>
                        <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                        <option value="Prestasi">Prestasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Deskripsi Foto <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Keterangan singkat momen foto..."
                        value={newGallery.description}
                        onChange={(e) => setNewGallery({ ...newGallery, description: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddGalleryModal(false)}
                        className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold"
                      >
                        Simpan Dokumentasi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Pengaturan Kontak, WhatsApp & Identitas Sekolah
              </h3>
              <p className="text-xs text-stone-500">
                Perbarui nomor kontak resmi panitia PPDB, alamat, dan sambutan pimpinan sekolah tanpa mengedit kode
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Lembaga Resmi
                  </label>
                  <input
                    type="text"
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Yayasan Pengelola
                  </label>
                  <input
                    type="text"
                    value={settingsForm.foundationName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, foundationName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor WhatsApp Resmi PPDB (Format: 628...)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappPPDB}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPPDB: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nomor Telepon Kantor
                  </label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alamat Email Resmi
                  </label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Alamat Fisik Kampus Batam
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Pimpinan Lembaga
                  </label>
                  <input
                    type="text"
                    value={settingsForm.headmasterName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headmasterName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Jabatan Pimpinan
                  </label>
                  <input
                    type="text"
                    value={settingsForm.headmasterTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, headmasterTitle: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sambutan Pimpinan Lembaga (Akan tampil di halaman Profil)
                </label>
                <textarea
                  rows={3}
                  value={settingsForm.headmasterWelcome}
                  onChange={(e) => setSettingsForm({ ...settingsForm, headmasterWelcome: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Pengaturan</span>
                </button>

                <button
                  type="button"
                  onClick={resetAllDataToDefault}
                  className="px-4 py-2.5 text-stone-500 hover:text-red-600 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Kembalikan Standar Awal Pabrik</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
