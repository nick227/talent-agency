import { useEffect } from 'react'

const SITE_TITLE = 'TALENT / AGENCY'

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_TITLE}` : SITE_TITLE
  }, [title])
}
