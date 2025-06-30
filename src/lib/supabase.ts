import { Database } from '@/types/database.types'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xowkmaawbqjxgtioaksa.supabase.co'
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2ttYWF3YnFqeGd0aW9ha3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTA0NjEsImV4cCI6MjA2Njc2NjQ2MX0.UAKKXm2-bJGXICBHcqgicK7uJO-0tCRCX8WF_GrPEWk'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Funções auxiliares para o frontend
export const processos = {
  // Buscar todos os processos completos
  async getAll() {
    const { data, error } = await supabase
      .from('processos_completos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Buscar processo por ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('processos_completos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // Criar novo processo
  async create(processo: Database['public']['Tables']['processos_desocupacao']['Insert']) {
    const { data, error } = await supabase
      .from('processos_desocupacao')
      .insert([processo])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Atualizar processo
  async update(
    id: string,
    updates: Database['public']['Tables']['processos_desocupacao']['Update']
  ) {
    const { data, error } = await supabase
      .from('processos_desocupacao')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Deletar processo
  async delete(id: string) {
    const { error } = await supabase.from('processos_desocupacao').delete().eq('id', id)

    if (error) throw error
  },
}

export const dashboard = {
  // Buscar métricas do dashboard
  async getMetricas() {
    const { data, error } = await supabase.from('dashboard_metricas').select('*').single()

    if (error) throw error
    return data
  },
}

export const calendario = {
  // Buscar eventos do calendário
  async getEventos() {
    const { data, error } = await supabase
      .from('calendario_eventos')
      .select('*')
      .order('data_evento', { ascending: true })

    if (error) throw error
    return data
  },
}

export const users = {
  // Buscar todos os usuários
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },
}

export const status = {
  // Buscar todos os status
  async getAll() {
    const { data, error } = await supabase
      .from('status')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) throw error
    return data
  },
}

export const garantias = {
  // Buscar tipos de garantia
  async getAll() {
    const { data, error } = await supabase
      .from('garantia_types')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  },
}
