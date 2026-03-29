import React, { useState } from 'react'
import { Button, Switch, Select, Slider, notification, ColorPicker, Radio, Tooltip } from 'antd'
import {
  BgColorsOutlined, FontSizeOutlined, LayoutOutlined,
  EyeOutlined, SaveOutlined, ReloadOutlined, AppstoreOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import s from './backoffice.module.css'
import ls from './ModificationPortfolio.module.css'

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

const PRESETS = [
  { name: 'Bleu Tech',    accent: '#4f8eff', bg: '#0a0a0f' },
  { name: 'Violet Pro',   accent: '#8b5cf6', bg: '#08080f' },
  { name: 'Émeraude',     accent: '#10b981', bg: '#050f0a' },
  { name: 'Corail Fire',  accent: '#f97316', bg: '#0f0805' },
  { name: 'Rose Neon',    accent: '#ec4899', bg: '#0f050a' },
  { name: 'Cyan Frost',   accent: '#06b6d4', bg: '#050e0f' },
]

const FONTS = ['Syne', 'Space Grotesk', 'DM Sans', 'Cabinet Grotesk', 'Clash Display']
const LAYOUTS = ['Grid 3 colonnes', 'Grid 2 colonnes', 'Liste', 'Masonry']

export default function ModificationPortfolio() {
  const [notifApi, notifCtx] = notification.useNotification()
  const [preset, setPreset]  = useState(0)
  const [accent, setAccent]  = useState('#4f8eff')
  const [font, setFont]       = useState('Syne')
  const [layout, setLayout]   = useState('Grid 3 colonnes')
  const [radius, setRadius]   = useState(14)
  const [animations, setAnim] = useState(true)
  const [darkMode, setDark]   = useState(true)
  const [showBio, setShowBio] = useState(true)
  const [showStack, setShowStack] = useState(true)
  const [showAvail, setShowAvail] = useState(true)

  const applyPreset = (i) => {
    setPreset(i)
    setAccent(PRESETS[i].accent)
    notifApi.success({ message: `Thème "${PRESETS[i].name}" appliqué`, placement: 'bottomRight', duration: 2 })
  }

  const save = async () => {
    notifApi.success({ message: 'Configuration du portfolio sauvegardée !', placement: 'bottomRight', duration: 3 })
  }

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Modifier mon portfolio</div>
            <h1 className={s.pageTitle}>Modifier mon <em>portfolio</em></h1>
            <p className={s.pageSubtitle}>Personnalisez l'apparence et les sections affichées sur votre portfolio public.</p>
          </div>
          <Button icon={<EyeOutlined />} onClick={() => notifApi.info({ message: 'Aperçu en cours de développement', placement: 'bottomRight' })}>
            Aperçu
          </Button>
        </motion.div>

        {/* ── Thèmes prédéfinis ── */}
        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><BgColorsOutlined /></span>Thèmes prédéfinis</div>
          </div>
          <div className={s.cardBody}>
            <div className={ls.presetGrid}>
              {PRESETS.map((p, i) => (
                <button key={p.name} className={`${ls.presetCard} ${preset === i ? ls.presetActive : ''}`}
                  onClick={() => applyPreset(i)}>
                  <div className={ls.presetPreview} style={{ background: p.bg }}>
                    <div className={ls.presetDot} style={{ background: p.accent }} />
                  </div>
                  <span className={ls.presetName}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Couleurs personnalisées ── */}
        <motion.div className={s.card} {...fadeUp(0.11)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><BgColorsOutlined /></span>Couleurs personnalisées</div>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Couleur d'accentuation</label>
                <div className={ls.colorRow}>
                  <ColorPicker value={accent} onChange={(c) => setAccent(c.toHexString())} showText />
                  <div className={ls.colorPreview} style={{ background: accent }} />
                </div>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Mode d'affichage</label>
                <Radio.Group value={darkMode ? 'dark' : 'light'} onChange={e => setDark(e.target.value === 'dark')} buttonStyle="solid">
                  <Radio.Button value="dark">🌙 Sombre</Radio.Button>
                  <Radio.Button value="light">☀️ Clair</Radio.Button>
                </Radio.Group>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Typographie & Layout ── */}
        <motion.div className={s.card} {...fadeUp(0.14)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><FontSizeOutlined /></span>Typographie & Mise en page</div>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Police d'affichage</label>
                <Select value={font} onChange={setFont} style={{ width: '100%' }}
                  options={FONTS.map(f => ({ value: f, label: f }))} />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Disposition des projets</label>
                <Select value={layout} onChange={setLayout} style={{ width: '100%' }}
                  options={LAYOUTS.map(l => ({ value: l, label: l }))} />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Arrondi des cartes — {radius}px</label>
                <Slider min={0} max={28} step={2} value={radius} onChange={setRadius}
                  tooltip={{ formatter: v => `${v}px` }} />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Animations</label>
                <Switch checked={animations} onChange={setAnim}
                  checkedChildren="Activées" unCheckedChildren="Désactivées" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Sections visibles ── */}
        <motion.div className={s.card} {...fadeUp(0.17)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><LayoutOutlined /></span>Sections affichées</div>
          </div>
          <div className={s.cardBody}>
            <div className={ls.toggleList}>
              {[
                { label: 'Bio / À propos',            val: showBio,   set: setShowBio   },
                { label: 'Tech Stack',                 val: showStack, set: setShowStack },
                { label: 'Badge "Disponible"',         val: showAvail, set: setShowAvail },
              ].map(({ label, val, set }) => (
                <div key={label} className={ls.toggleRow}>
                  <div>
                    <div className={ls.toggleLabel}>{label}</div>
                  </div>
                  <Switch checked={val} onChange={set} />
                </div>
              ))}
            </div>
          </div>
          <div className={s.saveBar}>
            <Button icon={<ReloadOutlined />} onClick={() => notifApi.info({ message: 'Réinitialisé', placement: 'bottomRight' })}>
              Réinitialiser
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={save}>Sauvegarder</Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
