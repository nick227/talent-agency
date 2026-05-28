import { Link } from 'react-router-dom'
import { useAdminPerformers, useAdminDeletePerformer } from '@talent/sdk'
import type { PerformerProfileSummary } from '@talent/sdk'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORY_LABELS: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

function PerformerRow({ performer }: { performer: PerformerProfileSummary }) {
  const deletePerformer = useAdminDeletePerformer()

  const handleDelete = async () => {
    if (!confirm(`Delete ${performer.displayName}? This cannot be undone.`)) return
    try {
      await deletePerformer.mutateAsync(performer.id)
      toast.success('Performer deleted')
    } catch {
      toast.error('Failed to delete performer')
    }
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-surface hover:bg-accent transition-colors group">
      {/* Headshot thumbnail */}
      <div className="w-10 h-10 bg-muted flex-shrink-0 overflow-hidden">
        {performer.headshotUrl ? (
          <img src={performer.headshotUrl} alt={performer.displayName} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-sans truncate">{performer.displayName}</p>
        <p className="text-[10px] tracking-agency uppercase text-muted-foreground">
          {CATEGORY_LABELS[performer.category] ?? performer.category}
          {performer.location ? ` · ${performer.location}` : ''}
        </p>
      </div>

      <div className="flex items-center gap-4 text-[10px] tracking-agency uppercase">
        {performer.isFeatured && (
          <span className="text-foreground border border-border px-2 py-0.5">Featured</span>
        )}
        <span className={performer.isPublished ? 'text-foreground' : 'text-muted-foreground'}>
          {performer.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link to={`/admin/performers/${performer.id}`}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Pencil size={12} />
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:text-destructive"
          onClick={handleDelete}
          disabled={deletePerformer.isPending}
        >
          <Trash2 size={12} />
        </Button>
      </div>
    </div>
  )
}

export function AdminPerformers() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdminPerformers({ limit: 50 })
  const performers = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div>
      <FadeIn>
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Manage</p>
            <h1 className="font-display font-300 tracking-tight-display text-foreground text-4xl md:text-5xl leading-none">
              Performers
            </h1>
          </div>
          <Link to="/admin/performers/new">
            <Button className="flex items-center gap-2">
              <Plus size={12} />
              Add Performer
            </Button>
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : performers.length === 0 ? (
          <EmptyState
            title="No performers yet"
            description="Add your first performer to get started"
            action={{ label: 'Add Performer', onClick: () => window.location.href = '/admin/performers/new' }}
          />
        ) : (
          <>
            <div className="space-y-px">
              {performers.map((p) => <PerformerRow key={p.id} performer={p} />)}
            </div>
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="text-xs tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </FadeIn>
    </div>
  )
}
