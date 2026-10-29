import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRegister, useCurrentUser } from '@talent/sdk'
import { Button } from '@/components/ui/Button'
import { AuthLayout } from '@/components/layout/AuthLayout'

const CATEGORIES = [
  { value: 'ACTOR', label: 'Actor' },
  { value: 'MODEL', label: 'Model' },
  { value: 'DANCER', label: 'Dancer' },
  { value: 'MUSICIAN', label: 'Musician' },
  { value: 'COMEDIAN', label: 'Comedian' },
  { value: 'HOST', label: 'Host' },
  { value: 'INFLUENCER', label: 'Influencer' },
  { value: 'OTHER', label: 'Other' },
]

const schema = z.object({
  displayName: z.string().min(1, 'Required').max(100, 'Too long'),
  email: z.string().email('Valid email required'),
  category: z.enum(['ACTOR', 'MODEL', 'DANCER', 'MUSICIAN', 'COMEDIAN', 'HOST', 'INFLUENCER', 'OTHER'] as const, { errorMap: () => ({ message: 'Select your category' }) }),
  location: z.string().optional(),
  password: z.string().min(8, 'At least 8 characters'),
  confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const fieldClass = 'border-b border-black py-3'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-muted-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50'

export function RegisterPage() {
  const navigate = useNavigate()
  const { data: me } = useCurrentUser()
  const register_ = useRegister()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (me?.data) {
      navigate(me.data.role === 'ADMIN' ? '/admin/performers' : '/dashboard', { replace: true })
    }
  }, [me, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      await register_.mutateAsync({
        email: data.email,
        password: data.password,
        displayName: data.displayName,
        category: data.category,
        location: data.location || undefined,
      })
      toast.success('Welcome to Talent / Agency!')
      navigate('/dashboard')
    } catch (err: any) {
      if (err?.status === 409) {
        toast.error('That email is already registered. Sign in instead.')
      } else {
        toast.error(err?.message ?? 'Registration failed')
      }
    }
  }

  return (
    <AuthLayout
      headline={"Join the\nRoster."}
      subheadline="Talent / Agency — Applications"
      description="Apply to be represented. Our team reviews every submission and will contact you within 48 hours."
      imageSeed="theo"
      stats={[
        { value: '48h', label: 'Review Time' },
        { value: '8', label: 'Categories' },
        { value: 'Global', label: 'Reach' },
      ]}
    >
      {/* Heading */}
      <div className="mb-8 border-b border-black pb-8">
        <h2
          className="font-display font-extrabold text-foreground tracking-tight-display leading-none"
          style={{ fontSize: 'clamp(2rem, 5vw, 48px)' }}
        >
          Join the Roster
        </h2>
        <p className="font-sans text-body-md text-muted-foreground mt-2">
          Already a member?{' '}
          <Link to="/login" className="text-foreground font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
        <div className={fieldClass}>
          <label className={labelClass}>Stage Name / Display Name</label>
          <input
            className={inputClass}
            placeholder="Your name as it will appear on your profile"
            autoComplete="name"
            {...register('displayName')}
          />
          {errors.displayName && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.displayName.message}</p>
          )}
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Email Address</label>
          <input
            type="email"
            className={inputClass}
            placeholder="you@example.com"
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Category</label>
          <select className={`${inputClass} appearance-none`} {...register('category')}>
            <option value="">Select your discipline</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Location <span className="text-muted-foreground/50">(optional)</span></label>
          <input
            className={inputClass}
            placeholder="City, Country"
            {...register('location')}
          />
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className={fieldClass}>
          <label className={labelClass}>Confirm Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="Repeat password"
            autoComplete="new-password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Note about review */}
        <p className="pt-4 font-mono text-[11px] tracking-agency text-muted-foreground leading-relaxed">
          Your profile will be in review until approved by our team. You'll receive email confirmation within 48 hours.
        </p>

        <div className="pt-6">
          <Button
            type="submit"
            loading={isSubmitting || register_.isPending}
            size="lg"
            className="w-full"
          >
            Submit Application
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-black/10">
        <Link
          to="/"
          className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Site
        </Link>
      </div>
    </AuthLayout>
  )
}
