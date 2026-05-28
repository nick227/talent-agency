import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useSubmitInquiry } from '@talent/sdk'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  projectType: z.string().min(1, 'Project type is required').max(50),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

type FormData = z.infer<typeof schema>

const PROJECT_TYPES = ['Film', 'TV', 'Commercial', 'Fashion', 'Music Video', 'Theatre', 'Brand Partnership', 'Other']

const fieldClass = 'border-b border-black py-3'
const labelClass = 'block font-mono text-label-mono tracking-agency uppercase mb-1 text-foreground'
const inputClass = 'w-full bg-transparent border-none p-0 font-sans text-body-md focus:outline-none focus:ring-0 placeholder:text-muted-foreground'

interface InquiryFormProps {
  performerId: string
  performerName: string
}

export function InquiryForm({ performerId, performerName }: InquiryFormProps) {
  const mutation = useSubmitInquiry(performerId)
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await mutation.mutateAsync(data)
      toast.success('Inquiry sent')
      reset()
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to send inquiry')
    }
  }

  if (isSubmitSuccessful && !mutation.isPending) {
    return (
      <div className="py-12 border-t border-black">
        <p className="font-mono text-label-mono tracking-agency uppercase text-muted-foreground mb-2">Inquiry received</p>
        <p className="font-sans text-body-md text-muted-foreground">
          We'll be in touch regarding {performerName}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-0" noValidate>
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-8">
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
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Project Type</label>
        <select
          {...register('projectType')}
          className={`${inputClass} appearance-none`}
        >
          <option value="" disabled>Select type</option>
          {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        {errors.projectType && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.projectType.message}</p>}
      </div>

      <div className={fieldClass}>
        <label className={labelClass}>Message</label>
        <textarea
          className={`${inputClass} resize-none`}
          placeholder="Tell us about your project…"
          rows={3}
          {...register('message')}
        />
        {errors.message && <p className="mt-1 font-mono text-[11px] text-destructive">{errors.message.message}</p>}
      </div>

      <div className="pt-6">
        <Button type="submit" loading={mutation.isPending} size="lg" className="w-full sm:w-auto">
          Send Inquiry
        </Button>
      </div>
    </form>
  )
}
