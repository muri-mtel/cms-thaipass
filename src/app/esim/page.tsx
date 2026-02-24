'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockESIMOrders } from '@/data/mockESIM';
import ESIMStatusBadge from '@/components/ESIMStatusBadge';
import { ESIMStatus, ESIMOrderType, ESIMProductName } from '@/types';

const ALL_STATUSES: ESIMStatus[]      = ['Active', 'Not Active'];
const ALL_TYPES: ESIMOrderType[]      = ['Main', 'Top-up'];
const ALL_PRODUCTS: ESIMProductName[] = ['Free eSIM', 'Standard eSIM', 'Unlimited eSIM'];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ESIMPage() {
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<ESIMStatus | 'All'>('All');
  const [typeFilter, setTypeFilter]   = useState<ESIMOrderType | 'All'>('All');
  const [productFilter, setProductFilter] = useState<ESIMProductName | 'All'>('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockESIMOrders.filter((o) => {
      const matchSearch   = o.id.toLowerCase().includes(q) || o.userEmail.toLowerCase().includes(q);
      const matchStatus   = statusFilter  === 'All' || o.status      === statusFilter;
      const matchType     = typeFilter    === 'All' || o.orderType   === typeFilter;
      const matchProduct  = productFilter === 'All' || o.productName === productFilter;
      return matchSearch && matchStatus && matchType && matchProduct;
    });
  }, [search, statusFilter, typeFilter, productFilter]);

  const counts = useMemo(() => {
    const c: Record<ESIMStatus, number> = { 'Active': 0, 'Not Active': 0 };
    mockESIMOrders.forEach((o) => c[o.status]++);
    return c;
  }, []);

  const typeCounts = useMemo(() => {
    const c: Record<ESIMOrderType, number> = { 'Main': 0, 'Top-up': 0 };
    mockESIMOrders.forEach((o) => c[o.orderType]++);
    return c;
  }, []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">e-SIM</h1>
        <p className="text-sm text-slate-500 mt-1">{mockESIMOrders.length} total orders</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {ALL_STATUSES.map((s) => (
          <button key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
            className={`text-left bg-white rounded-xl border shadow-sm px-5 py-4 transition-all ${
              statusFilter === s ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{s}</p>
            <p className="text-2xl font-bold text-slate-900">{counts[s]}</p>
          </button>
        ))}
        {ALL_TYPES.map((t) => (
          <button key={t}
            onClick={() => setTypeFilter(typeFilter === t ? 'All' : t)}
            className={`text-left bg-white rounded-xl border shadow-sm px-5 py-4 transition-all ${
              typeFilter === t ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">{t}</p>
            <p className="text-2xl font-bold text-slate-900">{typeCounts[t]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by order ID or email…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <select value={productFilter}
          onChange={(e) => setProductFilter(e.target.value as ESIMProductName | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Products</option>
          {ALL_PRODUCTS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <select value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ESIMOrderType | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">Main &amp; Top-up</option>
          {ALL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ESIMStatus | 'All')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700
            focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="All">All Statuses</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Order ID</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">User Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Product</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Package</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Price</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Purchased</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Type</th>
                <th className="text-left px-5 py-3.5 font-semibold text-slate-600 whitespace-nowrap">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-slate-400">
                    No eSIM orders match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {o.id}
                    </td>
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">{o.userEmail}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                        o.productName === 'Free eSIM'      ? 'bg-slate-100 text-slate-600' :
                        o.productName === 'Standard eSIM'  ? 'bg-blue-50 text-blue-700' :
                                                             'bg-purple-50 text-purple-700'
                      }`}>
                        {o.productName}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-700 whitespace-nowrap">{o.packageName}</td>
                    <td className="px-5 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {o.price === 0 ? <span className="text-green-600 font-semibold">Free</span>
                        : `${o.currency} ${o.price.toLocaleString()}`}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {formatDateTime(o.purchasedAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                        o.orderType === 'Main'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {o.orderType === 'Top-up' && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                        {o.orderType}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <ESIMStatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/esim/${o.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs whitespace-nowrap">
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
            Showing {filtered.length} of {mockESIMOrders.length} orders
          </div>
        )}
      </div>
    </div>
  );
}
