'use client'

import { processos } from '@/lib/supabase'
import { ProcessoCompleto } from '@/types/database.types'
import { motion } from 'framer-motion'
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  FileX,
  Home,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardMetric {
  id: string
  title: string
  value: number
  target: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  color: string
  description: string
}

interface ComputedMetrics {
  totalProcessos: number
  notificacaoDesocupacao: number
  vistoriaAgendada: number
  vistoriaAprovada: number
  vistoriaReprovada: number
  processoJudicial: number
  contratosPrazoVencido: number
  contratosProximoVencimento: number
}

// Função para computar métricas baseadas nos contratos reais
const computeMetricsFromContracts = (processosData: ProcessoCompleto[]): ComputedMetrics => {
  const today = new Date()
  const proximosDias = new Date()
  proximosDias.setDate(today.getDate() + 7) // Próximos 7 dias

  const metrics = processosData.reduce(
    (acc, processo) => {
      acc.totalProcessos++

      // Contar por status
      switch (processo.status_name?.toLowerCase()) {
        case 'notificação de desocupação':
          acc.notificacaoDesocupacao++
          break
        case 'vistoria agendada':
          acc.vistoriaAgendada++
          break
        case 'vistoria aprovada':
          acc.vistoriaAprovada++
          break
        case 'vistoria reprovada':
          acc.vistoriaReprovada++
          break
        case 'processo judicial':
          acc.processoJudicial++
          break
      }

      // Verificar prazos dos contratos
      if (processo.data_final_desocupacao) {
        const dataFinal = new Date(processo.data_final_desocupacao)
        if (dataFinal < today) {
          acc.contratosPrazoVencido++
        } else if (dataFinal <= proximosDias) {
          acc.contratosProximoVencimento++
        }
      }

      return acc
    },
    {
      totalProcessos: 0,
      notificacaoDesocupacao: 0,
      vistoriaAgendada: 0,
      vistoriaAprovada: 0,
      vistoriaReprovada: 0,
      processoJudicial: 0,
      contratosPrazoVencido: 0,
      contratosProximoVencimento: 0,
    }
  )

  return metrics
}

// Função para calcular tendência baseada em dados históricos
const calculateTrend = (
  currentValue: number,
  totalProcessos: number
): { trend: 'up' | 'down' | 'stable'; trendValue: number } => {
  if (totalProcessos === 0) return { trend: 'stable', trendValue: 0 }

  const percentage = (currentValue / totalProcessos) * 100

  // Lógica simplificada de tendência baseada em percentuais esperados
  if (percentage > 50) return { trend: 'up', trendValue: Math.round(percentage - 50) }
  if (percentage < 20) return { trend: 'down', trendValue: Math.round(20 - percentage) }
  return { trend: 'stable', trendValue: 0 }
}

const MetricCard = ({ metric }: { metric: DashboardMetric }) => {
  const Icon = metric.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 space-y-3 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full" style={{ backgroundColor: `${metric.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: metric.color }} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</h3>
            <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {metric.trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : metric.trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <Activity className="w-4 h-4 text-gray-500" />
          )}
          <span
            className={`text-xs font-medium ${
              metric.trend === 'up'
                ? 'text-green-500'
                : metric.trend === 'down'
                  ? 'text-red-500'
                  : 'text-gray-500'
            }`}
          >
            {metric.trendValue > 0 ? '+' : ''}
            {metric.trendValue}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(metric.percentage, 100)}%`,
              backgroundColor: metric.color,
            }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span style={{ color: metric.color }}>{metric.percentage.toFixed(1)}%</span>
          <span className="text-gray-500">
            {metric.value} de {metric.target}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
      </div>
    </div>
  )
}

export default function VistoriasDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Carregar e computar dados reais dos contratos
  useEffect(() => {
    const loadAndComputeMetrics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Carregar todos os processos com dados completos
        const processosData = await processos.getAll()

        // Computar métricas baseadas nos contratos reais
        const computedMetrics = computeMetricsFromContracts(processosData)

        // Definir metas dinâmicas baseadas no volume total
        const totalProcessos = computedMetrics.totalProcessos
        const metaBase = Math.max(10, Math.ceil(totalProcessos * 0.3)) // 30% como meta base

        // Criar métricas formatadas
        const metricsData: DashboardMetric[] = [
          {
            id: 'total_processos',
            title: 'Total de Processos',
            value: computedMetrics.totalProcessos,
            target: Math.ceil(totalProcessos * 1.2), // Meta 20% maior
            percentage: totalProcessos > 0 ? 100 : 0,
            trend: 'stable',
            trendValue: 0,
            icon: Home,
            color: '#6366f1',
            description: 'Total de processos de desocupação ativos no sistema',
          },
          {
            id: 'notificacao_desocupacao',
            title: 'Notificações de Desocupação',
            value: computedMetrics.notificacaoDesocupacao,
            target: metaBase,
            percentage:
              metaBase > 0 ? (computedMetrics.notificacaoDesocupacao / metaBase) * 100 : 0,
            ...calculateTrend(computedMetrics.notificacaoDesocupacao, totalProcessos),
            icon: FileX,
            color: '#ef4444',
            description: 'Contratos com notificação de desocupação enviada',
          },
          {
            id: 'vistoria_agendada',
            title: 'Vistorias Agendadas',
            value: computedMetrics.vistoriaAgendada,
            target: metaBase,
            percentage: metaBase > 0 ? (computedMetrics.vistoriaAgendada / metaBase) * 100 : 0,
            ...calculateTrend(computedMetrics.vistoriaAgendada, totalProcessos),
            icon: Calendar,
            color: '#3b82f6',
            description: 'Contratos com vistoria agendada e pendente',
          },
          {
            id: 'vistoria_aprovada',
            title: 'Vistorias Aprovadas',
            value: computedMetrics.vistoriaAprovada,
            target: Math.ceil(metaBase * 0.8), // Meta menor para aprovadas
            percentage:
              metaBase > 0 ? (computedMetrics.vistoriaAprovada / (metaBase * 0.8)) * 100 : 0,
            ...calculateTrend(computedMetrics.vistoriaAprovada, totalProcessos),
            icon: CheckCircle,
            color: '#22c55e',
            description: 'Contratos com vistoria aprovada - imóvel em condições',
          },
          {
            id: 'vistoria_reprovada',
            title: 'Vistorias Reprovadas',
            value: computedMetrics.vistoriaReprovada,
            target: Math.ceil(metaBase * 0.3), // Meta menor para reprovadas
            percentage:
              metaBase > 0 ? (computedMetrics.vistoriaReprovada / (metaBase * 0.3)) * 100 : 0,
            trend: computedMetrics.vistoriaReprovada > metaBase * 0.2 ? 'up' : 'down',
            trendValue: Math.round((computedMetrics.vistoriaReprovada / totalProcessos) * 100 - 15),
            icon: XCircle,
            color: '#f59e0b',
            description: 'Contratos com vistoria reprovada - necessário nova vistoria',
          },
          {
            id: 'processo_judicial',
            title: 'Processos Judiciais',
            value: computedMetrics.processoJudicial,
            target: Math.ceil(metaBase * 0.2), // Meta baixa para processos judiciais
            percentage:
              metaBase > 0 ? (computedMetrics.processoJudicial / (metaBase * 0.2)) * 100 : 0,
            trend: computedMetrics.processoJudicial > metaBase * 0.1 ? 'up' : 'stable',
            trendValue:
              computedMetrics.processoJudicial > 0
                ? Math.round((computedMetrics.processoJudicial / totalProcessos) * 100)
                : 0,
            icon: Clock,
            color: '#8b5cf6',
            description: 'Contratos que evoluíram para processo judicial',
          },
        ]

        setMetrics(metricsData)
        setLastUpdate(new Date())
      } catch (err) {
        console.error('Erro ao carregar e computar dados do dashboard:', err)
        setError('Erro ao carregar dados dos contratos')
      } finally {
        setLoading(false)
      }
    }

    loadAndComputeMetrics()
  }, [])

  if (loading) {
    return (
      <div className="w-full space-y-6 mb-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Computando métricas dos contratos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full space-y-6 mb-8">
        <div className="flex items-center justify-center h-40">
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Dashboard de Vistorias</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Métricas computadas em tempo real baseadas nos contratos • Última atualização:{' '}
          {lastUpdate.toLocaleTimeString('pt-BR')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  )
}
