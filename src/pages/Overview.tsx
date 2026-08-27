import { useState } from 'react';
import { Plus, Key, TrendingUp, Clock, ShieldOff, MoreHorizontal, Eye, Copy } from 'lucide-react';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import GenerateKeyModal from '../modals/GenerateKeyModal';
import RevokeModal from '../modals/RevokeModal';
import KeyDetailsDrawer from '../modals/KeyDetailsDrawer';
import Dropdown from '../components/ui/Dropdown';
import { useData } from '../context/DataContext';
import { AccessKey, PERMISSION_LABELS } from '../data/sample';

function StatCard({
  label, value, sub, trend, icon: Icon, color,
}: {
  label: string; value: string | number; sub?: string; trend?: string;
  icon: React.ComponentType<{ className?: string; size?: number }>; color: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 mb-3">{label}</p>
          <p className="text-3xl font-semibold text-zinc-50 tabular-nums">{value}</p>
          {sub && <p className="text-xs text-zinc-500 mt-1.5">{sub}</p>}
          {trend && <p className="text-xs text-zinc-600 mt-1.5">{trend}</p>}
        </div>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" size={18} />
        </div>
      </div>
    </div>
  );
}

export default function Overview() {
  const { keys, revokeKey } = useData();
  const [generateOpen, setGenerateOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<AccessKey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const active = keys.filter(k => k.status === 'active').length;
  const expiringSoon = keys.filter(k => k.status === 'expiring_soon').length;
  const expired = keys.filter(k => k.status === 'expired').length;
  const revoked = keys.filter(k => k.status === 'revoked').length;

  const recentKeys = keys.slice(0, 8);

  const handleCopy = async (key: AccessKey) => {
    await navigator.clipboard.writeText(key.keyMasked);
    setCopiedId(key.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openRevoke = (key: AccessKey) => {
    setSelectedKey(key);
    setRevokeOpen(true);
  };

  const openDetails = (key: AccessKey) => {
    setSelectedKey(key);
    setDetailsOpen(true);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">{greeting}, Admin</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage secure access to your email infrastructure.</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => setGenerateOpen(true)}>
          <Plus className="w-4 h-4" />
          Generate access key
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Active Keys"
          value={active}
          sub="Credentials in use"
          icon={Key}
          color="bg-violet-500/15 text-violet-400"
        />
        <StatCard
          label="Expiring Soon"
          value={expiringSoon}
          sub="Within 30 days"
          icon={Clock}
          color="bg-amber-500/15 text-amber-400"
        />
        <StatCard
          label="Expired"
          value={expired}
          sub="Need renewal"
          icon={TrendingUp}
          color="bg-zinc-700/60 text-zinc-400"
        />
        <StatCard
          label="Revoked"
          value={revoked}
          sub="Access removed"
          icon={ShieldOff}
          color="bg-red-500/15 text-red-400"
        />
      </div>

      {/* Recent Keys */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200">Recent Access Keys</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{keys.length} total credentials</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/access-keys'}>
            View all
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Employee', 'Key name', 'Key', 'Status', 'Permissions', 'Expires', 'Last used', ''].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentKeys.map(key => (
                <tr
                  key={key.id}
                  className="border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                  onClick={() => openDetails(key)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={key.employee} size="xs" />
                      <div>
                        <p className="text-xs font-medium text-zinc-200 whitespace-nowrap">{key.employee}</p>
                        <p className="text-xs text-zinc-600">{key.workspace}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-zinc-300">{key.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs font-mono text-zinc-500">{key.keyMasked}</code>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={key.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.slice(0, 2).map(p => (
                        <span key={p} className="text-xs text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded font-medium">
                          {PERMISSION_LABELS[p]}
                        </span>
                      ))}
                      {key.permissions.length > 2 && (
                        <span className="text-xs text-zinc-600">+{key.permissions.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${key.status === 'expiring_soon' ? 'text-amber-400 font-medium' : 'text-zinc-500'}`}>
                      {key.expires ?? 'Never'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-zinc-500">{key.lastUsed}</span>
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <Dropdown
                      align="right"
                      trigger={
                        <button className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      }
                      items={[
                        { label: 'View details', icon: <Eye className="w-3.5 h-3.5" />, onClick: () => openDetails(key) },
                        { label: 'Copy key', icon: <Copy className="w-3.5 h-3.5" />, onClick: () => handleCopy(key) },
                        ...(key.status !== 'revoked' ? [{ label: 'Revoke', icon: <ShieldOff className="w-3.5 h-3.5" />, onClick: () => openRevoke(key), danger: true, divider: true }] : []),
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
