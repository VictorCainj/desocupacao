'use client'

import { cn } from '@/lib/utils'
import { format, isToday, startOfDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AnimatePresence, motion } from 'framer-motion'
import {
    Calendar,
    ChevronDown,
    Clock,
    Eye,
    Filter,
    Home,
    MapPin,
    User
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface ProcessoDesocupacao {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: {
    id: string
    name: string
    color: string
  }
  contrato: {
    nomeInquilino: string
    endereco: string
    garantia: string
    dataNotificacao: Date
    dataFinalDesocupacao: Date
    dataVistoria: Date
    horarioVistoria: string
  }
  responsavel?: {
    id: string
    image: string
    name: string
  }
}

interface TimelineViewProps {
  processos: ProcessoDesocupacao[]
}

interface TimelineGroup {
  date: Date
  dateStr: string
  processos: ProcessoDesocupacao[]
  isExpanded: boolean
}

// Componente para cada item da timeline
const TimelineItem = ({ processo, index }: { processo: ProcessoDesocupacao; index: number }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Linha conectora */}
      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />

      {/* Card do processo */}
      <div className="relative flex gap-4">
        {/* Marcador circular */}
        <div className="relative z-10">
          <motion.div
            animate={{ scale: isHovered ? 1.2 : 1 }}
            className="w-12 h-12 rounded-full border-4 border-background flex items-center justify-center"
            style={{ backgroundColor: processo.status.color }}
          >
            <Clock className="w-5 h-5 text-white" />
          </motion.div>
        </div>

        {/* Conteúdo */}
        <motion.div
          animate={{ scale: isHovered ? 1.02 : 1 }}
          className="flex-1 mb-8"
        >
          <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">{processo.contrato.nomeInquilino}</h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {processo.contrato.horarioVistoria}
                  </span>
                  <span>•</span>
                  <span>{processo.status.name}</span>
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${processo.status.color}20`,
                  color: processo.status.color 
                }}
              >
                {processo.name}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{processo.contrato.endereco}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{processo.contrato.garantia}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Prazo: {format(processo.contrato.dataFinalDesocupacao, 'dd/MM/yyyy')}
                  </span>
                </div>
                {processo.responsavel && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{processo.responsavel.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações rápidas */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: isHovered ? 1 : 0, height: isHovered ? 'auto' : 0 }}
              className="mt-4 pt-4 border-t"
            >
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                  <Eye className="w-3 h-3" />
                  Ver Detalhes
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Componente para grupo de data
const DateGroup = ({ group, onToggle }: { group: TimelineGroup; onToggle: () => void }) => {
  const isTodays = isToday(group.date)

  return (
    <div className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm pb-4"
      >
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all",
            "hover:bg-muted/50",
            isTodays && "bg-primary/10 border-primary/20 border"
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              "px-3 py-1 rounded-lg text-sm font-medium",
              isTodays ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              {isTodays ? 'Hoje' : format(group.date, 'EEE', { locale: ptBR })}
            </div>
            <h2 className="text-xl font-bold">
              {format(group.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <span className="text-sm text-muted-foreground">
              {group.processos.length} vistoria{group.processos.length !== 1 ? 's' : ''}
            </span>
          </div>
          <motion.div
            animate={{ rotate: group.isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </motion.div>

      <AnimatePresence>
        {group.isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pl-8"
          >
            {group.processos.map((processo, index) => (
              <TimelineItem key={processo.id} processo={processo} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function TimelineView({ processos }: TimelineViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')

  // Agrupar processos por data
  const timelineGroups = useMemo(() => {
    // Filtrar processos
    let filtered = processos
    if (filter === 'pending') {
      filtered = processos.filter(p => 
        p.status.name.toLowerCase().includes('agendada') ||
        p.status.name.toLowerCase().includes('notificação')
      )
    } else if (filter === 'completed') {
      filtered = processos.filter(p => 
        p.status.name.toLowerCase().includes('aprovada') ||
        p.status.name.toLowerCase().includes('reprovada')
      )
    }

    // Agrupar por data
    const groups = new Map<string, ProcessoDesocupacao[]>()
    
    filtered.forEach(processo => {
      const date = startOfDay(new Date(processo.contrato.dataVistoria))
      const dateStr = date.toISOString()
      
      if (!groups.has(dateStr)) {
        groups.set(dateStr, [])
      }
      groups.get(dateStr)!.push(processo)
    })

    // Converter para array e ordenar
    const sortedGroups = Array.from(groups.entries())
      .map(([dateStr, processos]) => ({
        date: new Date(dateStr),
        dateStr,
        processos: processos.sort((a, b) => 
          a.contrato.horarioVistoria.localeCompare(b.contrato.horarioVistoria)
        ),
        isExpanded: expandedGroups.has(dateStr) || isToday(new Date(dateStr))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    // Auto-expandir o dia de hoje
    const today = startOfDay(new Date()).toISOString()
    if (!expandedGroups.has(today) && sortedGroups.some(g => g.dateStr === today)) {
      setExpandedGroups(new Set([...expandedGroups, today]))
    }

    return sortedGroups
  }, [processos, filter, expandedGroups])

  const toggleGroup = (dateStr: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(dateStr)) {
      newExpanded.delete(dateStr)
    } else {
      newExpanded.add(dateStr)
    }
    setExpandedGroups(newExpanded)
  }

  const stats = useMemo(() => ({
    total: processos.length,
    pending: processos.filter(p => 
      p.status.name.toLowerCase().includes('agendada') ||
      p.status.name.toLowerCase().includes('notificação')
    ).length,
    completed: processos.filter(p => 
      p.status.name.toLowerCase().includes('aprovada') ||
      p.status.name.toLowerCase().includes('reprovada')
    ).length,
  }), [processos])

  return (
    <div className="h-full flex flex-col">
      {/* Header com filtros */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Linha do Tempo</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualize todas as vistorias em ordem cronológica
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                filter === 'all' 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Todas ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                filter === 'pending' 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pendentes ({stats.pending})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-all",
                filter === 'completed' 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Concluídas ({stats.completed})
            </button>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {timelineGroups.length > 0 ? (
          <div className="relative">
            {/* Linha vertical principal */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {timelineGroups.map((group) => (
              <DateGroup
                key={group.dateStr}
                group={group}
                onToggle={() => toggleGroup(group.dateStr)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhuma vistoria encontrada com o filtro selecionado
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}