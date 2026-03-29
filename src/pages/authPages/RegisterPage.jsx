import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, Divider, notification, Progress } from 'antd'
import {
  MailOutlined, LockOutlined, UserOutlined, GithubOutlined,
  GoogleOutlined, EyeInvisibleOutlined, EyeTwoTone,
  CheckCircleFilled, CloseCircleFilled,
} from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AuthPages.module.css'

/* ── Password strength checker ── */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' }
  let score = 0
  if (pwd.length >= 8)            score++
  if (/[A-Z]/.test(pwd))          score++
  if (/[0-9]/.test(pwd))          score++
  if (/[^A-Za-z0-9]/.test(pwd))   score++
  const map = [
    { label: '',          color: '' },
    { label: 'Faible',    color: '#f87171' },
    { label: 'Moyen',     color: '#f59e0b' },
    { label: 'Bon',       color: '#60a5fa' },
    { label: 'Fort',      color: '#4ade80' },
  ]
  return { score, ...map[score] }
}

const RULES = [
  { test: p => p.length >= 8,           label: '8 caractères minimum'        },
  { test: p => /[A-Z]/.test(p),         label: 'Une majuscule'               },
  { test: p => /[0-9]/.test(p),         label: 'Un chiffre'                  },
  { test: p => /[^A-Za-z0-9]/.test(p),  label: 'Un caractère spécial'        },
]

const STEPS = ['Compte', 'Profil', 'Confirmation']

export default function RegisterPage() {
  const navigate              = useNavigate()
  const [form]                = Form.useForm()
  const [step, setStep]       = useState(0)
  const [password, setPass]   = useState('')
  const [loading, setLoad]    = useState(false)
  const [notifApi, ctx]       = notification.useNotification()
  const strength              = getStrength(password)

  const nextStep = async () => {
    try {
      const fields = step === 0
        ? ['email', 'password', 'confirm']
        : ['prenom', 'nom', 'username']
      await form.validateFields(fields)
      setStep(s => s + 1)
    } catch {}
  }

  const handleSubmit = async () => {
    try {
      await form.validateFields(['terms'])
      setLoad(true)
      await new Promise(r => setTimeout(r, 1200))
      setLoad(false)
      notifApi.success({
        message: 'Compte créé avec succès 🎉',
        description: 'Vérifiez votre email pour activer votre compte.',
        placement: 'bottomRight',
        duration: 4,
      })
      setTimeout(() => navigate('/login'), 1000)
    } catch {}
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
        <div className={styles.panelGlow1} />
        <div className={styles.panelGlow2} />
        <div className={styles.panelGrid}  />

        <Link to="/" className={styles.panelLogo}>
          <div className={styles.panelLogoIcon}>&lt;/&gt;</div>
          <span>MonFolio</span>
        </Link>

        {/* Steps indicator */}
        <div className={styles.stepsWrap}>
          <p className={styles.stepsLabel}>Étape {step + 1} sur {STEPS.length}</p>
          <div className={styles.stepsBar}>
            {STEPS.map((s, i) => (
              <div key={s} className={styles.stepItem}>
                <div className={`${styles.stepDot} ${i <= step ? styles.stepDotActive : ''} ${i < step ? styles.stepDotDone : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`${styles.stepLabel} ${i <= step ? styles.stepLabelActive : ''}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel hero */}
        <div className={styles.panelHero}>
          <motion.h2
            key={step}
            className={styles.panelTitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {step === 0 && <>Créez votre<br /><span className={styles.panelAccent}>compte gratuit.</span></>}
            {step === 1 && <>Complétez votre<br /><span className={styles.panelAccent}>profil.</span></>}
            {step === 2 && <>Presque<br /><span className={styles.panelAccent}>terminé !</span></>}
          </motion.h2>
          <motion.p
            key={`sub-${step}`}
            className={styles.panelSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {step === 0 && 'Entrez vos identifiants pour créer votre espace.'}
            {step === 1 && 'Dites-nous comment vous appeler sur votre portfolio.'}
            {step === 2 && 'Acceptez les conditions et lancez-vous !'}
          </motion.p>
        </div>

        {/* Preview card */}
        <motion.div
          className={styles.previewCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.previewDots}>
            <span /><span /><span />
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewAva}>
              {form.getFieldValue('prenom')?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className={styles.previewName}>
                {(form.getFieldValue('prenom') || 'Prénom') + ' ' + (form.getFieldValue('nom') || 'Nom')}
              </div>
              <div className={styles.previewHandle}>
                @{form.getFieldValue('username') || 'monportfolio'}
              </div>
            </div>
          </div>
          <div className={styles.previewUrl}>
            monfolio.dev/<span>{form.getFieldValue('username') || 'monportfolio'}</span>
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
            <h1 className={styles.formTitle}>
              {step === 0 && 'Créer un compte ✨'}
              {step === 1 && 'Votre profil 👤'}
              {step === 2 && 'Finalisation 🎯'}
            </h1>
            <p className={styles.formSubtitle}>
              {step === 0 && 'Gratuit, sans carte bancaire requise.'}
              {step === 1 && 'Ces infos seront visibles sur votre portfolio.'}
              {step === 2 && 'Vous y êtes presque !'}
            </p>
          </div>

          {/* OAuth (step 0 only) */}
          {step === 0 && (
            <>
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
            </>
          )}

          <Form form={form} layout="vertical" requiredMark={false} className={styles.form}>
            <AnimatePresence mode="wait">

              {/* ── Step 0 : Compte ── */}
              {step === 0 && (
                <motion.div key="step0"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <Form.Item name="email" label="Adresse email"
                    rules={[{ required: true, message: 'Email requis' }, { type: 'email', message: 'Email invalide' }]}>
                    <Input prefix={<MailOutlined className={styles.inputIcon} />}
                      placeholder="hello@exemple.com" size="large" className={styles.input} />
                  </Form.Item>

                  <Form.Item name="password" label="Mot de passe"
                    rules={[{ required: true }, { min: 8, message: '8 caractères minimum' }]}>
                    <Input.Password
                      prefix={<LockOutlined className={styles.inputIcon} />}
                      placeholder="Créez un mot de passe fort"
                      size="large"
                      className={styles.input}
                      onChange={e => setPass(e.target.value)}
                      iconRender={v => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                    />
                  </Form.Item>

                  {/* Strength meter */}
                  {password && (
                    <motion.div className={styles.strengthWrap}
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <div className={styles.strengthHeader}>
                        <span className={styles.strengthLabel}>Force du mot de passe</span>
                        <span className={styles.strengthScore} style={{ color: strength.color }}>{strength.label}</span>
                      </div>
                      <div className={styles.strengthBar}>
                        {[1,2,3,4].map(i => (
                          <div key={i} className={styles.strengthSegment}
                            style={{ background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.07)' }} />
                        ))}
                      </div>
                      <div className={styles.rulesList}>
                        {RULES.map(r => (
                          <div key={r.label} className={`${styles.rule} ${r.test(password) ? styles.rulePassed : ''}`}>
                            {r.test(password)
                              ? <CheckCircleFilled style={{ color: '#4ade80', fontSize: 12 }} />
                              : <CloseCircleFilled style={{ color: 'var(--text-muted)', fontSize: 12 }} />}
                            <span>{r.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <Form.Item name="confirm" label="Confirmer le mot de passe"
                    dependencies={['password']}
                    rules={[{ required: true, message: 'Requis' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) return Promise.resolve()
                          return Promise.reject('Les mots de passe ne correspondent pas')
                        }
                      })
                    ]}>
                    <Input.Password prefix={<LockOutlined className={styles.inputIcon} />}
                      placeholder="Répétez le mot de passe" size="large" className={styles.input}
                      iconRender={v => v ? <EyeTwoTone /> : <EyeInvisibleOutlined />} />
                  </Form.Item>
                </motion.div>
              )}

              {/* ── Step 1 : Profil ── */}
              {step === 1 && (
                <motion.div key="step1"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <div className={styles.twoCol}>
                    <Form.Item name="prenom" label="Prénom"
                      rules={[{ required: true, message: 'Requis' }]}>
                      <Input prefix={<UserOutlined className={styles.inputIcon} />}
                        placeholder="Alex" size="large" className={styles.input} />
                    </Form.Item>
                    <Form.Item name="nom" label="Nom"
                      rules={[{ required: true, message: 'Requis' }]}>
                      <Input prefix={<UserOutlined className={styles.inputIcon} />}
                        placeholder="Rivera" size="large" className={styles.input} />
                    </Form.Item>
                  </div>

                  <Form.Item name="username" label="Nom d'utilisateur / URL du portfolio"
                    rules={[{ required: true, message: 'Requis' },
                      { pattern: /^[a-z0-9-]+$/, message: 'Minuscules, chiffres et tirets uniquement' }]}
                    extra={
                      <span className={styles.urlPreview}>
                        🌐 monfolio.dev/<strong>{form.getFieldValue('username') || '...'}</strong>
                      </span>
                    }>
                    <Input prefix={<span className={styles.atPrefix}>@</span>}
                      placeholder="alexrivera" size="large" className={styles.input}
                      onChange={() => form.validateFields(['username'])} />
                  </Form.Item>

                  <Form.Item name="role" label="Titre professionnel">
                    <Input placeholder="Ex: Full-Stack Developer" size="large" className={styles.input} />
                  </Form.Item>
                </motion.div>
              )}

              {/* ── Step 2 : Confirmation ── */}
              {step === 2 && (
                <motion.div key="step2"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>

                  {/* Récap */}
                  <div className={styles.recap}>
                    <div className={styles.recapRow}>
                      <span className={styles.recapKey}>Email</span>
                      <span className={styles.recapVal}>{form.getFieldValue('email') || '—'}</span>
                    </div>
                    <div className={styles.recapRow}>
                      <span className={styles.recapKey}>Nom</span>
                      <span className={styles.recapVal}>{(form.getFieldValue('prenom') || '') + ' ' + (form.getFieldValue('nom') || '') || '—'}</span>
                    </div>
                    <div className={styles.recapRow}>
                      <span className={styles.recapKey}>URL portfolio</span>
                      <span className={styles.recapVal} style={{ color: 'var(--accent)' }}>
                        monfolio.dev/{form.getFieldValue('username') || '—'}
                      </span>
                    </div>
                  </div>

                  <Form.Item name="terms" valuePropName="checked"
                    rules={[{ validator: (_, v) => v ? Promise.resolve() : Promise.reject("Requis") }]}>
                    <Checkbox className={styles.checkbox}>
                      J'accepte les{' '}
                      <a href="#" className={styles.switchLink}>Conditions d'utilisation</a>
                      {' '}et la{' '}
                      <a href="#" className={styles.switchLink}>Politique de confidentialité</a>
                    </Checkbox>
                  </Form.Item>

                  <Form.Item name="newsletter" valuePropName="checked">
                    <Checkbox className={styles.checkbox}>
                      Recevoir les conseils et mises à jour par email
                    </Checkbox>
                  </Form.Item>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className={styles.btnNav}>
              {step > 0 && (
                <Button size="large" className={styles.btnBack} onClick={() => setStep(s => s - 1)}>
                  ← Retour
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button type="primary" size="large" className={styles.btnSubmit}
                  onClick={nextStep} style={{ flex: 1 }}>
                  Continuer →
                </Button>
              ) : (
                <Button type="primary" size="large" loading={loading}
                  className={styles.btnSubmit} onClick={handleSubmit} style={{ flex: 1 }}>
                  {loading ? 'Création en cours...' : '🚀 Créer mon portfolio'}
                </Button>
              )}
            </div>
          </Form>

          <p className={styles.switchText}>
            Déjà un compte ?{' '}
            <Link to="/login" className={styles.switchLink}>Se connecter →</Link>
          </p>
        </div>
      </motion.main>
    </div>
  )
}
