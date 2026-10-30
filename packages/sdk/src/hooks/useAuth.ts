import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiClient, ApiError, getErrorMessage } from '../client'
import type { AuthUser } from '../types'

function throwOnError(result: { data?: unknown; error?: unknown; response: Response }) {
  if (!result.data) throw new ApiError(result.response.status, getErrorMessage(result.error, 'Request failed'))
}

export function useCurrentUser() {
  return useQuery<{ data: AuthUser } | null>({
    queryKey: ['me'],
    queryFn: async () => {
      const r = await getApiClient().GET('/auth/me')
      if (r.response.status === 401) return null
      throwOnError(r)
      return r.data as { data: AuthUser }
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const r = await getApiClient().POST('/auth/login', { body })
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Login failed'))
      return r.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['me'], data)
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const r = await getApiClient().POST('/auth/logout', {
        headers: { 'Content-Type': null as unknown as string },
      })
      if (r.response.status >= 400) throw new ApiError(r.response.status, 'Logout failed')
    },
    onSuccess: () => {
      queryClient.setQueryData(['me'], null)
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'me' })
    },
  })
}
