'use client'

import { KanbanExample, type ProcessoDesocupacao } from '@/components/features/kanban-demo'
import { InnovativeCalendar } from '@/components/ui/innovative-calendar'
import { MetricsGrid } from '@/components/ui/metrics-grid'
import { TimelineView } from '@/components/ui/timeline-view'
import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Calendar, ChartBar, Clock3, LayoutGrid } from 'lucide-react'
import { useCallback, useState } from 'react'

export default function InicioPage() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')

  // Estado compartilhado para os processos
  const [processos, setProcessos] = useState<ProcessoDesocupacao[]>([])
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'grid'>('calendar')

  // Função para lidar com atualização dos processos
  const handleProcessosUpdate = useCallback((novosProcessos: ProcessoDesocupacao[]) => {
    console.log('Processos atualizados:', novosProcessos)
    setProcessos(novosProcessos)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header fixo moderno com glassmorphism */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
          'sticky top-0 z-50 shadow-sm',
          isMobile ? 'h-16' : 'h-20'
        )}
      >
        <div className="flex h-full items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="hidden sm:flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg"
            >
              <ChartBar className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className={`font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                Central de Controle
              </h1>
              <div className="flex items-center gap-3 mt-1">
                {processos.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="relative">
                      <span className="absolute inset-0 animate-ping w-2 h-2 bg-green-400 rounded-full opacity-75"></span>
                      <span className="relative block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                    <span className="font-medium">
                      {processos.length} {processos.length === 1 ? 'processo ativo' : 'processos ativos'}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="hidden md:flex items-center gap-2 bg-muted/50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                viewMode === 'calendar'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Calendário</span>
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                viewMode === 'timeline'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Clock3 className="w-4 h-4" />
              <span className="text-sm font-medium">Linha do Tempo</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                viewMode === 'grid'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="text-sm font-medium">Grade</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Container Principal com scrollbar customizada */}
      <main className="overflow-y-auto">
        <div className={`${isMobile ? 'p-4' : isTablet ? 'p-6' : 'p-8'} space-y-8 pb-16`}>
          {/* Seção de Métricas com novo design */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <MetricsGrid processos={processos} />
          </motion.section>

          {/* Seção Principal - Calendário/Timeline/Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold tracking-tight flex items-center gap-3`}>
                  {viewMode === 'calendar' && (
                    <>
                      <div className="p-2 rounded-xl bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <span>Visualização de Calendário</span>
                    </>
                  )}
                  {viewMode === 'timeline' && (
                    <>
                      <div className="p-2 rounded-xl bg-primary/10">
                                              <Clock3 className="w-5 h-5 text-primary" />
                    </div>
                    <span>Linha do Tempo</span>
                    </>
                  )}
                  {viewMode === 'grid' && (
                    <>
                      <div className="p-2 rounded-xl bg-primary/10">
                        <LayoutGrid className="w-5 h-5 text-primary" />
                      </div>
                      <span>Visualização em Grade</span>
                    </>
                  )}
                </h2>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
                  {viewMode === 'calendar' && 'Visualize vistorias em um mapa de calor interativo'}
                  {viewMode === 'timeline' && 'Acompanhe o progresso das vistorias ao longo do tempo'}
                  {viewMode === 'grid' && 'Visualize todas as vistorias em uma grade compacta'}
                </p>
              </div>

              {/* Mobile View Selector */}
              {isMobile && (
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="px-3 py-2 rounded-lg border bg-background text-sm"
                >
                  <option value="calendar">Calendário</option>
                  <option value="timeline">Timeline</option>
                  <option value="grid">Grade</option>
                </select>
              )}
            </div>

            <div className={`rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden ${isMobile ? 'p-3' : 'p-6'}`}>
              <div className={`${isMobile ? 'min-h-[500px]' : isTablet ? 'min-h-[600px]' : 'min-h-[700px]'}`}>
                {viewMode === 'calendar' && <InnovativeCalendar processos={processos} />}
                {viewMode === 'timeline' && <TimelineView processos={processos} />}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Implementação da grade será feita em breve */}
                    <div className="text-center py-20 col-span-full">
                      <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">Visualização em grade em desenvolvimento</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Seção Kanban com novo estilo */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold tracking-tight flex items-center gap-3`}>
                <div className="p-2 rounded-xl bg-primary/10">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                </div>
                <span>Quadro Kanban</span>
              </h2>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mt-1`}>
                Gerencie o fluxo de processos de desocupação
              </p>
            </div>

            <div className={`rounded-2xl border bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden ${isMobile ? 'p-3' : 'p-6'}`}>
              <KanbanExample onProcessosChange={handleProcessosUpdate} />
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
