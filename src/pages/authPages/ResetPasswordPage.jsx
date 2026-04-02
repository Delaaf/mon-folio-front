import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Button, notification } from 'antd'
import { LockOutlined, CheckCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { motion } from 'framer-motion'
import api from '../../services/api'
import fp from './ForgotPassword.module.css'

export default function ResetPasswordPage() {
  const [form]             = Form.useForm()
  const navigate           = useNavigate()
  const [params]           = useSearchParams()
  const [loading, setLoad] = useState(false)
  const [done, setDone]    = useState(false)
  const [notifApi, ctx]    = notification.useNotification()

  const token = params.get('token')
  const email = params.get('email')

  const handleSubmit = async (values) => {
    setLoad(true)
    try {
      await api.post('/auth/reset-password', {
        token,
        email,
        password:              values.password,
        password_confirmation: values.confirm,
      })
      setDone(true)
      setTimeout(() => navigate('/login?password_reset=1'), 2500)
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Lien invalide ou expiré.'
      notifApi.error({ message: msg, placement: 'bottomRight', duration: 4 })
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className={fp.root}>
      {ctx}
      <motion.div className={fp.box} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/" className={fp.logo}>
          <div className={fp.logoIcon}>&lt;/&gt;</div>
          <span>MonFolio</span>
        </Link>

        {!done ? (
          <>
            <div className={fp.header}>
              <h1 className={fp.title}>Nouveau mot de passe 🔐</h1>
              <p className={fp.sub}>Choisissez un nouveau mot de passe sécurisé pour votre compte.</p>
            </div>

            <Form form={form} layout="vertical" requiredMark={false} onFinish={handleSubmit}>
              <Form.Item name="password" label="Nouveau mot de passe"
                rules={[{ required: true }, { min: 8, message: '8 caractères minimum' }]}>
                <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="Créez un mot de passe fort" size="large" className={fp.input}
                  iconRender={v => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
              </Form.Item>
              <Form.Item name="confirm" label="Confirmer le mot de passe"
                dependencies={['password']}
                rules={[{ required: true }, ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve()
                    return Promise.reject('Les mots de passe ne correspondent pas')
                  }
                })]}>
                <Input.Password prefix={<LockOutlined style={{ color: 'var(--text-muted)' }} />}
                  placeholder="Répétez le mot de passe" size="large" className={fp.input}
                  iconRender={v => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
              </Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading} block className={fp.btnSubmit}>
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
            </Form>
          </>
        ) : (
          <motion.div className={fp.successBox} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircleOutlined className={fp.successIcon} />
            <h2 className={fp.successTitle}>Mot de passe modifié !</h2>
            <p className={fp.successSub}>Vous allez être redirigé vers la page de connexion…</p>
          </motion.div>
        )}

        <Link to="/login" className={fp.backLink}>← Retour à la connexion</Link>
      </motion.div>
    </div>
  )
}
