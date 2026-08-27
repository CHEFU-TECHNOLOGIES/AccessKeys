import { createContext, useContext, useState, ReactNode } from 'react';
import { accessKeys as initialKeys, employees as initialEmployees, AccessKey, Employee } from '../data/sample';

interface DataContextType {
  keys: AccessKey[];
  employees: Employee[];
  revokeKey: (id: string) => void;
  addKey: (key: AccessKey) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useState<AccessKey[]>(initialKeys);
  const [employees] = useState<Employee[]>(initialEmployees);

  const revokeKey = (id: string) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' as const } : k));
  };

  const addKey = (key: AccessKey) => {
    setKeys(prev => [key, ...prev]);
  };

  return (
    <DataContext.Provider value={{ keys, employees, revokeKey, addKey }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
