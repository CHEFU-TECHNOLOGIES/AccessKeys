import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Users, Key, Mail, Building2, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import { EmployeeStatusBadge } from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import Dropdown from '../components/ui/Dropdown';
import { Drawer } from '../components/ui/Modal';
import { employees, Employee, accessKeys, PERMISSION_LABELS } from '../data/sample';
import StatusBadge from '../components/ui/StatusBadge';

function EmployeeDrawer({ employee, onClose }: { employee: Employee | null; onClose: () => void }) {
  if (!employee) return null;
  const empKeys = accessKeys.filter(k => k.employeeId === employee.id);
  const activeKeys = empKeys.filter(k => k.status === 'active' || k.status === 'expiring_soon');

  return (
    <Drawer open={!!employee} onClose={onClose} title={employee.name}>
      <div className="px-6 py-5 space-y-6">
        {/* Profile */}
        <div className="flex items-center gap-4">
          <Avatar name={employee.name} size="lg" />
          <div>
            <p className="text-sm font-semibold text-zinc-100">{employee.name}</p>
            <p className="text-xs text-zinc-500">{employee.role}</p>
            <EmployeeStatusBadge status={employee.status} />
          </div>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Employee information</h3>
          <div className="divide-y divide-zinc-800">
            {[
              { label: 'Email', value: employee.email },
              { label: 'Workspace', value: employee.workspace },
              { label: 'Role', value: employee.role },
              { label: 'Joined', value: employee.joinedDate },
              { label: 'Last activity', value: employee.lastActivity },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-xs text-zinc-500">{label}</span>
                <span className="text-xs text-zinc-300">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active keys */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Active keys ({activeKeys.length})</h3>
          {activeKeys.length === 0 ? (
            <p className="text-xs text-zinc-600">No active keys assigned.</p>
          ) : (
            <div className="space-y-2">
              {activeKeys.map(k => (
                <div key={k.id} className="p-3 bg-zinc-800/50 border border-zinc-800 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-zinc-200">{k.name}</p>
                      <code className="text-xs font-mono text-zinc-600 mt-0.5 block">{k.keyMasked}</code>
                    </div>
                    <StatusBadge status={k.status} />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {k.permissions.map(p => (
                      <span key={p} className="text-xs text-zinc-600 bg-zinc-900 border border-zinc-700 px-1.5 py-0.5 rounded">
                        {PERMISSION_LABELS[p]}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default function Employees() {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [workspaceFilter, setWorkspaceFilter] = useState('All');

  const filtered = employees.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase());
    const matchWorkspace = workspaceFilter === 'All' || e.workspace === workspaceFilter;
    return matchSearch && matchWorkspace;
  });

  const workspaces = ['All', ...Array.from(new Set(employees.map(e => e.workspace)))];

  return (
    <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Employees</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage people who have access to your email infrastructure.</p>
        </div>
        <Button variant="primary" size="lg">
          <Plus className="w-4 h-4" />
          Add employee
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-800 bg-zinc-900 flex-1 min-w-0 max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={workspaceFilter}
            onChange={e => setWorkspaceFilter(e.target.value)}
            className="h-8 pl-3 pr-7 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer"
          >
            {workspaces.map(w => <option key={w}>{w}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Users className="w-5 h-5" />}
            title="No employees found"
            description="Try adjusting your search or filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Employee', 'Email', 'Workspace', 'Active keys', 'Last activity', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr
                    key={emp.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                    onClick={() => setSelectedEmployee(emp)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={emp.name} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{emp.name}</p>
                          <p className="text-xs text-zinc-600">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-400 font-mono">{emp.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-zinc-600" />
                        <span className="text-xs text-zinc-400">{emp.workspace}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Key className="w-3 h-3 text-zinc-600" />
                        <span className="text-xs text-zinc-400">{emp.activeKeys}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-zinc-500">{emp.lastActivity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <EmployeeStatusBadge status={emp.status} />
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
                          { label: 'View profile', icon: <Users className="w-3.5 h-3.5" />, onClick: () => setSelectedEmployee(emp) },
                          { label: 'Send email', icon: <Mail className="w-3.5 h-3.5" />, onClick: () => {} },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EmployeeDrawer employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
    </div>
  );
}
