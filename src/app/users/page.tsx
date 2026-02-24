'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { mockUsers } from '@/data/mockUsers';
import TDACStatusBadge from '@/components/TDACStatusBadge';

export default function UsersPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return mockUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.nationality.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [search]);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Accounts</h1>
        <p className="text-sm text-slate-500 mt-1">
          {mockUsers.length} total accounts
        </p>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-sm">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email or nationality..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white
              text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Name</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Nationality</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">TDAC Status</th>
              <th className="text-left px-5 py-3.5 font-semibold text-slate-600">Registered</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                  No users match your search.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Name + Avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center
                        text-blue-700 font-semibold text-sm flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{user.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-4 text-slate-500">{user.email}</td>

                  {/* Nationality */}
                  <td className="px-5 py-4 text-slate-700">{user.nationality}</td>

                  {/* TDAC Status */}
                  <td className="px-5 py-4">
                    <TDACStatusBadge status={user.tdacStatus} />
                  </td>

                  {/* Registered Date */}
                  <td className="px-5 py-4 text-slate-500">
                    {new Date(user.registeredDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Action */}
                  <td className="px-5 py-4">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-400">
            Showing {filtered.length} of {mockUsers.length} accounts
          </div>
        )}
      </div>
    </div>
  );
}
