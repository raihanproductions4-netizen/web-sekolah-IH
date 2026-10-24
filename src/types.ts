export type UserRole = 'super_admin' | 'admin_keuangan' | 'kepala_sekolah' | 'petugas';

export type EducationalUnitType = 'rait' | 'sdit' | 'smpit';
export type UnitAccessType = EducationalUnitType | 'all';

export type StudentStatus = 'aktif' | 'pindah' | 'lulus' | 'nonaktif';

export type BillStatus = 'belum_bayar' | 'dibayar_sebagian' | 'lunas' | 'beasiswa_penuh';

export type PaymentMethod = 'tunai' | 'transfer_bsi' | 'transfer_bank_lain' | 'qris';

export type FollowUpStatus = 'belum_dihubungi' | 'sudah_diwhatsapp' | 'janji_bayar' | 'dalam_penanganan';

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  unitAccess: UnitAccessType;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
  password?: string;
}

export interface Student {
  id: string;
  nis: string;
  nisn?: string;
  fullName: string;
  unit: EducationalUnitType;
  classLevel: string;
  academicYear: string;
  parentName: string;
  parentWhatsapp: string;
  monthlySppRate: number;
  scholarshipId?: string;
  enrollmentDate: string;
  status: StudentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scholarship {
  id: string;
  studentId: string;
  studentName: string;
  unit: EducationalUnitType;
  classLevel: string;
  type: 'penuh' | 'persentase' | 'nominal' | 'keringanan_sementara';
  value: number; // 100 for full, 1-99 for percent, or IDR amount
  reason: string;
  startDate: string;
  endDate: string;
  approvedBy: string;
  approvalStatus: 'disetujui' | 'menunggu' | 'ditolak';
  notes?: string;
  createdAt: string;
}

export interface SppBill {
  id: string;
  billNumber: string;
  studentId: string;
  studentNis: string;
  studentName: string;
  unit: EducationalUnitType;
  classLevel: string;
  academicYear: string;
  monthIndex: number; // 0 = Juli, 1 = Agustus, ..., 11 = Juni
  monthName: string; // e.g. "Oktober 2026"
  dueDate: string;
  baseAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: BillStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAllocation {
  billId: string;
  monthName: string;
  amountAllocated: number;
  statusAfterAllocation: BillStatus;
}

export interface SppTransaction {
  id: string;
  transactionNumber: string;
  studentId: string;
  studentNis: string;
  studentName: string;
  unit: EducationalUnitType;
  classLevel: string;
  parentName: string;
  parentWhatsapp: string;
  totalAmountPaid: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  cashierName: string;
  cashierId: string;
  notes?: string;
  isVoided: boolean;
  voidReason?: string;
  voidedBy?: string;
  voidedAt?: string;
  allocations: PaymentAllocation[];
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actionType: 'create' | 'update' | 'delete' | 'payment' | 'void' | 'export' | 'generate_bill';
  entity: 'student' | 'transaction' | 'bill' | 'scholarship' | 'user' | 'settings';
  entityId: string;
  description: string;
  performedBy: string;
  userRole: UserRole;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface SystemSettings {
  foundationName: string;
  schoolName: string;
  address: string;
  phone: string;
  email: string;
  officialBankAccount: string;
  currentAcademicYear: string;
  currentSemester: 'Ganjil' | 'Genap';
  dueDayOfMonth: number;
  defaultRates: {
    rait: number;
    sdit: number;
    smpit: number;
  };
}

export interface FollowUpRecord {
  studentId: string;
  status: FollowUpStatus;
  lastContactedAt?: string;
  promisedPaymentDate?: string;
  notes?: string;
}

export interface SchoolProfile {
  name: string;
  foundationName: string;
  tagline: string;
  subTagline: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  phone: string;
  whatsappPrimary: string;
  whatsappPPDB: string;
  email: string;
  mapsEmbedUrl: string;
  googleMapsUrl: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
  legalInfo: {
    npsnRAIT: string;
    npsnSDIT: string;
    npsnSMPIT: string;
    skIzin: string;
    akreditasi: string;
    afiliasi: string;
  };
  vision: string;
  mission: string[];
  educationalPhilosophy: string;
  headmasterName: string;
  headmasterTitle: string;
  headmasterWelcome: string;
}

export interface UnitCurriculumItem {
  title: string;
  description: string;
}

export interface UnitRoutineItem {
  time: string;
  activity: string;
}

export interface EducationalUnit {
  id: EducationalUnitType;
  name: string;
  fullName: string;
  tagline: string;
  ageRange: string;
  description: string;
  vision: string;
  highlights: string[];
  curriculum: UnitCurriculumItem[];
  dailyRoutine: UnitRoutineItem[];
  targetCompetencies: string[];
  image: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  category: string;
  iconName: string;
  targetUnit: string;
  outcomes: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  author: string;
  summary?: string;
  excerpt: string;
  readTime?: string;
  content: string[];
  image: string;
  tags?: string[];
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  unit?: string;
  date: string;
  image?: string;
  mediaUrl?: string;
  type?: 'image' | 'video' | 'photo';
  description: string;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  features: string[];
}

export interface PPDBSchedule {
  id?: string;
  wave?: string;
  gelombang?: string;
  period?: string;
  registrationPeriod?: string;
  reRegistrationPeriod?: string;
  observationDate?: string;
  announcementDate?: string;
  startDate?: string;
  endDate?: string;
  status: 'Dibuka' | 'Buka' | 'Segera Dibuka' | 'Ditutup';
  description?: string;
}

export interface PPDBFee {
  id?: string;
  unit: EducationalUnitType;
  unitName?: string;
  registrationFee?: number;
  entranceFee?: number;
  monthlySpp?: number;
  monthlySPP: number;
  uniformFee?: number;
  bookFee?: number;
  formFee: number;
  infaqGedung: number;
  activitiesAndUniform: number;
  notes: string;
}

export interface Testimonial {
  id: string;
  name?: string;
  parentName?: string;
  role?: string;
  childLevel?: string;
  profession?: string;
  unit?: string;
  avatar?: string;
  quote?: string;
  message?: string;
  rating?: number;
}


export interface PPDBRegistration {
  id: string;
  registrationNumber: string;
  unit: EducationalUnitType;
  gelombang?: string;
  academicYear?: string;
  studentName?: string;
  candidateName: string;
  gender?: 'Laki-laki' | 'Perempuan';
  birthPlace?: string;
  birthDate?: string;
  parentName: string;
  parentPhone?: string;
  parentWhatsapp: string;
  parentEmail?: string;
  address?: string;
  previousSchool?: string;
  status: string;
  paymentStatus?: 'Belum Bayar' | 'Menunggu Konfirmasi' | 'Lunas';
  registeredAt?: string;
  submittedAt: string;
  notes?: string;
}



