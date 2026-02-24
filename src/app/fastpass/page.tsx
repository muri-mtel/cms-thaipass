'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockFastPassOrders } from '@/data/mockFastPass';
import FastPassStatusBadge from '@/components/FastPassStatusBadge';
import { FastPassStatus } from '@/types';

const ALL_STATUSES: FastPassStatus[] = ['Active', 'Redeemed', 'Expired'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function FastPassPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FastPassStatus | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockFastPassOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  // Summary counts
  const counts = useMemo(() => {
    const c = { Active: 0, Redeemed: 0, Expired: 0 };
    mockFastPassOrders.forEach((o) => c[o.status]++);
    return c;
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">FastPass</h1>
        <p className="text-sm text-slate-500 mt-1">
          {mockFastPassOrders.length} total orders
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {ALL_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? 'All' : status)}
            className={`text-left bg-white rounded-xl border shadow-sm px-5 py-4 transition-all ${
              statusFilter === status
                ? 'border-[#004493] ring-1 ring-blue-500'
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
        {/* Search */}
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
            placeholder="Search by email or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004493]"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as FastPassStatus | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-[#004493]"
        >
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Order ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Price</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Purchased</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Updated</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                  No orders match your search.
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-medium text-slate-700">
                    {order.id}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{order.email}</td>
                  <td className="px-5 py-4 text-slate-800 font-medium">
                    {order.currency} {order.price.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {formatDateTime(order.purchasedAt)}
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {formatDateTime(order.updatedAt)}
                  </td>
                  <td className="px-5 py-4">
                    <FastPassStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/fastpass/${encodeURIComponent(order.id)}`}
                      className="text-[#004493] hover:text-[#003070] font-medium text-xs"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Showing {filtered.length} of {mockFastPassOrders.length} orders
          </div>
        )}
      </div>
    </div>
  );
}
