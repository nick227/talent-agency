import { HeroSlider } from './HeroSlider'
import { GalleryBrowser } from './GalleryBrowser'
import type { SlideShowProps } from './slide-types'

export type { SlideButton, SlideItem, SlideShowProps } from './slide-types'
export { SlideButtonEl } from './slide-types'

export function SlideShow({ mode = 'hero', ...props }: SlideShowProps) {
  if (mode === 'gallery') return <GalleryBrowser {...props} />
  return <HeroSlider {...props} />
}
