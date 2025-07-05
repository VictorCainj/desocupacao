// Global type declarations
declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set' | 'consent',
      targetId: string,
      parameters?: Record<string, unknown>
    ) => void
  }
}

export {}
