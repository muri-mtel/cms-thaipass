'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockTransportBookings } from '@/data/mockTransport';
import TransportStatusBadge from '@/components/TransportStatusBadge';

// ── Shared sub-components ────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="w-48 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-slate-800">{value}</span>
    </div>
  );
}

function SectionCard({ title, children, action }: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">{title}</h2>
        {action}
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}

// ── Formatters ───────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    timeZoneName: 'short',
  });
}

// ── "Waiting for confirmation" placeholder ───────────────────────────────────

function Pending() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Waiting for confirmation
    </span>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TransportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const booking = mockTransportBookings.find((b) => b.id === id);

  if (!booking) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg">Booking not found.</p>
        <button onClick={() => router.push('/transportation')}
          className="mt-4 text-sm text-blue-600 hover:underline">
          ← Back to Transportation
        </button>
      </div>
    );
  }

  const isPending = booking.status === 'Pending';

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Transportation
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">
            {booking.serviceType}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 font-mono">{booking.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isPending && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700
              text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assign Driver
            </button>
          )}
          <TransportStatusBadge status={booking.status} />
        </div>
      </div>

      <div className="space-y-5">

        {/* Service Details */}
        <SectionCard title="Service Details">
          <InfoRow label="Service Type" value={
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md ${
              booking.serviceType === 'Airport Transfer'
                ? 'bg-sky-50 text-sky-700'
                : 'bg-violet-50 text-violet-700'
            }`}>
              {booking.serviceType}
            </span>
          } />
        </SectionCard>

        {/* Date / Time Details */}
        <SectionCard title="Date / Time Details">
          <InfoRow label="Pickup Date" value={formatDate(booking.pickupDate)} />
          <InfoRow label="Pickup Time" value={booking.pickupTime} />
          <InfoRow label="Drop-off Date" value={formatDate(booking.dropoffDate)} />
        </SectionCard>

        {/* Location Details */}
        <SectionCard title="Location Details">
          <InfoRow
            label="Pickup Location"
            value={
              <div>
                <p className="font-medium">{booking.pickupLocation}</p>
                <p className="text-xs text-slate-400 mt-0.5">{booking.pickupLocationDetail}</p>
              </div>
            }
          />
          <InfoRow
            label="Drop-off Location"
            value={
              <div>
                <p className="font-medium">{booking.dropoffLocation}</p>
                <p className="text-xs text-slate-400 mt-0.5">{booking.dropoffAddress}</p>
              </div>
            }
          />
          {/* Google Map QR placeholder */}
          <div className="py-3 flex items-center gap-4">
            <span className="w-48 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0">
              Map QR Code
            </span>
            <div className="w-24 h-24 border-2 border-dashed border-slate-200 rounded-lg flex
              flex-col items-center justify-center text-slate-300">
              <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-xs">Google Map</span>
            </div>
          </div>
        </SectionCard>

        {/* Passenger Details */}
        <SectionCard title="Passenger Details">
          <InfoRow label="Name" value={booking.passengerName} />
          <InfoRow label="Phone No." value={booking.passengerPhone} />
          <InfoRow label="Contact Email" value={booking.passengerContactEmail} />
          <InfoRow label="Flight No." value={
            <span className="font-mono font-semibold">{booking.flightNo}</span>
          } />
          <InfoRow label="Account Email" value={booking.accountEmail} />
        </SectionCard>

        {/* Requested Car */}
        <SectionCard title="Requested Car">
          <InfoRow label="Car Brand" value={booking.carBrand} />
          <InfoRow label="Car Model" value={booking.carModel} />
        </SectionCard>

        {/* Driver Details */}
        <SectionCard
          title="Driver Details"
          action={isPending ? (
            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Unassigned
            </span>
          ) : undefined}
        >
          <InfoRow label="Driver Name"   value={booking.driverName    ?? <Pending />} />
          <InfoRow label="Phone No."     value={booking.driverPhone   ?? <Pending />} />
          <InfoRow label="Plate No."     value={booking.driverPlateNo ? (
            <span className="font-mono font-semibold">{booking.driverPlateNo}</span>
          ) : <Pending />} />
          <InfoRow label="Car Color"     value={booking.driverCarColor ?? <Pending />} />
          <InfoRow label="Car Model"     value={booking.driverCarModel ?? <Pending />} />
        </SectionCard>

        {/* Payment Details */}
        <SectionCard title="Payment Details">
          <InfoRow label="Transaction ID" value={
            <span className="font-mono text-xs">{booking.transactionId}</span>
          } />
          <InfoRow label="Payment Date" value={formatDateTime(booking.paymentDate)} />
          <InfoRow label="Payment Method" value={booking.paymentMethod} />
          <InfoRow label="Subtotal" value={`${booking.currency} ${booking.subtotal.toLocaleString()}`} />
          <InfoRow label="Total" value={
            <span className="font-semibold text-slate-900">
              {booking.currency} {booking.total.toLocaleString()}
            </span>
          } />
        </SectionCard>

        {/* Booking Log */}
        <SectionCard title="Booking Log">
          <InfoRow label="Created Date / Time" value={formatDateTime(booking.createdAt)} />
          <InfoRow label="Updated Date / Time" value={formatDateTime(booking.updatedAt)} />
        </SectionCard>

      </div>
    </div>
  );
}
