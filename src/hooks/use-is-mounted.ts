import { useEffect, useState } from 'react'

/**
 * Hook para verificar se o componente foi montado no cliente.
 * Útil para evitar problemas de hidratação com SSR.
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
