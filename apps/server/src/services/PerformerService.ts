import { db } from '@talent/db'
import { encodeCursor, decodeCursor, normalizeLimit } from '../lib/pagination'
import type { PerformerCategory } from '@prisma/client'

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-{2,}/g, '-').slice(0, 80)
}

const profileSelect = {
  id: true,
  displayName: true,
  slug: true,
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
    where: {},
    orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }],
  },
  _count: { select: { inquiries: true } },
}

const summarySel = {
  id: true,
  displayName: true,
  slug: true,
  bio: true,
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
        ...(opts.q ? { displayName: { contains: opts.q } } : {}),
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

  // Accepts cuid or slug
  async getById(performerId: string) {
    const performer = await db.performerProfile.findFirst({
      where: {
        OR: [{ id: performerId }, { slug: performerId }],
        isPublished: true,
        deletedAt: null,
      },
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

  async updateMyProfile(userId: string, data: {
    displayName?: string
    slug?: string
    bio?: string
    category?: PerformerCategory
    location?: string
    age?: number
    height?: string
    weight?: string
    measurements?: string
    shoeSize?: string
    hairColor?: string
    eyeColor?: string
    headshotUrl?: string
    headshotKey?: string
  }) {
    const profile = await db.performerProfile.findFirst({ where: { userId } })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    // Validate slug uniqueness
    if (data.slug) {
      const candidate = slugify(data.slug)
      const conflict = await db.performerProfile.findFirst({
        where: { slug: candidate, id: { not: profile.id } },
      })
      if (conflict) throw { statusCode: 409, message: 'That portfolio URL is already taken' }
      data.slug = candidate
    }

    const updated = await db.performerProfile.update({
      where: { id: profile.id },
      data: { ...data },
      select: profileSelect,
    })
    return updated
  }

  async addMedia(userId: string, data: {
    url: string
    key: string
    mimeType: string
    type: string
    caption?: string
    order?: number
  }) {
    const profile = await db.performerProfile.findFirst({ where: { userId } })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    const maxOrder = await db.mediaItem.aggregate({
      where: { performerProfileId: profile.id },
      _max: { order: true },
    })
    const nextOrder = data.order ?? ((maxOrder._max.order ?? -1) + 1)

    return db.mediaItem.create({
      data: {
        performerProfileId: profile.id,
        url: data.url,
        key: data.key,
        mimeType: data.mimeType,
        type: data.type as any,
        caption: data.caption ?? null,
        order: nextOrder,
      },
    })
  }

  async reorderMedia(userId: string, items: { id: string; order: number }[]) {
    const profile = await db.performerProfile.findFirst({ where: { userId } })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    await db.$transaction(
      items.map(({ id, order }) =>
        db.mediaItem.updateMany({
          where: { id, performerProfileId: profile.id },
          data: { order },
        }),
      ),
    )
    return { ok: true }
  }

  async deleteMedia(userId: string, mediaId: string) {
    const profile = await db.performerProfile.findFirst({ where: { userId } })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    const item = await db.mediaItem.findFirst({
      where: { id: mediaId, performerProfileId: profile.id },
    })
    if (!item) throw { statusCode: 404, message: 'Media item not found' }

    await db.mediaItem.delete({ where: { id: mediaId } })
    return { ok: true }
  }

  async updateMedia(userId: string, mediaId: string, data: { caption?: string; order?: number }) {
    const profile = await db.performerProfile.findFirst({ where: { userId } })
    if (!profile) throw { statusCode: 404, message: 'Profile not found' }

    const item = await db.mediaItem.findFirst({
      where: { id: mediaId, performerProfileId: profile.id },
    })
    if (!item) throw { statusCode: 404, message: 'Media item not found' }

    return db.mediaItem.update({ where: { id: mediaId }, data })
  }
}
