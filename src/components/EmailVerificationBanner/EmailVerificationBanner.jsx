import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MailOutlined, CloseOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import styles from './EmailVerificationBanner.module.css'

/**
 * EmailVerificationBanner
 * Affiché en haut du site si l'utilisateur est connecté
 * mais n'a pas encore vérifié son email.
 */
const EmailVerificationBanner = () => {
  const { user }                    = useAuth()
  const [dismissed, setDismissed]   = useState(false)
  const [sending, setSending]       = useState(false)
  const [notifApi, ctx]             = notification.useNotification()

  // Ne rien afficher si pas connecté, email vérifié, ou banniaire fermé
  if (!user || user.email_verified || dismissed) return null

  const resend = async () => {
    setSending(true)
    try {
      await api.post('/auth/email/resend', { email: user.email })
      notifApi.success({
        message: 'Email de vérification renvoyé !',
        description: `Vérifiez votre boîte mail : ${user.email}`,
        placement: 'bottomRight',
        duration: 5,
      })
    } catch {
      notifApi.error({
        message: 'Impossible d\'envoyer l\'email. Vérifiez votre config mail.',
        placement: 'bottomRight',
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {ctx}
      <AnimatePresence>
        <motion.div
          className={styles.banner}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={styles.inner}>
            <MailOutlined className={styles.icon} />
            <p className={styles.text}>
              Vérifiez votre adresse email{' '}
              <strong>{user.email}</strong>{' '}
              pour activer toutes les fonctionnalités.
            </p>
            <button
              className={styles.btnResend}
              onClick={resend}
              disabled={sending}
            >
              {sending ? 'Envoi...' : 'Renvoyer l\'email'}
            </button>
            <button
              className={styles.btnClose}
              onClick={() => setDismissed(true)}
              aria-label="Fermer"
            >
              <CloseOutlined />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default EmailVerificationBanner
