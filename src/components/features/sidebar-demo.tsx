'use client'
import React, { useState } from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { Calendar, Folder, Users, Settings, LogOut, Home, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function ProjectSidebar() {
  const links = [
    {
      label: 'Dashboard',
      href: '/',
      icon: <Home className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Calendário & Projetos',
      href: '/inicio',
      icon: <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Relatórios',
      href: '#',
      icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Projetos',
      href: '#',
      icon: <Folder className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Equipe',
      href: '#',
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Configurações',
      href: '#',
      icon: <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: 'Sair',
      href: '#',
      icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: 'Ana Rodrigues',
              href: '#',
              icon: (
                <Image
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop&crop=face"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar de Ana Rodrigues"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Modern App
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  )
}
