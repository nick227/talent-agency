import { AdminService } from '../services/AdminService'
import { InquiryService } from '../services/InquiryService'

const adminService = new AdminService()
const inquiryService = new InquiryService()

export async function adminListPerformers(request: any, reply: any) {
  const { cursor, limit, q, category } = request.query
  const result = await adminService.listPerformers({ cursor, limit, q, category })
  return reply.send(result)
}

export async function adminCreatePerformer(request: any, reply: any) {
  const performer = await adminService.createPerformer(request.body)
  return reply.status(201).send({ data: performer })
}

export async function adminGetPerformer(request: any, reply: any) {
  const performer = await adminService.getPerformer(request.params.performerId)
  return reply.send({ data: performer })
}

export async function adminUpdatePerformer(request: any, reply: any) {
  const performer = await adminService.updatePerformer(request.params.performerId, request.body)
  return reply.send({ data: performer })
}

export async function adminDeletePerformer(request: any, reply: any) {
  await adminService.deletePerformer(request.params.performerId)
  return reply.send({ data: null })
}

export async function adminAddMedia(request: any, reply: any) {
  const item = await adminService.addMedia(request.params.performerId, request.body)
  return reply.status(201).send({ data: item })
}

export async function adminUpdateMedia(request: any, reply: any) {
  const item = await adminService.updateMedia(
    request.params.performerId,
    request.params.mediaId,
    request.body,
  )
  return reply.send({ data: item })
}

export async function adminDeleteMedia(request: any, reply: any) {
  await adminService.deleteMedia(request.params.performerId, request.params.mediaId)
  return reply.send({ data: null })
}

export async function adminListInquiries(request: any, reply: any) {
  const { cursor, limit, performerId } = request.query
  const result = await inquiryService.listAll({ cursor, limit, performerId })
  return reply.send(result)
}

export async function adminListPerformerInquiries(request: any, reply: any) {
  const { cursor, limit } = request.query
  const result = await inquiryService.listForPerformer(request.params.performerId, { cursor, limit })
  return reply.send(result)
}
