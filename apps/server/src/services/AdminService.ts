import { db } from '@talent/db'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { encodeCursor, decodeCursor, normalizeLimit } from '../lib/pagination'
import type { PerformerCategory, MediaType } from '@prisma/client'

const profileSelect = {
  id: true,
  displayName: true,
  bio: true,
  headshotUrl: true,
  headshotKey: true,
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
    orderBy: [{ order: 'asc' as const }, { createdAt: 'asc' as const }],
  },
  _count: { select: { inquiries: true } },
}

export class AdminService {
  async listPerformers(opts: {
    q?: string
    category?: PerformerCategory
    cursor?: string
    limit?: number
  }) {
    const limit = normalizeLimit(opts.limit)
    const cursorData = decodeCursor(opts.cursor)

    const performers = await db.performerProfile.findMany({
      where: {
        deletedAt: null,
        ...(opts.category ? { category: opts.category } : {}),
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
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      select: profileSelect,
    })

    const hasMore = performers.length > limit
    const items = hasMore ? performers.slice(0, limit) : performers
    const last = items[items.length - 1]
    const nextCursor = hasMore && last
      ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id })
      : null

    return { data: items, meta: { hasMore, nextCursor } }
  }

  async getPerformer(performerId: string) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, deletedAt: null },
      select: profileSelect,
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }
    return performer
  }

  async createPerformer(data: {
    email: string
    password: string
    displayName: string
    bio?: string
    category: PerformerCategory
    location?: string
    age?: number
    height?: string
    weight?: string
    measurements?: string
    shoeSize?: string
    hairColor?: string
    eyeColor?: string
  }) {
    const hash = await bcrypt.hash(data.password, 12)
    const { email, password: _pw, ...profileData } = data

    const user = await db.user.create({
      data: {
        email,
        passwordHash: hash,
        role: 'PERFORMER',
        performerProfile: {
          create: profileData,
        },
      },
      include: {
        performerProfile: {
          include: {
            mediaItems: true,
            _count: { select: { inquiries: true } },
          },
        },
      },
    })

    return user.performerProfile!
  }

  async updatePerformer(performerId: string, data: {
    displayName?: string
    bio?: string
    headshotUrl?: string
    headshotKey?: string
    category?: PerformerCategory
    location?: string
    age?: number
    height?: string
    weight?: string
    measurements?: string
    shoeSize?: string
    hairColor?: string
    eyeColor?: string
    isPublished?: boolean
    isFeatured?: boolean
  }) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, deletedAt: null },
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }

    return db.performerProfile.update({
      where: { id: performerId },
      data,
      select: profileSelect,
    })
  }

  async deletePerformer(performerId: string) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, deletedAt: null },
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }

    await db.performerProfile.update({
      where: { id: performerId },
      data: { deletedAt: new Date() },
    })
  }

  async addMedia(performerId: string, data: {
    url: string
    key: string
    mimeType: string
    type: MediaType
    caption?: string
    order?: number
  }) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, deletedAt: null },
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }

    return db.mediaItem.create({
      data: {
        performerProfileId: performerId,
        ...data,
        order: data.order ?? 0,
      },
    })
  }

  async updateMedia(performerId: string, mediaId: string, data: {
    caption?: string
    order?: number
  }) {
    const item = await db.mediaItem.findFirst({
      where: { id: mediaId, performerProfileId: performerId },
    })
    if (!item) throw { statusCode: 404, message: 'Media item not found' }

    return db.mediaItem.update({ where: { id: mediaId }, data })
  }

  async deleteMedia(performerId: string, mediaId: string) {
    const item = await db.mediaItem.findFirst({
      where: { id: mediaId, performerProfileId: performerId },
    })
    if (!item) throw { statusCode: 404, message: 'Media item not found' }

    await db.mediaItem.delete({ where: { id: mediaId } })
  }
}
