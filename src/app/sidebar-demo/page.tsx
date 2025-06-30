'use client'

import { DesocupacaoSidebar } from '@/components/features/desocupacao-sidebar'

export default function SidebarDemoPage() {
  return (
    <DesocupacaoSidebar>
      <div className="flex flex-1 p-8 min-h-screen">
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Demonstração - Sidebar</h1>
            <p className="text-muted-foreground">
              Sidebar animado com navegação completa para o sistema de desocupação.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Características do Sidebar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🖱️ Interação por Hover</h3>
                  <p className="text-sm text-muted-foreground">
                    No desktop, o sidebar expande automaticamente quando você passa o mouse sobre
                    ele.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📱 Responsivo</h3>
                  <p className="text-sm text-muted-foreground">
                    No mobile, o sidebar vira um menu hambúrguer com overlay completo.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">✨ Animações Suaves</h3>
                  <p className="text-sm text-muted-foreground">
                    Todas as transições são animadas com framer-motion.
                  </p>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">🎯 Estado Ativo</h3>
                  <p className="text-sm text-muted-foreground">
                    Links com destaque visual para indicar a página atual.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Links de Navegação</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📊 Gestão</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Dashboard</li>
                    <li>• Contratos</li>
                    <li>• Propriedades</li>
                    <li>• Inquilinos</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">📅 Ferramentas</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Calendário</li>
                    <li>• Processos Kanban</li>
                    <li>• Relatórios</li>
                    <li>• Buscar</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">⚙️ Sistema</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Configurações</li>
                    <li>• Demos</li>
                    <li>• Administrador</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Como Testar</h2>
              <div className="p-4 bg-muted rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>
                    <strong>Desktop:</strong> Passe o mouse sobre o sidebar para expandi-lo
                  </li>
                  <li>
                    <strong>Mobile:</strong> Clique no ícone do menu (☰) para abrir
                  </li>
                  <li>
                    <strong>Navegação:</strong> Clique nos links para navegar entre seções
                  </li>
                  <li>
                    <strong>Efeitos:</strong> Observe os efeitos de brilho em cada elemento
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DesocupacaoSidebar>
  )
}
