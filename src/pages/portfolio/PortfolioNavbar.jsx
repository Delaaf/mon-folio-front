import React, { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button, Avatar } from 'antd'
import { CodeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import styles from './PortfolioNavbar.module.css'
import monfolio_logo from '../../assets/monfolio_logo.png'

/**
 * PortfolioNavbar — navbar publique du portfolio d'un utilisateur
 * Pas de dropdown backoffice. Si le visiteur EST le propriétaire,
 * on affiche un lien "Modifier" vers son dashboard.
 */
const PortfolioNavbar = ({ profile }) => {
  const { username }            = useParams()
  const { user, isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)
  const isOwner = isAuthenticated && user?.username === username

  const base = `/public/${username}`

  const NAV_LINKS = [
    { label: 'Accueil',   path: base },
    { label: 'Projets',   path: `${base}/projets`    },
    { label: 'À propos',  path: `${base}/a-propos`   },
    { label: 'Contact',   path: `${base}/contact`    },
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
          : <div className={styles.logoIcon}> <img src={monfolio_logo} alt="" className={styles.panelLogoImgage} /></div>
        }
        <span>{profile?.name ?? 'Portfolio'}</span>
      </NavLink>

            {/* Nav links */}
                  <ul className={`${styles.links} ${open ? styles.show : ''}`}>
        {NAV_LINKS.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right */}
      <div className={styles.right}>

         {/* Bouton Menu mobile */}
        <div
          className={styles.menuBtn}
          onClick={() => setOpen(!open)}
        >
          Menu
        </div>
        {isOwner ? (
          <Button type="primary" className={styles.btnEdit}
            href="/dashboard">
            Modifier mon portfolio
          </Button>
        ) : (
          <Button type="primary" className={styles.btnHire}
            href={`/public/${username}/contact`}>
            Me recruter
          </Button>
        )}
      </div>
    </motion.nav>
  )
}

export default PortfolioNavbar
