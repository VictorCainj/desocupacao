# 🚀 Como Usar o Dashboard Calendário

## 📍 Acesso ao Dashboard

### **URL Principal**

```
http://localhost:3000/inicio
```

_Nota: Se a porta 3000 estiver ocupada, o Next.js automaticamente usará uma porta disponível (ex: 3004)_

## ⚡ Comandos de Desenvolvimento

### **Iniciar Servidor**

```bash
npm run dev
```

- Inicia com **Turbopack** habilitado (mais rápido)
- Ready em ~2-3 segundos
- Hot reload automático

### **Build de Produção**

```bash
npm run build
npm start
```

### **Verificações de Qualidade**

```bash
npm run lint        # ESLint check
npm run type-check  # TypeScript check
npm run format      # Prettier formatting
```

## 🎯 Funcionalidades do Calendário

### **Navegação**

- **←** Mês anterior
- **Today** Voltar para mês atual
- **→** Próximo mês

### **Interação**

- **Click no dia**: Seleciona o dia (destaque visual)
- **Hover nos eventos**: Preview das informações
- **Responsivo**: Adapta automaticamente ao tamanho da tela

### **Eventos Visíveis**

- **Desktop**: Cards completos com nome e horário
- **Mobile**: Indicadores pontuais coloridos
- **Múltiplos eventos**: Contador "+X more"

## 📱 Layout Responsivo

### **Desktop (768px+)**

```
┌─────────────────────────────────────┐
│ Header: Dashboard                   │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Calendar Controls               │ │
│ ├─────┬─────┬─────┬─────┬─────────┤ │
│ │ Sun │ Mon │ Tue │ Wed │ ...     │ │
│ ├─────┼─────┼─────┼─────┼─────────┤ │
│ │  1  │  2  │  3  │  4  │ ...     │ │
│ │     │Event│     │     │         │ │
│ └─────┴─────┴─────┴─────┴─────────┘ │
└─────────────────────────────────────┘
```

### **Mobile (<768px)**

```
┌─────────────┐
│ Dashboard   │
├─────────────┤
│ Calendar    │
│ Controls    │
├─────────────┤
│ S M T W T F S│
├─────────────┤
│ 1 2 3 4 5 6 │
│ • •   •     │
│ 7 8 9...    │
└─────────────┘
```

## 🎨 Personalização

### **Temas**

O calendário suporta automaticamente:

- 🌞 **Light Mode**
- 🌙 **Dark Mode**

### **Cores dos Eventos**

Atualmente usando `bg-muted-foreground`. Para personalizar:

```tsx
// Em calendar-demo.tsx, adicione:
interface Event {
  id: number
  name: string
  time: string
  datetime: string
  color?: string // Nova propriedade
}

// No componente, use:
className={`h-1.5 w-1.5 rounded-full ${event.color || 'bg-muted-foreground'}`}
```

## 📊 Dados dos Eventos

### **Estrutura Atual**

```typescript
const dummyEvents = [
  {
    day: new Date('2025-01-02'),
    events: [
      {
        id: 1,
        name: 'Q1 Planning Session',
        time: '10:00 AM',
        datetime: '2025-01-02T00:00',
      },
    ],
  },
]
```

### **Adicionando Novos Eventos**

1. Edite `src/components/features/calendar-demo.tsx`
2. Adicione novo objeto ao array `dummyEvents`
3. Salve - hot reload aplica automaticamente

### **Integração com API**

Para dados dinâmicos, substitua `dummyEvents` por:

```tsx
const [events, setEvents] = useState([])

useEffect(() => {
  fetch('/api/events')
    .then((res) => res.json())
    .then(setEvents)
}, [])
```

## 🔧 Resolução de Problemas

### **Porta em Uso**

```
⚠ Port 3000 is in use, using available port 3004
```

✅ **Normal** - acesse o projeto na nova porta mostrada

### **Rebuild Necessário**

Se houver mudanças estruturais:

```bash
npm run clean  # Remove .next
npm run build  # Rebuild completo
```

### **Problemas de Lint**

```bash
npm run lint:fix    # Correção automática
npm run format      # Formatação Prettier
```

## 📈 Performance

### **Métricas Atuais**

- ⚡ **Ready**: ~2.8s (Turbopack)
- 📦 **Bundle**: 14.7 kB (/inicio)
- 🎯 **First Load**: 123 kB
- 📊 **LCP**: <1s (Static Generation)

### **Otimizações Ativas**

- ✅ Static Site Generation (SSG)
- ✅ Automatic Code Splitting
- ✅ Tree Shaking
- ✅ Turbopack bundling

## 🎯 Próximas Funcionalidades

### **Em Desenvolvimento**

- [ ] Modal para criar eventos
- [ ] Busca por eventos
- [ ] Integração com calendários externos
- [ ] Notificações push

### **Configuração Avançada**

- [ ] Multi-timezone support
- [ ] Recurring events
- [ ] Event categories/colors
- [ ] Export/Import functionality

O dashboard está **pronto para uso** e pode ser facilmente estendido conforme suas necessidades!
