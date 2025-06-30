'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import * as React from 'react'
import { useState } from 'react'

interface DocumentationStepperProps {
  onStatusChange?: (statuses: Record<string, boolean>) => void
}

const DocumentationStepper: React.FC<DocumentationStepperProps> = ({
  onStatusChange = () => {},
}) => {
  const [statuses, setStatuses] = useState<Record<string, boolean>>({
    DAEV: false,
    CPFL: false,
    GÁS: false,
    CND: false,
  })

  const documents = ['DAEV', 'CPFL', 'GÁS', 'CND']

  const toggleStatus = (document: string) => {
    const newStatuses = {
      ...statuses,
      [document]: !statuses[document],
    }
    setStatuses(newStatuses)
    onStatusChange(newStatuses)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Status de Entrega de Documentos
        </h3>
        <p className="text-sm text-muted-foreground">
          Clique nos botões para marcar as documentações como entregues
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {documents.map((document) => {
          const isDelivered = statuses[document]

          return (
            <motion.button
              key={document}
              onClick={() => toggleStatus(document)}
              initial={false}
              animate={{
                backgroundColor: isDelivered ? '#22c55e' : '#eab308',
                borderColor: isDelivered ? '#16a34a' : '#ca8a04',
                scale: 1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                backgroundColor: { duration: 0.2 },
                borderColor: { duration: 0.2 },
                scale: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'h-20 w-full rounded-lg border-2 shadow-sm',
                'text-white font-medium text-sm',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
              style={{
                backgroundColor: isDelivered ? '#22c55e' : '#eab308',
                borderColor: isDelivered ? '#16a34a' : '#ca8a04',
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold">{document}</span>

                <motion.div
                  initial={false}
                  animate={{
                    opacity: isDelivered ? 1 : 0,
                    scale: isDelivered ? 1 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="flex items-center justify-center"
                >
                  <Check size={16} strokeWidth={3} />
                </motion.div>

                <motion.span
                  initial={false}
                  animate={{
                    opacity: isDelivered ? 0 : 1,
                    scale: isDelivered ? 0 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="text-xs absolute bottom-2"
                >
                  Pendente
                </motion.span>

                <motion.span
                  initial={false}
                  animate={{
                    opacity: isDelivered ? 1 : 0,
                    scale: isDelivered ? 1 : 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="text-xs absolute bottom-2"
                >
                  Entregue
                </motion.span>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso:</span>
          <span className="font-medium text-foreground">
            {Object.values(statuses).filter(Boolean).length} de {documents.length} entregues
          </span>
        </div>
        <div className="mt-2 w-full bg-background rounded-full h-2">
          <motion.div
            className="bg-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.values(statuses).filter(Boolean).length / documents.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
    </div>
  )
}

const Demo = () => {
  const handleStatusChange = (statuses: Record<string, boolean>) => {
    console.log('Status atualizado:', statuses)
  }

  return (
    <div className="min-h-screen bg-background p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <DocumentationStepper onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  )
}

export { DocumentationStepper }
export default Demo
