import { db } from '@talent/db'
import { encodeCursor, decodeCursor, normalizeLimit } from '../lib/pagination'
import type { PerformerCategory } from '@prisma/client'

const profileSelect = {
  id: true,
  displayName: true,
  bio: true,
  headshotUrl: true,
  category: true,
  location: true,
  age: true,
  height: true,
  weight: true,
  measurements: true,
  shoeSize: true,
  hairColor: true,
  eyeColor: true,
  isPublished: true,
  isFeatured: true,
  createdAt: true,
  mediaItems: {
    where: { },
    orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }],
  },
  _count: { select: { inquiries: true } },
}

const summarySel = {
  id: true,
  displayName: true,
  headshotUrl: true,
  category: true,
  location: true,
  isPublished: true,
  isFeatured: true,
  createdAt: true,
}

export class PerformerService {
  async list(opts: {
    q?: string
    category?: PerformerCategory
    location?: string
    cursor?: string
    limit?: number
  }) {
    const limit = normalizeLimit(opts.limit)
    const cursorData = decodeCursor(opts.cursor)

    const performers = await db.performerProfile.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
        ...(opts.category ? { category: opts.category } : {}),
        ...(opts.location ? { location: { contains: opts.location } } : {}),
        ...(opts.q
          ? { displayName: { contains: opts.q } }
          : {}),
        ...(cursorData
          ? {
              OR: [
                { createdAt: { lt: new Date(cursorData.createdAt) } },
                { createdAt: new Date(cursorData.createdAt), id: { lt: cursorData.id } },
              ],
            }
          : {}),
      },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      select: summarySel,
    })

    const hasMore = performers.length > limit
    const items = hasMore ? performers.slice(0, limit) : performers
    const last = items[items.length - 1]
    const nextCursor = hasMore && last
      ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id })
      : null

    return { data: items, meta: { hasMore, nextCursor } }
  }

  async getById(performerId: string) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, isPublished: true, deletedAt: null },
      select: profileSelect,
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }
    return performer
  }

  async getByUserId(userId: string) {
    const performer = await db.performerProfile.findFirst({
      where: { userId, deletedAt: null },
      select: profileSelect,
    })
    if (!performer) throw { statusCode: 404, message: 'Performer profile not found' }
    return performer
  }
}
