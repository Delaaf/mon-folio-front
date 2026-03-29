import React from 'react'
import { NavLink } from "react-router-dom";
import { Button, Avatar, Tooltip, Dropdown  } from 'antd'
import { CodeOutlined, PlusOutlined, UserOutlined, SettingOutlined, LogoutOutlined, EditOutlined, ProjectOutlined, PoweroffOutlined, ToolOutlined, GoogleOutlined, ManOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import styles from './Navbar.module.css'



const NAV_LINKS = ["Accueil", 'Projects', 'Resume', 'About', 'Contact']

/**
 * Navbar — barre de navigation sticky
 * @param {string}   activePage   — lien actif
 * @param {Function} onAddProject — ouvre la modale de création
 */
const Navbar = ({ activePage = 'Projects', onAddProject }) => {

  const handleLogout= ()=>{
    console.log("Déconnexion"); 
  }

  const menuItems = [
  {
    key: "infos",
    label: <NavLink to="/mes-informations">Mes informations</NavLink>,
    icon: <UserOutlined />,
  },
  {
    key: "portfolio",
    label: <NavLink to="/modifier-mon-portfolio">Modifier mon portfolio</NavLink>,
    icon: <EditOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "projets",
    label:<NavLink to="/gerer-mes-projets">Gérer mes projets</NavLink>,
    icon: <ProjectOutlined />,
  },
   {
    key: "competences",
    label: <NavLink to="/gerer-mes-competences">Gérer mes compétences</NavLink>,
    icon: <ManOutlined />,
  },
   {
    key: "apropos",
    label: <NavLink to="/gerer-autres">Gérer autres</NavLink>,
    icon: <EditOutlined />,
  },
  {
    type: "divider",
  },
   {
    key: "parametres",
    label: <NavLink to="/parametres-du-compte">Paramètres du compte</NavLink>,
    icon: <SettingOutlined />,
  },
  {
    type: "divider",
  },
   {
    key: "aide",
    label: <NavLink to="/aide-et-support">Aide & support</NavLink>,
    icon: <GoogleOutlined />,
  },
   {
    key: "deconnexion",
    label: <span onClick={handleLogout}>Déconnexion</span>,
    icon: <LogoutOutlined />,
    danger:true
  },
];
  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Logo */}
      <NavLink to="/" className={styles.logo}>
        <div className={styles.logoIcon}>
          <CodeOutlined />
        </div>
        <span>MonFolio</span>
      </NavLink>

      {/* Nav links */}
      <ul className={styles.links}>
        {NAV_LINKS.map((link) => (
          <li key={link}>
             <NavLink
         to={link === "Accueil" ? "/" : `/${link.toLowerCase()}`}
         className={({ isActive }) =>
           `${styles.link} ${isActive ? styles.active : ""}`
         }
       >
         {link}
       </NavLink>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className={styles.right}>

        <Button
          type="primary"
          className={styles.btnHire}
          href="mailto:hello@devportfolio.com"
        >
          Hire Me
        </Button>

        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
        <Avatar
          className={styles.avatar}
          src="https://i.pravatar.cc/150?img=3"
          style={{ cursor: "pointer" }}
        />
      </Dropdown>
      </div>
    </motion.nav>
  )
}

export default Navbar
