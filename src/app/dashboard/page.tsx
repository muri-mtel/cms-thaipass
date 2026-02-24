'use client';

import { useState, useMemo } from 'react';
import {
  getDashboardData,
  getDashboardDataForRange,
  DateRangeKey,
  LocationCount,
  UserSegment,
} from '@/data/mockDashboard';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

function thb(n: number) {
  return `฿${n.toLocaleString('en-US')}`;
}

// ── Shared UI primitives ──────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = 'blue',
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'blue' | 'green' | 'violet' | 'amber' | 'teal' | 'sky' | 'slate';
}) {
  const dot: Record<string, string> = {
    blue:   'bg-blue-500',
    green:  'bg-green-500',
    violet: 'bg-violet-500',
    amber:  'bg-amber-400',
    teal:   'bg-teal-500',
    sky:    'bg-sky-500',
    slate:  'bg-slate-400',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${dot[accent]}`} />
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-slate-900">
        {typeof value === 'number' ? fmt(value) : value}
      </p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionHeader({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl ${color} mb-3`}>
      <span className="text-white opacity-90">{icon}</span>
      <h2 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h2>
    </div>
  );
}

// Simple horizontal bar showing proportional split
function ProportionBar({ items }: { items: { label: string; count: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (total === 0) return null;
  return (
    <div className="flex rounded-lg overflow-hidden h-3 w-full">
      {items.map((item) => (
        <div
          key={item.label}
          className={`${item.color} transition-all`}
          style={{ width: `${(item.count / total) * 100}%` }}
          title={`${item.label}: ${item.count}`}
        />
      ))}
    </div>
  );
}

function LocationBreakdown({ items }: { items: LocationCount[] }) {
  const max = Math.max(...items.map((i) => i.count));
  return (
    <div className="space-y-2.5">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-600">{item.label}</span>
            <span className="text-xs font-semibold text-slate-800">{fmt(item.count)}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RevenueRow({
  label,
  total,
  platform,
  indent = false,
  bold = false,
}: {
  label: string;
  total: number;
  platform: number;
  indent?: boolean;
  bold?: boolean;
}) {
  return (
    <div className={`flex items-center py-2.5 border-b border-slate-50 last:border-0 ${indent ? 'pl-4' : ''}`}>
      <span className={`flex-1 text-sm ${bold ? 'font-semibold text-slate-900' : 'text-slate-600'} ${indent ? 'text-slate-500' : ''}`}>
        {label}
      </span>
      <span className={`w-36 text-right text-sm ${bold ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
        {thb(total)}
      </span>
      <span className={`w-36 text-right text-sm ${bold ? 'font-bold text-[#004493]' : 'font-medium text-[#004493]'}`}>
        {thb(platform)}
      </span>
    </div>
  );
}

// ── Date Range Picker ─────────────────────────────────────────────────────────

const QUICK_RANGES: { label: string; key: DateRangeKey }[] = [
  { label: 'Last 7 Days',    key: 'last7'   },
  { label: 'Last 30 Days',   key: 'last30'  },
  { label: 'Last 12 Months', key: 'last12m' },
];

// Returns YYYY-MM-DD for an <input type="date">
function toInputDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  // Quick-select state
  const [selectedRange, setSelectedRange] = useState<DateRangeKey>('last30');

  // Custom range state
  const [isCustom, setIsCustom]       = useState(false);
  const defaultTo   = new Date();
  const defaultFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [fromStr, setFromStr] = useState(toInputDate(defaultFrom));
  const [toStr,   setToStr]   = useState(toInputDate(defaultTo));

  const data = useMemo(() => {
    if (!isCustom) return getDashboardData(selectedRange);
    const from = new Date(fromStr);
    const to   = new Date(toStr);
    if (isNaN(from.getTime()) || isNaN(to.getTime()) || from > to) {
      return getDashboardData('last30');
    }
    return getDashboardDataForRange(from, to);
  }, [isCustom, selectedRange, fromStr, toStr]);

  const totalSegments = data.userSegments.reduce((s, u) => s + u.count, 0);

  function handleQuickSelect(key: DateRangeKey) {
    setIsCustom(false);
    setSelectedRange(key);
  }

  function handleCustomToggle() {
    setIsCustom(true);
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Overview for {data.period}</p>
          </div>

          {/* Quick presets + Custom toggle */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm flex-wrap">
            {QUICK_RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => handleQuickSelect(r.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !isCustom && selectedRange === r.key
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {r.label}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Custom range toggle */}
            <button
              onClick={handleCustomToggle}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCustom
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Custom Range
            </button>
          </div>
        </div>

        {/* Custom date inputs — visible only when custom mode is active */}
        {isCustom && (
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm self-end">
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">From</label>
              <input
                type="date"
                value={fromStr}
                max={toStr}
                onChange={(e) => setFromStr(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700
                  focus:outline-none focus:ring-2 focus:ring-[#004493] bg-white"
              />
            </div>

            <span className="text-slate-300">→</span>

            <div className="flex items-center gap-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">To</label>
              <input
                type="date"
                value={toStr}
                min={fromStr}
                max={toInputDate(new Date())}
                onChange={(e) => setToStr(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700
                  focus:outline-none focus:ring-2 focus:ring-[#004493] bg-white"
              />
            </div>

            {/* Day count badge */}
            {fromStr && toStr && new Date(fromStr) <= new Date(toStr) && (
              <span className="text-xs font-semibold text-[#004493] bg-blue-50 border border-blue-200
                px-2.5 py-1 rounded-full whitespace-nowrap">
                {Math.round(
                  (new Date(toStr).getTime() - new Date(fromStr).getTime()) / (1000 * 60 * 60 * 24)
                ) + 1}{' '}days
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-8">

        {/* ── Users ────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Users"
            color="bg-slate-700"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total App Downloads"    value={data.totalAppDownloads}    accent="slate" />
            <StatCard label="Total Registered Users" value={data.totalRegisteredUsers} accent="slate" />
          </div>
        </section>

        {/* ── TDAC ─────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="TDAC"
            color="bg-emerald-600"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total TDAC Submissions (ThaiPass App)" value={data.totalTDACSubmissions} accent="green" />
            <StatCard label="Unique Submitted Users"                 value={data.uniqueTDACUsers}       accent="green" />
          </div>
        </section>

        {/* ── FastPass ─────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="FastPass"
            color="bg-[#004493]"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="Total FastPass Purchased" value={data.totalFastPassPurchased} accent="blue" />
            <StatCard label="Unique Purchasing Users"  value={data.uniqueFastPassUsers}    accent="blue" />
          </div>
        </section>

        {/* ── Transportation ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Transportation"
            color="bg-sky-600"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            }
          />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard label="Total Bookings"        value={data.totalTransportBookings} accent="sky" />
            <StatCard label="Airport Transfer"      value={data.airportTransferCount}   accent="sky"
              sub={`${Math.round((data.airportTransferCount / data.totalTransportBookings) * 100)}% of bookings`} />
            <StatCard label="Chauffeur Service"     value={data.chauffeurServiceCount}  accent="sky"
              sub={`${Math.round((data.chauffeurServiceCount / data.totalTransportBookings) * 100)}% of bookings`} />
          </div>

          {/* Bookings split bar */}
          <div className="mb-4">
            <ProportionBar items={[
              { label: 'Airport Transfer',    count: data.airportTransferCount,  color: 'bg-sky-400' },
              { label: 'Chauffeur Service',   count: data.chauffeurServiceCount, color: 'bg-sky-200' },
            ]} />
            <div className="flex gap-4 mt-2">
              {[
                { label: 'Airport Transfer',  color: 'bg-sky-400' },
                { label: 'Chauffeur Service', color: 'bg-sky-200' },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Pickup location breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Pickup Location Count
              </p>
              <LocationBreakdown items={data.pickupLocations} />
            </div>

            {/* Drop-off region breakdown */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">
                Drop-off Region Count
              </p>
              <LocationBreakdown items={data.dropoffRegions} />
            </div>
          </div>
        </section>

        {/* ── e-SIM ────────────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="e-SIM"
            color="bg-violet-600"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
          />

          {/* Top row */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard label="Total eSIM Purchased"     value={data.totalESIMPurchased}  accent="violet" />
            <StatCard label="Total Free eSIM Installs" value={data.totalFreeInstalls}   accent="violet" sub="Free package activated" />
            <StatCard label="Total Paid eSIM Installs" value={data.totalPaidInstalls}   accent="violet" sub="Standard + Unlimited" />
          </div>

          {/* Package breakdown */}
          <div className="grid grid-cols-2 gap-4">
            {/* Unlimited */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Unlimited Package</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Unique Purchasing Users</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(data.unlimitedUniqueUsers)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500">Total Purchasing Users</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(data.unlimitedTotalOrders)}</span>
                </div>
              </div>
            </div>

            {/* Standard */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Standard Package</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-xs text-slate-500">Unique Purchasing Users</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(data.standardUniqueUsers)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-slate-500">Total Purchasing Users</span>
                  <span className="text-sm font-bold text-slate-900">{fmt(data.standardTotalOrders)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Revenue Breakdown ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Revenue Breakdown by Product"
            color="bg-amber-500"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Column headers */}
            <div className="flex items-center px-6 py-3 bg-slate-50 border-b border-slate-100">
              <span className="flex-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</span>
              <span className="w-36 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Revenue</span>
              <span className="w-36 text-right text-xs font-semibold text-blue-500 uppercase tracking-wide">Platform Revenue</span>
            </div>
            <div className="px-6 py-1">
              <RevenueRow label="Total"                  total={data.totalRevenue.total}    platform={data.platformRevenue.total}    bold />
              <RevenueRow label="FastPass"               total={data.totalRevenue.fastPass}  platform={data.platformRevenue.fastPass}  indent />
              <RevenueRow label="Transport"              total={data.totalRevenue.transport} platform={data.platformRevenue.transport} indent />
              <RevenueRow label="e-SIM"                  total={data.totalRevenue.esim}      platform={data.platformRevenue.esim}      indent />
            </div>

            {/* Revenue proportion bar */}
            <div className="px-6 pb-5 pt-2">
              <p className="text-xs text-slate-400 mb-2">Revenue mix</p>
              <ProportionBar items={[
                { label: 'FastPass',   count: data.totalRevenue.fastPass,  color: 'bg-blue-400'   },
                { label: 'Transport',  count: data.totalRevenue.transport, color: 'bg-sky-400'    },
                { label: 'e-SIM',      count: data.totalRevenue.esim,      color: 'bg-violet-400' },
              ]} />
              <div className="flex gap-4 mt-2">
                {[
                  { label: 'FastPass',  color: 'bg-blue-400',   val: data.totalRevenue.fastPass },
                  { label: 'Transport', color: 'bg-sky-400',    val: data.totalRevenue.transport },
                  { label: 'e-SIM',     color: 'bg-violet-400', val: data.totalRevenue.esim },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                    {l.label}
                    <span className="text-slate-400">
                      ({Math.round((l.val / data.totalRevenue.total) * 100)}%)
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── User Segments ─────────────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="User Segment by Product Usage"
            color="bg-indigo-600"
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            }
          />

          {/* Stacked proportion bar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-4">
            <div className="mb-4">
              <ProportionBar
                items={data.userSegments.map((s) => ({
                  label: s.label,
                  count: s.count,
                  color: s.color,
                }))}
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
              {data.userSegments.map((seg) => (
                <span key={seg.label} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className={`w-2.5 h-2.5 rounded-sm ${seg.color}`} />
                  {seg.label}
                  <span className="text-slate-400">
                    ({Math.round((seg.count / totalSegments) * 100)}%)
                  </span>
                </span>
              ))}
            </div>

            {/* Segment rows */}
            <div className="space-y-0 border-t border-slate-100">
              {data.userSegments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2.5 w-52 flex-shrink-0">
                    <span className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${seg.color}`} />
                    <span className="text-sm font-medium text-slate-800">{seg.label}</span>
                  </div>
                  <span className="text-xs text-slate-400 flex-1">{seg.description}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-28 h-1.5 bg-slate-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${seg.color}`}
                        style={{ width: `${(seg.count / totalSegments) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-12 text-right">
                      {fmt(seg.count)}
                    </span>
                    <span className="text-xs text-slate-400 w-10 text-right">
                      {Math.round((seg.count / totalSegments) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 pt-3">
                <span className="text-sm font-semibold text-slate-700 w-52 flex-shrink-0 pl-5">Total</span>
                <span className="flex-1" />
                <span className="text-sm font-bold text-slate-900 w-12 text-right">{fmt(totalSegments)}</span>
                <span className="text-xs text-slate-400 w-10 text-right">100%</span>
              </div>
            </div>
          </div>

          {/* SuperUsers callout */}
          {(() => {
            const superUsers = data.userSegments.find(s => s.label === 'All Products');
            if (!superUsers) return null;
            return (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">
                    {fmt(superUsers.count)} SuperUsers this period
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    Users who booked FastPass, Transport, and activated eSIM —{' '}
                    {Math.round((superUsers.count / totalSegments) * 100)}% of all registered users
                  </p>
                </div>
              </div>
            );
          })()}
        </section>

      </div>
    </div>
  );
}
