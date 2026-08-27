import { KeyStatus } from '../../data/sample';

const config: Record<KeyStatus, { label: string; dot: string; bg: string; text: string }> = {
  active: { label: 'Active', dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  expiring_soon: { label: 'Expiring soon', dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-400' },
  expired: { label: 'Expired', dot: 'bg-zinc-500', bg: 'bg-zinc-700/40', text: 'text-zinc-400' },
  revoked: { label: 'Revoked', dot: 'bg-red-500', bg: 'bg-red-500/10', text: 'text-red-400' },
};

export default function StatusBadge({ status }: { status: KeyStatus }) {
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
      {c.label}
    </span>
  );
}

export function EmployeeStatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return status === 'active' ? (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-700/40 text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
      Inactive
    </span>
  );
}

export function ResultBadge({ result }: { result: 'success' | 'failed' }) {
  return result === 'success' ? (
    <span className="text-xs font-medium text-emerald-400">Successful</span>
  ) : (
    <span className="text-xs font-medium text-red-400">Failed</span>
  );
}
