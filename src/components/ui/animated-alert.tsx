'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

interface AnimatedAlertProps {
  type?: 'success' | 'error' | 'warning' | 'info'
  message?: string
  onClick?: React.MouseEventHandler<HTMLDivElement>
  className?: string
}

const typeStyles = {
  success:
    'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  error:
    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  warning:
    'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
  info: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
}

const fadeInBlur = {
  initial: { opacity: 0, filter: 'blur(10px)', y: 10, rotate: 0 },
  animate: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    rotate: 0,
    transition: { duration: 0.2 },
  },
}

const AnimatedAlert: React.FC<AnimatedAlertProps> = ({
  type = 'info',
  message = 'Esta é uma mensagem de alerta.',
  onClick,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        'border px-4 py-3 flex gap-x-2 items-center rounded-2xl text-sm cursor-pointer select-none',
        typeStyles[type],
        className
      )}
      role="alert"
      variants={fadeInBlur}
      initial="initial"
      animate="animate"
      whileHover={{
        scale: 1.01,
        rotate: 1,
        transition: {
          duration: 0.2,
        },
      }}
      whileTap={{
        scale: 0.99,
        transition: {
          duration: 0.2,
        },
      }}
      onClick={onClick}
    >
      <span className="font-bold capitalize">{type}:</span>
      <span>{message}</span>
    </motion.div>
  )
}

export default AnimatedAlert
