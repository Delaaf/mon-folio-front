/**
 * useApi — hook générique pour les appels API
 * Gère automatiquement : loading, error, data, notification d'erreur
 *
 * Usage :
 *   const { data, loading, execute } = useApi(ProjectService.list)
 *   useEffect(() => { execute() }, [])
 */
import { useState, useCallback, useRef } from 'react'
import { notification } from 'antd'

export function useApi(fn, options = {}) {
  const {
    onSuccess,
    onError,
    successMessage,
    showErrorNotif = true,
    immediate = false,
    initialData = null,
  } = options

  const [data,    setData]    = useState(initialData)
  const [loading, setLoading] = useState(immediate)
  const [error,   setError]   = useState(null)

  // Avoid stale closure on unmounted component
  const mounted = useRef(true)
  const cleanup = () => { mounted.current = false }

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await fn(...args)
      if (!mounted.current) return result

      setData(result)

      if (successMessage) {
        notification.success({ message: successMessage, placement: 'bottomRight', duration: 3, style: { color:'#fff !important',} })
      }

      onSuccess?.(result)
      return result
    } catch (err) {
      if (!mounted.current) return

      const message = err.response?.data?.message ?? err.message ?? 'Une erreur est survenue.'
      const errors  = err.response?.data?.errors  ?? null

      setError({ message, errors, status: err.response?.status })

      if (showErrorNotif) {
        notification.error({ message, placement: 'bottomRight', duration: 4 })
      }

      onError?.(err)
      throw err
    } finally {
      if (mounted.current) setLoading(false)
    }
  }, [fn])

  return { data, loading, error, execute, setData, cleanup }
}

/**
 * useMutation — variante pour les opérations qui modifient des données
 * Similaire à useApi mais sans état `data` persistant (renvoie le résultat directement)
 */
export function useMutation(fn, options = {}) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const { onSuccess, onError, successMessage, showErrorNotif = true } = options

  const mutate = useCallback(async (...args) => {
    setLoading(true)
    setError(null)

    try {
      const result = await fn(...args)

      if (successMessage) {
        notification.success({ message: successMessage, placement: 'bottomRight', duration: 3, style: { color:'#fff',} })
      }

      onSuccess?.(result)
      return result
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? 'Une erreur est survenue.'
      setError({ message, errors: err.response?.data?.errors ?? null })

      if (showErrorNotif) {
        notification.error({ message, placement: 'bottomRight', duration: 4, style: { color:'#fff',} })
      }

      onError?.(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  return { mutate, loading, error }
}
