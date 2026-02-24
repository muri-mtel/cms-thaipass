'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockTransportBookings } from '@/data/mockTransport';
import TransportStatusBadge from '@/components/TransportStatusBadge';
import { TransportStatus, TransportServiceType } from '@/types';

const ALL_STATUSES: TransportStatus[] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
const ALL_SERVICE_TYPES: TransportServiceType[] = ['Airport Transfer', 'Chauffeur Service'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function TransportationPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransportStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = useState<TransportServiceType | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockTransportBookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(q) ||
        b.accountEmail.toLowerCase().includes(q) ||
        b.passengerName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesType = typeFilter === 'All' || b.serviceType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  const counts = useMemo(() => {
    const c: Record<TransportStatus, number> = { Pending: 0, Confirmed: 0, Completed: 0, Cancelled: 0 };
    mockTransportBookings.forEach((b) => c[b.status]++);
    return c;
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Transportation</h1>
        <p className="text-sm text-slate-500 mt-1">
          {mockTransportBookings.length} total bookings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
            className={`text-left bg-white rounded-xl border shadow-sm px-5 py-4 transition-all ${
              statusFilter === status
                ? 'border-blue-500 ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              {status}
            </p>
            <p className="text-2xl font-bold text-slate-900">{counts[status]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by booking ID, email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TransportServiceType | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Service Types</option>
          {ALL_SERVICE_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TransportStatus | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Service Type</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Booking ID</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Account Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Pickup Date / Time</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Drop-off Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Pickup Location</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Drop-off Location</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Created</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-5 py-12 text-center text-slate-400">
                    No bookings match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    {/* Service Type */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md ${
                        b.serviceType === 'Airport Transfer'
                          ? 'bg-sky-50 text-sky-700'
                          : 'bg-violet-50 text-violet-700'
                      }`}>
                        {b.serviceType === 'Airport Transfer' ? (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 3l14 9-14 9V3z" />
                          </svg>
                        )}
                        {b.serviceType}
                      </span>
                    </td>
                    {/* Booking ID */}
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {b.id}
                    </td>
                    {/* Email */}
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{b.accountEmail}</td>
                    {/* Pickup */}
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap text-xs">
                      <span className="font-medium">{formatDate(b.pickupDate)}</span>
                      <span className="text-slate-400 ml-1">{b.pickupTime}</span>
                    </td>
                    {/* Drop-off date */}
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap text-xs">
                      {formatDate(b.dropoffDate)}
                    </td>
                    {/* Pickup location */}
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap max-w-[160px] truncate" title={b.pickupLocation}>
                      {b.pickupLocation}
                    </td>
                    {/* Drop-off location */}
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap max-w-[160px] truncate" title={b.dropoffLocation}>
                      {b.dropoffLocation}
                    </td>
                    {/* Price */}
                    <td className="px-5 py-4 text-slate-800 font-medium whitespace-nowrap">
                      {b.currency} {b.total.toLocaleString()}
                    </td>
                    {/* Created */}
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {formatDateTime(b.createdAt)}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4">
                      <TransportStatusBadge status={b.status} />
                    </td>
                    {/* Action */}
                    <td className="px-5 py-4">
                      <Link
                        href={`/transportation/${b.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs whitespace-nowrap"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Showing {filtered.length} of {mockTransportBookings.length} bookings
          </div>
        )}
      </div>
    </div>
  );
}
