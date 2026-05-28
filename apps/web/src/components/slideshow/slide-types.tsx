import { cn } from '@/lib/utils'

export type SlideButton = {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  href?: string
  onClick?: () => void
}

export type SlideItem = {
  id: string
  image: string
  imageAlt?: string
  badge?: string
  heading?: string
  body?: string
  buttons?: SlideButton[]
}

export type SlideShowProps = {
  items: SlideItem[]
  mode?: 'hero' | 'gallery'
  autoPlay?: number
  onSelect?: (item: SlideItem, index: number) => void
  className?: string
}

export function SlideButtonEl({ btn }: { btn: SlideButton }) {
  const base =
    'inline-flex items-center justify-center px-6 py-3 text-xs font-sans font-400 tracking-agency uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
  const variants: Record<NonNullable<SlideButton['variant']>, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/85',
    secondary: 'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
    ghost: 'text-white underline-offset-4 hover:underline tracking-normal normal-case',
  }
  const cls = cn(base, variants[btn.variant ?? 'primary'])

  if (btn.href) return <a href={btn.href} className={cls}>{btn.label}</a>
  return <button type="button" onClick={btn.onClick} className={cls}>{btn.label}</button>
}
