import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import AuthService from '../services/authService'
import { getToken, clearToken } from '../services/api'

// ── Context ───────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const navigate               = useNavigate()
  const [user, setUser]        = useState(null)
  const [loading, setLoading]  = useState(true)   // initial hydration
  const [initialized, setInitialized] = useState(false)
  const [notifApi, notifCtx]   = notification.useNotification()

  /**
   * Hydrate user on mount if a token exists
   */
  useEffect(() => {
    const hydrate = async () => {
      if (!getToken()) {
         setLoading(false)
         setInitialized(true)
          return 
        }
      try {
        const me = await AuthService.me()
        setUser(me)
      } catch {
        clearToken()
        setUser(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }
    hydrate()
  }, [])

  // ── Actions ───────────────────────────────────────────────────

  const register = useCallback(async (payload) => {
    const result = await AuthService.register(payload)
    setUser(result.data.user)
    notifApi.success({
      message: 'Compte créé avec succès ! ',
      description: 'Vérifiez votre email pour activer votre compte.',
      placement: 'bottomRight',
    })
    //navigate('/dashboard')
    return result
  }, [navigate, notifApi])

  const login = useCallback(async (email, password) => {
    const result = await AuthService.login(email, password)
    setUser(result.data.user)
    notifApi.success({
      message: `Bon retour, ${result.data.user.prenom} !`,
      placement: 'bottomRight',
      duration: 3,
    })
    //navigate('/dashboard')
    return result
  }, [navigate, notifApi])

  const logout = useCallback(async () => {
    await AuthService.logout()
    setUser(null)
    notifApi.info({ message: 'Déconnexion réussie.', placement: 'bottomRight', duration: 2 })
    navigate('/connexion')
  }, [navigate, notifApi])

  const updateUser = useCallback((updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }))
  }, [])

  const loginWithGoogle = useCallback(async () => {
  try {
    const url = await AuthService.getGoogleRedirectUrl()
    // Redirection complète du navigateur vers Google
    window.location.href = url
  } catch {
    notifApi.error({ message: 'Impossible de se connecter avec Google.', placement: 'bottomRight' })
  }
}, [notifApi])

const loginWithGithub = useCallback(async () => {
  try {
    const url = await AuthService.getGithubRedirectUrl()
    window.location.href = url
  } catch {
    notifApi.error({ message: 'Impossible de se connecter avec GitHub.', placement: 'bottomRight' })
  }
}, [notifApi])
  // ── Value ─────────────────────────────────────────────────────
  const value = {
    user,
    loading,
    initialized,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    updateUser,
    loginWithGoogle,
    loginWithGithub,
  }

  return (
    <AuthContext.Provider value={value}>
      {notifCtx}
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
