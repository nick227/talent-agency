import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowUp, ArrowDown, Trash2, ExternalLink, Upload, CheckCircle2 } from 'lucide-react'
import {
  useMyPerformerProfile,
  useUpdateMyProfile,
  useAddMyMedia,
  useReorderMyMedia,
  useDeleteMyMedia,
  useUpdateMyMedia,
} from '@talent/sdk'
import { useUpload } from '@talent/sdk'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

// ── helpers ──────────────────────────────────────────────────────────────────

const CATEGORIES = ['ACTOR','MODEL','DANCER','MUSICIAN','COMEDIAN','HOST','INFLUENCER','OTHER'] as const

const fieldClass = 'border-b border-black py-3'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-muted-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50'

// ── Profile form ─────────────────────────────────────────────────────────────

const profileSchema = z.object({
  displayName: z.string().min(1, 'Required'),
  slug: z.string().min(1, 'Required').max(80).regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  bio: z.string().optional(),
  category: z.enum(['ACTOR', 'MODEL', 'DANCER', 'MUSICIAN', 'COMEDIAN', 'HOST', 'INFLUENCER', 'OTHER'] as const),
  location: z.string().optional(),
  age: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  measurements: z.string().optional(),
  shoeSize: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
})
type ProfileFormData = z.infer<typeof profileSchema>

function ProfileSection({ profile }: { profile: any }) {
  const updateProfile = useUpdateMyProfile()
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, formState: { errors, isDirty }, setError, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName ?? '',
      slug: profile.slug ?? '',
      bio: profile.bio ?? '',
      category: profile.category ?? '',
      location: profile.location ?? '',
      age: profile.age ? String(profile.age) : '',
      height: profile.height ?? '',
      weight: profile.weight ?? '',
      measurements: profile.measurements ?? '',
      shoeSize: profile.shoeSize ?? '',
      hairColor: profile.hairColor ?? '',
      eyeColor: profile.eyeColor ?? '',
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const payload: any = { ...data }
      if (data.age) payload.age = parseInt(data.age, 10)
      else delete payload.age
      await updateProfile.mutateAsync(payload)
      toast.success('Profile saved')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      reset(data)
    } catch (err: any) {
      if (err?.status === 409) {
        setError('slug', { message: 'That URL is already taken — try another' })
      } else {
        toast.error(err?.message ?? 'Failed to save')
      }
    }
  }

  return (
    <section>
      <SectionHeader title="Profile Information" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          <div className={fieldClass}>
            <label className={labelClass}>Display Name</label>
            <input className={inputClass} placeholder="Your public name" {...register('displayName')} />
            {errors.displayName && <FieldError msg={errors.displayName.message!} />}
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Category</label>
            <select className={`${inputClass} appearance-none`} {...register('category')}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
            </select>
            {errors.category && <FieldError msg={errors.category.message!} />}
          </div>
        </div>

        {/* Slug */}
        <div className={fieldClass}>
          <label className={labelClass}>Portfolio URL</label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[13px] text-muted-foreground shrink-0">
              /performers/
            </span>
            <input
              className={inputClass}
              placeholder="your-name"
              {...register('slug')}
              onChange={(e) => {
                e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                register('slug').onChange(e)
              }}
            />
          </div>
          {errors.slug && <FieldError msg={errors.slug.message!} />}
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Bio</label>
          <textarea
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="A short bio that appears on your public profile…"
            {...register('bio')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
          <div className={fieldClass}>
            <label className={labelClass}>Location</label>
            <input className={inputClass} placeholder="City, Country" {...register('location')} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Age</label>
            <input className={inputClass} type="number" placeholder="—" {...register('age')} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-8">
          <div className={fieldClass}>
            <label className={labelClass}>Height</label>
            <input className={inputClass} placeholder="5'10&quot;" {...register('height')} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Weight</label>
            <input className={inputClass} placeholder="70kg" {...register('weight')} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Hair</label>
            <input className={inputClass} placeholder="Brown" {...register('hairColor')} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Eyes</label>
            <input className={inputClass} placeholder="Blue" {...register('eyeColor')} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-0 md:gap-8">
          <div className={fieldClass}>
            <label className={labelClass}>Measurements</label>
            <input className={inputClass} placeholder="32-24-34" {...register('measurements')} />
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Shoe Size</label>
            <input className={inputClass} placeholder="US 9" {...register('shoeSize')} />
          </div>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <Button
            type="submit"
            loading={updateProfile.isPending}
            disabled={!isDirty}
            size="lg"
          >
            Save Changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 font-mono text-label-mono tracking-agency uppercase text-muted-foreground">
              <CheckCircle2 size={14} /> Saved
            </span>
          )}
        </div>
      </form>
    </section>
  )
}

// ── Headshot section ─────────────────────────────────────────────────────────

function HeadshotSection({ profile }: { profile: any }) {
  const upload = useUpload()
  const updateProfile = useUpdateMyProfile()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    try {
      const result = await upload.mutateAsync(file)
      await updateProfile.mutateAsync({ headshotUrl: result.data.url, headshotKey: result.data.key })
      toast.success('Headshot updated')
    } catch (err: any) {
      toast.error(err.message ?? 'Upload failed')
    }
  }

  return (
    <section>
      <SectionHeader title="Headshot" />
      <div className="flex items-start gap-6">
        {profile.headshotUrl ? (
          <div className="border border-black w-28 h-36 overflow-hidden shrink-0">
            <img src={profile.headshotUrl} alt={profile.displayName} className="w-full h-full object-cover grayscale" />
          </div>
        ) : (
          <div className="border border-black w-28 h-36 bg-muted flex items-center justify-center shrink-0">
            <span className="font-mono text-[11px] text-muted-foreground">No photo</span>
          </div>
        )}
        <div>
          <p className="font-sans text-body-md text-muted-foreground mb-4">
            Recommended: portrait orientation, high resolution. Displayed in grayscale.
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={upload.isPending || updateProfile.isPending}
            className="font-mono text-label-mono tracking-agency uppercase px-4 py-2 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-40"
          >
            {upload.isPending ? 'Uploading…' : 'Replace Headshot'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
          />
        </div>
      </div>
    </section>
  )
}

// ── Portfolio section ─────────────────────────────────────────────────────────

interface UploadProgress {
  name: string
  done: boolean
  error?: string
}

function PortfolioSection({ profile }: { profile: any }) {
  const items: any[] = profile.mediaItems ?? []
  const upload = useUpload()
  const addMedia = useAddMyMedia()
  const reorder = useReorderMyMedia()
  const deleteMedia = useDeleteMyMedia()
  const updateMedia = useUpdateMyMedia()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<UploadProgress[]>([])
  const [captions, setCaptions] = useState<Record<string, string>>(
    Object.fromEntries(items.map((i) => [i.id, i.caption ?? '']))
  )

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArr = Array.from(files)
    setUploading(fileArr.map((f) => ({ name: f.name, done: false })))

    await Promise.all(fileArr.map(async (file, idx) => {
      try {
        const res = await upload.mutateAsync(file)
        await addMedia.mutateAsync({
          url: res.data.url,
          key: res.data.key,
          mimeType: res.data.mimeType,
          type: res.data.mimeType.startsWith('video') ? 'VIDEO' : 'PHOTO',
        })
        setUploading((prev) => prev.map((p, i) => i === idx ? { ...p, done: true } : p))
      } catch (err: any) {
        setUploading((prev) =>
          prev.map((p, i) => i === idx ? { ...p, error: err.message ?? 'Failed' } : p)
        )
      }
    }))

    setTimeout(() => setUploading([]), 2000)
  }, [upload, addMedia])

  const move = async (id: string, direction: 'up' | 'down') => {
    const idx = items.findIndex((i) => i.id === id)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === items.length - 1)) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    const newOrder = items.map((item, i) => {
      if (i === idx) return { id: item.id, order: items[swapIdx].order }
      if (i === swapIdx) return { id: item.id, order: items[idx].order }
      return { id: item.id, order: item.order }
    })
    try {
      await reorder.mutateAsync(newOrder)
    } catch {
      toast.error('Failed to reorder')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this media item?')) return
    try {
      await deleteMedia.mutateAsync(id)
      toast.success('Deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const saveCaption = async (id: string) => {
    try {
      await updateMedia.mutateAsync({ mediaId: id, caption: captions[id] ?? '' })
      toast.success('Caption saved')
    } catch {
      toast.error('Failed to save caption')
    }
  }

  return (
    <section>
      <SectionHeader title="Portfolio Media" />

      {/* Upload zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files)
        }}
        className="border-2 border-dashed border-black p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/40 transition-colors mb-6"
      >
        <Upload size={24} className="text-muted-foreground" />
        <div className="text-center">
          <p className="font-mono text-label-mono tracking-agency uppercase">
            Drop files or click to select
          </p>
          <p className="font-mono text-[11px] tracking-agency text-muted-foreground mt-1">
            Multiple files supported · JPEG, PNG, WebP · Max 10MB each
          </p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="sr-only"
        onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); e.target.value = '' }}
      />

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="mb-6 border border-black">
          {uploading.map((u, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 border-b border-black/20 last:border-b-0">
              <span className="font-mono text-label-mono tracking-agency text-foreground truncate max-w-[70%]">{u.name}</span>
              <span className={`font-mono text-label-mono tracking-agency uppercase ${u.error ? 'text-destructive' : u.done ? 'text-green-700' : 'text-muted-foreground'}`}>
                {u.error ? 'Failed' : u.done ? 'Done' : 'Uploading…'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Media items */}
      {items.length === 0 ? (
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground py-8 border-t border-black">
          No media yet — upload photos or videos above
        </p>
      ) : (
        <div className="border-t border-l border-black">
          {items.map((item, idx) => (
            <div key={item.id} className="flex items-start gap-4 p-4 border-b border-r border-black">
              {/* Thumbnail */}
              <div className="w-20 h-24 border border-black overflow-hidden bg-muted shrink-0">
                {item.mimeType?.startsWith('video') || item.url?.includes('youtube') ? (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="font-mono text-[10px] text-muted-foreground">VIDEO</span>
                  </div>
                ) : (
                  <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover grayscale" />
                )}
              </div>

              {/* Caption */}
              <div className="flex-1 min-w-0">
                <label className={labelClass}>Caption</label>
                <div className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    placeholder="Add a caption…"
                    value={captions[item.id] ?? ''}
                    onChange={(e) => setCaptions((p) => ({ ...p, [item.id]: e.target.value }))}
                    onBlur={() => saveCaption(item.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveCaption(item.id)}
                  />
                </div>
                <p className="font-mono text-[11px] text-muted-foreground mt-1">
                  Position {item.order + 1} of {items.length}
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => move(item.id, 'up')}
                  disabled={idx === 0 || reorder.isPending}
                  className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-25"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(item.id, 'down')}
                  disabled={idx === items.length - 1 || reorder.isPending}
                  className="p-1.5 border border-black hover:bg-black hover:text-white transition-colors disabled:opacity-25"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteMedia.isPending}
                  className="p-1.5 border border-black hover:bg-destructive hover:text-white hover:border-destructive transition-colors disabled:opacity-25"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

// ── Main dashboard ────────────────────────────────────────────────────────────

export function PerformerDashboard() {
  const { data, isLoading } = useMyPerformerProfile()
  const profile = data?.data

  usePageTitle(profile?.displayName ? `${profile.displayName} · Dashboard` : 'Dashboard')

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-16 w-1/2" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="py-24 text-center">
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground">
          Your profile hasn't been set up yet. Contact your agent.
        </p>
      </div>
    )
  }

  const publicUrl = profile.slug ? `/performers/${profile.slug}` : `/performers/${profile.id}`

  return (
    <div className="space-y-0">
      {/* Page header */}
      <div className="pb-8 mb-8 border-b border-black flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">
            {profile.category.charAt(0) + profile.category.slice(1).toLowerCase()}
            {profile.location ? ` · ${profile.location}` : ''}
          </p>
          <h1
            className="font-display font-extrabold tracking-tight-display text-foreground leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 48px)' }}
          >
            {profile.displayName}
          </h1>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className={`font-mono text-label-mono tracking-agency uppercase px-3 py-1.5 border ${profile.isPublished ? 'border-black bg-black text-white' : 'border-black text-muted-foreground'}`}>
            {profile.isPublished ? 'Published' : 'Pending Review'}
          </span>
          {profile.isPublished && (
            <Link
              to={publicUrl}
              target="_blank"
              className="flex items-center gap-1.5 font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              View Profile <ExternalLink size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-16">
        <ProfileSection profile={profile} />
        <HeadshotSection profile={profile} />
        <PortfolioSection profile={profile} />
      </div>
    </div>
  )
}

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="font-mono text-label-mono tracking-agency uppercase text-foreground font-bold">{title}</h2>
      <div className="flex-1 border-t border-black/20" />
    </div>
  )
}

function FieldError({ msg }: { msg: string }) {
  return <p className="mt-1 font-mono text-[11px] text-destructive">{msg}</p>
}
