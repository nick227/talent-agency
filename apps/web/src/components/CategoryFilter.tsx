import { cn } from '@/lib/utils'
import type { PerformerCategory } from '@talent/sdk'

const CATEGORIES: { value: PerformerCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'ACTOR', label: 'Actors' },
  { value: 'MODEL', label: 'Models' },
  { value: 'DANCER', label: 'Dancers' },
  { value: 'MUSICIAN', label: 'Musicians' },
  { value: 'COMEDIAN', label: 'Comedians' },
  { value: 'HOST', label: 'Hosts' },
  { value: 'INFLUENCER', label: 'Influencers' },
]

interface CategoryFilterProps {
  value: PerformerCategory | ''
  onChange: (category: PerformerCategory | '') => void
  className?: string
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value as PerformerCategory | '')}
          className={cn(
            'font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border border-black transition-colors duration-100',
            value === cat.value
              ? 'bg-black text-white'
              : 'bg-transparent text-foreground hover:bg-black hover:text-white',
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
