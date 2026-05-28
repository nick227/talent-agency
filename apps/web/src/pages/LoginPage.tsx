import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLogin, useCurrentUser } from '@talent/sdk'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/animation/FadeIn'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Required'),
})
type FormData = z.infer<typeof schema>

const fieldClass = 'border-b border-black py-3'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md focus:outline-none focus:ring-0 placeholder:text-muted-foreground'

export function LoginPage() {
  const navigate = useNavigate()
  const { data: me } = useCurrentUser()
  const login = useLogin()

  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (me?.data) {
      if (me.data.role === 'ADMIN') navigate('/admin/performers', { replace: true })
      else navigate('/dashboard', { replace: true })
    }
  }, [me, navigate])

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login.mutateAsync(data)
      if (result.data?.role === 'ADMIN') navigate('/admin/performers')
      else navigate('/dashboard')
    } catch {
      setError('password', { message: 'Invalid email or password' })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <FadeIn className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-12 border-b border-black pb-8">
          <Link to="/" className="font-mono text-label-mono font-bold tracking-agency uppercase text-foreground">
            TALENT / AGENCY
          </Link>
          <h1
            className="font-display font-bold uppercase tracking-tight-display text-foreground mt-6"
            style={{ fontSize: 'clamp(2rem, 6vw, 48px)', lineHeight: 1.05 }}
          >
            Sign In
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-0" noValidate>
          <div className={fieldClass}>
            <label className={labelClass}>Email Address</label>
            <input type="email" className={inputClass} placeholder="admin@talent.agency" {...register('email')} />
            {errors.email && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.email.message}</p>}
          </div>
          <div className={fieldClass}>
            <label className={labelClass}>Password</label>
            <input type="password" className={inputClass} placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.password.message}</p>}
          </div>
          <div className="pt-6">
            <Button type="submit" loading={login.isPending} size="lg" className="w-full">
              Sign In
            </Button>
          </div>
        </form>

        <div className="mt-8 border-t border-black pt-6">
          <Link
            to="/"
            className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Site
          </Link>
        </div>
      </FadeIn>
    </div>
  )
}
