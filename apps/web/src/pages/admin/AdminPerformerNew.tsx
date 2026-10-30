import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAdminCreatePerformer, useAdminUpdatePerformer } from '@talent/sdk'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animation/FadeIn'
import { toast } from 'sonner'

const CATEGORIES = ['ACTOR', 'MODEL', 'DANCER', 'MUSICIAN', 'COMEDIAN', 'HOST', 'INFLUENCER', 'OTHER'] as const
const CATEGORY_LABEL: Record<string, string> = {
  ACTOR: 'Actor', MODEL: 'Model', DANCER: 'Dancer', MUSICIAN: 'Musician',
  COMEDIAN: 'Comedian', HOST: 'Host', INFLUENCER: 'Influencer', OTHER: 'Artist',
}

const schema = z.object({
  displayName: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'At least 8 characters'),
  category: z.enum(CATEGORIES),
  location: z.string().optional(),
  bio: z.string().optional(),
  age: z.coerce.number().int().min(16).max(100).optional().or(z.literal('')),
  height: z.string().optional(),
  measurements: z.string().optional(),
  hairColor: z.string().optional(),
  eyeColor: z.string().optional(),
  shoeSize: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
})
type FormData = z.infer<typeof schema>

export function AdminPerformerNew() {
  usePageTitle('Admin · Add Performer')
  const navigate = useNavigate()
  const create = useAdminCreatePerformer()
  const update = useAdminUpdatePerformer()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'MODEL', isPublished: false, isFeatured: false },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const result = await create.mutateAsync({
        displayName: data.displayName,
        email: data.email,
        password: data.password,
        category: data.category,
        location: data.location || undefined,
        bio: data.bio || undefined,
        age: typeof data.age === 'number' ? data.age : undefined,
        height: data.height || undefined,
        measurements: data.measurements || undefined,
        hairColor: data.hairColor || undefined,
        eyeColor: data.eyeColor || undefined,
        shoeSize: data.shoeSize || undefined,
      })
      const newId = result.data?.id
      if (newId && (data.isPublished || data.isFeatured)) {
        await update.mutateAsync({
          performerId: newId,
          body: { isPublished: data.isPublished, isFeatured: data.isFeatured },
        })
      }
      toast.success('Performer created')
      navigate(`/admin/performers/${newId}`)
    } catch (e: any) {
      if (e?.status === 409) {
        toast.error('That email is already registered')
      } else {
        toast.error('Failed to create performer')
      }
    }
  }

  return (
    <div>
      <FadeIn>
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-3">New</p>
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight-display uppercase text-foreground leading-none mb-12">
          Add Performer
        </h1>
      </FadeIn>

      <FadeIn delay={0.1}>
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">

          {/* Account */}
          <section>
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Account</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input placeholder="Email address" type="email" {...register('email')} />
                {errors.email && <p className="mt-1 font-mono text-[11px] text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <Input placeholder="Initial password" type="password" {...register('password')} />
                {errors.password && <p className="mt-1 font-mono text-[11px] text-red-600">{errors.password.message}</p>}
              </div>
            </div>
          </section>

          {/* Profile */}
          <section>
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Profile</p>
            <div className="space-y-4">
              <div>
                <Input placeholder="Display name" {...register('displayName')} />
                {errors.displayName && <p className="mt-1 font-mono text-[11px] text-red-600">{errors.displayName.message}</p>}
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
                <Input placeholder="Location (e.g. Paris, New York)" {...register('location')} />
              </div>
              <Textarea placeholder="Bio…" rows={4} {...register('bio')} />
            </div>
          </section>

          {/* Stats */}
          <section>
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Stats</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Input placeholder="Age" {...register('age')} />
              <Input placeholder={`Height (e.g. 5'10")`} {...register('height')} />
              <Input placeholder="Measurements" {...register('measurements')} />
              <Input placeholder="Hair color" {...register('hairColor')} />
              <Input placeholder="Eye color" {...register('eyeColor')} />
              <Input placeholder="Shoe size" {...register('shoeSize')} />
            </div>
          </section>

          {/* Visibility */}
          <section>
            <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-4">Visibility</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isPublished')} className="accent-black w-4 h-4" />
                <span className="font-mono text-label-mono tracking-agency uppercase text-foreground">Published — visible</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('isFeatured')} className="accent-black w-4 h-4" />
                <span className="font-mono text-label-mono tracking-agency uppercase text-foreground">Featured — shown in hero slideshow</span>
              </label>
            </div>
          </section>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create Performer'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/admin/performers')}>
              Cancel
            </Button>
          </div>
        </form>
      </FadeIn>
    </div>
  )
}
