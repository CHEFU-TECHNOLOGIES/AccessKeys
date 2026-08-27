import { useState } from 'react';
import { Copy, Check, RefreshCw, ShieldOff } from 'lucide-react';
import { Drawer } from '../components/ui/Modal';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import { AccessKey, PERMISSION_LABELS } from '../data/sample';

interface KeyDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  keyItem: AccessKey | null;
  onRevoke: (key: AccessKey) => void;
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-zinc-800 last:border-0">
      <span className="text-xs text-zinc-500 shrink-0 w-32">{label}</span>
      <span className={`text-xs text-zinc-300 text-right flex-1 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

export default function KeyDetailsDrawer({ open, onClose, keyItem, onRevoke }: KeyDetailsDrawerProps) {
  const [copied, setCopied] = useState(false);

  if (!keyItem) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(keyItem.keyMasked);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer open={open} onClose={onClose} title={keyItem.name}>
      <div className="px-6 py-5 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          <StatusBadge status={keyItem.status} />
          {keyItem.status === 'expiring_soon' && (
            <span className="text-xs text-amber-400">Expires {keyItem.expires}</span>
          )}
        </div>

        {/* Key identifier */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
          <p className="text-xs text-zinc-600 font-mono mb-1.5 uppercase tracking-wider">Secret key</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 font-mono text-sm text-zinc-300">{keyItem.keyMasked}</code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Copy key"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Key information */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Key information</h3>
          <div>
            <div className="flex items-start justify-between py-3 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 shrink-0 w-32">Key ID</span>
              <span className="text-xs text-zinc-300 text-right flex-1 font-mono">{keyItem.id}</span>
            </div>
            <div className="flex items-start justify-between py-3 border-b border-zinc-800">
              <span className="text-xs text-zinc-500 shrink-0 w-32">Employee</span>
              <div className="flex items-center gap-1.5">
                <Avatar name={keyItem.employee} size="xs" />
                <span className="text-xs text-zinc-300">{keyItem.employee}</span>
              </div>
            </div>
            <InfoRow label="Workspace" value={keyItem.workspace} />
            <InfoRow label="Created by" value={keyItem.createdBy} />
            <InfoRow label="Created" value={keyItem.created} />
            <InfoRow label="Expires" value={keyItem.expires ?? 'Never'} />
            <InfoRow label="Last used" value={keyItem.lastUsed} />
            <InfoRow label="Created from" value={keyItem.createdFrom} />
          </div>
        </div>

        {/* Permissions */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Permissions</h3>
          <div className="flex flex-wrap gap-1.5">
            {keyItem.permissions.map(p => (
              <span key={p} className="px-2 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs text-zinc-300 font-medium">
                {PERMISSION_LABELS[p]}
              </span>
            ))}
          </div>
        </div>

        {/* Credential management */}
        {keyItem.status !== 'revoked' && (
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Credential management</h3>
            <div className="space-y-3">
              <div className="p-3 border border-zinc-800 rounded-lg bg-zinc-800/30">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Regenerate key</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Generate a new credential and invalidate the current one.</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </Button>
                </div>
              </div>

              <div className="p-3 border border-red-900/40 rounded-lg bg-red-500/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-red-300">Revoke key</p>
                    <p className="text-xs text-red-400/60 mt-0.5">Immediately remove access associated with this credential.</p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="shrink-0"
                    onClick={() => { onRevoke(keyItem); onClose(); }}
                  >
                    <ShieldOff className="w-3 h-3" />
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {keyItem.status === 'revoked' && (
          <div className="p-3 border border-red-900/30 rounded-lg bg-red-500/5">
            <p className="text-xs text-red-400 font-medium">This key has been revoked and can no longer be used.</p>
          </div>
        )}
      </div>
    </Drawer>
  );
}
