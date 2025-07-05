'use client'

import { calendario } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
    subMonths
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AnimatePresence, motion } from 'framer-motion'
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Home,
    MapPin,
    User
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

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

interface InnovativeCalendarProps {
  processos: ProcessoDesocupacao[]
}

interface DayInfo {
  date: Date
  vistorias: ProcessoDesocupacao[]
  eventos: any[]
  intensity: number // 0-5 para o heat map
}

interface HoveredDay {
  date: Date
  x: number
  y: number
  vistorias: ProcessoDesocupacao[]
}

// Componente de tooltip para exibir informações do dia
const DayTooltip = ({ day, position }: { day: HoveredDay; position: { x: number; y: number } }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-50 pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-10px)',
      }}
    >
      <div className="bg-popover text-popover-foreground rounded-lg shadow-xl border p-4 min-w-[250px]">
        <div className="text-sm font-semibold mb-2">
          {format(day.date, "dd 'de' MMMM", { locale: ptBR })}
        </div>
        {day.vistorias.length > 0 ? (
          <div className="space-y-2">
            {day.vistorias.slice(0, 3).map((vistoria) => (
              <div key={vistoria.id} className="flex items-start gap-2 text-xs">
                <Clock className="w-3 h-3 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{vistoria.contrato.horarioVistoria}</p>
                  <p className="text-muted-foreground">{vistoria.contrato.nomeInquilino}</p>
                </div>
              </div>
            ))}
            {day.vistorias.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{day.vistorias.length - 3} outras vistorias
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Sem vistorias agendadas</p>
        )}
      </div>
    </motion.div>
  )
}

// Componente para exibir detalhes expandidos de um dia
const DayDetails = ({ day, onClose }: { day: DayInfo; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-2xl shadow-2xl border p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold">
              {format(day.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </h3>
            <p className="text-muted-foreground">
              {day.vistorias.length} vistoria{day.vistorias.length !== 1 ? 's' : ''} agendada
              {day.vistorias.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {day.vistorias.map((vistoria) => (
            <motion.div
              key={vistoria.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl border bg-card hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: vistoria.status.color }}
                  />
                  <span className="font-semibold text-lg">{vistoria.contrato.horarioVistoria}</span>
                </div>
                <span className="text-sm text-muted-foreground">{vistoria.status.name}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{vistoria.contrato.nomeInquilino}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vistoria.contrato.endereco}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{vistoria.contrato.garantia}</span>
                  </div>
                  {vistoria.responsavel && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-3 h-3" />
                      </div>
                      <span className="text-muted-foreground">{vistoria.responsavel.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function InnovativeCalendar({ processos }: InnovativeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [hoveredDay, setHoveredDay] = useState<HoveredDay | null>(null)
  const [selectedDay, setSelectedDay] = useState<DayInfo | null>(null)
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month')

  // Carregar eventos do calendário
  useEffect(() => {
    const loadEventos = async () => {
      try {
        setLoading(true)
        const data = await calendario.getEventos()
        setEventos(data || [])
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadEventos()
  }, [])

  // Calcular informações dos dias
  const daysInfo = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    const days: DayInfo[] = []

    let current = start
    while (current <= end) {
      const dayVistorias = processos.filter((p) =>
        isSameDay(new Date(p.contrato.dataVistoria), current)
      )

      const dayEventos = eventos.filter(
        (e) => e.data_evento && isSameDay(new Date(e.data_evento), current)
      )

      // Calcular intensidade (0-5)
      const totalItems = dayVistorias.length + dayEventos.length
      let intensity = 0
      if (totalItems > 0) intensity = 1
      if (totalItems > 2) intensity = 2
      if (totalItems > 4) intensity = 3
      if (totalItems > 6) intensity = 4
      if (totalItems > 8) intensity = 5

      days.push({
        date: current,
        vistorias: dayVistorias,
        eventos: dayEventos,
        intensity,
      })

      current = addDays(current, 1)
    }

    return days
  }, [currentDate, processos, eventos])

  // Estatísticas do mês
  const monthStats = useMemo(() => {
    const monthDays = daysInfo.filter((d) => isSameMonth(d.date, currentDate))
    const totalVistorias = monthDays.reduce((acc, d) => acc + d.vistorias.length, 0)
    const diasComVistorias = monthDays.filter((d) => d.vistorias.length > 0).length
    const maxVistoriasDia = Math.max(...monthDays.map((d) => d.vistorias.length))

    return { totalVistorias, diasComVistorias, maxVistoriasDia }
  }, [daysInfo, currentDate])

  const handleDayClick = (day: DayInfo) => {
    if (day.vistorias.length > 0) {
      setSelectedDay(day)
    }
  }

  const handleDayHover = (day: DayInfo, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setHoveredDay({
      date: day.date,
      x: rect.left + rect.width / 2,
      y: rect.top,
      vistorias: day.vistorias,
    })
  }

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-muted', // 0
      'bg-green-100 dark:bg-green-900/30', // 1
      'bg-green-300 dark:bg-green-700/50', // 2
      'bg-green-500 dark:bg-green-600/70', // 3
      'bg-green-700 dark:bg-green-500/90', // 4
      'bg-green-900 dark:bg-green-400', // 5
    ]
    return colors[intensity] || colors[0]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <CalendarDays className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando calendário...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header com controles */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* Estatísticas do mês */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border"
        >
          <p className="text-sm text-muted-foreground">Total de Vistorias</p>
          <p className="text-2xl font-bold">{monthStats.totalVistorias}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-card border"
        >
          <p className="text-sm text-muted-foreground">Dias com Vistorias</p>
          <p className="text-2xl font-bold">{monthStats.diasComVistorias}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-card border"
        >
          <p className="text-sm text-muted-foreground">Máx. Vistorias/Dia</p>
          <p className="text-2xl font-bold">{monthStats.maxVistoriasDia}</p>
        </motion.div>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((dia) => (
          <div key={dia} className="text-center text-sm font-medium text-muted-foreground py-2">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de dias com heat map */}
      <div className="grid grid-cols-7 gap-2 flex-1">
        {daysInfo.map((day, index) => {
          const isCurrentMonth = isSameMonth(day.date, currentDate)
          const hasVistorias = day.vistorias.length > 0

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onMouseEnter={(e) => handleDayHover(day, e)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => handleDayClick(day)}
              className={cn(
                'relative aspect-square rounded-xl p-2 transition-all cursor-pointer',
                'hover:scale-105 hover:shadow-lg',
                getIntensityColor(day.intensity),
                !isCurrentMonth && 'opacity-30',
                isToday(day.date) && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                hasVistorias && 'cursor-pointer'
              )}
            >
              <div className="text-sm font-medium">
                {format(day.date, 'd')}
              </div>
              
              {hasVistorias && (
                <div className="absolute bottom-1 right-1">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-medium">{day.vistorias.length}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Legenda do heat map */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="text-sm text-muted-foreground">Menos</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map((intensity) => (
            <div
              key={intensity}
              className={cn('w-4 h-4 rounded', getIntensityColor(intensity))}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">Mais</span>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredDay && (
          <DayTooltip
            day={hoveredDay}
            position={{ x: hoveredDay.x, y: hoveredDay.y }}
          />
        )}
      </AnimatePresence>

      {/* Modal de detalhes do dia */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetails
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}