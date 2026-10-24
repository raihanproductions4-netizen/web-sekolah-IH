import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EducationalUnitType, PPDBRegistration } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  FileText,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Printer,
  ArrowRight,
  ShieldAlert,
  Send,
  UserCheck,
  Clock
} from 'lucide-react';

export const PPDBView: React.FC = () => {
  const {
    units,
    schedules,
    fees,
    selectedUnitId,
    setSelectedUnitId,
    submitPPDB,
    selectedReceipt,
    setSelectedReceipt,
    generateWhatsAppUrl,
    schoolProfile
  } = useApp();

  // Form states
  const [formData, setFormData] = useState({
    candidateName: '',
    unit: selectedUnitId as EducationalUnitType,
    academicYear: '2026/2027',
    parentName: '',
    parentWhatsapp: '',
    parentEmail: '',
    previousSchool: '',
    notes: '',
    agreedTerms: false
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeFAQIndex, setActiveFAQIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana proses seleksi dan observasi di SIT Insan Harapan Batam?",
      a: "Observasi calon santri tidak menggunakan tes akademis yang membebani. Untuk RAIT dan SDIT, tim psikolog dan asatidz melakukan pemetaan fitrah perkembangan, kesiapan motorik-sensorik, adab, dan kemandirian. Untuk SMPIT, diadakan wawancara motivasi, tes dasar baca Al-Qur'an (tahsin), dan pemetaan minat bakat."
    },
    {
      q: "Apakah anak yang belum lancar membaca huruf hijaiyah bisa diterima di SDIT?",
      a: "Bisa. Kami memahami setiap anak memiliki kecepatan fitrah yang berbeda. Di SDIT Insan Harapan tersedia program matrikulasi tahsin khusus pada awal semester untuk mendampingi ananda hingga lancar membaca Al-Qur'an dengan tartil."
    },
    {
      q: "Bagaimana pembagian waktu belajar (Full Day School) santri di sekolah?",
      a: "Kegiatan belajar dimulai pukul 07.15 WIB (sholat dhuha & dzikir pagi) hingga pukul 15.30 WIB (setelah shalat Ashar berjamaah). Waktu istirahat cukup panjang mencakup makan siang bergizi bersama beradab dan rehat terbimbing."
    },
    {
      q: "Apakah ada keringanan biaya bagi saudara kandung atau prestasi tahfiz?",
      a: "Ya! Yayasan Harapan Insan Madani Batam menyediakan program potongan Infaq Gedung sebesar 10% untuk anak kedua/ketiga yang mendaftar di tahun ajaran yang sama, serta beasiswa apresiasi bagi calon santri yang telah memiliki hafalan Al-Qur'an mutqin."
    },
    {
      q: "Apakah orang tua bisa melakukan survei kampus langsung sebelum mendaftar?",
      a: "Sangat dianjurkan. Kami membuka layanan Open House dan School Tour setiap hari kerja (Senin-Jumat pukul 08.00 - 15.00 WIB) dan hari Sabtu dengan konfirmasi terlebih dahulu melalui WhatsApp Humas."
    }
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.candidateName.trim()) {
      errors.candidateName = 'Nama lengkap calon siswa wajib diisi.';
    }
    if (!formData.parentName.trim()) {
      errors.parentName = 'Nama orang tua/wali wajib diisi.';
    }
    if (!formData.parentWhatsapp.trim()) {
      errors.parentWhatsapp = 'Nomor WhatsApp orang tua aktif wajib diisi.';
    } else if (formData.parentWhatsapp.replace(/[^0-9]/g, '').length < 9) {
      errors.parentWhatsapp = 'Nomor WhatsApp tidak valid (minimal 9 digit).';
    }
    if (!formData.agreedTerms) {
      errors.agreedTerms = 'Mohon setujui ketentuan data pendaftaran.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newReg = submitPPDB({
      candidateName: formData.candidateName,
      unit: formData.unit,
      academicYear: formData.academicYear,
      parentName: formData.parentName,
      parentWhatsapp: formData.parentWhatsapp,
      parentEmail: formData.parentEmail,
      previousSchool: formData.previousSchool,
      notes: formData.notes
    });

    // Reset fields
    setFormData({
      candidateName: '',
      unit: selectedUnitId,
      academicYear: '2026/2027',
      parentName: '',
      parentWhatsapp: '',
      parentEmail: '',
      previousSchool: '',
      notes: '',
      agreedTerms: false
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const generateWhatsAppForwardMessage = (receipt: PPDBRegistration) => {
    return `Assalamu'alaikum Panitia PPDB SIT Insan Harapan Batam,

Saya telah mengisi formulir pendaftaran santri baru secara online melalui website resmi dengan data berikut:

*No. Registrasi:* ${receipt.registrationNumber}
*Nama Calon Siswa:* ${receipt.candidateName}
*Pilihan Unit:* ${receipt.unit.toUpperCase()} Insan Harapan Batam
*Tahun Ajaran:* ${receipt.academicYear}
*Nama Orang Tua:* ${receipt.parentName}
*No. WhatsApp:* ${receipt.parentWhatsapp}
*Asal Sekolah:* ${receipt.previousSchool || '-'}
*Catatan:* ${receipt.notes || '-'}
*Waktu Daftar:* ${receipt.submittedAt}

Mohon konfirmasi tahapan observasi dan panduan pendaftaran selanjutnya. Terima kasih.
Wassalamu'alaikum Wr. Wb.`;
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Banner PPDB Utama in Fresh Green and Orange */}
        <div className="bg-gradient-to-br from-emerald-800 via-green-700 to-teal-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GELOMBANG I TELAH RESMI DIBUKA</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight text-white">
              Penerimaan Peserta Didik Baru (PPDB) <span className="text-orange-300">T.A. 2026/2027</span>
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed mb-6">
              Mari bermitra dalam mendidik buah hati tercinta menjadi generasi berakhlak Qurani, mencintai sains alam, dan berjiwa kepemimpinan madani di <strong>SIT Insan Harapan Batam</strong> (RAIT, SDIT, SMPIT).
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-100">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-300" />
                <span>Pendaftaran Online 24 Jam</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Observasi Ramah Anak</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-orange-300" />
                <span>Keringanan Biaya Bersaudara</span>
              </span>
            </div>
          </div>
        </div>

        {/* Alur Pendaftaran (5 Langkah Berurutan) */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 block mb-1">
              Panduan Praktis
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              5 Tahapan Alur Pendaftaran Santri Baru
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {[
              { step: "01", title: "Isi Formulir Online", desc: "Lengkapi data calon santri pada form di bawah atau via admin WhatsApp." },
              { step: "02", title: "Observasi & Pemetaan", desc: "Ananda diundang untuk pemetaan fitrah belajar & wawancara orang tua." },
              { step: "03", title: "Pengumuman Hasil", desc: "Hasil seleksi diterbitkan resmi maksimal 3 hari kerja setelah observasi." },
              { step: "04", title: "Daftar Ulang & Infaq", desc: "Penyelesaian administrasi biaya masuk, pengukuran seragam, & buku." },
              { step: "05", title: "MPLS & Masuk Kelas", desc: "Masa Pengenalan Lingkungan Sekolah dengan gembira dan beradab." }
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-2xl font-extrabold text-emerald-700 block mb-2">
                    {step.step}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 mb-1 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-stone-600 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Persyaratan Pendaftaran per Unit */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* RAIT */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Usia Dini (4 - 6 Tahun)
              </span>
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Syarat Masuk RAIT (TK IT)
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Berusia minimal 4 tahun untuk kelompok A (per Juli 2026)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi Akta Kelahiran dan Kartu Keluarga (2 lembar)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pas foto berwarna ukuran 3x4 (3 lembar)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mengikuti sesi observasi kematangan sensorik gembira</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SDIT */}
          <div className="bg-white p-7 rounded-3xl border-2 border-emerald-600 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 left-6 px-3 py-0.5 bg-emerald-600 text-white text-[11px] font-bold rounded-full">
              Pilihan Favorit
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Sekolah Dasar (Kelas 1)
              </span>
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Syarat Masuk SDIT
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Berusia minimal 6 tahun per 1 Juli 2026 (prioritas 7 tahun)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Ijazah / Surat Keterangan Lulus dari TK/PAUD (bila ada)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi Akta Kelahiran, KK, & KTP Orang Tua</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mengikuti pemetaan fitrah belajar & wawancara orang tua</span>
                </li>
              </ul>
            </div>
          </div>

          {/* SMPIT */}
          <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                Sekolah Menengah (Kelas 7)
              </span>
              <h3 className="text-xl font-bold text-stone-900 mb-4">
                Syarat Masuk SMPIT
              </h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Lulusan SD/MI sederajat dengan SKL/Ijazah resmi</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Fotokopi Rapor kelas 4, 5, dan 6 (semester 1)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Sertifikat piagam hafalan Al-Qur'an / prestasi (jika ada)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mengikuti wawancara motivasi belajar & tes tahsin dasar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Jadwal Pendaftaran & Biaya */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Jadwal Gelombang */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold text-stone-900">
                Jadwal Pendaftaran T.A. 2026/2027
              </h3>
            </div>

            <div className="space-y-4">
              {schedules.map((sch, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    sch.status === 'Dibuka'
                      ? 'border-emerald-400 bg-emerald-50/50'
                      : 'border-stone-200 bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900">
                      {sch.wave}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        sch.status === 'Dibuka'
                          ? 'bg-emerald-700 text-white'
                          : sch.status === 'Segera Dibuka'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {sch.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-700"><strong>Periode:</strong> {sch.registrationPeriod}</p>
                  <p className="text-xs text-stone-600 mt-1"><strong>Observasi:</strong> {sch.observationDate}</p>
                  <p className="text-xs text-stone-600 mt-0.5"><strong>Pengumuman:</strong> {sch.announcementDate}</p>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-stone-500 italic">
              *Jadwal dapat diperbarui pihak sekolah melalui panel administrator.
            </p>
          </div>

          {/* Rincian Estimasi Biaya */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-bold text-stone-900">
                  Estimasi Biaya Masuk & SPP Pendidikan
                </h3>
              </div>
              <span className="text-[11px] text-stone-500">Transparan & Terjangkau</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-stone-200 rounded-xl overflow-hidden">
                <thead className="bg-stone-100 text-stone-700 font-semibold">
                  <tr>
                    <th className="p-3">Jenjang</th>
                    <th className="p-3">Formulir</th>
                    <th className="p-3">Infaq Gedung</th>
                    <th className="p-3">Seragam & Buku</th>
                    <th className="p-3">SPP Bulanan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {fees.map((fee, idx) => (
                    <tr key={idx} className="hover:bg-emerald-50/40">
                      <td className="p-3 font-bold text-emerald-900">{fee.unitName}</td>
                      <td className="p-3 font-mono tabular-nums">{formatRupiah(fee.formFee)}</td>
                      <td className="p-3 font-mono tabular-nums">{formatRupiah(fee.infaqGedung)}</td>
                      <td className="p-3 font-mono tabular-nums">{formatRupiah(fee.activitiesAndUniform)}</td>
                      <td className="p-3 font-mono tabular-nums font-semibold text-emerald-800">{formatRupiah(fee.monthlySPP)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Catatan Resmi Biaya:</span>
              </div>
              <p>
                Infaq Gedung hanya dibayarkan 1 kali selama masa studi di unit bersangkutan. Tersedia kemudahan pembayaran bertahap (cicilan 3 kali) hingga menjelang awal tahun ajaran baru.
              </p>
            </div>
          </div>
        </div>

        {/* FORMULIR PENDAFTARAN ONLINE RESMI with Green & Orange Accent */}
        <div id="formulir-pendaftaran" className="bg-white rounded-3xl border-2 border-emerald-500 p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-500 to-orange-500" />
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>FORMULIR PENDAFTARAN RESMI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Formulir Pendaftaran Santri Baru Online
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Silakan isi biodata awal calon santri dan wali. Setelah formulir dikirim, Anda dapat langsung mencetak bukti registrasi serta meneruskannya ke WhatsApp Panitia PPDB.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Unit Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Pilihan Unit Pendidikan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value as EducationalUnitType })}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                >
                  <option value="rait">RAIT (PAUD & TK Islam Terpadu)</option>
                  <option value="sdit">SDIT (Sekolah Dasar Islam Terpadu)</option>
                  <option value="smpit">SMPIT (Sekolah Menengah Pertama IT)</option>
                </select>
              </div>

              {/* Tahun Ajaran */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={formData.academicYear}
                  readOnly
                  className="w-full text-xs px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-mono"
                />
              </div>

              {/* Nama Calon Siswa */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Lengkap Calon Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Al-Fatih Pratama"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                  className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
                    formErrors.candidateName ? 'border-red-500 bg-red-50/50' : 'border-stone-300'
                  }`}
                />
                {formErrors.candidateName && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.candidateName}</p>
                )}
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nama Orang Tua / Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama Ayah atau Bunda"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
                    formErrors.parentName ? 'border-red-500 bg-red-50/50' : 'border-stone-300'
                  }`}
                />
                {formErrors.parentName && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.parentName}</p>
                )}
              </div>

              {/* WhatsApp Orang Tua */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081270001928"
                  value={formData.parentWhatsapp}
                  onChange={(e) => setFormData({ ...formData, parentWhatsapp: e.target.value })}
                  className={`w-full text-xs px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none ${
                    formErrors.parentWhatsapp ? 'border-red-500 bg-red-50/50' : 'border-stone-300'
                  }`}
                />
                {formErrors.parentWhatsapp && (
                  <p className="text-[11px] text-red-500 mt-1">{formErrors.parentWhatsapp}</p>
                )}
              </div>

              {/* Asal Sekolah */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Asal Sekolah Sebelumnya (Bila ada)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: TK Islam Batam Center"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Email Orang Tua (Opsional) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="ayahbunda@gmail.com"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Catatan Khusus */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Catatan Tambahan (Kesehatan anak, minat khusus, atau riwayat tahfiz)
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Ananda sudah menghafal Surat An-Naba s.d An-Nas, alergi kacang, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Checkbox Persetujuan */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreedTerms}
                  onChange={(e) => setFormData({ ...formData, agreedTerms: e.target.checked })}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="leading-relaxed">
                  Saya menyatakan bahwa data yang diisi adalah benar, bersedia mengikuti proses observasi/tahsin, dan menyetujui kebijakan perlindungan data santri SIT Insan Harapan Batam.
                </span>
              </label>
              {formErrors.agreedTerms && (
                <p className="text-[11px] text-red-500 mt-1">{formErrors.agreedTerms}</p>
              )}
            </div>

            {/* Tombol Submit in Energetic Orange */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-orange-500/30 flex items-center justify-center gap-2 border border-orange-400/40"
              >
                <Send className="w-4 h-4 text-emerald-100" />
                <span>Kirim Formulir Pendaftaran PPDB</span>
              </button>

              <span className="text-xs text-stone-500">
                Pendaftaran juga dapat dikonsultasikan via WhatsApp: <strong className="text-emerald-700">+{schoolProfile.whatsappPPDB}</strong>
              </span>
            </div>
          </form>
        </div>

        {/* MODAL KARTU BUKTI PENDAFTARAN SUKSES (RECEIPT) */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900">
                      Pendaftaran Online Berhasil!
                    </h3>
                    <p className="text-xs text-stone-500">SIT Insan Harapan Batam</p>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md border border-emerald-200">
                  {selectedReceipt.registrationNumber}
                </span>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Nama Calon Siswa:</span>
                  <span className="font-bold text-stone-900">{selectedReceipt.candidateName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Unit Pendidikan:</span>
                  <span className="font-bold text-emerald-800">{selectedReceipt.unit.toUpperCase()} Insan Harapan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tahun Ajaran:</span>
                  <span className="text-stone-800">{selectedReceipt.academicYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Orang Tua / Wali:</span>
                  <span className="text-stone-800">{selectedReceipt.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">No. WhatsApp:</span>
                  <span className="font-mono text-stone-800">{selectedReceipt.parentWhatsapp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Waktu Submit:</span>
                  <span className="text-stone-800">{selectedReceipt.submittedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status Data:</span>
                  <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                    {selectedReceipt.status}
                  </span>
                </div>
              </div>

              {/* Forward to WhatsApp Action Button */}
              <div className="space-y-3 pt-2">
                <a
                  href={generateWhatsAppUrl(generateWhatsAppForwardMessage(selectedReceipt))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
                  <span>Kirim & Teruskan Data ke WhatsApp Panitia PPDB</span>
                </a>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Bukti Pendaftaran</span>
                  </button>

                  <button
                    onClick={() => setSelectedReceipt(null)}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Akordeon Interaktif */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Tanya Jawab Seputar Pendaftaran</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isExpanded = activeFAQIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-stone-200 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFAQIndex(isExpanded ? null : idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 bg-stone-50/60 hover:bg-emerald-50/40 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-stone-900">
                      {faq.q}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 pt-2 text-xs sm:text-sm text-stone-600 leading-relaxed bg-white border-t border-stone-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
