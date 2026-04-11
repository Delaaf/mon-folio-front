import React from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button, Avatar } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import styles from './PortfolioNavbar.module.css'

/**
 * PortfolioNavbar — navbar publique du portfolio d'un utilisateur
 * Pas de dropdown backoffice. Si le visiteur EST le propriétaire,
 * on affiche un lien "Modifier" vers son dashboard.
 */
const PortfolioNavbar = ({ profile }) => {
  const { username }            = useParams()
  const { user, isAuthenticated } = useAuth()
  const isOwner = isAuthenticated && user?.username === username

  const base = `/portfolio/${username}`

  const NAV_LINKS = [
    { label: 'Accueil',   to: base },
    { label: 'Projets',   to: `${base}/projets`    },
    { label: 'À propos',  to: `${base}/a-propos`   },
    { label: 'Contact',   to: `${base}/contact`    },
  ]

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Logo / nom du portfolio */}
      <NavLink to={base} className={styles.logo}>
        {profile?.avatar
          ? <img src={profile.avatar} alt={profile.name} className={styles.logoAvatar} />
          : <div className={styles.logoIcon}><CodeOutlined /></div>
        }
        <span>{profile?.name ?? 'Portfolio'}</span>
      </NavLink>

      {/* Nav links */}
      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={to === base}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right */}
      <div className={styles.right}>
        {isOwner ? (
          <Button type="primary" className={styles.btnEdit}
            href="/dashboard">
            ✏️ Modifier mon portfolio
          </Button>
        ) : (
          <Button type="primary" className={styles.btnHire}
            href={`/portfolio/${username}/contact`}>
            Me recruter
          </Button>
        )}
      </div>
    </motion.nav>
  )
}

export default PortfolioNavbar
