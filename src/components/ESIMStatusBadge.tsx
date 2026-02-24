import { ESIMStatus } from '@/types';

const config: Record<ESIMStatus, string> = {
  'Active':     'bg-green-50 text-green-700 border border-green-200',
  'Not Active': 'bg-slate-100 text-slate-500 border border-slate-200',
};

export default function ESIMStatusBadge({ status }: { status: ESIMStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config[status]}`}>
      {status}
    </span>
  );
}
