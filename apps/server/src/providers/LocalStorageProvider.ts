import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, extname } from 'path'
import { randomUUID } from 'crypto'
import type { StorageProvider, UploadResult } from './storage'

const UPLOADS_DIR = resolve(__dirname, '../../../../uploads')
const BASE_URL = (process.env.BASE_URL ?? 'http://localhost:3001').replace(/\/$/, '')

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav',
  'audio/ogg': '.ogg',
  'application/pdf': '.pdf',
}

export class LocalStorageProvider implements StorageProvider {
  constructor() {
    if (!existsSync(UPLOADS_DIR)) {
      mkdir(UPLOADS_DIR, { recursive: true }).catch(() => {})
    }
  }

  async upload({ buffer, originalName, mimeType }: {
    buffer: Buffer
    originalName: string
    mimeType: string
  }): Promise<UploadResult> {
    const originalExt = extname(originalName).toLowerCase()
    const ext = originalExt || MIME_TO_EXT[mimeType] || ''
    const key = `${randomUUID()}${ext}`

    await writeFile(resolve(UPLOADS_DIR, key), buffer)

    return { url: `${BASE_URL}/uploads/${key}`, key, mimeType, size: buffer.length }
  }

  async delete(key: string): Promise<void> {
    if (/[/\\.]/.test(key.replace(/\.[a-z0-9]+$/i, ''))) {
      throw { statusCode: 400, message: 'Invalid key' }
    }
    await unlink(resolve(UPLOADS_DIR, key)).catch(() => {})
  }
}
