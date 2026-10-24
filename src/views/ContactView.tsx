import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  Instagram,
  Facebook,
  Youtube
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { schoolProfile, generateWhatsAppUrl, showToast } = useApp();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Pertanyaan Umum',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      showToast('Mohon lengkapi nama, nomor telepon, dan pesan Anda.', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Pesan Anda berhasil diterima! Tim Humas akan segera menghubungi Anda.', 'success');
  };

  const handleForwardToWhatsApp = () => {
    const text = `Assalamu'alaikum Humas SIT Insan Harapan Batam,

Nama: ${form.name}
No. HP: ${form.phone}
Email: ${form.email || '-'}
Perihal: ${form.subject}

Pesan:
${form.message}

Terima kasih.`;
    const url = generateWhatsAppUrl(text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-2">
            <span>Sekretariat & Informasi</span>
            <span aria-hidden="true">·</span>
            <span>Insan Harapan Batam</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">
            Hubungi & Kunjungi Kampus Kami
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Pintu komunikasi kami senantiasa terbuka untuk menyambut pertanyaan, kunjungan observasi, maupun konsultasi pendidikan ananda bersama tim asatidz.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Alamat */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-2">
                Alamat Kampus
              </h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                {schoolProfile.address}, Kelurahan Belian, Kecamatan Batam Kota, {schoolProfile.city}, {schoolProfile.province} {schoolProfile.postalCode}
              </p>
            </div>
            <a
              href={schoolProfile.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Buka Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: WhatsApp PPDB */}
          <div className="bg-white p-6 rounded-3xl border-2 border-emerald-600 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-2">
                WhatsApp PPDB & Konsultasi
              </h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                Layanan cepat untuk pendaftaran santri baru, jadwal observasi, dan rincian biaya.
              </p>
              <p className="font-mono text-sm font-bold text-emerald-800 mt-2">
                +{schoolProfile.whatsappPPDB}
              </p>
            </div>
            <a
              href={generateWhatsAppUrl("Assalamu'alaikum Admin PPDB Insan Harapan Batam, saya ingin berkonsultasi mengenai pendaftaran santri baru.")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Chat WhatsApp Langsung</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Telepon & Email */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-2">
                Telepon & Surel Resmi
              </h4>
              <p className="text-stone-600 text-xs">
                <strong>Telp Kantor:</strong> {schoolProfile.phone}
              </p>
              <p className="text-stone-600 text-xs mt-1">
                <strong>Email:</strong> {schoolProfile.email}
              </p>
            </div>
            <a
              href={`mailto:${schoolProfile.email}`}
              className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Kirim Email</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Jam Operasional */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-stone-900 mb-2">
                Jam Layanan Kantor
              </h4>
              <p className="text-stone-600 text-xs leading-relaxed">
                <strong>Senin – Jumat:</strong> 07.30 – 16.00 WIB
              </p>
              <p className="text-stone-600 text-xs leading-relaxed mt-1">
                <strong>Sabtu:</strong> 08.00 – 12.00 WIB (Piket/Survei)
              </p>
              <p className="text-stone-400 text-[11px] mt-1">
                Ahad & Libur Nasional: Tutup
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-medium mt-4">
              Pendaftaran online aktif 24 jam
            </span>
          </div>
        </div>

        {/* Map & Inquiry Form Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Google Maps Interactive Embed */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  Lokasi Kampus SIT Insan Harapan Batam
                </h3>
                <p className="text-xs text-stone-500">
                  Kecamatan Batam Kota, Kota Batam, Kepulauan Riau
                </p>
              </div>
              <a
                href={schoolProfile.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>Perbesar Peta</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex-1 min-h-[360px] bg-stone-100">
              <iframe
                title="Google Maps Lokasi Insan Harapan Batam"
                src={schoolProfile.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '360px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="p-5 bg-stone-50 border-t border-stone-100 text-xs text-stone-600 flex items-center justify-between">
              <span>Akses mudah via Batam Center & Botania</span>
              <span className="text-emerald-700 font-medium">Tersedia parkir kendaraan luas</span>
            </div>
          </div>

          {/* Right: Direct Question Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>FORMULIR PERTANYAAN & KONSULTASI</span>
              </div>
              <h3 className="text-2xl font-bold text-stone-900 mb-2">
                Kirim Pesan ke Tim Humas
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-6">
                Punya pertanyaan mengenai program sekolah, syarat masuk, atau biaya? Tuliskan pesan Anda di bawah ini.
              </p>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                    <Send className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-base text-emerald-950">
                    Alhamdulillah, Pesan Anda Terkirim!
                  </h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto">
                    Tim administrasi kami akan menindaklanjuti pesan Anda. Untuk respon yang lebih cepat, Anda juga bisa meneruskannya langsung via WhatsApp:
                  </p>
                  <button
                    onClick={handleForwardToWhatsApp}
                    className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Teruskan Pesan ke WhatsApp</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Ayah/Bunda"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Nomor WhatsApp / HP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Contoh: 081270001928"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Alamat Email (Opsional)
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Topik Konsultasi
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                    >
                      <option value="Pertanyaan PPDB 2026/2027">Pertanyaan PPDB 2026/2027</option>
                      <option value="Rincian Biaya & Infaq Gedung">Rincian Biaya & Infaq Gedung</option>
                      <option value="Permintaan Kunjungan / School Tour">Permintaan Kunjungan / School Tour</option>
                      <option value="Program Tahfiz & Kurikulum">Program Tahfiz & Kurikulum</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Pesan Pertanyaan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tuliskan pertanyaan atau hal yang ingin Anda ketahui..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm border border-orange-400/40"
                    >
                      <Send className="w-4 h-4 text-emerald-100" />
                      <span>Kirimkan Pesan Sekarang</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleForwardToWhatsApp}
                      className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      title="Kirim langsung lewat WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span className="hidden sm:inline">Kirim via WA</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Social Media Footer inside card */}
            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Ikuti media sosial resmi:</span>
              <div className="flex items-center gap-2 text-stone-600">
                <a
                  href={schoolProfile.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors"
                >
                  Instagram
                </a>
                <span>·</span>
                <a
                  href={schoolProfile.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors"
                >
                  Facebook
                </a>
                <span>·</span>
                <a
                  href={schoolProfile.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-700 transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
