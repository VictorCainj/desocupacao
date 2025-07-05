'use client'

import { ProcessoCompleto } from '@/types/database.types'
import { motion } from 'framer-motion'
import {
    Activity,
    AlertCircle,
    CalendarCheck,
    CheckCircle2,
    Clock,
    FileX,
    Home,
    TrendingDown,
    TrendingUp,
    XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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

interface MetricsGridProps {
  processos: ProcessoDesocupacao[]
}

interface Metric {
  id: string
  title: string
  value: number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  bgColor: string
  description: string
  sparkline?: number[]
}

// Componente de Card de Métrica Individual
const MetricCard = ({ metric, index }: { metric: Metric; index: number }) => {
  const Icon = metric.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card to-card/80 p-6 shadow-lg hover:shadow-xl transition-all"
    >
      {/* Background decoration */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-10"
        style={{ backgroundColor: metric.color }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="p-3 rounded-xl shadow-sm"
            style={{ backgroundColor: metric.bgColor }}
          >
            <Icon className="w-6 h-6" style={{ color: metric.color }} />
          </div>

          <div className="flex items-center gap-1">
            {metric.trend === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : metric.trend === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Activity className="w-4 h-4 text-gray-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                metric.trend === 'up'
                  ? 'text-green-500'
                  : metric.trend === 'down'
                    ? 'text-red-500'
                    : 'text-gray-500'
              }`}
            >
              {metric.change > 0 ? '+' : ''}{metric.change}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
          <p className="text-3xl font-bold tracking-tight">{metric.value.toLocaleString('pt-BR')}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{metric.description}</p>
        </div>

                 {/* Mini Sparkline */}
         {metric.sparkline && metric.sparkline.length > 0 && (
           <div className="mt-4 flex items-end gap-1 h-12">
             {metric.sparkline.map((value, i) => (
               <div
                 key={i}
                 className="flex-1 rounded-sm transition-all hover:opacity-80"
                 style={{
                   height: `${(value / Math.max(...metric.sparkline!)) * 100}%`,
                   backgroundColor: metric.color,
                   opacity: 0.2 + (i / metric.sparkline!.length) * 0.8,
                 }}
               />
             ))}
           </div>
         )}
      </div>
    </motion.div>
  )
}

// Componente de Resumo Rápido
const QuickSummary = ({ totalProcessos, vistoriasHoje, urgentes }: { totalProcessos: number; vistoriasHoje: number; urgentes: number }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-8 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Total de Processos</p>
        <p className="text-4xl font-bold text-primary">{totalProcessos}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Vistorias Hoje</p>
        <p className="text-4xl font-bold text-orange-500">{vistoriasHoje}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-1">Ações Urgentes</p>
        <p className="text-4xl font-bold text-red-500">{urgentes}</p>
      </div>
    </div>
  </motion.div>
)

export function MetricsGrid({ processos: processosKanban = [] }: MetricsGridProps) {
  const [loading, setLoading] = useState(true)
  const [dbProcessos, setDbProcessos] = useState<ProcessoCompleto[]>([])

  // Carregar dados do banco
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await processosApi.getAll()
        setDbProcessos(data)
      } catch (error) {
        console.error('Erro ao carregar processos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Combinar dados do Kanban com dados do banco
  const allProcessos = useMemo(() => {
    const processosMap = new Map()
    
    // Adicionar processos do banco
    dbProcessos.forEach((p: ProcessoCompleto) => {
      processosMap.set(p.id, {
        ...p,
        tipo: 'db'
      })
    })
    
    // Adicionar/atualizar com processos do Kanban
    processosKanban.forEach((p: ProcessoDesocupacao) => {
      processosMap.set(p.id, {
        ...p,
        tipo: 'kanban'
      })
    })
    
    return Array.from(processosMap.values())
  }, [processosKanban, dbProcessos])

  // Calcular métricas
  const metrics = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString().split('T')[0]

    const metricas = {
      totalProcessos: allProcessos.length,
      vistoriasHoje: 0,
      vistoriasAgendadas: 0,
      vistoriasAprovadas: 0,
      vistoriasReprovadas: 0,
      notificacoes: 0,
      processosJudiciais: 0,
      prazoVencido: 0,
    }

    allProcessos.forEach((processo) => {
      // Contar por status
      const status = processo.status?.name || processo.status_name || ''
      const statusLower = status.toLowerCase()

      if (statusLower.includes('notificação')) {
        metricas.notificacoes++
      } else if (statusLower.includes('agendada')) {
        metricas.vistoriasAgendadas++
      } else if (statusLower.includes('aprovada')) {
        metricas.vistoriasAprovadas++
      } else if (statusLower.includes('reprovada')) {
        metricas.vistoriasReprovadas++
      } else if (statusLower.includes('judicial')) {
        metricas.processosJudiciais++
      }

      // Verificar vistorias de hoje
      const dataVistoria = processo.contrato?.dataVistoria || processo.data_vistoria
      if (dataVistoria) {
        const vistoriaDate = new Date(dataVistoria)
        vistoriaDate.setHours(0, 0, 0, 0)
        if (vistoriaDate.getTime() === today.getTime()) {
          metricas.vistoriasHoje++
        }
      }

      // Verificar prazos vencidos
      const dataFinal = processo.contrato?.dataFinalDesocupacao || processo.data_final_desocupacao
      if (dataFinal && new Date(dataFinal) < today) {
        metricas.prazoVencido++
      }
    })

    return metricas
  }, [allProcessos])

  // Gerar dados de sparkline (simulado)
  const generateSparkline = (base: number) => {
    return Array.from({ length: 7 }, (_, i) => 
      Math.max(0, base + Math.floor(Math.random() * 20 - 10))
    )
  }

  const metricsData: Metric[] = [
    {
      id: 'total',
      title: 'Total de Processos',
      value: metrics.totalProcessos,
      change: 12,
      trend: 'up',
      icon: Home,
      color: '#6366f1',
      bgColor: '#6366f115',
      description: 'Todos os processos de desocupação ativos',
      sparkline: generateSparkline(metrics.totalProcessos),
    },
    {
      id: 'hoje',
      title: 'Vistorias Hoje',
      value: metrics.vistoriasHoje,
      change: metrics.vistoriasHoje > 0 ? 100 : 0,
      trend: metrics.vistoriasHoje > 0 ? 'up' : 'stable',
      icon: CalendarCheck,
      color: '#f59e0b',
      bgColor: '#f59e0b15',
      description: 'Vistorias agendadas para hoje',
      sparkline: generateSparkline(metrics.vistoriasHoje),
    },
    {
      id: 'agendadas',
      title: 'Vistorias Agendadas',
      value: metrics.vistoriasAgendadas,
      change: 8,
      trend: 'up',
      icon: Clock,
      color: '#3b82f6',
      bgColor: '#3b82f615',
      description: 'Aguardando realização da vistoria',
      sparkline: generateSparkline(metrics.vistoriasAgendadas),
    },
    {
      id: 'aprovadas',
      title: 'Vistorias Aprovadas',
      value: metrics.vistoriasAprovadas,
      change: 15,
      trend: 'up',
      icon: CheckCircle2,
      color: '#22c55e',
      bgColor: '#22c55e15',
      description: 'Imóveis em condições adequadas',
      sparkline: generateSparkline(metrics.vistoriasAprovadas),
    },
    {
      id: 'reprovadas',
      title: 'Vistorias Reprovadas',
      value: metrics.vistoriasReprovadas,
      change: -5,
      trend: 'down',
      icon: XCircle,
      color: '#ef4444',
      bgColor: '#ef444415',
      description: 'Necessitam nova vistoria',
      sparkline: generateSparkline(metrics.vistoriasReprovadas),
    },
    {
      id: 'notificacoes',
      title: 'Notificações Enviadas',
      value: metrics.notificacoes,
      change: 3,
      trend: 'stable',
      icon: FileX,
      color: '#8b5cf6',
      bgColor: '#8b5cf615',
      description: 'Notificações de desocupação',
      sparkline: generateSparkline(metrics.notificacoes),
    },
    {
      id: 'judiciais',
      title: 'Processos Judiciais',
      value: metrics.processosJudiciais,
      change: -2,
      trend: 'down',
      icon: AlertCircle,
      color: '#ec4899',
      bgColor: '#ec489915',
      description: 'Em andamento judicial',
      sparkline: generateSparkline(metrics.processosJudiciais),
    },
    {
      id: 'vencidos',
      title: 'Prazos Vencidos',
      value: metrics.prazoVencido,
      change: metrics.prazoVencido > 0 ? 10 : 0,
      trend: metrics.prazoVencido > 0 ? 'up' : 'stable',
      icon: AlertCircle,
      color: '#dc2626',
      bgColor: '#dc262615',
      description: 'Contratos com prazo expirado',
      sparkline: generateSparkline(metrics.prazoVencido),
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel de Métricas</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visualização em tempo real do status dos processos
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Atualizado há {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </motion.div>

      <QuickSummary
        totalProcessos={metrics.totalProcessos}
        vistoriasHoje={metrics.vistoriasHoje}
        urgentes={metrics.prazoVencido}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>
    </div>
  )
}