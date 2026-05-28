import { useCallback, useEffect, useMemo, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { cn } from '@/lib/utils'
import { SlideButtonEl, type SlideShowProps, type SlideItem } from './slide-types'

function hasContent(item: SlideItem) {
  return !!(item.heading || item.body || item.buttons?.length || item.badge)
}

export function HeroSlider({ items, autoPlay, onSelect, className }: SlideShowProps) {
  const plugins = useMemo(
    () => (autoPlay ? [Autoplay({ delay: autoPlay, stopOnInteraction: true })] : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSlideChange = useCallback(() => {
    if (!emblaApi) return
    const idx = emblaApi.selectedScrollSnap()
    setSelectedIndex(idx)
    onSelect?.(items[idx], idx)
  }, [emblaApi, items, onSelect])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSlideChange)
    emblaApi.on('reInit', onSlideChange)
    return () => {
      emblaApi.off('select', onSlideChange)
      emblaApi.off('reInit', onSlideChange)
    }
  }, [emblaApi, onSlideChange])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev()
      if (e.key === 'ArrowRight') emblaApi?.scrollNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [emblaApi])

  return (
    <div
      className={cn('relative overflow-hidden bg-black', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured performers"
    >
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full touch-pan-y select-none">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="relative min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${items.length}`}
            >
              <img
                src={item.image}
                alt={item.imageAlt ?? item.heading ?? ''}
                className="absolute inset-0 h-full w-full object-cover"
                draggable={false}
              />
              {/* Dark vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

              {hasContent(item) && (
                <div className="absolute bottom-0 left-0 right-0 px-12 pb-16 md:px-20 md:pb-24 max-w-5xl">
                  {item.badge && (
                    <p className="mb-4 text-[10px] tracking-agency uppercase text-white/60">{item.badge}</p>
                  )}
                  {item.heading && (
                    <h2 className="font-display font-300 tracking-tight-display text-white text-5xl md:text-7xl lg:text-8xl leading-none">
                      {item.heading}
                    </h2>
                  )}
                  {item.body && (
                    <p className="mt-4 max-w-lg text-sm text-white/70 font-sans font-300 leading-relaxed">
                      {item.body}
                    </p>
                  )}
                  {item.buttons && item.buttons.length > 0 && (
                    <div className="mt-8 flex flex-wrap gap-4">
                      {item.buttons.map((btn, j) => <SlideButtonEl key={j} btn={btn} />)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-8 right-12 md:right-20 flex gap-2" role="tablist">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === selectedIndex}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                'h-px transition-all duration-500',
                i === selectedIndex ? 'w-8 bg-white' : 'w-4 bg-white/30 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
