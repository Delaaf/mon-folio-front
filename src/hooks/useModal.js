import { useState, useCallback } from 'react'

/**
 * useModal — gère l'état ouvert/fermé d'une modale
 * et les données associées (projet courant)
 */
export function useModal(initialOpen = false) {
  const [isOpen, setOpen]   = useState(initialOpen)
  const [data, setData]     = useState(null)

  const open  = useCallback((payload = null) => { setData(payload); setOpen(true)  }, [])
  const close = useCallback(()               => { setOpen(false); setData(null)    }, [])

  return { isOpen, data, open, close }
}
