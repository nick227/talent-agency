import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './generated/types'

type ClientConfig = {
  baseUrl: string
  getToken?: () => string | null
}

let _client: ReturnType<typeof createClient<paths>> | null = null
let _baseUrl = ''

export function createApiClient(config: ClientConfig) {
  _baseUrl = config.baseUrl.replace(/\/$/, '')

  const client = createClient<paths>({
    baseUrl: config.baseUrl,
    credentials: 'include',
  })

  if (config.getToken) {
    const authMiddleware: Middleware = {
      async onRequest(req) {
        const token = config.getToken!()
        if (token) req.headers.set('Authorization', 'Bearer ' + token)
        return req
      },
    }
    client.use(authMiddleware)
  }

  _client = client
  return client
}

export function getApiClient() {
  if (!_client) throw new Error('Call createApiClient() before using hooks.')
  return _client
}

export function getBaseUrl() {
  return _baseUrl || 'http://localhost:3001'
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function getErrorMessage(error: unknown, fallback = 'Failed'): string {
  if (typeof error === 'object' && error !== null && 'error' in error) {
    const maybeError = (error as { error?: unknown }).error
    if (typeof maybeError === 'string') return maybeError
  }
  return fallback
}
