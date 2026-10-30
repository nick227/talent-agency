import { cn } from '@/lib/utils'
import { CATEGORY_OPTIONS, PerformerCategory } from '@/constants/categories'
import { HorizontalScroll } from '@/components/ui/HorizontalScroll'

interface CategoryFilterProps {
  value: PerformerCategory | ''
  onChange: (category: PerformerCategory | '') => void
  className?: string
}

export function CategoryFilter({ value, onChange, className }: CategoryFilterProps) {
  return (
    <HorizontalScroll className={className}>
      {CATEGORY_OPTIONS.map((cat) => (
        <button
          key={cat.value}
          type="button"
          onClick={() => onChange(cat.value as PerformerCategory | '')}
          className={cn(
            'shrink-0 whitespace-nowrap font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border border-black transition-colors duration-100',
            value === cat.value
              ? 'bg-black text-white'
              : 'bg-transparent text-foreground hover:bg-black hover:text-white',
          )}
        >
          {cat.label}
        </button>
      ))}
    </HorizontalScroll>
  )
}
