import React from 'react'
import { motion } from 'framer-motion'
import { Button } from 'antd'
import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons'

import AvailableBadge from '../components/AvailableBadge'
import HeroCard       from '../components/HeroCard'
import TechStack      from '../components/TechStack'
import { HERO }       from '../data/hero'

import styles from './AccueilPage.module.css'

/* Stagger container pour les lignes du headline */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const lineVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

/**
 * HomePage — page d'accueil du portfolio
 * Layout : Navbar | Hero (left text + right card) | Footer
 */
const AccueilPage = ({ onNavigate }) => {
  return (
    <div className={styles.page}>

      {/* ── Background effects ── */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />
      <div className={styles.bgGrid} />

      {/* ── Hero Section ── */}
      <section className={styles.hero}>

        {/* Left column */}
        <div className={styles.left}>

          {/* Badge disponibilité */}
          <AvailableBadge label={HERO.badge} />

          {/* Headline avec stagger */}
          <motion.h1
            className={styles.headline}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {HERO.headline.map((line, i) => (
              <motion.span
                key={i}
                className={`${styles.headlineLine} ${i === HERO.accentLine ? styles.accent : ''}`}
                variants={lineVariants}
              >
                {line}
              </motion.span>
            ))}
          </motion.h1>

          {/* Description */}
          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}
          >
            {HERO.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62 }}
          >
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
              className={styles.btnPrimary}
              onClick={() => onNavigate?.('projects')}
            >
              {HERO.cta.primary}
            </Button>
            <Button
              size="large"
              icon={<MailOutlined />}
              className={styles.btnSecondary}
            >
              {HERO.cta.secondary}
            </Button>
          </motion.div>

          {/* Tech Stack */}
          <div className={styles.techWrap}>
            <TechStack />
          </div>
        </div>

        {/* Right column */}
        <HeroCard name={HERO.name} role={HERO.role} />
      </section>
    </div>
  )
}

export default AccueilPage
