import { useState } from 'react';
import { Save, Shield, Bell, Building2, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';

function Section({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 py-4 border-b border-zinc-800 last:border-0">
      <div className="sm:flex-1 sm:max-w-sm">
        <p className="text-sm font-medium text-zinc-300">{label}</p>
        {description && <p className="text-xs text-zinc-600 mt-0.5">{description}</p>}
      </div>
      <div className="sm:flex-1 sm:max-w-xs">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-zinc-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export default function Settings() {
  const [orgName, setOrgName] = useState('Chefu Technologies');
  const [defaultWs, setDefaultWs] = useState('Engineering');
  const [requireExpiry, setRequireExpiry] = useState(true);
  const [maxLifetime, setMaxLifetime] = useState('1y');
  const [sessionTimeout, setSessionTimeout] = useState('8h');
  const [notifyExpiring, setNotifyExpiring] = useState(true);
  const [notifyRevoked, setNotifyRevoked] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-6 lg:px-8 py-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage organization and security configuration.</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          className={saved ? '!bg-emerald-600 !border-emerald-500/50' : ''}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved' : 'Save changes'}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Organization */}
        <Section title="Organization" icon={Building2}>
          <Field label="Organization name" description="The display name for your organization.">
            <input
              type="text"
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              className="w-full h-8 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-colors"
            />
          </Field>
          <Field label="Organization ID" description="Unique identifier for your organization.">
            <div className="flex items-center gap-2">
              <code className="flex-1 h-8 px-3 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-500 font-mono flex items-center">org_a4f82bc190d3</code>
              <button className="text-xs text-zinc-500 hover:text-zinc-300 px-2">Copy</button>
            </div>
          </Field>
          <Field label="Default workspace" description="New keys are assigned to this workspace by default.">
            <div className="relative">
              <select
                value={defaultWs}
                onChange={e => setDefaultWs(e.target.value)}
                className="w-full h-8 pl-3 pr-7 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 appearance-none transition-colors"
              >
                {['Engineering', 'Marketing', 'Operations', 'Support', 'Analytics'].map(w => (
                  <option key={w}>{w}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </Field>
        </Section>

        {/* Security */}
        <Section title="Security" icon={Shield}>
          <Field label="Require expiration" description="All access keys must have an expiration date.">
            <Toggle checked={requireExpiry} onChange={setRequireExpiry} />
          </Field>
          <Field label="Maximum key lifetime" description="The longest duration a key can be valid for.">
            <div className="relative">
              <select
                value={maxLifetime}
                onChange={e => setMaxLifetime(e.target.value)}
                className="w-full h-8 pl-3 pr-7 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 appearance-none transition-colors"
              >
                {[{ label: '30 days', value: '30d' }, { label: '90 days', value: '90d' }, { label: '6 months', value: '6m' }, { label: '1 year', value: '1y' }].map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </Field>
          <Field label="Session timeout" description="Admin sessions are invalidated after this period of inactivity.">
            <div className="relative">
              <select
                value={sessionTimeout}
                onChange={e => setSessionTimeout(e.target.value)}
                className="w-full h-8 pl-3 pr-7 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 appearance-none transition-colors"
              >
                {[{ label: '1 hour', value: '1h' }, { label: '4 hours', value: '4h' }, { label: '8 hours', value: '8h' }, { label: '24 hours', value: '24h' }].map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </Field>
          <Field label="Key expiration policy" description="Automatically revoke keys 7 days after expiry.">
            <div className="relative">
              <select
                className="w-full h-8 pl-3 pr-7 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-violet-500 appearance-none transition-colors"
              >
                <option>Revoke after 7 days</option>
                <option>Revoke immediately</option>
                <option>Keep expired keys</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
            </div>
          </Field>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          <Field label="Expiring key alerts" description="Get notified when credentials are about to expire.">
            <Toggle checked={notifyExpiring} onChange={setNotifyExpiring} />
          </Field>
          <Field label="Key revocation alerts" description="Get notified when a key is revoked.">
            <Toggle checked={notifyRevoked} onChange={setNotifyRevoked} />
          </Field>
          <Field label="Security alerts" description="Receive alerts for suspicious access activity.">
            <Toggle checked={securityAlerts} onChange={setSecurityAlerts} />
          </Field>
        </Section>

        {/* Danger zone */}
        <div className="bg-zinc-900 border border-red-900/40 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-red-900/30">
            <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
          </div>
          <div className="px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-zinc-300">Revoke all active keys</p>
                <p className="text-xs text-zinc-600 mt-0.5">Immediately revoke all active credentials. This action cannot be undone.</p>
              </div>
              <Button variant="danger" size="sm" className="shrink-0">Revoke all</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
