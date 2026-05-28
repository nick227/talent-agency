import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { MediaItem } from '@talent/sdk'

interface MediaGalleryProps {
  items: MediaItem[]
  className?: string
}

export function MediaGallery({ items, className }: MediaGalleryProps) {
  const [selected, setSelected] = useState(0)

  const photos = items.filter((i) => i.type === 'PHOTO')
  const videos = items.filter((i) => i.type === 'VIDEO')

  if (items.length === 0) return null

  const current = items[selected]

  return (
    <div className={cn('', className)}>
      {/* Main display */}
      <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: '16/10' }}>
        {current.type === 'VIDEO' ? (
          current.url.includes('youtube.com') || current.url.includes('youtu.be') ? (
            <iframe
              key={current.id}
              src={current.url}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
              title={current.caption ?? 'Video reel'}
            />
          ) : (
            <video
              key={current.id}
              src={current.url}
              controls
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <img
            key={current.id}
            src={current.url}
            alt={current.caption ?? ''}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          />
        )}

        {current.caption && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white/80 text-xs font-sans">{current.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setSelected(i)}
              className={cn(
                'relative shrink-0 overflow-hidden transition-opacity',
                'w-16 h-16 sm:w-20 sm:h-20',
                i === selected ? 'opacity-100 ring-1 ring-foreground' : 'opacity-40 hover:opacity-70',
              )}
            >
              {item.type === 'VIDEO' ? (
                <div className="h-full w-full bg-muted flex items-center justify-center">
                  <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              ) : (
                <img src={item.url} alt={item.caption ?? ''} className="h-full w-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
