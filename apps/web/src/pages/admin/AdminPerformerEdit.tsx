import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import {
  useAdminPerformer,
  useAdminUpdatePerformer,
  useAdminDeleteMedia,
  useAdminUpdateMedia,
  useAdminAddMedia,
  useAdminReorderMedia,
  useUpload,
} from '@talent/sdk'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { FadeIn } from '@/components/animation/FadeIn'
import { toast } from 'sonner'
import { Trash2, ChevronUp, ChevronDown, Upload } from 'lucide-react'

const CATEGORIES = ['ACTOR', 'MODEL', 'DANCER', 'MUSICIAN', 'COMEDIAN', 'HOST', 'INFLUENCER', 'OTHER'] as const
const CATEGORY_LABEL: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

const schema = z.object({
  displayName: z.string().min(1, 'Required'),
  slug: z.string().regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers, hyphens only').optional(),
  category: z.enum(CATEGORIES),
  location: z.string().optional(),
  bio: z.string().optional(),
  age: z.coerce.number().int().min(16).max(100).optional().or(z.literal('')),
  height: z.string().optional(),
  measurements: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  shoeSize: z.string().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
})
type FormData = z.infer<typeof schema>

interface UploadProgress {
  name: string
  done: boolean
  error: boolean
}

export function AdminPerformerEdit() {
  const { performerId } = useParams<{ performerId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useAdminPerformer(performerId!)
  const update = useAdminUpdatePerformer()
  const deleteMedia = useAdminDeleteMedia()
  const updateMedia = useAdminUpdateMedia()
  const addMedia = useAdminAddMedia()
  const reorderMedia = useAdminReorderMedia()
  const upload = useUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const headshotRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])

  const performer = data?.data

  const { register, handleSubmit, formState: { errors, isDirty }, reset, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false, isFeatured: false, category: 'MODEL' },
  })

  useEffect(() => {
    if (performer) {
      reset({
        displayName: performer.displayName,
        slug: performer.slug ?? '',
        category: performer.category as typeof CATEGORIES[number],
        location: performer.location ?? '',
        bio: performer.bio ?? '',
        age: performer.age ?? ('' as any),
        height: performer.height ?? '',
        measurements: performer.measurements ?? '',
        hairColor: performer.hairColor ?? '',
        eyeColor: performer.eyeColor ?? '',
        shoeSize: performer.shoeSize ?? '',
        isPublished: performer.isPublished,
        isFeatured: performer.isFeatured,
      })
    }
  }, [performer, reset])

  const onSubmit = async (data: FormData) => {
    try {
      await update.mutateAsync({
        performerId: performerId!,
        body: {
          displayName: data.displayName,
          slug: data.slug || undefined,
          category: data.category,
          location: data.location || undefined,
          bio: data.bio || undefined,
          age: typeof data.age === 'number' ? data.age : undefined,
          height: data.height || undefined,
          measurements: data.measurements || undefined,
          hairColor: data.hairColor || undefined,
          eyeColor: data.eyeColor || undefined,
          shoeSize: data.shoeSize || undefined,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
        },
      })
      toast.success('Profile saved')
      reset(data)
    } catch (e: any) {
      if (e?.status === 409) {
        setError('slug', { message: 'That URL is already taken' })
      } else {
        toast.error('Failed to save profile')
      }
    }
  }

  const handleHeadshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const result = await upload.mutateAsync(file)
      await update.mutateAsync({
        performerId: performerId!,
        body: { headshotUrl: result.data.url, headshotKey: result.data.key },
      })
      toast.success('Headshot updated')
    } catch {
      toast.error('Failed to upload headshot')
    }
  }

  const handlePortfolioFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    setUploadProgress(fileArray.map((f) => ({ name: f.name, done: false, error: false })))

    await Promise.all(
      fileArray.map(async (file, i) => {
        try {
          const result = await upload.mutateAsync(file)
          await addMedia.mutateAsync({
            performerId: performerId!,
            body: {
              url: result.data.url,
              key: result.data.key,
              mimeType: file.type,
              type: file.type.startsWith('video/') ? 'VIDEO' : 'PHOTO',
            },
          })
          setUploadProgress((prev) => prev.map((p, j) => j === i ? { ...p, done: true } : p))
        } catch {
          setUploadProgress((prev) => prev.map((p, j) => j === i ? { ...p, done: true, error: true } : p))
        }
      }),
    )

    setTimeout(() => setUploadProgress([]), 2000)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await deleteMedia.mutateAsync({ performerId: performerId!, mediaId })
      toast.success('Media removed')
    } catch {
      toast.error('Failed to remove media')
    }
  }

  const handleMoveMedia = async (mediaId: string, direction: 'up' | 'down') => {
    if (!performer?.mediaItems) return
    const sorted = [...performer.mediaItems].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((m) => m.id === mediaId)
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sorted.length - 1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const newOrder = sorted.map((m, i) => {
      if (i === idx) return { id: m.id, order: sorted[swapIdx].order }
      if (i === swapIdx) return { id: m.id, order: sorted[idx].order }
      return { id: m.id, order: m.order }
    })
    try {
      await reorderMedia.mutateAsync({ performerId: performerId!, items: newOrder })
    } catch {
      toast.error('Failed to reorder')
    }
  }

  const handleCaptionSave = async (mediaId: string, caption: string) => {
    try {
      await updateMedia.mutateAsync({ performerId: performerId!, mediaId, body: { caption } })
    } catch {
      toast.error('Failed to save caption')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
    )
  }

  if (!performer) {
    return <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">Performer not found.</p>
  }

  const sortedMedia = [...(performer.mediaItems ?? [])].sort((a, b) => a.order - b.order)

  return (
    <div>
      <FadeIn>
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">Edit</p>
            <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight-display uppercase text-foreground leading-none">
              {performer.displayName}
            </h1>
          </div>
          <a
            href={`/performers/${performer.slug ?? performerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            View Public →
          </a>
        </div>
      </FadeIn>

      <div className="max-w-2xl space-y-12">

        {/* Headshot */}
        <FadeIn delay={0.05}>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Headshot</p>
          <div className="flex items-start gap-6">
            <div className="w-24 h-32 bg-muted shrink-0 border border-black overflow-hidden">
              {performer.headshotUrl ? (
                <img
                  src={performer.headshotUrl}
                  alt={performer.displayName}
                  className="w-full h-full object-cover object-top grayscale"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-mono text-[10px] text-muted-foreground">N/A</span>
                </div>
              )}
            </div>
            <div>
              <input
                ref={headshotRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleHeadshotChange}
              />
              <button
                onClick={() => headshotRef.current?.click()}
                disabled={upload.isPending}
                className="font-mono text-label-mono tracking-agency uppercase px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors duration-100 disabled:opacity-40"
              >
                {upload.isPending ? 'Uploading…' : 'Replace Headshot'}
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Profile form */}
        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section>
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Profile</p>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Display name" {...register('displayName')} />
                  {errors.displayName && <p className="mt-1 font-mono text-[11px] text-red-600">{errors.displayName.message}</p>}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground border-b border-black py-2 pr-1 shrink-0">/performers/</span>
                    <input
                      {...register('slug')}
                      placeholder="portfolio-url"
                      className="flex-1 bg-transparent border-b border-black py-2 px-0 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                  {errors.slug && <p className="mt-1 font-mono text-[11px] text-red-600">{errors.slug.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    {...register('category')}
                    className="w-full bg-background border-b border-black text-foreground font-mono text-label-mono tracking-agency uppercase py-2 px-0 appearance-none focus:outline-none focus:border-foreground transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>
                    ))}
                  </select>
                  <Input placeholder="Location" {...register('location')} />
                </div>
                <Textarea placeholder="Bio…" rows={4} {...register('bio')} />
              </div>
            </section>

            <section>
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Stats</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Input placeholder="Age" {...register('age')} />
                <Input placeholder="Height" {...register('height')} />
                <Input placeholder="Measurements" {...register('measurements')} />
                <Input placeholder="Hair color" {...register('hairColor')} />
                <Input placeholder="Eye color" {...register('eyeColor')} />
                <Input placeholder="Shoe size" {...register('shoeSize')} />
              </div>
            </section>

            <section>
              <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Visibility</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isPublished')} className="accent-black w-4 h-4" />
                  <span className="font-mono text-label-mono tracking-agency uppercase text-foreground">Published — visible on public roster</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isFeatured')} className="accent-black w-4 h-4" />
                  <span className="font-mono text-label-mono tracking-agency uppercase text-foreground">Featured — shown in hero slideshow</span>
                </label>
              </div>
            </section>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={update.isPending || !isDirty}>
                {update.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/performers')}>
                Back
              </Button>
            </div>
          </form>
        </FadeIn>

        {/* Portfolio Media */}
        <FadeIn delay={0.2}>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Portfolio Media</p>

          {sortedMedia.length > 0 && (
            <div className="border-t border-l border-black mb-6">
              {sortedMedia.map((item, idx) => (
                <div key={item.id} className="flex items-start gap-3 p-3 border-b border-r border-black bg-background hover:bg-muted/40 group">
                  <div className="w-20 h-24 bg-muted border border-black overflow-hidden shrink-0">
                    {item.type === 'PHOTO' ? (
                      <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover grayscale" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[9px] text-muted-foreground uppercase">Video</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <input
                      defaultValue={item.caption ?? ''}
                      placeholder="Add caption…"
                      onBlur={(e) => { if (e.target.value !== (item.caption ?? '')) handleCaptionSave(item.id, e.target.value) }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCaptionSave(item.id, (e.target as HTMLInputElement).value) } }}
                      className="w-full bg-transparent border-b border-black py-1 px-0 font-mono text-[11px] text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleMoveMedia(item.id, 'up')}
                      disabled={idx === 0 || reorderMedia.isPending}
                      className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-20"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => handleMoveMedia(item.id, 'down')}
                      disabled={idx === sortedMedia.length - 1 || reorderMedia.isPending}
                      className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-20"
                    >
                      <ChevronDown size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteMedia(item.id)}
                      disabled={deleteMedia.isPending}
                      className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-foreground border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-20"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload progress */}
          {uploadProgress.length > 0 && (
            <div className="border-t border-l border-black mb-4">
              {uploadProgress.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 border-b border-r border-black">
                  <span className="font-mono text-[11px] text-muted-foreground truncate flex-1">{p.name}</span>
                  <span className="font-mono text-[11px] tracking-agency uppercase shrink-0">
                    {p.error ? <span className="text-red-600">Error</span> : p.done ? <span className="text-foreground">Done</span> : <span className="text-muted-foreground">Uploading…</span>}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Drop zone / upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => { if (e.target.files?.length) handlePortfolioFiles(e.target.files) }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-dashed border-black py-6 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-muted/40 transition-colors"
          >
            <Upload size={20} />
            <span className="font-mono text-label-mono tracking-agency uppercase">Add Photos / Videos</span>
            <span className="font-mono text-[10px] text-muted-foreground">Select multiple files at once</span>
          </button>
        </FadeIn>
      </div>
    </div>
  )
}
