export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      documentos: {
        Row: {
          created_at: string | null
          id: string
          mime_type: string | null
          nome_arquivo: string
          processo_id: string
          tamanho_arquivo: number | null
          tipo_documento: string | null
          uploaded_by_id: string
          url_arquivo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mime_type?: string | null
          nome_arquivo: string
          processo_id: string
          tamanho_arquivo?: number | null
          tipo_documento?: string | null
          uploaded_by_id: string
          url_arquivo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mime_type?: string | null
          nome_arquivo?: string
          processo_id?: string
          tamanho_arquivo?: number | null
          tipo_documento?: string | null
          uploaded_by_id?: string
          url_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'documentos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'calendario_eventos'
            referencedColumns: ['evento_id']
          },
          {
            foreignKeyName: 'documentos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'documentos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_desocupacao'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'documentos_uploaded_by_id_fkey'
            columns: ['uploaded_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['created_by_id']
          },
          {
            foreignKeyName: 'documentos_uploaded_by_id_fkey'
            columns: ['uploaded_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['responsavel_id']
          },
          {
            foreignKeyName: 'documentos_uploaded_by_id_fkey'
            columns: ['uploaded_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['updated_by_id']
          },
          {
            foreignKeyName: 'documentos_uploaded_by_id_fkey'
            columns: ['uploaded_by_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      garantia_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      historico_processos: {
        Row: {
          acao: string
          created_at: string | null
          detalhes: Json | null
          id: string
          processo_id: string
          status_anterior_id: string | null
          status_novo_id: string | null
          user_id: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          detalhes?: Json | null
          id?: string
          processo_id: string
          status_anterior_id?: string | null
          status_novo_id?: string | null
          user_id: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          detalhes?: Json | null
          id?: string
          processo_id?: string
          status_anterior_id?: string | null
          status_novo_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'historico_processos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'calendario_eventos'
            referencedColumns: ['evento_id']
          },
          {
            foreignKeyName: 'historico_processos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_processos_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_desocupacao'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_processos_status_anterior_id_fkey'
            columns: ['status_anterior_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['status_id']
          },
          {
            foreignKeyName: 'historico_processos_status_anterior_id_fkey'
            columns: ['status_anterior_id']
            isOneToOne: false
            referencedRelation: 'status'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_processos_status_novo_id_fkey'
            columns: ['status_novo_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['status_id']
          },
          {
            foreignKeyName: 'historico_processos_status_novo_id_fkey'
            columns: ['status_novo_id']
            isOneToOne: false
            referencedRelation: 'status'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'historico_processos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['created_by_id']
          },
          {
            foreignKeyName: 'historico_processos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['responsavel_id']
          },
          {
            foreignKeyName: 'historico_processos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['updated_by_id']
          },
          {
            foreignKeyName: 'historico_processos_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      processos_desocupacao: {
        Row: {
          created_at: string | null
          created_by_id: string
          data_final_desocupacao: string
          data_notificacao: string
          data_vistoria: string
          end_at: string
          endereco: string
          garantia_type_id: string
          horario_vistoria: string
          id: string
          name: string
          nome_inquilino: string
          notas_vistoria: string | null
          numero_processo_judicial: string | null
          observacoes: string | null
          responsavel_id: string | null
          start_at: string
          status_id: string
          updated_at: string | null
          updated_by_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_id: string
          data_final_desocupacao: string
          data_notificacao: string
          data_vistoria: string
          end_at: string
          endereco: string
          garantia_type_id: string
          horario_vistoria: string
          id?: string
          name: string
          nome_inquilino: string
          notas_vistoria?: string | null
          numero_processo_judicial?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          start_at: string
          status_id: string
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_id?: string
          data_final_desocupacao?: string
          data_notificacao?: string
          data_vistoria?: string
          end_at?: string
          endereco?: string
          garantia_type_id?: string
          horario_vistoria?: string
          id?: string
          name?: string
          nome_inquilino?: string
          notas_vistoria?: string | null
          numero_processo_judicial?: string | null
          observacoes?: string | null
          responsavel_id?: string | null
          start_at?: string
          status_id?: string
          updated_at?: string | null
          updated_by_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'processos_desocupacao_created_by_id_fkey'
            columns: ['created_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['created_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_created_by_id_fkey'
            columns: ['created_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['responsavel_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_created_by_id_fkey'
            columns: ['created_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['updated_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_created_by_id_fkey'
            columns: ['created_by_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'processos_desocupacao_garantia_type_id_fkey'
            columns: ['garantia_type_id']
            isOneToOne: false
            referencedRelation: 'garantia_types'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'processos_desocupacao_garantia_type_id_fkey'
            columns: ['garantia_type_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['garantia_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['created_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['responsavel_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['updated_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_responsavel_id_fkey'
            columns: ['responsavel_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'processos_desocupacao_status_id_fkey'
            columns: ['status_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['status_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_status_id_fkey'
            columns: ['status_id']
            isOneToOne: false
            referencedRelation: 'status'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'processos_desocupacao_updated_by_id_fkey'
            columns: ['updated_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['created_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_updated_by_id_fkey'
            columns: ['updated_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['responsavel_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_updated_by_id_fkey'
            columns: ['updated_by_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['updated_by_id']
          },
          {
            foreignKeyName: 'processos_desocupacao_updated_by_id_fkey'
            columns: ['updated_by_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      status: {
        Row: {
          color: string
          created_at: string | null
          id: string
          name: string
          order_index: number
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          name: string
          order_index: number
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          image_url: string | null
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          image_url?: string | null
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          image_url?: string | null
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vistoria_items: {
        Row: {
          created_at: string | null
          id: string
          item_category: string | null
          item_name: string
          observacoes: string | null
          processo_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_category?: string | null
          item_name: string
          observacoes?: string | null
          processo_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          item_category?: string | null
          item_name?: string
          observacoes?: string | null
          processo_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'vistoria_items_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'calendario_eventos'
            referencedColumns: ['evento_id']
          },
          {
            foreignKeyName: 'vistoria_items_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_completos'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'vistoria_items_processo_id_fkey'
            columns: ['processo_id']
            isOneToOne: false
            referencedRelation: 'processos_desocupacao'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      calendario_eventos: {
        Row: {
          data_evento: string | null
          endereco: string | null
          evento_id: string | null
          evento_nome: string | null
          evento_titulo: string | null
          horario_evento: string | null
          nome_inquilino: string | null
          responsavel_name: string | null
          status_color: string | null
          status_name: string | null
        }
        Relationships: []
      }
      dashboard_metricas: {
        Row: {
          aprovadas_mes_atual: number | null
          notificacoes_desocupacao: number | null
          notificacoes_mes_atual: number | null
          processos_finalizados: number | null
          reprovadas_mes_atual: number | null
          total_processos: number | null
          vencendo_em_7_dias: number | null
          vistorias_agendadas: number | null
          vistorias_aprovadas: number | null
          vistorias_reprovadas: number | null
        }
        Relationships: []
      }
      processos_completos: {
        Row: {
          created_at: string | null
          created_by_id: string | null
          created_by_name: string | null
          data_final_desocupacao: string | null
          data_notificacao: string | null
          data_vistoria: string | null
          end_at: string | null
          endereco: string | null
          garantia_type_id: string | null
          garantia_type_name: string | null
          garantia_type_description: string | null
          horario_vistoria: string | null
          id: string | null
          name: string | null
          nome_inquilino: string | null
          notas_vistoria: string | null
          numero_processo_judicial: string | null
          observacoes: string | null
          responsavel_email: string | null
          responsavel_id: string | null
          responsavel_image: string | null
          responsavel_name: string | null
          start_at: string | null
          status_color: string | null
          status_id: string | null
          status_name: string | null
          status_order: number | null
          updated_at: string | null
          updated_by_id: string | null
          updated_by_name: string | null
          updated_by_email: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

// Tipos auxiliares para facilitar o desenvolvimento
export type ProcessoDesocupacao = Tables<'processos_desocupacao'>
export type ProcessoCompleto = Tables<'processos_completos'>
export type User = Tables<'users'>
export type Status = Tables<'status'>
export type GarantiaType = Tables<'garantia_types'>
export type VistoriaItem = Tables<'vistoria_items'>
export type Documento = Tables<'documentos'>
export type HistoricoProcesso = Tables<'historico_processos'>
export type CalendarioEvento = Tables<'calendario_eventos'>
export type DashboardMetricas = Tables<'dashboard_metricas'>

// Tipos para inserção
export type ProcessoDesocupacaoInsert = TablesInsert<'processos_desocupacao'>
export type UserInsert = TablesInsert<'users'>
export type StatusInsert = TablesInsert<'status'>
export type GarantiaTypeInsert = TablesInsert<'garantia_types'>
export type VistoriaItemInsert = TablesInsert<'vistoria_items'>
export type DocumentoInsert = TablesInsert<'documentos'>
export type HistoricoProcessoInsert = TablesInsert<'historico_processos'>

// Tipos para atualização
export type ProcessoDesocupacaoUpdate = TablesUpdate<'processos_desocupacao'>
export type UserUpdate = TablesUpdate<'users'>
export type StatusUpdate = TablesUpdate<'status'>
export type GarantiaTypeUpdate = TablesUpdate<'garantia_types'>
export type VistoriaItemUpdate = TablesUpdate<'vistoria_items'>
export type DocumentoUpdate = TablesUpdate<'documentos'>
export type HistoricoProcessoUpdate = TablesUpdate<'historico_processos'>
