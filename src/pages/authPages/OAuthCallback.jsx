import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin } from 'antd'
import { setToken } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import AuthService from '../../services/authService'

/**
 * OAuthCallback — page intermédiaire appelée après le redirect OAuth
 * Route : /auth/callback?token=xxx  (le backend redirige ici avec le token)
 */
export default function OAuthCallback() {
  const navigate           = useNavigate()
  const [params]           = useSearchParams()
  const { updateUser }     = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      const token = params.get('token')

      if (!token) {
        navigate('/login?error=oauth_failed')
        return
      }

      // Store token & fetch user profile
      setToken(token)
      try {
        const me = await AuthService.me()
        updateUser(me)
        navigate('/')
      } catch {
        navigate('/login?error=oauth_failed')
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: 16,
      background: 'var(--bg-primary)',
    }}>
      <Spin size="large" />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
        Authentification en cours…
      </p>
    </div>
  )
}
