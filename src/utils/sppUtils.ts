export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

export function formatIndoDate(dateStr?: string, includeTime: boolean = false): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(date.getTime())) return dateStr;

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }

    return date.toLocaleDateString('id-ID', options);
  } catch {
    return dateStr;
  }
}

const satuan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];

export function terbilang(n: number): string {
  n = Math.floor(Math.abs(n));
  if (n === 0) return 'Nol Rupiah';

  function convert(num: number): string {
    if (num < 12) return satuan[num];
    if (num < 20) return convert(num - 10) + ' Belas';
    if (num < 100) return convert(Math.floor(num / 10)) + ' Puluh ' + convert(num % 10);
    if (num < 200) return 'Seratus ' + convert(num - 100);
    if (num < 1000) return convert(Math.floor(num / 100)) + ' Ratus ' + convert(num % 100);
    if (num < 2000) return 'Seribu ' + convert(num - 1000);
    if (num < 1000000) return convert(Math.floor(num / 1000)) + ' Ribu ' + convert(num % 1000);
    if (num < 1000000000) return convert(Math.floor(num / 1000000)) + ' Juta ' + convert(num % 1000000);
    if (num < 1000000000000) return convert(Math.floor(num / 1000000000)) + ' Milyar ' + convert(num % 1000000000);
    return convert(Math.floor(num / 1000000000000)) + ' Triliun ' + convert(num % 1000000000000);
  }

  return (convert(n).replace(/\s+/g, ' ').trim() + ' Rupiah');
}

export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const processCell = (cell: string | number) => {
    let str = cell === null || cell === undefined ? '' : String(cell);
    str = str.replace(/"/g, '""');
    if (str.search(/("|,|\n)/g) >= 0) {
      str = `"${str}"`;
    }
    return str;
  };

  const csvContent = '\uFEFF' + [
    headers.map(processCell).join(','),
    ...rows.map((row) => row.map(processCell).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCsv(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}
