import React, { createContext, useContext, useEffect, useState } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import api from '../services/api'
import {ProjectService, ProfileService} from '../services/index'
import PortfolioNavbar from '../pages/portfolio/PortfolioNavbar'
import styles from './PortfolioLayout.module.css'
import EmailVerificationBanner from '../components/EmailVerificationBanner/EmailVerificationBanner'

/* ── Context partagé entre toutes les sous-pages ── */
const PortfolioContext = createContext(null)
export const usePortfolio = () => useContext(PortfolioContext)

/**
 * PortfolioLayout — layout complet du portfolio public
 * Charge le profil une seule fois, le partage via Context
 * à toutes les sous-routes : /, /projets, /a-propos, /competences, /contact
 */
export default function PortfolioLayout() {
  const { username }              = useParams()
  const navigate                  = useNavigate()
  const [profile, setProfile]     = useState(null)
  const [projects, setProjects]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [notFound, setNotFound]   = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          ProfileService.publicProfile(username),
          ProjectService.publicList(username),
          
        ])
        setProfile(profileRes.data)
        setProjects(projectsRes.data ?? [])
        console.log("les proojets ==>", projectsRes.data)
      } catch (err) {
        if (err.response?.status === 404) setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [username])

  if (loading) return (
    <div className={styles.center}><Spin size="large" /></div>
  )

  if (notFound) return (
    <div className={styles.notFound}>
      <span className={styles.notFoundEmoji}>🔍</span>
      <h2>Portfolio introuvable</h2>
      <p>Le profil <strong>@{username}</strong> n'existe pas ou est privé.</p>
      <button className={styles.btnBack} onClick={() => navigate('/')}>
        ← Retour à l'accueil
      </button>
    </div>
  )

  return (
    <PortfolioContext.Provider value={{ profile, projects, username, loading }}>
      <div className={styles.root}>
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
