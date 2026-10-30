import { Link, useNavigate } from 'react-router-dom'
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
  
  const navigate = useNavigate()
  return (
    <Link
      to={`/performers/${performer.slug ?? performer.id}`}
      className={cn(
        'group flex items-center justify-between p-4 border-b border-r border-black',
        'cursor-pointer',
        className,
      )}
    >
      <div className="flex items-center gap-4  mb-12 pt-12">
        {/* Small bordered grayscale portrait */}
        <div className="w-[50%] border border-black overflow-hidden bg-muted shrink-0">
          {performer.headshotUrl ? (
            <img
              src={performer.headshotUrl}
              alt={performer.displayName}
              className="w-full h-full object-cover grayscale"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[10px] text-foreground">N/A</span>
            </div>
          )}
        </div>

        <div className="h-full flex flex-col justify-start gap-2">
          <div>
          <p className="font-display text-headline-md font-semibold text-foreground uppercase leading-tight">
            {performer.displayName}
          </p>
          <p className="font-mono text-label-mono tracking-agency uppercase text-foreground mt-0.5">
            {CATEGORY_LABELS[performer.category] ?? performer.category}
            {performer.location ? (
              <> / <button
                type="button"
                className="underline text-foreground"
                onClick={e => { e.stopPropagation(); navigate(`/talent?location=${encodeURIComponent(performer.location ?? '')}`) }}
              >
                {performer.location}
              </button></>
            ) : null}
          </p>
          </div>
          <p className="font-display text-body-lg text-foreground leading-tight">
            {performer.bio}
          </p>
        </div>
      </div>

      <ArrowUpRight size={20} className="text-foreground shrink-0 ml-4" />
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
