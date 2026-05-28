import { Link } from 'react-router-dom'
import { usePerformers } from '@talent/sdk'
import { PerformerCard, PerformerCardSkeleton } from '@/components/PerformerCard'
import { FadeIn } from '@/components/animation/FadeIn'
import { StaggerList } from '@/components/animation/StaggerList'
import { PageTransition } from '@/components/animation/PageTransition'

export function HomePage() {
  const { data, isLoading } = usePerformers({ limit: 6 })
  const performers = data?.pages.flatMap((p) => p.data) ?? []
  const featured = performers.find((p) => p.isFeatured)

  const heroImage = featured?.headshotUrl ?? 'https://picsum.photos/seed/margaux/800/1000'

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16">

        {/* Hero — split layout */}
        <section className="flex flex-col md:flex-row min-h-[80vh] items-center gap-12 py-12">
          {/* Left: text */}
          <FadeIn className="w-full md:w-1/2 flex flex-col justify-center order-2 md:order-1">
            <h1 className="font-display font-extrabold leading-none tracking-tight-display text-foreground mb-6"
              style={{ fontSize: 'clamp(3.5rem, 8vw, 80px)' }}>
              TALENT<br />/ AGENCY
            </h1>
            <p className="font-sans text-body-lg text-muted-foreground max-w-md mb-12">
              A global standard for elite representation. Precision-curated roster of performers, creators,
              and public personalities for the modern era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/roster"
                className="bg-black text-white px-12 py-4 font-mono text-label-mono tracking-wider uppercase text-center hover:bg-black/85 transition-colors"
              >
                View Roster
              </Link>
              <Link
                to="/contact"
                className="border border-black text-foreground px-12 py-4 font-mono text-label-mono tracking-wider uppercase text-center hover:bg-black hover:text-white transition-colors duration-100"
              >
                Get in Touch
              </Link>
            </div>
          </FadeIn>

          {/* Right: featured portrait */}
          <FadeIn delay={0.15} className="w-full md:w-1/2 h-[400px] md:h-[700px] border border-black overflow-hidden order-1 md:order-2">
            <img
              src={heroImage}
              alt="Featured performer"
              className="w-full h-full object-cover object-top"
            />
          </FadeIn>
        </section>

        {/* Stats block */}
        <section className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-black mb-16">
          <div className="p-6 border-r border-black">
            <p className="font-mono text-label-mono tracking-agency uppercase mb-2 text-muted-foreground">Artists</p>
            <p className="font-display text-headline-md font-semibold">16+</p>
          </div>
          <div className="p-6 border-r border-black">
            <p className="font-mono text-label-mono tracking-agency uppercase mb-2 text-muted-foreground">Categories</p>
            <p className="font-display text-headline-md font-semibold">8</p>
          </div>
          <div className="p-6 border-r border-black">
            <p className="font-mono text-label-mono tracking-agency uppercase mb-2 text-muted-foreground">Markets</p>
            <p className="font-display text-headline-md font-semibold">Global</p>
          </div>
          <div className="p-6">
            <p className="font-mono text-label-mono tracking-agency uppercase mb-2 text-muted-foreground">Response</p>
            <p className="font-display text-headline-md font-semibold">&lt;4h</p>
          </div>
        </section>

        {/* Roster preview */}
        <section className="pb-24">
          <FadeIn>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-display font-bold uppercase tracking-tight-display"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 48px)', lineHeight: 1.1 }}>
                Current Roster
              </h2>
              <Link
                to="/roster"
                className="font-mono text-label-mono tracking-agency underline decoration-1 underline-offset-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                See Full List
              </Link>
            </div>
          </FadeIn>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
              {Array.from({ length: 6 }).map((_, i) => <PerformerCardSkeleton key={i} />)}
            </div>
          ) : performers.length === 0 ? (
            <div className="py-24 border-t border-black text-center">
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">Roster coming soon</p>
            </div>
          ) : (
            <StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-black">
              {performers.slice(0, 6).map((p) => (
                <PerformerCard key={p.id} performer={p} />
              ))}
            </StaggerList>
          )}
        </section>
      </div>
    </PageTransition>
  )
}
