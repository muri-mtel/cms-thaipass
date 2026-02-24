'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockTDACEntries } from '@/data/mockTDAC';
import TDACEntryStatusBadge from '@/components/TDACEntryStatusBadge';

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-slate-50 last:border-0">
      <span className="w-52 text-xs font-medium text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
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

function handleDownloadPDF(entry: ReturnType<typeof mockTDACEntries.find>) {
  if (!entry) return;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>TDAC – ${entry.name}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background: #fff;
          color: #1e293b;
          padding: 40px;
          font-size: 13px;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 16px;
          margin-bottom: 28px;
        }
        .header-title { font-size: 22px; font-weight: 700; color: #0f172a; }
        .header-sub { font-size: 12px; color: #64748b; margin-top: 4px; }
        .badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: ${entry.status === 'Active' ? '#f0fdf4' : '#f1f5f9'};
          color: ${entry.status === 'Active' ? '#15803d' : '#64748b'};
          border: 1px solid ${entry.status === 'Active' ? '#bbf7d0' : '#cbd5e1'};
        }
        .section { margin-bottom: 28px; }
        .section-title {
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
        }
        .row {
          display: flex;
          gap: 16px;
          padding: 7px 0;
          border-bottom: 1px solid #f8fafc;
        }
        .row:last-child { border-bottom: none; }
        .label { width: 200px; flex-shrink: 0; color: #64748b; font-size: 11px; }
        .value { color: #0f172a; font-size: 13px; font-weight: 500; }
        .travel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .travel-card {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 14px 16px;
        }
        .travel-card-title {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .travel-card .value { font-size: 15px; margin-bottom: 2px; }
        .travel-card .sub { font-size: 12px; color: #64748b; }
        .footer {
          margin-top: 40px;
          padding-top: 12px;
          border-top: 1px solid #e2e8f0;
          font-size: 10px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body { padding: 24px; }
          @page { margin: 0; size: A4; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="header-title">Thailand Departure / Arrival Card (TDAC)</div>
          <div class="header-sub">Arrival Card No. ${entry.arrivalCardNo}</div>
        </div>
        <span class="badge">${entry.status}</span>
      </div>

      <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="row"><span class="label">Full Name</span><span class="value">${entry.name}</span></div>
        <div class="row"><span class="label">Passport No.</span><span class="value">${entry.passportNo}</span></div>
        <div class="row"><span class="label">Nationality</span><span class="value">${entry.nationality}</span></div>
        <div class="row"><span class="label">Account Email</span><span class="value">${entry.accountEmail}</span></div>
      </div>

      <div class="section">
        <div class="section-title">Travel Information</div>
        <div class="travel-grid">
          <div class="travel-card">
            <div class="travel-card-title">Arrival</div>
            <div class="value">${formatDate(entry.arrivalDate)}</div>
            <div class="sub">Flight / Vehicle: ${entry.arrivalFlightOrVehicle}</div>
          </div>
          <div class="travel-card">
            <div class="travel-card-title">Departure</div>
            <div class="value">${formatDate(entry.departureDate)}</div>
            <div class="sub">Flight / Vehicle: ${entry.departureFlightOrVehicle}</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Submission Record</div>
        <div class="row"><span class="label">Submitted</span><span class="value">${formatDateTime(entry.submittedAt)}</span></div>
        <div class="row"><span class="label">Last Updated</span><span class="value">${formatDateTime(entry.updatedAt)}</span></div>
      </div>

      <div class="footer">
        <span>ThaiPass CMS — Official Record</span>
        <span>Generated: ${new Date().toLocaleString('en-GB')}</span>
      </div>

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export default function TDACDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const entry = mockTDACEntries.find((e) => e.id === id);

  if (!entry) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p className="text-lg">TDAC entry not found.</p>
        <button
          onClick={() => router.push('/tdac')}
          className="mt-4 text-sm text-[#004493] hover:underline"
        >
          ← Back to TDAC
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
        Back to TDAC
      </button>

      {/* Page Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">TDAC Submission</p>
          <h1 className="text-2xl font-bold text-slate-900">{entry.name}</h1>
          <p className="text-sm text-slate-500 mt-0.5 font-mono">{entry.arrivalCardNo}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Download PDF Button */}
          <button
            onClick={() => handleDownloadPDF(entry)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-700 text-white
              text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF
          </button>
          <TDACEntryStatusBadge status={entry.status} />
        </div>
      </div>

      <div className="space-y-5">

        {/* Submission Details */}
        <SectionCard title="Submission Details">
          <InfoRow label="Account Email" value={entry.accountEmail} />
          <InfoRow label="Full Name" value={entry.name} />
          <InfoRow label="Passport No." value={<span className="font-mono">{entry.passportNo}</span>} />
          <InfoRow label="Arrival Card No." value={<span className="font-mono">{entry.arrivalCardNo}</span>} />
          <InfoRow label="Status" value={<TDACEntryStatusBadge status={entry.status} />} />
          <InfoRow label="Submitted" value={formatDateTime(entry.submittedAt)} />
          <InfoRow label="Last Updated" value={formatDateTime(entry.updatedAt)} />
        </SectionCard>

        {/* Arrival */}
        <SectionCard title="Arrival">
          <InfoRow label="Date of Arrival" value={formatDate(entry.arrivalDate)} />
          <InfoRow label="Flight No. / Vehicle No." value={
            <span className="font-mono font-semibold text-slate-900">{entry.arrivalFlightOrVehicle}</span>
          } />
        </SectionCard>

        {/* Departure */}
        <SectionCard title="Departure">
          <InfoRow label="Date of Departure" value={formatDate(entry.departureDate)} />
          <InfoRow label="Flight No. / Vehicle No." value={
            <span className="font-mono font-semibold text-slate-900">{entry.departureFlightOrVehicle}</span>
          } />
        </SectionCard>

      </div>
    </div>
  );
}
