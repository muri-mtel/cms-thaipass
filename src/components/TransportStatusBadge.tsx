import { TransportStatus } from '@/types';

const statusConfig: Record<TransportStatus, { className: string }> = {
  Pending: {
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  Confirmed: {
    className: 'bg-blue-50 text-[#004493] border border-blue-200',
  },
  Completed: {
    className: 'bg-green-50 text-green-700 border border-green-200',
  },
  Cancelled: {
    className: 'bg-red-50 text-red-600 border border-red-200',
  },
};

export default function TransportStatusBadge({ status }: { status: TransportStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].className}`}
    >
      {status}
    </span>
  );
}
