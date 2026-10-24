/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SPPUnit = 'all' | 'rait' | 'sdit' | 'smpit';

export type UserRole =
  | 'admin'
  | 'bendahara'
  | 'super_admin'
  | 'admin_keuangan'
  | 'kepala_sekolah'
  | 'operator';

export interface SPPUser {
  id: string;
  nama: string;
  email: string;
  username: string;
  role: UserRole;
  roleName: string;
  unitAkses: SPPUnit; // 'all' for yayasan, or specific unit
  avatar?: string;
  telepon?: string;
  status: 'aktif' | 'nonaktif';
  terakhirLogin?: string;
}

export type StudentStatus = 'aktif' | 'pindah' | 'lulus' | 'nonaktif';

export type StudentGender = 'Laki-laki' | 'Perempuan';

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  namaLengkap: string;
  jenisKelamin: StudentGender;
  unit: 'rait' | 'sdit' | 'smpit';
  kelas: string;
  tahunAjaran: string;
  namaOrangTua: string;
  noWhatsapp: string;
  tarifSPP: number;
  beasiswaId?: string;
  namaBeasiswa?: string;
  potonganSPP: number; // in Rupiah
  tanggalMasuk: string;
  status: StudentStatus;
  catatan?: string;
  alamat?: string;
}

export type InvoiceStatus = 'belum_bayar' | 'sebagian' | 'lunas' | 'bebas' | 'terlambat';

export interface SPPInvoice {
  id: string;
  nomorTagihan: string;
  siswaId: string;
  namaSiswa: string;
  nis: string;
  unit: 'rait' | 'sdit' | 'smpit';
  kelas: string;
  bulan: number; // 1 - 12 (7 = Juli, 8 = Agustus, ... 6 = Juni)
  namaBulan: string; // e.g. "Oktober 2024"
  tahunAjaran: string; // e.g. "2024/2025"
  nominalAsli: number;
  potongan: number;
  totalTagihan: number; // nominalAsli - potongan
  terbayar: number;
  sisaTagihan: number;
  status: InvoiceStatus;
  jatuhTempo: string;
  tanggalDibuat: string;
}

export type PaymentMethod =
  | 'Tunai di Kasir'
  | 'Transfer Bank Syariah Indonesia (BSI)'
  | 'Transfer Bank Riau Kepri Syariah'
  | 'Transfer Bank Mandiri'
  | 'QRIS Yayasan Harapan Ibu';

export interface PaymentAllocation {
  tagihanId: string;
  namaBulan: string;
  nominal: number;
}

export interface SPPTransaction {
  id: string;
  nomorTransaksi: string;
  nomorKuitansi: string;
  siswaId: string;
  namaSiswa: string;
  nis: string;
  unit: 'rait' | 'sdit' | 'smpit';
  kelas: string;
  tanggalBayar: string;
  tagihanIds: string[];
  alokasi: PaymentAllocation[];
  totalBayar: number;
  metodePembayaran: PaymentMethod;
  nomorReferensi?: string;
  petugas: string;
  petugasId: string;
  catatan?: string;
  status: 'sukses' | 'dibatalkan';
  pembatalan?: {
    tanggal: string;
    alasan: string;
    diotorisasiOleh: string;
    catatan: string;
  };
}

export interface Scholarship {
  id: string;
  nama: string;
  tipe: 'penuh' | 'persentase' | 'nominal' | 'sementara';
  nilai: number; // 100 for penuh, 30 for 30%, 150000 for nominal
  keterangan: string;
  syarat: string;
  kuotaAktif: number;
  status: 'aktif' | 'nonaktif';
}

export interface ArrearsFollowUp {
  siswaId: string;
  tanggal: string;
  status: 'Belum Dihubungi' | 'Sudah Dikirim Pesan WA' | 'Janji Bayar' | 'Keringanan Diajukan';
  catatan?: string;
  petugas: string;
}

export interface AuditLog {
  id: string;
  waktu: string;
  aksi: string;
  pengguna: string;
  peran: string;
  detail: string;
  tipe: 'info' | 'transaksi' | 'koreksi' | 'sistem';
}

export interface SchoolClass {
  id: string;
  namaKelas: string;
  unit: 'rait' | 'sdit' | 'smpit';
  tahunAjaran: string;
  waliKelas?: string;
  kapasitas?: number;
}

export interface SystemSettings {
  tahunAjaranAktif: string;
  semesterAktif: 'Ganjil' | 'Genap';
  bulanBerjalan: number; // 1 - 12
  tahunBerjalan: number;
  tarifDefault: {
    rait: number;
    sdit: number;
    smpit: number;
  };
  jatuhTempoTanggal: number; // e.g. 10 of each month
  namaYayasan: string;
  namaSekolah: string;
  tagline?: string;
  alamatYayasan: string;
  kontakYayasan: string;
  emailYayasan: string;
  logoUrl?: string;
  kepalaYayasan: string;
  bendaharaYayasan: string;
  daftarKelas?: string[];
  daftarTahunAjaran?: string[];
  rekeningResmi: {
    bank: string;
    nomor: string;
    atasNama: string;
  }[];
}


export type SPPTab =
  | 'dashboard'
  | 'siswa'
  | 'tagihan'
  | 'transaksi'
  | 'kuitansi'
  | 'tunggakan'
  | 'laporan'
  | 'beasiswa'
  | 'pengaturan'
  | 'panduan';
