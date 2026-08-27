import { useLocation } from 'react-router';
import { Menu, Search, Bell } from 'lucide-react';
import { useState } from 'react';

const routeTitles: Record<string, { title: string; breadcrumb?: string }> = {
  '/': { title: 'Overview' },
  '/access-keys': { title: 'Access Keys', breadcrumb: 'Access Keys' },
  '/employees': { title: 'Employees', breadcrumb: 'Employees' },
  '/workspaces': { title: 'Workspaces', breadcrumb: 'Workspaces' },
  '/activity': { title: 'Activity', breadcrumb: 'Activity' },
  '/settings': { title: 'Settings', breadcrumb: 'Settings' },
};

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const route = routeTitles[location.pathname] ?? { title: 'AccessKeys' };
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="h-14 flex items-center gap-4 px-4 lg:px-6 border-b border-zinc-800/60 bg-zinc-950 shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-1.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-sm">
        <span className="text-zinc-500">CHEFU Technologies</span>
        {route.breadcrumb && (
          <>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300 font-medium">{route.breadcrumb}</span>
          </>
        )}
      </div>

      {/* Mobile title */}
      <span className="lg:hidden text-sm font-semibold text-zinc-200">{route.title}</span>

      <div className="flex-1" />

      {/* Search */}
      <div className={`hidden sm:flex items-center gap-2 h-8 px-3 rounded-md border text-sm transition-all duration-150 ${
        searchFocused ? 'border-zinc-600 bg-zinc-800/80 w-56' : 'border-zinc-800 bg-zinc-900/50 w-44 hover:border-zinc-700'
      }`}>
        <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Search..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="flex-1 bg-transparent text-zinc-300 placeholder-zinc-600 outline-none text-sm min-w-0"
        />
        {!searchFocused && (
          <kbd className="text-zinc-600 text-xs font-mono border border-zinc-700 rounded px-1">⌘K</kbd>
        )}
      </div>

      {/* Notifications */}
      <button className="relative p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors">
        <Bell className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-violet-500" />
      </button>

      {/* Avatar */}
      <button className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 text-xs font-mono font-medium hover:bg-violet-500/30 transition-colors">
        AU
      </button>
    </header>
  );
}
