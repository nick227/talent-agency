import fp from 'fastify-plugin'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import { resolve } from 'path'
import { mkdirSync } from 'fs'

const UPLOADS_DIR = resolve(__dirname, '../../../../uploads')

export default fp(async (server) => {
  await server.register(multipart, {
    limits: { fileSize: 100 * 1024 * 1024 },
  })

  if (!process.env.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER === 'local') {
    mkdirSync(UPLOADS_DIR, { recursive: true })
    await server.register(staticFiles, {
      root: UPLOADS_DIR,
      prefix: '/uploads/',
      decorateReply: false,
    })
  }
})
