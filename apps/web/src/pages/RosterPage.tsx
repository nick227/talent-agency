// RosterPage – UI component for browsing performers
import { useLocation } from 'react-router-dom';
import { useRosterData } from '@/hooks/useRosterData';
import { usePageTitle } from '@/hooks/usePageTitle';
import { CATEGORY_OPTIONS, CATEGORY_LABEL } from '@/constants/categories';
import { PerformerCard, PerformerCardSkeleton } from '@/components/PerformerCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { StaggerList } from '@/components/animation/StaggerList';
import { FadeIn } from '@/components/animation/FadeIn';
import { EmptyState } from '@/components/ui/EmptyState';
import { HorizontalScroll } from '@/components/ui/HorizontalScroll';
import { PageTransition } from '@/components/animation/PageTransition';
import { cn } from '@/lib/utils';

export function RosterPage() {
  const location = useLocation();
  const {
    category,
    setCategory,
    search,
    handleSearch,
    performers,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    cities,
    citiesLoading,
    handleCityChange,
    effectiveLocation,
    clearFilters,
    debouncedSearch,
  } = useRosterData();

  const categoryTitle = category
    ? CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? CATEGORY_LABEL[category] ?? category
    : '';
  const pageTitle =
    categoryTitle && effectiveLocation
      ? `${categoryTitle} · ${effectiveLocation}`
      : categoryTitle
        ? categoryTitle
        : effectiveLocation
          ? `${effectiveLocation} Talent`
          : location.pathname === '/talent'
            ? 'Talent'
            : null;
  usePageTitle(pageTitle);

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16">
        {/* Header */}
        <FadeIn>
          <div className="py-2">
            {/* City selector */}
            <HorizontalScroll className="mb-4">
              {citiesLoading ? (
                <span className="shrink-0 whitespace-nowrap font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border border-black opacity-50">
                  Loading cities…
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleCityChange('')}
                    className={cn(
                      'shrink-0 whitespace-nowrap font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border border-black transition-colors duration-100',
                      effectiveLocation === ''
                        ? 'bg-black text-white'
                        : 'bg-transparent text-foreground hover:bg-black hover:text-white'
                    )}
                  >
                    All Cities
                  </button>
                  {cities.map((c) => {
                    const isSelected = effectiveLocation.toLowerCase() === c.toLowerCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => handleCityChange(isSelected ? '' : c)}
                        className={cn(
                          'shrink-0 whitespace-nowrap font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border border-black transition-colors duration-100',
                          isSelected
                            ? 'bg-black text-white'
                            : 'bg-transparent text-foreground hover:bg-black hover:text-white'
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </>
              )}
            </HorizontalScroll>

            {/* Filters */}
            <div className="flex flex-col gap-4">
              <CategoryFilter value={category} onChange={setCategory} />
              <div className="py-2">
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
        <div className="pb-12">
          {isLoading ? (
            <div className="grid grid-cols-1 border-t border-l border-black">
              {Array.from({ length: 12 }).map((_, i) => (
                <PerformerCardSkeleton key={i} />
              ))}
            </div>
          ) : performers.length === 0 ? (
            <EmptyState
              title="No performers found"
              description="Try adjusting your search or filter"
              action={
                category || debouncedSearch || effectiveLocation
                  ? { label: 'Clear filters', onClick: clearFilters }
                  : undefined
              }
            />
          ) : (
            <>
              <StaggerList className="grid grid-cols-1 border-t border-l border-black">
                {performers.map((p) => (
                  <PerformerCard key={p.id} performer={p} />
                ))}
              </StaggerList>

              {hasNextPage && (
                <div className="flex justify-center mt-16">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="font-mono text-label-mono tracking-agency uppercase border border-black px-8 py-3 transition-colors disabled:opacity-40"
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
  );
}
