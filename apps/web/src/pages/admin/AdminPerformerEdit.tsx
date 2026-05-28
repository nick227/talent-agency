import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  useAdminPerformer,
  useAdminUpdatePerformer,
  useAdminDeleteMedia,
  useAdminUpdateMedia,
  useAdminAddMedia,
} from '@talent/sdk'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { FileUpload } from '@/components/FileUpload'
import { FadeIn } from '@/components/animation/FadeIn'
import { toast } from 'sonner'
import { Trash2, GripVertical } from 'lucide-react'

const CATEGORIES = ['ACTOR', 'MODEL', 'DANCER', 'MUSICIAN', 'COMEDIAN', 'HOST', 'INFLUENCER', 'OTHER'] as const
const FIELD_LABEL: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

const schema = z.object({
  displayName: z.string().min(1, 'Required'),
  category: z.enum(CATEGORIES),
  location: z.string().optional(),
  bio: z.string().optional(),
  age: z.coerce.number().int().min(16).max(100).optional(),
  height: z.string().optional(),
  measurements: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  shoeSize: z.string().optional(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
})
type FormData = z.infer<typeof schema>

export function AdminPerformerEdit() {
  const { performerId } = useParams<{ performerId: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useAdminPerformer(performerId!)
  const update = useAdminUpdatePerformer()
  const deleteMedia = useAdminDeleteMedia()
  const updateMedia = useAdminUpdateMedia()
  const addMedia = useAdminAddMedia()

  const performer = data?.data

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isPublished: false, isFeatured: false, category: 'MODEL' },
  })

  useEffect(() => {
    if (performer) {
      reset({
        displayName: performer.displayName,
        category: performer.category as typeof CATEGORIES[number],
        location: performer.location ?? '',
        bio: performer.bio ?? '',
        age: performer.age ?? undefined,
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
          category: data.category,
          location: data.location || undefined,
          bio: data.bio || undefined,
          age: data.age || undefined,
          height: data.height || undefined,
          measurements: data.measurements || undefined,
          hairColor: data.hairColor || undefined,
          eyeColor: data.eyeColor || undefined,
          shoeSize: data.shoeSize || undefined,
          isPublished: data.isPublished,
          isFeatured: data.isFeatured,
        },
      })
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update profile')
    }
  }

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await deleteMedia.mutateAsync({ performerId: performerId!, mediaId })
      toast.success('Media removed')
    } catch {
      toast.error('Failed to remove media')
    }
  }

  const handleSetHeadshot = (file: { url: string; key: string }) => {
    update.mutateAsync({
      performerId: performerId!,
      body: { headshotUrl: file.url, headshotKey: file.key },
    })
      .then(() => toast.success('Headshot updated'))
      .catch(() => toast.error('Failed to update headshot'))
  }

  const handleAddMedia = (file: { url: string; key: string; mimeType: string }) => {
    addMedia.mutateAsync({
      performerId: performerId!,
      body: { url: file.url, key: file.key, mimeType: file.mimeType, type: file.mimeType.startsWith('video/') ? 'VIDEO' : 'PHOTO' },
    })
      .then(() => toast.success('Media added'))
      .catch(() => toast.error('Failed to add media'))
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
    return <p className="text-xs text-muted-foreground">Performer not found.</p>
  }

  return (
    <div>
      <FadeIn>
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Edit</p>
            <h1 className="font-display font-300 tracking-tight-display text-foreground text-4xl md:text-5xl leading-none">
              {performer.displayName}
            </h1>
          </div>
          <a
            href={`/performers/${performerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            View Public →
          </a>
        </div>
      </FadeIn>

      <div className="max-w-2xl space-y-12">
        {/* Headshot */}
        <FadeIn delay={0.05}>
          <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Headshot</p>
          <div className="flex items-start gap-6">
            <div className="w-24 h-32 bg-muted flex-shrink-0 overflow-hidden">
              {performer.headshotUrl ? (
                <img src={performer.headshotUrl} alt={performer.displayName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="flex-1">
              <FileUpload
                accept="image/*"
                onUpload={handleSetHeadshot}
                label="Upload headshot"
              />
            </div>
          </div>
        </FadeIn>

        {/* Profile form */}
        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <section>
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Profile</p>
              <div className="space-y-4">
                <div>
                  <Input placeholder="Display name" {...register('displayName')} />
                  {errors.displayName && <p className="mt-1 text-xs text-destructive">{errors.displayName.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <select
                    {...register('category')}
                    className="w-full h-11 bg-background border border-input-border text-foreground text-xs tracking-agency uppercase px-3 appearance-none focus:outline-none focus:border-foreground transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{FIELD_LABEL[c]}</option>
                    ))}
                  </select>
                  <Input placeholder="Location" {...register('location')} />
                </div>
                <Textarea placeholder="Bio…" rows={4} {...register('bio')} />
              </div>
            </section>

            <section>
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Stats</p>
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
              <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Visibility</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isPublished')} className="accent-foreground" />
                  <span className="text-xs text-foreground">Published</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" {...register('isFeatured')} className="accent-foreground" />
                  <span className="text-xs text-foreground">Featured in hero</span>
                </label>
              </div>
            </section>

            <div className="flex gap-4 pt-2">
              <Button type="submit" disabled={update.isPending}>
                {update.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate('/admin/performers')}>
                Back
              </Button>
            </div>
          </form>
        </FadeIn>

        {/* Media */}
        <FadeIn delay={0.2}>
          <p className="text-[10px] tracking-agency uppercase text-muted-foreground mb-4">Portfolio Media</p>

          {performer.mediaItems && performer.mediaItems.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {performer.mediaItems.map((item) => (
                <div key={item.id} className="relative group aspect-square bg-muted overflow-hidden">
                  <GripVertical size={10} className="absolute top-1 left-1 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.type === 'PHOTO' ? (
                    <img src={item.url} alt={item.caption ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-[10px] tracking-agency uppercase text-muted-foreground">Video</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <FileUpload
            accept="image/*,video/*"
            onUpload={handleAddMedia}
            label="Add photo or video"
          />
        </FadeIn>
      </div>
    </div>
  )
}
