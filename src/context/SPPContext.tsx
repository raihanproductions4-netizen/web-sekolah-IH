/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Student,
  SPPInvoice,
  SPPTransaction,
  Scholarship,
  SPPUser,
  SystemSettings,
  AuditLog,
  ArrearsFollowUp,
  SPPUnit,
  SPPTab,
  PaymentMethod,
  SchoolClass,
  UserRole,
  InvoiceStatus,
} from '../types/spp';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_SCHOLARSHIPS,
  INITIAL_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FOLLOW_UPS,
} from '../data/sppInitialData';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { db, auth, googleProvider, handleFirestoreError, OperationType } from '../firebase';

export const INITIAL_CLASSES: SchoolClass[] = [
  { id: 'cls-1', namaKelas: 'TK-A Bulan', unit: 'rait', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Nurul Hidayah, S.Pd.I', kapasitas: 20 },
  { id: 'cls-2', namaKelas: 'TK-B Bintang', unit: 'rait', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Sarah Amalia, S.Pd.', kapasitas: 20 },
  { id: 'cls-3', namaKelas: '1A Umar bin Khattab', unit: 'sdit', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Dewi Sartika, S.Pd.', kapasitas: 28 },
  { id: 'cls-4', namaKelas: '1B Abu Bakar Ash-Shiddiq', unit: 'sdit', tahunAjaran: '2024/2025', waliKelas: 'Ustadz Ridho Illahi, S.Pd.I', kapasitas: 28 },
  { id: 'cls-5', namaKelas: '2A Utsman bin Affan', unit: 'sdit', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Aisyah Rahma, M.Pd.', kapasitas: 28 },
  { id: 'cls-6', namaKelas: '2B Ali bin Abi Thalib', unit: 'sdit', tahunAjaran: '2024/2025', waliKelas: 'Ustadz Salman Al-Farisi, S.Pd.', kapasitas: 28 },
  { id: 'cls-7', namaKelas: '3A Khalid bin Walid', unit: 'sdit', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Ratna Juwita, S.Pd.', kapasitas: 28 },
  { id: 'cls-8', namaKelas: '7A Al-Khawarizmi', unit: 'smpit', tahunAjaran: '2024/2025', waliKelas: 'Ustadz Luqman Hakim, M.Pd.', kapasitas: 30 },
  { id: 'cls-9', namaKelas: '7B Ibnu Sina', unit: 'smpit', tahunAjaran: '2024/2025', waliKelas: 'Ustadz Farhan Ramadhan, S.Pd.', kapasitas: 30 },
  { id: 'cls-10', namaKelas: '8A Al-Biruni', unit: 'smpit', tahunAjaran: '2024/2025', waliKelas: 'Ustadzah Fitria Dewi, S.Pd.', kapasitas: 30 },
  { id: 'cls-11', namaKelas: '9A Thariq bin Ziyad', unit: 'smpit', tahunAjaran: '2024/2025', waliKelas: 'Ustadz Ahmad Fauzi, M.Pd.', kapasitas: 30 },
];

const SPP_STORAGE_KEYS = {
  USERS: 'spp_users_v2',
  CURRENT_USER: 'spp_current_user_v2',
  STUDENTS: 'spp_students_v2',
  INVOICES: 'spp_invoices_v2',
  TRANSACTIONS: 'spp_transactions_v2',
  SCHOLARSHIPS: 'spp_scholarships_v2',
  SETTINGS: 'spp_settings_v2',
  AUDIT_LOGS: 'spp_audit_logs_v2',
  FOLLOW_UPS: 'spp_follow_ups_v2',
  CLASSES: 'spp_classes_v2',
};

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface SPPContextType {
  // Navigation & User
  currentTab: SPPTab;
  setCurrentTab: (tab: SPPTab) => void;
  currentUser: SPPUser;
  setCurrentUser: (user: SPPUser) => void;
  users: SPPUser[];
  selectedUnitFilter: SPPUnit;
  setSelectedUnitFilter: (unit: SPPUnit) => void;

  // Role Access Checks
  isAdmin: boolean;
  isBendahara: boolean;
  switchUserRole: (role: 'admin' | 'bendahara') => void;

  // Firebase Auth & Cloud Firestore Status
  firebaseUser: FirebaseUser | null;
  isFirestoreConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;

  // Modals & Active Selections
  activeReceipt: SPPTransaction | null;
  setActiveReceipt: (trx: SPPTransaction | null) => void;
  selectedStudentForDetail: Student | null;
  setSelectedStudentForDetail: (student: Student | null) => void;

  // Data
  students: Student[];
  invoices: SPPInvoice[];
  transactions: SPPTransaction[];
  classes: SchoolClass[];
  scholarships: Scholarship[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
  followUps: ArrearsFollowUp[];

  // Student Actions
  addStudent: (data: Omit<Student, 'id'>) => Promise<Student>;
  updateStudent: (id: string, updated: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  bulkAddStudents: (newStudents: Omit<Student, 'id'>[]) => Promise<void>;

  // Class Actions
  addClass: (data: Omit<SchoolClass, 'id'>) => Promise<SchoolClass>;
  updateClass: (id: string, updated: Partial<SchoolClass>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  // Invoicing Actions
  generateMonthlyInvoices: (
    bulan: number,
    tahunAjaran: string,
    unit?: SPPUnit,
    kelas?: string,
    nominalCustom?: number
  ) => Promise<{ created: number; skipped: number }>;
  updateInvoiceManual: (id: string, updated: Partial<SPPInvoice>) => Promise<void>;

  // Payment Transaction Actions
  recordPayment: (payload: {
    siswaId: string;
    tagihanSelected: { tagihanId: string; bayarNominal: number }[];
    totalBayar: number;
    metodePembayaran: PaymentMethod;
    nomorReferensi?: string;
    catatan?: string;
    tanggalBayar?: string;
  }) => Promise<SPPTransaction>;

  cancelTransaction: (
    transactionId: string,
    alasan: string,
    otorisasiOleh: string
  ) => Promise<boolean>;

  // Arrears Actions
  updateFollowUp: (siswaId: string, status: ArrearsFollowUp['status'], catatan?: string) => Promise<void>;

  // Scholarships
  addScholarship: (data: Omit<Scholarship, 'id' | 'kuotaAktif'>) => Promise<void>;
  updateScholarship: (id: string, updated: Partial<Scholarship>) => Promise<void>;

  // Settings & Users
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  addUser: (user: Omit<SPPUser, 'id'>) => Promise<void>;
  updateUser: (id: string, updated: Partial<SPPUser>) => Promise<void>;

  // Backup & Restore
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
  resetToDefaultData: () => Promise<void>;

  // Notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Login simulation
  loginUserByUsername: (username: string, password?: string) => Promise<boolean>;
  logoutUser: () => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
}

const SPPContext = createContext<SPPContextType | undefined>(undefined);

export const SPPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<SPPTab>('dashboard');
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<SPPUnit>('all');
  const [activeReceipt, setActiveReceipt] = useState<SPPTransaction | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);

  // Users
  const [users, setUsers] = useState<SPPUser[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current User (Defaults to Admin for immediate access)
  const [currentUser, setCurrentUserState] = useState<SPPUser>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Students
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  // Classes
  const [classes, setClasses] = useState<SchoolClass[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.CLASSES);
      return saved ? JSON.parse(saved) : INITIAL_CLASSES;
    } catch {
      return INITIAL_CLASSES;
    }
  });

  // Invoices (Bills)
  const [invoices, setInvoices] = useState<SPPInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.INVOICES);
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // Transactions (Payments)
  const [transactions, setTransactions] = useState<SPPTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Scholarships
  const [scholarships, setScholarships] = useState<Scholarship[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.SCHOLARSHIPS);
      return saved ? JSON.parse(saved) : INITIAL_SCHOLARSHIPS;
    } catch {
      return INITIAL_SCHOLARSHIPS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.AUDIT_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Follow Ups
  const [followUps, setFollowUps] = useState<ArrearsFollowUp[]>(() => {
    try {
      const saved = localStorage.getItem(SPP_STORAGE_KEYS.FOLLOW_UPS);
      return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
    } catch {
      return INITIAL_FOLLOW_UPS;
    }
  });

  // Save changes to localStorage for local fast cache
  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
  }, [scholarships]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(SPP_STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
  }, [followUps]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = async (aksi: string, detail: string, tipe: AuditLog['tipe'] = 'info') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      waktu: new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }).format(new Date()),
      aksi,
      pengguna: currentUser.nama,
      peran: currentUser.roleName,
      detail,
      tipe,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Role Checks
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';
  const isBendahara = currentUser.role === 'bendahara' || currentUser.role === 'admin_keuangan' || currentUser.role === 'operator' || isAdmin;

  // Switch between Admin & Bendahara in 1 click
  const switchUserRole = (newRole: 'admin' | 'bendahara') => {
    const targetUser = users.find((u) => u.role === newRole) || {
      id: newRole === 'admin' ? 'user-001' : 'user-002',
      nama: newRole === 'admin' ? 'Administrator Sistem' : 'Bendahara SPP',
      email: `${newRole}@insanharapan.sch.id`,
      username: newRole,
      role: newRole,
      roleName: newRole === 'admin' ? 'Administrator Sekolah / Pesantren' : 'Bendahara Keuangan SPP',
      unitAkses: 'all',
      status: 'aktif' as const,
      terakhirLogin: 'Baru saja',
    };

    setCurrentUser(targetUser);
    showToast(`Beralih peran aktif: ${targetUser.roleName}`, 'info');
  };

  // Google Login & Logout via Firebase Auth
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      setFirebaseUser(fbUser);

      // Create or load profile
      const userDocRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      const isBootstrapAdmin = fbUser.email === 'raihanproductions4@gmail.com';
      const userRole: UserRole = isBootstrapAdmin ? 'admin' : 'bendahara';
      const roleName = isBootstrapAdmin ? 'Administrator Sekolah / Pesantren' : 'Bendahara Keuangan SPP';

      if (!userSnap.exists()) {
        const newUser: SPPUser = {
          id: fbUser.uid,
          nama: fbUser.displayName || 'Pengguna Terautentikasi',
          email: fbUser.email || '',
          username: fbUser.email?.split('@')[0] || 'pengguna',
          role: userRole,
          roleName,
          unitAkses: 'all',
          status: 'aktif',
          avatar: fbUser.photoURL || undefined,
          terakhirLogin: new Date().toISOString(),
        };
        await setDoc(userDocRef, newUser);
        setCurrentUser(newUser);
      } else {
        const existingData = userSnap.data() as SPPUser;
        setCurrentUser(existingData);
      }

      setIsLoggedIn(true);
      showToast(`Login Google berhasil! Masuk sebagai ${fbUser.displayName}`, 'success');
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      showToast(`Gagal login Google: ${err.message}`, 'error');
    }
  };

  const logoutFirebase = async () => {
    try {
      await fbSignOut(auth);
      setFirebaseUser(null);
      setIsLoggedIn(false);
      showToast('Berhasil logout dari sesi Firebase.', 'info');
    } catch (err: any) {
      console.error('Logout Error:', err);
    }
  };

  // Seed Firestore if empty
  const seedFirestoreDatabase = async () => {
    try {
      const studentSnap = await getDocs(collection(db, 'students'));
      if (studentSnap.empty) {
        console.log('Firestore is empty. Seeding initial SPP database...');
        const batch = writeBatch(db);

        // Seed initial users
        INITIAL_USERS.forEach((u) => {
          batch.set(doc(db, 'users', u.id), u);
        });

        // Seed initial students
        INITIAL_STUDENTS.forEach((s) => {
          batch.set(doc(db, 'students', s.id), s);
        });

        // Seed initial classes
        INITIAL_CLASSES.forEach((c) => {
          batch.set(doc(db, 'classes', c.id), c);
        });

        // Seed initial bills
        INITIAL_INVOICES.forEach((b) => {
          batch.set(doc(db, 'bills', b.id), b);
        });

        // Seed initial payments
        INITIAL_TRANSACTIONS.forEach((p) => {
          batch.set(doc(db, 'payments', p.id), p);
        });

        // Seed settings
        batch.set(doc(db, 'school_settings', 'main_settings'), INITIAL_SETTINGS);

        await batch.commit();
        console.log('Initial SPP database successfully seeded to Firestore!');
      }
    } catch (e) {
      console.warn('Initial Firestore seed skipped or deferred:', e);
    }
  };

  // Live Firestore Listeners & Bootstrapping
  useEffect(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      if (u) {
        setIsLoggedIn(true);
      }
    });

    // Test connection & seed
    seedFirestoreDatabase().then(() => {
      setIsFirestoreConnected(true);
    });

    // 1. Listen to Students
    const unsubscribeStudents = onSnapshot(
      collection(db, 'students'),
      (snap) => {
        if (!snap.empty) {
          const list: Student[] = [];
          snap.forEach((d) => list.push(d.data() as Student));
          setStudents(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'students');
      }
    );

    // 2. Listen to Classes
    const unsubscribeClasses = onSnapshot(
      collection(db, 'classes'),
      (snap) => {
        if (!snap.empty) {
          const list: SchoolClass[] = [];
          snap.forEach((d) => list.push(d.data() as SchoolClass));
          setClasses(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'classes');
      }
    );

    // 3. Listen to Bills (Invoices)
    const unsubscribeBills = onSnapshot(
      collection(db, 'bills'),
      (snap) => {
        if (!snap.empty) {
          const list: SPPInvoice[] = [];
          snap.forEach((d) => list.push(d.data() as SPPInvoice));
          setInvoices(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'bills');
      }
    );

    // 4. Listen to Payments (Transactions)
    const unsubscribePayments = onSnapshot(
      collection(db, 'payments'),
      (snap) => {
        if (!snap.empty) {
          const list: SPPTransaction[] = [];
          snap.forEach((d) => list.push(d.data() as SPPTransaction));
          setTransactions(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'payments');
      }
    );

    // 5. Listen to School Settings
    const unsubscribeSettings = onSnapshot(
      doc(db, 'school_settings', 'main_settings'),
      (snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as SystemSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'school_settings/main_settings');
      }
    );

    // 6. Listen to Users
    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      (snap) => {
        if (!snap.empty) {
          const list: SPPUser[] = [];
          snap.forEach((d) => list.push(d.data() as SPPUser));
          setUsers(list);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'users');
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeStudents();
      unsubscribeClasses();
      unsubscribeBills();
      unsubscribePayments();
      unsubscribeSettings();
      unsubscribeUsers();
    };
  }, []);

  const setCurrentUser = (user: SPPUser) => {
    setCurrentUserState(user);
    setIsLoggedIn(true);
    try {
      localStorage.setItem(SPP_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch {}
    if (user.unitAkses !== 'all') {
      setSelectedUnitFilter(user.unitAkses);
    }
    showToast(`Masuk sebagai: ${user.nama} (${user.roleName})`, 'info');
  };

  const loginUserByUsername = async (identifier: string, _password?: string): Promise<boolean> => {
    const cleanId = (identifier || '').trim().toLowerCase();
    if (!cleanId) {
      showToast('Harap masukkan email atau nama pengguna.', 'warning');
      return false;
    }

    // 1. Search in current memory/cached users (case-insensitive)
    let target = users.find(
      (u) =>
        u.username?.toLowerCase() === cleanId ||
        u.email?.toLowerCase() === cleanId
    );

    // 2. Search in Firestore users collection
    if (!target) {
      try {
        const userDocs = await getDocs(collection(db, 'users'));
        userDocs.forEach((d) => {
          const u = d.data() as SPPUser;
          if (
            u.username?.toLowerCase() === cleanId ||
            u.email?.toLowerCase() === cleanId
          ) {
            target = u;
          }
        });
      } catch (err) {
        console.warn('Could not query Firestore users:', err);
      }
    }

    // 3. If still not found, handle known patterns and auto-provision
    if (!target) {
      const isRaihanAdmin = cleanId === 'raihanproductions4@gmail.com' || cleanId === 'raihan';
      const isAdminAccount = isRaihanAdmin || cleanId.includes('admin') || cleanId === 'superadmin';
      const isBendaharaAccount = cleanId.includes('bendahara') || cleanId.includes('kasir') || cleanId.includes('keuangan');

      const role: UserRole = isBendaharaAccount ? 'bendahara' : 'admin';
      const roleName = role === 'admin'
        ? (isRaihanAdmin ? 'Administrator Sekolah / Pesantren (Super Admin)' : 'Administrator Sekolah / Pesantren')
        : 'Bendahara Keuangan SPP';

      const emailPart = cleanId.includes('@') ? cleanId : `${cleanId}@insanharapan.sch.id`;
      const namePart = isRaihanAdmin
        ? 'Raihan Productions (Super Admin)'
        : cleanId.includes('@')
        ? cleanId.split('@')[0].toUpperCase()
        : cleanId.toUpperCase();

      const newUser: SPPUser = {
        id: `user-${Date.now().toString().slice(-4)}`,
        nama: namePart,
        email: emailPart,
        username: cleanId.split('@')[0],
        role,
        roleName,
        unitAkses: 'all',
        status: 'aktif',
        terakhirLogin: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', newUser.id), newUser);
      } catch (err) {
        console.warn('Failed saving user to Firestore:', err);
      }

      setUsers((prev) => [newUser, ...prev]);
      target = newUser;
    }

    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
      showToast(`Selamat datang kembali, ${target.nama}!`, 'success');
      return true;
    }

    showToast('Username atau email tidak ditemukan di sistem.', 'error');
    return false;
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    showToast('Anda telah keluar dari sistem SPP.', 'info');
  };

  // Student CRUD (Synced with Firestore)
  const addStudent = async (data: Omit<Student, 'id'>): Promise<Student> => {
    const id = `stu-${data.unit}-${Date.now().toString().slice(-4)}`;
    const newStudent: Student = { ...data, id };

    // Optimistic state
    setStudents((prev) => [newStudent, ...prev]);

    // Firestore mutation
    try {
      await setDoc(doc(db, 'students', id), newStudent);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `students/${id}`);
    }

    addAuditLog('Tambah Siswa', `Mendaftarkan siswa baru: ${newStudent.namaLengkap} (NIS: ${newStudent.nis}) di ${newStudent.unit.toUpperCase()} kelas ${newStudent.kelas}`);
    showToast(`Siswa ${newStudent.namaLengkap} berhasil didaftarkan.`, 'success');
    return newStudent;
  };

  const updateStudent = async (id: string, updated: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const merged = { ...s, ...updated };
          addAuditLog('Edit Siswa', `Memperbarui data siswa: ${merged.namaLengkap} (NIS: ${merged.nis})`);
          return merged;
        }
        return s;
      })
    );

    try {
      await updateDoc(doc(db, 'students', id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `students/${id}`);
    }

    showToast('Data siswa berhasil diperbarui.', 'success');
  };

  const deleteStudent = async (id: string) => {
    const target = students.find((s) => s.id === id);
    if (!target) return;
    setStudents((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `students/${id}`);
    }

    addAuditLog('Hapus Siswa', `Menghapus data siswa: ${target.namaLengkap} (NIS: ${target.nis})`, 'koreksi');
    showToast(`Data siswa ${target.namaLengkap} telah dihapus.`, 'warning');
  };

  const bulkAddStudents = async (newStudentsData: Omit<Student, 'id'>[]) => {
    const createdList: Student[] = newStudentsData.map((d, idx) => ({
      ...d,
      id: `stu-${d.unit}-${Date.now().toString().slice(-4)}-${idx}`,
    }));

    setStudents((prev) => [...createdList, ...prev]);

    try {
      const batch = writeBatch(db);
      createdList.forEach((st) => {
        batch.set(doc(db, 'students', st.id), st);
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'students');
    }

    addAuditLog('Impor Massal Siswa', `Mengimpor ${createdList.length} data siswa baru.`);
    showToast(`Berhasil menambahkan ${createdList.length} siswa baru.`, 'success');
  };

  // Class Management CRUD
  const addClass = async (data: Omit<SchoolClass, 'id'>): Promise<SchoolClass> => {
    const id = `cls-${Date.now()}`;
    const newClass: SchoolClass = { ...data, id };
    setClasses((prev) => [...prev, newClass]);

    try {
      await setDoc(doc(db, 'classes', id), newClass);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `classes/${id}`);
    }

    showToast(`Kelas ${newClass.namaKelas} berhasil ditambahkan.`, 'success');
    return newClass;
  };

  const updateClass = async (id: string, updated: Partial<SchoolClass>) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );

    try {
      await updateDoc(doc(db, 'classes', id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `classes/${id}`);
    }

    showToast('Data kelas berhasil diperbarui.', 'success');
  };

  const deleteClass = async (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));

    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `classes/${id}`);
    }

    showToast('Kelas telah dihapus.', 'info');
  };

  // Generate Monthly Invoices (Bills)
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  const generateMonthlyInvoices = async (
    bulan: number,
    tahunAjaran: string,
    targetUnit: SPPUnit = 'all',
    targetKelas: string = 'all',
    nominalCustom?: number
  ) => {
    const namaBulanTahun = `${monthNames[bulan - 1]} ${tahunAjaran.split('/')[bulan >= 7 ? 0 : 1] || '2024'}`;
    const eligibleStudents = students.filter((s) => {
      if (s.status !== 'aktif') return false;
      if (targetUnit !== 'all' && s.unit !== targetUnit) return false;
      if (targetKelas !== 'all' && s.kelas !== targetKelas) return false;
      return true;
    });

    let createdCount = 0;
    let skippedCount = 0;
    const newInvoices: SPPInvoice[] = [];

    eligibleStudents.forEach((student) => {
      // Check duplicate
      const alreadyExists = invoices.some(
        (inv) => inv.siswaId === student.id && inv.bulan === bulan && inv.tahunAjaran === tahunAjaran
      );

      if (alreadyExists) {
        skippedCount++;
        return;
      }

      // Determine nominal: custom or student specific rate
      const nominalAsli = nominalCustom && nominalCustom > 0
        ? nominalCustom
        : (student.tarifSPP || settings.tarifDefault[student.unit] || 450000);

      const potongan = student.potonganSPP || 0;
      const totalTagihan = Math.max(0, nominalAsli - potongan);
      const isFree = totalTagihan === 0;

      const paddedBulan = String(bulan).padStart(2, '0');
      const invoiceYear = tahunAjaran.split('/')[bulan >= 7 ? 0 : 1] || '2024';
      const nomorTagihan = `TAG-${invoiceYear}${paddedBulan}-${student.unit.toUpperCase()}-${student.nis.slice(-4)}`;
      const dueDateStr = `${invoiceYear}-${paddedBulan}-${String(settings.jatuhTempoTanggal).padStart(2, '0')}`;
      const isPastDue = new Date(dueDateStr) < new Date();

      const newInv: SPPInvoice = {
        id: `inv-${student.id}-${invoiceYear}-${paddedBulan}`,
        nomorTagihan,
        siswaId: student.id,
        namaSiswa: student.namaLengkap,
        nis: student.nis,
        unit: student.unit,
        kelas: student.kelas,
        bulan,
        namaBulan: namaBulanTahun,
        tahunAjaran,
        nominalAsli,
        potongan,
        totalTagihan,
        terbayar: isFree ? totalTagihan : 0,
        sisaTagihan: isFree ? 0 : totalTagihan,
        status: isFree ? 'bebas' : (isPastDue ? 'terlambat' : 'belum_bayar'),
        jatuhTempo: dueDateStr,
        tanggalDibuat: new Date().toISOString().split('T')[0],
      };

      newInvoices.push(newInv);
      createdCount++;
    });

    if (newInvoices.length > 0) {
      setInvoices((prev) => [...newInvoices, ...prev]);

      // Batch write to Firestore
      try {
        const batch = writeBatch(db);
        newInvoices.forEach((inv) => {
          batch.set(doc(db, 'bills', inv.id), inv);
        });
        await batch.commit();
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, 'bills');
      }

      addAuditLog(
        'Pembuatan Tagihan Massal',
        `Membuat ${createdCount} tagihan untuk ${namaBulanTahun} (${targetUnit.toUpperCase()} - Kelas: ${targetKelas}). ${skippedCount} siswa dilewati karena sudah memiliki tagihan.`,
        'sistem'
      );
    }

    showToast(`Proses selesai: ${createdCount} tagihan dibuat, ${skippedCount} dilewati (sudah ada).`, 'info');
    return { created: createdCount, skipped: skippedCount };
  };

  const updateInvoiceManual = async (id: string, updated: Partial<SPPInvoice>) => {
    let updatedInv: SPPInvoice | null = null;
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const merged = { ...inv, ...updated };
          if (updated.nominalAsli !== undefined || updated.potongan !== undefined) {
            merged.totalTagihan = Math.max(0, merged.nominalAsli - (merged.potongan || 0));
            merged.sisaTagihan = Math.max(0, merged.totalTagihan - merged.terbayar);
          } else if (updated.totalTagihan !== undefined || updated.terbayar !== undefined) {
            merged.sisaTagihan = Math.max(0, merged.totalTagihan - merged.terbayar);
          }

          if (merged.sisaTagihan === 0) {
            merged.status = 'lunas';
          } else if (merged.terbayar > 0) {
            merged.status = 'sebagian';
          } else if (new Date(merged.jatuhTempo) < new Date()) {
            merged.status = 'terlambat';
          } else {
            merged.status = 'belum_bayar';
          }

          updatedInv = merged;
          addAuditLog('Pembaruan Tagihan', `Menyesuaikan tagihan ${merged.nomorTagihan} (${merged.namaSiswa}) total: ${merged.totalTagihan}`);
          return merged;
        }
        return inv;
      })
    );

    if (updatedInv) {
      try {
        await updateDoc(doc(db, 'bills', id), updatedInv);
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `bills/${id}`);
      }
    }

    showToast('Data tagihan berhasil diperbarui', 'success');
  };

  // Payment Recording (Payments / Transactions)
  const recordPayment = async (payload: {
    siswaId: string;
    tagihanSelected: { tagihanId: string; bayarNominal: number }[];
    totalBayar: number;
    metodePembayaran: PaymentMethod;
    nomorReferensi?: string;
    catatan?: string;
    tanggalBayar?: string;
  }): Promise<SPPTransaction> => {
    const student = students.find((s) => s.id === payload.siswaId);
    if (!student) {
      throw new Error('Siswa tidak ditemukan');
    }

    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(transactions.length + 1).padStart(4, '0');
    const randomCode = Math.floor(100 + Math.random() * 900);
    const nomorTransaksi = `TRX-${dateStr}-${seq}-${randomCode}`;
    const nomorKuitansi = `KW/${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${seq}`;

    const alokasiList = payload.tagihanSelected.map((item) => {
      const inv = invoices.find((i) => i.id === item.tagihanId);
      return {
        tagihanId: item.tagihanId,
        namaBulan: inv?.namaBulan || 'SPP',
        nominal: item.bayarNominal,
      };
    });

    const newTrx: SPPTransaction = {
      id: `trx-${Date.now()}-${randomCode}`,
      nomorTransaksi,
      nomorKuitansi,
      siswaId: student.id,
      namaSiswa: student.namaLengkap,
      nis: student.nis,
      unit: student.unit,
      kelas: student.kelas,
      tanggalBayar: payload.tanggalBayar || today.toISOString(),
      tagihanIds: payload.tagihanSelected.map((t) => t.tagihanId),
      alokasi: alokasiList,
      totalBayar: payload.totalBayar,
      metodePembayaran: payload.metodePembayaran,
      nomorReferensi: payload.nomorReferensi,
      petugas: currentUser.nama,
      petugasId: currentUser.id,
      catatan: payload.catatan || 'Pembayaran SPP',
      status: 'sukses',
    };

    // Updated bills map
    const updatedBillsToSync: SPPInvoice[] = [];

    // Update invoices status optimistically
    setInvoices((prev) =>
      prev.map((inv) => {
        const paymentAllocation = payload.tagihanSelected.find((t) => t.tagihanId === inv.id);
        if (paymentAllocation) {
          const newTerbayar = inv.terbayar + paymentAllocation.bayarNominal;
          const newSisa = Math.max(0, inv.totalTagihan - newTerbayar);
          const isOverdue = new Date(inv.jatuhTempo) < new Date();
          const newStatus: InvoiceStatus =
            newSisa === 0
              ? 'lunas'
              : newTerbayar > 0
              ? 'sebagian'
              : isOverdue
              ? 'terlambat'
              : 'belum_bayar';

          const updatedItem: SPPInvoice = {
            ...inv,
            terbayar: newTerbayar,
            sisaTagihan: newSisa,
            status: newStatus,
          };
          updatedBillsToSync.push(updatedItem);
          return updatedItem;
        }
        return inv;
      })
    );

    setTransactions((prev) => [newTrx, ...prev]);
    setActiveReceipt(newTrx);

    // Save atomically to Firestore via batch
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'payments', newTrx.id), newTrx);
      updatedBillsToSync.forEach((b) => {
        batch.set(doc(db, 'bills', b.id), b);
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'payments');
    }

    addAuditLog(
      'Pembayaran SPP',
      `Mencatat transaksi ${nomorTransaksi} (${nomorKuitansi}) sebesar Rp ${payload.totalBayar.toLocaleString('id-ID')} untuk ${student.namaLengkap} (${student.unit.toUpperCase()} ${student.kelas}) via ${payload.metodePembayaran}`,
      'transaksi'
    );

    showToast(`Transaksi ${nomorTransaksi} berhasil disimpan. Kuitansi ${nomorKuitansi} diterbitkan!`, 'success');
    return newTrx;
  };

  // Cancel / Revert Transaction
  const cancelTransaction = async (
    transactionId: string,
    alasan: string,
    otorisasiOleh: string
  ): Promise<boolean> => {
    const trx = transactions.find((t) => t.id === transactionId);
    if (!trx || trx.status === 'dibatalkan') return false;

    const updatedBillsToSync: SPPInvoice[] = [];

    // Revert invoices allocation
    setInvoices((prev) =>
      prev.map((inv) => {
        const alloc = trx.alokasi.find((a) => a.tagihanId === inv.id);
        if (alloc) {
          const restoredTerbayar = Math.max(0, inv.terbayar - alloc.nominal);
          const restoredSisa = Math.min(inv.totalTagihan, inv.sisaTagihan + alloc.nominal);
          const isOverdue = new Date(inv.jatuhTempo) < new Date();
          const restoredStatus: InvoiceStatus =
            restoredSisa === 0
              ? 'lunas'
              : restoredTerbayar > 0
              ? 'sebagian'
              : isOverdue
              ? 'terlambat'
              : 'belum_bayar';

          const item: SPPInvoice = {
            ...inv,
            terbayar: restoredTerbayar,
            sisaTagihan: restoredSisa,
            status: restoredStatus,
          };
          updatedBillsToSync.push(item);
          return item;
        }
        return inv;
      })
    );

    const cancelledTrxData: SPPTransaction = {
      ...trx,
      status: 'dibatalkan',
      pembatalan: {
        tanggal: new Date().toISOString(),
        alasan,
        diotorisasiOleh: otorisasiOleh,
        catatan: `Dibatalkan oleh ${currentUser.nama}. Alasan: ${alasan}`,
      },
    };

    // Mark transaction as cancelled
    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? cancelledTrxData : t))
    );

    // Sync to Firestore
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'payments', transactionId), cancelledTrxData);
      updatedBillsToSync.forEach((b) => {
        batch.set(doc(db, 'bills', b.id), b);
      });
      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `payments/${transactionId}`);
    }

    addAuditLog(
      'Pembatalan/Koreksi Transaksi',
      `Membatalkan ${trx.nomorTransaksi} (${trx.namaSiswa} - Rp ${trx.totalBayar.toLocaleString('id-ID')}). Alasan: ${alasan}. Otorisasi: ${otorisasiOleh}`,
      'koreksi'
    );

    showToast(`Transaksi ${trx.nomorTransaksi} telah dibatalkan dan saldo tagihan dipulihkan.`, 'warning');
    return true;
  };

  // Follow Ups
  const updateFollowUp = async (
    siswaId: string,
    status: ArrearsFollowUp['status'],
    catatan?: string
  ) => {
    const existingIdx = followUps.findIndex((f) => f.siswaId === siswaId);
    const newRecord: ArrearsFollowUp = {
      siswaId,
      tanggal: new Date().toISOString().slice(0, 10),
      status,
      catatan,
      petugas: currentUser.nama,
    };

    if (existingIdx >= 0) {
      setFollowUps((prev) => {
        const copy = [...prev];
        copy[existingIdx] = newRecord;
        return copy;
      });
    } else {
      setFollowUps((prev) => [newRecord, ...prev]);
    }

    showToast('Status tindak lanjut orang tua diperbarui', 'success');
  };

  // Scholarships
  const addScholarship = async (data: Omit<Scholarship, 'id' | 'kuotaAktif'>) => {
    const newSch: Scholarship = {
      ...data,
      id: `sch-${Date.now()}`,
      kuotaAktif: 0,
    };
    setScholarships((prev) => [...prev, newSch]);
    showToast(`Program beasiswa '${newSch.nama}' berhasil ditambahkan`, 'success');
  };

  const updateScholarship = async (id: string, updated: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('Program beasiswa diperbarui', 'success');
  };

  // Settings & Users
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await setDoc(doc(db, 'school_settings', 'main_settings'), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'school_settings/main_settings');
    }

    addAuditLog('Pengaturan Sistem', 'Memperbarui profil lembaga dan pengaturan sistem SPP');
    showToast('Pengaturan lembaga berhasil disimpan ke database!', 'success');
  };

  const addUser = async (user: Omit<SPPUser, 'id'>) => {
    const id = `user-${Date.now()}`;
    const newUser: SPPUser = { ...user, id };
    setUsers((prev) => [...prev, newUser]);

    try {
      await setDoc(doc(db, 'users', id), newUser);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${id}`);
    }

    addAuditLog('Tambah Pengguna', `Menambahkan akun baru: ${newUser.nama} (${newUser.roleName})`);
    showToast(`Akun ${newUser.nama} berhasil dibuat.`, 'success');
  };

  const updateUser = async (id: string, updated: Partial<SPPUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );

    try {
      await updateDoc(doc(db, 'users', id), updated);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${id}`);
    }

    showToast('Data akun pengguna berhasil diperbarui.', 'success');
  };

  // Backup & Restore
  const exportDatabaseJSON = () => {
    const dump = {
      exportDate: new Date().toISOString(),
      institution: settings.namaSekolah,
      users,
      students,
      classes,
      invoices,
      transactions,
      scholarships,
      settings,
      auditLogs,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dump, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `BACKUP_SPP_INSAN_HARAPAN_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Cadangan database berhasil diunduh.', 'success');
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.students && Array.isArray(parsed.students)) {
        setStudents(parsed.students);
      }
      if (parsed.invoices && Array.isArray(parsed.invoices)) {
        setInvoices(parsed.invoices);
      }
      if (parsed.transactions && Array.isArray(parsed.transactions)) {
        setTransactions(parsed.transactions);
      }
      if (parsed.settings && typeof parsed.settings === 'object') {
        setSettings(parsed.settings);
      }
      if (parsed.classes && Array.isArray(parsed.classes)) {
        setClasses(parsed.classes);
      }
      showToast('Data database berhasil dipulihkan dari file.', 'success');
      return true;
    } catch (e) {
      showToast('Gagal memulihkan database: format JSON tidak valid.', 'error');
      return false;
    }
  };

  const resetToDefaultData = async () => {
    setStudents(INITIAL_STUDENTS);
    setInvoices(INITIAL_INVOICES);
    setTransactions(INITIAL_TRANSACTIONS);
    setScholarships(INITIAL_SCHOLARSHIPS);
    setSettings(INITIAL_SETTINGS);
    setClasses(INITIAL_CLASSES);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);

    // Reseed Firestore
    try {
      const batch = writeBatch(db);
      INITIAL_USERS.forEach((u) => batch.set(doc(db, 'users', u.id), u));
      INITIAL_STUDENTS.forEach((s) => batch.set(doc(db, 'students', s.id), s));
      INITIAL_CLASSES.forEach((c) => batch.set(doc(db, 'classes', c.id), c));
      INITIAL_INVOICES.forEach((b) => batch.set(doc(db, 'bills', b.id), b));
      INITIAL_TRANSACTIONS.forEach((p) => batch.set(doc(db, 'payments', p.id), p));
      batch.set(doc(db, 'school_settings', 'main_settings'), INITIAL_SETTINGS);
      await batch.commit();
    } catch (e) {
      console.warn('Reseed to Firestore encountered error:', e);
    }

    showToast('Database berhasil direset ke data default awal.', 'info');
  };

  return (
    <SPPContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        currentUser,
        setCurrentUser,
        users,
        selectedUnitFilter,
        setSelectedUnitFilter,
        isAdmin,
        isBendahara,
        switchUserRole,
        firebaseUser,
        isFirestoreConnected,
        loginWithGoogle,
        logoutFirebase,
        activeReceipt,
        setActiveReceipt,
        selectedStudentForDetail,
        setSelectedStudentForDetail,
        students,
        invoices,
        transactions,
        classes,
        scholarships,
        settings,
        auditLogs,
        followUps,
        addStudent,
        updateStudent,
        deleteStudent,
        bulkAddStudents,
        addClass,
        updateClass,
        deleteClass,
        generateMonthlyInvoices,
        updateInvoiceManual,
        recordPayment,
        cancelTransaction,
        updateFollowUp,
        addScholarship,
        updateScholarship,
        updateSettings,
        addUser,
        updateUser,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetToDefaultData,
        toasts,
        showToast,
        removeToast,
        loginUserByUsername,
        logoutUser,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}

      {/* Global Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border text-xs font-medium flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900 text-white border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-900 text-amber-100 border-amber-700'
                : 'bg-stone-900 text-white border-stone-700'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-300 hover:text-white shrink-0 p-1 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </SPPContext.Provider>
  );
};

export const useSPP = () => {
  const context = useContext(SPPContext);
  if (!context) {
    throw new Error('useSPP must be used within an SPPProvider');
  }
  return context;
};
