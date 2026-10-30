import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin, useCurrentUser } from '@talent/sdk'
import { usePageTitle } from '@/hooks/usePageTitle'
import { Button } from '@/components/ui/Button'
import { AuthLayout } from '@/components/layout/AuthLayout'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Required'),
})
type FormData = z.infer<typeof schema>

const fieldClass = 'group border-b border-black py-3 focus-within:border-black'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-muted-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md text-foreground focus:outline-none focus:ring-0 placeholder:text-muted-foreground/50'

export function LoginPage() {
  usePageTitle('Sign In')
  const navigate = useNavigate()
  const { data: me } = useCurrentUser()
  const login = useLogin()

  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (me?.data) {
      navigate(me.data.role === 'ADMIN' ? '/admin/performers' : '/dashboard', { replace: true })
    }
  }, [me, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login.mutateAsync(data)
      navigate(result.data?.role === 'ADMIN' ? '/admin/performers' : '/dashboard')
    } catch {
      setError('password', { message: 'Invalid email or password' })
    }
  }

  return (
    <AuthLayout
      headline="Welcome Back."
      subheadline="Talent / Agency — Member Portal"
      description="Sign in to access your performer dashboard, manage your profile, and track your inquiries."
      imageSeed="margaux"
      stats={[
        { value: '16+', label: 'Artists' },
        { value: '8', label: 'Categories' },
        { value: 'Global', label: 'Reach' },
      ]}
    >
      {/* Heading */}
      <div className="mb-10 border-b border-black pb-8">
        <h2
          className="font-display font-extrabold text-foreground tracking-tight-display leading-none"
          style={{ fontSize: 'clamp(2rem, 5vw, 48px)' }}
        >
          Sign In
        </h2>
        <p className="font-sans text-body-md text-muted-foreground mt-2">
          New here?{' '}
          <Link to="/register" className="text-foreground font-medium underline underline-offset-4 hover:text-muted-foreground transition-colors">
            Join Agency
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">
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
          <label className={labelClass}>Password</label>
          <input
            type="password"
            className={inputClass}
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 font-mono text-[11px] text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="pt-8">
          <Button
            type="submit"
            loading={isSubmitting || login.isPending}
            size="lg"
            className="w-full"
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Footer */}
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
