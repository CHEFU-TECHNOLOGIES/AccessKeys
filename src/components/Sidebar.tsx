import { NavLink } from 'react-router';
import { KeyRound, X, Shield, LogOut, UserRound } from 'lucide-react';
import Dropdown from './ui/Dropdown';
import { useData } from '../context/DataContext';
import { accountLogoutUrl } from '../lib/api';

const navItems = [
    { to: '/', label: 'Flow access keys', icon: KeyRound, end: true },
];

function Avatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm';
    return (
        <div className={`${sizeClass} rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-300 font-medium font-mono shrink-0`}>
            {initials}
        </div>
    );
}

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { profile } = useData();

    return (
        <aside
            className={`
        fixed inset-y-0 left-0 z-30 w-60 flex flex-col
        bg-zinc-950 border-r border-zinc-800/60
        transition-transform duration-200 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shrink-0
      `}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-sm font-semibold text-zinc-50 tracking-tight">AccessKeys</span>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-100 group ${isActive
                                ? 'bg-zinc-800 text-zinc-50'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} strokeWidth={1.75} />
                                <span className="font-medium">{label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom section */}
            <div className="px-3 pb-4 space-y-px border-t border-zinc-800/60 pt-3">
                <Dropdown
                    align="left"
                    trigger={
                        <button
                            type="button"
                            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                        >
                            <Avatar name={profile?.email || 'Admin User'} />
                            <span className="flex-1 min-w-0 text-left">
                                <span className="block font-medium text-zinc-300 truncate text-xs">
                                    {profile?.email || 'Admin User'}
                                </span>
                                <span className="block text-zinc-500 truncate text-xs">
                                    {profile?.roles.join(', ') || 'Administrator'}
                                </span>
                            </span>
                            <UserRound className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                        </button>
                    }
                    items={[
                        { label: 'Account profile', icon: <UserRound />, onClick: () => {} },
                        {
                            label: 'Sign out',
                            icon: <LogOut />,
                            danger: true,
                            divider: true,
                            onClick: () => window.location.assign(accountLogoutUrl(window.location.origin)),
                        },
                    ]}
                />
            </div>
        </aside>
    );
}
