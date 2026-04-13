import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Avatar, Dropdown } from 'antd'
import {
  CodeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  EditOutlined,
  ProjectOutlined,
  GoogleOutlined,
  ManOutlined,
  BarsOutlined,
  DashboardOutlined,
  EyeOutlined,
  ThunderboltOutlined,
  EllipsisOutlined,
  CustomerServiceOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Accueil', path: '/accueil' },
  { label: 'Projets', path: '/projets' },
  { label: 'A propos', path: '/a-propos' }, 
  { label: 'Contact', path: '/contact' },
]

/**
 * Navbar — barre de navigation sticky
 * @param {string}   activePage   — lien actif
 * @param {Function} onAddProject — ouvre la modale de création
 */
const Navbar = ({ activePage = 'Projects', onAddProject }) => {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
   const menuItems = [
    {
      key: 'portfolio',
      label: <NavLink to={`/portfolio/${user?.username}`}>Voir mon portfolio</NavLink>,
      icon: <EyeOutlined />,
    },
    { type: 'divider' },
    {
      key: 'infos',
      label: <NavLink to="/mes-informations">Mes informations</NavLink>,
      icon: <UserOutlined />,
    },
    {
      key: 'portfolioEdit',
      label: <NavLink to="/modifier-mon-portfolio">Modifier mon portfolio</NavLink>,
      icon: <EditOutlined />,
    },
    { type: 'divider' },
    {
      key: 'projetsEdit',
      label: <NavLink to="/gerer-mes-projets">Gérer mes projets</NavLink>,
      icon: <ProjectOutlined />,
    },
    {
      key: 'competencesEdit',
      label: <NavLink to="/gerer-mes-competences">Gérer mes compétences</NavLink>,
      icon: <ThunderboltOutlined />,
    },
    {
      key: 'autresEdit',
      label: <NavLink to="/gerer-autres">Gérer autres</NavLink>,
      icon: <EllipsisOutlined />,
    },
    { type: 'divider' },
    {
      key: 'parametres',
      label: <NavLink to="/parametres-du-compte">Paramètres du compte</NavLink>,
      icon: <SettingOutlined />,
    },
    { type: 'divider' },
    {
      key: 'aide',
      label: <NavLink to="/aide-et-support">Aide & support</NavLink>,
      icon: <CustomerServiceOutlined />,
    },
    {
      key: 'deconnexion',
      label: <span onClick={logout}>Déconnexion</span>,
      icon: <LogoutOutlined />,
      danger: true,
    },
  ]

  
  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Logo */}
      <NavLink to="/accueil" className={styles.logo}>
        <div className={styles.logoIcon}>
          <CodeOutlined />
        </div>
        <span>MonFolio</span>
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

      {/* Right actions */}
      <div className={styles.right}>

        {/* Bouton Menu mobile */}
        <div
          className={styles.menuBtn}
          onClick={() => setOpen(!open)}
        >
          Menu
        </div>
        <Button
          type="primary"
          className={styles.btnHire}
          href="mailto:hello@devportfolio.com"
        >
          Me recruter
        </Button>

        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Avatar
            className={styles.avatar}
            src={user?.avatar ?? 'https://i.pravatar.cc/150?img=3'}
            style={{ cursor: 'pointer' }}
          />
        </Dropdown>
      </div>
    </motion.nav>
  )
}

export default Navbar
