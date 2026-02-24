'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockTDACEntries } from '@/data/mockTDAC';
import TDACEntryStatusBadge from '@/components/TDACEntryStatusBadge';
import { TDACEntryStatus } from '@/types';

const ALL_STATUSES: TDACEntryStatus[] = ['Active', 'Expired'];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TDACPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TDACEntryStatus | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockTDACEntries.filter((entry) => {
      const matchesSearch =
        entry.accountEmail.toLowerCase().includes(q) ||
        entry.arrivalCardNo.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' || entry.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const counts = useMemo(() => {
    const c: Record<TDACEntryStatus, number> = { Active: 0, Expired: 0 };
    mockTDACEntries.forEach((e) => c[e.status]++);
    return c;
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">TDAC</h1>
        <p className="text-sm text-slate-500 mt-1">
          {mockTDACEntries.length} total submissions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm">
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
            placeholder="Search by email or arrival card no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TDACEntryStatus | 'All')}
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
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Account Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Arrival Card No.</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Nationality</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Arrival Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Departure Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Submitted</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Updated</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-5 py-12 text-center text-slate-400">
                    No TDAC submissions match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-600">{entry.accountEmail}</td>
                    <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">{entry.name}</td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600 whitespace-nowrap">{entry.arrivalCardNo}</td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{entry.nationality}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDate(entry.arrivalDate)}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDate(entry.departureDate)}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDateTime(entry.submittedAt)}</td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDateTime(entry.updatedAt)}</td>
                    <td className="px-5 py-4">
                      <TDACEntryStatusBadge status={entry.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        href={`/tdac/${entry.id}`}
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
            Showing {filtered.length} of {mockTDACEntries.length} submissions
          </div>
        )}
      </div>
    </div>
  );
}
