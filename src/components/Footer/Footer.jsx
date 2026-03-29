import React from 'react'
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons'
import styles from './Footer.module.css'

const SOCIAL_LINKS = [
  { label: 'Twitter',  icon: <TwitterOutlined  />, href: 'https://twitter.com'  },
  { label: 'GitHub',   icon: <GithubOutlined   />, href: 'https://github.com'   },
  { label: 'LinkedIn', icon: <LinkedinOutlined />, href: 'https://linkedin.com' },
]

const Footer = () => (
  <footer className={styles.footer}>
    <span className={styles.copy}>© 2024 DevPortfolio. All rights reserved.</span>
    <nav className={styles.links} aria-label="Réseaux sociaux">
      {SOCIAL_LINKS.map(({ label, icon, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={label}
        >
          {icon}
          <span>{label}</span>
        </a>
      ))}
    </nav>
  </footer>
)

export default Footer
