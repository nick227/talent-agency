import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiClient, ApiError, getErrorMessage } from '../client'
import type { PerformerCategory, CreatePerformerInput, UpdatePerformerInput, AddMediaInput, UpdateMediaInput } from '../types'

function err(r: { error: unknown; response: Response }) {
  return new ApiError(
    r.response.status,
    getErrorMessage(r.error, 'Failed'),
  )
}

export function useAdminPerformers(params?: {
  q?: string
  category?: PerformerCategory
  limit?: number
}) {
  return useInfiniteQuery({
    queryKey: ['admin', 'performers', params],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const r = await getApiClient().GET('/admin/performers', {
        params: { query: { ...params, cursor: pageParam } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
  })
}

export function useAdminPerformer(performerId: string) {
  return useQuery({
    queryKey: ['admin', 'performer', performerId],
    queryFn: async () => {
      const r = await getApiClient().GET('/admin/performers/{performerId}', {
        params: { path: { performerId } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    enabled: !!performerId,
  })
}

export function useAdminCreatePerformer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreatePerformerInput) => {
      const r = await getApiClient().POST('/admin/performers', { body })
      if (r.error) throw err(r)
      return r.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performers'] })
    },
  })
}

export function useAdminUpdatePerformer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ performerId, body }: { performerId: string; body: UpdatePerformerInput }) => {
      const r = await getApiClient().PATCH('/admin/performers/{performerId}', {
        params: { path: { performerId } },
        body,
      })
      if (r.error) throw err(r)
      return r.data!
    },
    onSuccess: (_data, { performerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performer', performerId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'performers'] })
      queryClient.invalidateQueries({ queryKey: ['performer', performerId] })
    },
  })
}

export function useAdminDeletePerformer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (performerId: string) => {
      const r = await getApiClient().DELETE('/admin/performers/{performerId}', {
        params: { path: { performerId } },
      })
      if (r.error) throw err(r)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performers'] })
    },
  })
}

export function useAdminAddMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ performerId, body }: { performerId: string; body: AddMediaInput }) => {
      const r = await getApiClient().POST('/admin/performers/{performerId}/media', {
        params: { path: { performerId } },
        body,
      })
      if (r.error) throw err(r)
      return r.data!
    },
    onSuccess: (_data, { performerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performer', performerId] })
    },
  })
}

export function useAdminUpdateMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ performerId, mediaId, body }: { performerId: string; mediaId: string; body: UpdateMediaInput }) => {
      const r = await getApiClient().PATCH('/admin/performers/{performerId}/media/{mediaId}', {
        params: { path: { performerId, mediaId } },
        body,
      })
      if (r.error) throw err(r)
      return r.data!
    },
    onSuccess: (_data, { performerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performer', performerId] })
    },
  })
}

export function useAdminReorderMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ performerId, items }: { performerId: string; items: { id: string; order: number }[] }) => {
      const r = await getApiClient().PATCH('/admin/performers/{performerId}/media/reorder', {
        params: { path: { performerId } },
        body: { items },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    onSuccess: (_data, { performerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performer', performerId] })
    },
  })
}

export function useAdminDeleteMedia() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ performerId, mediaId }: { performerId: string; mediaId: string }) => {
      const r = await getApiClient().DELETE('/admin/performers/{performerId}/media/{mediaId}', {
        params: { path: { performerId, mediaId } },
      })
      if (r.error) throw err(r)
    },
    onSuccess: (_data, { performerId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'performer', performerId] })
    },
  })
}

export function useAdminInquiries(params?: { performerId?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: ['admin', 'inquiries', params],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const r = await getApiClient().GET('/admin/inquiries', {
        params: { query: { ...params, cursor: pageParam } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
  })
}

export function useAdminPerformerInquiries(performerId: string) {
  return useInfiniteQuery({
    queryKey: ['admin', 'performer-inquiries', performerId],
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const r = await getApiClient().GET('/admin/performers/{performerId}/inquiries', {
        params: { path: { performerId }, query: { cursor: pageParam } },
      })
      if (r.error) throw err(r)
      return r.data!
    },
    getNextPageParam: (lastPage) => lastPage.meta.nextCursor ?? undefined,
    enabled: !!performerId,
  })
}
