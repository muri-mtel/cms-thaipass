import { TDACStatus } from '@/types';

const statusConfig: Record<TDACStatus, { label: string; className: string }> = {
  'No Submission': {
    label: 'No Submission',
    className: 'bg-slate-100 text-slate-600 border border-slate-200',
  },
  'Submitted': {
    label: 'Submitted',
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
};

interface TDACStatusBadgeProps {
  status: TDACStatus;
}

export default function TDACStatusBadge({ status }: TDACStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.className}`}
      title={status}
    >
      {config.label}
    </span>
  );
}
