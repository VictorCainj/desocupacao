'use client'

import { documentosApi, type DocumentoStatus } from '@/lib/documentos-storage'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import * as React from 'react'
import { useEffect, useState } from 'react'

interface DocumentationStepperCompactProps {
  processoId: string
  onStatusChange?: (statuses: DocumentoStatus) => void
}

const DocumentationStepperCompact: React.FC<DocumentationStepperCompactProps> = ({
  processoId,
  onStatusChange = () => {},
}) => {
  const [statuses, setStatuses] = useState<DocumentoStatus>({
    DAEV: false,
    CPFL: false,
    GÁS: false,
    CND: false,
  })

  const documents = ['DAEV', 'CPFL', 'GÁS', 'CND'] as const

  // Carregar status salvos quando o componente for montado
  useEffect(() => {
    const savedStatuses = documentosApi.getStatus(processoId)
    setStatuses(savedStatuses)
  }, [processoId])

  const toggleStatus = (document: keyof DocumentoStatus) => {
    const newStatuses: DocumentoStatus = {
      ...statuses,
      [document]: !statuses[document],
    }
    setStatuses(newStatuses)

    // Salvar no armazenamento
    documentosApi.setStatus(processoId, newStatuses, 'admin') // Em produção, usar o usuário atual

    // Callback para o componente pai
    onStatusChange(newStatuses)
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <h4 className="text-sm font-medium text-foreground mb-1">Documentos</h4>
        <p className="text-xs text-muted-foreground">Clique para marcar como entregue</p>
      </div>

      <div className="grid grid-cols-4 gap-2">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{
                backgroundColor: { duration: 0.2 },
                borderColor: { duration: 0.2 },
                scale: { type: 'spring', stiffness: 400, damping: 20 },
              }}
              className={cn(
                'relative flex flex-col items-center justify-center',
                'h-12 w-full rounded border-2 shadow-sm',
                'text-white font-medium text-xs',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
              style={{
                backgroundColor: isDelivered ? '#22c55e' : '#eab308',
                borderColor: isDelivered ? '#16a34a' : '#ca8a04',
              }}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-semibold text-xs">{document}</span>

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
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Check size={12} strokeWidth={3} />
                </motion.div>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Progresso:</span>
        <span className="font-medium text-foreground">
          {Object.values(statuses).filter(Boolean).length}/{documents.length}
        </span>
      </div>

      <div className="mt-1 w-full bg-muted rounded-full h-1.5">
        <motion.div
          className="bg-green-500 h-1.5 rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${(Object.values(statuses).filter(Boolean).length / documents.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

export { DocumentationStepperCompact }
