# 🚀 Setup Rápido - Modern App 21st.dev
# Execute este script para configurar e executar o projeto

Write-Host "🚀 Configurando Modern App 21st.dev..." -ForegroundColor Green

# Navegar para o diretório do projeto
Set-Location "C:\Desocupacão"

Write-Host "📁 Diretório atual: $(Get-Location)" -ForegroundColor Cyan

# Verificar se node_modules existe
if (Test-Path "node_modules") {
    Write-Host "✅ Dependências já instaladas" -ForegroundColor Green
} else {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎯 Opções disponíveis:" -ForegroundColor Yellow
Write-Host "1. Executar em modo desenvolvimento (recomendado)"
Write-Host "2. Fazer build de produção"
Write-Host "3. Executar verificações (lint + type-check)"
Write-Host "4. Atualizar componentes shadcn/ui"
Write-Host ""

$choice = Read-Host "Escolha uma opção (1-4)"

switch ($choice) {
    "1" {
        Write-Host "🔥 Iniciando servidor de desenvolvimento com Turbopack..." -ForegroundColor Green
        Write-Host "   Acesse: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "   Calendário: http://localhost:3000/inicio" -ForegroundColor Cyan
        Write-Host ""
        npm run dev
    }
    "2" {
        Write-Host "🏗️ Fazendo build de produção..." -ForegroundColor Yellow
        npm run build
        Write-Host "✅ Build concluído!" -ForegroundColor Green
    }
    "3" {
        Write-Host "🔍 Executando verificações..." -ForegroundColor Yellow
        Write-Host "Verificando tipos TypeScript..."
        npm run type-check
        Write-Host "Verificando código com ESLint..."
        npm run lint
        Write-Host "✅ Verificações concluídas!" -ForegroundColor Green
    }
    "4" {
        Write-Host "🔄 Atualizando componentes shadcn/ui..." -ForegroundColor Yellow
        npx shadcn@latest add --all --overwrite
        Write-Host "✅ Componentes atualizados!" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Opção inválida. Execute o script novamente." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 Para mais informações, consulte:" -ForegroundColor Cyan
Write-Host "   - README.md - Documentação principal"
Write-Host "   - UPDATES.md - Últimas atualizações"
Write-Host "   - CALENDAR_INTEGRATION.md - Documentação do calendário"