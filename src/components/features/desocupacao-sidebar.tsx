'use client'

import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { useScreenSize } from '@/hooks/use-screen-size'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

export function DesocupacaoSidebar({ children }: { children: React.ReactNode }) {
  const screenSize = useScreenSize()
  const links = [
    {
      label: 'Início',
      href: '/inicio',
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ]

  const [open, setOpen] = useState(false)

  // Ajustar comportamento baseado no tamanho da tela
  const isMobile = screenSize.lessThan('md')
  const isTablet = screenSize.equals('md')
  const isDesktop = screenSize.greaterThan('md')

  return (
    <div className="flex flex-col md:flex-row bg-white w-full flex-1 min-h-screen border-r border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 [&>*]:!bg-white [&>*]:dark:!bg-white bg-white !bg-white dark:!bg-white">
          <div className="flex flex-col">
            {/* Logo responsivo */}
            {open || isDesktop ? <Logo /> : <LogoIcon />}

            {/* Links com espaçamento responsivo */}
            <div className={`${isMobile ? 'mt-4' : 'mt-8'} flex flex-col gap-2`}>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Admin section responsiva */}
          <div className={`${isMobile ? 'mt-4' : ''}`}>
            <SidebarLink
              link={{
                label: 'Administrador',
                href: '#',
                icon: (
                  <div
                    className={`${isMobile ? 'h-6 w-6' : 'h-7 w-7'} flex-shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    A
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Content area responsiva */}
      <div className={`flex flex-1 ${isMobile ? 'px-2' : isTablet ? 'px-4' : 'px-6'}`}>
        {children}
      </div>
    </div>
  )
}

export const Logo = () => {
  return (
    <Link
      href="/inicio"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Home className="h-4 w-4 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-foreground whitespace-pre"
      ></motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      href="/inicio"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
        <Home className="h-4 w-4 text-white" />
      </div>
    </Link>
  )
}
