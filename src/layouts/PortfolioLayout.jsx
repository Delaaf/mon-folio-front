import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { ProjectService, ProfileService, PortfolioService } from '../services/index'
import PortfolioNavbar from '../pages/portfolio/PortfolioNavbar'
import styles from './PortfolioLayout.module.css'
import EmailVerificationBanner from '../components/EmailVerificationBanner/EmailVerificationBanner'

const PortfolioContext = createContext(null)
export const usePortfolio = () => useContext(PortfolioContext)

// Fonts disponibles → chargées dynamiquement via Google Fonts
const FONT_URLS = {
  'Syne':             'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&display=swap',
  'Space Grotesk':    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  'DM Sans':          'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  'Cabinet Grotesk':  'https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800&display=swap',
  'Inter':            'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
}

// Applique les settings comme variables CSS sur :root du portfolio
function applyTheme(settings) {
  if (!settings) return

  const root = document.documentElement

  // Couleurs
  root.style.setProperty('--accent',      settings.accent_color     ?? '#4f8eff')
  root.style.setProperty('--bg',          settings.background_color ?? '#0a0a0f')
  root.style.setProperty('--font-display', `"${settings.font_display ?? 'Syne'}", system-ui, sans-serif`)

  // Dériver automatiquement les couleurs de text/border depuis accent + bg
  root.style.setProperty('--accent-glow',    hexToRgba(settings.accent_color ?? '#4f8eff', 0.12))
  root.style.setProperty('--accent-border',  hexToRgba(settings.accent_color ?? '#4f8eff', 0.3))

  // Border radius
  const r = settings.border_radius ?? 14
  root.style.setProperty('--radius',      `${r}px`)
  root.style.setProperty('--radius-sm',   `${Math.max(0, r - 4)}px`)
  root.style.setProperty('--radius-lg',   `${r + 6}px`)

  // Mode clair/sombre
  if (settings.dark_mode === false) {
    root.setAttribute('data-theme', 'light')
  } else {
    root.setAttribute('data-theme', 'dark')
  }

  // Charger la font dynamiquement
  const fontName = settings.font_display ?? 'Syne'
  const fontUrl  = FONT_URLS[fontName]
  if (fontUrl) {
    const id = `portfolio-font-${fontName.replace(/\s/g, '-')}`
    if (!document.getElementById(id)) {
      const link    = document.createElement('link')
      link.id       = id
      link.rel      = 'stylesheet'
      link.href     = fontUrl
      document.head.appendChild(link)
    }
  }
}

// Helper hex → rgba
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export default function PortfolioLayout() {
  const { username }              = useParams()
  const navigate                  = useNavigate()
  const [profile, setProfile]     = useState(null)
  const [projects, setProjects]   = useState([])
  const [settings, setSettings]   = useState(null)
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          ProfileService.publicProfile(username),
          ProjectService.publicList(username),
        ])

        const profileData  = profileRes.data
        const projectsData = projectsRes.data ?? []

        setProfile(profileData)
        setProjects(projectsData)

        // Applique le thème depuis portfolioSettings du profil
        const s = profileData?.portfolio_settings ?? profileData?.portfolioSettings ?? null
        if (s) {
          setSettings(s)
          applyTheme(s)
        }
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()

    // Nettoyage : retire les CSS vars au démontage (retour au dashboard)
    return () => {
      const root = document.documentElement
      ;['--accent','--bg','--font-display','--accent-glow','--accent-border',
        '--radius','--radius-sm','--radius-lg'].forEach(v => root.style.removeProperty(v))
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

  return (
    <PortfolioContext.Provider value={{ profile, projects, settings, username, loading }}>
      <div
        className={styles.root}
        style={{
          '--accent':       settings?.accent_color     ?? '#4f8eff',
          '--bg':           settings?.background_color ?? '#0a0a0f',
          '--radius':       `${settings?.border_radius ?? 14}px`,
          '--font-display': `"${settings?.font_display ?? 'Syne'}", system-ui, sans-serif`,
        }}
      >
        <PortfolioNavbar profile={profile} />
        <EmailVerificationBanner />
        <main className={styles.main}>
          <Outlet />
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
