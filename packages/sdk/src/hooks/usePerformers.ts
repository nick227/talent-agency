import { useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query'
import { getApiClient, ApiError } from '../client'
import type { PerformerCategory, SubmitInquiryInput } from '../types'

function err(r: { error: unknown; response: unknown }) {
  return new ApiError((r.response as Response).status, (r.error as any)?.error ?? 'Failed')
}

export function usePerformers(params?: {
  q?: string
  category?: PerformerCategory
  location?: string
  limit?: number
}) {
  return useInfiniteQuery({
    queryKey: ['performers', params],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const r = await getApiClient().GET('/performers', {
        params: { query: { ...params, cursor: pageParam } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
  })
}

export function usePerformer(performerId: string) {
  return useQuery({
    queryKey: ['performer', performerId],
    queryFn: async () => {
      const r = await getApiClient().GET('/performers/{performerId}', {
        params: { path: { performerId } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    enabled: !!performerId,
  })
}

export function useMyPerformerProfile() {
  return useQuery({
    queryKey: ['performer-me'],
    queryFn: async () => {
      const r = await getApiClient().GET('/performers/me')
      if (r.error) throw err(r)
      return r.data!
    },
    retry: false,
  })
}

export function useSubmitInquiry(performerId: string) {
  return useMutation({
    mutationFn: async (body: SubmitInquiryInput) => {
      const r = await getApiClient().POST(
        '/performers/{performerId}/inquiries',
        { params: { path: { performerId } }, body },
      )
      if (r.error) throw err(r)
      return r.data!
    },
  })
}
