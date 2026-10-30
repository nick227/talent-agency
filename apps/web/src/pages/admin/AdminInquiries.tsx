import { useState } from 'react'
import { useAdminInquiries, useAdminPerformers } from '@talent/sdk'
import type { CastingInquiry } from '@talent/sdk'
import { usePageTitle } from '@/hooks/usePageTitle'
import { FadeIn } from '@/components/animation/FadeIn'
import { Skeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { ChevronDown, ChevronUp } from 'lucide-react'

function InquiryRow({ inquiry }: { inquiry: CastingInquiry }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-r border-black">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-4 py-3 bg-background hover:bg-muted transition-colors text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-sans text-sm text-foreground truncate">{inquiry.name}</p>
          <p className="font-mono text-[10px] text-muted-foreground truncate">{inquiry.email}</p>
        </div>
        <div className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground w-36 text-right shrink-0">
          {inquiry.projectType}
        </div>
        <div className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground w-28 text-right shrink-0">
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
        <div className="text-muted-foreground shrink-0 w-4">
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>
      </button>
      {open && (
        <div className="px-4 py-4 bg-muted border-t border-black">
          <p className="font-sans text-sm text-foreground leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
          <div className="flex gap-6 mt-4">
            <a
              href={`mailto:${inquiry.email}`}
              className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Reply by Email →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminInquiries() {
  usePageTitle('Admin · Inquiries')
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
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Casting</p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight-display uppercase text-foreground leading-none mb-12">
          Inquiries
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        {/* Filter by performer */}
        <div className="mb-6">
          <select
            value={performerFilter}
            onChange={(e) => setPerformerFilter(e.target.value)}
            className="bg-background border-b border-black text-foreground font-mono text-label-mono tracking-agency uppercase py-2 px-0 appearance-none focus:outline-none focus:border-foreground transition-colors min-w-48"
          >
            <option value="">All Performers</option>
            {allPerformers.map((p) => (
              <option key={p.id} value={p.id}>{p.displayName}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="border-t border-l border-black">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full border-b border-r border-black" />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <EmptyState
            title="No inquiries yet"
            description="Inquiries submitted through performer profiles will appear here"
          />
        ) : (
          <>
            {/* Header row */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-l border-b border-r border-black bg-muted">
              <p className="flex-1 font-mono text-label-mono tracking-agency uppercase text-muted-foreground">Sender</p>
              <p className="w-36 text-right font-mono text-label-mono tracking-agency uppercase text-muted-foreground shrink-0">Project</p>
              <p className="w-28 text-right font-mono text-label-mono tracking-agency uppercase text-muted-foreground shrink-0">Date</p>
              <div className="w-4 shrink-0" />
            </div>
            <div className="border-t border-l border-black">
              {inquiries.map((inq) => <InquiryRow key={inq.id} inquiry={inq} />)}
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
