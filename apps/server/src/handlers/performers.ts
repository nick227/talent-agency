import { PerformerService } from '../services/PerformerService'
import { InquiryService } from '../services/InquiryService'

const performerService = new PerformerService()
const inquiryService = new InquiryService()

export async function listPerformers(request: any, reply: any) {
  const { cursor, limit, q, category, location } = request.query
  const result = await performerService.list({ cursor, limit, q, category, location })
  return reply.send(result)
}

export async function getPerformer(request: any, reply: any) {
  const performer = await performerService.getById(request.params.performerId)
  return reply.send({ data: performer })
}

export async function getMyPerformerProfile(request: any, reply: any) {
  if (request.user.role !== 'PERFORMER') {
    throw { statusCode: 403, message: 'Forbidden' }
  }
  const performer = await performerService.getByUserId(request.user.id)
  return reply.send({ data: performer })
}

export async function submitInquiry(request: any, reply: any) {
  const inquiry = await inquiryService.submit(request.params.performerId, request.body)
  return reply.status(201).send({ data: inquiry })
}
