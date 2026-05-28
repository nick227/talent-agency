import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

type SlideUpProps = {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
  className?: string
}

export function SlideUp({ children, delay = 0, duration = 0.5, distance = 24, className }: SlideUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: distance }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: distance }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
