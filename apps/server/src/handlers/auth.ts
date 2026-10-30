import { AuthService } from '../services/AuthService'

const authService = new AuthService()

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 30 * 24 * 60 * 60,
}

export async function register(request: any, reply: any) {
  const { user, token } = await authService.register(request.body)
  reply.setCookie('token', token, COOKIE_OPTS)
  return reply.status(201).send({
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  })
}

export async function login(request: any, reply: any) {
  const { user, token } = await authService.login(request.body)
  reply.setCookie('token', token, COOKIE_OPTS)
  return reply.send({
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  })
}

export async function logout(request: any, reply: any) {
  const token = request.cookies?.token ?? request.headers.authorization?.replace('Bearer ', '')
  if (token) await authService.logout(token)
  reply.clearCookie('token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
  return reply.send({ data: null })
}

export async function getCurrentUser(request: any, reply: any) {
  const { user } = request
  return reply.send({
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  })
}
