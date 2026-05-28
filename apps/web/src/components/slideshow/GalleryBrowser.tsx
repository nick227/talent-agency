import { useState } from 'react'
import { cn } from '@/lib/utils'
import { type SlideShowProps, type SlideItem } from './slide-types'

function hasContent(item: SlideItem) {
  return !!(item.heading || item.body)
}

export function GalleryBrowser({ items, onSelect, className }: SlideShowProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selected = items[selectedIndex]

  const handleSelect = (i: number) => {
    setSelectedIndex(i)
    onSelect?.(items[i], i)
  }

  if (items.length === 0) return null

  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:gap-4', className)} role="region" aria-label="Media gallery">
      {/* Main view */}
      <div className="relative flex-1 overflow-hidden bg-muted" style={{ aspectRatio: '4/3' }}>
        <img
          key={selected.id}
          src={selected.image}
          alt={selected.imageAlt ?? selected.heading ?? ''}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
        />
        {hasContent(selected) && (
          <>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              {selected.heading && (
                <p className="text-white font-sans text-sm">{selected.heading}</p>
              )}
              {selected.body && (
                <p className="mt-1 text-white/70 text-xs">{selected.body}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div
        className="grid grid-cols-5 gap-1 md:w-40 md:grid-cols-2 md:content-start lg:w-48"
        role="tablist"
      >
        {items.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === selectedIndex}
            aria-label={item.heading ?? item.imageAlt ?? `View item ${i + 1}`}
            onClick={() => handleSelect(i)}
            className={cn(
              'relative aspect-square overflow-hidden transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              i === selectedIndex ? 'opacity-100 ring-1 ring-foreground' : 'opacity-40 hover:opacity-70',
            )}
          >
            <img
              src={item.image}
              alt={item.imageAlt ?? item.heading ?? ''}
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
