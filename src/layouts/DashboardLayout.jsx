import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, Tooltip, notification } from 'antd'
import {
  LayoutDashboard, FolderOpen, Wrench, Layers,
  Settings, HelpCircle, LogOut, ChevronLeft,
  ExternalLink, Bell, Search, Menu, X,
  User, Palette, Star, Globe,
} from 'lucide-react'
import { CodeOutlined } from '@ant-design/icons'
import { useAuth } from '../contexts/AuthContext'
import styles from './DashboardLayout.module.css'

/* ── NAV STRUCTURE ──────────────────────────── */
const NAV = [
  {
    group: 'Principal',
    items: [
      { to: '/dashboard',              icon: LayoutDashboard, label: 'Tableau de bord' },
    ],
  },
  {
    group: 'Mon Portfolio',
    items: [
      { to: '/dashboard/mes-informations',       icon: User,       label: 'Mes informations'      },
      { to: '/dashboard/modifier-mon-portfolio', icon: Palette,    label: 'Personnalisation'       },
      { to: '/dashboard/gerer-mes-projets',      icon: FolderOpen, label: 'Projets'               },
      { to: '/dashboard/gerer-mes-competences',  icon: Star,       label: 'Compétences'           },
      { to: '/dashboard/gerer-autres',           icon: Layers,     label: 'Autres'                },
    ],
  },
  {
    group: 'Compte',
    items: [
      { to: '/dashboard/parametres-du-compte',   icon: Settings,   label: 'Paramètres'            },
      { to: '/dashboard/aide-et-support',        icon: HelpCircle, label: 'Aide & support'        },
    ],
  },
]

/* ── SIDEBAR ────────────────────────────────── */
function Sidebar({ collapsed, onToggle, mobile, onMobileClose }) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const location         = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/connexion')
  }

  return (
    <>
      {/* Overlay mobile */}
      {mobile && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onMobileClose}
        />
      )}

      <motion.aside
        className={`${styles.sidebar} ${mobile ? styles.sidebarMobile : ''}`}
        animate={{ width: mobile ? 260 : collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>

        {/* Header */}
        <div className={styles.sidebarHead}>
          <AnimatePresence mode="wait">
            {(!collapsed || mobile) && (
              <motion.div className={styles.brand}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18 }}>
                <div className={styles.brandIcon}><CodeOutlined /></div>
                <span className={styles.brandName}>MonFolio</span>
              </motion.div>
            )}
          </AnimatePresence>

          {mobile ? (
            <button className={styles.collapseBtn} onClick={onMobileClose}>
              <X size={16} />
            </button>
          ) : (
            <button className={styles.collapseBtn} onClick={onToggle}>
              <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronLeft size={16} />
              </motion.div>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV.map(group => (
            <div key={group.group} className={styles.navGroup}>
              <AnimatePresence mode="wait">
                {(!collapsed || mobile) && (
                  <motion.div className={styles.navGroupLabel}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    {group.group}
                  </motion.div>
                )}
              </AnimatePresence>

              {group.items.map(({ to, icon: Icon, label }) => {
                const active = location.pathname === to
                return (
                  <Tooltip
                    key={to}
                    title={collapsed && !mobile ? label : ''}
                    placement="right"
                    mouseEnterDelay={0}>
                    <NavLink to={to} className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                      onClick={mobile ? onMobileClose : undefined}>
                      <span className={styles.navIcon}><Icon size={17} /></span>
                      <AnimatePresence mode="wait">
                        {(!collapsed || mobile) && (
                          <motion.span className={styles.navLabel}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.15 }}>
                            {label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {active && (
                        <motion.span className={styles.navActiveDot}
                          layoutId="activeDot" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                      )}
                    </NavLink>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer — profil + actions */}
        <div className={styles.sidebarFoot}>

          {/* Voir mon portfolio */}
          <AnimatePresence mode="wait">
            {(!collapsed || mobile) && (
              <motion.a
                href={`/public/${user?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.portfolioLink}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Globe size={14} />
                <span>Voir mon portfolio</span>
                <ExternalLink size={12} className={styles.extIcon} />
              </motion.a>
            )}
          </AnimatePresence>

          <div className={styles.sidebarDivider} />

          {/* User card */}
          <div className={styles.userCard}>
            <Avatar
              src={user?.avatar}
              size={34}
              className={styles.userAvatar}
              style={{ background: '#4f8eff', fontWeight: 700, fontSize: 13 }}>
              {user?.prenom?.[0]?.toUpperCase()}
            </Avatar>

            <AnimatePresence mode="wait">
              {(!collapsed || mobile) && (
                <motion.div className={styles.userInfo}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}>
                  <div className={styles.userName}>
                    {user?.prenom} {user?.nom}
                  </div>
                  <div className={styles.userEmail}>{user?.email}</div>
                </motion.div>
              )}
            </AnimatePresence>

            <Tooltip title="Déconnexion" placement="right">
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <LogOut size={15} />
              </button>
            </Tooltip>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

/* ── TOPBAR ─────────────────────────────────── */
function Topbar({ onMobileOpen, pageTitle }) {
  const { user } = useAuth()

  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <button className={styles.mobileMenuBtn} onClick={onMobileOpen}>
          <Menu size={20} />
        </button>
        <div className={styles.topbarTitle}>{pageTitle}</div>
      </div>

      <div className={styles.topbarRight}>
        <button className={styles.topbarAction}>
          <Search size={17} />
        </button>
        <button className={styles.topbarAction}>
          <Bell size={17} />
          <span className={styles.bellDot} />
        </button>
        <div className={styles.topbarDivider} />
        <Avatar
          src={user?.avatar}
          size={32}
          style={{ background: '#4f8eff', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
          {user?.prenom?.[0]?.toUpperCase()}
        </Avatar>
      </div>
    </header>
  )
}

/* ── PAGE TITLE MAP ─────────────────────────── */
const PAGE_TITLES = {
  '/dashboard':              'Tableau de bord',
  '/dashboard/mes-informations':       'Mes informations',
  '/dashboard/modifier-mon-portfolio': 'Personnalisation du portfolio',
  '/dashboard/gerer-mes-projets':      'Gestion des projets',
  '/dashboard/gerer-mes-competences':  'Gestion des compétences',
  '/dashboard/gerer-autres':           'Autres informations',
  '/dashboard/parametres-du-compte':   'Paramètres du compte',
  '/dashboard/aide-et-support':        'Aide & support',
}

/* ── LAYOUT PRINCIPAL ───────────────────────── */
export default function DashboardLayout() {
  const location               = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile]   = useState(window.innerWidth < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard'

  return (
    <div className={`${styles.root}`}>

      {/* Sidebar desktop */}
      {!isMobile && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />
      )}

      {/* Sidebar mobile (drawer) */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <Sidebar
            mobile
            onMobileClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={styles.main}>
        <Topbar
          onMobileOpen={() => setMobileOpen(true)}
          pageTitle={pageTitle}
        />

        <motion.div
          key={location.pathname}
          className={styles.content}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}