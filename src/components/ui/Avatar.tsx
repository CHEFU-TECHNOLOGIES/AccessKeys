const colors = [
  'bg-violet-500/20 border-violet-500/30 text-violet-300',
  'bg-blue-500/20 border-blue-500/30 text-blue-300',
  'bg-emerald-500/20 border-emerald-500/30 text-emerald-300',
  'bg-amber-500/20 border-amber-500/30 text-amber-300',
  'bg-rose-500/20 border-rose-500/30 text-rose-300',
  'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

interface AvatarProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-7 h-7 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-sm',
};

export default function Avatar({ name, size = 'sm' }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const color = getColor(name);
  return (
    <div className={`${sizes[size]} rounded-full border flex items-center justify-center font-medium font-mono shrink-0 ${color}`}>
      {initials}
    </div>
  );
}
