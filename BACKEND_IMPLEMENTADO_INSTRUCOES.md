# 🚀 Backend Implementado - Instruções de Uso

## ✅ **STATUS: BACKEND 100% FUNCIONAL**

O backend da aplicação "Desocupação" foi **completamente implementado** no Supabase e está **pronto para uso**.

---

## 📊 **Resumo da Implementação**

### **✅ Estrutura de Dados Criada:**

- 7 tabelas principais
- 3 views otimizadas
- 7 usuários de exemplo
- 7 processos de exemplo com dados realistas
- Edge Function API completa

### **✅ Funcionalidades Implementadas:**

- Sistema de auditoria automática
- Triggers para logs de mudanças
- Row Level Security (RLS)
- Índices para performance
- API REST completa
- Tipos TypeScript gerados

---

## 🔧 **Como Usar o Backend**

### **1. Instalar Dependências**

```bash
npm install @supabase/supabase-js
```

✅ **Já adicionado ao package.json**

### **2. Configurar Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xowkmaawbqjxgtioaksa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvd2ttYWF3YnFqeGd0aW9ha3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExOTA0NjEsImV4cCI6MjA2Njc2NjQ2MX0.UAKKXm2-bJGXICBHcqgicK7uJO-0tCRCX8WF_GrPEWk
NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL=https://xowkmaawbqjxgtioaksa.supabase.co/functions/v1
```

### **3. Usar o Cliente Supabase**

✅ **Arquivo já criado:** `src/lib/supabase.ts`

```typescript
import { processos, dashboard, calendario } from '@/lib/supabase'

// Buscar todos os processos
const todosProcessos = await processos.getAll()

// Métricas do dashboard
const metricas = await dashboard.getMetricas()

// Eventos do calendário
const eventos = await calendario.getEventos()
```

---

## 📝 **Exemplos Práticos de Uso**

### **No Componente Kanban:**

```typescript
import { processos } from '@/lib/supabase'
import { ProcessoCompleto } from '@/types/database.types'

const KanbanComponent = () => {
  const [processosData, setProcessosData] = useState<ProcessoCompleto[]>([])

  useEffect(() => {
    const fetchProcessos = async () => {
      try {
        const data = await processos.getAll()
        setProcessosData(data || [])
      } catch (error) {
        console.error('Erro ao buscar processos:', error)
      }
    }

    fetchProcessos()
  }, [])

  // Usar processosData no lugar dos dados mockados...
}
```

### **No Dashboard de Métricas:**

```typescript
import { dashboard } from '@/lib/supabase'
import { DashboardMetricas } from '@/types/database.types'

const DashboardComponent = () => {
  const [metricas, setMetricas] = useState<DashboardMetricas | null>(null)

  useEffect(() => {
    const fetchMetricas = async () => {
      try {
        const data = await dashboard.getMetricas()
        setMetricas(data)
      } catch (error) {
        console.error('Erro ao buscar métricas:', error)
      }
    }

    fetchMetricas()
  }, [])

  // Usar dados reais no lugar dos valores hardcoded...
}
```

### **No Calendário:**

```typescript
import { calendario } from '@/lib/supabase'
import { CalendarioEvento } from '@/types/database.types'

const CalendarioComponent = () => {
  const [eventos, setEventos] = useState<CalendarioEvento[]>([])

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await calendario.getEventos()
        setEventos(data || [])
      } catch (error) {
        console.error('Erro ao buscar eventos:', error)
      }
    }

    fetchEventos()
  }, [])

  // Converter para formato do calendário...
}
```

---

## 🔄 **Substituir Dados Mockados**

### **1. Componentes para Atualizar:**

- `src/components/features/kanban-demo.tsx`
- `src/components/ui/vistorias-dashboard.tsx`
- `src/components/features/calendar-demo.tsx`

### **2. Substituir Arrays Estáticos:**

```typescript
// ❌ ANTES (dados mockados)
const exampleProcessos = [...]

// ✅ DEPOIS (dados do Supabase)
const [processosData, setProcessosData] = useState([])
useEffect(() => {
  processos.getAll().then(setProcessosData)
}, [])
```

---

## 🧪 **Testando o Backend**

### **Via Browser (Supabase Dashboard):**

1. Acesse: https://supabase.com/dashboard/project/xowkmaawbqjxgtioaksa
2. Vá para "Table Editor"
3. Visualize os dados em `processos_completos`

### **Via SQL (Query Editor):**

```sql
-- Ver todos os processos
SELECT * FROM processos_completos ORDER BY created_at DESC;

-- Ver métricas
SELECT * FROM dashboard_metricas;

-- Ver eventos do calendário
SELECT * FROM calendario_eventos;
```

### **Via API REST:**

```bash
# Testar API
curl https://xowkmaawbqjxgtioaksa.supabase.co/functions/v1/processos-api/processos

# Métricas
curl https://xowkmaawbqjxgtioaksa.supabase.co/functions/v1/processos-api/dashboard
```

---

## 📊 **Dados Atualmente no Sistema**

### **Status dos Processos:**

- 🔴 **2 Notificações de Desocupação**
- 🟡 **2 Vistorias Agendadas**
- 🟢 **1 Vistoria Aprovada**
- 🔴 **2 Vistorias Reprovadas**

### **Usuários Cadastrados:**

- Ana Paula (admin)
- Roberto Costa
- Fernanda Souza
- Lucas Miranda
- Marina Santos
- Carlos Roberto
- Paula Mendes

### **Próximas Vistorias:**

- 18/01/2025 - Apartamento 101 - Centro
- 22/01/2025 - Casa - Vila Madalena
- 28/01/2025 - Apartamento 205 - Moema
- 30/01/2025 - Cobertura - Itaim Bibi

---

## 🎯 **Next Steps - Conectar Frontend**

### **1. Atualizar Kanban Demo:**

```typescript
// Em src/components/features/kanban-demo.tsx
import { processos } from '@/lib/supabase'

// Substituir exampleProcessos por dados reais
const { data: processosReais, error } = await processos.getAll()
```

### **2. Atualizar Dashboard:**

```typescript
// Em src/components/ui/vistorias-dashboard.tsx
import { dashboard } from '@/lib/supabase'

// Substituir metrics array por dados reais
const { data: metricasReais, error } = await dashboard.getMetricas()
```

### **3. Atualizar Calendário:**

```typescript
// Em src/components/features/calendar-demo.tsx
import { calendario } from '@/lib/supabase'

// Substituir dummyEvents por dados reais
const { data: eventosReais, error } = await calendario.getEventos()
```

---

## 🔧 **Operações CRUD Disponíveis**

### **Criar Processo:**

```typescript
const novoProcesso = await processos.create({
  name: 'Apartamento Novo',
  nome_inquilino: 'João da Silva',
  endereco: 'Rua das Flores, 123',
  status_id: '...', // ID do status
  garantia_type_id: '...', // ID da garantia
  responsavel_id: '...', // ID do usuário
  created_by_id: '...', // ID do criador
  data_notificacao: '2025-01-15',
  data_final_desocupacao: '2025-03-15',
  data_vistoria: '2025-02-15',
  horario_vistoria: '14:00',
  start_at: '2025-01-15T00:00:00Z',
  end_at: '2025-03-15T23:59:59Z',
})
```

### **Atualizar Processo:**

```typescript
const processoAtualizado = await processos.update('processo-id', {
  status_id: 'novo-status-id',
  notas_vistoria: 'Vistoria realizada com sucesso',
})
```

### **Deletar Processo:**

```typescript
await processos.delete('processo-id')
```

---

## 🎉 **Conclusão**

**✅ Backend 100% implementado e funcional!**

O sistema está pronto para:

- Gerenciar processos de desocupação
- Exibir métricas em tempo real
- Agendar e visualizar vistorias
- Controlar status e fluxo de trabalho
- Manter histórico de mudanças
- API REST para integrações

**Próximo passo:** Conectar os componentes React com os dados reais do Supabase!
