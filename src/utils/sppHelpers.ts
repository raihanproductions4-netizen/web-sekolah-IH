import { SPPInvoice, InvoiceStatus } from '../types/spp';

// Deteksi status faktual tagihan (Lunas, Dibayar Sebagian, Belum Bayar, atau Terlambat)
export function getInvoiceDisplayStatus(inv: SPPInvoice): {
  status: InvoiceStatus;
  label: string;
  isOverdue: boolean;
} {
  if (inv.status === 'lunas' || inv.sisaTagihan === 0) {
    return { status: 'lunas', label: 'Lunas', isOverdue: false };
  }
  if (inv.status === 'bebas') {
    return { status: 'bebas', label: 'Beasiswa Penuh', isOverdue: false };
  }

  // Cek tanggal jatuh tempo
  const now = new Date();
  const dueDate = new Date(inv.jatuhTempo);
  const isPastDue = !isNaN(dueDate.getTime()) && dueDate < now;

  if (isPastDue || inv.status === 'terlambat') {
    return {
      status: 'terlambat',
      label: 'Terlambat',
      isOverdue: true,
    };
  }

  if (inv.terbayar > 0) {
    return {
      status: 'sebagian',
      label: 'Dibayar Sebagian',
      isOverdue: false,
    };
  }

  return {
    status: 'belum_bayar',
    label: 'Belum Bayar',
    isOverdue: false,
  };
}

// Format nominal Rupiah (contoh: Rp 450.000)
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('IDR', 'Rp');
}

// Format format tanggal Indonesia (contoh: 21 Oktober 2026 atau 21/10/2026)
export function formatTanggalIndo(dateStr?: string, withTime = false): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...(withTime ? { hour: '2-digit', minute: '2-digit', hour12: false } : {}),
    };
    return new Intl.DateTimeFormat('id-ID', options).format(d);
  } catch {
    return dateStr;
  }
}

// Terbilang dalam Bahasa Indonesia (contoh: Empat Ratus Lima Puluh Ribu Rupiah)
export function terbilangRupiah(nominal: number): string {
  if (nominal === 0) return 'Nol Rupiah';

  const angka = Math.abs(nominal);
  const huruf = [
    '',
    'Satu',
    'Dua',
    'Tiga',
    'Empat',
    'Lima',
    'Enam',
    'Tujuh',
    'Delapan',
    'Sembilan',
    'Sepuluh',
    'Sebelas',
  ];

  function convert(n: number): string {
    if (n < 12) {
      return huruf[n];
    } else if (n < 20) {
      return convert(n - 10) + ' Belas';
    } else if (n < 100) {
      return convert(Math.floor(n / 10)) + ' Puluh ' + convert(n % 10);
    } else if (n < 200) {
      return 'Seratus ' + convert(n - 100);
    } else if (n < 1000) {
      return convert(Math.floor(n / 100)) + ' Ratus ' + convert(n % 100);
    } else if (n < 2000) {
      return 'Seribu ' + convert(n - 1000);
    } else if (n < 1000000) {
      return convert(Math.floor(n / 1000)) + ' Ribu ' + convert(n % 1000);
    } else if (n < 1000000000) {
      return convert(Math.floor(n / 1000000)) + ' Juta ' + convert(n % 1000000);
    } else if (n < 1000000000000) {
      return convert(Math.floor(n / 1000000000)) + ' Miliar ' + convert(n % 1000000000);
    }
    return '';
  }

  const result = convert(angka).replace(/\s+/g, ' ').trim();
  return `${result} Rupiah`;
}

// Format nomor WhatsApp internasional (62xxx)
export function getCleanWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
}

// Generate link WhatsApp resmi yang sopan sesuai format yayasan
export function generateWhatsAppReminderLink(
  phone: string,
  namaSiswa: string,
  periodeStr: string,
  totalTunggakan: number,
  unitName: string
): string {
  const normalizedPhone = getCleanWhatsAppNumber(phone);


  const defaultMsg = `Assalamu’alaikum warahmatullahi wabarakatuh.

Bapak/Ibu Orang Tua/Wali dari ananda *${namaSiswa}* (${unitName}),

Kami dari bagian administrasi keuangan *SIT Insan Harapan (Yayasan Harapan Ibu Kepri)* menginformasikan bahwa berdasarkan catatan administrasi sekolah, terdapat tagihan SPP periode *${periodeStr}* dengan total kewajiban *${formatRupiah(totalTunggakan)}* yang belum tercatat lunas.

Mohon kesediaannya untuk memeriksa informasi tersebut. Pembayaran dapat dilakukan via transfer ke rekening resmi Yayasan Harapan Ibu Kepri:
- *Bank Syariah Indonesia (BSI)*: 7123-4567-89 a.n. Yayasan Harapan Ibu Kepri
- *Bank Riau Kepri Syariah*: 101-234-5678 a.n. SIT Insan Harapan Batam

Atau langsung di loket kasir sekolah pada jam operasional (07.30 - 15.00 WIB). Apabila telah melakukan pembayaran, mohon konfirmasi dengan mengirimkan bukti transfer ke nomor ini.

Terima kasih atas perhatian, kerja sama, dan amanah yang diberikan kepada SIT Insan Harapan.

Jazakumullahu khairan katsiran.
Wassalamu’alaikum warahmatullahi wabarakatuh.
_Bagian Keuangan & Administrasi SPP SIT Insan Harapan_`;

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(defaultMsg)}`;
}

// Ekspor array of objects ke CSV (dapat dibuka di Excel)
export function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;

  const separator = ',';
  const keys = Object.keys(rows[0]);

  const csvContent =
    '\uFEFF' + // UTF-8 BOM agar aksen dan karakter khusus tampil rapi di Excel
    keys.map((k) => `"${k.replace(/"/g, '""')}"`).join(separator) +
    '\n' +
    rows
      .map((row) => {
        return keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? '' : String(row[k]);
            cell = cell.replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
