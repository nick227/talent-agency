import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type PageTransitionProps = {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeInOut' }}
      className={cn('min-h-screen', className)}
    >
      {children}
    </motion.div>
  )
}
