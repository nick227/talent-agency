import { Link } from 'react-router-dom'
import { useAdminPerformers, useAdminUpdatePerformer, useAdminDeletePerformer } from '@talent/sdk'
import type { PerformerProfileSummary } from '@talent/sdk'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { toast } from 'sonner'

const CATEGORY_LABELS: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

function PerformerRow({ performer }: { performer: PerformerProfileSummary }) {
  const updatePerformer = useAdminUpdatePerformer()
  const deletePerformer = useAdminDeletePerformer()

  const togglePublished = async () => {
    try {
      await updatePerformer.mutateAsync({
        performerId: performer.id,
        body: { isPublished: !performer.isPublished },
      })
      toast.success(performer.isPublished ? 'Unpublished' : 'Published')
    } catch {
      toast.error('Failed to update visibility')
    }
  }

  const toggleFeatured = async () => {
    try {
      await updatePerformer.mutateAsync({
        performerId: performer.id,
        body: { isFeatured: !performer.isFeatured },
      })
      toast.success(performer.isFeatured ? 'Removed from featured' : 'Marked as featured')
    } catch {
      toast.error('Failed to update featured status')
    }
  }

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
    <div className="flex items-center gap-4 px-4 py-3 border-b border-r border-black bg-background hover:bg-muted transition-colors group">
      <div className="w-10 h-14 bg-muted shrink-0 overflow-hidden border border-black">
        {performer.headshotUrl ? (
          <img
            src={performer.headshotUrl}
            alt={performer.displayName}
            className="w-full h-full object-cover object-top grayscale"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[9px] text-muted-foreground">N/A</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-display text-sm font-semibold text-foreground uppercase truncate leading-tight">
          {performer.displayName}
        </p>
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mt-0.5">
          {CATEGORY_LABELS[performer.category] ?? performer.category}
          {performer.location ? ` / ${performer.location}` : ''}
        </p>
        {performer.slug && (
          <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">/{performer.slug}</p>
        )}
      </div>

      {/* Status badges */}
      <div className="flex items-center gap-3 shrink-0">
        {performer.isFeatured && (
          <span className="font-mono text-label-mono tracking-agency uppercase border border-black px-2 py-0.5 text-foreground">
            Featured
          </span>
        )}
        <span className={
          performer.isPublished
            ? 'font-mono text-label-mono tracking-agency uppercase text-foreground'
            : 'font-mono text-label-mono tracking-agency uppercase text-muted-foreground'
        }>
          {performer.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {/* Actions — visible on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={togglePublished}
          disabled={updatePerformer.isPending}
          title={performer.isPublished ? 'Unpublish' : 'Publish'}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          {performer.isPublished ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
        <button
          onClick={toggleFeatured}
          disabled={updatePerformer.isPending}
          title={performer.isFeatured ? 'Remove from featured' : 'Feature'}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          <Star size={13} className={performer.isFeatured ? 'fill-foreground' : ''} />
        </button>
        <Link
          to={`/admin/performers/${performer.id}`}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Pencil size={13} />
        </Link>
        <button
          onClick={handleDelete}
          disabled={deletePerformer.isPending}
          className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
        >
          <Trash2 size={13} />
        </button>
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
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Manage</p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight-display uppercase text-foreground leading-none">
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
          <div className="border-t border-l border-black">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full border-b border-r border-black" />
            ))}
          </div>
        ) : performers.length === 0 ? (
          <EmptyState
            title="No performers yet"
            description="Add your first performer to get started"
            action={{ label: 'Add Performer', onClick: () => window.location.href = '/admin/performers/new' }}
          />
        ) : (
          <>
            {/* Column headers */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-l border-b border-r border-black bg-muted">
              <div className="w-10 shrink-0" />
              <p className="flex-1 font-mono text-label-mono tracking-agency uppercase text-muted-foreground">Performer</p>
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground w-40 text-right">Status</p>
              <div className="w-32" />
            </div>
            <div className="border-t border-l border-black">
              {performers.map((p) => <PerformerRow key={p.id} performer={p} />)}
            </div>
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
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
