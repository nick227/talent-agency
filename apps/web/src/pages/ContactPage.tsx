import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FadeIn } from '@/components/animation/FadeIn'
import { PageTransition } from '@/components/animation/PageTransition'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Valid email required'),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(10, 'Message too short'),
})
type FormData = z.infer<typeof schema>

const fieldClass = 'border-b border-black py-3'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md focus:outline-none focus:ring-0 placeholder:text-muted-foreground'

export function ContactPage() {
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 600))
  }

  return (
    <PageTransition>
      <div className="max-w-[1200px] mx-auto px-4 md:px-16 py-16">

        <FadeIn>
          <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-12">Contact</p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: info */}
          <FadeIn delay={0.1}>
            <h1
              className="font-display font-bold uppercase tracking-tight-display text-foreground mb-6"
              style={{ fontSize: 'clamp(2rem, 5vw, 48px)', lineHeight: 1.05 }}
            >
              Contact /<br />Inquiry
            </h1>
            <p className="font-sans text-body-lg text-muted-foreground max-w-sm mb-8">
              Submit a project brief or roster inquiry. Our response time is typically under 4 hours
              for verified production houses.
            </p>
            <div className="font-mono text-label-mono tracking-agency space-y-2">
              <p>INFO@TALENT.AGENCY</p>
              <p>+1 212 555 0198</p>
            </div>
          </FadeIn>

          {/* Right: form */}
          <FadeIn delay={0.2}>
            {isSubmitSuccessful ? (
              <div className="pt-4">
                <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">
                  Message sent
                </p>
                <p className="font-sans text-body-md text-muted-foreground">
                  We'll be in touch shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-0" noValidate>
                <div className={fieldClass}>
                  <label className={labelClass}>Full Name</label>
                  <input className={inputClass} placeholder="Required" {...register('name')} />
                  {errors.name && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.name.message}</p>}
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" className={inputClass} placeholder="Required" {...register('email')} />
                  {errors.email && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.email.message}</p>}
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Subject</label>
                  <input className={inputClass} placeholder="Required" {...register('subject')} />
                  {errors.subject && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.subject.message}</p>}
                </div>
                <div className={fieldClass}>
                  <label className={labelClass}>Message</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    placeholder="Optional"
                    rows={3}
                    {...register('message')}
                  />
                  {errors.message && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.message.message}</p>}
                </div>
                <div className="pt-6">
                  <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </PageTransition>
  )
}
