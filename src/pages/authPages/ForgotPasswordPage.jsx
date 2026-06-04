import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, notification } from 'antd'
import { MailOutlined, ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import api from '../../services/api'
import styles from './AuthPages.module.css'
import fp from './ForgotPassword.module.css'
import monfolio_logo from '../../assets/monfolio_logo.png'

export default function ForgotPasswordPage() {
  const [form]              = Form.useForm()
  const [loading, setLoad]  = useState(false)
  const [sent, setSent]     = useState(false)
  const [email, setEmail]   = useState('')
  const [notifApi, ctx]     = notification.useNotification()

  const handleSubmit = async (values) => {
    setLoad(true)
    try {
      await api.post('/auth/forgot-password', { email: values.email })
      setEmail(values.email)
      setSent(true)
    } catch {
      // Always show success to avoid email enumeration
      setEmail(values.email)
      setSent(true)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className={fp.root}>
      {ctx}
      <motion.div
        className={fp.box}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <Link to="/" className={fp.logo}>
          <div className={styles.panelLogoIcon}>
            <img src={monfolio_logo} alt="" className={styles.panelLogoImage} /> 
          </div>
          <span>MonFolio</span>
        </Link>

        {!sent ? (
          <>
            <div className={fp.header}>
              <h1 className={fp.title}>Mot de passe oublié 🔑</h1>
              <p className={fp.sub}>
                Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
              <Form.Item
                name="email"
                label="Adresse email"
                rules={[{ required: true, message: 'Email requis' }, { type: 'email' }]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="hello@exemple.com"
                  size="large"
                  className={fp.input}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block className={fp.btnSubmit}>
                {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </Form>
          </>
        ) : (
          <motion.div
            className={fp.successBox}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircleOutlined className={fp.successIcon} />
            <h2 className={fp.successTitle}>Email envoyé !</h2>
            <p className={fp.successSub}>
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un email
              avec les instructions pour réinitialiser votre mot de passe.
            </p>
            <p className={fp.successHint}>Vérifiez aussi vos spams.</p>
            <Button onClick={() => setSent(false)} className={fp.btnRetry}>
              Renvoyer l'email
            </Button>
          </motion.div>
        )}

        <Link to="/connexion" className={fp.backLink}>
          <ArrowLeftOutlined /> Retour à la connexion
        </Link>
      </motion.div>
    </div>
  )
}
