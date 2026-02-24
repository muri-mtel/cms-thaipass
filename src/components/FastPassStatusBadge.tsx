import { FastPassStatus } from '@/types';

const statusConfig: Record<FastPassStatus, { className: string }> = {
  Active: {
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  Redeemed: {
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
  },
  Expired: {
    className: 'bg-slate-100 text-slate-500 border border-slate-200',
  },
};

interface FastPassStatusBadgeProps {
  status: FastPassStatus;
}

export default function FastPassStatusBadge({ status }: FastPassStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {status}
    </span>
  );
}
