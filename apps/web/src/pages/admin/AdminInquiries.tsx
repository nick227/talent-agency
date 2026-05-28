import { useState } from 'react'
import { useAdminInquiries, useAdminPerformers } from '@talent/sdk'
import type { CastingInquiry } from '@talent/sdk'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'

function InquiryRow({ inquiry }: { inquiry: CastingInquiry }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-4 py-3 bg-surface hover:bg-accent transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground font-sans truncate">{inquiry.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{inquiry.email}</p>
        </div>
        <div className="text-[10px] tracking-agency uppercase text-muted-foreground w-36 text-right flex-shrink-0">
          {inquiry.projectType}
        </div>
        <div className="text-[10px] tracking-agency uppercase text-muted-foreground w-28 text-right flex-shrink-0">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
      </button>
      {open && (
        <div className="px-4 py-4 bg-accent border-t border-border">
          <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
        </div>
      )}
    </>
  )
}

export function AdminInquiries() {
  const [performerFilter, setPerformerFilter] = useState('')
  const { data: performersData } = useAdminPerformers({ limit: 200 })
  const allPerformers = performersData?.pages.flatMap((p) => p.data) ?? []

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdminInquiries({
    performerId: performerFilter || undefined,
    limit: 50,
  })
  const inquiries = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div>
      <FadeIn>
        <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Casting</p>
        <h1 className="font-display font-300 tracking-tight-display text-foreground text-4xl md:text-5xl leading-none mb-12">
          Inquiries
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        {/* Filter by performer */}
        <div className="mb-6">
          <select
            value={performerFilter}
            onChange={(e) => setPerformerFilter(e.target.value)}
            className="h-9 bg-background border border-input-border text-foreground text-xs tracking-agency uppercase px-3 appearance-none focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="">All Performers</option>
            {allPerformers.map((p) => (
              <option key={p.id} value={p.id}>{p.displayName}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="space-y-px">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : inquiries.length === 0 ? (
          <EmptyState title="No inquiries yet" description="Inquiries submitted through performer profiles will appear here" />
        ) : (
          <>
            {/* Header row */}
            <div className="flex items-center gap-4 px-4 py-2 border-b border-border mb-px">
              <p className="flex-1 text-[10px] tracking-agency uppercase text-muted-foreground">Sender</p>
              <p className="w-36 text-right text-[10px] tracking-agency uppercase text-muted-foreground">Project Type</p>
              <p className="w-28 text-right text-[10px] tracking-agency uppercase text-muted-foreground">Date</p>
            </div>
            <div className="space-y-px">
              {inquiries.map((inq) => <InquiryRow key={inq.id} inquiry={inq} />)}
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
