'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  ChevronLeftIcon,
  ChevronRightIcon,
  Clock,
  MapPin,
  SearchIcon,
  User,
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Event {
  id: number
  name: string
  time: string
  datetime: string
  tipo?: string
  processo?: {
    id: string
    name: string
    status: {
      id: string
      name: string
      color: string
    }
    contrato: {
      nomeInquilino: string
      endereco: string
      garantia: string
      dataVistoria: Date
      horarioVistoria: string
      dataFinalDesocupacao: Date
    }
    responsavel?: {
      id: string
      image: string
      name: string
    }
  }
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  data: CalendarData[]
}

// Componente Modal para Vistorias do Dia
interface VistoriasModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  vistorias: Event[]
}

const VistoriasModal: React.FC<VistoriasModalProps> = ({ isOpen, onClose, date, vistorias }) => {
  const vistoriasDoTipo = vistorias.filter((event) => event.tipo === 'vistoria')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Vistorias de {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
          <DialogDescription>
            {vistoriasDoTipo.length} vistoria{vistoriasDoTipo.length !== 1 ? 's' : ''} agendada
            {vistoriasDoTipo.length !== 1 ? 's' : ''} para este dia
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {vistoriasDoTipo.map((vistoria, index) => (
            <Card key={`${vistoria.id}-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-end">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {vistoria.time}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Informações do Processo */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Detalhes do Processo
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Inquilino:</span>
                        <span className="font-semibold">
                          {vistoria.processo?.contrato.nomeInquilino}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="font-medium">Endereço:</span>
                        <span className="truncate">{vistoria.processo?.contrato.endereco}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nome do Processo:</span>
                        <span className="font-semibold">{vistoria.processo?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">ID do Processo:</span>
                        <span>{vistoria.processo?.id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Status:</span>
                        <div className="flex items-center gap-1">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: vistoria.processo?.status.color }}
                          />
                          <span>{vistoria.processo?.status.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Garantia:</span>
                        <span>{vistoria.processo?.contrato.garantia}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Prazo Final:</span>
                        <span>
                          {vistoria.processo?.contrato.dataFinalDesocupacao
                            ? format(vistoria.processo.contrato.dataFinalDesocupacao, 'dd/MM/yyyy')
                            : 'Não informado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Responsável */}
                  {vistoria.processo?.responsavel && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Responsável</h4>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {vistoria.processo.responsavel.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Responsável pela vistoria</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {vistoriasDoTipo.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma vistoria encontrada para este dia.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

// Dias da semana em português brasileiro - começando na segunda-feira
const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function FullScreenCalendar({ data }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, 'MMM-yyyy', { locale: ptBR })
  )
  const [modalOpen, setModalOpen] = React.useState(false)
  const [selectedDayEvents, setSelectedDayEvents] = React.useState<Event[]>([])

  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  // Ajustar para começar semana na segunda-feira (padrão brasileiro)
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth, { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth), { weekStartsOn: 1 }),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy', { locale: ptBR }))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy', { locale: ptBR }))
  }

  function goToToday() {
    setCurrentMonth(format(today, 'MMM-yyyy', { locale: ptBR }))
  }

  // Função para abrir modal com vistorias do dia
  const handleDayClick = (day: Date) => {
    setSelectedDay(day)
    const dayEvents = data
      .filter((eventData) => isSameDay(eventData.day, day))
      .flatMap((eventData) => eventData.events)

    const vistoriasCount = dayEvents.filter((event) => event.tipo === 'vistoria').length

    if (vistoriasCount > 0) {
      setSelectedDayEvents(dayEvents)
      setModalOpen(true)
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      {/* Calendar Header - Fixo */}
      <div className="flex flex-col space-y-4 p-4 md:p-6 md:flex-row md:items-center md:justify-between md:space-y-0 flex-shrink-0 border-b bg-muted/30">
        <div className="flex flex-auto items-center justify-center md:justify-start">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden w-20 md:w-24 flex-col items-center justify-center rounded-lg border bg-background p-2 md:flex shadow-sm">
              <h1 className="p-1 md:p-2 text-xs md:text-sm uppercase text-muted-foreground font-semibold">
                {format(today, 'MMM', { locale: ptBR })}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-card p-1 md:p-2 text-xl md:text-2xl font-bold shadow-sm">
                <span>{format(today, 'd')}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1 md:space-y-2 text-center md:text-left">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground capitalize">
                {format(firstDayCurrentMonth, "MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-medium">
                {format(firstDayCurrentMonth, "d 'de' MMM", { locale: ptBR })} -{' '}
                {format(endOfMonth(firstDayCurrentMonth), "d 'de' MMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Button variant="outline" size="icon" className="hidden lg:flex h-10 w-10">
            <SearchIcon size={18} strokeWidth={2} aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="hidden h-8 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 h-10"
              variant="outline"
              size="icon"
              aria-label="Navegar para o mês anterior"
            >
              <ChevronLeftIcon size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto h-10 px-6 font-semibold"
              variant="outline"
            >
              Hoje
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 h-10"
              variant="outline"
              size="icon"
              aria-label="Navegar para o próximo mês"
            >
              <ChevronRightIcon size={18} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid com Scroll Independente */}
      <div className="flex flex-1 flex-col min-h-0">
        {/* Week Days Header - Fixo */}
        <div className="grid grid-cols-7 border text-center text-sm md:text-base font-semibold leading-6 flex-shrink-0 bg-background">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={cn(
                'py-3 md:py-4 flex items-center justify-center',
                index < 6 && 'border-r'
              )}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days - Área com Scroll */}
        <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
          <div className="min-h-full text-sm md:text-base leading-6">
            {/* Desktop Calendar Grid */}
            <div className="hidden w-full border-x lg:grid lg:grid-cols-7 auto-rows-fr min-h-[600px]">
              {days.map((day, dayIdx) => (
                <div
                  key={dayIdx}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day) === 0 ? 6 : getDay(day) - 1], // Ajuste para segunda-feira
                    (() => {
                      const dayData = data.find((d) => isSameDay(d.day, day))
                      const vCount = dayData
                        ? dayData.events.filter((e) => e.tipo === 'vistoria').length
                        : 0
                      if (vCount >= 10) return 'bg-primary/70'
                      if (vCount >= 7) return 'bg-primary/50'
                      if (vCount >= 4) return 'bg-primary/30'
                      if (vCount >= 1) return 'bg-primary/10'
                      return ''
                    })(),
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      'bg-accent/50 text-muted-foreground',
                    'relative flex flex-col border-b border-r hover:bg-muted focus:z-10 cursor-pointer min-h-[160px]'
                  )}
                >
                  <header className="flex items-center justify-between p-3 md:p-4">
                    <button
                      type="button"
                      className={cn(
                        isEqual(day, selectedDay) && 'text-primary-foreground',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          isSameMonth(day, firstDayCurrentMonth) &&
                          'text-foreground',
                        !isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          !isSameMonth(day, firstDayCurrentMonth) &&
                          'text-muted-foreground',
                        isEqual(day, selectedDay) && isToday(day) && 'border-none bg-primary',
                        isEqual(day, selectedDay) && !isToday(day) && 'bg-foreground',
                        (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                        'flex h-8 w-8 items-center justify-center rounded-full text-sm hover:border font-medium'
                      )}
                    >
                      <time dateTime={format(day, 'yyyy-MM-dd')}>{format(day, 'd')}</time>
                    </button>
                  </header>
                  {/* Novo bloco de exibição agregada */}
                  {(() => {
                    const dayData = data.find((d) => isSameDay(d.day, day))
                    if (!dayData) return null
                    const vCount = dayData.events.filter((e) => e.tipo === 'vistoria').length
                    const oCount = dayData.events.filter(
                      (e) =>
                        e.tipo !== 'vistoria' &&
                        !e.processo &&
                        !e.name.toLowerCase().includes('vistoria')
                    ).length
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center gap-1 p-2">
                        {vCount > 0 && (
                          <div className="flex items-center gap-1 text-primary-foreground font-bold">
                            <Calendar className="h-3 w-3" />
                            <span className="text-sm">{vCount}</span>
                          </div>
                        )}
                        {oCount > 0 && (
                          <div className="text-[10px] text-muted-foreground">
                            +{oCount} outro{oCount !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ))}
            </div>

            {/* Mobile Calendar Grid */}
            <div className="isolate grid w-full grid-cols-7 auto-rows-fr lg:hidden min-h-[500px]">
              {days.map((day, dayIdx) => (
                <button
                  onClick={() => handleDayClick(day)}
                  key={dayIdx}
                  type="button"
                  className={cn(
                    (() => {
                      const dayData = data.find((d) => isSameDay(d.day, day))
                      const vCount = dayData
                        ? dayData.events.filter((e) => e.tipo === 'vistoria').length
                        : 0
                      if (vCount >= 10) return 'bg-primary/70 text-primary-foreground'
                      if (vCount >= 7) return 'bg-primary/50 text-primary-foreground'
                      if (vCount >= 4) return 'bg-primary/30 text-primary-foreground'
                      if (vCount >= 1) return 'bg-primary/20 text-primary-foreground'
                      return ''
                    })(),
                    isEqual(day, selectedDay) && 'text-primary-foreground',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      'text-foreground',
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      'text-muted-foreground',
                    (isEqual(day, selectedDay) || isToday(day)) && 'font-semibold',
                    'flex h-24 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10'
                  )}
                >
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={cn(
                      'ml-auto flex size-8 items-center justify-center rounded-full text-base font-medium',
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'bg-primary text-primary-foreground',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-primary text-primary-foreground'
                    )}
                  >
                    {format(day, 'd')}
                  </time>
                  {/* Indicadores agregados para mobile */}
                  {(() => {
                    const dayData = data.find((d) => isSameDay(d.day, day))
                    if (!dayData) return null
                    const vCount = dayData.events.filter((e) => e.tipo === 'vistoria').length
                    if (vCount === 0) return null
                    return (
                      <div className="mt-auto text-xs font-bold text-primary-foreground">
                        {vCount} V
                      </div>
                    )
                  })()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Vistorias do Dia */}
      {modalOpen && (
        <VistoriasModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          date={selectedDay}
          vistorias={selectedDayEvents}
        />
      )}
    </div>
  )
}
