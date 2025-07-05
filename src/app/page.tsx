'use client'

import { PageMetaTags } from '@/components/seo/meta-tags'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useComponentPerformance } from '@/hooks/use-performance'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  useComponentPerformance('HomePage')

  return (
    <>
      <PageMetaTags
        title="Modern App - 21st.dev Compatible"
        description="Aplicação moderna compatível com 21st.dev e Context7 MCP construída com Next.js 15, React 19, TypeScript e Tailwind CSS"
        path="/"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight sm:text-6xl mb-6"
          >
            Projeto Moderno
            <span className="text-primary"> 21st.dev</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl"
          >
            Aplicação construída com Next.js 15, React 19, TypeScript, Tailwind CSS e integração
            completa com Context7 MCP para desenvolvimento moderno.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-12 justify-center"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
          >
            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle>21st.dev Ready</CardTitle>
                <CardDescription>Compatível com componentes da plataforma 21st.dev</CardDescription>
              </CardHeader>
              <CardContent>Radix UI + Tailwind CSS para máxima compatibilidade</CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle>Context7 MCP</CardTitle>
                <CardDescription>Documentação sempre atualizada no seu editor</CardDescription>
              </CardHeader>
              <CardContent>Integração completa com assistentes de IA modernos</CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardHeader>
                <CardTitle>Tecnologias Modernas</CardTitle>
                <CardDescription>Next.js 15, React 19, TypeScript</CardDescription>
              </CardHeader>
              <CardContent>Stack de última geração para desenvolvimento rápido</CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
