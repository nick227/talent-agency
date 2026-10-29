import { db } from '@talent/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-{2,}/g, '-').slice(0, 60)
}

async function uniqueSlug(base: string): Promise<string> {
  let candidate = slugify(base) || 'artist'
  let existing = await db.performerProfile.findUnique({ where: { slug: candidate } })
  if (!existing) return candidate
  const suffix = randomUUID().slice(0, 6)
  return `${candidate}-${suffix}`
}

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000

export class AuthService {
  async login(data: { email: string; password: string }) {
    const user = await db.user.findUnique({ where: { email: data.email } })
    if (!user || user.deletedAt) throw { statusCode: 401, message: 'Invalid credentials' }

    const valid = await bcrypt.compare(data.password, user.passwordHash)
    if (!valid) throw { statusCode: 401, message: 'Invalid credentials' }

    if (user.suspendedAt) throw { statusCode: 403, message: 'Account suspended' }

    const session = await this._createSession(user.id)
    return { user, token: session.token }
  }

  async register(data: {
    email: string
    password: string
    displayName: string
    category: string
    location?: string
  }) {
    const existing = await db.user.findUnique({ where: { email: data.email } })
    if (existing) throw { statusCode: 409, message: 'Email already registered' }

    const hash = await bcrypt.hash(data.password, 10)

    const slug = await uniqueSlug(data.displayName)
    const user = await db.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: { email: data.email, passwordHash: hash, role: 'PERFORMER' },
      })
      await tx.performerProfile.create({
        data: {
          userId: u.id,
          displayName: data.displayName,
          slug,
          category: data.category as any,
          location: data.location ?? null,
          isPublished: false,
          isFeatured: false,
        },
      })
      return u
    })

    const session = await this._createSession(user.id)
    return { user, token: session.token }
  }

  async logout(token: string) {
    await db.session.deleteMany({ where: { token } })
  }

  private async _createSession(userId: string) {
    return db.session.create({
      data: {
        userId,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + SESSION_TTL_MS),
      },
    })
  }
}
