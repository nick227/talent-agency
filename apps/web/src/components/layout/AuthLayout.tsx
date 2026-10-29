import { Link } from 'react-router-dom'
import { FadeIn } from '@/components/animation/FadeIn'

interface StatItem {
  label: string
  value: string
}

interface AuthLayoutProps {
  /** What goes in the black left panel */
  headline: string
  subheadline: string
  description: string
  stats?: StatItem[]
  /** What goes in the white right panel */
  children: React.ReactNode
  /** Picsum seed for the background portrait */
  imageSeed?: string
}

export function AuthLayout({
  headline,
  subheadline,
  description,
  stats,
  children,
  imageSeed = 'margaux',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* ── Left panel — black ─────────────────────────────────────────── */}
      <div className="relative md:w-[45%] bg-black text-white flex flex-col justify-between p-8 md:p-16 min-h-[40vh] md:min-h-screen overflow-hidden">
        {/* Background portrait — faint */}
        <img
          src={`https://picsum.photos/seed/${imageSeed}/800/1000`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top opacity-20 grayscale select-none pointer-events-none"
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <Link
            to="/"
            className="font-mono text-label-mono tracking-agency text-white/60 hover:text-white transition-colors self-start"
          >
            TALENT / AGENCY
          </Link>

          {/* Main copy */}
          <div className="flex-1 flex flex-col justify-center py-12 md:py-0">
            <FadeIn>
              <p className="font-mono text-label-mono tracking-agency uppercase text-white/40 mb-4">
                {subheadline}
              </p>
              <h1
                className="font-display font-extrabold text-white leading-none tracking-tight-display mb-6"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 72px)' }}
              >
                {headline}
              </h1>
              <p className="font-sans text-body-lg text-white/60 max-w-sm leading-relaxed">
                {description}
              </p>
            </FadeIn>
          </div>

          {/* Stats strip */}
          {stats && stats.length > 0 && (
            <FadeIn delay={0.2}>
              <div className="grid grid-cols-3 border-t border-white/20 pt-6 gap-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-bold text-white text-2xl leading-none">{s.value}</p>
                    <p className="font-mono text-label-mono tracking-agency uppercase text-white/40 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      {/* ── Right panel — white ────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-background">
        <FadeIn delay={0.1} className="w-full max-w-md">
          {children}
        </FadeIn>
      </div>
    </div>
  )
}
