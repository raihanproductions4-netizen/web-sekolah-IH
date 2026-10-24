/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SPPInvoice, SPPTransaction } from '../../types/spp';
import { formatRupiah } from '../../utils/sppHelpers';

interface ChartsProps {
  invoices: SPPInvoice[];
  transactions: SPPTransaction[];
}

export const SPPCharts: React.FC<ChartsProps> = ({ invoices, transactions }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Month labels for school year July -> June
  const schoolMonths = [
    { num: 7, label: 'Juli', key: '07' },
    { num: 8, label: 'Agustus', key: '08' },
    { num: 9, label: 'September', key: '09' },
    { num: 10, label: 'Oktober', key: '10' },
    { num: 11, label: 'November', key: '11' },
    { num: 12, label: 'Desember', key: '12' },
    { num: 1, label: 'Januari', key: '01' },
    { num: 2, label: 'Februari', key: '02' },
    { num: 3, label: 'Maret', key: '03' },
    { num: 4, label: 'April', key: '04' },
    { num: 5, label: 'Mei', key: '05' },
    { num: 6, label: 'Juni', key: '06' },
  ];

  // Calculate actual revenue per month from successful transactions
  const monthlyData = schoolMonths.map((m) => {
    // Total Tagihan formed for this month
    const totalBilled = invoices
      .filter((inv) => inv.bulan === m.num)
      .reduce((sum, inv) => sum + inv.totalTagihan, 0);

    // Total Paid collected for this month's invoices
    const totalCollected = invoices
      .filter((inv) => inv.bulan === m.num)
      .reduce((sum, inv) => sum + inv.terbayar, 0);

    // Arrears for this month
    const totalArrears = invoices
      .filter((inv) => inv.bulan === m.num)
      .reduce((sum, inv) => sum + inv.sisaTagihan, 0);

    return {
      monthLabel: m.label,
      monthNum: m.num,
      billed: totalBilled,
      collected: totalCollected,
      arrears: totalArrears,
      rate: totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0,
    };
  });

  const maxRevenue = Math.max(...monthlyData.map((d) => Math.max(d.billed, d.collected)), 2500000);

  // Unit Breakdown
  const units = ['rait', 'sdit', 'smpit'] as const;
  const unitStats = units.map((u) => {
    const unitInvoices = invoices.filter((i) => i.unit === u);
    const unitCollected = unitInvoices.reduce((acc, i) => acc + i.terbayar, 0);
    const unitBilled = unitInvoices.reduce((acc, i) => acc + i.totalTagihan, 0);
    const unitArrears = unitInvoices.reduce((acc, i) => acc + i.sisaTagihan, 0);
    return {
      unit: u,
      name: u === 'rait' ? 'RAIT' : u === 'sdit' ? 'SDIT' : 'SMPIT',
      collected: unitCollected,
      billed: unitBilled,
      arrears: unitArrears,
      color: u === 'rait' ? '#059669' : u === 'sdit' ? '#0284c7' : '#d97706',
    };
  });

  const totalCollectedAll = unitStats.reduce((a, b) => a + b.collected, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Penerimaan SPP per Bulan (Bar Chart) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Grafik Penerimaan SPP per Bulan</h3>
            <p className="text-xs text-stone-500">Realisasi kas masuk tahun ajaran berjalan (Juli - Juni)</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-stone-600">
              <span className="w-3 h-3 rounded-sm bg-emerald-700"></span> Realisasi Diterima
            </span>
            <span className="flex items-center gap-1.5 text-stone-600">
              <span className="w-3 h-3 rounded-sm bg-stone-200"></span> Target Tagihan
            </span>
          </div>
        </div>

        {/* SVG / HTML Bar Chart */}
        <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2 pt-6 pb-2 border-b border-stone-200">
          {monthlyData.map((d, idx) => {
            const collectedHeight = Math.max(4, Math.round((d.collected / maxRevenue) * 100));
            const billedHeight = Math.max(4, Math.round((d.billed / maxRevenue) * 100));
            const isHovered = activeTooltip === `rev-${idx}`;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                onMouseEnter={() => setActiveTooltip(`rev-${idx}`)}
                onMouseLeave={() => setActiveTooltip(null)}
              >
                {/* Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full mb-2 z-20 bg-stone-900 text-white text-[11px] rounded-lg p-2.5 shadow-xl min-w-[150px] pointer-events-none transform -translate-x-1/2 left-1/2">
                    <div className="font-bold text-amber-300 border-b border-stone-700 pb-1 mb-1">
                      Bulan {d.monthLabel}
                    </div>
                    <div className="flex justify-between gap-2 text-stone-300">
                      <span>Diterima:</span>
                      <span className="font-bold text-white">{formatRupiah(d.collected)}</span>
                    </div>
                    <div className="flex justify-between gap-2 text-stone-400">
                      <span>Tagihan:</span>
                      <span>{formatRupiah(d.billed)}</span>
                    </div>
                    <div className="flex justify-between gap-2 text-emerald-400 mt-1 pt-1 border-t border-stone-800 font-semibold">
                      <span>Capaian:</span>
                      <span>{d.rate}%</span>
                    </div>
                  </div>
                )}

                {/* Bars side by side */}
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  {/* Billed bar */}
                  <div
                    style={{ height: `${billedHeight}%` }}
                    className="w-1/2 bg-stone-200 rounded-t-sm transition-all duration-300 group-hover:bg-stone-300"
                  />
                  {/* Collected bar */}
                  <div
                    style={{ height: `${collectedHeight}%` }}
                    className="w-1/2 bg-emerald-700 rounded-t-sm transition-all duration-300 group-hover:bg-emerald-600 shadow-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Month labels */}
        <div className="flex justify-between text-[10px] text-stone-500 pt-2 font-medium">
          {monthlyData.map((d, idx) => (
            <span key={idx} className="flex-1 text-center truncate">
              {d.monthLabel.slice(0, 3)}
            </span>
          ))}
        </div>
      </div>

      {/* Chart 2: Perbandingan Tagihan vs Pembayaran (Efektivitas) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Perbandingan Tagihan vs Realisasi</h3>
            <p className="text-xs text-stone-500">Rasio penagihan dan tunggakan total tahun berjalan</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-800">
              {Math.round((invoices.reduce((a, b) => a + b.terbayar, 0) / (invoices.reduce((a, b) => a + b.totalTagihan, 0) || 1)) * 100)}%
            </span>
            <span className="text-[10px] text-stone-400 block">Kolektibilitas</span>
          </div>
        </div>

        {/* Stacked comparison bar */}
        <div className="space-y-4 my-auto py-2">
          {monthlyData.slice(0, 5).map((m, idx) => {
            const paidPct = m.billed > 0 ? Math.round((m.collected / m.billed) * 100) : 0;
            const arrearsPct = 100 - paidPct;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-stone-800">{m.monthLabel} 2024</span>
                  <span className="font-mono text-stone-600 text-[11px]">
                    <strong className="text-emerald-700">{formatRupiah(m.collected)}</strong> / {formatRupiah(m.billed)}
                  </span>
                </div>
                <div className="h-3.5 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${paidPct}%` }}
                    className="bg-emerald-600 h-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] text-white font-bold"
                  />
                  <div
                    style={{ width: `${arrearsPct}%` }}
                    className="bg-amber-400 h-full transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-stone-400">
                  <span>Lunas: {paidPct}%</span>
                  <span>Tunggakan: {formatRupiah(m.arrears)} ({arrearsPct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Pembayaran Lunas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Belum Bayar / Tunggakan
          </span>
        </div>
      </div>

      {/* Chart 3: Pembayaran per Unit Pendidikan (RAIT, SDIT, SMPIT) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Penerimaan per Unit Pendidikan</h3>
            <p className="text-xs text-stone-500">Kontribusi pemasukan SPP antar jenjang sekolah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {unitStats.map((u, idx) => {
            const share = Math.round((u.collected / totalCollectedAll) * 100);
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: u.color }}
                  >
                    {u.name}
                  </span>
                  <span className="text-xs font-bold text-stone-700">{share}%</span>
                </div>
                <div className="text-sm font-extrabold text-stone-900 font-mono">
                  {formatRupiah(u.collected)}
                </div>
                <div className="text-[11px] text-stone-500 mt-1 flex justify-between">
                  <span>Tunggakan:</span>
                  <span className="text-amber-700 font-medium">{formatRupiah(u.arrears)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Progress Bar */}
        <div className="h-4 w-full rounded-full overflow-hidden flex bg-stone-100 shadow-inner">
          {unitStats.map((u, idx) => {
            const pct = Math.round((u.collected / totalCollectedAll) * 100);
            return (
              <div
                key={idx}
                style={{ width: `${pct}%`, backgroundColor: u.color }}
                className="h-full transition-all duration-500 hover:opacity-90"
                title={`${u.name}: ${pct}%`}
              />
            );
          })}
        </div>
      </div>

      {/* Chart 4: Perkembangan Tunggakan Setiap Bulan */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Perkembangan Tunggakan SPP</h3>
            <p className="text-xs text-stone-500">Distribusi piutang SPP bulanan yang belum tertagih</p>
          </div>
          <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold">
            Perlu Tindak Lanjut
          </span>
        </div>

        {/* Area Line Chart Visualization */}
        <div className="h-48 relative flex items-end pt-4 pb-2 border-b border-stone-200">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
            <defs>
              <linearGradient id="arrearsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Line Grid */}
            <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#f1f5f9" strokeDasharray="3 3" />

            {/* Path Coordinates */}
            {(() => {
              const activeMonths = monthlyData.slice(0, 5);
              const maxArrears = Math.max(...activeMonths.map((m) => m.arrears), 1000000);
              const points = activeMonths.map((m, i) => {
                const x = (i / (activeMonths.length - 1)) * 380 + 10;
                const y = 110 - (m.arrears / maxArrears) * 90;
                return { x, y, data: m };
              });

              const dStr = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              const areaStr = `${dStr} L ${points[points.length - 1].x} 120 L ${points[0].x} 120 Z`;

              return (
                <>
                  <path d={areaStr} fill="url(#arrearsGrad)" />
                  <path d={dStr} fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
                      <text x={p.x} y={p.y - 8} fontSize="9" textAnchor="middle" fill="#78350f" fontWeight="bold">
                        {p.data.arrears > 0 ? (p.data.arrears / 1000).toFixed(0) + 'k' : '0'}
                      </text>
                    </g>
                  ))}
                </>
              );
            })()}
          </svg>
        </div>

        <div className="flex justify-between text-[11px] text-stone-500 pt-2">
          {monthlyData.slice(0, 5).map((m, idx) => (
            <span key={idx} className="font-medium">
              {m.monthLabel}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
