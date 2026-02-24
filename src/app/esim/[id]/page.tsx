'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockESIMOrders } from '@/data/mockESIM';
import ESIMStatusBadge from '@/components/ESIMStatusBadge';
import { ESIMStatusLog } from '@/types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
  });
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoRow({ label, value, mono = false }: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="w-52 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className={`text-sm text-slate-800 ${mono ? 'font-mono text-xs break-all' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function SectionCard({ title, children, badge }: {
  title: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h2>
        {badge}
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

function NAField() {
  return <span className="text-slate-300 text-xs italic">N/A — Top-up order</span>;
}

// ── Status Timeline ───────────────────────────────────────────────────────────

interface TimelineStep {
  label: string;
  value: string | null;
  reached: boolean;
}

function StatusTimeline({ log }: { log: ESIMStatusLog }) {
  const steps: TimelineStep[] = [
    { label: 'Purchased / Received',   value: log.purchasedAt ? `${formatDate(log.purchasedAt)}${log.receivedAt ? ` → ${formatDateTime(log.receivedAt)}` : ''}` : null, reached: !!log.purchasedAt },
    { label: 'Installation Date / Time', value: formatDateTime(log.installedAt),  reached: !!log.installedAt },
    { label: 'Active Date / Time',       value: formatDateTime(log.activatedAt),  reached: !!log.activatedAt },
    { label: 'Out of Data Date / Time',  value: formatDateTime(log.outOfDataAt),  reached: !!log.outOfDataAt },
    { label: 'Expired Date / Time',      value: formatDateTime(log.expiredAt),    reached: !!log.expiredAt   },
  ];

  return (
    <div className="py-4 space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-4">
          {/* Connector column */}
          <div className="flex flex-col items-center w-8 flex-shrink-0">
            <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 mt-1 ${
              step.reached
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-slate-300'
            }`} />
            {i < steps.length - 1 && (
              <div className={`w-0.5 flex-1 my-1 ${
                step.reached && steps[i + 1].reached ? 'bg-blue-300' : 'bg-slate-200'
              }`} style={{ minHeight: '24px' }} />
            )}
          </div>
          {/* Content */}
          <div className="pb-5 flex-1 min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wide ${
              step.reached ? 'text-slate-700' : 'text-slate-300'
            }`}>
              {step.label}
            </p>
            <p className={`text-sm mt-0.5 ${
              step.reached ? 'text-slate-600' : 'text-slate-300 italic'
            }`}>
              {step.value ?? 'Pending'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ESIMDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const order = mockESIMOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg">eSIM order not found.</p>
        <button onClick={() => router.push('/esim')}
          className="mt-4 text-sm text-blue-600 hover:underline">
          ← Back to e-SIM
        </button>
      </div>
    );
  }

  const isMain  = order.orderType === 'Main';
  const isTopup = order.orderType === 'Top-up';

  // Find linked orders for this order
  const linkedOrders = isMain
    ? mockESIMOrders
        .filter((o) => o.linkedMainOrderId === order.id)
        .sort((a, b) => new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime())
    : [];

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to e-SIM
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              {order.productName}
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              isMain
                ? 'bg-teal-50 text-teal-700 border-teal-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
            }`}>
              {order.orderType}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">{order.id}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{order.packageName}</p>
        </div>
        <ESIMStatusBadge status={order.status} />
      </div>

      <div className="space-y-5">

        {/* eSIM Details */}
        <SectionCard title="eSIM Details">
          {/* Usage */}
          <div className="flex items-center gap-4 py-3 border-b border-slate-50">
            <span className="w-52 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0">
              Usage / Spending Data
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(order.dataUsageGB * 10, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-800">{order.dataUsageGB} GB</span>
              </div>
              <span className="text-xs text-slate-400">captured at last usage</span>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex items-start gap-4 py-3 border-b border-slate-50">
            <span className="w-52 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
              Payment Method
            </span>
            <div className="text-sm text-slate-800 space-y-1">
              <p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mr-2 ${
                  order.payment.cardType === 'Credit'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-amber-50 text-amber-700'
                }`}>
                  {order.payment.cardType}
                </span>
                <span className="font-medium">{order.payment.cardBrand}</span>
              </p>
              <p className="font-mono text-slate-500 text-xs">•••• •••• •••• {order.payment.lastFourDigits}</p>
            </div>
          </div>

          {/* Voucher */}
          <InfoRow label="Applied Voucher" value={
            order.appliedVoucher
              ? <span className="font-mono text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-200">{order.appliedVoucher}</span>
              : <span className="text-slate-400 text-xs italic">None</span>
          } />

          {/* T&C */}
          <InfoRow label="T&C Acceptance" value={
            order.tncAccepted
              ? <span className="flex items-center gap-1.5 text-green-700 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Accepted {order.tncAcceptedAt ? `on ${formatDateTime(order.tncAcceptedAt)}` : ''}
                </span>
              : <span className="text-red-500 text-xs">Not Accepted</span>
          } />

          {/* Main-only fields */}
          <InfoRow label="ICCID"            value={isMain ? order.iccid!            : <NAField />} mono={isMain} />
          <InfoRow label="SM-DP+ Address"   value={isMain ? order.smdpAddress!      : <NAField />} mono={isMain} />
          <InfoRow label="Activation Code"  value={isMain ? order.activationCode!   : <NAField />} mono={isMain} />
          <InfoRow label="Confirmation Code" value={isMain ? order.confirmationCode! : <NAField />} mono={isMain} />
          <InfoRow label="Mobile Model"     value={isMain ? order.mobileModel!      : <NAField />} />

          {/* Top-up only field */}
          {isTopup && (
            <InfoRow label="Linked Main Order" value={
              order.linkedMainOrderId
                ? <Link href={`/esim/${order.linkedMainOrderId}`}
                    className="text-blue-600 hover:underline font-mono text-xs font-semibold">
                    {order.linkedMainOrderId} →
                  </Link>
                : '—'
            } />
          )}
        </SectionCard>

        {/* Top-up orders linked to this Main eSIM */}
        {isMain && (
          <SectionCard
            title="Top-up Orders"
            badge={
              linkedOrders.length > 0
                ? <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200
                    px-2 py-0.5 rounded-full font-medium">{linkedOrders.length}</span>
                : undefined
            }
          >
            {linkedOrders.length === 0 ? (
              <p className="py-3 text-sm text-slate-400 italic">No top-up orders for this eSIM.</p>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-100">
                      <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                      <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase">Package</th>
                      <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase">Purchased</th>
                      <th className="text-left px-6 py-2.5 text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-2.5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {linkedOrders.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3 font-mono text-xs font-semibold text-slate-700">{t.id}</td>
                        <td className="px-6 py-3 text-slate-600">{t.packageName}</td>
                        <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">
                          {formatDateTime(t.purchasedAt)}
                        </td>
                        <td className="px-6 py-3"><ESIMStatusBadge status={t.status} /></td>
                        <td className="px-6 py-3">
                          <Link href={`/esim/${t.id}`}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )}

        {/* Status Timeline */}
        <SectionCard title="Order Status Log">
          <StatusTimeline log={order.statusLog} />
        </SectionCard>

      </div>
    </div>
  );
}
