import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectService, ProfileService, PortfolioService } from '../services/index'
import PortfolioNavbar from '../pages/portfolio/PortfolioNavbar'
import styles from './PortfolioLayout.module.css'
import EmailVerificationBanner from '../components/EmailVerificationBanner/EmailVerificationBanner'

const PortfolioContext = createContext(null)
export const usePortfolio = () => useContext(PortfolioContext)

/* ── Applique le thème comme CSS vars ── */
function applyTheme(s) {
  if (!s) return
  const root = document.documentElement
  root.style.setProperty('--accent',        s.accent_color      ?? '#4f8eff')
  root.style.setProperty('--bg-primary',    s.background_color  ?? '#0a0a0f')
  root.style.setProperty('--bg',            s.background_color  ?? '#0a0a0f')
  root.style.setProperty('--accent-glow',   hexRgba(s.accent_color ?? '#4f8eff', 0.12))
  root.style.setProperty('--accent-border', hexRgba(s.accent_color ?? '#4f8eff', 0.3))
  root.style.setProperty('--font-display',  `"${s.font_display ?? 'Syne'}", system-ui, sans-serif`)
  const r = s.border_radius ?? 14
  root.style.setProperty('--radius',    `${r}px`)
  root.style.setProperty('--radius-sm', `${Math.max(0, r - 4)}px`)
  root.style.setProperty('--radius-lg', `${r + 6}px`)
  root.setAttribute('data-theme', s.dark_mode === false ? 'light' : 'dark')
  loadFont(s.font_display ?? 'Syne')
}

const FONTS = {
  'Syne':          'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap',
  'Space Grotesk': 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'DM Sans':       'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  'Inter':         'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
}

function loadFont(name) {
  const url = FONTS[name]
  if (!url) return
  const id = `pf-font-${name.replace(/\s/g, '-')}`
  if (!document.getElementById(id)) {
    const link = Object.assign(document.createElement('link'), { id, rel: 'stylesheet', href: url })
    document.head.appendChild(link)
  }
}

function hexRgba(hex, a) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* ── Variantes de transition de page ── */
function pageVariants(enabled) {
  if (!enabled) return { initial: {}, animate: {}, exit: {} }
  return {
    initial:  { opacity: 0, y: 18 },
    animate:  { opacity: 1, y: 0  },
    exit:     { opacity: 0, y: -10 },
  }
}

export default function PortfolioLayout() {
  const { username }            = useParams()
  const navigate                = useNavigate()
  const location                = useLocation()
  const [profile, setProfile]   = useState(null)
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  const animEnabled = settings?.animations_enabled ?? true

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          ProfileService.publicProfile(username),
          ProjectService.publicList(username),
        ])
        const profileData = profileRes.data
        setProfile(profileData)
        setProjects(projectsRes.data ?? [])

        // Applique le thème
        const s = profileData?.portfolio_settings ?? null
        if (s) { setSettings(s); applyTheme(s) }
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Nettoyage au démontage
    return () => {
      const root = document.documentElement
      ;['--accent','--bg','--bg-primary','--accent-glow','--accent-border',
        '--font-display','--radius','--radius-sm','--radius-lg']
        .forEach(v => root.style.removeProperty(v))
      root.removeAttribute('data-theme')
    }
  }, [username])

  if (loading) return <div className={styles.center}><Spin size="large" /></div>

  if (notFound) return (
    <div className={styles.notFound}>
      <span className={styles.notFoundEmoji}>🔍</span>
      <h2>Portfolio introuvable</h2>
      <p>Le profil <strong>@{username}</strong> n'existe pas ou est privé.</p>
      <button className={styles.btnBack} onClick={() => navigate('/')}>← Retour à l'accueil</button>
    </div>
  )

  const variants = pageVariants(animEnabled)

  return (
    <PortfolioContext.Provider value={{ profile, projects, settings, username, loading }}>
      <div
        className={styles.root}
        style={{
          '--accent':        settings?.accent_color     ?? '#4f8eff',
          '--bg-primary':    settings?.background_color ?? '#0a0a0f',
          '--bg':            settings?.background_color ?? '#0a0a0f',
          '--radius':        `${settings?.border_radius ?? 14}px`,
          '--font-display':  `"${settings?.font_display ?? 'Syne'}", system-ui, sans-serif`,
          '--accent-glow':   settings ? hexRgba(settings.accent_color ?? '#4f8eff', 0.12) : undefined,
          '--accent-border': settings ? hexRgba(settings.accent_color ?? '#4f8eff', 0.3)  : undefined,
        }}>

        <PortfolioNavbar profile={profile} />
        <EmailVerificationBanner />

        <main className={styles.main}>
          {/* ── Transitions de page ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className={styles.footer}>
          <span className={styles.footerCopy}>
            © {new Date().getFullYear()} {profile?.name} · Propulsé par{' '}
            <a href="/" className={styles.footerLink}>MonFolio</a>
          </span>
          <div className={styles.footerLinks}>
            {profile?.github_url   && <a href={profile.github_url}   target="_blank" rel="noopener noreferrer">GitHub</a>}
            {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            {profile?.twitter_url  && <a href={profile.twitter_url}  target="_blank" rel="noopener noreferrer">Twitter</a>}
          </div>
        </footer>
      </div>
    </PortfolioContext.Provider>
  )
}
