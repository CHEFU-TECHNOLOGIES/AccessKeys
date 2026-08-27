import { Menu } from 'lucide-react';


interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {

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
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300 font-medium">Flow access keys</span>
      </div>

      {/* Mobile title */}
      <span className="lg:hidden text-sm font-semibold text-zinc-200">Flow access keys</span>

      <div className="flex-1" />

    </header>
  );
}
