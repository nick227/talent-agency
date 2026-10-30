import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiClient, ApiError, getErrorMessage } from '../client'
import type { PerformerCategory, SubmitInquiryInput, RegisterInput, UpdateMyProfileInput, AddMediaInput, ReorderMediaInput, UpdateMediaInput } from '../types'

function err(r: { error: unknown; response: Response }) {
  return new ApiError(r.response.status, getErrorMessage(r.error, 'Failed'))
}

export function useRegister() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: RegisterInput) => {
      const r = await getApiClient().POST('/auth/register', { body })
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Registration failed'))
      return r.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useUpdateMyProfile() {
  return useMutation({
    mutationFn: async (body: UpdateMyProfileInput) => {
      const r = await getApiClient().PATCH('/performers/me', { body })
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Update failed'))
      return r.data
    },
  })
}

export function useAddMyMedia() {
  return useMutation({
    mutationFn: async (body: AddMediaInput) => {
      const r = await getApiClient().POST('/performers/me/media', { body })
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Add media failed'))
      return r.data
    },
  })
}

export function useReorderMyMedia() {
  return useMutation({
    mutationFn: async (body: ReorderMediaInput) => {
      const r = await getApiClient().PATCH('/performers/me/media/reorder', { body })
      if (r.error) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Reorder failed'))
      return r.data
    },
  })
}

export function useDeleteMyMedia() {
  return useMutation({
    mutationFn: async (mediaId: string) => {
      const r = await getApiClient().DELETE('/performers/me/media/{mediaId}', {
        params: { path: { mediaId } },
      })
      if (r.error) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Delete failed'))
      return r.data
    },
  })
}

export function useUpdateMyMedia() {
  return useMutation({
    mutationFn: async ({ mediaId, body }: { mediaId: string; body: UpdateMediaInput }) => {
      const r = await getApiClient().PATCH('/performers/me/media/{mediaId}', {
        params: { path: { mediaId } },
        body,
      })
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Update failed'))
      return r.data
    },
  })
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
