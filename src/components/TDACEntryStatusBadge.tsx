import { TDACEntryStatus } from '@/types';

const statusConfig: Record<TDACEntryStatus, { className: string }> = {
  Active: {
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  Expired: {
    className: 'bg-slate-100 text-slate-500 border border-slate-200',
  },
};

export default function TDACEntryStatusBadge({ status }: { status: TDACEntryStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].className}`}
    >
      {status}
    </span>
  );
}
