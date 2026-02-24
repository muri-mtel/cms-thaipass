'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockUsers, mockPurchaseHistory } from '@/data/mockUsers';
import TDACStatusBadge from '@/components/TDACStatusBadge';

interface SectionCardProps {
  title: string;
  children?: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-6 py-5">
        {children ?? (
          <p className="text-sm text-slate-400 italic">Coming soon — no data to display yet.</p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="w-36 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const user = mockUsers.find((u) => u.id === id);
  const purchases = mockPurchaseHistory[id] ?? [];

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg">User not found.</p>
        <button
          onClick={() => router.push('/users')}
          className="mt-4 text-sm text-[#004493] hover:underline"
        >
          ← Back to User Accounts
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to User Accounts
      </button>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-14 h-14 rounded-full bg-[#EBF2FF] flex items-center justify-center
          text-[#004493] font-bold text-xl flex-shrink-0">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-5">

        {/* Profile */}
        <SectionCard title="User Profile">
          <InfoRow label="Full Name" value={user.name} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Nationality" value={user.nationality} />
          <InfoRow label="Registered" value={
            new Date(user.registeredDate).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'long', year: 'numeric',
            })
          } />
          <InfoRow label="TDAC Status" value={<TDACStatusBadge status={user.tdacStatus} />} />
        </SectionCard>

        {/* Purchase History */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Purchase History
            </h2>
          </div>

          {purchases.length === 0 ? (
            <div className="px-6 py-5">
              <p className="text-sm text-slate-400 italic">No purchases found for this user.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Item Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Transaction ID</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Price</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Card (Last 4)</th>
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchases.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800">{p.itemName}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{p.transactionId}</td>
                      <td className="px-5 py-3.5 text-slate-800">
                        {p.currency} {p.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <span className="font-mono">•••• {p.lastFourDigits}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {new Date(p.purchasedAt).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
