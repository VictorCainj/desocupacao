/**
 * Sistema de armazenamento de status dos documentos
 * Atualmente usa localStorage, mas está preparado para migração ao Supabase
 */

export type DocumentoStatus = {
  DAEV: boolean
  CPFL: boolean
  GÁS: boolean
  CND: boolean
}

export type DocumentoStatusUpdate = {
  processoId: string
  status: DocumentoStatus
  updatedAt: string
  updatedBy?: string
}

const STORAGE_KEY = 'desocupacao_documentos_status'

/**
 * Classe para gerenciar o armazenamento dos status dos documentos
 */
class DocumentosStorage {
  private storage: Map<string, DocumentoStatusUpdate> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Carrega dados do localStorage
   */
  private loadFromStorage(): void {
    try {
      // Verificar se estamos no navegador (não no servidor)
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(STORAGE_KEY)
        if (data) {
          const parsed = JSON.parse(data)
          this.storage = new Map(Object.entries(parsed))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error)
      this.storage = new Map()
    }
  }

  /**
   * Salva dados no localStorage
   */
  private saveToStorage(): void {
    try {
      // Verificar se estamos no navegador (não no servidor)
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = Object.fromEntries(this.storage)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error)
    }
  }

  /**
   * Obter status dos documentos para um processo
   */
  getStatus(processoId: string): DocumentoStatus {
    const stored = this.storage.get(processoId)
    if (stored) {
      return stored.status
    }

    // Status padrão quando não existe
    return {
      DAEV: false,
      CPFL: false,
      GÁS: false,
      CND: false,
    }
  }

  /**
   * Atualizar status dos documentos para um processo
   */
  setStatus(processoId: string, status: DocumentoStatus, updatedBy?: string): void {
    const update: DocumentoStatusUpdate = {
      processoId,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy,
    }

    this.storage.set(processoId, update)
    this.saveToStorage()

    // Log para debug
    console.log(`Status dos documentos atualizado para processo ${processoId}:`, status)
  }

  /**
   * Obter todos os status armazenados
   */
  getAllStatus(): Map<string, DocumentoStatusUpdate> {
    return new Map(this.storage)
  }

  /**
   * Limpar todos os dados (útil para desenvolvimento)
   */
  clearAll(): void {
    this.storage.clear()
    // Verificar se estamos no navegador (não no servidor)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  /**
   * Exportar dados para migração futura ao Supabase
   */
  exportData(): DocumentoStatusUpdate[] {
    return Array.from(this.storage.values())
  }

  /**
   * Importar dados (útil para migração do Supabase)
   */
  importData(data: DocumentoStatusUpdate[]): void {
    this.storage.clear()
    data.forEach((item) => {
      this.storage.set(item.processoId, item)
    })
    this.saveToStorage()
  }

  /**
   * Obter estatísticas dos documentos
   */
  getStatistics(): {
    totalProcessos: number
    processosComTodosDocumentos: number
    processosComAlgunsDocumentos: number
    processosSemDocumentos: number
    percentualCompleto: number
  } {
    const total = this.storage.size
    let todosCompletos = 0
    let algumCompleto = 0
    let nenhumCompleto = 0

    this.storage.forEach((item) => {
      const documentosEntregues = Object.values(item.status).filter(Boolean).length
      if (documentosEntregues === 4) {
        todosCompletos++
      } else if (documentosEntregues > 0) {
        algumCompleto++
      } else {
        nenhumCompleto++
      }
    })

    return {
      totalProcessos: total,
      processosComTodosDocumentos: todosCompletos,
      processosComAlgunsDocumentos: algumCompleto,
      processosSemDocumentos: nenhumCompleto,
      percentualCompleto: total > 0 ? (todosCompletos / total) * 100 : 0,
    }
  }
}

// Instância singleton
const documentosStorage = new DocumentosStorage()

// API pública
export const documentosApi = {
  /**
   * Obter status dos documentos para um processo
   */
  getStatus: (processoId: string): DocumentoStatus => {
    return documentosStorage.getStatus(processoId)
  },

  /**
   * Atualizar status dos documentos para um processo
   */
  setStatus: (processoId: string, status: DocumentoStatus, updatedBy?: string): void => {
    documentosStorage.setStatus(processoId, status, updatedBy)
  },

  /**
   * Obter estatísticas
   */
  getStatistics: () => {
    return documentosStorage.getStatistics()
  },

  /**
   * Exportar dados (para debug ou migração)
   */
  exportData: () => {
    return documentosStorage.exportData()
  },

  /**
   * Limpar todos os dados (para desenvolvimento)
   */
  clearAll: () => {
    documentosStorage.clearAll()
  },

  /**
   * Importar dados (para testes ou migração)
   */
  importData: (data: DocumentoStatusUpdate[]) => {
    documentosStorage.importData(data)
  },
}

export default documentosApi
