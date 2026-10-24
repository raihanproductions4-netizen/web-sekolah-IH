/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Student, SPPInvoice } from '../../types/spp';
import { formatRupiah } from '../../utils/sppHelpers';
import { useSPP } from '../../context/SPPContext';
import { Send, X, Phone, MessageSquare, Check, Sparkles } from 'lucide-react';

interface WhatsAppReminderModalProps {
  student: Student | null;
  unpaidInvoices: SPPInvoice[];
  onClose: () => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  student,
  unpaidInvoices,
  onClose,
}) => {
  const { settings, updateFollowUp } = useSPP();

  if (!student) return null;

  const totalTunggakan = unpaidInvoices.reduce((acc, inv) => acc + inv.sisaTagihan, 0);
  const periodeListStr = unpaidInvoices.map((i) => i.namaBulan).join(', ');

  const getUnitFull = (unit: string) => {
    if (unit === 'rait') return 'RAIT Insan Harapan Batam';
    if (unit === 'smpit') return 'SMPIT Insan Harapan Batam';
    return 'SDIT Insan Harapan Batam';
  };

  const defaultTemplate = `Assalamu’alaikum warahmatullahi wabarakatuh.

Bapak/Ibu Orang Tua/Wali dari ananda *${student.namaLengkap}* (${getUnitFull(student.unit)} - Kelas ${student.kelas}),

Kami dari bagian administrasi keuangan *SIT Insan Harapan (Yayasan Harapan Ibu Kepri)* menginformasikan bahwa berdasarkan catatan administrasi sekolah, terdapat tagihan SPP periode *${periodeListStr}* dengan total kewajiban *${formatRupiah(totalTunggakan)}* yang belum tercatat lunas.

Mohon kesediaannya untuk memeriksa informasi tersebut. Pembayaran dapat dilakukan via transfer ke rekening resmi Yayasan Harapan Ibu Kepri:
1. *Bank Syariah Indonesia (BSI)*: 7123-4567-89 a.n. Yayasan Harapan Ibu Kepri
2. *Bank Riau Kepri Syariah*: 101-234-5678 a.n. SIT Insan Harapan Batam

Atau langsung di loket kasir sekolah pada jam operasional kerja (Senin - Jumat 07.30 - 15.00 WIB).

Apabila pembayaran telah dilakukan, mohon kirimkan bukti transfer ke nomor ini agar dapat kami verifikasi dan terbitkan kuitansi resminya.

Terima kasih atas perhatian, kerja sama, dan kepercayaan yang diberikan kepada SIT Insan Harapan.

Jazakumullahu khairan katsiran.
Wassalamu’alaikum warahmatullahi wabarakatuh.

_Bagian Administrasi Keuangan SIT Insan Harapan_
_${settings.alamatYayasan}_`;

  const [message, setMessage] = useState<string>(defaultTemplate);
  const [phoneNumber, setPhoneNumber] = useState<string>(student.noWhatsapp);

  const handleSendWA = () => {
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    const finalPhone = clean.startsWith('0') ? '62' + clean.slice(1) : clean;
    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;

    // Update follow up status
    updateFollowUp(
      student.id,
      'Sudah Dikirim Pesan WA',
      `Terkirim pesan pengingat SPP periode ${periodeListStr} (Total: ${formatRupiah(totalTunggakan)})`
    );

    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-800/80 border border-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Kirim Pengingat Tagihan SPP (WhatsApp)</h3>
              <p className="text-emerald-200 text-xs">Pesan sopan & terformat resmi bernuansa Islami</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-stone-700">
          {/* Target Student Box */}
          <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
            <div>
              <span className="text-stone-400 block text-[11px]">Nama Siswa & Jenjang:</span>
              <span className="font-bold text-stone-900 text-sm">{student.namaLengkap}</span>
              <span className="block text-stone-500 text-[11px]">
                {student.unit.toUpperCase()} • Kelas {student.kelas} (NIS: {student.nis})
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Total Tunggakan:</span>
              <span className="font-extrabold text-amber-700 text-base">{formatRupiah(totalTunggakan)}</span>
              <span className="block text-stone-500 text-[11px]">
                {unpaidInvoices.length} Bulan ({periodeListStr})
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Nomor WhatsApp Orang Tua / Wali:
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Contoh: 081270001928"
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Nama Wali: <strong>{student.namaOrangTua}</strong>
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-800">
                Isi Draf Pesan (Dapat Disesuaikan):
              </label>
              <button
                type="button"
                onClick={() => setMessage(defaultTemplate)}
                className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-medium"
              >
                <Sparkles className="w-3 h-3" /> Kembalikan Format Standar
              </button>
            </div>
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-stone-300 rounded-xl text-xs font-mono leading-relaxed text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-stone-50/50"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start gap-2.5">
            <span className="font-bold text-amber-700 mt-0.5">•</span>
            <div>
              <strong>Catatan Petugas:</strong> Pesan ini tidak terkirim otomatis di belakang layar.
              Ketika Anda menekan <em>"Buka WhatsApp & Kirim Pesan"</em>, aplikasi WhatsApp (Web / Mobile) akan terbuka secara langsung dengan teks yang sudah siap dikirim untuk ditinjau oleh petugas.
            </div>
          </div>
        </div>

        <div className="bg-stone-100 px-6 py-3.5 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-200 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSendWA}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-900/10 transition"
          >
            <Send className="w-3.5 h-3.5" />
            Buka WhatsApp & Kirim Pesan
          </button>
        </div>
      </div>
    </div>
  );
};
