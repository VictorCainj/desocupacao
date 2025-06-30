export const APP_NAME = 'Modern App 21st.dev'
export const APP_DESCRIPTION = 'Aplicação moderna compatível com 21st.dev e Context7 MCP'

export const NAVIGATION_ITEMS = [
  { name: 'Home', href: '/' },
  { name: 'Componentes', href: '/components' },
  { name: 'Documentação', href: '/docs' },
] as const

// Sistema de Z-Index organizado para evitar sobreposições
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  POPOVER: 30,
  TOOLTIP: 40,
  MODAL_BACKDROP: 50,
  MODAL: 60,
  NOTIFICATION: 70,
  SIDEBAR_MOBILE: 80,
  ALERT_SYSTEM: 90,
  EMERGENCY: 100,
} as const

// Breakpoints consolidados para responsividade consistente
export const BREAKPOINTS = {
  MOBILE: 'max-width: 767px',
  TABLET: 'min-width: 768px and max-width: 1023px',
  DESKTOP: 'min-width: 1024px',
  MOBILE_ONLY: '(max-width: 767px)',
  TABLET_ONLY: '(min-width: 768px) and (max-width: 1023px)',
  DESKTOP_ONLY: '(min-width: 1024px)',
} as const

// Altura padrão para componentes principais
export const LAYOUT_HEIGHTS = {
  HEADER: '64px',
  FOOTER: '48px',
  ANNOUNCEMENT: '48px',
  ALERT_HEIGHT: '52px',
  SIDEBAR_MOBILE: '56px',
} as const
