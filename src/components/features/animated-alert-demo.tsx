'use client'

import AnimatedAlert from '@/components/ui/animated-alert'
import { Button } from '@/components/ui/button'

import { useState } from 'react'

export default function AnimatedAlertDemo() {
  const [alerts, setAlerts] = useState<
    Array<{
      id: number
      type: 'success' | 'error' | 'warning' | 'info'
      message: string
    }>
  >([])

  const addAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const newAlert = {
      id: Date.now(),
      type,
      message,
    }
    setAlerts((prev) => [...prev, newAlert])

    // Remove o alert após 5 segundos
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== newAlert.id))
    }, 5000)
  }

  const removeAlert = (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Demonstração - Alerts Animados</h1>
        <p className="text-muted-foreground">
          Clique nos botões para ver diferentes tipos de alerts com animações.
        </p>
      </div>

      {/* Exemplos Estáticos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Exemplos Estáticos</h2>
        <div className="flex flex-col gap-4">
          <AnimatedAlert type="success" message="Operação realizada com sucesso!" />
          <AnimatedAlert type="error" message="Erro ao processar a solicitação." />
          <AnimatedAlert type="warning" message="Atenção: Verifique os dados inseridos." />
          <AnimatedAlert type="info" message="Informação: Esta é uma mensagem informativa." />
        </div>
      </div>

      {/* Controles Interativos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Controles Interativos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => addAlert('success', 'Processo salvo com sucesso!')}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Sucesso
          </Button>

          <Button
            onClick={() => addAlert('error', 'Falha na conexão com o servidor!')}
            variant="destructive"
            className="w-full"
          >
            Erro
          </Button>

          <Button
            onClick={() => addAlert('warning', 'Campos obrigatórios não preenchidos!')}
            className="w-full bg-yellow-600 hover:bg-yellow-700"
          >
            Aviso
          </Button>

          <Button
            onClick={() => addAlert('info', 'Nova funcionalidade disponível!')}
            variant="outline"
            className="w-full"
          >
            Info
          </Button>
        </div>
      </div>

      {/* Área de Alerts Dinâmicos */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alerts Dinâmicos</h2>
        <p className="text-sm text-muted-foreground">
          Os alerts abaixo aparecem quando você clica nos botões e desaparecem automaticamente após
          5 segundos. Clique em um alert para removê-lo manualmente.
        </p>
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
          {alerts.map((alert) => (
            <AnimatedAlert
              key={alert.id}
              type={alert.type}
              message={alert.message}
              onClick={() => removeAlert(alert.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
