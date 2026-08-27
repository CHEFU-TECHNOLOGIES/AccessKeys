import { useState } from 'react';
import { Plus, Users, Key, Building2, Activity, MoreHorizontal } from 'lucide-react';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import { workspaces } from '../data/sample';

const WORKSPACE_COLORS: Record<string, string> = {
  Marketing: 'bg-violet-500/20 border-violet-500/30 text-violet-400',
  Engineering: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  Operations: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
  Support: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
  Analytics: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-400',
};

export default function Workspaces() {
  const [view, setView] = useState<'grid' | 'table'>('grid');

  return (
    <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Workspaces</h1>
          <p className="text-sm text-zinc-500 mt-1">Organize employees and access credentials by team.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-0.5 p-0.5 bg-zinc-800 rounded-lg">
            {(['grid', 'table'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === v ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <Button variant="primary" size="lg">
            <Plus className="w-4 h-4" />
            Create workspace
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map(ws => {
            const colorClass = WORKSPACE_COLORS[ws.name] ?? 'bg-zinc-700/30 border-zinc-600 text-zinc-400';
            const letter = ws.name[0];
            return (
              <div
                key={ws.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base font-semibold ${colorClass}`}>
                    {letter}
                  </div>
                  <Dropdown
                    align="right"
                    trigger={
                      <button className="p-1.5 rounded text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      { label: 'View workspace', icon: <Building2 className="w-3.5 h-3.5" />, onClick: () => {} },
                      { label: 'Edit', icon: <Activity className="w-3.5 h-3.5" />, onClick: () => {} },
                    ]}
                  />
                </div>

                <h3 className="text-sm font-semibold text-zinc-100 mb-0.5">{ws.name}</h3>
                <p className="text-xs text-zinc-500 mb-4">{ws.description}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-xs text-zinc-400">{ws.members} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-zinc-600" />
                    <span className="text-xs text-zinc-400">{ws.activeKeys} active keys</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-xs text-zinc-500">Active</span>
                  </div>
                  <span className="text-xs text-zinc-600">Last active {ws.lastActivity}</span>
                </div>
              </div>
            );
          })}

          {/* Add new card */}
          <button className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all flex flex-col items-center justify-center gap-2 min-h-40 group">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
              <Plus className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
            </div>
            <span className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors font-medium">Create workspace</span>
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Workspace', 'Description', 'Members', 'Active keys', 'Last activity', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {workspaces.map(ws => {
                  const colorClass = WORKSPACE_COLORS[ws.name] ?? 'bg-zinc-700/30 border-zinc-600 text-zinc-400';
                  return (
                    <tr key={ws.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-semibold ${colorClass}`}>
                            {ws.name[0]}
                          </div>
                          <span className="text-xs font-semibold text-zinc-200">{ws.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">{ws.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-400">{ws.members}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <Key className="w-3 h-3 text-zinc-600" />
                          <span className="text-xs text-zinc-400">{ws.activeKeys}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">{ws.lastActivity}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
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
                            { label: 'View workspace', icon: <Building2 className="w-3.5 h-3.5" />, onClick: () => {} },
                          ]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
