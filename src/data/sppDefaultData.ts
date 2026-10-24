import {
  UserAccount,
  Student,
  Scholarship,
  SppBill,
  SppTransaction,
  AuditLog,
  SystemSettings,
  FollowUpRecord
} from '../types';

export const defaultSettings: SystemSettings = {
  foundationName: 'Yayasan Harapan Ibu Kepri',
  schoolName: 'SIT Insan Harapan Batam',
  address: 'Komp. Tiban Indah Permai Blok D No. 12-15, Tiban Indah, Kec. Sekupang, Kota Batam, Kepulauan Riau 29425',
  phone: '(0778) 465892 / 0811-7000-829',
  email: 'keuangan@insanharapan-batam.sch.id',
  officialBankAccount: 'Bank Syariah Indonesia (BSI) Rek. 7123-8899-01 a.n. Yayasan Harapan Ibu Kepri',
  currentAcademicYear: '2026/2027',
  currentSemester: 'Ganjil',
  dueDayOfMonth: 10,
  defaultRates: {
    rait: 350000,
    sdit: 450000,
    smpit: 550000
  }
};

export const defaultUsers: UserAccount[] = [
  {
    id: 'usr-1',
    username: 'superadmin',
    fullName: 'H. Ahmad Fauzi, S.E.',
    email: 'ahmad.fauzi@harapanibu-kepri.org',
    role: 'super_admin',
    unitAccess: 'all',
    isActive: true,
    lastLoginAt: '2026-10-21 08:30',
    password: 'admin123'
  },
  {
    id: 'usr-2',
    username: 'admin_sdit',
    fullName: 'Ustadzah Maryam, S.Pd.',
    email: 'maryam.keuangan@insanharapan-batam.sch.id',
    role: 'admin_keuangan',
    unitAccess: 'sdit',
    isActive: true,
    lastLoginAt: '2026-10-21 09:15',
    password: 'sdit123'
  },
  {
    id: 'usr-3',
    username: 'admin_smpit',
    fullName: 'Ustadz Hendra Pratama, S.E.',
    email: 'hendra.keuangan@insanharapan-batam.sch.id',
    role: 'admin_keuangan',
    unitAccess: 'smpit',
    isActive: true,
    lastLoginAt: '2026-10-20 14:10',
    password: 'smpit123'
  },
  {
    id: 'usr-4',
    username: 'kepsek',
    fullName: 'Drs. H. Muhammad Ilyas, M.Pd.',
    email: 'ilyas.kepsek@insanharapan-batam.sch.id',
    role: 'kepala_sekolah',
    unitAccess: 'all',
    isActive: true,
    lastLoginAt: '2026-10-21 10:00',
    password: 'kepsek123'
  },
  {
    id: 'usr-5',
    username: 'kasir_rait',
    fullName: 'Siti Khadijah, A.Md.',
    email: 'siti.kasir@insanharapan-batam.sch.id',
    role: 'petugas',
    unitAccess: 'rait',
    isActive: true,
    lastLoginAt: '2026-10-21 07:55',
    password: 'kasir123'
  }
];

export const defaultStudents: Student[] = [
  // RAIT
  {
    id: 'stu-rait-01',
    nis: '2026001',
    nisn: '0019283741',
    fullName: 'Muhammad Al Fatih',
    unit: 'rait',
    classLevel: 'RA-A (Abu Bakar)',
    academicYear: '2026/2027',
    parentName: 'Rudi Hartono, S.T.',
    parentWhatsapp: '081270112233',
    monthlySppRate: 350000,
    enrollmentDate: '2026-07-10',
    status: 'aktif',
    notes: 'Anak sulung',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-rait-02',
    nis: '2026002',
    nisn: '0019283742',
    fullName: 'Aisha Humaira Batubara',
    unit: 'rait',
    classLevel: 'RA-A (Abu Bakar)',
    academicYear: '2026/2027',
    parentName: 'H. Dedi Batubara',
    parentWhatsapp: '081364556677',
    monthlySppRate: 350000,
    enrollmentDate: '2026-07-10',
    status: 'aktif',
    notes: '',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-rait-03',
    nis: '2026003',
    nisn: '0019283743',
    fullName: 'Rayyan Malik Ibrahim',
    unit: 'rait',
    classLevel: 'RA-B (Umar bin Khattab)',
    academicYear: '2026/2027',
    parentName: 'Ir. Irfan Saputra',
    parentWhatsapp: '082178990011',
    monthlySppRate: 350000,
    enrollmentDate: '2026-07-10',
    status: 'aktif',
    notes: 'Jemputan pribadi',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-rait-04',
    nis: '2026004',
    nisn: '0019283744',
    fullName: 'Ibrahim Khaleel',
    unit: 'rait',
    classLevel: 'RA-B (Umar bin Khattab)',
    academicYear: '2026/2027',
    parentName: 'Bambang Supriyadi',
    parentWhatsapp: '081987654321',
    monthlySppRate: 350000,
    scholarshipId: 'sch-04',
    enrollmentDate: '2026-07-10',
    status: 'aktif',
    notes: 'Mendapat keringanan ekonomi sementara Rp 100.000',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-rait-05',
    nis: '2026005',
    nisn: '0019283745',
    fullName: 'Safiyya Nur Khalisa',
    unit: 'rait',
    classLevel: 'RA-B (Umar bin Khattab)',
    academicYear: '2026/2027',
    parentName: 'dr. Hendri Pratama',
    parentWhatsapp: '081277665544',
    monthlySppRate: 350000,
    enrollmentDate: '2026-07-10',
    status: 'aktif',
    notes: '',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },

  // SDIT
  {
    id: 'stu-sdit-01',
    nis: '2024101',
    nisn: '0034567891',
    fullName: 'Zaid bin Tsabit',
    unit: 'sdit',
    classLevel: 'Kelas 1-A (Madinah)',
    academicYear: '2026/2027',
    parentName: 'Drs. Usman Hakim',
    parentWhatsapp: '081270889900',
    monthlySppRate: 450000,
    enrollmentDate: '2026-07-12',
    status: 'aktif',
    notes: 'Pemenang Lomba Tahfiz Cilik',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-02',
    nis: '2024102',
    nisn: '0034567892',
    fullName: 'Fatimah Azzahra Tanjung',
    unit: 'sdit',
    classLevel: 'Kelas 1-A (Madinah)',
    academicYear: '2026/2027',
    parentName: 'H. M. Tanjung',
    parentWhatsapp: '081399887766',
    monthlySppRate: 450000,
    enrollmentDate: '2026-07-12',
    status: 'aktif',
    notes: '',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-03',
    nis: '2024103',
    nisn: '0034567893',
    fullName: 'Bilal Al-Habasyi Siregar',
    unit: 'sdit',
    classLevel: 'Kelas 2-A (Makkah)',
    academicYear: '2026/2027',
    parentName: 'Ustadz Ahmad Siregar, S.Pd.I',
    parentWhatsapp: '082266554433',
    monthlySppRate: 450000,
    scholarshipId: 'sch-01',
    enrollmentDate: '2025-07-10',
    status: 'aktif',
    notes: 'Putra guru SIT Insan Harapan - Diskon 50%',
    createdAt: '2025-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-04',
    nis: '2024104',
    nisn: '0034567894',
    fullName: 'Khadijah Al-Kubra',
    unit: 'sdit',
    classLevel: 'Kelas 3-B (Kudus)',
    academicYear: '2026/2027',
    parentName: 'Ibu Halimah (Wali)',
    parentWhatsapp: '085211223344',
    monthlySppRate: 450000,
    scholarshipId: 'sch-02',
    enrollmentDate: '2024-07-10',
    status: 'aktif',
    notes: 'Beasiswa Yatim Dhuafa Yayasan Harapan Ibu Kepri 100%',
    createdAt: '2024-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-05',
    nis: '2024105',
    nisn: '0034567895',
    fullName: 'Umar Faruq Al-Anshori',
    unit: 'sdit',
    classLevel: 'Kelas 4-A (Cordoba)',
    academicYear: '2026/2027',
    parentName: 'Ferry Anshori, M.Si.',
    parentWhatsapp: '081276543210',
    monthlySppRate: 450000,
    enrollmentDate: '2023-07-10',
    status: 'aktif',
    notes: '',
    createdAt: '2023-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-06',
    nis: '2024106',
    nisn: '0034567896',
    fullName: 'Maryam Salsabila',
    unit: 'sdit',
    classLevel: 'Kelas 5-A (Baghdad)',
    academicYear: '2026/2027',
    parentName: 'Eko Purnomo, S.Kom.',
    parentWhatsapp: '081344556677',
    monthlySppRate: 450000,
    enrollmentDate: '2022-07-10',
    status: 'aktif',
    notes: '',
    createdAt: '2022-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-07',
    nis: '2024107',
    nisn: '0034567897',
    fullName: 'Yusuf Al-Ghifari',
    unit: 'sdit',
    classLevel: 'Kelas 6-A (Al-Quds)',
    academicYear: '2026/2027',
    parentName: 'Taufiqurrahman',
    parentWhatsapp: '081270001122',
    monthlySppRate: 450000,
    enrollmentDate: '2021-07-10',
    status: 'aktif',
    notes: 'Kandidat Ujian Akhir',
    createdAt: '2021-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-sdit-08',
    nis: '2024108',
    nisn: '0034567898',
    fullName: 'Abdullah Azzam Ramadhan',
    unit: 'sdit',
    classLevel: 'Kelas 2-B (Makkah)',
    academicYear: '2026/2027',
    parentName: 'Rahmat Ramadhan',
    parentWhatsapp: '081299001122',
    monthlySppRate: 450000,
    enrollmentDate: '2025-07-10',
    status: 'aktif',
    notes: '',
    createdAt: '2025-07-01',
    updatedAt: '2026-07-01'
  },

  // SMPIT
  {
    id: 'stu-smpit-01',
    nis: '2024301',
    nisn: '0087654321',
    fullName: 'Thariq bin Ziyad Al-Batam',
    unit: 'smpit',
    classLevel: 'Kelas 7-A (Ibnu Sina)',
    academicYear: '2026/2027',
    parentName: 'Kolonel (Purn) Sudirman',
    parentWhatsapp: '08117766554',
    monthlySppRate: 550000,
    scholarshipId: 'sch-03',
    enrollmentDate: '2026-07-15',
    status: 'aktif',
    notes: 'Beasiswa Tahfiz 5 Juz Al-Qur\'an (Potongan Rp 200.000/bln)',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-smpit-02',
    nis: '2024302',
    nisn: '0087654322',
    fullName: 'Nusaibah binti Ka\'ab',
    unit: 'smpit',
    classLevel: 'Kelas 7-B (Al-Khawarizmi)',
    academicYear: '2026/2027',
    parentName: 'Hj. Rohana Dewi, M.M.',
    parentWhatsapp: '081388990011',
    monthlySppRate: 550000,
    enrollmentDate: '2026-07-15',
    status: 'aktif',
    notes: '',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-smpit-03',
    nis: '2024303',
    nisn: '0087654323',
    fullName: 'Salman Al-Farisi',
    unit: 'smpit',
    classLevel: 'Kelas 8-A (Al-Farabi)',
    academicYear: '2026/2027',
    parentName: 'H. Syamsudin Noor',
    parentWhatsapp: '081270334455',
    monthlySppRate: 550000,
    enrollmentDate: '2025-07-15',
    status: 'aktif',
    notes: 'Ketua OSIS SMPIT',
    createdAt: '2025-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-smpit-04',
    nis: '2024304',
    nisn: '0087654324',
    fullName: 'Khalid bin Walid',
    unit: 'smpit',
    classLevel: 'Kelas 8-A (Al-Farabi)',
    academicYear: '2026/2027',
    parentName: 'Mayor Hendra Gunawan',
    parentWhatsapp: '081277112233',
    monthlySppRate: 550000,
    enrollmentDate: '2025-07-15',
    status: 'aktif',
    notes: 'Atlet Panahan Tingkat Kepri',
    createdAt: '2025-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-smpit-05',
    nis: '2024305',
    nisn: '0087654325',
    fullName: 'Shalahuddin Al-Ayyubi',
    unit: 'smpit',
    classLevel: 'Kelas 9-A (Ar-Razi)',
    academicYear: '2026/2027',
    parentName: 'Dedi Kurniawan, S.H.',
    parentWhatsapp: '081366554433',
    monthlySppRate: 550000,
    enrollmentDate: '2024-07-15',
    status: 'aktif',
    notes: '',
    createdAt: '2024-07-01',
    updatedAt: '2026-07-01'
  },
  {
    id: 'stu-smpit-06',
    nis: '2024306',
    nisn: '0087654326',
    fullName: 'Asma binti Abu Bakar',
    unit: 'smpit',
    classLevel: 'Kelas 9-B (Ar-Razi)',
    academicYear: '2026/2027',
    parentName: 'Prof. Dr. Ir. H. Anwar',
    parentWhatsapp: '081266009988',
    monthlySppRate: 550000,
    enrollmentDate: '2024-07-15',
    status: 'aktif',
    notes: 'Juara 1 Debat Bahasa Arab',
    createdAt: '2024-07-01',
    updatedAt: '2026-07-01'
  }
];

export const defaultScholarships: Scholarship[] = [
  {
    id: 'sch-01',
    studentId: 'stu-sdit-03',
    studentName: 'Bilal Al-Habasyi Siregar',
    unit: 'sdit',
    classLevel: 'Kelas 2-A (Makkah)',
    type: 'persentase',
    value: 50,
    reason: 'Putra guru SIT Insan Harapan - Kebijakan Pengurus Yayasan Harapan Ibu Kepri',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    approvedBy: 'H. Ahmad Fauzi, S.E. (Ketua Yayasan)',
    approvalStatus: 'disetujui',
    notes: 'Berlaku 1 tahun ajaran penuh',
    createdAt: '2026-07-01'
  },
  {
    id: 'sch-02',
    studentId: 'stu-sdit-04',
    studentName: 'Khadijah Al-Kubra',
    unit: 'sdit',
    classLevel: 'Kelas 3-B (Kudus)',
    type: 'penuh',
    value: 100,
    reason: 'Program Beasiswa Penuh Yatim Dhuafa Berprestasi Yayasan Harapan Ibu Kepri',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    approvedBy: 'H. Ahmad Fauzi, S.E. (Ketua Yayasan)',
    approvalStatus: 'disetujui',
    notes: 'SPP digratiskan 100% dari kas infaq yayasan',
    createdAt: '2026-07-01'
  },
  {
    id: 'sch-03',
    studentId: 'stu-smpit-01',
    studentName: 'Thariq bin Ziyad Al-Batam',
    unit: 'smpit',
    classLevel: 'Kelas 7-A (Ibnu Sina)',
    type: 'nominal',
    value: 200000,
    reason: 'Beasiswa Santri Berprestasi Tahfiz Al-Qur\'an 5 Juz Mutqin',
    startDate: '2026-07-01',
    endDate: '2027-06-30',
    approvedBy: 'Drs. H. Muhammad Ilyas, M.Pd.',
    approvalStatus: 'disetujui',
    notes: 'Potongan tetap Rp 200.000 setiap bulan',
    createdAt: '2026-07-01'
  },
  {
    id: 'sch-04',
    studentId: 'stu-rait-04',
    studentName: 'Ibrahim Khaleel',
    unit: 'rait',
    classLevel: 'RA-B (Umar bin Khattab)',
    type: 'keringanan_sementara',
    value: 100000,
    reason: 'Permohonan keringanan orang tua terdampak efisiensi kerja',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    approvedBy: 'H. Ahmad Fauzi, S.E. (Ketua Yayasan)',
    approvalStatus: 'disetujui',
    notes: 'Ditinjau ulang per semester (Desember 2026)',
    createdAt: '2026-07-01'
  }
];

// Helper to generate seed bills & transactions
export const monthsList = [
  { index: 0, name: 'Juli 2026', due: '2026-07-10' },
  { index: 1, name: 'Agustus 2026', due: '2026-08-10' },
  { index: 2, name: 'September 2026', due: '2026-09-10' },
  { index: 3, name: 'Oktober 2026', due: '2026-10-10' },
  { index: 4, name: 'November 2026', due: '2026-11-10' },
  { index: 5, name: 'Desember 2026', due: '2026-12-10' },
  { index: 6, name: 'Januari 2027', due: '2027-01-10' },
  { index: 7, name: 'Februari 2027', due: '2027-02-10' },
  { index: 8, name: 'Maret 2027', due: '2027-03-10' },
  { index: 9, name: 'April 2027', due: '2027-04-10' },
  { index: 10, name: 'Mei 2027', due: '2027-05-10' },
  { index: 11, name: 'Juni 2027', due: '2027-06-10' }
];

export function generateSeedBillsAndTransactions(): {
  bills: SppBill[];
  transactions: SppTransaction[];
  auditLogs: AuditLog[];
  followUps: Record<string, FollowUpRecord>;
} {
  const bills: SppBill[] = [];
  const transactions: SppTransaction[] = [];
  const auditLogs: AuditLog[] = [];
  const followUps: Record<string, FollowUpRecord> = {};

  let billSeq = 1;
  let trxSeq = 1;

  // We generate bills for months July, August, September, October 2026 (current semester)
  const activeMonths = monthsList.slice(0, 4);

  defaultStudents.forEach((student) => {
    // Check scholarship
    const scholarship = defaultScholarships.find((s) => s.studentId === student.id && s.approvalStatus === 'disetujui');
    let discount = 0;
    let isFullScholarship = false;

    if (scholarship) {
      if (scholarship.type === 'penuh') {
        discount = student.monthlySppRate;
        isFullScholarship = true;
      } else if (scholarship.type === 'persentase') {
        discount = Math.round((student.monthlySppRate * scholarship.value) / 100);
      } else if (scholarship.type === 'nominal' || scholarship.type === 'keringanan_sementara') {
        discount = Math.min(scholarship.value, student.monthlySppRate);
      }
    }

    const netAmount = Math.max(0, student.monthlySppRate - discount);

    activeMonths.forEach((m) => {
      const billId = `bill-${student.id}-${m.index}`;
      const billNumber = `TAG-2026${String(m.index + 7).padStart(2, '0')}-${String(billSeq++).padStart(4, '0')}`;

      // Determine payment scenario based on student to create rich realistic data
      let paid = 0;
      let status: SppBill['status'] = 'belum_bayar';

      if (isFullScholarship) {
        paid = 0;
        status = 'beasiswa_penuh';
      } else if (student.id === 'stu-rait-01' || student.id === 'stu-sdit-01' || student.id === 'stu-smpit-02') {
        // Lunas semua sampai Oktober
        paid = netAmount;
        status = 'lunas';
      } else if (student.id === 'stu-rait-02' || student.id === 'stu-sdit-02' || student.id === 'stu-smpit-03') {
        // Lunas sampai September, Oktober belum bayar (Tunggakan 1 bulan)
        if (m.index <= 2) {
          paid = netAmount;
          status = 'lunas';
        } else {
          paid = 0;
          status = 'belum_bayar';
        }
      } else if (student.id === 'stu-rait-03' || student.id === 'stu-sdit-05') {
        // Lunas Juli, Agustus-Oktober belum bayar (Tunggakan 3 bulan!)
        if (m.index === 0) {
          paid = netAmount;
          status = 'lunas';
        } else {
          paid = 0;
          status = 'belum_bayar';
        }
      } else if (student.id === 'stu-sdit-06' || student.id === 'stu-smpit-05') {
        // Tunggakan parah: 4 bulan belum bayar sama sekali!
        paid = 0;
        status = 'belum_bayar';
      } else if (student.id === 'stu-sdit-07') {
        // Cicilan / dibayar sebagian di Oktober
        if (m.index <= 2) {
          paid = netAmount;
          status = 'lunas';
        } else {
          paid = 200000;
          status = 'dibayar_sebagian';
        }
      } else {
        // Lunas Juli-Agustus, September-Oktober nunggak (2 bulan)
        if (m.index <= 1) {
          paid = netAmount;
          status = 'lunas';
        } else {
          paid = 0;
          status = 'belum_bayar';
        }
      }

      const remainingAmount = Math.max(0, netAmount - paid);

      const bill: SppBill = {
        id: billId,
        billNumber,
        studentId: student.id,
        studentNis: student.nis,
        studentName: student.fullName,
        unit: student.unit,
        classLevel: student.classLevel,
        academicYear: student.academicYear,
        monthIndex: m.index,
        monthName: m.name,
        dueDate: m.due,
        baseAmount: student.monthlySppRate,
        discountAmount: discount,
        netAmount,
        paidAmount: paid,
        remainingAmount,
        status,
        createdAt: '2026-07-01 08:00',
        updatedAt: paid > 0 ? `2026-0${m.index + 7}-08 10:15` : '2026-07-01 08:00'
      };

      bills.push(bill);

      // Create transaction for paid bills
      if (paid > 0 && !isFullScholarship) {
        const trxDate = `2026-0${m.index + 7}-08 09:30`;
        const trxId = `trx-${student.id}-${m.index}`;
        const transactionNumber = `TRX-2026${String(m.index + 7).padStart(2, '0')}-${String(trxSeq++).padStart(4, '0')}`;

        transactions.push({
          id: trxId,
          transactionNumber,
          studentId: student.id,
          studentNis: student.nis,
          studentName: student.fullName,
          unit: student.unit,
          classLevel: student.classLevel,
          parentName: student.parentName,
          parentWhatsapp: student.parentWhatsapp,
          totalAmountPaid: paid,
          paymentDate: trxDate,
          paymentMethod: m.index % 2 === 0 ? 'transfer_bsi' : 'tunai',
          referenceNumber: m.index % 2 === 0 ? `BSI-FT-${778000 + trxSeq}` : undefined,
          cashierName: student.unit === 'rait' ? 'Siti Khadijah, A.Md.' : 'Ustadzah Maryam, S.Pd.',
          cashierId: student.unit === 'rait' ? 'usr-5' : 'usr-2',
          notes: `Pembayaran SPP ${m.name}`,
          isVoided: false,
          allocations: [
            {
              billId: bill.id,
              monthName: m.name,
              amountAllocated: paid,
              statusAfterAllocation: status
            }
          ],
          createdAt: trxDate
        });
      }
    });
  });

  // Seed initial audit logs
  auditLogs.push(
    {
      id: 'log-01',
      actionType: 'generate_bill',
      entity: 'bill',
      entityId: 'all-2026-07',
      description: 'Pembuatan tagihan massal SPP Semester Ganjil TA 2026/2027 (Juli - Oktober 2026) untuk 19 siswa aktif',
      performedBy: 'H. Ahmad Fauzi, S.E. (Super Admin)',
      userRole: 'super_admin',
      timestamp: '2026-07-01 08:00:00'
    },
    {
      id: 'log-02',
      actionType: 'payment',
      entity: 'transaction',
      entityId: 'TRX-202610-0001',
      description: 'Penerimaan pembayaran SPP Oktober 2026 an. Zaid bin Tsabit (SDIT) sebesar Rp 450.000 via BSI Syariah',
      performedBy: 'Ustadzah Maryam, S.Pd.',
      userRole: 'admin_keuangan',
      timestamp: '2026-10-08 09:30:15'
    },
    {
      id: 'log-03',
      actionType: 'payment',
      entity: 'transaction',
      entityId: 'TRX-202610-0002',
      description: 'Penerimaan cicilan SPP Oktober 2026 an. Yusuf Al-Ghifari (SDIT) sebesar Rp 200.000 Tunai di kasir',
      performedBy: 'Ustadzah Maryam, S.Pd.',
      userRole: 'admin_keuangan',
      timestamp: '2026-10-09 11:20:40'
    }
  );

  // Initial follow-up statuses
  followUps['stu-sdit-06'] = {
    studentId: 'stu-sdit-06',
    status: 'sudah_diwhatsapp',
    lastContactedAt: '2026-10-15 14:00',
    notes: 'Orang tua berjanji menyelesaikan tanggal 25 Oktober 2026.'
  };

  followUps['stu-smpit-05'] = {
    studentId: 'stu-smpit-05',
    status: 'janji_bayar',
    lastContactedAt: '2026-10-18 10:30',
    promisedPaymentDate: '2026-10-28',
    notes: 'Menunggu pencairan insentif pekerjaan wali.'
  };

  return { bills, transactions, auditLogs, followUps };
}
