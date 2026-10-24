/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useSPP } from '../../context/SPPContext';
import { Scholarship } from '../../types/spp';
import { formatRupiah } from '../../utils/sppHelpers';
import {
  Award,
  Plus,
  CheckCircle,
  Clock,
  Sparkles,
  Users,
  Edit2,
  X,
  FileCheck,
} from 'lucide-react';

export const SPPScholarshipsView: React.FC = () => {
  const { scholarships, addScholarship, updateScholarship, students } = useSPP();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    tipe: 'persentase' as Scholarship['tipe'],
    nilai: 50,
    keterangan: '',
    syarat: '',
    status: 'aktif' as 'aktif' | 'nonaktif',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    addScholarship(formData);
    setIsModalOpen(false);
    setFormData({
      nama: '',
      tipe: 'persentase',
      nilai: 50,
      keterangan: '',
      syarat: '',
      status: 'aktif',
    });
  };

  // Find students with scholarship
  const scholarshipRecipients = students.filter((s) => s.potonganSPP > 0 || s.beasiswaId);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900">Pengelolaan Beasiswa & Keringanan SPP</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {scholarships.length} Skema Beasiswa
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Skema beasiswa tahfidz Qur'an, santunan yatim/dhuafa yayasan, apresiasi putra guru, dan potongan nominal tetap.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Program Beasiswa</span>
        </button>
      </div>

      {/* Program Beasiswa Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scholarships.map((sch) => {
          // count how many students currently use this
          const activeStudentsCount = students.filter(
            (s) => s.beasiswaId === sch.id && s.status === 'aktif'
          ).length;

          return (
            <div
              key={sch.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {sch.tipe}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Aktif
                  </span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug">{sch.nama}</h3>
                <div className="text-xl font-black text-amber-700 font-mono mt-2">
                  {sch.tipe === 'penuh'
                    ? '100% (Bebas Biaya)'
                    : sch.tipe === 'persentase'
                    ? `${sch.nilai}% Potongan`
                    : formatRupiah(sch.nilai)}
                </div>

                <p className="text-xs text-stone-500 mt-2 leading-relaxed">{sch.keterangan}</p>

                <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] text-stone-600">
                  <strong className="text-stone-800 block mb-0.5">Syarat Ketentuan:</strong>
                  <span>{sch.syarat}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-700" />
                  <span><strong>{activeStudentsCount}</strong> Siswa Penerima</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daftar Siswa Penerima Beasiswa Saat Ini */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Daftar Siswa Penerima Keringanan Aktif</h3>
            <p className="text-xs text-stone-500">
              Total {scholarshipRecipients.length} siswa mendapatkan subsidi dari Yayasan Harapan Ibu Kepri
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-stone-700">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">No. Induk</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Jenjang & Kelas</th>
                <th className="py-3 px-4">Nama Program Beasiswa</th>
                <th className="py-3 px-4 text-right">Tarif Asli</th>
                <th className="py-3 px-4 text-right">Potongan Disetujui</th>
                <th className="py-3 px-4 text-right">Kewajiban SPP/Bulan</th>
                <th className="py-3 px-4">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {scholarshipRecipients.map((stu) => {
                const finalNominal = Math.max(0, stu.tarifSPP - (stu.potonganSPP || 0));

                return (
                  <tr key={stu.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{stu.nis}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{stu.namaLengkap}</div>
                      <div className="text-[10px] text-stone-400">Wali: {stu.namaOrangTua}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 mr-1.5">
                        {stu.unit.toUpperCase()}
                      </span>
                      <span>{stu.kelas}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-800">
                      {stu.namaBeasiswa || 'Keringanan Khusus'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-stone-400 line-through">
                      {formatRupiah(stu.tarifSPP)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                      -{formatRupiah(stu.potonganSPP)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-900 text-sm">
                      {formatRupiah(finalNominal)}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {stu.catatan || 'Surat Keputusan Yayasan disetujui'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Program Beasiswa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-emerald-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm">Tambah Program Beasiswa Baru</h3>
                <p className="text-emerald-200 text-xs">Yayasan Harapan Ibu Kepri</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg hover:bg-emerald-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs text-stone-700">
              <div>
                <label className="block font-semibold mb-1">Nama Program Beasiswa:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Beasiswa Juara Sains & Robotika"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Tipe Pembebasan:</label>
                  <select
                    value={formData.tipe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipe: e.target.value as Scholarship['tipe'],
                        nilai: e.target.value === 'penuh' ? 100 : formData.nilai,
                      })
                    }
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="persentase">Potongan Persentase (%)</option>
                    <option value="nominal">Potongan Nominal Tetap (Rp)</option>
                    <option value="penuh">Beasiswa Penuh 100% (Bebas Biaya)</option>
                    <option value="sementara">Keringanan Sementara</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Nilai ({formData.tipe === 'persentase' ? '%' : 'Rp'}):
                  </label>
                  <input
                    type="number"
                    disabled={formData.tipe === 'penuh'}
                    value={formData.nilai}
                    onChange={(e) => setFormData({ ...formData, nilai: Number(e.target.value) })}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Keterangan Singkat:</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Keterangan alokasi beasiswa dan tujuan..."
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Syarat & Ketentuan Pengajuan:</label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Sertifikat kejuaraan / Surat keterangan dhuafa..."
                  value={formData.syarat}
                  onChange={(e) => setFormData({ ...formData, syarat: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="bg-stone-100 px-6 py-3.5 -mx-6 -mb-6 mt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600 hover:bg-stone-200 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  Simpan Program Beasiswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
