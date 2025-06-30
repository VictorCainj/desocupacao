# 🚀 Modern App - 21st.dev Compatible

Aplicação frontend moderna **TOTALMENTE ATUALIZADA** usando **Next.js 15**, **React 19**, **Turbopack** e todas as tecnologias mais recentes. Compatível com 21st.dev e Context7 MCP.

## ✨ Últimas Atualizações

- ✅ **Next.js 15.3.4** com Turbopack ativado
- ✅ **React 19.0.0** com novas funcionalidades
- ✅ **42 componentes shadcn/ui** atualizados
- ✅ **TypeScript** com suporte completo ao React 19
- ✅ **Calendário fullscreen** totalmente implementado
- ✅ **Zero vulnerabilidades** de segurança

## 🚀 Tecnologias Principais

- **Next.js 15.3.4** - Framework React com App Router + Turbopack
- **React 19.0.0** - Biblioteca de UI mais recente
- **TypeScript 5.6+** - Tipagem estática robusta
- **Tailwind CSS 3.4** - Estilização utilitária moderna
- **Shadcn/UI** - 42 componentes atualizados
- **Radix UI** - Componentes acessíveis de alta qualidade
- **@dnd-kit/core** - Sistema drag & drop para Kanban
- **Framer Motion** - Animações fluidas e modernas
- **Context7 MCP** - Documentação sempre atualizada
- **ESLint + Prettier** - Qualidade e formatação de código

## 🎯 Funcionalidades

### 📅 **Calendário Fullscreen**

- Navegação entre meses (anterior/próximo/hoje)
- Eventos visuais com indicadores coloridos
- Design totalmente responsivo (desktop/mobile)
- Seleção interativa de dias
- Dados de exemplo pré-carregados

### 📋 **Kanban Board**

- Sistema de tarefas estilo Trello
- Drag & drop entre colunas (A Fazer → Em Progresso → Concluído)
- Cards com avatares reais e informações detalhadas
- Interface totalmente responsiva
- 8 tarefas de exemplo pré-carregadas

### 🧭 **Sidebar Animado (NOVO!)**

- Navegação lateral moderna e responsiva
- Animações fluidas com framer-motion
- Expansão automática no hover (desktop)
- Menu overlay para mobile
- 7 links de navegação + perfil do usuário

### 🧭 **Navegação Moderna**

- Sistema de roteamento entre páginas
- Interface limpa e intuitiva
- Compatível com App Router do Next.js 15

### 🎨 **Design System**

- Tema escuro/claro com CSS variables
- Componentes consistentes e reutilizáveis
- Animações suaves e modernas
- Layout otimizado com espaçamento profissional
- Totalmente responsivo

## 📦 Setup Rápido

### Opção 1: Script Automatizado (Recomendado)

```powershell
# Execute o script de setup
.\setup.ps1
```

### Opção 2: Manual

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento (com Turbopack)
npm run dev

# Acesse: http://localhost:3000
```

## 🏃‍♂️ Scripts Disponíveis

```bash
npm run dev          # 🔥 Desenvolvimento com Turbopack
npm run build        # 🏗️ Build de produção
npm run start        # 🌐 Servidor de produção
npm run lint         # 🔍 Verificar código
npm run lint:fix     # 🔧 Corrigir automaticamente
npm run type-check   # 📝 Verificar tipos TypeScript
npm run format       # ✨ Formatar código
npm run clean        # 🗑️ Limpar build anterior
npm run upgrade      # ⬆️ Atualizar dependências
```

## 🌐 Páginas

- **Home** (`/`) - Página inicial moderna
- **Calendário & Projetos** (`/inicio`) - Calendário fullscreen + Kanban Board estilo Trello

## 🛠️ Context7 MCP

Este projeto está **totalmente configurado** para Context7 MCP:

### Configuração Cursor

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp@latest"]
    }
  }
}
```

### Configuração VS Code

```json
// .vscode/settings.json
{
  "mcp.servers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp@latest"]
    }
  }
}
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial
│   ├── inicio/            # Página do calendário
│   └── globals.css        # Estilos globais
├── components/
│   ├── ui/                # 42 componentes shadcn/ui + kanban.tsx + sidebar.tsx
│   ├── layout/            # navigation.tsx + conditional-navigation.tsx
│   └── features/          # calendar-demo.tsx + kanban-demo.tsx + sidebar-demo.tsx
├── lib/                   # Utilitários e configurações
├── hooks/                 # React hooks customizados
└── types/                 # Definições TypeScript
```

## 🔧 Configurações

### components.json (Shadcn/UI)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### next.config.js (Next.js 15)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  serverExternalPackages: ['sharp'],
}
```

## 📊 Performance

- ✅ **Turbopack** para compilação ultra-rápida
- ✅ **Font optimization** com Inter
- ✅ **Bundle optimization** automática
- ✅ **Zero vulnerabilidades** de segurança
- ✅ **TypeScript strict mode** ativo

## 🔄 Atualizações Futuras

Para manter tudo atualizado:

```bash
# Atualizar componentes shadcn/ui
npx shadcn@latest add --all --overwrite

# Atualizar dependências npm
npm run upgrade

# Verificar diferenças nos componentes
npx shadcn diff
```

## 📚 Documentação Adicional

- [UPDATES.md](./UPDATES.md) - Detalhes das últimas atualizações
- [CALENDAR_INTEGRATION.md](./CALENDAR_INTEGRATION.md) - Documentação do calendário
- [KANBAN_INTEGRATION.md](./KANBAN_INTEGRATION.md) - Documentação do Kanban Board
- [SIDEBAR_INTEGRATION.md](./SIDEBAR_INTEGRATION.md) - Documentação do Sidebar Animado
- [LAYOUT_IMPROVEMENTS.md](./LAYOUT_IMPROVEMENTS.md) - **NOVO:** Melhorias de layout e espaçamento
- [setup.ps1](./setup.ps1) - Script de configuração automática

## 🎉 Status do Projeto

- ✅ **Totalmente funcional** com todas as features
- ✅ **Zero erros** de build ou tipo
- ✅ **Zero vulnerabilidades** de segurança
- ✅ **100% compatível** com 21st.dev
- ✅ **Pronto para produção**

---

**Desenvolvido com as melhores práticas e tecnologias mais recentes! 🚀**
