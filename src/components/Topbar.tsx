import { Menu } from 'lucide-react';
import { useLocation } from 'react-router';


interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const pageTitle = location.pathname.startsWith('/merchant') ? 'Chefu products' : 'Flow access keys';

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
        <span className="text-zinc-500">Chefu Technologies</span>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300 font-medium">{pageTitle}</span>
      </div>

      {/* Mobile title */}
      <span className="lg:hidden text-sm font-semibold text-zinc-200">{pageTitle}</span>

      <div className="flex-1" />

    </header>
  );
}
