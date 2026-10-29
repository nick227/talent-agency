import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PerformerProfileSummary } from '@talent/sdk'

interface PerformerCardProps {
  performer: PerformerProfileSummary
  className?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

export function PerformerCard({ performer, className }: PerformerCardProps) {
  return (
    <Link
      to={`/performers/${performer.slug ?? performer.id}`}
      className={cn(
        'group flex items-center justify-between p-4 border-b border-r border-black',
        'hover:bg-black transition-colors duration-100 cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {/* Small bordered grayscale portrait */}
        <div className="w-16 h-20 border border-black overflow-hidden bg-muted shrink-0">
          {performer.headshotUrl ? (
            <img
              src={performer.headshotUrl}
              alt={performer.displayName}
              className="w-full h-full object-cover grayscale"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[10px] text-muted-foreground group-hover:text-white/50">N/A</span>
            </div>
          )}
        </div>

        <div>
          <p className="font-display text-headline-md font-semibold text-foreground group-hover:text-white uppercase leading-tight">
            {performer.displayName}
          </p>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground group-hover:text-white/70 mt-0.5">
            {CATEGORY_LABELS[performer.category] ?? performer.category}
            {performer.location ? ` / ${performer.location}` : ''}
          </p>
        </div>
      </div>

      <ArrowUpRight
        size={20}
        className="text-foreground group-hover:text-white shrink-0 ml-4"
      />
    </Link>
  )
}

export function PerformerCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-r border-black">
      <div className="w-16 h-20 bg-muted animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-5 w-2/3 bg-muted animate-pulse" />
        <div className="h-3 w-1/3 bg-muted animate-pulse" />
      </div>
    </div>
  )
}
