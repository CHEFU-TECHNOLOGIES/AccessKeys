import { useState, useMemo } from 'react';
import { Search, ChevronDown, Key, UserPlus, UserMinus, RefreshCw, ShieldOff, Clock, Settings, Building2 } from 'lucide-react';
import { ResultBadge } from '../components/ui/StatusBadge';
import Avatar from '../components/ui/Avatar';
import EmptyState from '../components/ui/EmptyState';
import { activityEvents, ActivityEvent, ActivityType } from '../data/sample';
import { Activity as ActivityIcon } from 'lucide-react';

const TYPE_ICONS: Record<ActivityType, React.ComponentType<{ className?: string }>> = {
  key_generated: Key,
  key_revoked: ShieldOff,
  key_regenerated: RefreshCw,
  key_expired: Clock,
  employee_added: UserPlus,
  employee_removed: UserMinus,
  permission_changed: Settings,
  workspace_created: Building2,
};

const TYPE_COLORS: Record<ActivityType, string> = {
  key_generated: 'bg-emerald-500/15 text-emerald-400',
  key_revoked: 'bg-red-500/15 text-red-400',
  key_regenerated: 'bg-blue-500/15 text-blue-400',
  key_expired: 'bg-zinc-700/60 text-zinc-400',
  employee_added: 'bg-violet-500/15 text-violet-400',
  employee_removed: 'bg-orange-500/15 text-orange-400',
  permission_changed: 'bg-amber-500/15 text-amber-400',
  workspace_created: 'bg-cyan-500/15 text-cyan-400',
};

const EVENT_FILTERS = [
  'All events', 'Access key generated', 'Access key revoked', 'Access key regenerated',
  'Access key expired', 'Employee added', 'Employee removed', 'Permission changed', 'Workspace created',
];

export default function Activity() {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('All events');
  const [actorFilter, setActorFilter] = useState('All actors');

  const actors = ['All actors', ...Array.from(new Set(activityEvents.map(e => e.actor)))];

  const filtered = useMemo(() => {
    return activityEvents.filter(e => {
      const matchSearch = !search || e.event.toLowerCase().includes(search.toLowerCase()) || e.actor.toLowerCase().includes(search.toLowerCase()) || e.target.toLowerCase().includes(search.toLowerCase());
      const matchEvent = eventFilter === 'All events' || e.event === eventFilter;
      const matchActor = actorFilter === 'All actors' || e.actor === actorFilter;
      return matchSearch && matchEvent && matchActor;
    });
  }, [search, eventFilter, actorFilter]);

  return (
    <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-50 tracking-tight">Activity</h1>
        <p className="text-sm text-zinc-500 mt-1">Track security and access events across your organization.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-4 flex-wrap">
        <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-zinc-800 bg-zinc-900 flex-1 min-w-0 max-w-xs">
          <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events..."
            className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={eventFilter}
            onChange={e => setEventFilter(e.target.value)}
            className="h-8 pl-3 pr-7 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer"
          >
            {EVENT_FILTERS.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={actorFilter}
            onChange={e => setActorFilter(e.target.value)}
            className="h-8 pl-3 pr-7 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-zinc-600 appearance-none cursor-pointer"
          >
            {actors.map(o => <option key={o}>{o}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      {/* Log */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<ActivityIcon className="w-5 h-5" />}
            title="No activity found"
            description="No events match your current filters."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Event', 'Actor', 'Target', 'Workspace', 'Timestamp', 'IP address', 'Result'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-zinc-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(event => {
                  const Icon = TYPE_ICONS[event.type];
                  const color = TYPE_COLORS[event.type];
                  return (
                    <tr key={event.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-medium text-zinc-200 whitespace-nowrap">{event.event}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {event.actor !== 'System' && <Avatar name={event.actor} size="xs" />}
                          <span className="text-xs text-zinc-400">{event.actor}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-300 font-medium">{event.target}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500">{event.workspace}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-500 whitespace-nowrap">{event.timestamp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-zinc-600">{event.ip}</code>
                      </td>
                      <td className="px-4 py-3">
                        <ResultBadge result={event.result} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
