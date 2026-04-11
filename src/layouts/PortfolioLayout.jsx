import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { PortfolioProvider, usePortfolio } from '../contexts/PortfolioContext'
import PortfolioNavbar from '../pages/portfolio/PortfolioNavbar'
import styles from '../pages/portfolio/PortfolioLayout.module.css'

const PortfolioContent = () => {
  const { profile, loading, notFound, username } = usePortfolio()
  const navigate = useNavigate()

  if (loading) {
    return <div className={styles.center}><Spin size="large" /></div>
  }

  if (notFound) {
    return (
      <div className={styles.notFound}>
        <span className={styles.notFoundEmoji}>🔍</span>
        <h2>Portfolio introuvable</h2>
        <p>Le profil <strong>@{username}</strong> n'existe pas.</p>
        <button onClick={() => navigate('/')}>← Retour</button>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <PortfolioNavbar profile={profile} />

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        © {new Date().getFullYear()} {profile?.name}
      </footer>
    </div>
  )
}

export default function PortfolioLayout() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  )
}