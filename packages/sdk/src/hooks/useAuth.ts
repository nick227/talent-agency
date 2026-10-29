import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiClient, ApiError, getErrorMessage } from '../client'

function throwOnError(result: { data?: unknown; error?: unknown; response: Response }) {
  if (!result.data) throw new ApiError(result.response.status, getErrorMessage(result.error, 'Request failed'))
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const r = await getApiClient().GET('/auth/me') as { data?: unknown; error?: unknown; response: Response }
      throwOnError(r)
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
      if (!r.data) throw new ApiError(r.response.status, getErrorMessage(r.error, 'Login failed'))
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
