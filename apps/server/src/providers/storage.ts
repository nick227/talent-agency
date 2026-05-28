export interface UploadResult {
  url: string
  key: string
  mimeType: string
  size: number
}

export interface StorageProvider {
  upload(options: { buffer: Buffer; originalName: string; mimeType: string }): Promise<UploadResult>
  delete(key: string): Promise<void>
}

export function createStorageProvider(): StorageProvider {
  const provider = process.env.STORAGE_PROVIDER ?? 'local'
  switch (provider) {
    case 'r2': {
      try {
        const { R2StorageProvider } = require('./R2StorageProvider')
        return new R2StorageProvider()
      } catch {
        throw new Error('R2StorageProvider not found. Install the cloudflare-r2 plugin first.')
      }
    }
    default: {
      const { LocalStorageProvider } = require('./LocalStorageProvider')
      return new LocalStorageProvider()
    }
  }
}
