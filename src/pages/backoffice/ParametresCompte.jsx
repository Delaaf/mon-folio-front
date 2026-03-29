import React, { useState } from 'react'
import { Button, Switch, Select, notification, Alert, Popconfirm, Radio } from 'antd'
import {
  BellOutlined, GlobalOutlined, SafetyOutlined,
  DeleteOutlined, DownloadOutlined, SaveOutlined,
  EyeOutlined, LockOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './ParametresCompte.module.css'

const { Option } = Select

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

const Row = ({ label, desc, children }) => (
  <div className={ls.row}>
    <div>
      <div className={ls.rowLabel}>{label}</div>
      {desc && <div className={ls.rowDesc}>{desc}</div>}
    </div>
    {children}
  </div>
)

export default function ParametresCompte() {
  const [notifApi, notifCtx] = notification.useNotification()
  const [emailNotif, setEmailNotif]   = useState(true)
  const [projectNotif, setProjNotif]  = useState(true)
  const [newsletter, setNewsletter]   = useState(false)
  const [profilePublic, setPublic]    = useState(true)
  const [showEmail, setShowEmail]     = useState(false)
  const [twoFA, setTwoFA]             = useState(false)
  const [lang, setLang]               = useState('fr')
  const [timezone, setTimezone]       = useState('Europe/Paris')

  const save = () => notifApi.success({ message: 'Paramètres sauvegardés !', placement: 'bottomRight' })

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Paramètres du compte</div>
            <h1 className={s.pageTitle}>Paramètres du <em>compte</em></h1>
            <p className={s.pageSubtitle}>Gérez vos préférences, notifications et la confidentialité de votre compte.</p>
          </div>
        </motion.div>

        {/* ── Notifications ── */}
        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><BellOutlined /></span>Notifications</div>
          </div>
          <div className={`${s.cardBody} ${ls.rowList}`}>
            <Row label="Emails de résumé hebdomadaire" desc="Recevoir un résumé de l'activité de votre portfolio">
              <Switch checked={emailNotif} onChange={setEmailNotif} />
            </Row>
            <Row label="Notifications de nouveaux projets" desc="Alertes lors de la publication d'un projet">
              <Switch checked={projectNotif} onChange={setProjNotif} />
            </Row>
            <Row label="Newsletter & conseils" desc="Trucs et astuces pour améliorer votre portfolio">
              <Switch checked={newsletter} onChange={setNewsletter} />
            </Row>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Confidentialité ── */}
        <motion.div className={s.card} {...fadeUp(0.11)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><EyeOutlined /></span>Confidentialité</div>
          </div>
          <div className={`${s.cardBody} ${ls.rowList}`}>
            <Row label="Profil public" desc="Votre portfolio est visible par tout le monde">
              <Switch checked={profilePublic} onChange={setPublic} checkedChildren="Public" unCheckedChildren="Privé" />
            </Row>
            <Row label="Afficher l'email sur le profil" desc="Les visiteurs pourront voir votre adresse email">
              <Switch checked={showEmail} onChange={setShowEmail} />
            </Row>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Sécurité ── */}
        <motion.div className={s.card} {...fadeUp(0.14)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><SafetyOutlined /></span>Sécurité</div>
          </div>
          <div className={`${s.cardBody} ${ls.rowList}`}>
            <Row label="Double authentification (2FA)" desc="Sécurisez votre compte avec une vérification supplémentaire">
              <Switch checked={twoFA} onChange={setTwoFA} />
            </Row>
            <Row label="Sessions actives" desc="Gérez les appareils connectés à votre compte">
              <Button size="small" icon={<LockOutlined />}
                onClick={() => notifApi.info({ message: '1 session active (ce navigateur)', placement: 'bottomRight' })}>
                Voir les sessions
              </Button>
            </Row>
          </div>
        </motion.div>

        {/* ── Langue & région ── */}
        <motion.div className={s.card} {...fadeUp(0.17)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><GlobalOutlined /></span>Langue & région</div>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Langue de l'interface</label>
                <Select value={lang} onChange={setLang} style={{ width: '100%' }}>
                  <Option value="fr">🇫🇷 Français</Option>
                  <Option value="en">🇬🇧 English</Option>
                  <Option value="es">🇪🇸 Español</Option>
                </Select>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Fuseau horaire</label>
                <Select value={timezone} onChange={setTimezone} style={{ width: '100%' }}>
                  {['Europe/Paris','America/New_York','America/Los_Angeles','Asia/Tokyo'].map(tz => (
                    <Option key={tz} value={tz}>{tz}</Option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className={s.saveBar}><Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button></div>
        </motion.div>

        {/* ── Zone de danger ── */}
        <motion.div className={`${s.card} ${ls.dangerCard}`} {...fadeUp(0.2)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle} style={{ color: '#f87171' }}><span className={s.cardIcon} style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}><DeleteOutlined /></span>Zone de danger</div>
          </div>
          <div className={`${s.cardBody} ${ls.rowList}`}>
            <Row label="Exporter mes données" desc="Télécharger une copie complète de vos données">
              <Button icon={<DownloadOutlined />}
                onClick={() => notifApi.info({ message: 'Export en cours de préparation...', placement: 'bottomRight' })}>
                Exporter
              </Button>
            </Row>
            <Row label="Supprimer le compte" desc="Action irréversible — toutes vos données seront effacées">
              <Popconfirm title="Supprimer définitivement votre compte ?" okText="Supprimer" cancelText="Annuler"
                okButtonProps={{ danger: true }}
                onConfirm={() => notifApi.error({ message: 'Compte supprimé (demo)', placement: 'bottomRight' })}>
                <Button danger icon={<DeleteOutlined />}>Supprimer</Button>
              </Popconfirm>
            </Row>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
