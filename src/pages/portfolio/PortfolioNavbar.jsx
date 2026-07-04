import React, { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { Button } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuOutlined, CloseOutlined } from '@ant-design/icons'
import { useAuth } from '../../contexts/AuthContext'
import { usePortfolio } from '../../layouts/PortfolioLayout'
import monfolio_logo from '../../assets/monfolio_logo.png'
import styles from './PortfolioNavbar.module.css'

const PortfolioNavbar = ({ profile }) => {
  const { username }              = useParams()
  const { user, isAuthenticated } = useAuth()
  const ctx                       = usePortfolio()
  const animEnabled               = ctx?.settings?.animations_enabled
    ?? ctx?.profile?.portfolio_settings?.animations_enabled
    ?? true

  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isOwner = isAuthenticated && user?.username === username
  const base    = `/portfolio/${username}`

  const NAV = [
    { label: 'Accueil',  path: base,                end: true },
    { label: 'Projets',  path: `${base}/projets`          },
    { label: 'À propos', path: `${base}/a-propos`         },
    { label: 'Contact',  path: `${base}/contact`          },
  ]

  // Scroll detection → navbar becomes opaque
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu mobile au resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <motion.nav
        className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}
        initial={animEnabled ? { y: -60, opacity: 0 } : false}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <NavLink to={base} className={styles.logo}>
          {profile?.avatar
            ? <img src={profile.avatar} alt={profile.name} className={styles.logoAvatar} />
            : <div className={styles.logoIcon}><img src={monfolio_logo} alt="" className={styles.logoImg} /></div>
          }
          <span className={styles.logoName}>{profile?.name ?? 'Portfolio'}</span>
        </NavLink>

        {/* Nav links desktop */}
        <ul className={styles.links}>
          {NAV.map((link, i) => (
            <motion.li
              key={link.path}
              initial={animEnabled ? { opacity: 0, y: -8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}>
              <NavLink
                to={link.path}
                end={link.end}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
              >
                {link.label}
              </NavLink>
            </motion.li>
          ))}
        </ul>

        {/* Right */}
        <div className={styles.right}>
          <motion.div
            initial={animEnabled ? { opacity: 0, scale: 0.9 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}>
            {isOwner ? (
              <Button type="primary" className={styles.btnCta} href="/dashboard">
                Modifier mon portfolio
              </Button>
            ) : (
              <Button type="primary" className={styles.btnCta} href={`${base}/contact`}>
                Me recruter
              </Button>
            )}
          </motion.div>

          {/* Burger mobile */}
          <button
            className={styles.burger}
            onClick={() => setOpen(o => !o)}
            aria-label="Menu">
            {open ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </motion.nav>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <div className={styles.mobileHead}>
                <span className={styles.logoName}>{profile?.name}</span>
                <button className={styles.closeBtn} onClick={() => setOpen(false)}>
                  <CloseOutlined />
                </button>
              </div>
              <ul className={styles.mobileLinks}>
                {NAV.map((link, i) => (
                  <motion.li
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <NavLink
                      to={link.path}
                      end={link.end}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                      }>
                      {link.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className={styles.mobileFooter}>
                {isOwner ? (
                  <Button type="primary" block href="/dashboard" onClick={() => setOpen(false)}>
                    Modifier mon portfolio
                  </Button>
                ) : (
                  <Button type="primary" block href={`${base}/contact`} onClick={() => setOpen(false)}>
                    Me recruter
                  </Button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default PortfolioNavbar
