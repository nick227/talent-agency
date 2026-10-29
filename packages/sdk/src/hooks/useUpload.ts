import { useMutation } from '@tanstack/react-query'
import { getBaseUrl } from '../client'

export interface UploadResult {
  url: string
  key: string
  mimeType: string
  size: number
}

// Uses fetch() with FormData directly — openapi-fetch does not support multipart.
export function useUpload() {
  return useMutation({
    mutationFn: async (file: File): Promise<{ data: UploadResult }> => {
      const baseUrl = getBaseUrl()
      const body = new FormData()
      body.append('file', file)

      const response = await fetch(`${baseUrl}/media/upload`, {
        method: 'POST',
        credentials: 'include',
        body,
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error((json as { error?: string }).error ?? `Upload failed (${response.status})`)
      }

      return json as { data: UploadResult }
    },
  })
}
