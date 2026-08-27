import { useState, useMemo } from 'react';
import { Plus, Search, SlidersHorizontal, MoreHorizontal, Eye, Copy, RefreshCw, ShieldOff, Key, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import Dropdown from '../components/ui/Dropdown';
import GenerateKeyModal from '../modals/GenerateKeyModal';
import RevokeModal from '../modals/RevokeModal';
import KeyDetailsDrawer from '../modals/KeyDetailsDrawer';
import { useData } from '../context/DataContext';
import { AccessKey, KeyStatus, PERMISSION_LABELS } from '../data/sample';

const STATUS_OPTIONS: { label: string; value: KeyStatus | 'all' }[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expiring soon', value: 'expiring_soon' },
  { label: 'Expired', value: 'expired' },
  { label: 'Revoked', value: 'revoked' },
];

const WORKSPACE_OPTIONS = ['All workspaces', 'Marketing', 'Engineering', 'Operations', 'Support', 'Analytics'];

const PAGE_SIZE = 8;

export default function AccessKeys() {
  const { keys, revokeKey } = useData();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<AccessKey | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<KeyStatus | 'all'>('all');
  const [workspaceFilter, setWorkspaceFilter] = useState('All workspaces');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return keys.filter(k => {
      const matchSearch = !search || k.name.toLowerCase().includes(search.toLowerCase()) || k.employee.toLowerCase().includes(search.toLowerCase()) || k.keyMasked.includes(search);
      const matchStatus = statusFilter === 'all' || k.status === statusFilter;
      const matchWorkspace = workspaceFilter === 'All workspaces' || k.workspace === workspaceFilter;
      return matchSearch && matchStatus && matchWorkspace;
    });
  }, [keys, search, statusFilter, workspaceFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openRevoke = (key: AccessKey) => {
    setSelectedKey(key);
    setRevokeOpen(true);
  };

  const openDetails = (key: AccessKey) => {
    setSelectedKey(key);
    setDetailsOpen(true);
  };

  return (
    <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Access Keys</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage credentials that provide access to your email infrastructure.</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setGenerateOpen(true)}>
          <Plus className="w-4 h-4" />
          Generate access key
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-800 bg-zinc-900 flex-1 min-w-0 max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, employee, or key..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value as KeyStatus | 'all'); setPage(1); }}
              className="h-8 pl-3 pr-7 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer"
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={workspaceFilter}
              onChange={e => { setWorkspaceFilter(e.target.value); setPage(1); }}
              className="h-8 pl-3 pr-7 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer"
            >
              {WORKSPACE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
          </div>

          <button className="flex items-center gap-1.5 h-8 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Sort
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState
            icon={<Key className="w-5 h-5" />}
            title="No access keys"
            description={search || statusFilter !== 'all' ? 'No keys match your current filters.' : 'Create your first credential to give an employee or workspace secure access to the email platform.'}
            action={!search && statusFilter === 'all' ? { label: '+ Generate access key', onClick: () => setGenerateOpen(true) } : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    {['Name', 'Employee / Workspace', 'Key', 'Status', 'Permissions', 'Created', 'Expires', 'Last used', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(key => (
                    <tr
                      key={key.id}
                      className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                      onClick={() => openDetails(key)}
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-zinc-200 whitespace-nowrap">{key.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={key.employee} size="xs" />
                          <div>
                            <p className="text-xs font-medium text-zinc-300 whitespace-nowrap">{key.employee}</p>
                            <p className="text-xs text-zinc-600">{key.workspace}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-zinc-500">{key.keyMasked}</code>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={key.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {key.permissions.slice(0, 2).map(p => (
                            <span key={p} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded font-medium whitespace-nowrap">
                              {PERMISSION_LABELS[p]}
                            </span>
                          ))}
                          {key.permissions.length > 2 && (
                            <span className="text-xs text-zinc-600 px-1 py-0.5">+{key.permissions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500 whitespace-nowrap">{key.created}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs whitespace-nowrap ${key.status === 'expiring_soon' ? 'text-amber-400 font-medium' : 'text-zinc-500'}`}>
                          {key.expires ?? 'Never'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500 whitespace-nowrap">{key.lastUsed}</span>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <Dropdown
                          align="right"
                          trigger={
                            <button className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-700 transition-colors opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          }
                          items={[
                            { label: 'View details', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => openDetails(key) },
                            { label: 'Copy key', icon: <Copy className="w-3.5 h-3.5" />, onClick: () => navigator.clipboard.writeText(key.keyMasked) },
                            { label: 'Regenerate', icon: <RefreshCw className="w-3.5 h-3.5" />, onClick: () => {} },
                            ...(key.status !== 'revoked' ? [{ label: 'Revoke', icon: <ShieldOff className="w-3.5 h-3.5" />, onClick: () => openRevoke(key), danger: true, divider: true }] : []),
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-800">
                <span className="text-xs text-zinc-500">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} keys
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-zinc-500 px-2">{page} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <GenerateKeyModal open={generateOpen} onClose={() => setGenerateOpen(false)} />
      <RevokeModal
        open={revokeOpen}
        onClose={() => setRevokeOpen(false)}
        onConfirm={() => selectedKey && revokeKey(selectedKey.id)}
        keyItem={selectedKey}
      />
      <KeyDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        keyItem={selectedKey}
        onRevoke={key => { setSelectedKey(key); setRevokeOpen(true); }}
      />
    </div>
  );
}
