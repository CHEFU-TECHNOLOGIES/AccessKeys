import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiUrl, readApiError } from '../lib/api';
import { fetchAdminProfile, AdminProfile } from '../lib/session';
import type { AccessKey as LegacyAccessKey } from '../data/sample';

export type FlowKeyStatus = 'active' | 'expired' | 'revoked';

type ApiAccessKey = {
  id: string;
  label: string;
  createdAt: string | null;
  createdBy: string | null;
  expiresAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
  revokedBy: string | null;
  status: FlowKeyStatus;
  updatedAt: string | null;
  permission: AccessKeyPermission;
};

export type AccessKeyPermission = 'read' | 'write' | 'full';

export type AccessKey = LegacyAccessKey & Omit<ApiAccessKey, 'id' | 'status'> & { id: string };

export interface CreatedAccessKey {
  accessKey: string;
  expiresAt: string | null;
  keyId: string;
  keyLabel: string;
  status: FlowKeyStatus;
}

interface DataContextType {
  keys: AccessKey[];
  profile: AdminProfile;
  isLoading: boolean;
  error: string;
  refreshKeys: () => Promise<void>;
  createKey: (label: string, expiresAt: string | null, permission: AccessKeyPermission) => Promise<CreatedAccessKey>;
  revokeKey: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshKeys = async () => {
    setError('');
    const response = await fetch(apiUrl('/flow/admin/access-keys'), { cache: 'no-store', credentials: 'include' });
    if (!response.ok) throw new Error(await readApiError(response, 'Unable to load Flow access keys.'));
    const data = (await response.json()) as { keys?: ApiAccessKey[] };
    setKeys((data.keys || []).map(key => ({
      ...key,
      name: key.label,
      employee: 'Flow integration',
      employeeId: '',
      workspace: 'Flow',
      keyMasked: `FLOW_••••••••••••${key.id.slice(-4).toUpperCase()}`,
      keyLastFour: key.id.slice(-4).toUpperCase(),
      permissions: [],
      permission: key.permission || 'full',
      created: key.createdAt ? new Date(key.createdAt).toLocaleDateString() : 'Unknown',
      expires: key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : null,
      lastUsed: key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never',
      createdBy: key.createdBy || 'Unknown',
      createdFrom: 'Flow console',
    })));
  };

  useEffect(() => {
    fetchAdminProfile()
      .then(async currentProfile => {
        if (!currentProfile || !currentProfile.roles.some(role => role.toLowerCase() === 'admin')) {
          setError('An administrator account is required.');
          return;
        }
        setProfile(currentProfile);
        await refreshKeys();
      })
      .catch(caught => setError(caught instanceof Error ? caught.message : 'Unable to load admin session.'))
      .finally(() => setIsLoading(false));
  }, []);

  const createKey = async (label: string, expiresAt: string | null, permission: AccessKeyPermission) => {
    const response = await fetch(apiUrl('/flow/admin/access-keys'), {
      body: JSON.stringify({ label, permission, ...(expiresAt ? { expiresAt } : {}) }),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
    if (!response.ok) throw new Error(await readApiError(response, 'Unable to generate key.'));
    const created = (await response.json()) as CreatedAccessKey;
    await refreshKeys();
    return created;
  };

  const revokeKey = async (id: string) => {
    const response = await fetch(apiUrl(`/flow/admin/access-keys/${id}/revoke`), { credentials: 'include', method: 'POST' });
    if (!response.ok) throw new Error(await readApiError(response, 'Unable to revoke key.'));
    await refreshKeys();
  };

  return <DataContext.Provider value={{ keys, profile: profile as AdminProfile, isLoading, error, refreshKeys, createKey, revokeKey }}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
