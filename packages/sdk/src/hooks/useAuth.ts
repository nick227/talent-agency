import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiClient, ApiError } from '../client'

function throwOnError(result: { data?: unknown; response: Response }) {
  if (!result.data) throw new ApiError(result.response.status, 'Request failed')
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const r = await getApiClient().GET('/auth/me')
      throwOnError(r as any)
      return r.data!
    },
    retry: false,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: { email: string; password: string }) => {
      const r = await getApiClient().POST('/auth/login', { body })
      if (!r.data) throw new ApiError(r.response.status, (r.error as any)?.error ?? 'Login failed')
      return r.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const r = await getApiClient().POST('/auth/logout')
      if (r.response.status >= 400) throw new ApiError(r.response.status, 'Logout failed')
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
