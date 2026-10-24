import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SchoolProfile,
  EducationalUnit,
  EducationalUnitType,
  ProgramItem,
  NewsArticle,
  GalleryItem,
  Facility,
  PPDBRegistration,
  PPDBSchedule,
  PPDBFee,
  Testimonial
} from '../types';
import {
  DEFAULT_SCHOOL_PROFILE,
  EDUCATIONAL_UNITS,
  SCHOOL_PROGRAMS,
  NEWS_ARTICLES,
  GALLERY_ITEMS,
  SCHOOL_FACILITIES,
  PPDB_SCHEDULES,
  PPDB_FEES,
  TESTIMONIALS,
  INITIAL_REGISTRATIONS
} from '../data/defaultData';

export type ActiveNavTab =
  | 'beranda'
  | 'profil'
  | 'unit'
  | 'program'
  | 'ppdb'
  | 'berita'
  | 'galeri'
  | 'fasilitas'
  | 'kontak'
  | 'admin';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface AppContextType {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  selectedUnitId: EducationalUnitType;
  setSelectedUnitId: (unitId: EducationalUnitType) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedGalleryItem: GalleryItem | null;
  setSelectedGalleryItem: (item: GalleryItem | null) => void;
  selectedReceipt: PPDBRegistration | null;
  setSelectedReceipt: (reg: PPDBRegistration | null) => void;

  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;

  units: EducationalUnit[];
  programs: ProgramItem[];
  facilities: Facility[];
  testimonials: Testimonial[];
  schedules: PPDBSchedule[];
  fees: PPDBFee[];

  news: NewsArticle[];
  addNewsArticle: (article: Omit<NewsArticle, 'id' | 'slug' | 'date'>) => void;
  updateNewsArticle: (id: string, updated: Partial<NewsArticle>) => void;
  deleteNewsArticle: (id: string) => void;

  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;

  registrations: PPDBRegistration[];
  submitPPDB: (data: {
    candidateName: string;
    unit: EducationalUnitType;
    academicYear: string;
    parentName: string;
    parentWhatsapp: string;
    parentEmail?: string;
    previousSchool?: string;
    notes?: string;
  }) => PPDBRegistration;
  updateRegistrationStatus: (id: string, status: PPDBRegistration['status']) => void;
  deleteRegistration: (id: string) => void;

  isAdminLoggedIn: boolean;
  adminLogin: (pin: string) => boolean;
  adminLogout: () => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  generateWhatsAppUrl: (message: string, phoneNumber?: string) => string;
  navigateToUnit: (unitId: EducationalUnitType) => void;
  navigateToArticle: (articleId: string) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'insan_harapan_profile_v2',
  NEWS: 'insan_harapan_news_v1',
  GALLERY: 'insan_harapan_gallery_v1',
  REGISTRATIONS: 'insan_harapan_ppdb_regs_v1',
  ADMIN_AUTH: 'insan_harapan_admin_auth_v1',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTabState] = useState<ActiveNavTab>('beranda');
  const [selectedUnitId, setSelectedUnitId] = useState<EducationalUnitType>('sdit');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PPDBRegistration | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // School Profile
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure vision is updated if it didn't contain entrepreneur
        if (!parsed.vision || !parsed.vision.includes('Entrepreneur')) {
          parsed.vision = DEFAULT_SCHOOL_PROFILE.vision;
          parsed.subTagline = DEFAULT_SCHOOL_PROFILE.subTagline;
          parsed.mission = DEFAULT_SCHOOL_PROFILE.mission;
        }
        return parsed;
      }
      return DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  // News
  const [news, setNews] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
      return saved ? JSON.parse(saved) : NEWS_ARTICLES;
    } catch {
      return NEWS_ARTICLES;
    }
  });

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : GALLERY_ITEMS;
    } catch {
      return GALLERY_ITEMS;
    }
  });

  // Registrations
  const [registrations, setRegistrations] = useState<PPDBRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  // Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(schoolProfile));
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Toast handlers
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Nav helpers
  const setActiveTab = (tab: ActiveNavTab) => {
    setActiveTabState(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToUnit = (unitId: EducationalUnitType) => {
    setSelectedUnitId(unitId);
    setActiveTab('unit');
  };

  const navigateToArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setActiveTab('berita');
  };

  const updateSchoolProfile = (partial: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...partial }));
    showToast('Profil sekolah berhasil diperbarui di pengaturan', 'success');
  };

  // News CRUD
  const addNewsArticle = (newArticleData: Omit<NewsArticle, 'id' | 'slug' | 'date'>) => {
    const today = new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date());

    const id = `news-${Date.now()}`;
    const slug = newArticleData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created: NewsArticle = {
      ...newArticleData,
      id,
      slug,
      date: today
    };

    setNews((prev) => [created, ...prev]);
    showToast('Berita baru berhasil dipublikasikan!', 'success');
  };

  const updateNewsArticle = (id: string, updated: Partial<NewsArticle>) => {
    setNews((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast('Artikel berhasil diperbarui', 'success');
  };

  const deleteNewsArticle = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
    showToast('Artikel telah dihapus', 'info');
  };

  // Gallery CRUD
  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    setGallery((prev) => [newItem, ...prev]);
    showToast('Foto/Video dokumentasi baru berhasil ditambahkan', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((item) => item.id !== id));
    showToast('Item dokumentasi telah dihapus', 'info');
  };

  // PPDB Registration
  const submitPPDB = (data: {
    candidateName: string;
    unit: EducationalUnitType;
    academicYear: string;
    parentName: string;
    parentWhatsapp: string;
    parentEmail?: string;
    previousSchool?: string;
    notes?: string;
  }): PPDBRegistration => {
    const regSeq = String(registrations.length + 1).padStart(3, '0');
    const newReg: PPDBRegistration = {
      id: `REG-2026-${regSeq}`,
      registrationNumber: `IH-2026-${regSeq}`,
      candidateName: data.candidateName.trim(),
      unit: data.unit,
      academicYear: data.academicYear || '2026/2027',
      parentName: data.parentName.trim(),
      parentWhatsapp: data.parentWhatsapp.trim(),
      parentEmail: data.parentEmail?.trim(),
      previousSchool: data.previousSchool?.trim() || '-',
      notes: data.notes?.trim() || '-',
      submittedAt: new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date()),
      status: 'Menunggu Verifikasi'
    };

    setRegistrations((prev) => [newReg, ...prev]);
    setSelectedReceipt(newReg);
    showToast('Formulir pendaftaran PPDB berhasil terkirim!', 'success');
    return newReg;
  };

  const updateRegistrationStatus = (id: string, status: PPDBRegistration['status']) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status } : reg))
    );
    showToast(`Status pendaftaran diperbarui menjadi "${status}"`, 'success');
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((reg) => reg.id !== id));
    showToast('Data pendaftaran berhasil dihapus', 'info');
  };

  // Admin Auth (demo PIN 123456 or 654321)
  const adminLogin = (pin: string): boolean => {
    if (pin === '123456' || pin === 'insanharapan') {
      setIsAdminLoggedIn(true);
      showToast('Login Administrator Berhasil. Selamat Datang!', 'success');
      return true;
    }
    showToast('PIN Admin salah. Gunakan PIN demo: 123456', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Anda telah keluar dari Panel Administrator', 'info');
  };

  // WhatsApp generator
  const generateWhatsAppUrl = (message: string, phoneNumber?: string): string => {
    const phone = phoneNumber || schoolProfile.whatsappPPDB || schoolProfile.whatsappPrimary || '6281270001928';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const normalizedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  };

  const resetAllDataToDefault = () => {
    setSchoolProfile(DEFAULT_SCHOOL_PROFILE);
    setNews(NEWS_ARTICLES);
    setGallery(GALLERY_ITEMS);
    setRegistrations(INITIAL_REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.NEWS);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    showToast('Semua data konten telah dikembalikan ke standar awal pabrik', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedUnitId,
        setSelectedUnitId,
        selectedArticleId,
        setSelectedArticleId,
        selectedGalleryItem,
        setSelectedGalleryItem,
        selectedReceipt,
        setSelectedReceipt,

        schoolProfile,
        updateSchoolProfile,

        units: EDUCATIONAL_UNITS,
        programs: SCHOOL_PROGRAMS,
        facilities: SCHOOL_FACILITIES,
        testimonials: TESTIMONIALS,
        schedules: PPDB_SCHEDULES,
        fees: PPDB_FEES,

        news,
        addNewsArticle,
        updateNewsArticle,
        deleteNewsArticle,

        gallery,
        addGalleryItem,
        deleteGalleryItem,

        registrations,
        submitPPDB,
        updateRegistrationStatus,
        deleteRegistration,

        isAdminLoggedIn,
        adminLogin,
        adminLogout,

        toasts,
        showToast,
        removeToast,

        generateWhatsAppUrl,
        navigateToUnit,
        navigateToArticle,
        resetAllDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
