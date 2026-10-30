import { Link } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { FadeIn } from '@/components/animation/FadeIn'
import { PageTransition } from '@/components/animation/PageTransition'

export function AboutPage() {
  usePageTitle('About')

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-16">

        {/* Label */}
        <FadeIn>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-12">About</p>
        </FadeIn>

        {/* Headline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-b border-black pb-16 mb-16">
          <FadeIn delay={0.1}>
            <h1
              className="font-display font-bold uppercase tracking-tight-display text-foreground"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 64px)', lineHeight: 1.05 }}
            >
              We're an independent talent and production company based in Austin, Texas.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} className="flex flex-col justify-center">
            <div className="space-y-5 font-sans text-body-lg text-muted-foreground leading-relaxed">


              <p>
                Talent / Agency is a new and small botique talent and production company, providing representation, management, and production services for our clients. 
              </p>
              <p>                
                We create relationships with venues, brands, and production companies to bring the best talent to the stage and screen. 
              </p>
              <p>We are content creators at heart and love collaborating on unique and creative projects.
              </p>
              <p>
                Founded by creatives for creatives.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Stats */}
        <FadeIn delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-black mb-16">
            <div className="p-6 border-r border-black">
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">Founded</p>
              <p className="font-display text-headline-md font-semibold">2018</p>
            </div>
            <div className="p-6 border-r border-black">
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">Artists</p>
              <p className="font-display text-headline-md font-semibold">16+</p>
            </div>
            <div className="p-6 border-r border-black">
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">Markets</p>
              <p className="font-display text-headline-md font-semibold">Global</p>
            </div>
            <div className="p-6">
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">Response</p>
              <p className="font-display text-headline-md font-semibold">&lt;4h</p>
            </div>
          </div>
        </FadeIn>

        {/* CTAs */}
        <FadeIn delay={0.4}>
          <div className="flex gap-4">
            <Link
              to="/talent"
              className="bg-black text-white px-8 py-3 font-mono text-label-mono tracking-agency uppercase hover:bg-black/85 transition-colors"
            >
              View Talent
            </Link>
            <Link
              to="/contact"
              className="border border-black text-foreground px-8 py-3 font-mono text-label-mono tracking-agency uppercase hover:bg-black hover:text-white transition-colors duration-100"
            >
              Contact
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  )
}
