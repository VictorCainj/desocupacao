'use client'

import AnimatedAlert from '@/components/ui/animated-alert'
import { FullScreenCalendar } from '@/components/ui/fullscreen-calendar'
import { calendario } from '@/lib/supabase'
import { format, parseISO, startOfDay } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

// Importar os tipos do Kanban
export type ProcessoDesocupacao = {
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

// Função para normalizar data para o início do dia no timezone local
const normalizeDate = (date: Date): Date => {
  return startOfDay(date)
}

interface AlertType {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface CalendarEvent {
  id: number
  name: string
  time: string
  datetime: string
  tipo?: string
  processo?: ProcessoDesocupacao
}

interface CalendarDay {
  day: Date
  events: CalendarEvent[]
}

interface CalendarDemoProps {
  processos?: ProcessoDesocupacao[]
}

// Função para converter processos de desocupação em eventos do calendário
function convertProcessosToCalendarEvents(processos: ProcessoDesocupacao[]): CalendarDay[] {
  const eventsMap = new Map<string, CalendarEvent[]>()

  processos.forEach((processo) => {
    // Normalizar a data da vistoria para evitar problemas de timezone
    const dataVistoria = normalizeDate(processo.contrato.dataVistoria)
    const dateKey = format(dataVistoria, 'yyyy-MM-dd')

    // Nome descritivo para o modal (não será exibido no calendário)
    const nomeEvento = `Vistoria - ${processo.contrato.nomeInquilino}`

    const evento: CalendarEvent = {
      id: parseInt(processo.id.replace(/[^\d]/g, '')) || Date.now() + Math.random(),
      name: nomeEvento,
      time: processo.contrato.horarioVistoria,
      datetime: `${format(dataVistoria, 'yyyy-MM-dd')}T${processo.contrato.horarioVistoria}`,
      tipo: 'vistoria',
      processo: processo,
    }

    const existingEvents = eventsMap.get(dateKey) || []
    eventsMap.set(dateKey, [...existingEvents, evento])
  })

  return Array.from(eventsMap.entries()).map(([dateKey, events]) => ({
    day: normalizeDate(parseISO(dateKey)),
    events,
  }))
}

function CalendarDemo({ processos = [] }: CalendarDemoProps) {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [supabaseEvents, setSupabaseEvents] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar eventos do Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const eventosData = await calendario.getEventos()

        // Converter eventos do Supabase para o formato do calendário
        const eventsMap = new Map<string, CalendarEvent[]>()

        eventosData.forEach((evento) => {
          if (!evento.data_evento) return // Skip eventos sem data

          // Filtrar eventos que podem ser relacionados a vistorias
          const titulo = (evento.evento_titulo || '').toLowerCase()
          const isVistoriaRelated =
            titulo.includes('vistoria') ||
            titulo.includes('contrato') ||
            titulo.includes('desocupa') ||
            titulo.includes('inquilino') ||
            /\d{2}:\d{2}/.test(titulo) // Padrão de horário

          if (isVistoriaRelated) return // Pular eventos relacionados a vistorias

          const dataEvento = normalizeDate(new Date(evento.data_evento))
          const dateKey = format(dataEvento, 'yyyy-MM-dd')

          const calendarEvent: CalendarEvent = {
            id: parseInt(evento.evento_id || '0') || Date.now() + Math.random(),
            name: evento.evento_titulo || 'Evento sem título',
            time: evento.horario_evento || '00:00',
            datetime: `${format(dataEvento, 'yyyy-MM-dd')}T${evento.horario_evento || '00:00'}`,
            tipo: 'evento_calendario',
          }

          const existingEvents = eventsMap.get(dateKey) || []
          eventsMap.set(dateKey, [...existingEvents, calendarEvent])
        })

        const convertedEvents = Array.from(eventsMap.entries()).map(([dateKey, events]) => ({
          day: normalizeDate(parseISO(dateKey)),
          events,
        }))

        setSupabaseEvents(convertedEvents)
      } catch (error) {
        console.error('Erro ao carregar eventos:', error)
        setAlerts((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: 'error',
            message: 'Erro ao carregar eventos do calendário',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Converter processos em eventos de vistoria
  const vistoriaEvents = useMemo(() => {
    return convertProcessosToCalendarEvents(processos)
  }, [processos])

  // Mesclar eventos do Supabase com eventos de vistorias (apenas eventos não relacionados a vistorias)
  const mergedEvents = useMemo(() => {
    const eventsMap = new Map<string, CalendarEvent[]>()

    // Adicionar apenas eventos do Supabase que NÃO são relacionados a vistorias
    supabaseEvents.forEach(({ day, events }) => {
      const dateKey = format(normalizeDate(day), 'yyyy-MM-dd')
      // Filtro extra para garantir que nenhum evento relacionado a vistoria passe
      const eventosLimpos = events.filter((event) => {
        const nome = event.name.toLowerCase()
        return (
          !nome.includes('vistoria') &&
          !nome.includes('contrato') &&
          !nome.includes('desocupa') &&
          !nome.includes('inquilino') &&
          !event.processo &&
          event.tipo !== 'vistoria'
        )
      })
      if (eventosLimpos.length > 0) {
        eventsMap.set(dateKey, [...eventosLimpos])
      }
    })

    // Adicionar eventos de vistorias dos processos
    vistoriaEvents.forEach(({ day, events }) => {
      const dateKey = format(normalizeDate(day), 'yyyy-MM-dd')
      const existingEvents = eventsMap.get(dateKey) || []
      const convertedEvents = events.map((event) => ({
        ...event,
        id:
          typeof event.id === 'string'
            ? parseInt(String(event.id).replace(/[^\d]/g, '')) || Date.now() + Math.random()
            : Number(event.id) || Date.now() + Math.random(),
      }))
      eventsMap.set(dateKey, [...existingEvents, ...convertedEvents])
    })

    return Array.from(eventsMap.entries()).map(([dateKey, events]) => ({
      day: normalizeDate(parseISO(dateKey)),
      events,
    }))
  }, [supabaseEvents, vistoriaEvents])

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  if (loading) {
    return (
      <div className="flex h-full flex-1 flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando calendário...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-1 flex-col relative">
      {/* Sistema de Alerts local do calendário */}
      <div className="absolute top-2 right-2 z-40 space-y-2 max-w-xs">
        {alerts.map((alert) => (
          <AnimatedAlert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClick={() => removeAlert(alert.id)}
            className="text-xs"
          />
        ))}
      </div>

      {/* Calendário principal - tela cheia com dados reais */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <FullScreenCalendar data={mergedEvents} />
      </div>
    </div>
  )
}

export { CalendarDemo }
