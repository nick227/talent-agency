import { db } from '@talent/db'
import { encodeCursor, decodeCursor, normalizeLimit } from '../lib/pagination'

export class InquiryService {
  async submit(performerId: string, data: {
    name: string
    email: string
    projectType: string
    message: string
  }) {
    const performer = await db.performerProfile.findFirst({
      where: { id: performerId, isPublished: true, deletedAt: null },
    })
    if (!performer) throw { statusCode: 404, message: 'Performer not found' }

    const inquiry = await db.castingInquiry.create({
      data: { performerProfileId: performerId, ...data },
      include: { performerProfile: { select: { displayName: true } } },
    })

    return {
      ...inquiry,
      performerDisplayName: inquiry.performerProfile.displayName,
    }
  }

  async listAll(opts: { performerId?: string; cursor?: string; limit?: number }) {
    const limit = normalizeLimit(opts.limit)
    const cursorData = decodeCursor(opts.cursor)

    const inquiries = await db.castingInquiry.findMany({
      where: {
        ...(opts.performerId ? { performerProfileId: opts.performerId } : {}),
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
      include: { performerProfile: { select: { displayName: true } } },
    })

    const hasMore = inquiries.length > limit
    const items = hasMore ? inquiries.slice(0, limit) : inquiries
    const last = items[items.length - 1]
    const nextCursor = hasMore && last
      ? encodeCursor({ createdAt: last.createdAt.toISOString(), id: last.id })
      : null

    return {
      data: items.map((i) => ({ ...i, performerDisplayName: i.performerProfile.displayName })),
      meta: { hasMore, nextCursor },
    }
  }

  async listForPerformer(performerId: string, opts: { cursor?: string; limit?: number }) {
    return this.listAll({ ...opts, performerId })
  }
}
