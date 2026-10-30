import { useParams, Link } from 'react-router-dom'
import { usePerformer } from '@talent/sdk'
import { usePageTitle } from '@/hooks/usePageTitle'
import { InquiryForm } from '@/components/InquiryForm'
import { MediaGallery } from '@/components/MediaGallery'
import { FadeIn } from '@/components/animation/FadeIn'
import { PageTransition } from '@/components/animation/PageTransition'
import { Skeleton } from '@/components/ui/Skeleton'

const CATEGORY_LABELS: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

const STAT_ROWS = [
  { key: 'age', label: 'Age' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'measurements', label: 'Measurements' },
  { key: 'shoeSize', label: 'Shoe Size' },
  { key: 'hairColor', label: 'Hair' },
  { key: 'eyeColor', label: 'Eyes' },
] as const

export function PerformerPage() {
  const { performerId } = useParams<{ performerId: string }>()
  const { data, isLoading, error } = usePerformer(performerId!)
  const performer = data?.data

  usePageTitle(
    error
      ? 'Performer Not Found'
      : performer
        ? `${performer.displayName} · ${CATEGORY_LABELS[performer.category] ?? performer.category}`
        : 'Portfolio',
  )

  if (error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-32 text-center">
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-6">
          Performer not found
        </p>
        <Link
          to="/talent"
          className="font-mono text-label-mono tracking-agency uppercase border-b border-black pb-0.5 hover:text-muted-foreground transition-colors"
        >
          ← Back to Talent
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16">

                <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mt-6">
                  Portfolio
                </p>

        {/* Performer header */}
        <FadeIn>
          <div className="py-12 border-b border-black">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-1/2" />
              </div>
            ) : performer ? (
              <>
                <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">
                  <Link to={`/talent?category=${performer.category}`} className="underline">
                    {CATEGORY_LABELS[performer.category] ?? performer.category}
                  </Link>
                  {performer.location && (
                    <> / <Link to={`/${performer.location.split(',')[0].trim()}`} className="underline">{performer.location.split(',')[0].trim()}</Link></>
                  )}
                </p>
                <h1
                  className="font-display font-bold uppercase tracking-tight-display text-foreground"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 64px)', lineHeight: 1.05 }}
                >
                  {performer.displayName}
                </h1>
              </>
            ) : null}
          </div>
        </FadeIn>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-b border-black">

          {/* Left: headshot + stats */}
          <div className="lg:col-span-1 border-r border-black py-12 pr-8">
            <FadeIn>
              {/* Headshot */}
              <div className="border border-black overflow-hidden mb-8" style={{ aspectRatio: '4/5' }}>
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : performer?.headshotUrl ? (
                  <img
                    src={performer.headshotUrl}
                    alt={performer.displayName}
                    className="w-full h-full object-cover object-top grayscale"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              {/* Bio */}
              {performer?.bio && (
                <div className="mb-8">
                  <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Bio</p>
                  <p className="font-sans text-body-md text-foreground leading-relaxed">
                    {performer.bio}
                  </p>
                </div>
              )}

              {/* Stats */}
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : performer ? (
                <div className="border-t border-black">
                  {STAT_ROWS.map(({ key, label }) => {
                    const val = performer[key as keyof typeof performer]
                    if (!val) return null
                    return (
                      <div key={key} className="flex justify-between items-baseline border-b border-black py-3">
                        <span className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">
                          {label}
                        </span>
                        <span className="font-sans text-body-md text-foreground">
                          {String(val)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </FadeIn>
          </div>

          {/* Right: media + inquiry */}
          <div className="lg:col-span-2 py-12 pl-0 lg:pl-8 space-y-16">

            {/* Portfolio */}
            {(isLoading || (performer?.mediaItems && performer.mediaItems.length > 0)) && (
              <FadeIn delay={0.1}>
                {isLoading ? (
                  <Skeleton className="w-full" style={{ aspectRatio: '16/10' } as React.CSSProperties} />
                ) : (
                  <MediaGallery items={performer!.mediaItems} />
                )}
              </FadeIn>
            )}

            {/* Inquiry form */}
            <FadeIn delay={0.2}>
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Inquire</p>
              <h2
                className="font-display font-bold uppercase tracking-tight-display text-foreground mb-8"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 32px)', lineHeight: 1.1 }}
              >
                Work with {performer?.displayName ?? '…'}
              </h2>
              {performer && (
                <InquiryForm performerId={performer.id} performerName={performer.displayName} />
              )}
              {isLoading && (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              )}
            </FadeIn>
          </div>
        </div>

        {/* Back link */}
        <div className="py-8">
          <Link
            to="/talent"
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Talent
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
