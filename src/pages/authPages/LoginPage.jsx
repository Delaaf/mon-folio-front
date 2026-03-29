import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Divider, notification } from 'antd'
import {
  MailOutlined, LockOutlined, GithubOutlined,
  GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import styles from './AuthPages.module.css'

/* ── Animated feature card (left panel) ── */
const FEATURES = [
  { icon: '🚀', text: 'Portfolio en ligne en quelques minutes'  },
  { icon: '🎨', text: 'Thèmes personnalisables à l\'infini'     },
  { icon: '📊', text: 'Analytics et statistiques de vues'       },
  { icon: '🌐', text: 'Domaine personnalisé inclus'             },
]

export default function LoginPage() {
  const navigate           = useNavigate()
  const [form]             = Form.useForm()
  const [loading, setLoad] = useState(false)
  const [notifApi, ctx]    = notification.useNotification()

  const handleSubmit = async (values) => {
    setLoad(true)
    await new Promise(r => setTimeout(r, 1100))
    setLoad(false)
    notifApi.success({
      message: 'Connexion réussie !',
      description: `Bienvenue, ${values.email} 👋`,
      placement: 'bottomRight',
      duration: 3,
    })
    setTimeout(() => navigate('/'), 800)
  }

  return (
    <div className={styles.authRoot}>
      {ctx}

      {/* ── Left panel ── */}
      <motion.aside
        className={styles.panel}
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glows */}
        <div className={styles.panelGlow1} />
        <div className={styles.panelGlow2} />
        <div className={styles.panelGrid}  />

        {/* Logo */}
        <Link to="/" className={styles.panelLogo}>
          <div className={styles.panelLogoIcon}>&lt;/&gt;</div>
          <span>MonFolio</span>
        </Link>

        {/* Hero text */}
        <div className={styles.panelHero}>
          <motion.h2
            className={styles.panelTitle}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Votre portfolio,<br />
            <span className={styles.panelAccent}>votre identité.</span>
          </motion.h2>
          <motion.p
            className={styles.panelSub}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
          >
            Rejoignez +12 000 développeurs qui présentent leur travail avec MonFolio.
          </motion.p>
        </div>

        {/* Features */}
        <ul className={styles.featureList}>
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.text}
              className={styles.featureItem}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.45 }}
            >
              <span className={styles.featureIcon}>{f.icon}</span>
              <span>{f.text}</span>
            </motion.li>
          ))}
        </ul>

        {/* Testimonial */}
        <motion.div
          className={styles.testimonial}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.45 }}
        >
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="Témoignage"
            className={styles.testimonialAvatar}
          />
          <div>
            <p className={styles.testimonialText}>
              "MonFolio m'a aidé à décrocher mon poste chez Stripe en 3 semaines !"
            </p>
            <p className={styles.testimonialAuthor}>— Sarah K., Senior Engineer</p>
          </div>
        </motion.div>
      </motion.aside>

      {/* ── Right panel (form) ── */}
      <motion.main
        className={styles.formSide}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.formBox}>

          {/* Header */}
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Bon retour 👋</h1>
            <p className={styles.formSubtitle}>
              Connectez-vous à votre espace MonFolio.
            </p>
          </div>

          {/* OAuth buttons */}
          <div className={styles.oauthRow}>
            <button className={styles.oauthBtn}
              onClick={() => notifApi.info({ message: 'OAuth Google (demo)', placement: 'bottomRight' })}>
              <GoogleOutlined className={styles.oauthIcon} />
              <span>Google</span>
            </button>
            <button className={styles.oauthBtn}
              onClick={() => notifApi.info({ message: 'OAuth GitHub (demo)', placement: 'bottomRight' })}>
              <GithubOutlined className={styles.oauthIcon} />
              <span>GitHub</span>
            </button>
          </div>

          <Divider className={styles.divider}>
            <span className={styles.dividerText}>ou avec votre email</span>
          </Divider>

          {/* Form */}
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            className={styles.form}
          >
            <Form.Item
              name="email"
              label="Adresse email"
              rules={[
                { required: true, message: 'Email requis' },
                { type: 'email',  message: 'Email invalide' },
              ]}
            >
              <Input
                prefix={<MailOutlined className={styles.inputIcon} />}
                placeholder="hello@exemple.com"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mot de passe"
              rules={[{ required: true, message: 'Mot de passe requis' }]}
            >
              <Input.Password
                prefix={<LockOutlined className={styles.inputIcon} />}
                placeholder="••••••••"
                size="large"
                className={styles.input}
                iconRender={v => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              />
            </Form.Item>

            <div className={styles.formRow}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className={styles.checkbox}>Se souvenir de moi</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className={styles.forgotLink}>
                Mot de passe oublié ?
              </Link>
            </div>

            <Form.Item style={{ marginTop: 8 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
                className={styles.btnSubmit}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Form.Item>
          </Form>

          {/* Footer */}
          <p className={styles.switchText}>
            Pas encore de compte ?{' '}
            <Link to="/register" className={styles.switchLink}>
              Créer un compte gratuit →
            </Link>
          </p>
        </div>
      </motion.main>
    </div>
  )
}
