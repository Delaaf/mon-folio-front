import React, { useState, useEffect } from 'react'
import { Button, Switch, Select, Slider, notification, ColorPicker, Radio, Spin } from 'antd'
import {
  BgColorsOutlined, FontSizeOutlined, LayoutOutlined,
  EyeOutlined, SaveOutlined, ReloadOutlined,
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { PortfolioService } from '../../services/index'
import { useAuth } from '../../contexts/AuthContext'
import s from './backoffice.module.css'
import ls from './ModificationPortfolio.module.css'

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay: d, ease: [0.22, 1, 0.36, 1] },
})

const PRESETS = [
  { name: 'Bleu Tech',   accent: '#4f8eff', bg: '#0a0a0f', preset: 'blue_tech'   },
  { name: 'Violet Pro',  accent: '#8b5cf6', bg: '#08080f', preset: 'violet_pro'  },
  { name: 'Émeraude',    accent: '#10b981', bg: '#050f0a', preset: 'emerald'      },
  { name: 'Corail Fire', accent: '#f97316', bg: '#0f0805', preset: 'coral_fire'  },
  { name: 'Rose Neon',   accent: '#ec4899', bg: '#0f050a', preset: 'rose_neon'   },
  { name: 'Cyan Frost',  accent: '#06b6d4', bg: '#050e0f', preset: 'cyan_frost'  },
]

const FONTS   = ['Syne', 'Space Grotesk', 'DM Sans', 'Cabinet Grotesk', 'Inter']
const LAYOUTS = ['grid_3', 'grid_2', 'list']
const LAYOUT_LABELS = { grid_3: 'Grid 3 colonnes', grid_2: 'Grid 2 colonnes', list: 'Liste' }

// Valeurs par défaut si aucun settings en base
const DEFAULTS = {
  accent_color:            '#4f8eff',
  background_color:        '#0a0a0f',
  font_display:            'Syne',
  layout:                  'grid_3',
  border_radius:           14,
  animations_enabled:      true,
  dark_mode:               true,
  show_bio:                true,
  show_tech_stack:         true,
  show_availability_badge: true,
  theme_preset:            'blue_tech',
}

export default function ModificationPortfolio() {
  const { user }             = useAuth()
  const [notifApi, notifCtx] = notification.useNotification()
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)

  // Settings state
  const [accentColor, setAccent]  = useState(DEFAULTS.accent_color)
  const [bgColor, setBg]          = useState(DEFAULTS.background_color)
  const [font, setFont]           = useState(DEFAULTS.font_display)
  const [layout, setLayout]       = useState(DEFAULTS.layout)
  const [radius, setRadius]       = useState(DEFAULTS.border_radius)
  const [animations, setAnim]     = useState(DEFAULTS.animations_enabled)
  const [darkMode, setDark]       = useState(DEFAULTS.dark_mode)
  const [showBio, setShowBio]     = useState(DEFAULTS.show_bio)
  const [showStack, setShowStack] = useState(DEFAULTS.show_tech_stack)
  const [showAvail, setShowAvail] = useState(DEFAULTS.show_availability_badge)
  const [activePreset, setActivePreset] = useState('blue_tech')

  // Charge les settings depuis l'API
  useEffect(() => {
    const load = async () => {
      try {
        const response = await PortfolioService.getSettings()
        // La réponse est : { data: { accent_color, ... } }
        // PortfolioService fait déjà `const { data } = await api.get(...); return data`
        // donc response = { data: { accent_color, ... } }
        const d = response  // ← le vrai objet settings
      
        setAccent(d.accent_color                ?? DEFAULTS.accent_color)
        setBg(d.background_color                ?? DEFAULTS.background_color)
        setFont(d.font_display                  ?? DEFAULTS.font_display)
        setLayout(d.layout                      ?? DEFAULTS.layout)
        setRadius(d.border_radius               ?? DEFAULTS.border_radius)
        setAnim(d.animations_enabled            ?? DEFAULTS.animations_enabled)
        setDark(d.dark_mode                     ?? DEFAULTS.dark_mode)
        setShowBio(d.show_bio                   ?? DEFAULTS.show_bio)
        setShowStack(d.show_tech_stack          ?? DEFAULTS.show_tech_stack)
        setShowAvail(d.show_availability_badge  ?? DEFAULTS.show_availability_badge)
        setActivePreset(d.theme_preset          ?? DEFAULTS.theme_preset)
      } catch (err) {
        console.error(err)
        notifApi.error({ message: 'Erreur chargement des paramètres.', placement:    'bottomRight' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const applyPreset = (p) => {
    setActivePreset(p.preset)
    setAccent(p.accent)
    setBg(p.bg)
    notifApi.success({ message: `Thème "${p.name}" appliqué`, placement: 'bottomRight', duration: 2 })
  }

  const reset = () => {
    setAccent(DEFAULTS.accent_color)
    setBg(DEFAULTS.background_color)
    setFont(DEFAULTS.font_display)
    setLayout(DEFAULTS.layout)
    setRadius(DEFAULTS.border_radius)
    setAnim(DEFAULTS.animations_enabled)
    setDark(DEFAULTS.dark_mode)
    setShowBio(DEFAULTS.show_bio)
    setShowStack(DEFAULTS.show_tech_stack)
    setShowAvail(DEFAULTS.show_availability_badge)
    setActivePreset(DEFAULTS.theme_preset)
    notifApi.info({ message: 'Paramètres réinitialisés. Veuillez sauvegarder !', placement: 'bottomRight' })
  }

  const save = async () => {
    setSaving(true)
    try {
      await PortfolioService.updateSettings({
        accent_color:            accentColor,
        background_color:        bgColor,
        font_display:            font,
        layout,
        border_radius:           radius,
        animations_enabled:      animations,
        dark_mode:               darkMode,
        show_bio:                showBio,
        show_tech_stack:         showStack,
        show_availability_badge: showAvail,
        theme_preset:            activePreset,
      })
      notifApi.success({ message: '✅ Portfolio mis à jour !', placement: 'bottomRight', duration: 3 })
    } catch {
      notifApi.error({ message: 'Erreur lors de la sauvegarde.', placement: 'bottomRight' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Spin size="large" />
    </div>
  )

  return (
    <div className={s.page}>
      {notifCtx}
      <div className={s.inner}>

        {/* Header */}
        <motion.div className={s.pageHeader} {...fadeUp(0)}>
          <div className={s.titleGroup}>
            <div className={s.breadcrumb}>Dashboard <span>/</span> Modifier mon portfolio</div>
            <h1 className={s.pageTitle}>Modifier mon <em>portfolio</em></h1>
            <p className={s.pageSubtitle}>Personnalisez l'apparence et les sections de votre portfolio public.</p>
          </div>
          <a href={`/public/${user?.username}`} target="_blank" rel="noopener noreferrer">
            <Button icon={<EyeOutlined />}>Voir mon portfolio</Button>
          </a>
        </motion.div>

        {/* ── Thèmes prédéfinis ── */}
        <motion.div className={s.card} {...fadeUp(0.07)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><BgColorsOutlined /></span>Thèmes prédéfinis</div>
          </div>
          <div className={s.cardBody}>
            <div className={ls.presetGrid}>
              {PRESETS.map((p) => (
                <button
                  key={p.preset}
                  className={`${ls.presetCard} ${activePreset === p.preset ? ls.presetActive : ''}`}
                  onClick={() => applyPreset(p)}
                >
                  <div className={ls.presetPreview} style={{ background: p.bg }}>
                    <div className={ls.presetDot} style={{ background: p.accent }} />
                    <div className={ls.presetLines}>
                      <div style={{ background: p.accent, opacity: 0.4 }} />
                      <div style={{ background: p.accent, opacity: 0.2 }} />
                    </div>
                  </div>
                  <span className={ls.presetName}>{p.name}</span>
                  {activePreset === p.preset && <span className={ls.presetCheck}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Couleurs personnalisées ── */}
        <motion.div className={s.card} {...fadeUp(0.11)}>
          <div className={s.cardHeader}>
            <div className={s.cardTitle}><span className={s.cardIcon}><BgColorsOutlined /></span>Couleurs personnalisées</div>
            <span className={ls.overrideHint}>Surcharge le thème sélectionné</span>
          </div>
          <div className={s.cardBody}>
            <div className={s.formGrid}>
              <div className={s.formGroup}>
                <label className={s.label}>Couleur d'accentuation</label>
                <div className={ls.colorRow}>
                  <ColorPicker
                    value={accentColor}
                    onChange={(c) => { setAccent(c.toHexString()); setActivePreset(null) }}
                    showText
                  />
                  <div className={ls.colorSwatch} style={{ background: accentColor }} />
                </div>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Couleur de fond</label>
                <div className={ls.colorRow}>
                  <ColorPicker
                    value={bgColor}
                    onChange={(c) => { setBg(c.toHexString()); setActivePreset(null) }}
                    showText
                  />
                  <div className={ls.colorSwatch} style={{ background: bgColor, border: '1px solid rgba(255,255,255,0.15)' }} />
                </div>
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Mode d'affichage</label>
                <Radio.Group
                  value={darkMode ? 'dark' : 'light'}
                  onChange={e => setDark(e.target.value === 'dark')}
                  buttonStyle="solid"
                >
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
                <Select
                  value={font}
                  onChange={setFont}
                  style={{ width: '100%' }}
                  options={FONTS.map(f => ({ value: f, label: f }))}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Disposition des projets</label>
                <Select
                  value={layout}
                  onChange={setLayout}
                  style={{ width: '100%' }}
                  options={LAYOUTS.map(l => ({ value: l, label: LAYOUT_LABELS[l] }))}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Arrondi des cartes — {radius}px</label>
                <Slider
                  min={0} max={28} step={2}
                  value={radius} onChange={setRadius}
                  tooltip={{ formatter: v => `${v}px` }}
                />
              </div>
              <div className={s.formGroup}>
                <label className={s.label}>Animations de page</label>
                <Switch
                  checked={animations} onChange={setAnim}
                  checkedChildren="Activées" unCheckedChildren="Désactivées"
                />
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
                { label: 'Bio / À propos',       desc: 'Afficher la section biographie',          val: showBio,   set: setShowBio   },
                { label: 'Tech Stack',            desc: 'Afficher les compétences techniques',     val: showStack, set: setShowStack },
                { label: 'Badge "Disponible"',    desc: 'Afficher le badge de disponibilité',      val: showAvail, set: setShowAvail },
              ].map(({ label, desc, val, set }) => (
                <div key={label} className={ls.toggleRow}>
                  <div>
                    <div className={ls.toggleLabel}>{label}</div>
                    <div className={ls.toggleDesc}>{desc}</div>
                  </div>
                  <Switch checked={val} onChange={set} />
                </div>
              ))}
            </div>
          </div>

          <div className={s.saveBar}>
            <Button icon={<ReloadOutlined />} onClick={reset}>Réinitialiser</Button>
            <Button type="primary" icon={<SaveOutlined />} loading={saving} onClick={save}>
              Sauvegarder
            </Button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
