/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Key,
  Database,
  Globe,
  CheckCircle,
  HelpCircle,
  Shield,
  CreditCard,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react';

export const SPPGuidelinesView: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Panduan Operasional & Dokumentasi Sistem</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Dokumentasi Resmi v2.4
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Petunjuk penggunaan harian, alur SOP kasir, panduan akun admin pertama, backup/restore data, dan panduan deployment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Panduan 1: Alur Kerja Harian Kasir */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">1. Alur Operasional Pencatatan Kasir</h3>
              <p className="text-stone-500 text-[11px]">SOP penerimaan kas & kuitansi resmi</p>
            </div>
          </div>

          <ol className="space-y-2.5 list-decimal list-inside leading-relaxed text-stone-600">
            <li>
              Buka menu <strong>"Kasir & Transaksi"</strong> di bilah navigasi sebelah kiri.
            </li>
            <li>
              Ketik nama siswa atau NIS pada kolom pencarian dan pilih nama siswa yang sesuai.
            </li>
            <li>
              Sistem akan menampilkan seluruh tagihan SPP tertunggak siswa tersebut. Centang bulan yang ingin dibayarkan (mendukung bayar 1 bulan, beberapa bulan sekaligus, atau cicilan nominal sebagian).
            </li>
            <li>
              Pilih metode pembayaran (Tunai, Transfer BSI, Bank Riau Kepri Syariah, dsb.) dan masukkan nomor referensi bank jika non-tunai.
            </li>
            <li>
              Tekan tombol <strong>"Simpan & Terbitkan Kuitansi"</strong>. Jendela cetak kuitansi resmi ber-kop yayasan akan langsung terbuka.
            </li>
          </ol>
        </div>

        {/* Panduan 2: Akun Admin Pertama & Role */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">2. Panduan Akun Admin Pertama</h3>
              <p className="text-stone-500 text-[11px]">Konfigurasi pengguna awal & hak akses</p>
            </div>
          </div>

          <div className="space-y-2 leading-relaxed">
            <p>
              Sistem telah menyediakan 4 profil default siap pakai untuk simulasi hak akses:
            </p>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-1.5 font-mono text-[11px]">
              <div><strong>Super Admin:</strong> admin.yayasan@insanharapan.sch.id (Akses semua unit)</div>
              <div><strong>Admin Keuangan:</strong> keuangan.sdit@insanharapan.sch.id (Akses SDIT)</div>
              <div><strong>Kepala Sekolah:</strong> kepsek.sdit@insanharapan.sch.id (Executive monitoring)</div>
              <div><strong>Operator Kasir:</strong> kasir@insanharapan.sch.id (Pencatatan kasir)</div>
            </div>
            <p className="text-[11px] text-stone-500">
              Anda dapat beralih profil dengan mengklik menu profil di pojok kanan atas layar sewaktu-waktu untuk menguji izin masing-masing peran.
            </p>
          </div>
        </div>

        {/* Panduan 3: Pembentukan Tagihan Bulanan Massal */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">3. Siklus Pembentukan Tagihan Massal</h3>
              <p className="text-stone-500 text-[11px]">Setiap awal bulan kalender akademik</p>
            </div>
          </div>

          <div className="space-y-2 leading-relaxed">
            <p>
              Pada setiap awal bulan baru (atau menjelang semester dimulai):
            </p>
            <ol className="space-y-1.5 list-decimal list-inside text-stone-600">
              <li>Masuk ke menu <strong>"Tagihan SPP Bulanan"</strong>.</li>
              <li>Klik tombol <strong>"Generate Tagihan Massal"</strong>.</li>
              <li>Pilih bulan yang ingin ditagihkan dan target unit.</li>
              <li>
                Sistem akan memvalidasi seluruh siswa aktif, menghitung diskon beasiswa yang dimiliki, dan membentuk nomor tagihan unik secara otomatis.
              </li>
              <li>
                <em>Sistem dilengkapi pencegahan duplikasi:</em> siswa yang sudah memiliki tagihan pada bulan dan tahun ajaran yang sama tidak akan dibuat ganda.
              </li>
            </ol>
          </div>
        </div>

        {/* Panduan 4: Backup, Pemulihan, & Deployment */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 text-xs text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">4. Petunjuk Backup & Deploy Online</h3>
              <p className="text-stone-500 text-[11px]">Keamanan data & akses daring</p>
            </div>
          </div>

          <div className="space-y-2.5 leading-relaxed">
            <div>
              <strong className="text-stone-800 block">Backup Rutin:</strong>
              <p className="text-stone-500 text-[11px]">
                Disarankan melakukan pengunduhan cadangan data di menu <strong>"Pengaturan &gt; Backup"</strong> setiap akhir pekan untuk menjamin keamanan arsip keuangan yayasan.
              </p>
            </div>
            <div>
              <strong className="text-stone-800 block">Panduan Deploy Daring:</strong>
              <p className="text-stone-500 text-[11px]">
                Aplikasi ini dibangun menggunakan React 19 + TypeScript + Vite. Untuk men-deploy secara publik:
              </p>
              <div className="bg-stone-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[10px] mt-1">
                npm run build<br />
                # Folder dist/ siap di-hosting ke Vercel, Netlify, Cloud Run, atau server yayasan.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
