'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockFastPassOrders } from '@/data/mockFastPass';
import FastPassStatusBadge from '@/components/FastPassStatusBadge';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="w-44 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

function SectionCard({ title, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h2>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

export default function FastPassDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const decodedId = decodeURIComponent(id);

  const order = mockFastPassOrders.find((o) => o.id === decodedId);

  if (!order) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg">Order not found.</p>
        <button
          onClick={() => router.push('/fastpass')}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to FastPass
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to FastPass
      </button>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Order</p>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">{order.id}</h1>
        </div>
        <FastPassStatusBadge status={order.status} />
      </div>

      <div className="space-y-5">

        {/* Order Info */}
        <SectionCard title="Order Details">
          <InfoRow label="Order ID" value={<span className="font-mono">{order.id}</span>} />
          <InfoRow label="Status" value={<FastPassStatusBadge status={order.status} />} />
          <InfoRow label="Email" value={order.email} />
          <InfoRow
            label="Expires"
            value={
              <span className={order.status === 'Expired' ? 'text-red-500' : ''}>
                {formatDateTime(order.expiresAt)}
              </span>
            }
          />
          <InfoRow label="Last Updated" value={formatDateTime(order.updatedAt)} />
        </SectionCard>

        {/* Payment Detail */}
        <SectionCard title="Payment Detail">
          <InfoRow label="Transaction ID" value={<span className="font-mono text-xs">{order.transactionId}</span>} />
          <InfoRow
            label="Price"
            value={
              <span className="font-semibold">
                {order.currency} {order.price.toLocaleString()}
              </span>
            }
          />
          <InfoRow
            label="Card (Last 4 Digits)"
            value={<span className="font-mono">•••• {order.lastFourDigits}</span>}
          />
          <InfoRow label="Purchased" value={formatDateTime(order.purchasedAt)} />
        </SectionCard>

      </div>
    </div>
  );
}
