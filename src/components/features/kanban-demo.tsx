'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { DocumentationStepperCompact } from '@/components/ui/documentation-stepper-compact'
import { Input } from '@/components/ui/input'
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kanban'
import { Label } from '@/components/ui/label'
import { useIsMounted } from '@/hooks/use-is-mounted'
import {
  garantias as garantiasApi,
  processos as processosApi,
  status as statusApi,
  users as usersApi,
} from '@/lib/supabase'
import { GarantiaType, ProcessoCompleto, Status, User } from '@/types/database.types'
import type { DragEndEvent } from '@dnd-kit/core'
import { addMonths, format, isValid } from 'date-fns'
import { Edit3, Eye, Filter, Plus, Search, X } from 'lucide-react'
import type { FC } from 'react'
import { useEffect, useMemo, useState } from 'react'

// Função para criar data segura no timezone brasileiro
const createBrazilianDate = (year: number, month: number, day: number): Date => {
  // Criar data no meio-dia para evitar problemas de timezone
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}

// Função auxiliar para adicionar dias de forma segura
function addDays(date: Date, days: number): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0)
  result.setDate(result.getDate() + days)
  return result
}

// Tipos específicos para processos de desocupação
type ContratoInfo = {
  nomeInquilino: string
  endereco: string
  garantia: string
  dataNotificacao: Date
  dataFinalDesocupacao: Date
  dataVistoria: Date
  horarioVistoria: string
}

export type ProcessoDesocupacao = {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: Status
  contrato: ContratoInfo
  responsavel?: {
    id: string
    image: string
    name: string
  }
  // Informações de criação/edição
  dataCriacao: Date
  dataUltimaEdicao?: Date
  criadoPor: string
  editadoPor?: string
}

// Função auxiliar para formatar datas com segurança
const formatDateSafe = (date: Date, formatStr: string): string => {
  try {
    if (!date || !isValid(date)) {
      // Para campos de input type="date", retornamos a data atual formatada
      if (formatStr === 'yyyy-MM-dd') {
        return format(new Date(), formatStr)
      }
      return ''
    }
    return format(date, formatStr)
  } catch {
    // Para campos de input type="date", retornamos a data atual formatada
    if (formatStr === 'yyyy-MM-dd') {
      return format(new Date(), formatStr)
    }
    return ''
  }
}

// Função auxiliar para criar datas com segurança
const createDateSafe = (dateString: string): Date => {
  if (!dateString) {
    return new Date()
  }
  // Criar data no meio-dia para evitar problemas de timezone
  const [year, month, day] = dateString.split('-').map(Number)
  return createBrazilianDate(year, month, day)
}

// Função auxiliar para formatar data para input (sempre retorna valor válido)
const formatDateForInput = (date: Date): string => {
  try {
    if (!date || !isValid(date)) {
      return format(new Date(), 'yyyy-MM-dd')
    }
    return format(date, 'yyyy-MM-dd')
  } catch {
    return format(new Date(), 'yyyy-MM-dd')
  }
}

// Função para converter ProcessoCompleto para ProcessoDesocupacao
const convertToProcessoDesocupacao = (processo: ProcessoCompleto): ProcessoDesocupacao => {
  return {
    id: processo.id || '',
    name: processo.name || '',
    startAt: new Date(processo.start_at || ''),
    endAt: new Date(processo.end_at || ''),
    status: {
      id: processo.status_id || '',
      name: processo.status_name || '',
      color: processo.status_color || '#000000',
      created_at: null,
      order_index: 0,
    },
    contrato: {
      nomeInquilino: processo.nome_inquilino || '',
      endereco: processo.endereco || '',
      garantia: processo.garantia_type_name || '',
      dataNotificacao: new Date(processo.data_notificacao || ''),
      dataFinalDesocupacao: new Date(processo.data_final_desocupacao || ''),
      dataVistoria: new Date(processo.data_vistoria || ''),
      horarioVistoria: processo.horario_vistoria || '',
    },
    responsavel: processo.responsavel_id
      ? {
          id: processo.responsavel_id,
          name: processo.responsavel_name || '',
          image:
            processo.responsavel_image ||
            'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=default',
        }
      : undefined,
    dataCriacao: new Date(processo.created_at || ''),
    dataUltimaEdicao: processo.updated_at ? new Date(processo.updated_at) : undefined,
    criadoPor: processo.created_by_name || '',
    editadoPor: processo.updated_by_name || undefined,
  }
}

// Componente para criar novo processo
const NovoProcessoDialog: FC<{
  onSave: (processo: ProcessoDesocupacao) => void
  statusList: Status[]
  usersList: User[]
  garantiasList: GarantiaType[]
}> = ({ onSave, statusList, usersList, garantiasList }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [novoProcesso, setNovoProcesso] = useState<Omit<ProcessoDesocupacao, 'id' | 'status'>>({
    name: '',
    startAt: new Date(),
    endAt: addMonths(new Date(), 2),
    contrato: {
      nomeInquilino: '',
      endereco: '',
      garantia: garantiasList[0]?.name || 'Fiador',
      dataNotificacao: new Date(),
      dataFinalDesocupacao: addMonths(new Date(), 2),
      dataVistoria: addDays(new Date(), 7),
      horarioVistoria: '14:00',
    },
    responsavel: usersList[0]
      ? {
          id: usersList[0].id,
          image:
            usersList[0].image_url ||
            'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=admin',
          name: usersList[0].name,
        }
      : undefined,
    dataCriacao: new Date(),
    criadoPor: usersList[0]?.name || 'Admin',
  })

  const handleSave = async () => {
    if (!novoProcesso.name || !novoProcesso.contrato.nomeInquilino) {
      alert('Por favor, preencha os campos obrigatórios')
      return
    }

    setLoading(true)
    try {
      const garantiaSelecionada = garantiasList.find(
        (g) => g.name === novoProcesso.contrato.garantia
      )
      const statusInicial = statusList.find((s) => s.name === 'Notificação de Desocupação')
      const usuarioResponsavel = usersList.find((u) => u.id === novoProcesso.responsavel?.id)

      if (!garantiaSelecionada || !statusInicial || !usuarioResponsavel) {
        throw new Error('Dados de referência não encontrados')
      }

      const novoProcessoData = {
        name: novoProcesso.name,
        nome_inquilino: novoProcesso.contrato.nomeInquilino,
        endereco: novoProcesso.contrato.endereco,
        garantia_type_id: garantiaSelecionada.id,
        status_id: statusInicial.id,
        responsavel_id: usuarioResponsavel.id,
        created_by_id: usuarioResponsavel.id,
        data_notificacao: format(novoProcesso.contrato.dataNotificacao, 'yyyy-MM-dd'),
        data_final_desocupacao: format(novoProcesso.contrato.dataFinalDesocupacao, 'yyyy-MM-dd'),
        data_vistoria: format(novoProcesso.contrato.dataVistoria, 'yyyy-MM-dd'),
        horario_vistoria: novoProcesso.contrato.horarioVistoria,
        start_at: novoProcesso.startAt.toISOString(),
        end_at: novoProcesso.endAt.toISOString(),
        observacoes: 'Processo criado via interface web',
      }

      const processoCriado = await processosApi.create(novoProcessoData)

      // Buscar o processo completo recém-criado
      const processoCompleto = await processosApi.getById(processoCriado.id)
      const processoConvertido = convertToProcessoDesocupacao(processoCompleto)

      onSave(processoConvertido)
      setOpen(false)

      // Reset form
      setNovoProcesso({
        name: '',
        startAt: new Date(),
        endAt: addMonths(new Date(), 2),
        contrato: {
          nomeInquilino: '',
          endereco: '',
          garantia: garantiasList[0]?.name || 'Fiador',
          dataNotificacao: new Date(),
          dataFinalDesocupacao: addMonths(new Date(), 2),
          dataVistoria: addDays(new Date(), 7),
          horarioVistoria: '14:00',
        },
        responsavel: usersList[0]
          ? {
              id: usersList[0].id,
              image:
                usersList[0].image_url ||
                'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=admin',
              name: usersList[0].name,
            }
          : undefined,
        dataCriacao: new Date(),
        criadoPor: usersList[0]?.name || 'Admin',
      })
    } catch (error) {
      console.error('Erro ao criar processo:', error)
      alert('Erro ao criar processo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Processo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Processo de Desocupação</DialogTitle>
          <DialogDescription>
            Preencha as informações para criar um novo processo de desocupação
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomeProcesso" className="text-right text-sm font-semibold">
              Nome do Processo *
            </Label>
            <Input
              id="nomeProcesso"
              value={novoProcesso.name}
              onChange={(e) => setNovoProcesso({ ...novoProcesso, name: e.target.value })}
              className="col-span-3"
              placeholder="ex: Apartamento 101 - Centro"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nomeInquilino" className="text-right text-sm font-semibold">
              Nome do Inquilino *
            </Label>
            <Input
              id="nomeInquilino"
              value={novoProcesso.contrato.nomeInquilino}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: { ...novoProcesso.contrato, nomeInquilino: e.target.value },
                })
              }
              className="col-span-3"
              placeholder="Nome completo do inquilino"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endereco" className="text-right text-sm font-semibold">
              Endereço
            </Label>
            <Input
              id="endereco"
              value={novoProcesso.contrato.endereco}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: { ...novoProcesso.contrato, endereco: e.target.value },
                })
              }
              className="col-span-3"
              placeholder="Endereço completo do imóvel"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="garantia" className="text-right text-sm font-semibold">
              Garantia
            </Label>
            <select
              value={novoProcesso.contrato.garantia}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: { ...novoProcesso.contrato, garantia: e.target.value },
                })
              }
              className="col-span-3 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {garantiasList.map((garantia) => (
                <option key={garantia.id} value={garantia.name}>
                  {garantia.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsavel" className="text-right text-sm font-semibold">
              Responsável
            </Label>
            <select
              value={novoProcesso.responsavel?.id || ''}
              onChange={(e) => {
                const user = usersList.find((u) => u.id === e.target.value)
                setNovoProcesso({
                  ...novoProcesso,
                  responsavel: user
                    ? {
                        id: user.id,
                        name: user.name,
                        image:
                          user.image_url ||
                          'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=default',
                      }
                    : undefined,
                })
              }}
              className="col-span-3 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {usersList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataNotificacao" className="text-right text-sm font-semibold">
              Data da Notificação
            </Label>
            <Input
              id="dataNotificacao"
              type="date"
              value={formatDateForInput(novoProcesso.contrato.dataNotificacao)}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: {
                    ...novoProcesso.contrato,
                    dataNotificacao: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataFinalDesocupacao" className="text-right text-sm font-semibold">
              Data Final Desocupação
            </Label>
            <Input
              id="dataFinalDesocupacao"
              type="date"
              value={formatDateForInput(novoProcesso.contrato.dataFinalDesocupacao)}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: {
                    ...novoProcesso.contrato,
                    dataFinalDesocupacao: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dataVistoria" className="text-right text-sm font-semibold">
              Data da Vistoria
            </Label>
            <Input
              id="dataVistoria"
              type="date"
              value={formatDateForInput(novoProcesso.contrato.dataVistoria)}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: {
                    ...novoProcesso.contrato,
                    dataVistoria: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="horarioVistoria" className="text-right text-sm font-semibold">
              Horário da Vistoria
            </Label>
            <Input
              id="horarioVistoria"
              type="time"
              value={novoProcesso.contrato.horarioVistoria}
              onChange={(e) =>
                setNovoProcesso({
                  ...novoProcesso,
                  contrato: { ...novoProcesso.contrato, horarioVistoria: e.target.value },
                })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Componente para editar contrato
const EditarContratoDialog: FC<{
  processo: ProcessoDesocupacao
  onSave: (processo: ProcessoDesocupacao) => void
  onDelete: (processoId: string) => void
}> = ({ processo, onSave, onDelete }) => {
  const [editedProcesso, setEditedProcesso] = useState<ProcessoDesocupacao>(processo)
  const [open, setOpen] = useState(false)

  const handleSave = () => {
    // Atualizar informações de edição
    const processoAtualizado = {
      ...editedProcesso,
      dataUltimaEdicao: new Date(),
      editadoPor: 'Admin', // Em uma aplicação real, seria o usuário atual
    }
    onSave(processoAtualizado)
    setOpen(false)
  }

  const handleDelete = () => {
    if (confirm('Tem certeza de que deseja excluir este processo de desocupação?')) {
      onDelete(processo.id)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 relative z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Contrato</DialogTitle>
          <DialogDescription>Modifique as informações do processo de desocupação</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editNomeProcesso" className="text-right text-sm font-semibold">
              Nome do Processo
            </Label>
            <Input
              id="editNomeProcesso"
              value={editedProcesso.name}
              onChange={(e) => setEditedProcesso({ ...editedProcesso, name: e.target.value })}
              className="col-span-3"
              placeholder="ex: Apartamento 101 - Centro"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editNomeInquilino" className="text-right text-sm font-semibold">
              Nome do Inquilino
            </Label>
            <Input
              id="editNomeInquilino"
              value={editedProcesso.contrato.nomeInquilino}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: { ...editedProcesso.contrato, nomeInquilino: e.target.value },
                })
              }
              className="col-span-3"
              placeholder="Nome completo do inquilino"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editEndereco" className="text-right text-sm font-semibold">
              Endereço
            </Label>
            <Input
              id="editEndereco"
              value={editedProcesso.contrato.endereco}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: { ...editedProcesso.contrato, endereco: e.target.value },
                })
              }
              className="col-span-3"
              placeholder="Endereço completo do imóvel"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editGarantia" className="text-right text-sm font-semibold">
              Garantia
            </Label>
            <select
              value={editedProcesso.contrato.garantia}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: { ...editedProcesso.contrato, garantia: e.target.value },
                })
              }
              className="col-span-3 flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {garantiaOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editDataNotificacao" className="text-right text-sm font-semibold">
              Data da Notificação
            </Label>
            <Input
              id="editDataNotificacao"
              type="date"
              value={formatDateForInput(editedProcesso.contrato.dataNotificacao)}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: {
                    ...editedProcesso.contrato,
                    dataNotificacao: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editDataFinalDesocupacao" className="text-right text-sm font-semibold">
              Data Final Desocupação
            </Label>
            <Input
              id="editDataFinalDesocupacao"
              type="date"
              value={formatDateForInput(editedProcesso.contrato.dataFinalDesocupacao)}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: {
                    ...editedProcesso.contrato,
                    dataFinalDesocupacao: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editDataVistoria" className="text-right text-sm font-semibold">
              Data da Vistoria
            </Label>
            <Input
              id="editDataVistoria"
              type="date"
              value={formatDateForInput(editedProcesso.contrato.dataVistoria)}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: {
                    ...editedProcesso.contrato,
                    dataVistoria: createDateSafe(e.target.value),
                  },
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="editHorarioVistoria" className="text-right text-sm font-semibold">
              Horário da Vistoria
            </Label>
            <Input
              id="editHorarioVistoria"
              value={editedProcesso.contrato.horarioVistoria}
              onChange={(e) =>
                setEditedProcesso({
                  ...editedProcesso,
                  contrato: { ...editedProcesso.contrato, horarioVistoria: e.target.value },
                })
              }
              className="col-span-3"
              placeholder="ex: 14:00"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Excluir Processo
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Card minimalista com todas as informações visíveis
const KanbanCardWithDetails: FC<{
  processo: ProcessoDesocupacao
  index: number
  statusName: string
  onSave: (processo: ProcessoDesocupacao) => void
  onDelete: (processoId: string) => void
}> = ({ processo, index, statusName, onSave, onDelete }) => {
  return (
    <KanbanCard id={processo.id} name={processo.name} parent={statusName} index={index}>
      <div className="p-3 space-y-3">
        {/* Header simples */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-foreground truncate">{processo.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{processo.contrato.nomeInquilino}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <VisualizarDetalhesDialog processo={processo} />
            <EditarContratoDialog processo={processo} onSave={onSave} onDelete={onDelete} />
          </div>
        </div>

        {/* Informações essenciais em formato compacto */}
        <div className="space-y-2 text-xs">
          {/* Endereço */}
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground">📍</span>
            <span className="flex-1 leading-4">{processo.contrato.endereco}</span>
          </div>

          {/* Datas importantes */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 font-medium">Notificação</p>
              <p className="text-foreground">
                {formatDateSafe(processo.contrato.dataNotificacao, 'dd/MM')}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 font-medium">Vistoria</p>
              <p className="text-foreground">
                {formatDateSafe(processo.contrato.dataVistoria, 'dd/MM')}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {processo.contrato.horarioVistoria}
              </p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/30 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400 font-medium">Prazo</p>
              <p className="text-foreground">
                {formatDateSafe(processo.contrato.dataFinalDesocupacao, 'dd/MM')}
              </p>
            </div>
          </div>

          {/* Garantia compacta */}
          <div className="bg-slate-50 dark:bg-slate-900/30 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 font-medium">Garantia</p>
            <p className="text-foreground truncate">{processo.contrato.garantia}</p>
          </div>
        </div>

        {/* Documentação - DocumentationStepper */}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
          <DocumentationStepperCompact
            processoId={processo.id}
            onStatusChange={(statuses) => {
              console.log(`Documentos atualizados para processo ${processo.id}:`, statuses)
              // Status agora são automaticamente salvos no localStorage
              // e serão persistidos no Supabase quando tivermos acesso
            }}
          />
        </div>
      </div>
    </KanbanCard>
  )
}

// Componente para visualizar detalhes do contrato
const VisualizarDetalhesDialog: FC<{
  processo: ProcessoDesocupacao
}> = ({ processo }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 relative z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Contrato</DialogTitle>
          <DialogDescription>Informações completas do processo de desocupação</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Informações Gerais */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Informações Gerais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">
                  Nome do Processo
                </Label>
                <p className="text-sm text-foreground mt-1">{processo.name}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Status Atual</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: processo.status.color }}
                  />
                  <p className="text-sm text-foreground">{processo.status.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Informações do Inquilino */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Inquilino</h3>
            <div className="space-y-2">
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">Nome Completo</Label>
                <p className="text-sm text-foreground mt-1">{processo.contrato.nomeInquilino}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">
                  Endereço do Imóvel
                </Label>
                <p className="text-sm text-foreground mt-1">{processo.contrato.endereco}</p>
              </div>
              <div>
                <Label className="text-sm font-semibold text-muted-foreground">
                  Tipo de Garantia
                </Label>
                <p className="text-sm text-foreground mt-1">{processo.contrato.garantia}</p>
              </div>
            </div>
          </div>

          {/* Datas Importantes */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Cronograma</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Data da Notificação
                </Label>
                <p className="text-sm text-foreground mt-1">
                  {formatDateSafe(processo.contrato.dataNotificacao, 'dd/MM/yyyy')}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Data da Vistoria
                </Label>
                <p className="text-sm text-foreground mt-1">
                  {formatDateSafe(processo.contrato.dataVistoria, 'dd/MM/yyyy')} às{' '}
                  {processo.contrato.horarioVistoria}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 md:col-span-2">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Prazo Final para Desocupação
                </Label>
                <p className="text-sm text-foreground mt-1">
                  {formatDateSafe(processo.contrato.dataFinalDesocupacao, 'dd/MM/yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const garantiaOptions = ['Caução', 'Fiador', 'Seguro Fiança', 'Título de Capitalização']

// Tipos para filtros
type FiltrosProcesso = {
  busca: string
  status: string[]
  garantias: string[]
  responsaveis: string[]
}

// Componente de filtros e busca
const FiltrosBusca: FC<{
  filtros: FiltrosProcesso
  onFiltrosChange: (filtros: FiltrosProcesso) => void
  statusList: Status[]
  garantiasList: GarantiaType[]
  usersList: User[]
  totalProcessos: number
  processosFiltrados: number
}> = ({
  filtros,
  onFiltrosChange,
  statusList,
  garantiasList,
  usersList,
  totalProcessos,
  processosFiltrados,
}) => {
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }

  const handleStatusChange = (statusName: string, checked: boolean) => {
    const novosStatus = checked
      ? [...filtros.status, statusName]
      : filtros.status.filter((s) => s !== statusName)
    onFiltrosChange({ ...filtros, status: novosStatus })
  }

  const handleGarantiaChange = (garantiaName: string, checked: boolean) => {
    const novasGarantias = checked
      ? [...filtros.garantias, garantiaName]
      : filtros.garantias.filter((g) => g !== garantiaName)
    onFiltrosChange({ ...filtros, garantias: novasGarantias })
  }

  const handleResponsavelChange = (responsavelId: string, checked: boolean) => {
    const novosResponsaveis = checked
      ? [...filtros.responsaveis, responsavelId]
      : filtros.responsaveis.filter((r) => r !== responsavelId)
    onFiltrosChange({ ...filtros, responsaveis: novosResponsaveis })
  }

  const limparFiltros = () => {
    onFiltrosChange({
      busca: '',
      status: [],
      garantias: [],
      responsaveis: [],
    })
    setMostrarFiltros(false)
  }

  const temFiltrosAtivos =
    filtros.busca ||
    filtros.status.length > 0 ||
    filtros.garantias.length > 0 ||
    filtros.responsaveis.length > 0

  return (
    <div className="space-y-4 mb-6 border rounded-lg p-4 bg-card">
      {/* Linha superior: Busca e botão de filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Barra de busca */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, inquilino, endereço ou processo judicial..."
            value={filtros.busca}
            onChange={(e) => handleBuscaChange(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Botões de controle */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant={mostrarFiltros ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {temFiltrosAtivos && (
              <span className="bg-primary-foreground text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {filtros.status.length + filtros.garantias.length + filtros.responsaveis.length}
              </span>
            )}
          </Button>

          {temFiltrosAtivos && (
            <Button variant="ghost" size="sm" onClick={limparFiltros} className="gap-1">
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Exibindo {processosFiltrados} de {totalProcessos} processos
          {temFiltrosAtivos && ' (com filtros aplicados)'}
        </span>
      </div>

      {/* Painel de filtros expandível */}
      {mostrarFiltros && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          {/* Filtro por Status */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Status</h4>
            <div className="space-y-2">
              {statusList.map((status) => (
                <label key={status.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.status.includes(status.name)}
                    onChange={(e) => handleStatusChange(status.name, e.target.checked)}
                    className="rounded"
                  />
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <span>{status.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro por Garantia */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Tipo de Garantia</h4>
            <div className="space-y-2">
              {garantiasList.map((garantia) => (
                <label key={garantia.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.garantias.includes(garantia.name)}
                    onChange={(e) => handleGarantiaChange(garantia.name, e.target.checked)}
                    className="rounded"
                  />
                  <span>{garantia.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filtro por Responsável */}
          <div>
            <h4 className="font-medium mb-3 text-sm">Responsável</h4>
            <div className="space-y-2">
              {usersList.map((user) => (
                <label key={user.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.responsaveis.includes(user.id)}
                    onChange={(e) => handleResponsavelChange(user.id, e.target.checked)}
                    className="rounded"
                  />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const KanbanExample: FC<{
  onProcessosChange?: (processos: ProcessoDesocupacao[]) => void
}> = ({ onProcessosChange }) => {
  const [processos, setProcessos] = useState<ProcessoDesocupacao[]>([])
  const [statusList, setStatusList] = useState<Status[]>([])
  const [usersList, setUsersList] = useState<User[]>([])
  const [garantiasList, setGarantiasList] = useState<GarantiaType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<FiltrosProcesso>({
    busca: '',
    status: [],
    garantias: [],
    responsaveis: [],
  })
  const isMounted = useIsMounted()

  // Função para filtrar processos baseado nos filtros aplicados
  const processosFiltrados = useMemo(() => {
    return processos.filter((processo) => {
      // Filtro por busca (nome, inquilino, endereço, processo judicial)
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase()
        const matchBusca =
          processo.name.toLowerCase().includes(busca) ||
          processo.contrato.nomeInquilino.toLowerCase().includes(busca) ||
          processo.contrato.endereco.toLowerCase().includes(busca) ||
          (processo.id && processo.id.toLowerCase().includes(busca))

        if (!matchBusca) return false
      }

      // Filtro por status
      if (filtros.status.length > 0) {
        if (!filtros.status.includes(processo.status.name)) return false
      }

      // Filtro por garantia
      if (filtros.garantias.length > 0) {
        if (!filtros.garantias.includes(processo.contrato.garantia)) return false
      }

      // Filtro por responsável
      if (filtros.responsaveis.length > 0) {
        if (!processo.responsavel || !filtros.responsaveis.includes(processo.responsavel.id))
          return false
      }

      return true
    })
  }, [processos, filtros])

  // Carregar dados reais do Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Carregar dados em paralelo
        const [processosData, statusData, usersData, garantiasData] = await Promise.all([
          processosApi.getAll(),
          statusApi.getAll(),
          usersApi.getAll(),
          garantiasApi.getAll(),
        ])

        // Converter processos para o formato do componente
        const processosConvertidos = processosData.map(convertToProcessoDesocupacao)

        setProcessos(processosConvertidos)
        setStatusList(statusData)
        setUsersList(usersData)
        setGarantiasList(garantiasData)

        // Notificar mudanças iniciais
        onProcessosChange?.(processosConvertidos)
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao carregar dados. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [onProcessosChange])

  // Atualizar o estado e notificar mudanças
  const updateProcessos = (novosProcessos: ProcessoDesocupacao[]) => {
    setProcessos(novosProcessos)
    onProcessosChange?.(novosProcessos)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      return
    }

    const statusObj = statusList.find((status) => status.name === over.id)

    if (!statusObj) {
      return
    }

    // Encontrar o processo que está sendo movido
    const processoAtual = processos.find((p) => p.id === active.id)
    if (!processoAtual) {
      return
    }

    try {
      // Atualizar no banco de dados
      await processosApi.update(processoAtual.id, {
        status_id: statusObj.id,
        updated_by_id: usersList[0]?.id || processoAtual.responsavel?.id || '1',
      })

      // Atualizar estado local
      const novosProcessos = processos.map((p) => {
        if (p.id === active.id) {
          return {
            ...p,
            status: statusObj,
            dataUltimaEdicao: new Date(),
            editadoPor: usersList[0]?.name || 'Admin',
          }
        }
        return p
      })

      updateProcessos(novosProcessos)
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status do processo')
    }
  }

  const handleSaveProcesso = async (updatedProcesso: ProcessoDesocupacao) => {
    try {
      const garantiaSelecionada = garantiasList.find(
        (g) => g.name === updatedProcesso.contrato.garantia
      )
      const responsavel = usersList.find((u) => u.id === updatedProcesso.responsavel?.id)

      if (!garantiaSelecionada) {
        throw new Error('Tipo de garantia não encontrado')
      }

      // Atualizar no banco de dados
      await processosApi.update(updatedProcesso.id, {
        name: updatedProcesso.name,
        nome_inquilino: updatedProcesso.contrato.nomeInquilino,
        endereco: updatedProcesso.contrato.endereco,
        garantia_type_id: garantiaSelecionada.id,
        responsavel_id: responsavel?.id,
        updated_by_id: usersList[0]?.id || responsavel?.id || '1',
        data_notificacao: format(updatedProcesso.contrato.dataNotificacao, 'yyyy-MM-dd'),
        data_final_desocupacao: format(updatedProcesso.contrato.dataFinalDesocupacao, 'yyyy-MM-dd'),
        data_vistoria: format(updatedProcesso.contrato.dataVistoria, 'yyyy-MM-dd'),
        horario_vistoria: updatedProcesso.contrato.horarioVistoria,
        start_at: updatedProcesso.startAt.toISOString(),
        end_at: updatedProcesso.endAt.toISOString(),
      })

      // Atualizar estado local
      const novosProcessos = processos.map((p) =>
        p.id === updatedProcesso.id
          ? {
              ...updatedProcesso,
              dataUltimaEdicao: new Date(),
              editadoPor: usersList[0]?.name || 'Admin',
            }
          : p
      )
      updateProcessos(novosProcessos)
    } catch (error) {
      console.error('Erro ao salvar processo:', error)
      alert('Erro ao salvar processo')
    }
  }

  const handleDeleteProcesso = async (processoId: string) => {
    try {
      await processosApi.delete(processoId)
      const novosProcessos = processos.filter((p) => p.id !== processoId)
      updateProcessos(novosProcessos)
    } catch (error) {
      console.error('Erro ao deletar processo:', error)
      alert('Erro ao deletar processo')
    }
  }

  const handleNovoProcesso = (novoProcesso: ProcessoDesocupacao) => {
    const novosProcessos = [...processos, novoProcesso]
    updateProcessos(novosProcessos)
  }

  // Renderizar loading enquanto carrega dados
  if (loading || !isMounted) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Carregando processos...</p>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar erro se houver
  if (error) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Header expandido */}
      <div className="flex-shrink-0 flex justify-between items-center mb-4 p-1">
        <div>
          <h3 className="text-lg font-semibold">Processos de Desocupação</h3>
          <p className="text-sm text-muted-foreground">
            Arraste os cards entre as colunas para alterar o status
          </p>
        </div>
        <NovoProcessoDialog
          onSave={handleNovoProcesso}
          statusList={statusList}
          usersList={usersList}
          garantiasList={garantiasList}
        />
      </div>

      {/* Componente de filtros e busca */}
      <FiltrosBusca
        filtros={filtros}
        onFiltrosChange={setFiltros}
        statusList={statusList}
        garantiasList={garantiasList}
        usersList={usersList}
        totalProcessos={processos.length}
        processosFiltrados={processosFiltrados.length}
      />

      {/* Container do Kanban */}
      <div className="w-full">
        <div className="overflow-x-auto p-2">
          <div className="min-w-max">
            <KanbanProvider onDragEnd={handleDragEnd} className="min-w-max">
              {statusList.map((status) => (
                <KanbanBoard key={status.name} id={status.name} className="flex flex-col w-[350px]">
                  <KanbanHeader name={status.name} color={status.color} />
                  <KanbanCards className="p-3 space-y-3">
                    {processosFiltrados
                      .filter((processo) => processo.status.name === status.name)
                      .map((processo, index) => (
                        <KanbanCardWithDetails
                          key={processo.id}
                          processo={processo}
                          index={index}
                          statusName={status.name}
                          onSave={handleSaveProcesso}
                          onDelete={handleDeleteProcesso}
                        />
                      ))}
                  </KanbanCards>
                </KanbanBoard>
              ))}
            </KanbanProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export { KanbanExample }
