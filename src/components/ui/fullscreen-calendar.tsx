'use client'

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
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react'
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
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    dayIdx === 0 && colStartClasses[getDay(day) === 0 ? 6 : getDay(day) - 1], // Ajuste para segunda-feira
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
                  <div className="flex-1 p-3 pt-0">
                    {data
                      .filter((eventData) => isSameDay(eventData.day, day))
                      .map((eventData, eventDataIdx) => (
                        <div
                          key={`${eventData.day.toString()}-${eventDataIdx}`}
                          className="space-y-2"
                        >
                          {eventData.events.slice(0, 3).map((event, eventIdx) => {
                            return (
                              <div
                                key={`${event.id}-${eventIdx}`}
                                className={cn(
                                  'flex flex-col items-start gap-2 rounded-lg border p-2 md:p-3 text-sm leading-tight shadow-sm hover:shadow-md transition-all cursor-pointer group',
                                  'bg-card hover:bg-muted/50 border-border'
                                )}
                                title={
                                  event.tipo === 'vistoria' && event.processo
                                    ? `Vistoria: ${event.processo.contrato.nomeInquilino}\nEndereço: ${event.processo.contrato.endereco}\nStatus: ${event.processo.status.name}\nResponsável: ${event.processo.responsavel?.name || 'Não atribuído'}`
                                    : event.name
                                }
                              >
                                {/* Nome do evento */}
                                <div className="flex items-center justify-between w-full">
                                  <p className="font-semibold leading-none text-xs md:text-sm truncate flex-1">
                                    {event.name}
                                  </p>
                                </div>

                                {/* Informações da vistoria */}
                                {event.tipo === 'vistoria' && event.processo && (
                                  <div className="w-full space-y-1">
                                    {/* Endereço */}
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <span>📍</span>
                                      <span className="truncate">
                                        {event.processo.contrato.endereco}
                                      </span>
                                    </div>

                                    {/* Data e horário da vistoria */}
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <span>📅</span>
                                      <span>
                                        {format(event.processo.contrato.dataVistoria, 'dd/MM/yyyy')}{' '}
                                        às {event.time}
                                      </span>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-1 text-xs">
                                      <div
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: event.processo.status.color }}
                                      />
                                      <span className="text-muted-foreground">
                                        {event.processo.status.name}
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* Eventos normais (não vistoria) */}
                                {event.tipo !== 'vistoria' && (
                                  <p className="leading-none text-muted-foreground text-xs font-medium">
                                    {event.time}
                                  </p>
                                )}

                                {/* Badge para vistoria */}
                                {event.tipo === 'vistoria' && (
                                  <div className="flex items-center justify-between w-full mt-1">
                                    <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground border">
                                      Vistoria
                                    </span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          {eventData.events.length > 3 && (
                            <div className="text-xs text-muted-foreground font-medium bg-muted/30 rounded px-2 py-1 text-center">
                              + {eventData.events.length - 3} evento
                              {eventData.events.length - 3 !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Calendar Grid */}
            <div className="isolate grid w-full grid-cols-7 auto-rows-fr lg:hidden min-h-[500px]">
              {days.map((day, dayIdx) => (
                <button
                  onClick={() => setSelectedDay(day)}
                  key={dayIdx}
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
                  {data.filter((date) => isSameDay(date.day, day)).length > 0 && (
                    <div>
                      {data
                        .filter((date) => isSameDay(date.day, day))
                        .map((date, dateIdx) => (
                          <div
                            key={`${date.day.toString()}-mobile-${dateIdx}`}
                            className="-mx-0.5 mt-auto flex flex-wrap-reverse"
                          >
                            {date.events.map((event, eventIdx) => {
                              return (
                                <span
                                  key={`${event.id}-mobile-${eventIdx}`}
                                  className={cn(
                                    'mx-0.5 mt-1 h-2 w-2 rounded-full',
                                    event.tipo === 'vistoria' ? 'bg-primary' : 'bg-muted-foreground'
                                  )}
                                  title={
                                    event.tipo === 'vistoria' && event.processo
                                      ? `${event.processo.contrato.nomeInquilino} - ${event.time}`
                                      : `${event.name} - ${event.time}`
                                  }
                                />
                              )
                            })}
                          </div>
                        ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
