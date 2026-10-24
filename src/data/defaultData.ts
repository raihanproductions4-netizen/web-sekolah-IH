import {
  SchoolProfile,
  EducationalUnit,
  ProgramItem,
  NewsArticle,
  GalleryItem,
  Facility,
  PPDBSchedule,
  PPDBFee,
  Testimonial,
  PPDBRegistration
} from '../types';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  name: "RAIT – SDIT – SMPIT INSAN HARAPAN BATAM",
  foundationName: "Yayasan Harapan Insan Madani Batam",
  tagline: "SELAMAT DATANG DI INSAN HARAPAN BATAM",
  subTagline: "Membangun Generasi Qurani, Kreatif, Entrepreneur, dan Siap Menghadapi Masa Depan.",
  address: "Jl. Pemuda Sejati No. 12, Kel. Belian, Kec. Batam Kota",
  city: "Kota Batam",
  province: "Kepulauan Riau",
  postalCode: "29464",
  phone: "+62 778 480 1290",
  whatsappPrimary: "6281270001928",
  whatsappPPDB: "6281270001928",
  email: "info@insanharapanbatam.sch.id",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.87955519842!2d104.0044565!3d1.1301416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da9772bf220267%3A0x2f90117b4c44f80!2sBatam%20Center%2C%20Batam%20City%2C%20Riau%20Islands!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid",
  googleMapsUrl: "https://maps.google.com/?q=Batam+Center,+Kota+Batam,+Kepulauan+Riau",
  socials: {
    instagram: "https://instagram.com/insanharapanbatam",
    facebook: "https://facebook.com/insanharapanbatam",
    youtube: "https://youtube.com/@insanharapanbatam",
    tiktok: "https://tiktok.com/@insanharapanbatam"
  },
  legalInfo: {
    npsnRAIT: "69981240 (Izin Kemenag/Disdik)",
    npsnSDIT: "69972351 (Akreditasi A)",
    npsnSMPIT: "69993412 (Akreditasi A)",
    skIzin: "SK Operasional: 421.2/084/DPMPTSP-BTM/2021",
    akreditasi: "Terakreditasi A oleh BAN-S/M",
    afiliasi: "Jaringan Sekolah Islam Terpadu (JSIT) Indonesia"
  },
  vision: "Mewujudkan Generasi Qurani, Kreatif, dan Entrepreneur yang Berakhlak Mulia, Cerdas Berteknologi, serta Siap Memimpin Masa Depan.",
  mission: [
    "Menyelenggarakan pendidikan Islam berbasis keteladanan akhlak dan tahfiz Al-Qur'an (Generasi Qurani).",
    "Mengembangkan iklim belajar aktif, inovatif, saintifik, dan berpikir kritis berbasis alam (Generasi Kreatif).",
    "Menumbuhkan jiwa kepemimpinan mandiri, literasi finansial, dan mental entrepreneur muslim sejak dini (Generasi Entrepreneur).",
    "Mengintegrasikan Kurikulum Nasional, Kurikulum JSIT Indonesia, dan kecakapan teknologi digital modern.",
    "Membangun sinergi kolaboratif yang harmonis antara sekolah, keluarga, dan masyarakat luas."
  ],
  educationalPhilosophy: "Pendidikan di Insan Harapan Batam memandang setiap anak sebagai amanah fitrah yang unik. Melalui pendekatan Islam Terpadu (Integrated Islamic School) dan konsep Nature School, kami mendidik akal dengan ilmu shahih, menuntun jiwa dengan Al-Qur'an dan Sunnah, serta melatih fisik di alam terbuka agar tumbuh menjadi insan mandiri yang bermanfaat bagi semesta (Rahmatan lil 'Alamin).",
  headmasterName: "H. Ahmad Fauzi, M.Pd.I",
  headmasterTitle: "Direktur Pendidikan SIT Insan Harapan Batam",
  headmasterWelcome: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Selamat datang di portal resmi SIT Insan Harapan Batam. Kami menyambut hangat kehadiran ayah, bunda, dan seluruh masyarakat. Di era kemajuan teknologi digital dan tantangan peradaban, kami hadir mendampingi putra-putri kita dengan fondasi akidah yang kokoh, hafalan Al-Qur'an mutqin, karakter adab yang mulia, serta kecakapan sains dan alam yang membumi. Mari bersama melahirkan calon pemimpin masa depan yang berakhlak Qurani."
};

export const EDUCATIONAL_UNITS: EducationalUnit[] = [
  {
    id: "rait",
    name: "RAIT Insan Harapan",
    fullName: "Raudhatul Athfal Islam Terpadu (TK IT)",
    tagline: "Bermain Bahagia, Tumbuh Fitrah, Mencintai Al-Qur'an",
    ageRange: "Usia 4 – 6 Tahun (Playgroup & TK A/B)",
    description: "Pendidikan anak usia dini berbasis fitrah dan sentra alam yang mengutamakan pembiasaan akhlakul karimah, sensorik-motorik seimbang, dan pengenalan Al-Qur'an dengan suasana gembira tanpa paksaan.",
    vision: "Mewujudkan anak usia dini yang sehat, ceria, mandiri, dan mencintai Allah serta Rasul-Nya.",
    highlights: [
      "Sentra Bermain Alam & Eksplorasi Sensori Terbuka",
      "Metode Tahfiz Balita Gembira (Juz 30 Surat-surat Pendek)",
      "Pembiasaan Doa Harian, Wudhu & Gerakan Shalat",
      "Toilet Training & Kemandirian Diri (Practical Life Skills)",
      "Pendidikan Gizi Sehat & Makan Bersama Beradab"
    ],
    curriculum: [
      {
        title: "Kurikulum Fitrah PAUD Islam Terpadu (JSIT)",
        description: "Menjaga kebersihan tauhid, stimulasi fitrah belajar, serta pengenalan adab harian melalui kisah teladan para Nabi dan sahabat."
      },
      {
        title: "Nature & Green Explorative Learning",
        description: "Anak berinteraksi langsung dengan tanah, tanaman, air, dan kebun binatang mini untuk melatih motorik halus, kasar, dan kepekaan rasa."
      },
      {
        title: "Pengenalan Huruf Hijaiyah & Pra-Membaca",
        description: "Metode fonik islami dan media manipulatif sensorik yang menumbuhkan kecintaan membaca tanpa tekanan lembar kerja berlebih."
      }
    ],
    dailyRoutine: [
      { time: "07.30 - 08.00", activity: "Penyambutan Senyum Sapa, Shalat Dhuha Ceria & Ikrar Pagi" },
      { time: "08.00 - 08.45", activity: "Circle Time & Tahfiz Al-Qur'an Juz Amma dengan Metode Gerak dan Lagu" },
      { time: "08.45 - 10.00", activity: "Bermain di Sentra (Sentra Alam, Balok, Peran, atau Kreativitas)" },
      { time: "10.00 - 10.30", activity: "Makan Bekal Sehat Bersama (Adab Makan Islami) & Istirahat Terbimbing" },
      { time: "10.30 - 11.15", activity: "Review Harian, Refleksi Dongeng Karakter & Doa Kepulangan" }
    ],
    targetCompetencies: [
      "Mampu melafalkan surat Al-Fatihah dan 15-20 surat pendek Juz Amma",
      "Mengenal huruf hijaiyah berharakat dan doa harian pokok",
      "Mandiri memakai sepatu, merapikan mainan, dan mencuci tangan sendiri",
      "Percaya diri bersosialisasi dan mengekspresikan imajinasi positif"
    ],
    image: "/src/assets/images/rait_early_childhood_1792641892494.jpg"
  },
  {
    id: "sdit",
    name: "SDIT Insan Harapan",
    fullName: "Sekolah Dasar Islam Terpadu",
    tagline: "Qurani, Cerdas Berpikir, Ramah Alam, dan Berkarakter Juara",
    ageRange: "Usia 7 – 12 Tahun (Kelas 1 – 6 SD)",
    description: "Sekolah dasar Islam terpadu yang memadukan keunggulan Kurikulum Nasional Merdeka dengan Kurikulum JSIT. Mengedepankan pembiasaan ibadah 24 jam, hafalan Al-Qur'an bersanad, sains alam, serta literasi-numerasi terapan.",
    vision: "Mencetak peserta didik yang unggul dalam hafalan Al-Qur'an, cerdas akademik, tangkas di alam, dan berakhlak mulia.",
    highlights: [
      "Target Tahfiz 3 – 5 Juz dengan Tartil dan Tajwid Bersanad",
      "Full Day School Terpadu dengan Shalat Berjamaah & BPI",
      "Outdoor Nature Lab & Sains Percobaan Nyata",
      "Program Bina Pribadi Islami (BPI) & Mentoring Pekanan",
      "Klub Literasi Digital, Matematika Kreatif & Robotic Kids"
    ],
    curriculum: [
      {
        title: "Integrasi Kurikulum Merdeka & Standar JSIT",
        description: "Mata pelajaran umum dikontekstualisasikan dengan nilai tauhid, sehingga sains dan matematika dipahami sebagai ayat-ayat kauniyah Allah SWT."
      },
      {
        title: "Program Tahsin & Tahfiz Intensif Berjenjang",
        description: "Metode bimbingan talaqqi dengan rasio guru dan santri terukur (1:12), dilengkapi buku mutabaah ibadah harian orang tua."
      },
      {
        title: "Project-Based Learning & Nature Camp",
        description: "Siswa terjun ke kebun sekolah dan lingkungan ekologi Batam untuk proyek daur ulang, urban farming, dan eksperimen energi hijau."
      }
    ],
    dailyRoutine: [
      { time: "07.00 - 07.30", activity: "Morning Briefing, Shalat Dhuha Berjamaah & Dzikir Pagi Al-Ma'tsurat" },
      { time: "07.30 - 09.00", activity: "Sesi Intensif Al-Qur'an (Tahsin, Ziyadah & Murojaah Tahfiz)" },
      { time: "09.00 - 11.45", activity: "KBM Terpadu (Tematik, Matematika Logika, Sains & Bahasa)" },
      { time: "11.45 - 13.00", activity: "Makan Siang Bersama, Shalat Zhuhur Berjamaah & Kultum Siswa" },
      { time: "13.00 - 15.00", activity: "Pembelajaran Berbasis Proyek, Literasi, Eksperimen & English Hour" },
      { time: "15.00 - 15.45", activity: "Shalat Ashar Berjamaah, Ekstrakurikuler Pilihan & Doa Penutup" }
    ],
    targetCompetencies: [
      "Hafal minimal 3 Juz Al-Qur'an dengan bacaan tartil standar tajwid",
      "Tertib shalat fardhu 5 waktu tanpa diperintah dan berbakti kepada orang tua",
      "Kecakapan literasi membaca tinggi dan penalaran matematika pemecahan masalah",
      "Memiliki kepedulian lingkungan dan mampu bekerja sama dalam tim proyek"
    ],
    image: "/src/assets/images/sdit_nature_learning_1792641893015.jpg"
  },
  {
    id: "smpit",
    name: "SMPIT Insan Harapan",
    fullName: "Sekolah Menengah Pertama Islam Terpadu",
    tagline: "Membina Pemimpin Tangguh, Cendekia Digital, Berintegritas Global",
    ageRange: "Usia 13 – 15 Tahun (Kelas 7 – 9 SMP)",
    description: "Jenjang lanjutan yang membina remaja muslim di usia emas dengan penguatan identitas akidah, tahfiz Al-Qur'an mendalam, sains teknologi digital, kepemimpinan organisasi, dan ketangkasan hidup.",
    vision: "Melahirkan generasi muda muslim berjiwa transformatif, berwawasan saintifik, dan siap memimpin peradaban bermartabat.",
    highlights: [
      "Target Tahfiz Lanjutan (Total 5 – 10 Juz) & Pemahaman Tadabbur",
      "Digital Maker & STEM Lab (Coding Dasar, Robotika & Multimedia)",
      "Bilingual Environment (Daily Conversation Bahasa Arab & Inggris)",
      "Leadership Camp, Pramuka SIT, & Kewirausahaan Remaja",
      "Bimbingan Minat Karir & Persiapan Masuk SMA/MA Unggulan Nasional"
    ],
    curriculum: [
      {
        title: "Kurikulum Nasional Plus Standar Mutu JSIT",
        description: "Penguasaan sains analitis, matematika tinggi, dan ilmu sosial kritis yang dipadukan dengan syariat dan etika Islam kontemporer."
      },
      {
        title: "Digital Literacy & Artificial Intelligence Ethics",
        description: "Siswa diajarkan bukan hanya memakai gawai, tetapi menciptakan karya digital, riset ilmiah, dan menggunakan teknologi secara bijak."
      },
      {
        title: "Pendidikan Kepemimpinan & Organisasi (OSIS IT & DKR)",
        description: "Melatih public speaking, manajemen kepanitiaan, negosiasi, dan kepedulian sosial melalui aksi nyata kemanusiaan di Batam."
      }
    ],
    dailyRoutine: [
      { time: "06.45 - 07.30", activity: "Kedatangan, Tasmi' Al-Qur'an, Shalat Dhuha & Almatsurat Kubro" },
      { time: "07.30 - 09.30", activity: "Tahfiz & Tahsin Intensif Bersama Asatidz Bersanad" },
      { time: "09.30 - 12.00", activity: "KBM Sains, Matematika Terapan, Bahasa Inggris & Bahasa Arab" },
      { time: "12.00 - 13.15", activity: "Adzan, Shalat Zhuhur Berjamaah, Khutbah Singkat & Makan Siang Sehat" },
      { time: "13.15 - 15.00", activity: "Laboratorium Komputer/Sains, Praktik Coding, Robotika & Riset Siswa" },
      { time: "15.00 - 16.00", activity: "Shalat Ashar Berjamaah, Mentoring Karakter (Halaqah Pekanan) & Pulang" }
    ],
    targetCompetencies: [
      "Hafalan Al-Qur'an bertambah minimal 2-3 Juz (Total 5 - 10 Juz tamat SMP)",
      "Mampu menjadi imam shalat, berkhutbah/ceramah umum, dan berdebat santun",
      "Kecakapan literasi teknologi, riset ilmiah remaja, dan bahasa asing aktif",
      "Jiwa mandiri, berani mengambil keputusan etis, dan kepedulian sosial tinggi"
    ],
    image: "/src/assets/images/smpit_digital_leadership_1792641894305.jpg"
  }
];

export const SCHOOL_PROGRAMS: ProgramItem[] = [
  {
    id: "prog-tahfiz",
    title: "Tahfiz & Pembiasaan Al-Qur'an Bersanad",
    shortDesc: "Bimbingan talaqqi tajwid, setoran ziyadah harian, tasmi' akbar, dan sertifikasi hafalan berjenjang dari RAIT hingga SMPIT.",
    fullDesc: "Program Al-Qur'an dirancang komprehensif mulai dari pengenalan cinta Al-Qur'an di RAIT, hafalan tartil 3-5 Juz di SDIT, hingga pendalaman tajwid dan tadabbur makna ayat di SMPIT. Dipandu oleh asatidz dan ustazah yang memiliki sanad qiraah dan kompetensi pedagogik teruji.",
    category: "Al-Qur'an & Ibadah",
    iconName: "BookOpen",
    targetUnit: "RAIT, SDIT, SMPIT",
    outcomes: ["Hafalan mutqin tartil", "Ujian tasmi' terbuka sekali duduk", "Sertifikat tahfiz berstandar", "Cinta tilawah harian"]
  },
  {
    id: "prog-akhlak",
    title: "Pembinaan Akhlak & Adab Islami 24 Jam",
    shortDesc: "Penerapan adab makan, berbicara, bersosialisasi, menghormati guru, dan birrul walidain yang dimonitor bersama orang tua.",
    fullDesc: "Adab mendahului ilmu. Program ini membiasakan santri menjalankan sunnah harian Rasulullah SAW: salam, senyum, menundukkan pandangan dari gawai negatif, disiplin wudhu, berkata jujur, serta saling tolong menolong tanpa perundungan (anti-bullying).",
    category: "Karakter",
    iconName: "HeartHandshake",
    targetUnit: "RAIT, SDIT, SMPIT",
    outcomes: ["Buku mutabaah adab harian", "Lingkungan sekolah ramah anak", "Hubungan harmonis siswa dan guru", "Birrul walidain di rumah"]
  },
  {
    id: "prog-alam",
    title: "Pembelajaran Berbasis Alam & Green Campus",
    shortDesc: "Pemanfaatan kebun hidroponik, biologi tropis Batam, ecobrick, komposting, dan pembelajaran sains di luar kelas.",
    fullDesc: "SIT Insan Harapan Batam mengadopsi model Nature School di mana alam terbuka menjadi ruang kelas terbesar. Siswa belajar biologi langsung dari daun dan tanah, menghitung matematika dengan ranting dan benih, serta mengerti pentingnya menjaga bumi sebagai khalifah fil ardhi.",
    category: "Lingkungan & Sains",
    iconName: "Trees",
    targetUnit: "Semua Unit",
    outcomes: ["Kebun edukasi mandiri", "Riset sains lingkungan anak", "Pengurangan sampah plastik di sekolah", "Kecerdasan naturalis anak"]
  },
  {
    id: "prog-stem",
    title: "Sains, Teknologi, Robotika & Literasi Digital",
    shortDesc: "Klub coding anak, robotika berbasis Arduino/LEGO, literasi digital cerdas, dan eksperimen laboratorium modern.",
    fullDesc: "Menyiapkan anak menghadapi revolusi industri 4.0 dan era kecerdasan buatan dengan etika Islam yang kuat. Siswa diajarkan algoritma komputasi, cara berpikir kritis membedakan fakta dan hoaks, serta memproduksi konten positif dan proyek robotika terapan.",
    category: "Teknologi & Digital",
    iconName: "Cpu",
    targetUnit: "SDIT & SMPIT",
    outcomes: ["Kejuaraan robotika daerah/nasional", "Aplikasi sederhana karya santri", "Literasi riset digital terarah", "Logika komputasi sejak dini"]
  },
  {
    id: "prog-literasi",
    title: "Literasi Numerasi & Berpikir Kritis (Critical Thinking)",
    shortDesc: "Pojok baca tematik, pojok matematika asyik, riset mini siswa, dan bedah buku inspiratif dua pekanan.",
    fullDesc: "Menumbuhkan daya nalar anak agar terbiasa membaca kritis dan memecahkan persoalan sehari-hari dengan logika matematis. Didukung perpustakaan representatif dan tantangan membaca 'Readathon 30 Hari' yang menyenangkan.",
    category: "Akademik",
    iconName: "Lightbulb",
    targetUnit: "Semua Unit",
    outcomes: ["Peningkatan skor literasi asesmen", "Kemampuan berargumentasi santun", "Portofolio karya tulis siswa", "Budaya membaca mandiri"]
  },
  {
    id: "prog-leader",
    title: "Kepemimpinan, Kewirausahaan & Public Speaking",
    shortDesc: "Kaderisasi pemimpin melalui Pramuka SIT, OSIS IT, market day tahunan, dan latihan pidato tiga bahasa.",
    fullDesc: "Setiap anak adalah calon pemimpin masa depan. Di sini mereka dilatih berbicara di depan umum (muhadharah/public speaking bahasa Indonesia, Arab, dan Inggris), mengelola kas mini usaha di Market Day, serta bertahan di alam lewat kemah kepanduan.",
    category: "Kemandirian",
    iconName: "ShieldCheck",
    targetUnit: "SDIT & SMPIT",
    outcomes: ["Keberanian berbicara di depan publik", "Pengalaman wirausaha Market Day", "Karakter mandiri dan tangguh", "Kecakapan organisasi OSIS IT"]
  },
  {
    id: "prog-bakat",
    title: "Pengembangan Minat, Bakat & Ekstrakurikuler",
    shortDesc: "Pilihan ekskul bervariasi: Memanah sunnah, Taekwondo/Pencak Silat, Futsal, Tari Kreasi Nusantara, Seni Nasyid & Kaligrafi.",
    fullDesc: "Kami meyakini setiap anak memiliki kecerdasan majemuk (multiple intelligences). Sekolah memfasilitasi pelatih bersertifikat untuk mengasah potensi fisik, seni islami, dan ketangkasan olahraga dengan sarana yang memadai.",
    category: "Bakat & Minat",
    iconName: "Trophy",
    targetUnit: "Semua Unit",
    outcomes: ["Juara O2SN & FLS2N Batam", "Fisik sehat dan stamina prima", "Karya seni kaligrafi islami", "Sportivitas dan percaya diri"]
  },
  {
    id: "prog-peduli",
    title: "Kepedulian Sosial & Kemanusiaan (Insan Harapan Peduli)",
    shortDesc: "Pendidikan empati melalui celengan subuh, bantuan bencana alam, santunan dhuafa pesisir Batam, dan donasi Palestina.",
    fullDesc: "Mendidik hati agar peka terhadap penderitaan sesama. Melalui program Insan Harapan Peduli, santri mengelola infaq mandiri, terjun mengunjungi pulau-pulau hinterland di Kepulauan Riau, dan menyalurkan paket kebaikan berkala.",
    category: "Sosial Kemanusiaan",
    iconName: "HandHelping",
    targetUnit: "Semua Unit",
    outcomes: ["Jiwa filantropi sejak belia", "Aksi nyata untuk warga Batam", "Empati sosial kemanusiaan", "Menghargai rezeki dan syukur"]
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Wisuda Tahfiz & Tasmi' Akbar 2026: 120 Santri SIT Insan Harapan Tuntaskan Ujian Hafalan Al-Qur'an",
    slug: "wisuda-tahfiz-tasmi-akbar-2026",
    category: "Keislaman",
    date: "14 Oktober 2026",
    author: "Tim Humas & Media Insan Harapan",
    excerpt: "Suasana haru menyelimuti aula utama ketika para santri memakaikan mahkota kemuliaan simbolis kepada orang tua mereka setelah menyelesaikan tasmi' sekali duduk.",
    content: [
      "Batam – Lembaga Pendidikan SIT Insan Harapan Batam kembali menyelenggarakan agenda akbar tahunan bertajuk 'Wisuda Tahfiz dan Tasmi' Akbar 2026' yang diikuti oleh 120 peserta didik dari jenjang RAIT, SDIT, dan SMPIT di Aula Kampus Utama Batam Kota.",
      "Para santri yang diwisuda telah melalui proses pengujian ketat hafalan Al-Qur'an, mulai dari 1 Juz untuk tingkat RAIT, 3 hingga 5 Juz untuk SDIT, hingga kategori 10 Juz untuk santri jenjang SMPIT.",
      "Direktur Pendidikan SIT Insan Harapan Batam, H. Ahmad Fauzi, M.Pd.I, menyampaikan rasa syukur dan apresiasi tak terhingga kepada para asatidz dan wali murid yang senantiasa bersinergi membimbing ananda di rumah.",
      "'Al-Qur'an bukan sekadar hafalan lisan, melainkan kompas hidup yang membimbing akhlak ananda menjadi generasi berkarakter di tengah derasnya arus digitalisasi saat ini,' tutur beliau dalam sambutannya.",
      "Acara diakhiri dengan penyerahan sertifikat syahadah tahfiz, doa bersama untuk kemaslahatan bangsa, serta pameran karya kaligrafi santri binaan sekolah."
    ],
    image: "/src/assets/images/school_masjid_facility_1792641893431.jpg",
    readTime: "3 menit baca",
    featured: true
  },
  {
    id: "news-2",
    title: "Eksplorasi Nature School: Siswa SDIT Insan Harapan Panen Raya Sayuran Organik & Observasi Biologi Hutan Bakau",
    slug: "eksplorasi-nature-school-panen-sayur-organik",
    category: "Kegiatan Sekolah",
    date: "28 September 2026",
    author: "Ustadz Ridwan Hakim, S.Pd",
    excerpt: "Mengusung kurikulum berbasis alam, para siswa kelas 4 dan 5 belajar siklus fotosintesis langsung di kebun sekolah serta meneliti ekosistem mangrove pesisir Kepri.",
    content: [
      "Batam – Melalui pendekatan Nature School, puluhan siswa kelas 4 dan 5 SDIT Insan Harapan Batam melaksanakan kegiatan panen raya sayuran hidroponik dan tanaman herbal yang mereka rawat sendiri selama dua bulan terakhir.",
      "Kegiatan dilanjutkan dengan mini-ekspedisi observasi biologi ke kawasan konservasi mangrove di pesisir Batam. Siswa dibekali kaca pembesar, modul catatan lapangan, dan bimbingan guru sains.",
      "Kepala Sekolah SDIT menegaskan bahwa interaksi nyata dengan tanah, air, dan tanaman membangkitkan rasa syukur atas ciptaan Allah dan memupuk kepedulian terhadap kelestarian lingkungan sejak masa kanak-kanak."
    ],
    image: "/src/assets/images/sdit_nature_learning_1792641893015.jpg",
    readTime: "4 menit baca",
    featured: false
  },
  {
    id: "news-3",
    title: "Tim Robotika SMPIT Insan Harapan Raih Medali Emas pada Batam Youth STEM & Robotic Championship 2026",
    slug: "tim-robotika-smpit-raih-emas-championship-2026",
    category: "Prestasi Siswa",
    date: "12 September 2026",
    author: "Pembina Ekstrakurikuler STEM",
    excerpt: "Inovasi robot pembersih sampah pesisir otomatis ciptaan santri SMPIT berhasil memikat dewan juri dan menyingkirkan puluhan perwakilan sekolah se-Kepulauan Riau.",
    content: [
      "Batam – Prestasi membanggakan kembali diukir oleh santri SMPIT Insan Harapan Batam. Tim robotika sekolah yang beranggotakan tiga siswa kelas 8 berhasil menyabet Medali Emas kategori Line Tracer & Eco-Robotic pada ajang bergengsi Batam Youth STEM Championship.",
      "Robot rancangan mereka memanfaatkan sensor ultrasonik dan mikroprosesor sederhana untuk mendeteksi serta mengumpulkan botol plastik di permukaan air dangkal.",
      "Keberhasilan ini menjadi bukti nyata bahwa sekolah Islam Terpadu mampu bersaing secara unggul dalam bidang sains dan teknologi modern tanpa mengesampingkan pendidikan ruhiyah keislaman."
    ],
    image: "/src/assets/images/smpit_digital_leadership_1792641894305.jpg",
    readTime: "3 menit baca",
    featured: false
  },
  {
    id: "news-4",
    title: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Gelombang I Resmi Dibuka",
    slug: "ppdb-2026-2027-gelombang-1-resmi-dibuka",
    category: "Pengumuman",
    date: "01 September 2026",
    author: "Panitia PPDB SIT Insan Harapan",
    excerpt: "SIT Insan Harapan Batam membuka pendaftaran santri baru untuk jenjang RAIT, SDIT, dan SMPIT dengan kuota terbatas. Pendaftaran dapat dilakukan secara online.",
    content: [
      "Batam – Panitia Penerimaan Peserta Didik Baru (PPDB) SIT Insan Harapan Batam mengumumkan dibukanya pendaftaran Gelombang I untuk Tahun Ajaran 2026/2027 bagi unit RAIT, SDIT, dan SMPIT.",
      "Mengingat komitmen sekolah dalam menjaga rasio ideal guru dan santri demi efektivitas pembinaan akhlak serta hafalan Al-Qur'an, kuota rombongan belajar setiap unit dibatasi secara ketat.",
      "Para calon orang tua murid diimbau untuk segera mengisi formulir online dan berkonsultasi dengan tim PPDB melalui kanal WhatsApp resmi sekolah sebelum kuota terpenuhi."
    ],
    image: "/src/assets/images/hero_school_campus_1792641892359.jpg",
    readTime: "2 menit baca",
    featured: false
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Kawasan Kampus Hijau & Lingkungan Belajar Terbuka",
    category: "Alam & Lingkungan",
    type: "photo",
    mediaUrl: "/src/assets/images/hero_school_campus_1792641892359.jpg",
    date: "Oktober 2026",
    description: "Suasana pagi hari di kawasan kampus terpadu Insan Harapan Batam dengan pepohonan tropis dan jalur pedestrian ramah anak."
  },
  {
    id: "gal-2",
    title: "Sentra Bermain & Pembiasaan Hijaiyah RAIT Insan Harapan",
    category: "Pembelajaran",
    type: "photo",
    mediaUrl: "/src/assets/images/rait_early_childhood_1792641892494.jpg",
    date: "September 2026",
    description: "Ananda usia dini gembira belajar menyusun huruf Arab dan melatih motorik halus didampingi guru sentra."
  },
  {
    id: "gal-3",
    title: "Outdoor Nature Lab: Siswa SDIT Belajar Botani & Bercocok Tanam",
    category: "Alam & Lingkungan",
    type: "photo",
    mediaUrl: "/src/assets/images/sdit_nature_learning_1792641893015.jpg",
    date: "September 2026",
    description: "Siswa sekolah dasar mengenali jenis-jenis daun, tanah subur, dan merawat tanaman di kebun sains sekolah."
  },
  {
    id: "gal-4",
    title: "Praktikum Laboratorium Robotika & STEM Siswa SMPIT",
    category: "Pembelajaran",
    type: "photo",
    mediaUrl: "/src/assets/images/smpit_digital_leadership_1792641894305.jpg",
    date: "Agustus 2026",
    description: "Kolaborasi santri SMPIT dalam merakit perangkat robotik dan menguji baris kode visual program."
  },
  {
    id: "gal-5",
    title: "Ketenangan Ruang Tahfiz & Shalat Berjamaah Masjid Sekolah",
    category: "Tahfiz & Ibadah",
    type: "photo",
    mediaUrl: "/src/assets/images/school_masjid_facility_1792641893431.jpg",
    date: "Oktober 2026",
    description: "Kegiatan halaqah Al-Qur'an sore hari santri dengan pencahayaan alami yang menenangkan jiwa."
  }
];

export const SCHOOL_FACILITIES: Facility[] = [
  {
    id: "fac-1",
    name: "Masjid & Aula Tahfiz Baitul Quran",
    category: "Ibadah & Ruhiyah",
    description: "Pusat kegiatan ibadah harian berkapasitas 600 jamaah dengan tata udara sejuk, mihrab kayu alami, dan pemandangan taman tropis untuk shalat berjamaah, tasmi' akbar, dan halaqah tahfiz.",
    image: "/src/assets/images/school_masjid_facility_1792641893431.jpg",
    features: ["Kapasitas 600 jamaah", "Sound system akustik jernih", "Area wudhu terpisah & ramah anak", "Ruang halaqah privat"]
  },
  {
    id: "fac-2",
    name: "Laboratorium STEM & Robotika Digital",
    category: "Teknologi & Sains",
    description: "Fasilitas komputer modern terkoneksi jaringan serat optik kecepatan tinggi, modul mikrokontroler Arduino/LEGO education, dan smartboard interaktif.",
    image: "/src/assets/images/smpit_digital_leadership_1792641894305.jpg",
    features: ["36 unit PC spesifikasi modern", "Modul praktikum robotika", "Smartboard multimedia", "Filter internet sehat keluarga"]
  },
  {
    id: "fac-3",
    name: "Kebun Edukasi & Nature Learning Lab",
    category: "Alam & Lingkungan",
    description: "Area hijau seluas 1.200 m² yang memuat kebun hidroponik, bedengan sayur organik, kolam budidaya ikan air tawar, dan rumah kompos untuk riset hayati siswa.",
    image: "/src/assets/images/sdit_nature_learning_1792641893015.jpg",
    features: ["Greenhouse hidroponik", "Bedengan tanaman organik", "Pojok kompos daur ulang", "Kolam bioflok edukasi"]
  },
  {
    id: "fac-4",
    name: "Ruang Sentra Bermain Ramah Anak RAIT",
    category: "Pendidikan Dini",
    description: "Ruang kelas bertema terbuka yang bebas dari sudut tajam, dilengkapi balok kayu edukatif, buku bergambar islami, dan peraga sensorik montessori.",
    image: "/src/assets/images/rait_early_childhood_1792641892494.jpg",
    features: ["Lantai empuk berstandar keselamatan", "Peraga Montessori & Balok Sentra", "Akses langsung ke taman rumput", "Rasio pendamping guru tinggi"]
  },
  {
    id: "fac-5",
    name: "Kampus Terpadu & Lapangan Olahraga Serbaguna",
    category: "Olahraga & Fasilitas Umum",
    description: "Lapangan serbaguna untuk olahraga futsal, basket, bulutangkis, memanah (archery), serta upacara bendera dan kegiatan kepanduan Pramuka SIT.",
    image: "/src/assets/images/hero_school_campus_1792641892359.jpg",
    features: ["Lapangan standar multi-sport", "Lintasan memanah sunnah", "Kantin sehat bebas MSG & pewarna", "Sistem keamanan CCTV 24 Jam"]
  }
];

export const PPDB_SCHEDULES: PPDBSchedule[] = [
  {
    wave: "Gelombang 1 (Early Bird)",
    registrationPeriod: "1 September 2026 – 30 November 2026",
    observationDate: "Setiap Sabtu (Pekan ke-2 & ke-4)",
    announcementDate: "3 hari kerja setelah observasi",
    reRegistrationPeriod: "Maksimal 7 hari setelah pengumuman",
    status: "Dibuka"
  },
  {
    wave: "Gelombang 2 (Reguler)",
    registrationPeriod: "1 Desember 2026 – 28 Februari 2027",
    observationDate: "Setiap Sabtu (Pekan ke-1 & ke-3)",
    announcementDate: "3 hari kerja setelah observasi",
    reRegistrationPeriod: "Maksimal 7 hari setelah pengumuman",
    status: "Segera Dibuka"
  },
  {
    wave: "Gelombang 3 (Jika Kuota Tersedia)",
    registrationPeriod: "1 Maret 2027 – 30 April 2027",
    observationDate: "Sesuai jadwal panggilan",
    announcementDate: "Sesuai jadwal panggilan",
    reRegistrationPeriod: "Maksimal 5 hari setelah pengumuman",
    status: "Ditutup"
  }
];

export const PPDB_FEES: PPDBFee[] = [
  {
    unit: "rait",
    unitName: "RAIT (TK IT)",
    formFee: 250000,
    infaqGedung: 4500000,
    monthlySPP: 450000,
    activitiesAndUniform: 2200000,
    notes: "Sudah mencakup 4 stel seragam, perlengkapan sentra setahun, buku panduan hijaiyah, dan tes kematangan anak."
  },
  {
    unit: "sdit",
    unitName: "SDIT (Sekolah Dasar)",
    formFee: 350000,
    infaqGedung: 7500000,
    monthlySPP: 750000,
    activitiesAndUniform: 3600000,
    notes: "Sudah termasuk 5 stel seragam lengkap, buku teks Kurikulum Merdeka + JSIT, mutabaah ibadah, dan makan siang sehat."
  },
  {
    unit: "smpit",
    unitName: "SMPIT (Sekolah Menengah)",
    formFee: 400000,
    infaqGedung: 8500000,
    monthlySPP: 850000,
    activitiesAndUniform: 3900000,
    notes: "Sudah termasuk 5 stel seragam, jas almamater, atribut Pramuka SIT, kartu lab STEM, makan siang harian, dan leadership camp."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    parentName: "Bunda Rina Wardhani, S.T.",
    profession: "Wali Murid SDIT (Kelas 3 & Kelas 5)",
    childLevel: "Orang Tua Siswa SDIT",
    message: "Alhamdulillah, sejak bersekolah di SDIT Insan Harapan, hafalan surat ananda bertambah sangat pesat dengan tajwid yang fasih. Yang paling menyentuh hati saya, adabnya di rumah sangat santun, shalat lima waktu selalu minta berjamaah tanpa disuruh. Program alamnya juga membuat anak tidak melulu terpaku pada gawai."
  },
  {
    id: "testi-2",
    parentName: "Ayahanda Hendra Kusuma",
    profession: "Wali Murid SMPIT (Kelas 8)",
    childLevel: "Orang Tua Siswa SMPIT",
    message: "Mencari sekolah SMP di Batam yang seimbang antara agama dan teknologi awalnya tidak mudah. Di SMPIT Insan Harapan, anak saya dididik menjadi mandiri di leadership camp dan justru berprestasi di klub robotika. Bimbingan para asatidz begitu dekat dan peduli seperti keluarga sendiri."
  },
  {
    id: "testi-3",
    parentName: "Bunda Dian Anggraini",
    profession: "Wali Murid RAIT (TK B)",
    childLevel: "Orang Tua Siswa RAIT",
    message: "Anak saya sangat betah di RAIT. Gurunya sabar dan ramah luar biasa. Belajar Al-Qur'an dikemas lewat lagu dan bermain balok kayu, jadi anak tidak merasa tertekan sama sekali. Pulang sekolah selalu antusias menceritakan pengalaman bercocok tanam dan memberi makan kelinci di kebun sekolah."
  }
];

export const INITIAL_REGISTRATIONS: PPDBRegistration[] = [
  {
    id: "REG-2026-001",
    registrationNumber: "IH-2026-001",
    candidateName: "Muhammad Al-Fatih Pratama",
    unit: "sdit",
    academicYear: "2026/2027",
    parentName: "Rahmat Pratama",
    parentWhatsapp: "081270001928",
    parentEmail: "rahmat.pratama@gmail.com",
    previousSchool: "TK Islam Terpadu Al-Fatih Batam",
    notes: "Pernah menghafal Juz 30 di jenjang TK, ingin masuk kelas akselerasi tahfiz.",
    submittedAt: "2026-10-15 09:20",
    status: "Terverifikasi"
  },
  {
    id: "REG-2026-002",
    registrationNumber: "IH-2026-002",
    candidateName: "Aisyah Nur Salsabila",
    unit: "smpit",
    academicYear: "2026/2027",
    parentName: "Dr. Hendri Santoso",
    parentWhatsapp: "081364551234",
    parentEmail: "hendri.santoso@yahoo.com",
    previousSchool: "SDIT Insan Harapan Batam",
    notes: "Alumni SDIT, ingin melanjutkan program tahfiz 10 Juz dan klub STEM.",
    submittedAt: "2026-10-18 14:10",
    status: "Lulus Seleksi"
  },
  {
    id: "REG-2026-003",
    registrationNumber: "IH-2026-003",
    candidateName: "Bilal Umar Al-Habsyi",
    unit: "rait",
    academicYear: "2026/2027",
    parentName: "Nurul Hidayati",
    parentWhatsapp: "081928374650",
    parentEmail: "nurul.hidayati@gmail.com",
    previousSchool: "Playgroup Bunda Kasih",
    notes: "Usia saat ini 4 tahun 8 bulan, siap masuk kelas TK A.",
    submittedAt: "2026-10-20 11:45",
    status: "Menunggu Verifikasi"
  }
];
