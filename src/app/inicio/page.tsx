'use client'

import { CalendarDemo } from '@/components/features/calendar-demo'
import { KanbanExample, type ProcessoDesocupacao } from '@/components/features/kanban-demo'
import VistoriasDashboard from '@/components/ui/vistorias-dashboard'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { useCallback, useState } from 'react'

export default function InicioPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  // Estado compartilhado para os processos
  const [processos, setProcessos] = useState<ProcessoDesocupacao[]>([])

  // Função para lidar com atualização dos processos
  const handleProcessosUpdate = useCallback((novosProcessos: ProcessoDesocupacao[]) => {
    console.log('Processos atualizados:', novosProcessos)
    setProcessos(novosProcessos)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header fixo */}
      <header
        className={cn(
          'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          isMobile ? 'h-14' : 'h-16'
        )}
      >
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Dashboard de Desocupação
            </h1>
            {processos.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-slate-500 rounded-full"></span>
                <span>
                  {processos.length} processo{processos.length !== 1 ? 's' : ''} ativo
                  {processos.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Container Principal com scrollbar própria */}
      <main className="overflow-y-auto">
        <div className={`${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'} space-y-8`}>
          {/* Seção Dashboard de Vistorias */}
          <section className="space-y-4">
            <div className={`rounded-lg border bg-card shadow-sm ${isMobile ? 'p-2' : 'p-4'}`}>
              <VistoriasDashboard />
            </div>
          </section>

          {/* Seção Calendário */}
          <section className="space-y-4">
            <div>
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold tracking-tight`}>
                📅 Calendário de Vistorias
              </h2>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                {isMobile
                  ? 'Datas de vistoria'
                  : 'Visualize e gerencie todas as datas de vistoria dos seus contratos de desocupação'}
              </p>
            </div>

            <div className={`rounded-lg border bg-card shadow-sm ${isMobile ? 'p-2' : 'p-4'}`}>
              <div className={`${isMobile ? 'h-[500px]' : isTablet ? 'h-[600px]' : 'h-[700px]'}`}>
                <CalendarDemo processos={processos} />
              </div>
            </div>
          </section>

          {/* Seção Kanban */}
          <section className="space-y-4">
            <div className={`rounded-lg border bg-card shadow-sm ${isMobile ? 'p-2' : 'p-3'}`}>
              <KanbanExample onProcessosChange={handleProcessosUpdate} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
