import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Projeto Moderno
          <span className="text-primary"> 21st.dev</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
          Aplicação construída com Next.js 14+, TypeScript, Tailwind CSS e integração completa com
          Context7 MCP para desenvolvimento moderno.
        </p>

        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          <Button size="lg" asChild>
            <Link href="/inicio">Ver Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/responsive-demo">Sistema Responsivo</Link>
          </Button>

          <Button variant="outline" size="lg" asChild>
            <Link href="/alerts-demo">Alerts Animados</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/sidebar-demo">Sidebar Demo</Link>
          </Button>
          <Button variant="outline" size="lg">
            Documentação
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>21st.dev Ready</CardTitle>
              <CardDescription>Compatível com componentes da plataforma 21st.dev</CardDescription>
            </CardHeader>{' '}
            <CardContent>Radix UI + Tailwind CSS para máxima compatibilidade</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Context7 MCP</CardTitle>
              <CardDescription>Documentação sempre atualizada no seu editor</CardDescription>
            </CardHeader>
            <CardContent>Integração completa com assistentes de IA modernos</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tecnologias Modernas</CardTitle>
              <CardDescription>Next.js 14+, TypeScript, App Router</CardDescription>
            </CardHeader>
            <CardContent>Stack de última geração para desenvolvimento rápido</CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
