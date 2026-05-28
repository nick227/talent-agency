import { useState } from 'react'
import { usePerformers } from '@talent/sdk'
import type { PerformerCategory } from '@talent/sdk'
import { PerformerCard, PerformerCardSkeleton } from '@/components/PerformerCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { StaggerList } from '@/components/animation/StaggerList'
import { FadeIn } from '@/components/animation/FadeIn'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageTransition } from '@/components/animation/PageTransition'

export function RosterPage() {
  const [category, setCategory] = useState<PerformerCategory | ''>('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const handleSearch = (val: string) => {
    setSearch(val)
    clearTimeout((window as any)._searchDebounce)
    ;(window as any)._searchDebounce = setTimeout(() => setDebouncedSearch(val), 350)
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePerformers({
    category: category || undefined,
    q: debouncedSearch || undefined,
    limit: 24,
  })

  const performers = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16">

        {/* Header */}
        <FadeIn>
          <div className="py-12 border-b border-black">
            <h1
              className="font-display font-bold uppercase tracking-tight-display text-foreground mb-8"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 48px)', lineHeight: 1.1 }}
            >
              The Roster
            </h1>

            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryFilter value={category} onChange={setCategory} />
              <div className="border-b border-black py-2">
                <input
                  type="text"
                  placeholder="Search by name…"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full sm:w-56 bg-transparent border-none p-0 font-sans text-body-md focus:outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="py-12">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
              {Array.from({ length: 12 }).map((_, i) => <PerformerCardSkeleton key={i} />)}
            </div>
          ) : performers.length === 0 ? (
            <EmptyState
              title="No performers found"
              description="Try adjusting your search or filter"
              action={
                category || debouncedSearch
                  ? {
                      label: 'Clear filters',
                      onClick: () => { setCategory(''); setSearch(''); setDebouncedSearch('') },
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
                {performers.map((p) => <PerformerCard key={p.id} performer={p} />)}
              </StaggerList>

              {hasNextPage && (
                <div className="flex justify-center mt-16">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="font-mono text-label-mono tracking-agency uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-colors disabled:opacity-40"
                  >
                    {isFetchingNextPage ? 'Loading…' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Count */}
        {!isLoading && performers.length > 0 && (
          <div className="border-t border-black py-6 mb-8">
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">
              {performers.length} artist{performers.length !== 1 ? 's' : ''} represented
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
