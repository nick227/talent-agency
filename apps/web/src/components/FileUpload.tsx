import { useRef, useState, useCallback } from 'react'
import { useUpload } from '@talent/sdk'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Upload, X } from 'lucide-react'

interface UploadedFile {
  url: string
  key: string
  mimeType: string
  name: string
}

interface Props {
  onUpload?: (file: UploadedFile) => void
  accept?: string
  maxSizeMb?: number
  className?: string
  label?: string
}

export function FileUpload({ onUpload, accept, maxSizeMb = 10, className, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploaded, setUploaded] = useState<UploadedFile | null>(null)
  const [clientError, setClientError] = useState<string | null>(null)
  const mutation = useUpload()

  const handleFile = useCallback(
    async (file: File) => {
      setClientError(null)
      if (file.size > maxSizeMb * 1024 * 1024) {
        setClientError(`File is larger than ${maxSizeMb}MB`)
        return
      }
      try {
        const result = await mutation.mutateAsync(file)
        const up = { ...result.data, name: file.name }
        setUploaded(up)
        onUpload?.(up)
      } catch (err: any) {
        setClientError(err.message ?? 'Upload failed')
      }
    },
    [maxSizeMb, mutation, onUpload],
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const clear = () => { setUploaded(null); setClientError(null); mutation.reset() }
  const error = clientError ?? (mutation.isError ? (mutation.error as Error).message : null)
  const isLoading = mutation.isPending

  if (uploaded) {
    return (
      <div className={cn('flex items-center gap-3 p-4 border border-border bg-muted/20', className)}>
        {uploaded.mimeType.startsWith('image/') ? (
          <img src={uploaded.url} alt={uploaded.name} className="h-12 w-12 object-cover shrink-0" />
        ) : (
          <div className="h-12 w-12 bg-muted shrink-0 flex items-center justify-center">
            <Upload size={16} className="text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-sans truncate">{uploaded.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">{uploaded.url}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={clear}><X size={14} /></Button>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 cursor-pointer transition-colors',
          dragOver ? 'border-foreground bg-muted/20' : 'border-border hover:border-foreground/40',
          isLoading && 'opacity-50 pointer-events-none',
        )}
      >
        <Upload size={20} className="text-muted-foreground" />
        <div className="text-center">
          <p className="text-xs uppercase tracking-agency text-muted-foreground">
            {isLoading ? 'Uploading…' : (label ?? 'Drop file or click to browse')}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Max {maxSizeMb}MB{accept ? ` · ${accept}` : ''}</p>
        </div>
      </div>
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="sr-only" />
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  )
}
