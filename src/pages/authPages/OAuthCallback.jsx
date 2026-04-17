import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, notification } from 'antd'
import { setToken } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import AuthService from '../../services/authService'

export default function OAuthCallback() {
  const navigate        = useNavigate()
  const [params]        = useSearchParams()
  const { updateUser }  = useAuth()
  const [notifApi, ctx] = notification.useNotification()

  useEffect(() => {
    const handleCallback = async () => {
      const token = params.get('token')
      const error = params.get('error')

      if (error || !token) {
        notifApi.error({
          message: 'Authentification échouée.',
          description: 'Veuillez réessayer ou utiliser email/mot de passe.',
          placement: 'bottomRight',
        })
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      try {
        setToken(token)
        const me = await AuthService.me()
        updateUser(me)
        navigate('/dashboard')
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
      background: '#04040a',
    }}>
      {ctx}
      <Spin size="large" />
      <p style={{ color: 'rgba(240,240,248,0.5)', fontSize: 14 }}>
        Authentification en cours…
      </p>
    </div>
  )
}